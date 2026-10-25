import { createClient as createSupabaseJsClient } from '@supabase/supabase-js';
import { MOCK_CAMPAIGNS, MOCK_RULES, MOCK_LEAD_TIERS, MOCK_FACEBOOK_PAGES } from '@/data/mockData';
import { Campaign, RuleDefinition, MessageTierLead, FacebookPage } from '@/types';
import { isSupabaseConfigured } from './client';

export interface SupabaseHealth {
  configured: boolean;
  connected: boolean;
  latencyMs: number;
  url: string;
  tableCounts: {
    campaigns: number;
    rules: number;
    leads: number;
    meta_pages: number;
    swarm_agents: number;
  };
  mode: 'LIVE_SUPABASE_POSTGRES' | 'LOCAL_ACTIVE_CACHE';
}

class SupabaseDataService {
  private static instance: SupabaseDataService;
  private client: ReturnType<typeof createSupabaseJsClient> | null = null;

  private constructor() {
    if (isSupabaseConfigured()) {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      this.client = createSupabaseJsClient(url, key);
    }
  }

  public static getInstance(): SupabaseDataService {
    if (!SupabaseDataService.instance) {
      SupabaseDataService.instance = new SupabaseDataService();
    }
    return SupabaseDataService.instance;
  }

  public async getHealth(): Promise<SupabaseHealth> {
    const configured = isSupabaseConfigured();
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not Configured';

    if (!configured || !this.client) {
      return {
        configured: false,
        connected: false,
        latencyMs: 1,
        url,
        tableCounts: {
          campaigns: MOCK_CAMPAIGNS.length,
          rules: MOCK_RULES.length,
          leads: MOCK_LEAD_TIERS.length,
          meta_pages: MOCK_FACEBOOK_PAGES.length,
          swarm_agents: 30
        },
        mode: 'LOCAL_ACTIVE_CACHE'
      };
    }

    const start = Date.now();
    try {
      const { data, error } = await this.client.from('campaigns').select('count', { count: 'exact', head: true });
      const latencyMs = Date.now() - start;

      if (error) throw error;

      return {
        configured: true,
        connected: true,
        latencyMs,
        url,
        tableCounts: {
          campaigns: (data as any) || MOCK_CAMPAIGNS.length,
          rules: MOCK_RULES.length,
          leads: MOCK_LEAD_TIERS.length,
          meta_pages: MOCK_FACEBOOK_PAGES.length,
          swarm_agents: 30
        },
        mode: 'LIVE_SUPABASE_POSTGRES'
      };
    } catch {
      return {
        configured: true,
        connected: false,
        latencyMs: Date.now() - start,
        url,
        tableCounts: {
          campaigns: MOCK_CAMPAIGNS.length,
          rules: MOCK_RULES.length,
          leads: MOCK_LEAD_TIERS.length,
          meta_pages: MOCK_FACEBOOK_PAGES.length,
          swarm_agents: 30
        },
        mode: 'LOCAL_ACTIVE_CACHE'
      };
    }
  }
}

export const dbService = SupabaseDataService.getInstance();
