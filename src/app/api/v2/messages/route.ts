import { NextResponse } from 'next/server';
import { MOCK_LEAD_TIERS } from '@/data/mockData';
import { MessageTierLead } from '@/types';
import { orchestrator } from '@/agents/orchestrator';

let leads: MessageTierLead[] = [...MOCK_LEAD_TIERS];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pageId = searchParams.get('pageId');
  const tier = searchParams.get('tier');

  let filtered = [...leads];
  if (pageId && pageId !== 'all') {
    filtered = filtered.filter(l => l.pageId === pageId);
  }
  if (tier && tier !== 'ALL') {
    filtered = filtered.filter(l => l.tier === tier);
  }

  return NextResponse.json({
    success: true,
    data: filtered,
    total: filtered.length
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, leadId, replyText, newStatus } = body;

    if (action === 'send_reply' && leadId && replyText) {
      leads = leads.map(l => {
        if (l.id === leadId) {
          const updatedChat = [
            ...l.chatHistory,
            {
              id: `msg-${Date.now()}`,
              sender: 'admin' as const,
              text: replyText,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ];
          orchestrator.logMessage('agent-11', 'agent-01', `Admin replied to ${l.customerName} (${l.tier}). Intent Score: ${l.purchaseProbability}%`, 'task');
          return {
            ...l,
            status: (newStatus || 'replied') as MessageTierLead['status'],
            chatHistory: updatedChat
          };
        }
        return l;
      });

      const updatedLead = leads.find(l => l.id === leadId);
      return NextResponse.json({ success: true, lead: updatedLead, data: leads });
    }

    if (action === 'update_status' && leadId && newStatus) {
      leads = leads.map(l => l.id === leadId ? { ...l, status: newStatus } : l);
      return NextResponse.json({ success: true, data: leads });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
