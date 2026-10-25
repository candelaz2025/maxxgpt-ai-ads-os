'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Plus, Trash2, X, CheckCircle2 } from 'lucide-react';
import { RuleDefinition } from '@/types';
import { useToast } from '@/components/ui/Toast';

export default function DailyRulesPage() {
  const { showToast } = useToast();
  const [rules, setRules] = useState<RuleDefinition[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleNameTh, setNewRuleNameTh] = useState('');
  const [newCondition, setNewCondition] = useState('ROAS >= 3.5 AND Purchases >= 5');
  const [newAction, setNewAction] = useState<RuleDefinition['action']>('increase_budget');
  const [actionValue, setActionValue] = useState(20);

  const fetchRules = () => {
    fetch('/api/v2/rules')
      .then(res => res.json())
      .then(res => {
        if (res.rules) {
          setRules(res.rules.filter((r: RuleDefinition) => r.type === 'daily'));
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const toggleRule = async (id: string) => {
    try {
      const res = await fetch('/api/v2/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_rule', ruleId: id })
      });
      const data = await res.json();
      if (data.success && data.rules) {
        setRules(data.rules.filter((r: RuleDefinition) => r.type === 'daily'));
        showToast('สลับสถานะกฎประจำวันสำเร็จ', 'info');
      }
    } catch {
      showToast('สลับสถานะล้มเหลว', 'error');
    }
  };

  const handleDeleteRule = async (id: string) => {
    try {
      const res = await fetch('/api/v2/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_rule', ruleId: id })
      });
      const data = await res.json();
      if (data.success && data.rules) {
        setRules(data.rules.filter((r: RuleDefinition) => r.type === 'daily'));
        showToast('ลบกฎเรียบร้อย', 'info');
      }
    } catch {
      showToast('ลบกฎล้มเหลว', 'error');
    }
  };

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName.trim()) {
      showToast('กรุณาระบุชื่อกฎ', 'error');
      return;
    }

    try {
      const res = await fetch('/api/v2/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_rule',
          newRule: {
            name: newRuleName,
            nameTh: newRuleNameTh || newRuleName,
            type: 'daily',
            condition: newCondition,
            action: newAction,
            actionValue,
            requiresConfirmation: false
          }
        })
      });
      const data = await res.json();
      if (data.success && data.rules) {
        setRules(data.rules.filter((r: RuleDefinition) => r.type === 'daily'));
        setShowCreateModal(false);
        setNewRuleName('');
        setNewRuleNameTh('');
        showToast(`สร้างกฎประจำวัน: "${newRuleName}" สำเร็จ!`, 'success');
      }
    } catch {
      showToast('สร้างกฎล้มเหลว', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2.5">
            <Settings className="w-6 h-6 text-gold-400" />
            <span>Daily Rules (กฎประจำวันและการปรับงบ EOD)</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            รันทุกๆ เที่ยงคืน เพื่อประเมินผลลัพธ์รอบ 24 ชั่วโมง และกระจายงบประมาณไปยังตัวทำกำไรสูงสุด
          </p>
        </div>

        <button 
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>สร้างกฎประจำวันใหม่</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rules.map(rule => (
          <div 
            key={rule.id}
            className={`p-5 rounded-2xl border transition-all ${
              rule.enabled 
                ? 'bg-[#0f1420] border-[#1f283e]' 
                : 'bg-[#0a0d14] border-[#151a28] opacity-60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase font-bold">
                  DAILY 24H RULE
                </span>
                <h3 className="text-sm font-bold text-white mt-1.5">{rule.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{rule.nameTh}</p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleRule(rule.id)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out flex items-center cursor-pointer ${
                    rule.enabled ? 'bg-emerald-500 justify-end' : 'bg-gray-700 justify-start'
                  }`}
                  title={rule.enabled ? 'คลิกเพื่อปิดกฎ' : 'คลิกเพื่อเปิดกฎ'}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                </button>
                <button
                  onClick={() => handleDeleteRule(rule.id)}
                  className="p-1 rounded text-gray-500 hover:text-rose-400 cursor-pointer"
                  title="ลบกฎนี้"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-[#141a29] border border-[#212b42] text-xs font-mono space-y-1">
              <div className="text-gray-400 text-[10px] uppercase font-bold">เงื่อนไขการทำงาน:</div>
              <div className="text-gold-300 font-semibold">{rule.condition}</div>
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-gray-400">
              <span>การกระทำ: <strong className="text-white uppercase">{rule.action} {rule.actionValue ? `(+${rule.actionValue}%)` : ''}</strong></span>
              <span>ตรวจพบล่าสุด: <strong className="text-gray-300">{rule.lastTriggered}</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-[#0f1422] border border-[#232d44] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1c2438] pb-3">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Plus className="w-5 h-5 text-gold-400" />
                <span>สร้างกฎประจำวัน (New Daily Rule)</span>
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRule} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-gray-300 block mb-1">ชื่อกฎ (Rule Name)</label>
                <input
                  type="text"
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  placeholder="เช่น Daily High ROAS Booster..."
                  className="w-full px-3 py-2 rounded-lg bg-[#141a29] border border-[#232d44] text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-300 block mb-1">คำอธิบายภาษาไทย</label>
                <input
                  type="text"
                  value={newRuleNameTh}
                  onChange={(e) => setNewRuleNameTh(e.target.value)}
                  placeholder="เช่น เพิ่มงบ 20% ทุกสิ้นวันให้ตัวที่ ROAS สูง..."
                  className="w-full px-3 py-2 rounded-lg bg-[#141a29] border border-[#232d44] text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-300 block mb-1">เงื่อนไข (Condition Expression)</label>
                <input
                  type="text"
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#141a29] border border-[#232d44] text-gold-300 font-mono focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-300 block mb-1">การกระทำ</label>
                  <select
                    value={newAction}
                    onChange={(e) => setNewAction(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-[#141a29] border border-[#232d44] text-white focus:outline-none focus:border-gold-500 cursor-pointer"
                  >
                    <option value="increase_budget">เพิ่มงบประมาณ (Increase Budget)</option>
                    <option value="pause">หยุดแอด (Pause)</option>
                    <option value="alert_only">ส่งรายงาน (Alert Only)</option>
                  </select>
                </div>
                {newAction === 'increase_budget' && (
                  <div>
                    <label className="font-semibold text-gray-300 block mb-1">เปอร์เซ็นต์ที่เพิ่ม (%)</label>
                    <input
                      type="number"
                      value={actionValue}
                      onChange={(e) => setActionValue(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg bg-[#141a29] border border-[#232d44] text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#1a2336] text-gray-300 text-xs font-semibold cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs cursor-pointer shadow-md"
                >
                  บันทึกกฎ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
