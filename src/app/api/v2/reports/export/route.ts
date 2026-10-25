import { NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabase/service';
import { orchestrator } from '@/agents/orchestrator';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { webhookUrl, dateRange } = body;

    const campaigns = await supabaseService.getCampaigns();
    const targetWebhook = webhookUrl || process.env.GOOGLE_SHEETS_WEBHOOK_URL;

    const payload = {
      timestamp: new Date().toISOString(),
      reportDateRange: dateRange || 'Last 7 Days',
      campaignsCount: campaigns.length,
      totalSpend: campaigns.reduce((acc, c) => acc + c.spend, 0),
      totalPurchases: campaigns.reduce((acc, c) => acc + c.purchases, 0),
      avgRoas: campaigns.length > 0 
        ? Number((campaigns.reduce((acc, c) => acc + c.roas, 0) / campaigns.length).toFixed(2)) 
        : 0,
      campaigns: campaigns.map(c => ({
        id: c.id,
        name: c.name,
        status: c.status,
        dailyBudget: c.dailyBudget,
        spend: c.spend,
        roas: c.roas,
        purchases: c.purchases,
        cpc: c.cpc,
        ctr: c.ctr,
        hookRate: c.hookRate,
        holdRate: c.holdRate,
        fatigueStatus: c.fatigueStatus
      }))
    };

    if (targetWebhook) {
      try {
        const webhookRes = await fetch(targetWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        orchestrator.logMessage('agent-01', 'agent-23', `Successfully synced ${campaigns.length} campaigns to Google Sheets Webhook.`, 'task');
        return NextResponse.json({
          success: true,
          message: `ส่งข้อมูล ${campaigns.length} แคมเปญเข้า Google Sheets เรียบร้อยแล้ว`,
          syncedToWebhook: true
        });
      } catch (err: any) {
        return NextResponse.json({
          success: false,
          error: `Webhook delivery failed: ${err.message}`,
          data: payload
        }, { status: 502 });
      }
    }

    return NextResponse.json({
      success: true,
      message: `เตรียมข้อมูลรายงาน ${campaigns.length} แคมเปญพร้อมส่งออก`,
      data: payload,
      syncedToWebhook: false
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Export error' }, { status: 500 });
  }
}
