import { NextResponse } from 'next/server';
import { RuleDefinition } from '@/types';
import { supabaseService } from '@/lib/supabase/service';
import { orchestrator } from '@/agents/orchestrator';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as 'six_hour' | 'daily' | null;

    const rules = await supabaseService.getRules(type || undefined);

    return NextResponse.json({
      success: true,
      data: rules,
      rules,
      count: rules.length
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message || 'Failed to fetch rules',
      data: []
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, ruleId, enabled, newRule } = body;

    // 1. Toggle Rule
    if (action === 'toggle_rule' && ruleId) {
      await supabaseService.toggleRule(ruleId, enabled);
      orchestrator.logMessage('agent-01', 'agent-08', `Rule ${ruleId} set to ${enabled ? 'ENABLED' : 'DISABLED'}`, 'task');
      const updatedRules = await supabaseService.getRules();
      return NextResponse.json({ success: true, ruleId, enabled, rules: updatedRules, data: updatedRules });
    }

    // 2. Delete Rule
    if (action === 'delete_rule' && ruleId) {
      await supabaseService.deleteRule(ruleId);
      orchestrator.logMessage('agent-01', 'agent-08', `Rule ${ruleId} deleted by user`, 'alert');
      const updatedRules = await supabaseService.getRules();
      return NextResponse.json({ success: true, ruleId, rules: updatedRules, data: updatedRules });
    }

    // 3. Create Rule
    if (action === 'create_rule' && newRule) {
      const rule: Partial<RuleDefinition> = {
        id: `rule_${Date.now()}`,
        name: newRule.name,
        nameTh: newRule.nameTh || newRule.name,
        type: newRule.type || 'six_hour',
        condition: newRule.condition || 'ROAS < 1.5',
        action: newRule.action || 'pause',
        actionValue: newRule.actionValue ? Number(newRule.actionValue) : undefined,
        enabled: true,
        requiresConfirmation: newRule.requiresConfirmation ?? true
      };

      await supabaseService.saveRule(rule);
      orchestrator.logMessage('agent-01', 'agent-08', `New rule registered: "${rule.name}" (${rule.type})`, 'task');
      const updatedRules = await supabaseService.getRules();
      return NextResponse.json({ success: true, createdRule: rule, rules: updatedRules, data: updatedRules });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Internal error' }, { status: 500 });
  }
}
