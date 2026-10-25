import { SUBAGENTS_ROSTER } from './registry';
import { AgentDefinition, AgentMessage, ActionProposal, InterestResult } from '../types';

export interface SwarmState {
  orchestratorStatus: 'RUNNING' | 'DEGRADED' | 'PAUSED';
  agents: AgentDefinition[];
  messages: AgentMessage[];
  pendingProposals: ActionProposal[];
  lastSyncTime: string;
}

class SwarmOrchestrator {
  private static instance: SwarmOrchestrator;
  private state: SwarmState;

  private constructor() {
    this.state = {
      orchestratorStatus: 'RUNNING',
      agents: [...SUBAGENTS_ROSTER],
      messages: [
        {
          id: 'msg-1',
          fromAgentId: 'agent-01',
          toAgentId: 'agent-08',
          content: 'Dispatching 6-hour intra-day rule check across all active adsets.',
          timestamp: '10:30:15',
          type: 'task',
          status: 'acknowledged'
        },
        {
          id: 'msg-2',
          fromAgentId: 'agent-07',
          toAgentId: 'agent-01',
          content: 'ALERT: AdSet "Retargeting - VC 7D" spend 850 THB with 0 purchases. Kill switch proposed.',
          timestamp: '10:32:40',
          type: 'alert',
          status: 'sent'
        },
        {
          id: 'msg-3',
          fromAgentId: 'agent-05',
          toAgentId: 'agent-01',
          content: 'Creative fatigue detected on Ad #104 (Frequency: 3.42x, CTR dropped 42%).',
          timestamp: '10:35:10',
          type: 'alert',
          status: 'acknowledged'
        },
        {
          id: 'msg-4',
          fromAgentId: 'agent-06',
          toAgentId: 'agent-01',
          content: 'Winner AdSet "Broad - Women 25-45" hit ROAS 4.2x. Scaling budget recommendation queued.',
          timestamp: '10:38:00',
          type: 'metric_update',
          status: 'acknowledged'
        }
      ],
      pendingProposals: [
        {
          id: 'prop-1',
          ruleId: 'rule-ks-1',
          ruleName: '6-Hour Fast Kill Switch (CPA Spike)',
          campaignId: 'camp-3',
          campaignName: 'Retargeting - Video Viewers 7D',
          recommendedAction: 'PAUSE AdSet to prevent budget bleed',
          reason: 'Spend reached 850 THB with 0 Purchases in the past 6 hours (Threshold: 500 THB).',
          metricsSnapshot: {
            spend: 850,
            roas: 0.0,
            purchases: 0,
            costPerResult: 850
          },
          proposedAt: '10:32 AM',
          status: 'pending_confirmation'
        }
      ],
      lastSyncTime: new Date().toISOString()
    };
  }

  public static getInstance(): SwarmOrchestrator {
    if (!SwarmOrchestrator.instance) {
      SwarmOrchestrator.instance = new SwarmOrchestrator();
    }
    return SwarmOrchestrator.instance;
  }

  public getState(): SwarmState {
    return this.state;
  }

  public getAgents(): AgentDefinition[] {
    return this.state.agents;
  }

  public getAgentById(id: string): AgentDefinition | undefined {
    return this.state.agents.find(a => a.id === id);
  }

  public updateAgentStatus(id: string, status: AgentDefinition['status'], currentTask?: string) {
    const agent = this.state.agents.find(a => a.id === id);
    if (agent) {
      agent.status = status;
      if (currentTask) agent.currentTask = currentTask;
      agent.lastActive = 'Just now';
      agent.tasksCompleted += 1;
    }
  }

  public logMessage(fromAgentId: string, toAgentId: string, content: string, type: AgentMessage['type'] = 'task') {
    const newMessage: AgentMessage = {
      id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      fromAgentId,
      toAgentId,
      content,
      timestamp: new Date().toLocaleTimeString(),
      type,
      status: 'sent'
    };
    this.state.messages.unshift(newMessage);
    if (this.state.messages.length > 50) {
      this.state.messages.pop();
    }
    return newMessage;
  }

  public approveProposal(proposalId: string): boolean {
    const prop = this.state.pendingProposals.find(p => p.id === proposalId);
    if (prop) {
      prop.status = 'approved';
      this.logMessage('agent-01', 'agent-07', `Human confirmed proposal ${proposalId}. Executed pause on ${prop.campaignName}.`, 'task');
      this.updateAgentStatus('agent-07', 'executing', `Executed pause on ${prop.campaignName}`);
      return true;
    }
    return false;
  }

  public rejectProposal(proposalId: string): boolean {
    const prop = this.state.pendingProposals.find(p => p.id === proposalId);
    if (prop) {
      prop.status = 'rejected';
      this.logMessage('agent-01', 'agent-07', `Human rejected proposal ${proposalId}. Ad remains active.`, 'task');
      return true;
    }
    return false;
  }

  public triggerSwarmScan(): { scannedAgents: number; alertsFound: number } {
    this.updateAgentStatus('agent-01', 'analyzing', 'Broadcasting swarm-wide health and metric audit');
    this.updateAgentStatus('agent-05', 'analyzing', 'Auditing creative fatigue decay across 24 adsets');
    this.updateAgentStatus('agent-08', 'executing', 'Running 6-hour intra-day rule evaluation matrix');
    this.updateAgentStatus('agent-11', 'analyzing', 'Scoring 45 new customer Messenger conversations');
    this.updateAgentStatus('agent-14', 'optimizing', 'Verifying Pixel/CAPI event deduplication match quality');
    
    this.logMessage('agent-01', 'all', 'Swarm scan executed. All 30 agents updated their operational state.', 'task');
    return { scannedAgents: 30, alertsFound: this.state.pendingProposals.length };
  }
}

export const orchestrator = SwarmOrchestrator.getInstance();
