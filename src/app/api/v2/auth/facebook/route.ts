import { NextResponse } from 'next/server';
import { MOCK_FACEBOOK_USER, MOCK_FACEBOOK_PAGES, MOCK_AD_ACCOUNTS } from '@/data/mockData';
import { ConnectedMetaAccount } from '@/types';
import { orchestrator } from '@/agents/orchestrator';

// Persistent in-memory session state
let metaSession: ConnectedMetaAccount = {
  user: MOCK_FACEBOOK_USER,
  isConnected: true,
  activePageId: MOCK_FACEBOOK_PAGES[0].id,
  pages: [...MOCK_FACEBOOK_PAGES],
  activeAdAccountId: MOCK_AD_ACCOUNTS[0].id,
  adAccounts: [...MOCK_AD_ACCOUNTS]
};

export async function GET() {
  return NextResponse.json({
    success: true,
    data: metaSession,
    activePage: metaSession.pages.find(p => p.id === metaSession.activePageId) || metaSession.pages[0],
    activeAdAccount: metaSession.adAccounts.find(a => a.id === metaSession.activeAdAccountId) || metaSession.adAccounts[0]
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, pageId, adAccountId, customAccessToken } = body;

    if (action === 'connect') {
      metaSession.isConnected = true;
      metaSession.user = {
        ...MOCK_FACEBOOK_USER,
        tokenExpiresInDays: 60,
        connectedAt: new Date().toLocaleString()
      };
      orchestrator.logMessage('agent-01', 'agent-25', 'Facebook Meta Business Login successful. 4 Pages & 3 Ad Accounts linked.', 'task');
      orchestrator.updateAgentStatus('agent-25', 'optimizing', `Synchronized Meta Assets for ${metaSession.user.name}`);
      return NextResponse.json({ success: true, data: metaSession });
    }

    if (action === 'disconnect') {
      metaSession.isConnected = false;
      metaSession.user = null;
      orchestrator.logMessage('agent-01', 'agent-25', 'Facebook Meta Account disconnected by user.', 'alert');
      return NextResponse.json({ success: true, data: metaSession });
    }

    if (action === 'select_page' && pageId) {
      const page = metaSession.pages.find(p => p.id === pageId);
      if (page) {
        metaSession.activePageId = pageId;
        orchestrator.logMessage('agent-01', 'agent-25', `Switched active Facebook Page to: ${page.name} (${page.id})`, 'task');
        return NextResponse.json({ success: true, data: metaSession, activePage: page });
      }
      return NextResponse.json({ success: false, error: 'Page not found' }, { status: 404 });
    }

    if (action === 'select_ad_account' && adAccountId) {
      const adAcc = metaSession.adAccounts.find(a => a.id === adAccountId);
      if (adAcc) {
        metaSession.activeAdAccountId = adAccountId;
        orchestrator.logMessage('agent-01', 'agent-25', `Switched active Ad Account to: ${adAcc.name} (${adAcc.id})`, 'task');
        return NextResponse.json({ success: true, data: metaSession, activeAdAccount: adAcc });
      }
      return NextResponse.json({ success: false, error: 'Ad Account not found' }, { status: 404 });
    }

    if (action === 'add_custom_page') {
      const { name, category } = body;
      const newPage = {
        id: `page_${Date.now()}`,
        name: name || 'Custom Facebook Page',
        category: category || 'Brand / Product',
        avatarUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150&auto=format&fit=crop&q=80',
        fanCount: 1200,
        unreadMessagesCount: 0,
        hasPermissions: true,
        accessTokenStatus: 'VALID' as const
      };
      metaSession.pages.push(newPage);
      metaSession.activePageId = newPage.id;
      return NextResponse.json({ success: true, data: metaSession, newPage });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}
