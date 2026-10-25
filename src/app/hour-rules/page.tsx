'use client';

import React, { useState, useEffect } from 'react';
import { Clock, ShieldAlert, CheckCircle, Plus, Power, Trash2, X } from 'lucide-react';
import { RuleDefinition } from '@/types';
import { useToast } from '@/components/ui/Toast';

export default function HourRulesPage() {
  const { showToast } = useToast();
  const [rules, setRules] = useState<RuleDefinition[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleNameTh, setNewRuleNameTh] = useState('');
  const [newCondition, setNewCondition] = useState('Spend >= 500 THB AND Purchases == 0');
  const [newAction, setNewAction] = useState<RuleDefinition['action']>('pause');
  const [requiresConfirm, setRequiresConfirm] = useState(true);

  const fetchRules = () => {
    fetch('/api/v2/rules')
      .then(res => res.json())
      .then(res => {
        if (res.rules) {
          setRules(res.rules.filter((r: RuleDefinition) => r.type === 'six_hour'));
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
        setRules(data.rules.filter((r: RuleDefinition) => r.type === 'six_hour'));
        showToast('สลับสถานะการเปิด/ปิดกฎ 6 ชั่วโมงสำเร็จ', 'info');
      }
    } catch {
      showToast('ไม่สามารถเปลี่ยนสถานะกฎได้', 'error');
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
        setRules(data.rules.filter((r: RuleDefinition) => r.type === 'six_hour'));
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
            type: 'six_hour',
            condition: newCondition,
            action: newAction,
            requiresConfirmation: requiresConfirm
          }
        })
      });
      const data = await res.json();
      if (data.success && data.rules) {
        setRules(data.rules.filter((r: RuleDefinition) => r.type === 'six_hour'));
        setShowCreateModal(false);
        setNewRuleName('');
        setNewRuleNameTh('');
        showToast(`สร้างกฎ 6 ชั่วโมง: "${newRuleName}" สำเร็จ!`, 'success');
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
            <Clock className="w-6 h-6 text-amber-400" />
            <span>6-Hour Rules (ระบบเฝ้าผลและตรวจจับทุก 6 ชั่วโมง)</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            กฎการทำงานความเร็วสูง ตรวจสอบผลงานทุกรอบ 6 ชม. (06:00, 12:00, 18:00, 24:00) เพื่อป้องกันงบรั่วไหลช่วงคนช้อปปิ้ง
          </p>
        </div>

        <button 
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>สร้างกฎ 6 ชั่วโมงใหม่</span>
        </button>
      </div>

      <div className="p-4 rounded-xl bg-[#141018] border border-amber-500/30 flex items-center space-x-3 text-xs text-amber-300">
        <ShieldAlert className="w-5 h-5 shrink-0 text-amber-400" />
        <div>
          <strong className="font-semibold block text-white">มาตรฐานความปลอดภัย (Safety Safeguard Active):</strong>
          ทุกคำสั่งที่มีผลกระทบต่อเงิน เช่น การหยุดแอด (Pause) จะสร้างเป็นคำขอให้คุณกดยืนยัน (Confirmation Prompt) ก่อนเสมอ
        </div>
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
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase font-bold">
                  6-HOUR FAST RULE
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
              <div className="text-gray-400 text-[10px] uppercase font-bold">เงื่อนไขการทำงาน (Trigger Condition):</div>
              <div className="text-gold-300 font-semibold">{rule.condition}</div>
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-gray-400">
              <span>การกระทำ: <strong className="text-white uppercase">{rule.action}</strong></span>
              <span>ตรวจพบล่าสุด: <strong className="text-gray-300">{rule.lastTriggered}</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Rule Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-[#0f1422] border border-[#232d44] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1c2438] pb-3">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Plus className="w-5 h-5 text-gold-400" />
                <span>สร้างกฎ 6 ชั่วโมงอัตโนมัติ (New 6-Hour Rule)</span>
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
                <label className="font-semibold text-gray-300 block mb-1">ชื่อกฎภาษาอังกฤษ (Rule Name)</label>
                <input
                  type="text"
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  placeholder="เช่น Fast High CPA Breaker..."
                  className="w-full px-3 py-2 rounded-lg bg-[#141a29] border border-[#232d44] text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-300 block mb-1">คำอธิบายภาษาไทย</label>
                <input
                  type="text"
                  value={newRuleNameTh}
                  onChange={(e) => setNewRuleNameTh(e.target.value)}
                  placeholder="เช่น กฎหยุดแอดด่วนเมื่อราคาต่อออเดอร์แพงเกิน 2 เท่า..."
                  className="w-full px-3 py-2 rounded-lg bg-[#141a29] border border-[#232d44] text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-300 block mb-1">เงื่อนไขการทำงาน (Condition Expression)</label>
                <input
                  type="text"
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#141a29] border border-[#232d44] text-gold-300 font-mono focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-300 block mb-1">การกระทำ (Action)</label>
                  <select
                    value={newAction}
                    onChange={(e) => setNewAction(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-[#141a29] border border-[#232d44] text-white focus:outline-none focus:border-gold-500 cursor-pointer"
                  >
                    <option value="pause">หยุดแอดชั่วคราว (Pause)</option>
                    <option value="increase_budget">เพิ่มงบประมาณ (Scale)</option>
                    <option value="alert_only">ส่งแจ้งเตือนอย่างเดียว (Alert)</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="confirmCheck"
                    checked={requiresConfirm}
                    onChange={(e) => setRequiresConfirm(e.target.checked)}
                    className="rounded text-gold-500 cursor-pointer"
                  />
                  <label htmlFor="confirmCheck" className="text-gray-300 cursor-pointer">
                    ต้องกดยืนยันก่อนทำจริง
                  </label>
                </div>
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
                  บันทึกกฎใหม่
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
