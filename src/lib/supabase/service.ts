import { createClient as createSupabaseJsClient } from '@supabase/supabase-js';
import { Campaign, RuleDefinition, MessageTierLead, FacebookPage, AdAccount, ActionProposal, AgentDefinition } from '@/types';
import { isSupabaseConfigured } from './client';

export interface SupabaseHealth {
  configured: boolean;
  connected: boolean;
  latencyMs: number;
  url: string;
  error?: string;
  tableCounts: {
    campaigns: number;
    rules: number;
    leads: number;
    meta_pages: number;
    swarm_agents: number;
    rule_proposals: number;
  };
  mode: 'LIVE_SUPABASE_POSTGRES' | 'DISCONNECTED';
}

export class SupabaseDataService {
  private static instance: SupabaseDataService;
  private client: any = null;

  private constructor() {
    if (isSupabaseConfigured()) {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      this.client = createSupabaseJsClient(url, key, {
        auth: { persistSession: false }
      });
    }
  }

  public static getInstance(): SupabaseDataService {
    if (!SupabaseDataService.instance) {
      SupabaseDataService.instance = new SupabaseDataService();
    }
    return SupabaseDataService.instance;
  }

  public getClient() {
    return this.client;
  }

  private async withTimeout<T>(promise: Promise<T>, ms: number = 2000, fallback: T): Promise<T> {
    let timer: NodeJS.Timeout;
    const timeoutPromise = new Promise<T>((resolve) => {
      timer = setTimeout(() => resolve(fallback), ms);
    });
    try {
      const result = await Promise.race([promise, timeoutPromise]);
      clearTimeout(timer!);
      return result;
    } catch {
      clearTimeout(timer!);
      return fallback;
    }
  }

  /**
   * Performs live health check against Supabase PostgreSQL
   */
  public async getHealth(): Promise<SupabaseHealth> {
    const configured = isSupabaseConfigured();
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not Configured';

    if (!configured || !this.client) {
      return {
        configured: false,
        connected: false,
        latencyMs: 0,
        url,
        error: 'NEXT_PUBLIC_SUPABASE_URL or API Key is missing in environment variables.',
        tableCounts: {
          campaigns: 0,
          rules: 0,
          leads: 0,
          meta_pages: 0,
          swarm_agents: 0,
          rule_proposals: 0
        },
        mode: 'DISCONNECTED'
      };
    }

    const start = Date.now();
    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Supabase request timed out (2500ms)')), 2500)
      );

      const healthPromise = Promise.allSettled([
        this.client.from('campaigns').select('id', { count: 'exact', head: true }),
        this.client.from('rules').select('id', { count: 'exact', head: true }),
        this.client.from('leads').select('id', { count: 'exact', head: true }),
        this.client.from('meta_pages').select('id', { count: 'exact', head: true }),
        this.client.from('swarm_agents').select('id', { count: 'exact', head: true }),
        this.client.from('rule_proposals').select('id', { count: 'exact', head: true })
      ]);

      const [
        campRes,
        rulesRes,
        leadsRes,
        pagesRes,
        agentsRes,
        propsRes
      ] = await Promise.race([healthPromise, timeoutPromise]) as PromiseSettledResult<any>[];

      const latencyMs = Date.now() - start;

      const getCount = (res: PromiseSettledResult<any>) => {
        if (res.status === 'fulfilled' && !res.value.error && typeof res.value.count === 'number') {
          return res.value.count;
        }
        return 0;
      };

      const hasError = campRes.status === 'rejected' || (campRes.status === 'fulfilled' && campRes.value.error);
      const errorMessage = hasError 
        ? (campRes.status === 'rejected' ? String(campRes.reason) : campRes.value.error?.message) 
        : undefined;

      return {
        configured: true,
        connected: !hasError,
        latencyMs,
        url,
        error: errorMessage,
        tableCounts: {
          campaigns: getCount(campRes),
          rules: getCount(rulesRes),
          leads: getCount(leadsRes),
          meta_pages: getCount(pagesRes),
          swarm_agents: getCount(agentsRes),
          rule_proposals: getCount(propsRes)
        },
        mode: !hasError ? 'LIVE_SUPABASE_POSTGRES' : 'DISCONNECTED'
      };
    } catch (err: any) {
      return {
        configured: true,
        connected: false,
        latencyMs: Date.now() - start,
        url,
        error: err?.message || 'Database connection timeout',
        tableCounts: {
          campaigns: 0,
          rules: 0,
          leads: 0,
          meta_pages: 0,
          swarm_agents: 0,
          rule_proposals: 0
        },
        mode: 'DISCONNECTED'
      };
    }
  }

  // ================= CAMPAIGNS =================
  public async getCampaigns(pageId?: string): Promise<Campaign[]> {
    if (!this.client) return [];
    try {
      const queryPromise = (async () => {
        let query = this.client.from('campaigns').select('*').order('spend', { ascending: false });
        if (pageId) query = query.eq('page_id', pageId);

        const { data, error } = await query;
        if (error || !data) return [];

        return data.map((row: any) => ({
          id: row.id,
          name: row.name,
          status: row.status,
          objective: row.objective,
          dailyBudget: Number(row.daily_budget) || 0,
          spend: Number(row.spend) || 0,
          roas: Number(row.roas) || 0,
          purchases: Number(row.purchases) || 0,
          costPerPurchase: Number(row.cost_per_purchase) || 0,
          cpc: Number(row.cpc) || 0,
          ctr: Number(row.ctr) || 0,
          impressions: Number(row.impressions) || 0,
          frequency: Number(row.frequency) || 1.0,
          fatigueStatus: row.fatigue_status || 'fresh',
          hookRate: Number(row.hook_rate) || 0,
          holdRate: Number(row.hold_rate) || 0,
          format: row.format || 'Reels 9:16',
          pageId: row.page_id,
          adSetsCount: 1,
          adsCount: 3,
          updatedAt: row.updated_at ? new Date(row.updated_at).toLocaleTimeString() : 'Recently'
        }));
      })();

      return await this.withTimeout(queryPromise, 1500, []);
    } catch {
      return [];
    }
  }

  public async upsertCampaign(c: Partial<Campaign>): Promise<boolean> {
    if (!this.client || !c.id) return false;
    try {
      const payload: any = {
        id: c.id,
        name: c.name,
        status: c.status || 'ACTIVE',
        objective: c.objective || 'OUTCOME_SALES',
        daily_budget: c.dailyBudget,
        spend: c.spend || 0,
        roas: c.roas || 0,
        purchases: c.purchases || 0,
        cost_per_purchase: c.costPerPurchase || 0,
        cpc: c.cpc || 0,
        ctr: c.ctr || 0,
        impressions: c.impressions || 0,
        frequency: c.frequency || 1.0,
        fatigue_status: c.fatigueStatus || 'fresh',
        hook_rate: c.hookRate || 0,
        hold_rate: c.holdRate || 0,
        format: c.format || 'Reels 9:16',
        page_id: c.pageId,
        updated_at: new Date().toISOString()
      };

      const { error } = await this.client.from('campaigns').upsert(payload, { onConflict: 'id' });
      return !error;
    } catch {
      return false;
    }
  }

  public async updateCampaignBudget(id: string, dailyBudget: number): Promise<boolean> {
    if (!this.client) return false;
    try {
      const { error } = await this.client.from('campaigns').update({
        daily_budget: dailyBudget,
        updated_at: new Date().toISOString()
      }).eq('id', id);
      return !error;
    } catch {
      return false;
    }
  }

  public async updateCampaignStatus(id: string, status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED'): Promise<boolean> {
    if (!this.client) return false;
    try {
      const { error } = await this.client.from('campaigns').update({
        status,
        updated_at: new Date().toISOString()
      }).eq('id', id);
      return !error;
    } catch {
      return false;
    }
  }

  // ================= AUTOMATION RULES =================
  public async getRules(type?: 'six_hour' | 'daily'): Promise<RuleDefinition[]> {
    if (!this.client) return [];
    try {
      const queryPromise = (async () => {
        let query = this.client.from('rules').select('*').order('created_at', { ascending: false });
        if (type) query = query.eq('type', type);

        const { data, error } = await query;
        if (error || !data) return [];

        return data.map((r: any) => ({
          id: r.id,
          name: r.name,
          nameTh: r.name_th || r.name,
          type: r.type,
          condition: r.condition,
          action: r.action,
          actionValue: r.action_value ? Number(r.action_value) : undefined,
          enabled: Boolean(r.enabled),
          requiresConfirmation: Boolean(r.requires_confirmation),
          lastTriggered: r.last_triggered ? new Date(r.last_triggered).toLocaleTimeString() : undefined,
          targetCount: 0
        }));
      })();

      return await this.withTimeout(queryPromise, 1500, []);
    } catch {
      return [];
    }
  }

  public async saveRule(rule: Partial<RuleDefinition>): Promise<boolean> {
    if (!this.client || !rule.name) return false;
    try {
      const id = rule.id || `rule_${Date.now()}`;
      const payload: any = {
        id,
        name: rule.name,
        name_th: rule.nameTh || rule.name,
        type: rule.type || 'six_hour',
        condition: rule.condition || 'ROAS < 1.5',
        action: rule.action || 'pause',
        action_value: rule.actionValue,
        enabled: rule.enabled ?? true,
        requires_confirmation: rule.requiresConfirmation ?? true,
        created_at: new Date().toISOString()
      };

      const { error } = await this.client.from('rules').upsert(payload, { onConflict: 'id' });
      return !error;
    } catch {
      return false;
    }
  }

  public async toggleRule(id: string, enabled: boolean): Promise<boolean> {
    if (!this.client) return false;
    try {
      const { error } = await this.client.from('rules').update({ enabled }).eq('id', id);
      return !error;
    } catch {
      return false;
    }
  }

  public async deleteRule(id: string): Promise<boolean> {
    if (!this.client) return false;
    try {
      const { error } = await this.client.from('rules').delete().eq('id', id);
      return !error;
    } catch {
      return false;
    }
  }

  // ================= PENDING PROPOSALS =================
  public async getProposals(): Promise<ActionProposal[]> {
    if (!this.client) return [];
    try {
      const { data, error } = await this.client.from('rule_proposals').select(`
        *,
        campaigns:campaign_id (name)
      `).order('proposed_at', { ascending: false });

      if (error || !data) return [];

      return data.map((p: any) => ({
        id: p.id,
        ruleId: p.rule_id,
        ruleName: p.rule_name || 'Automated Swarm Rule',
        campaignId: p.campaign_id,
        campaignName: p.campaigns?.name || p.campaign_name || 'Campaign',
        recommendedAction: p.recommended_action,
        reason: p.reason,
        metricsSnapshot: {
          spend: Number(p.spend_at_trigger) || 0,
          roas: Number(p.roas_at_trigger) || 0,
          purchases: Number(p.purchases_at_trigger) || 0,
          costPerResult: 0
        },
        proposedAt: new Date(p.proposed_at).toLocaleTimeString(),
        status: p.status
      }));
    } catch {
      return [];
    }
  }

  public async saveProposal(prop: Partial<ActionProposal>): Promise<boolean> {
    if (!this.client || !prop.id) return false;
    try {
      const payload: any = {
        id: prop.id,
        rule_id: prop.ruleId || 'rule-auto',
        campaign_id: prop.campaignId,
        recommended_action: prop.recommendedAction,
        reason: prop.reason,
        spend_at_trigger: prop.metricsSnapshot?.spend || 0,
        roas_at_trigger: prop.metricsSnapshot?.roas || 0,
        purchases_at_trigger: prop.metricsSnapshot?.purchases || 0,
        status: prop.status || 'pending_confirmation',
        proposed_at: new Date().toISOString()
      };

      const { error } = await this.client.from('rule_proposals').upsert(payload, { onConflict: 'id' });
      return !error;
    } catch {
      return false;
    }
  }

  public async updateProposalStatus(id: string, status: 'approved' | 'rejected'): Promise<boolean> {
    if (!this.client) return false;
    try {
      const { error } = await this.client.from('rule_proposals').update({ status }).eq('id', id);
      return !error;
    } catch {
      return false;
    }
  }

  // ================= MESSAGE LEADS =================
  public async getLeads(tier?: string): Promise<MessageTierLead[]> {
    if (!this.client) return [];
    try {
      const queryPromise = (async () => {
        let query = this.client.from('leads').select('*').order('created_at', { ascending: false });
        if (tier && tier !== 'ALL') query = query.eq('tier', tier);

        const { data, error } = await query;
        if (error || !data) return [];

        return data.map((l: any) => ({
          id: l.id,
          customerName: l.customer_name,
          pageId: l.page_id,
          pageName: l.page_name || 'Connected Page',
          avatarUrl: l.avatar_url,
          tier: l.tier,
          purchaseProbability: Number(l.purchase_probability) || 50,
          firstMessageTime: new Date(l.created_at).toLocaleTimeString(),
          inquiryProduct: l.inquiry_product || 'General Inquiry',
          summary: l.summary || '',
          status: l.status || 'pending_reply',
          chatHistory: Array.isArray(l.chat_history) ? l.chat_history : [],
          suggestedReplies: Array.isArray(l.suggested_replies) ? l.suggested_replies : []
        }));
      })();

      return await this.withTimeout(queryPromise, 1500, []);
    } catch {
      return [];
    }
  }

  public async updateLeadStatus(id: string, status: string, replyMessage?: string): Promise<boolean> {
    if (!this.client) return false;
    try {
      const updateData: any = { status };
      if (replyMessage) {
        // Append admin reply to chat_history
        const { data: lead } = await this.client.from('leads').select('chat_history').eq('id', id).single();
        const history = Array.isArray(lead?.chat_history) ? lead.chat_history : [];
        history.push({
          id: `msg_${Date.now()}`,
          sender: 'admin',
          text: replyMessage,
          timestamp: new Date().toLocaleTimeString()
        });
        updateData.chat_history = history;
      }

      const { error } = await this.client.from('leads').update(updateData).eq('id', id);
      return !error;
    } catch {
      return false;
    }
  }

  // ================= FACEBOOK PAGES & ACCOUNTS =================
  public async getFacebookPages(): Promise<FacebookPage[]> {
    if (!this.client) return [];
    try {
      const queryPromise = (async () => {
        const { data, error } = await this.client.from('meta_pages').select('*').order('created_at', { ascending: false });
        if (error || !data) return [];

        return data.map((p: any) => ({
          id: p.id,
          name: p.name,
          category: p.category || 'Business Page',
          avatarUrl: p.avatar_url || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150&auto=format&fit=crop&q=80',
          fanCount: Number(p.fan_count) || 0,
          unreadMessagesCount: Number(p.unread_messages) || 0,
          connectedInstagram: p.connected_instagram_handle ? { id: p.id, username: p.connected_instagram_handle } : undefined,
          hasPermissions: Boolean(p.has_permissions),
          accessTokenStatus: p.access_token_status || 'VALID',
          isDefault: Boolean(p.is_active)
        }));
      })();

      return await this.withTimeout(queryPromise, 1500, []);
    } catch {
      return [];
    }
  }

  public async upsertFacebookPage(p: Partial<FacebookPage>): Promise<boolean> {
    if (!this.client || !p.id) return false;
    try {
      const payload: any = {
        id: p.id,
        name: p.name,
        category: p.category,
        avatar_url: p.avatarUrl,
        fan_count: p.fanCount || 0,
        unread_messages: p.unreadMessagesCount || 0,
        connected_instagram_handle: p.connectedInstagram?.username,
        has_permissions: p.hasPermissions ?? true,
        access_token_status: p.accessTokenStatus || 'VALID',
        is_active: p.isDefault ?? false,
        created_at: new Date().toISOString()
      };

      const { error } = await this.client.from('meta_pages').upsert(payload, { onConflict: 'id' });
      return !error;
    } catch {
      return false;
    }
  }

  public async getMetaAccount(): Promise<AdAccount | null> {
    if (!this.client) return null;
    try {
      const queryPromise = (async () => {
        const { data, error } = await this.client.from('meta_accounts').select('*').limit(1).single();
        if (error || !data) return null;

        return {
          id: data.id,
          name: data.name,
          currency: data.currency || 'THB',
          timezone: data.timezone || 'Asia/Bangkok',
          balance: Number(data.balance) || 0,
          status: data.status || 'ACTIVE',
          spendCap: Number(data.spend_cap) || 0,
          amountSpent: Number(data.amount_spent) || 0
        };
      })();

      return await this.withTimeout(queryPromise, 1500, null);
    } catch {
      return null;
    }
  }

  public async upsertMetaAccount(acc: AdAccount, encryptedToken?: string): Promise<boolean> {
    if (!this.client || !acc.id) return false;
    try {
      const payload: any = {
        id: acc.id,
        name: acc.name,
        currency: acc.currency,
        timezone: acc.timezone,
        balance: acc.balance,
        spend_cap: acc.spendCap,
        amount_spent: acc.amountSpent,
        status: acc.status,
        encrypted_access_token: encryptedToken,
        created_at: new Date().toISOString()
      };

      const { error } = await this.client.from('meta_accounts').upsert(payload, { onConflict: 'id' });
      return !error;
    } catch {
      return false;
    }
  }
}

export const supabaseService = SupabaseDataService.getInstance();
