import { NextResponse } from 'next/server';
import { MOCK_INTERESTS } from '@/data/mockData';
import { orchestrator } from '@/agents/orchestrator';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.toLowerCase() || '';

  orchestrator.updateAgentStatus('agent-03', 'executing', `Searching Meta Graph for targeting interests: "${q || 'all'}"`);
  orchestrator.logMessage('agent-01', 'agent-03', `Executed Graph Targeting Search for keyword: "${q}"`, 'task');

  const filtered = q
    ? MOCK_INTERESTS.filter(i => 
        i.name.toLowerCase().includes(q) || 
        i.topic.toLowerCase().includes(q) ||
        i.path.some(p => p.toLowerCase().includes(q))
      )
    : MOCK_INTERESTS;

  return NextResponse.json({
    success: true,
    data: filtered,
    meta: {
      graphVersion: 'v21.0',
      totalMatches: filtered.length,
      searchedByAgent: 'A03 - Interest Finder & Hidden Graph Agent'
    }
  });
}
