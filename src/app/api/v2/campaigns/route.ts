import { NextResponse } from 'next/server';
import { Campaign } from '@/types';
import { supabaseService } from '@/lib/supabase/service';
import { MetaGraphApiClient } from '@/lib/meta/graphApi';
import { orchestrator } from '@/agents/orchestrator';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get('pageId') || undefined;

    // Fetch live campaigns from Supabase
    let campaigns = await supabaseService.getCampaigns(pageId);

    // Calculate live summary totals
    const totalSpend = campaigns.reduce((acc, c) => acc + (Number(c.spend) || 0), 0);
    const totalPurchases = campaigns.reduce((acc, c) => acc + (Number(c.purchases) || 0), 0);
    const avgRoas = campaigns.length > 0
      ? Number((campaigns.reduce((acc, c) => acc + (Number(c.roas) || 0), 0) / campaigns.length).toFixed(2))
      : 0;
    const activeCampaignsCount = campaigns.filter(c => c.status === 'ACTIVE').length;

    return NextResponse.json({
      success: true,
      data: campaigns,
      summary: {
        totalSpend,
        totalPurchases,
        avgRoas,
        activeCampaignsCount
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message || 'Failed to fetch campaigns',
      data: [],
      summary: { totalSpend: 0, totalPurchases: 0, avgRoas: 0, activeCampaignsCount: 0 }
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, campaignId, dailyBudget, newCampaign, scalePercent, adAccountId, accessToken } = body;

    // 1. Sync real campaigns from Meta Graph API v21.0
    if (action === 'sync_from_meta') {
      const token = accessToken || process.env.META_SYSTEM_USER_TOKEN;
      if (!token) {
        return NextResponse.json({
          success: false,
          error: 'META_TOKEN_REQUIRED: กรุณาเชื่อมต่อ Meta Access Token ที่ /connect-meta ก่อนซิงค์แคมเปญ'
        }, { status: 400 });
      }

      const client = new MetaGraphApiClient(token);
      let targetAccountId = adAccountId;
      if (!targetAccountId) {
        const accounts = await client.getAdAccounts();
        if (accounts.length === 0) {
          return NextResponse.json({ success: false, error: 'ไม่พบบัญชีโฆษณา (Ad Account) ในบัญชีนี้' }, { status: 404 });
        }
        targetAccountId = accounts[0].id;
      }

      const rawCampaigns = await client.getCampaignsWithInsights(targetAccountId);
      const syncedCampaigns: Campaign[] = rawCampaigns.map(rc => {
        const insights = rc.insights?.data?.[0] || {};
        const spend = Number(insights.spend) || 0;
        
        // Extract purchase conversions
        let purchases = 0;
        if (Array.isArray(insights.actions)) {
          const pAction = insights.actions.find((a: any) => a.action_type === 'purchase' || a.action_type === 'omni_purchase');
          if (pAction) purchases = Number(pAction.value) || 0;
        }

        // Extract purchase ROAS
        let roas = 0;
        if (Array.isArray(insights.purchase_roas)) {
          roas = Number(insights.purchase_roas[0]?.value) || 0;
        }

        const impressions = Number(insights.impressions) || 0;
        const frequency = Number(insights.frequency) || 1.0;
        const ctr = Number(insights.ctr) || 0;
        const cpc = Number(insights.cpc) || 0;
        const costPerPurchase = purchases > 0 ? Number((spend / purchases).toFixed(2)) : 0;

        // Video hook rate calculation: video_30_sec_watched_actions or 3s plays / impressions
        const hookRate = impressions > 0 ? Number(((Number(insights.video_p25_watched_actions?.[0]?.value || 0) / impressions) * 100).toFixed(1)) : 0;
        const holdRate = impressions > 0 ? Number(((Number(insights.video_p100_watched_actions?.[0]?.value || 0) / impressions) * 100).toFixed(1)) : 0;

        const fatigueStatus: Campaign['fatigueStatus'] = frequency > 2.8 && ctr < 1.0 ? 'saturated' : (frequency > 2.2 ? 'warning' : 'fresh');

        return {
          id: rc.id,
          name: rc.name,
          status: rc.status,
          objective: rc.objective || 'OUTCOME_SALES',
          dailyBudget: rc.daily_budget ? Math.round(Number(rc.daily_budget) / 100) : 0,
          spend,
          roas,
          purchases,
          costPerPurchase,
          cpc,
          ctr,
          impressions,
          frequency,
          fatigueStatus,
          hookRate,
          holdRate,
          format: 'Reels 9:16',
          adSetsCount: 1,
          adsCount: 1,
          updatedAt: 'Just synced'
        };
      });

      // Save into Supabase
      for (const camp of syncedCampaigns) {
        await supabaseService.upsertCampaign(camp);
      }

      // Run Swarm 30 agent audit against the newly synced campaigns
      orchestrator.runFullSwarmAudit(syncedCampaigns);
      orchestrator.logMessage('agent-01', 'agent-02', `Meta API sync complete: ${syncedCampaigns.length} campaigns retrieved from account ${targetAccountId}.`, 'task');

      return NextResponse.json({
        success: true,
        message: `ซิงค์สำเร็จ! ดึงข้อมูล ${syncedCampaigns.length} แคมเปญจาก Meta Graph API v21.0 เรียบร้อย`,
        data: syncedCampaigns
      });
    }

    // 2. Create Campaign (Ad Launcher)
    if (action === 'create_campaign' && newCampaign) {
      const campId = `camp_${Date.now()}`;
      const created: Campaign = {
        id: campId,
        name: newCampaign.name,
        status: 'ACTIVE',
        objective: newCampaign.objective || 'OUTCOME_SALES',
        dailyBudget: Number(newCampaign.dailyBudget) || 2500,
        spend: 0,
        roas: 0.0,
        purchases: 0,
        costPerPurchase: 0,
        cpc: 0,
        ctr: 0,
        impressions: 0,
        frequency: 1.0,
        fatigueStatus: 'fresh',
        hookRate: 0,
        holdRate: 0,
        format: newCampaign.format || 'Reels 9:16',
        pageId: newCampaign.pageId,
        pageName: newCampaign.pageName,
        adSetsCount: 1,
        adsCount: 1,
        updatedAt: 'Just now'
      };

      await supabaseService.upsertCampaign(created);
      orchestrator.logMessage('agent-01', 'agent-04', `Ad Launcher launched campaign: "${created.name}" (Daily Budget: ฿${created.dailyBudget})`, 'task');
      orchestrator.updateAgentStatus('agent-04', 'executing', `Launched campaign ${created.name}`);

      return NextResponse.json({ success: true, createdCampaign: created });
    }

    // 3. Toggle Status (Active / Paused)
    if (action === 'toggle_status' && campaignId) {
      const campaigns = await supabaseService.getCampaigns();
      const target = campaigns.find(c => c.id === campaignId);
      if (!target) return NextResponse.json({ success: false, error: 'Campaign not found' }, { status: 404 });

      const nextStatus = target.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
      await supabaseService.updateCampaignStatus(campaignId, nextStatus);

      orchestrator.logMessage('agent-01', 'agent-02', `Switched status of "${target.name}" to ${nextStatus}`, 'task');
      return NextResponse.json({ success: true, campaignId, status: nextStatus });
    }

    // 4. Update Budget
    if (action === 'update_budget' && campaignId && dailyBudget !== undefined) {
      const budgetNum = Number(dailyBudget);
      await supabaseService.updateCampaignBudget(campaignId, budgetNum);
      orchestrator.logMessage('agent-01', 'agent-06', `Updated daily budget of campaign ${campaignId} to ฿${budgetNum}`, 'metric_update');
      return NextResponse.json({ success: true, campaignId, dailyBudget: budgetNum });
    }

    // 5. Scale Budget (+20% Scale Winner)
    if (action === 'scale_budget' && campaignId) {
      const campaigns = await supabaseService.getCampaigns();
      const target = campaigns.find(c => c.id === campaignId);
      if (!target) return NextResponse.json({ success: false, error: 'Campaign not found' }, { status: 404 });

      const factor = 1 + ((Number(scalePercent) || 20) / 100);
      const newBudget = Math.round(target.dailyBudget * factor);
      await supabaseService.updateCampaignBudget(campaignId, newBudget);

      orchestrator.logMessage('agent-01', 'agent-06', `Dynamic Scale +${scalePercent || 20}% applied to "${target.name}": ฿${target.dailyBudget} -> ฿${newBudget}`, 'metric_update');
      return NextResponse.json({ success: true, campaignId, dailyBudget: newBudget });
    }

    // 6. Emergency Kill Switch (Pause Burning Campaign)
    if (action === 'kill_campaign' && campaignId) {
      await supabaseService.updateCampaignStatus(campaignId, 'PAUSED');
      orchestrator.logMessage('agent-01', 'agent-07', `KILL SWITCH ACTIVATED: Paused campaign ${campaignId} to prevent budget loss.`, 'alert');
      return NextResponse.json({ success: true, campaignId, status: 'PAUSED' });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Internal error' }, { status: 500 });
  }
}
