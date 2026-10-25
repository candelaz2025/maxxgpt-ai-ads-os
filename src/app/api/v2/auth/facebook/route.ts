import { NextResponse } from 'next/server';
import { ConnectedMetaAccount, FacebookUser, FacebookPage, AdAccount } from '@/types';
import { MetaGraphApiClient } from '@/lib/meta/graphApi';
import { supabaseService } from '@/lib/supabase/service';
import { orchestrator } from '@/agents/orchestrator';

// In-memory session fallback when Supabase is not yet populated
let metaSession: ConnectedMetaAccount = {
  user: null,
  isConnected: false,
  activePageId: '',
  pages: [],
  activeAdAccountId: '',
  adAccounts: []
};

// Check if environment has default Meta System User Token
const systemToken = process.env.META_SYSTEM_USER_TOKEN;

export async function GET() {
  try {
    // If not connected yet but system token exists in env, attempt auto-sync
    if (!metaSession.isConnected && systemToken) {
      try {
        const client = new MetaGraphApiClient(systemToken);
        const me = await client.getMe();
        const pagesRaw = await client.getPages();
        const accountsRaw = await client.getAdAccounts();

        const user: FacebookUser = {
          id: me.id,
          name: me.name,
          email: me.email || 'developer@meta.com',
          avatarUrl: me.picture?.data?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          connectedAt: new Date().toLocaleString(),
          tokenExpiresInDays: 60,
          scopes: ['pages_show_list', 'pages_read_engagement', 'ads_management', 'ads_read']
        };

        const pages: FacebookPage[] = pagesRaw.map((p, idx) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          avatarUrl: p.picture?.data?.url || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150&auto=format&fit=crop&q=80',
          fanCount: p.fan_count || 0,
          unreadMessagesCount: p.unread_message_count || 0,
          hasPermissions: true,
          accessTokenStatus: 'VALID',
          isDefault: idx === 0
        }));

        const adAccounts: AdAccount[] = accountsRaw.map(a => ({
          id: a.id,
          name: a.name,
          currency: a.currency || 'THB',
          timezone: a.timezone_name || 'Asia/Bangkok',
          balance: Number(a.balance) || 0,
          status: a.account_status === 1 ? 'ACTIVE' : 'DISABLED',
          spendCap: Number(a.spend_cap) || 0,
          amountSpent: Number(a.amount_spent) || 0
        }));

        metaSession = {
          user,
          isConnected: true,
          pages,
          activePageId: pages[0]?.id || '',
          adAccounts,
          activeAdAccountId: adAccounts[0]?.id || ''
        };

        // Persist to Supabase
        for (const p of pages) {
          await supabaseService.upsertFacebookPage(p);
        }
        if (adAccounts[0]) {
          await supabaseService.upsertMetaAccount(adAccounts[0], systemToken);
        }
      } catch {
        // If system token is invalid, remain disconnected
      }
    }

    // Try reading pages from Supabase if session has none
    if (metaSession.pages.length === 0) {
      const dbPages = await supabaseService.getFacebookPages();
      const dbAccount = await supabaseService.getMetaAccount();
      if (dbPages.length > 0) {
        metaSession.pages = dbPages;
        metaSession.activePageId = dbPages[0].id;
        if (dbAccount) {
          metaSession.adAccounts = [dbAccount];
          metaSession.activeAdAccountId = dbAccount.id;
        }
        metaSession.isConnected = true;
      }
    }

    const activePage = metaSession.pages.find(p => p.id === metaSession.activePageId) || metaSession.pages[0] || null;
    const activeAdAccount = metaSession.adAccounts.find(a => a.id === metaSession.activeAdAccountId) || metaSession.adAccounts[0] || null;

    return NextResponse.json({
      success: true,
      data: metaSession,
      activePage,
      activeAdAccount
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message || 'Failed to retrieve Meta auth status'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, accessToken, pageId, adAccountId } = body;

    // 1. Connect using Meta Access Token (User or System User token)
    if (action === 'connect_token') {
      const token = accessToken || systemToken;
      if (!token) {
        return NextResponse.json({
          success: false,
          error: 'MISSING_ACCESS_TOKEN: กรุณาระบุ Facebook User Access Token หรือ System User Token'
        }, { status: 400 });
      }

      try {
        const client = new MetaGraphApiClient(token);
        const me = await client.getMe();
        const pagesRaw = await client.getPages();
        const accountsRaw = await client.getAdAccounts();

        const user: FacebookUser = {
          id: me.id,
          name: me.name,
          email: me.email || 'user@facebook.com',
          avatarUrl: me.picture?.data?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          connectedAt: new Date().toLocaleString(),
          tokenExpiresInDays: 60,
          scopes: ['pages_show_list', 'pages_read_engagement', 'ads_management', 'ads_read']
        };

        const pages: FacebookPage[] = pagesRaw.map((p, idx) => ({
          id: p.id,
          name: p.name,
          category: p.category || 'Business Page',
          avatarUrl: p.picture?.data?.url || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150&auto=format&fit=crop&q=80',
          fanCount: p.fan_count || 0,
          unreadMessagesCount: p.unread_message_count || 0,
          hasPermissions: true,
          accessTokenStatus: 'VALID',
          isDefault: idx === 0
        }));

        const adAccounts: AdAccount[] = accountsRaw.map(a => ({
          id: a.id,
          name: a.name,
          currency: a.currency || 'THB',
          timezone: a.timezone_name || 'Asia/Bangkok',
          balance: Number(a.balance) || 0,
          status: a.account_status === 1 ? 'ACTIVE' : 'DISABLED',
          spendCap: Number(a.spend_cap) || 0,
          amountSpent: Number(a.amount_spent) || 0
        }));

        metaSession = {
          user,
          isConnected: true,
          pages,
          activePageId: pages[0]?.id || '',
          adAccounts,
          activeAdAccountId: adAccounts[0]?.id || ''
        };

        // Persist to Supabase
        for (const p of pages) {
          await supabaseService.upsertFacebookPage(p);
        }
        if (adAccounts[0]) {
          await supabaseService.upsertMetaAccount(adAccounts[0], token);
        }

        orchestrator.logMessage('agent-01', 'agent-25', `Connected Meta Account for ${user.name} (${pages.length} Pages, ${adAccounts.length} Ad Accounts synced).`, 'task');
        orchestrator.updateAgentStatus('agent-25', 'optimizing', `Synchronized ${pages.length} Pages`);

        return NextResponse.json({
          success: true,
          data: metaSession,
          message: `เชื่อมต่อสำเร็จ! ซิงค์ ${pages.length} เพจ และ ${adAccounts.length} บัญชีโฆษณาเรียบร้อย`
        });
      } catch (err: any) {
        return NextResponse.json({
          success: false,
          error: `Meta Graph API Error: ${err?.message || 'Invalid or expired Facebook Access Token'}`
        }, { status: 401 });
      }
    }

    // 2. Disconnect
    if (action === 'disconnect') {
      metaSession = {
        user: null,
        isConnected: false,
        activePageId: '',
        pages: [],
        activeAdAccountId: '',
        adAccounts: []
      };
      orchestrator.logMessage('agent-01', 'agent-25', 'Meta Facebook Account disconnected.', 'alert');
      return NextResponse.json({ success: true, data: metaSession });
    }

    // 3. Select active Page
    if (action === 'select_page' && pageId) {
      const page = metaSession.pages.find(p => p.id === pageId);
      if (page) {
        metaSession.activePageId = pageId;
        orchestrator.logMessage('agent-01', 'agent-25', `Switched active Facebook Page to: ${page.name} (${page.id})`, 'task');
        return NextResponse.json({ success: true, data: metaSession, activePage: page });
      }
      return NextResponse.json({ success: false, error: 'Page not found' }, { status: 404 });
    }

    // 4. Select active Ad Account
    if (action === 'select_ad_account' && adAccountId) {
      const adAcc = metaSession.adAccounts.find(a => a.id === adAccountId);
      if (adAcc) {
        metaSession.activeAdAccountId = adAccountId;
        orchestrator.logMessage('agent-01', 'agent-25', `Switched active Ad Account to: ${adAcc.name} (${adAcc.id})`, 'task');
        return NextResponse.json({ success: true, data: metaSession, activeAdAccount: adAcc });
      }
      return NextResponse.json({ success: false, error: 'Ad Account not found' }, { status: 404 });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Internal error' }, { status: 500 });
  }
}
