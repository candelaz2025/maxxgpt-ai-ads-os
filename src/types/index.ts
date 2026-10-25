export type AgentStatus = 'idle' | 'analyzing' | 'optimizing' | 'executing' | 'alerting' | 'completed';

export type AgentDivision = 
  | 'core_meta_api'
  | 'rules_safeguards'
  | 'conversion_formats'
  | 'spotlight_ranking'
  | 'strategy_integrations'
  | 'infrastructure_billing';

export interface AgentDefinition {
  id: string;
  code: string;
  name: string;
  nameTh: string;
  division: AgentDivision;
  divisionNameTh: string;
  role: string;
  status: AgentStatus;
  currentTask: string;
  efficiencyScore: number;
  tasksCompleted: number;
  lastActive: string;
  description: string;
  capabilities: string[];
}

export interface AgentTelemetry {
  agentId: string;
  timestamp: string;
  metric: string;
  value: number;
  details?: string;
}

export interface AgentMessage {
  id: string;
  fromAgentId: string;
  toAgentId: string;
  content: string;
  timestamp: string;
  type: 'task' | 'alert' | 'metric_update' | 'consensus_vote';
  status: 'sent' | 'processing' | 'acknowledged';
}

// ================= Facebook / Meta OAuth & Assets =================
export interface FacebookUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  connectedAt: string;
  tokenExpiresInDays: number;
  scopes: string[];
}

export interface FacebookPage {
  id: string;
  name: string;
  category: string;
  avatarUrl: string;
  fanCount: number;
  unreadMessagesCount: number;
  connectedInstagram?: {
    id: string;
    username: string;
  };
  hasPermissions: boolean;
  accessTokenStatus: 'VALID' | 'EXPIRING_SOON' | 'INVALID';
  isDefault?: boolean;
}

export interface ConnectedMetaAccount {
  user: FacebookUser | null;
  isConnected: boolean;
  activePageId: string;
  pages: FacebookPage[];
  activeAdAccountId: string;
  adAccounts: AdAccount[];
}

export interface AdAccount {
  id: string;
  name: string;
  currency: string;
  timezone: string;
  balance: number;
  status: 'ACTIVE' | 'DISABLED';
  spendCap: number;
  amountSpent: number;
}

export interface Campaign {
  id: string;
  name: string;
  status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
  objective: 'OUTCOME_SALES' | 'OUTCOME_LEADS' | 'OUTCOME_ENGAGEMENT' | 'MESSAGING';
  dailyBudget: number;
  spend: number;
  roas: number;
  purchases: number;
  costPerPurchase: number;
  cpc: number;
  ctr: number;
  impressions: number;
  frequency: number;
  fatigueStatus: 'fresh' | 'warning' | 'saturated';
  hookRate?: number; // 3-second hook rate
  holdRate?: number; // 15-second hold rate
  format?: string;
  pageId?: string;
  pageName?: string;
  adSetsCount: number;
  adsCount: number;
  updatedAt: string;
}

export interface RuleDefinition {
  id: string;
  name: string;
  nameTh: string;
  type: 'daily' | 'six_hour';
  condition: string;
  action: 'pause' | 'increase_budget' | 'decrease_budget' | 'alert_only';
  actionValue?: number; // e.g. 20%
  enabled: boolean;
  requiresConfirmation: boolean;
  lastTriggered?: string;
  targetCount: number;
}

export interface ActionProposal {
  id: string;
  ruleId: string;
  ruleName: string;
  campaignId: string;
  campaignName: string;
  recommendedAction: string;
  reason: string;
  metricsSnapshot: {
    spend: number;
    roas: number;
    purchases: number;
    costPerResult: number;
  };
  proposedAt: string;
  status: 'pending_confirmation' | 'approved' | 'rejected';
}

export interface InterestResult {
  id: string;
  name: string;
  audienceSize: number;
  path: string[];
  relevanceScore: number;
  topic: string;
  recommended: boolean;
  suggestedBidMultiplier?: number;
}

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'admin' | 'bot';
  text: string;
  timestamp: string;
}

export interface MessageTierLead {
  id: string;
  customerName: string;
  pageId: string;
  pageName: string;
  avatarUrl?: string;
  tier: 'Tier S' | 'Tier A' | 'Tier B' | 'Tier C' | 'Spam / Ghost';
  purchaseProbability: number;
  firstMessageTime: string;
  inquiryProduct: string;
  summary: string;
  status: 'pending_reply' | 'converted' | 'dropped' | 'replied';
  chatHistory: ChatMessage[];
  suggestedReplies: string[];
}
