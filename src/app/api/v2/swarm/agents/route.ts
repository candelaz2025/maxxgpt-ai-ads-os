import { NextResponse } from 'next/server';
import { orchestrator } from '@/agents/orchestrator';

export async function GET() {
  const state = orchestrator.getState();
  return NextResponse.json({
    success: true,
    data: state
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, proposalId, agentId, task } = body;

    if (action === 'scan') {
      const result = orchestrator.triggerSwarmScan();
      return NextResponse.json({ success: true, result, state: orchestrator.getState() });
    }

    if (action === 'approve_proposal' && proposalId) {
      const approved = orchestrator.approveProposal(proposalId);
      return NextResponse.json({ success: approved, state: orchestrator.getState() });
    }

    if (action === 'reject_proposal' && proposalId) {
      const rejected = orchestrator.rejectProposal(proposalId);
      return NextResponse.json({ success: rejected, state: orchestrator.getState() });
    }

    if (action === 'dispatch_task' && agentId && task) {
      orchestrator.updateAgentStatus(agentId, 'executing', task);
      orchestrator.logMessage('agent-01', agentId, `Manual task dispatched: ${task}`, 'task');
      return NextResponse.json({ success: true, state: orchestrator.getState() });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}
