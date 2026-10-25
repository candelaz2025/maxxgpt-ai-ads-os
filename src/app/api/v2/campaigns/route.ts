import { NextResponse } from 'next/server';
import { MOCK_CAMPAIGNS } from '@/data/mockData';
import { Campaign } from '@/types';
import { orchestrator } from '@/agents/orchestrator';

let campaigns: Campaign[] = [...MOCK_CAMPAIGNS];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: campaigns,
    summary: {
      totalSpend: campaigns.reduce((acc, c) => acc + c.spend, 0),
      totalPurchases: campaigns.reduce((acc, c) => acc + c.purchases, 0),
      avgRoas: Number((campaigns.reduce((acc, c) => acc + c.roas, 0) / (campaigns.length || 1)).toFixed(2)),
      activeCampaignsCount: campaigns.filter(c => c.status === 'ACTIVE').length
    }
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, campaignId, dailyBudget, newCampaign, scalePercent } = body;

    if (action === 'create_campaign' && newCampaign) {
      const created: Campaign = {
        id: `camp-${Date.now()}`,
        name: newCampaign.name,
        status: 'ACTIVE',
        objective: newCampaign.objective || 'OUTCOME_SALES',
        dailyBudget: Number(newCampaign.dailyBudget) || 2500,
        spend: 0,
        roas: 0.0,
        purchases: 0,
        costPerPurchase: 0,
        cpc: 3.5,
        ctr: 3.2,
        impressions: 0,
        frequency: 1.0,
        fatigueStatus: 'fresh',
        hookRate: 42.0,
        holdRate: 22.0,
        format: newCampaign.format || 'Reels 9:16',
        pageId: newCampaign.pageId,
        pageName: newCampaign.pageName,
        adSetsCount: 1,
        adsCount: 3,
        updatedAt: 'Just now'
      };
      campaigns.unshift(created);
      orchestrator.logMessage('agent-01', 'agent-04', `Created new Meta Campaign: "${created.name}" (Daily Budget: ฿${created.dailyBudget})`, 'task');
      orchestrator.updateAgentStatus('agent-04', 'executing', `Launched campaign ${created.name}`);
      return NextResponse.json({ success: true, data: campaigns, createdCampaign: created });
    }

    if (action === 'toggle_status') {
      campaigns = campaigns.map(c => {
        if (c.id === campaignId) {
          const nextStatus = c.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
          orchestrator.logMessage('agent-01', 'agent-02', `Mutated campaign status ${c.name} -> ${nextStatus}`, 'task');
          return { ...c, status: nextStatus, updatedAt: 'Just now' };
        }
        return c;
      });
      return NextResponse.json({ success: true, data: campaigns });
    }

    if (action === 'update_budget' && dailyBudget) {
      campaigns = campaigns.map(c => {
        if (c.id === campaignId) {
          return { ...c, dailyBudget: Number(dailyBudget), updatedAt: 'Just now' };
        }
        return c;
      });
      return NextResponse.json({ success: true, data: campaigns });
    }

    if (action === 'scale_budget') {
      const pct = scalePercent || 20;
      campaigns = campaigns.map(c => {
        if (c.id === campaignId) {
          const scaled = Math.round(c.dailyBudget * (1 + pct / 100));
          orchestrator.logMessage('agent-01', 'agent-06', `Scaled budget on winner ${c.name}: ฿${c.dailyBudget} ➔ ฿${scaled} (+${pct}%)`, 'metric_update');
          return { ...c, dailyBudget: scaled, updatedAt: 'Just now' };
        }
        return c;
      });
      return NextResponse.json({ success: true, data: campaigns });
    }

    if (action === 'kill_campaign') {
      campaigns = campaigns.map(c => {
        if (c.id === campaignId) {
          orchestrator.logMessage('agent-01', 'agent-07', `EMERGENCY KILL SWITCH: Paused ${c.name} (Spend: ฿${c.spend})`, 'alert');
          return { ...c, status: 'PAUSED', updatedAt: 'Just now' };
        }
        return c;
      });
      return NextResponse.json({ success: true, data: campaigns });
    }

    if (action === 'delete_campaign') {
      campaigns = campaigns.filter(c => c.id !== campaignId);
      return NextResponse.json({ success: true, data: campaigns });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
