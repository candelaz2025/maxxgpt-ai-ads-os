/**
 * Meta Marketing & Graph API v21.0 Integration Client
 * Provides direct, production-grade access to Facebook Pages,
 * Ad Accounts, Campaigns, Insights, and Audience Interests.
 */

const GRAPH_API_BASE = 'https://graph.facebook.com/v21.0';

export interface MetaGraphError {
  message: string;
  type: string;
  code: number;
  error_subcode?: number;
  fbtrace_id?: string;
}

export class MetaGraphApiClient {
  private accessToken?: string;

  constructor(accessToken?: string) {
    this.accessToken = accessToken || process.env.META_SYSTEM_USER_TOKEN;
  }

  /**
   * Generates Facebook OAuth URL for user authorization
   */
  public static getOAuthUrl(clientId: string, redirectUri: string, state?: string): string {
    const scopes = [
      'email',
      'public_profile',
      'pages_show_list',
      'pages_read_engagement',
      'pages_manage_posts',
      'pages_messaging',
      'ads_management',
      'ads_read',
      'leads_retrieval'
    ].join(',');

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: scopes,
      response_type: 'code',
      state: state || 'maxxgpt_meta_oauth'
    });

    return `https://www.facebook.com/v21.0/dialog/oauth?${params.toString()}`;
  }

  /**
   * Exchanges OAuth authorization code for Short-Lived Access Token
   */
  public static async exchangeCodeForToken(
    code: string,
    clientId: string,
    clientSecret: string,
    redirectUri: string
  ): Promise<{ access_token: string; token_type: string; expires_in: number }> {
    const params = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code
    });

    const response = await fetch(`${GRAPH_API_BASE}/oauth/access_token?${params.toString()}`);
    const data = await response.json();

    if (!response.ok || data.error) {
      throw new Error(data.error?.message || 'Failed to exchange Meta OAuth code');
    }

    return data;
  }

  /**
   * Exchanges Short-Lived Token for 60-Day Long-Lived Token
   */
  public static async getLongLivedToken(
    shortLivedToken: string,
    clientId: string,
    clientSecret: string
  ): Promise<{ access_token: string; token_type: string; expires_in: number }> {
    const params = new URLSearchParams({
      grant_type: 'fb_exchange_token',
      client_id: clientId,
      client_secret: clientSecret,
      fb_exchange_token: shortLivedToken
    });

    const response = await fetch(`${GRAPH_API_BASE}/oauth/access_token?${params.toString()}`);
    const data = await response.json();

    if (!response.ok || data.error) {
      throw new Error(data.error?.message || 'Failed to generate Meta Long-Lived Token');
    }

    return data;
  }

  /**
   * Fetches authenticated user info (/me)
   */
  public async getMe(): Promise<{
    id: string;
    name: string;
    email?: string;
    picture?: { data: { url: string } };
  }> {
    const token = this.ensureToken();
    const url = `${GRAPH_API_BASE}/me?fields=id,name,email,picture.width(200).height(200)&access_token=${token}`;
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok || data.error) throw new Error(data.error?.message || 'Failed to fetch Meta user profile');
    return data;
  }

  /**
   * Fetches Facebook Pages managed by the user (/me/accounts)
   */
  public async getPages(): Promise<Array<{
    id: string;
    name: string;
    category: string;
    fan_count?: number;
    tasks?: string[];
    access_token?: string;
    unread_message_count?: number;
    picture?: { data: { url: string } };
    instagram_business_account?: { id: string; username: string };
  }>> {
    const token = this.ensureToken();
    const url = `${GRAPH_API_BASE}/me/accounts?fields=id,name,category,fan_count,unread_message_count,tasks,access_token,picture.width(200).height(200),instagram_business_account{id,username}&limit=100&access_token=${token}`;
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok || data.error) throw new Error(data.error?.message || 'Failed to fetch Facebook Pages');
    return data.data || [];
  }

  /**
   * Fetches Meta Ad Accounts (/me/adaccounts)
   */
  public async getAdAccounts(): Promise<Array<{
    id: string; // e.g. act_123456789
    account_id: string;
    name: string;
    account_status: number;
    currency: string;
    timezone_name: string;
    spend_cap?: string;
    amount_spent?: string;
    balance?: string;
  }>> {
    const token = this.ensureToken();
    const url = `${GRAPH_API_BASE}/me/adaccounts?fields=id,account_id,name,account_status,currency,timezone_name,spend_cap,amount_spent,balance&limit=50&access_token=${token}`;
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok || data.error) throw new Error(data.error?.message || 'Failed to fetch Meta Ad Accounts');
    return data.data || [];
  }

  /**
   * Fetches real campaigns with insights from Meta Graph API
   */
  public async getCampaignsWithInsights(adAccountId: string): Promise<any[]> {
    const token = this.ensureToken();
    const cleanId = adAccountId.startsWith('act_') ? adAccountId : `act_${adAccountId}`;
    
    const fields = [
      'id',
      'name',
      'status',
      'objective',
      'daily_budget',
      'lifetime_budget',
      'created_time',
      'updated_time',
      'insights.date_preset(last_7d){spend,purchase_roas,actions,cost_per_action_type,cpc,cpm,ctr,impressions,frequency,video_p25_watched_actions,video_p50_watched_actions,video_p75_watched_actions,video_p100_watched_actions,video_30_sec_watched_actions}'
    ].join(',');

    const url = `${GRAPH_API_BASE}/${cleanId}/campaigns?fields=${fields}&limit=50&access_token=${token}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok || data.error) {
      throw new Error(data.error?.message || `Failed to fetch campaigns for ad account ${cleanId}`);
    }

    return data.data || [];
  }

  /**
   * Searches hidden interests via Meta Graph API v21.0
   * Endpoint: /search?type=adinterest&q={query}
   */
  public async searchInterests(query: string): Promise<Array<{
    id: string;
    name: string;
    audience_size_lower_bound?: number;
    audience_size_upper_bound?: number;
    path?: string[];
    topic?: string;
  }>> {
    const token = this.ensureToken();
    const url = `${GRAPH_API_BASE}/search?type=adinterest&q=${encodeURIComponent(query)}&limit=30&access_token=${token}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok || data.error) {
      throw new Error(data.error?.message || 'Meta Interest Search failed');
    }

    return data.data || [];
  }

  /**
   * Creates a new campaign on Meta Ad Account
   */
  public async createCampaign(adAccountId: string, payload: {
    name: string;
    objective: string;
    status: 'ACTIVE' | 'PAUSED';
    daily_budget?: number;
  }): Promise<{ id: string }> {
    const token = this.ensureToken();
    const cleanId = adAccountId.startsWith('act_') ? adAccountId : `act_${adAccountId}`;

    const body: Record<string, any> = {
      name: payload.name,
      objective: payload.objective,
      status: payload.status,
      special_ad_categories: ['NONE'],
      access_token: token
    };

    if (payload.daily_budget) {
      // Meta API expects budget in cents (e.g. 100 THB = 10000 cents)
      body.daily_budget = Math.round(payload.daily_budget * 100);
    }

    const res = await fetch(`${GRAPH_API_BASE}/${cleanId}/campaigns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    if (!res.ok || data.error) throw new Error(data.error?.message || 'Failed to create Meta Campaign');
    return data;
  }

  /**
   * Updates an existing campaign's status or budget on Meta API
   */
  public async updateCampaign(campaignId: string, payload: {
    status?: 'ACTIVE' | 'PAUSED';
    daily_budget?: number;
  }): Promise<{ success: boolean }> {
    const token = this.ensureToken();
    const body: Record<string, any> = {
      access_token: token
    };

    if (payload.status) body.status = payload.status;
    if (payload.daily_budget) body.daily_budget = Math.round(payload.daily_budget * 100);

    const res = await fetch(`${GRAPH_API_BASE}/${campaignId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    if (!res.ok || data.error) throw new Error(data.error?.message || 'Failed to update Meta Campaign');
    return data;
  }

  private ensureToken(): string {
    if (!this.accessToken) {
      throw new Error('META_ACCESS_TOKEN_MISSING: Access token is required for Meta Graph API v21.0 calls.');
    }
    return this.accessToken;
  }
}
