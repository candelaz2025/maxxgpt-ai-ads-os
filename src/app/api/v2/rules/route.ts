import { NextResponse } from 'next/server';
import { MOCK_RULES } from '@/data/mockData';
import { RuleDefinition } from '@/types';
import { orchestrator } from '@/agents/orchestrator';

let rules: RuleDefinition[] = [...MOCK_RULES];

export async function GET() {
  const swarmState = orchestrator.getState();
  return NextResponse.json({
    success: true,
    rules,
    proposals: swarmState.pendingProposals
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, ruleId, newRule } = body;

    if (action === 'toggle_rule') {
      rules = rules.map(r => r.id === ruleId ? { ...r, enabled: !r.enabled } : r);
      return NextResponse.json({ success: true, rules });
    }

    if (action === 'create_rule' && newRule) {
      const created: RuleDefinition = {
        id: `rule-${Date.now()}`,
        name: newRule.name,
        nameTh: newRule.nameTh || newRule.name,
        type: newRule.type || 'six_hour',
        condition: newRule.condition,
        action: newRule.action || 'pause',
        actionValue: newRule.actionValue ? Number(newRule.actionValue) : undefined,
        enabled: true,
        requiresConfirmation: newRule.requiresConfirmation ?? true,
        lastTriggered: 'Just created',
        targetCount: 0
      };
      rules.unshift(created);
      orchestrator.logMessage('agent-01', created.type === 'six_hour' ? 'agent-08' : 'agent-09', `Registered new automated rule: "${created.name}"`, 'task');
      return NextResponse.json({ success: true, rules, createdRule: created });
    }

    if (action === 'delete_rule') {
      rules = rules.filter(r => r.id !== ruleId);
      return NextResponse.json({ success: true, rules });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
