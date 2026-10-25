import { NextResponse } from 'next/server';
import { MOCK_AD_ACCOUNTS } from '@/data/mockData';

export async function GET() {
  return NextResponse.json({
    user: {
      id: 'usr_maxx_9921',
      name: 'Maxx Growth Team',
      email: 'growth@brandalpha.co',
      plan: 'MaxxGPT Enterprise Pro',
      creditsRemaining: 4850,
      activeAdAccountId: MOCK_AD_ACCOUNTS[0].id,
      activePageId: 'page_beauty_01',
      role: 'ADMIN',
    },
    system: {
      version: 'v2.8.4',
      metaApiVersion: 'v21.0',
      connectedAccountsCount: MOCK_AD_ACCOUNTS.length,
      orchestratorMode: 'ACTIVE_SWARM_30',
      status: 'HEALTHY'
    }
  });
}
