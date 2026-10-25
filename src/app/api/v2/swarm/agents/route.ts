import { NextResponse } from 'next/server';
import { orchestrator } from '@/agents/orchestrator';
import { supabaseService } from '@/lib/supabase/service';

export async function GET() {
  const state = orchestrator.getState();
  
  // Merge any pending proposals from Supabase
  const dbProposals = await supabaseService.getProposals();
  const allProposals = [...state.pendingProposals];
  for (const dbP of dbProposals) {
    if (!allProposals.some(p => p.id === dbP.id)) {
      allProposals.push(dbP);
    }
  }

  return NextResponse.json({
    success: true,
    data: {
      ...state,
      pendingProposals: allProposals
    }
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, agentId, task, proposalId } = body;

    // 1. Run Swarm Audit on real campaigns
    if (action === 'run_audit') {
      const campaigns = await supabaseService.getCampaigns();
      const proposals = orchestrator.runFullSwarmAudit(campaigns);
      return NextResponse.json({
        success: true,
        message: `ตรวจสอบแคมเปญจริง ${campaigns.length} รายการเรียบร้อย (พบ ${proposals.length} ข้อเสนอที่ต้องยืนยัน)`,
        proposals,
        campaignsAudited: campaigns.length
      });
    }

    // 2. Approve Proposal (Human Marketer Confirmation)
    if (action === 'approve_proposal' && proposalId) {
      const ok = await orchestrator.approveProposal(proposalId);
      if (ok) {
        return NextResponse.json({
          success: true,
          proposalId,
          status: 'approved',
          message: 'อนุมัติการดำเนินงานสำเร็จ! ระบบปรับใช้คำสั่งกับแคมเปญทันที'
        });
      }
      return NextResponse.json({ success: false, error: 'Proposal not found' }, { status: 404 });
    }

    // 3. Reject Proposal
    if (action === 'reject_proposal' && proposalId) {
      const ok = await orchestrator.rejectProposal(proposalId);
      if (ok) {
        return NextResponse.json({
          success: true,
          proposalId,
          status: 'rejected',
          message: 'ปฏิเสธข้อเสนอเรียบร้อย'
        });
      }
      return NextResponse.json({ success: false, error: 'Proposal not found' }, { status: 404 });
    }

    // 4. Dispatch Manual Task to Subagent
    if (action === 'dispatch_task' && agentId && task) {
      const agent = orchestrator.getAgentById(agentId);
      if (!agent) {
        return NextResponse.json({ success: false, error: 'Agent not found' }, { status: 404 });
      }

      orchestrator.updateAgentStatus(agentId, 'executing', task);
      orchestrator.logMessage('agent-01', agentId, `Custom Task Dispatched: "${task}"`, 'task');

      // Schedule status back to idle after completion simulation
      setTimeout(() => {
        orchestrator.updateAgentStatus(agentId, 'idle', 'Completed assigned task');
        orchestrator.logMessage(agentId, 'agent-01', `Task completed successfully: "${task}"`, 'task');
      }, 5000);

      return NextResponse.json({
        success: true,
        message: `ส่งคำสั่งให้ ${agent.code} (${agent.nameTh}) เรียบร้อย`,
        agent
      });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Internal error' }, { status: 500 });
  }
}
