import { NextResponse } from 'next/server';
import { supabaseService } from '@/lib/supabase/service';
import { orchestrator } from '@/agents/orchestrator';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tier = searchParams.get('tier') || undefined;

    const leads = await supabaseService.getLeads(tier);

    return NextResponse.json({
      success: true,
      data: leads,
      counts: {
        total: leads.length,
        tierS: leads.filter(l => l.tier === 'Tier S').length,
        tierA: leads.filter(l => l.tier === 'Tier A').length,
        tierB: leads.filter(l => l.tier === 'Tier B').length,
        tierC: leads.filter(l => l.tier === 'Tier C').length,
        ghost: leads.filter(l => l.tier === 'Spam / Ghost').length
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message || 'Failed to fetch messages',
      data: []
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, leadId, text, status } = body;

    // 1. Send Reply
    if (action === 'send_reply' && leadId && text) {
      await supabaseService.updateLeadStatus(leadId, 'replied', text);
      orchestrator.logMessage('agent-01', 'agent-11', `Sent reply to customer on Lead #${leadId}: "${text.substring(0, 40)}..."`, 'task');
      return NextResponse.json({ success: true, leadId, reply: text });
    }

    // 2. Update Lead Status (e.g. Converted / Closed)
    if (action === 'update_status' && leadId && status) {
      await supabaseService.updateLeadStatus(leadId, status);
      orchestrator.logMessage('agent-01', 'agent-11', `Lead #${leadId} status updated to: ${status}`, 'metric_update');
      return NextResponse.json({ success: true, leadId, status });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Internal error' }, { status: 500 });
  }
}
