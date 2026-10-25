import { SUBAGENTS_ROSTER } from './registry';
import { AgentDefinition, AgentMessage, ActionProposal, Campaign } from '../types';
import { supabaseService } from '../lib/supabase/service';

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
          id: 'init-msg',
          fromAgentId: 'agent-01',
          toAgentId: 'all',
          content: 'Master Orchestrator online. 30 subagents initialized across 6 divisions. Ready to monitor Meta Ads & sync telemetry.',
          timestamp: new Date().toLocaleTimeString(),
          type: 'task',
          status: 'acknowledged'
        }
      ],
      pendingProposals: [],
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
    this.state.agents = this.state.agents.map(agent => {
      if (agent.id === id) {
        return {
          ...agent,
          status,
          currentTask: currentTask !== undefined ? currentTask : agent.currentTask,
          lastActive: 'Just now'
        };
      }
      return agent;
    });
  }

  public logMessage(fromAgentId: string, toAgentId: string, content: string, type: AgentMessage['type'] = 'task') {
    const newMessage: AgentMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      fromAgentId,
      toAgentId,
      content,
      timestamp: new Date().toLocaleTimeString(),
      type,
      status: 'acknowledged'
    };
    this.state.messages.unshift(newMessage);
    if (this.state.messages.length > 50) {
      this.state.messages.pop();
    }
  }

  public getPendingProposals(): ActionProposal[] {
    return this.state.pendingProposals;
  }

  public addProposal(proposal: ActionProposal) {
    // Avoid duplicate proposals for the same campaign and action
    const exists = this.state.pendingProposals.some(
      p => p.campaignId === proposal.campaignId && p.recommendedAction === proposal.recommendedAction && p.status === 'pending_confirmation'
    );
    if (!exists) {
      this.state.pendingProposals.unshift(proposal);
      // Persist to Supabase if configured
      supabaseService.saveProposal(proposal).catch(() => {});
    }
  }

  /**
   * Approves a pending proposal. Requires explicit human confirmation.
   */
  public async approveProposal(proposalId: string): Promise<boolean> {
    const prop = this.state.pendingProposals.find(p => p.id === proposalId);
    if (!prop) return false;

    prop.status = 'approved';
    this.logMessage('agent-01', 'agent-07', `Marketer APPROVED action: "${prop.recommendedAction}" on campaign "${prop.campaignName}". Executing immediately.`, 'consensus_vote');
    
    // Execute action
    if (prop.recommendedAction.includes('PAUSE')) {
      await supabaseService.updateCampaignStatus(prop.campaignId, 'PAUSED');
    } else if (prop.recommendedAction.includes('Scale') || prop.recommendedAction.includes('+20%')) {
      const camps = await supabaseService.getCampaigns();
      const targetCamp = camps.find(c => c.id === prop.campaignId);
      if (targetCamp && targetCamp.dailyBudget) {
        const newBudget = Math.round(targetCamp.dailyBudget * 1.2);
        await supabaseService.updateCampaignBudget(prop.campaignId, newBudget);
      }
    }

    await supabaseService.updateProposalStatus(proposalId, 'approved').catch(() => {});
    return true;
  }

  public async rejectProposal(proposalId: string): Promise<boolean> {
    const prop = this.state.pendingProposals.find(p => p.id === proposalId);
    if (!prop) return false;

    prop.status = 'rejected';
    this.logMessage('agent-01', 'agent-07', `Marketer REJECTED action for campaign "${prop.campaignName}". Action aborted.`, 'alert');
    await supabaseService.updateProposalStatus(proposalId, 'rejected').catch(() => {});
    return true;
  }

  /**
   * Runs complete audit of actual campaigns using real algorithmic checks
   */
  public runFullSwarmAudit(campaigns: Campaign[] = []): ActionProposal[] {
    this.updateAgentStatus('agent-01', 'analyzing', 'Broadcasting swarm scan across connected campaigns');

    if (!campaigns || campaigns.length === 0) {
      this.logMessage('agent-01', 'all', 'Swarm scan completed: 0 active campaigns connected. Ready to audit once Meta or Supabase campaigns are loaded.', 'task');
      this.updateAgentStatus('agent-01', 'idle', 'Standing by for campaign data');
      return [];
    }

    const generatedProposals: ActionProposal[] = [];

    // Evaluate each campaign
    for (const camp of campaigns) {
      // 1. Agent 05: Creative Fatigue (Frequency > 2.5 and CTR < 1.0%)
      if (camp.frequency > 2.5 && camp.ctr < 1.0) {
        this.logMessage('agent-05', 'agent-01', `Creative Fatigue detected on "${camp.name}" (Frequency: ${camp.frequency}x, CTR: ${camp.ctr}%). Content refreshment required.`, 'alert');
        this.updateAgentStatus('agent-05', 'alerting', `Fatigue alert on ${camp.name}`);
      }

      // 2. Agent 06: Winner Scaling (+20% Scale when ROAS >= 3.0 and Purchases >= 3)
      if (camp.roas >= 3.0 && camp.purchases >= 3 && camp.status === 'ACTIVE') {
        const proposedBudget = Math.round(camp.dailyBudget * 1.2);
        const scaleProp: ActionProposal = {
          id: `prop-scale-${camp.id}-${Date.now()}`,
          ruleId: 'rule-scaler-winner',
          ruleName: 'Dynamic Winner Scaler (+20%)',
          campaignId: camp.id,
          campaignName: camp.name,
          recommendedAction: `Scale Daily Budget +20% (฿${camp.dailyBudget} -> ฿${proposedBudget})`,
          reason: `High performance breakout: ROAS is ${camp.roas}x with ${camp.purchases} purchases. Scaling budget within 20% guardrail.`,
          metricsSnapshot: {
            spend: camp.spend,
            roas: camp.roas,
            purchases: camp.purchases,
            costPerResult: camp.costPerPurchase
          },
          proposedAt: new Date().toLocaleTimeString(),
          status: 'pending_confirmation'
        };
        this.addProposal(scaleProp);
        generatedProposals.push(scaleProp);
        this.logMessage('agent-06', 'agent-01', `Scaling proposal queued for winner "${camp.name}" (ROAS ${camp.roas}x). Awaiting Marketer confirmation.`, 'metric_update');
        this.updateAgentStatus('agent-06', 'optimizing', `Scaling proposal for ${camp.name}`);
      }

      // 3. Agent 07: Emergency Kill Switch (Spend > 1000 with 0 Purchases or ROAS < 0.8)
      if (camp.spend > 1000 && (camp.purchases === 0 || camp.roas < 0.8) && camp.status === 'ACTIVE') {
        const killProp: ActionProposal = {
          id: `prop-kill-${camp.id}-${Date.now()}`,
          ruleId: 'rule-kill-switch-fast',
          ruleName: 'Emergency Kill Switch Safeguard',
          campaignId: camp.id,
          campaignName: camp.name,
          recommendedAction: `PAUSE Campaign "${camp.name}" to prevent budget drain`,
          reason: `Spend reached ฿${camp.spend} with ${camp.purchases} purchases and ROAS ${camp.roas}x (Unprofitable threshold).`,
          metricsSnapshot: {
            spend: camp.spend,
            roas: camp.roas,
            purchases: camp.purchases,
            costPerResult: camp.costPerPurchase || camp.spend
          },
          proposedAt: new Date().toLocaleTimeString(),
          status: 'pending_confirmation'
        };
        this.addProposal(killProp);
        generatedProposals.push(killProp);
        this.logMessage('agent-07', 'agent-01', `EMERGENCY ALERT: Budget bleed detected on "${camp.name}". Kill switch proposed. Awaiting Marketer confirmation.`, 'alert');
        this.updateAgentStatus('agent-07', 'alerting', `Kill switch proposal on ${camp.name}`);
      }

      // 4. Agent 12: Video Hook Rate (< 20% Hook Rate)
      if (camp.hookRate !== undefined && camp.hookRate < 20 && camp.spend > 500) {
        this.logMessage('agent-12', 'agent-01', `Low 3s Hook Rate (${camp.hookRate}%) on video ad "${camp.name}". First 3 seconds need stronger visual hook.`, 'alert');
      }
    }

    this.state.lastSyncTime = new Date().toISOString();
    this.updateAgentStatus('agent-01', 'idle', 'Audit complete. Standby for marketer confirmation.');
    return generatedProposals;
  }
}

export const orchestrator = SwarmOrchestrator.getInstance();
