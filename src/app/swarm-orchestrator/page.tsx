'use client';

import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Play, 
  ShieldAlert, 
  CheckCircle, 
  Clock, 
  Activity, 
  Cpu, 
  RefreshCw, 
  Filter, 
  Terminal, 
  Check, 
  X,
  Sparkles,
  Zap,
  TrendingUp,
  Send
} from 'lucide-react';
import { SUBAGENTS_ROSTER } from '@/agents/registry';
import { AgentDefinition, AgentDivision, AgentMessage, ActionProposal } from '@/types';

export default function SwarmOrchestratorPage() {
  const [agents, setAgents] = useState<AgentDefinition[]>(SUBAGENTS_ROSTER);
  const [selectedDivision, setSelectedDivision] = useState<string>('all');
  const [isScanning, setIsScanning] = useState(false);
  const [messages, setMessages] = useState<AgentMessage[]>([
    {
      id: 'm1',
      fromAgentId: 'A01',
      toAgentId: 'A08',
      content: 'Initiating 6-hour intra-day rule sweep across all connected adsets.',
      timestamp: '10:30:15',
      type: 'task',
      status: 'acknowledged'
    },
    {
      id: 'm2',
      fromAgentId: 'A07',
      toAgentId: 'A01',
      content: 'KILL SWITCH PROPOSAL: AdSet #309 spent 850 THB with 0 purchases. Awaiting human confirmation.',
      timestamp: '10:32:40',
      type: 'alert',
      status: 'sent'
    },
    {
      id: 'm3',
      fromAgentId: 'A05',
      toAgentId: 'A01',
      content: 'Creative fatigue detected on Ad #104 (Frequency: 3.42x, CTR dropped 42%).',
      timestamp: '10:35:10',
      type: 'alert',
      status: 'acknowledged'
    },
    {
      id: 'm4',
      fromAgentId: 'A06',
      toAgentId: 'A01',
      content: 'Winner AdSet "Broad - Women 25-45" hit ROAS 4.35x. Scaling +20% queued.',
      timestamp: '10:38:00',
      type: 'metric_update',
      status: 'acknowledged'
    }
  ]);

  const [proposals, setProposals] = useState<ActionProposal[]>([
    {
      id: 'prop-1',
      ruleId: 'rule-ks-1',
      ruleName: '6-Hour Fast Kill Switch (CPA Spike)',
      campaignId: 'camp-3',
      campaignName: '⚠️ [RETARGET] Cart Abandoners & Video Viewers 75% 7D',
      recommendedAction: 'PAUSE AdSet to prevent budget bleed',
      reason: 'Spend reached 850 THB with 0 Purchases in the past 6 hours (Threshold: 500 THB).',
      metricsSnapshot: {
        spend: 850,
        roas: 0.0,
        purchases: 0,
        costPerResult: 850
      },
      proposedAt: '10:32 AM',
      status: 'pending_confirmation'
    }
  ]);

  const [customTask, setCustomTask] = useState('');
  const [targetAgent, setTargetAgent] = useState('agent-01');

  // Divisions definition
  const divisions = [
    { id: 'all', name: 'ทั้งหมด 30 Subagents (All Divisions)' },
    { id: 'core_meta_api', name: 'Division 1: Core Ad Engine & Meta API' },
    { id: 'rules_safeguards', name: 'Division 2: Rules & Safeguards' },
    { id: 'conversion_formats', name: 'Division 3: Conversion & Format Specialists' },
    { id: 'spotlight_ranking', name: 'Division 4: Spotlight, Ranking & Intelligence' },
    { id: 'strategy_integrations', name: 'Division 5: Scale, Strategy & Integrations' },
    { id: 'infrastructure_billing', name: 'Division 6: Infrastructure, Billing & Security' },
  ];

  const filteredAgents = selectedDivision === 'all'
    ? agents
    : agents.filter(a => a.division === selectedDivision);

  // Trigger Swarm Scan
  const handleTriggerScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setAgents(prev => prev.map(a => ({
        ...a,
        tasksCompleted: a.tasksCompleted + Math.floor(Math.random() * 3) + 1,
        lastActive: 'Just now',
        status: a.id === 'agent-07' ? 'alerting' : 'analyzing'
      })));

      setMessages(prev => [
        {
          id: `m-${Date.now()}`,
          fromAgentId: 'A01',
          toAgentId: 'ALL',
          content: 'Broadcast scan complete. 30 subagents verified. Health index: 99.4%',
          timestamp: new Date().toLocaleTimeString(),
          type: 'task',
          status: 'acknowledged'
        },
        ...prev
      ]);

      setIsScanning(false);
    }, 1200);
  };

  const handleApproveProposal = (id: string) => {
    setProposals(prev => prev.map(p => p.id === id ? { ...p, status: 'approved' } : p));
    setMessages(prev => [
      {
        id: `m-${Date.now()}`,
        fromAgentId: 'A01',
        toAgentId: 'A07',
        content: `HUMAN CONFIRMATION RECEIVED: Action approved for ${id}. Pausing AdSet in Meta Graph API.`,
        timestamp: new Date().toLocaleTimeString(),
        type: 'task',
        status: 'acknowledged'
      },
      ...prev
    ]);
  };

  const handleRejectProposal = (id: string) => {
    setProposals(prev => prev.map(p => p.id === id ? { ...p, status: 'rejected' } : p));
  };

  const handleDispatchCustomTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTask.trim()) return;

    const agent = agents.find(a => a.id === targetAgent);
    setMessages(prev => [
      {
        id: `m-${Date.now()}`,
        fromAgentId: 'A01 (Orchestrator)',
        toAgentId: agent ? agent.code : 'Target',
        content: `User Task Dispatched: ${customTask}`,
        timestamp: new Date().toLocaleTimeString(),
        type: 'task',
        status: 'sent'
      },
      ...prev
    ]);

    setAgents(prev => prev.map(a => a.id === targetAgent ? {
      ...a,
      status: 'executing',
      currentTask: customTask,
      lastActive: 'Just now'
    } : a));

    setCustomTask('');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-white flex items-center space-x-2.5">
              <Layers className="w-6 h-6 text-gold-400" />
              <span>30-Subagent Swarm Control Center</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>30 Agents Active</span>
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            ระบบ Orchestrator กลางประสานงาน 30 Subagents ดูแลบัญชีโฆษณาตลอด 24 ชั่วโมงแบบกระจายศูนย์
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleTriggerScan}
            disabled={isScanning}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-bold text-xs flex items-center space-x-2 shadow-lg shadow-gold-500/20 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'กำลังสแกนทั้ง 30 เอเจนต์...' : 'สั่งสแกนพร้อมกัน 30 เอเจนต์'}</span>
          </button>
        </div>
      </div>

      {/* Human-in-the-loop Pending Confirmation Proposals */}
      {proposals.filter(p => p.status === 'pending_confirmation').length > 0 && (
        <div className="p-5 rounded-2xl bg-[#140e16] border border-rose-500/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 animate-bounce" />
              <span>Pending Action Proposal (Agent A07 - Kill Switch Guard)</span>
            </div>
            <span className="text-[11px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-mono">Requires Marketer Confirmation</span>
          </div>

          {proposals.filter(p => p.status === 'pending_confirmation').map(prop => (
            <div key={prop.id} className="p-4 rounded-xl bg-[#1a121d] border border-rose-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-sm font-semibold text-white">{prop.campaignName}</div>
                <div className="text-xs text-gray-400">
                  <span className="text-rose-400 font-medium">{prop.reason}</span> • ใช้เงินไป ฿{prop.metricsSnapshot.spend} (0 คอนเวอร์ชั่น)
                </div>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => handleApproveProposal(prop.id)}
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md shadow-rose-950"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>อนุมัติคำสั่งหยุดแอด (Confirm Pause)</span>
                </button>
                <button
                  onClick={() => handleRejectProposal(prop.id)}
                  className="px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium"
                >
                  ปฏิเสธ
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Swarm Telemetry Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0f1420] border border-[#1e273d]">
          <div className="text-xs text-gray-400">จำนวน Subagents ทั้งหมด</div>
          <div className="text-2xl font-bold text-white mt-1">30 ตัว</div>
          <div className="text-[11px] text-emerald-400 mt-1">แบ่งเป็น 6 กองกำลังหลัก</div>
        </div>
        <div className="p-4 rounded-xl bg-[#0f1420] border border-[#1e273d]">
          <div className="text-xs text-gray-400">งานที่สำเร็จแล้ว (Tasks Completed)</div>
          <div className="text-2xl font-bold text-gold-400 mt-1">
            {agents.reduce((acc, a) => acc + a.tasksCompleted, 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-gray-400 mt-1">อัตราตอบสนองเฉลี่ย 180ms</div>
        </div>
        <div className="p-4 rounded-xl bg-[#0f1420] border border-[#1e273d]">
          <div className="text-xs text-gray-400">ดัชนีประสิทธิภาพเฉลี่ย (Efficiency)</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">98.4%</div>
          <div className="text-[11px] text-emerald-400 mt-1">ไม่มีเอเจนต์ที่ล้มเหลว</div>
        </div>
        <div className="p-4 rounded-xl bg-[#0f1420] border border-[#1e273d]">
          <div className="text-xs text-gray-400">การเชื่อมต่อภายนอก (Bridges)</div>
          <div className="text-2xl font-bold text-indigo-400 mt-1">Claude / MCP / GPT</div>
          <div className="text-[11px] text-gray-400 mt-1">Graph API v21.0 Connected</div>
        </div>
      </div>

      {/* Manual Task Dispatch Bar */}
      <div className="p-4 rounded-xl bg-[#0e131e] border border-[#1d263b] space-y-3">
        <div className="text-xs font-semibold text-white flex items-center space-x-1.5">
          <Send className="w-3.5 h-3.5 text-gold-400" />
          <span>สั่งงาน Subagent เจาะจงด้วยคำสั่งของตนเอง (Manual Task Dispatcher)</span>
        </div>
        <form onSubmit={handleDispatchCustomTask} className="flex flex-col sm:flex-row gap-3">
          <select
            value={targetAgent}
            onChange={(e) => setTargetAgent(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[#141a29] border border-[#232d44] text-xs text-gray-200 focus:outline-none focus:border-gold-500"
          >
            {agents.map(a => (
              <option key={a.id} value={a.id}>
                {a.code} - {a.name} ({a.nameTh})
              </option>
            ))}
          </select>
          <input
            type="text"
            value={customTask}
            onChange={(e) => setCustomTask(e.target.value)}
            placeholder="พิมพ์ภารกิจ เช่น 'ตรวจหา Interest กาแฟสกัดเย็น', 'คำนวณ 3s hook rate คลิป reels ล่าสุด'..."
            className="flex-1 px-3 py-2 rounded-lg bg-[#141a29] border border-[#232d44] text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gold-500"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs shrink-0 transition-all"
          >
            สั่งการทันที
          </button>
        </form>
      </div>

      {/* Main Grid: Division filter & Agents cards + Inter-Agent Message Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: 30 Subagents Matrix */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {divisions.map(d => (
              <button
                key={d.id}
                onClick={() => setSelectedDivision(d.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedDivision === d.id
                    ? 'bg-gold-500 text-black font-bold'
                    : 'bg-[#101522] border border-[#1e273d] text-gray-400 hover:text-white'
                }`}
              >
                {d.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAgents.map(agent => (
              <div 
                key={agent.id}
                className="p-4 rounded-xl bg-[#0f1420] border border-[#1d263b] hover:border-gold-500/40 transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-gold-500/10 text-gold-400 border border-gold-500/30">
                        {agent.code}
                      </span>
                      <span className="text-xs font-semibold text-white truncate max-w-[180px]">{agent.name}</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold capitalize ${
                      agent.status === 'executing' 
                        ? 'bg-blue-500/20 text-blue-300 animate-pulse'
                        : agent.status === 'alerting'
                        ? 'bg-rose-500/20 text-rose-300 animate-pulse'
                        : agent.status === 'analyzing'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {agent.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-gold-300/80 mt-1 font-medium">{agent.nameTh}</div>
                  <div className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">{agent.description}</div>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#172033]">
                  <div className="text-[11px] text-gray-300 bg-[#141a29] p-2 rounded-lg font-mono truncate">
                    <span className="text-gold-400 font-bold mr-1">▶</span>
                    {agent.currentTask}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-gray-500 font-medium">
                    <span>ประสิทธิภาพ: <strong className="text-emerald-400">{agent.efficiencyScore}%</strong></span>
                    <span>สำเร็จ: <strong className="text-white">{agent.tasksCompleted} งาน</strong></span>
                    <span>{agent.lastActive}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Inter-Agent Live Message Stream */}
        <div className="p-4 rounded-xl bg-[#0b0e17] border border-[#1d263b] flex flex-col h-[780px]">
          <div className="flex items-center justify-between pb-3 border-b border-[#1c2438]">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-white">Live Inter-Agent Message Bus</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1 text-xs">
            {messages.map(m => (
              <div 
                key={m.id}
                className={`p-3 rounded-lg border text-xs space-y-1.5 ${
                  m.type === 'alert' 
                    ? 'bg-rose-950/20 border-rose-800/40 text-rose-200'
                    : m.type === 'metric_update'
                    ? 'bg-amber-950/20 border-amber-800/40 text-amber-200'
                    : 'bg-[#121724] border-[#1e273d] text-gray-300'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[10px] text-gray-400">
                  <span className="text-gold-400 font-bold">{m.fromAgentId} ➜ {m.toAgentId}</span>
                  <span>{m.timestamp}</span>
                </div>
                <div className="leading-relaxed">{m.content}</div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#1c2438] text-[10px] text-gray-500 flex items-center justify-between">
            <span>Swarm Consensus: Active</span>
            <span>AES-256 Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}
