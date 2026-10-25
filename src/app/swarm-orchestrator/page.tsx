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
  Send,
  AlertTriangle
} from 'lucide-react';
import { SUBAGENTS_ROSTER } from '@/agents/registry';
import { AgentDefinition, AgentDivision, AgentMessage, ActionProposal } from '@/types';
import { useToast } from '@/components/ui/Toast';

export default function SwarmOrchestratorPage() {
  const { showToast } = useToast();
  const [agents, setAgents] = useState<AgentDefinition[]>(SUBAGENTS_ROSTER);
  const [selectedDivision, setSelectedDivision] = useState<string>('all');
  const [isScanning, setIsScanning] = useState(false);
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [proposals, setProposals] = useState<ActionProposal[]>([]);
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

  const fetchSwarmState = async () => {
    try {
      const res = await fetch('/api/v2/swarm/agents');
      const json = await res.json();
      if (json.data) {
        if (json.data.agents) setAgents(json.data.agents);
        if (json.data.messages) setMessages(json.data.messages);
        if (json.data.pendingProposals) setProposals(json.data.pendingProposals);
      }
    } catch {
      // Keep initial roster if fetch fails
    }
  };

  useEffect(() => {
    fetchSwarmState();
  }, []);

  const filteredAgents = selectedDivision === 'all'
    ? agents
    : agents.filter(a => a.division === selectedDivision);

  // Trigger Real Swarm Scan
  const handleTriggerScan = async () => {
    setIsScanning(true);
    try {
      const res = await fetch('/api/v2/swarm/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'run_audit' })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'Swarm Scan เสร็จสมบูรณ์!', 'success');
        await fetchSwarmState();
      } else {
        showToast(data.error || 'Swarm Scan ล้มเหลว', 'error');
      }
    } catch {
      showToast('การสแกน Swarm ขัดข้อง', 'error');
    } finally {
      setIsScanning(false);
    }
  };

  const handleApproveProposal = async (id: string) => {
    try {
      const res = await fetch('/api/v2/swarm/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve_proposal', proposalId: id })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'อนุมัติการดำเนินงานเรียบร้อย!', 'success');
        await fetchSwarmState();
      } else {
        showToast(data.error || 'การอนุมัติล้มเหลว', 'error');
      }
    } catch {
      showToast('การอนุมัติขัดข้อง', 'error');
    }
  };

  const handleRejectProposal = async (id: string) => {
    try {
      const res = await fetch('/api/v2/swarm/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject_proposal', proposalId: id })
      });
      const data = await res.json();
      if (data.success) {
        showToast('ปฏิเสธข้อเสนอเรียบร้อย', 'info');
        await fetchSwarmState();
      }
    } catch {
      showToast('การปฏิเสธขัดข้อง', 'error');
    }
  };

  const handleDispatchCustomTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTask.trim()) return;

    try {
      const res = await fetch('/api/v2/swarm/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'dispatch_task',
          agentId: targetAgent,
          task: customTask.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'ส่งคำสั่งสำเร็จ!', 'success');
        setCustomTask('');
        await fetchSwarmState();
      } else {
        showToast(data.error || 'ส่งคำสั่งล้มเหลว', 'error');
      }
    } catch {
      showToast('การส่งคำสั่งขัดข้อง', 'error');
    }
  };

  const pendingConfirmations = proposals.filter(p => p.status === 'pending_confirmation');

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2.5">
            <Cpu className="w-6 h-6 text-gold-400" />
            <span>30-Subagent Swarm Control Center</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            ศูนย์ควบคุมระบบเอเจนต์ทั้ง 30 ตัว แยกตาม 6 แผนกกลยุทธ์ พร้อมกลไกความปลอดภัยขออนุมัติจากผู้ใช้ก่อนปรับงบ
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleTriggerScan}
            disabled={isScanning}
            className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs flex items-center space-x-2 transition-all shadow-lg shadow-gold-500/10 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'กำลังสั่งสแกน 30 ตัว...' : 'Broadcast Full Swarm Scan'}</span>
          </button>
        </div>
      </div>

      {/* Pending Proposals Guard (Human Confirmation Modal/Alert) */}
      {pendingConfirmations.length > 0 && (
        <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-500/50 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 animate-bounce" />
              <span>รอการยืนยันจากมนุษย์ (Pending Marketer Proposals) — {pendingConfirmations.length} รายการ</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono">
              Safeguard Mode Active
            </span>
          </div>

          <div className="space-y-2">
            {pendingConfirmations.map(prop => (
              <div
                key={prop.id}
                className="p-4 rounded-xl bg-[#140e15] border border-rose-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white text-sm">{prop.campaignName}</span>
                    <span className="text-[10px] px-2 py-0.2 rounded bg-rose-500/20 text-rose-300 font-mono">
                      {prop.ruleName}
                    </span>
                  </div>
                  <div className="text-xs text-rose-300 font-medium mt-1">
                    คำสั่งที่เสนอ: <strong>{prop.recommendedAction}</strong>
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5">
                    เหตุผล: {prop.reason}
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => handleApproveProposal(prop.id)}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>อนุมัติและปรับใช้จริง</span>
                  </button>
                  <button
                    onClick={() => handleRejectProposal(prop.id)}
                    className="px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium text-xs transition-colors cursor-pointer"
                  >
                    ปฏิเสธคำสั่ง
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Swarm Live Telemetry Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-[#0e131e] border border-[#1d263b]">
          <div className="text-[11px] text-gray-400 font-medium">Subagents พร้อมทำงาน</div>
          <div className="text-xl font-bold text-emerald-400 font-mono mt-1">30/30 Online</div>
          <div className="text-[10px] text-gray-400 mt-0.5">ครอบคลุมทั้ง 6 แผนก</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0e131e] border border-[#1d263b]">
          <div className="text-[11px] text-gray-400 font-medium">คะแนนประสิทธิภาพ Swarm</div>
          <div className="text-xl font-bold text-gold-400 font-mono mt-1">99.2%</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">Consensus Verified</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0e131e] border border-[#1d263b]">
          <div className="text-[11px] text-gray-400 font-medium">คำสั่งที่รอดำเนินการ</div>
          <div className="text-xl font-bold text-white font-mono mt-1">{pendingConfirmations.length} รายการ</div>
          <div className="text-[10px] text-rose-400 mt-0.5">ระบบล็อคงบเพื่อความปลอดภัย</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0e131e] border border-[#1d263b]">
          <div className="text-[11px] text-gray-400 font-medium">ข้อความ Inter-Agent</div>
          <div className="text-xl font-bold text-indigo-300 font-mono mt-1">{messages.length} ข้อความ</div>
          <div className="text-[10px] text-gray-400 mt-0.5">Log สดแบบเรียลไทม์</div>
        </div>
      </div>

      {/* Manual Task Dispatch Bar */}
      <form onSubmit={handleDispatchCustomTask} className="p-4 rounded-xl bg-[#0e131e] border border-gold-500/20 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center space-x-2 shrink-0">
          <Terminal className="w-4 h-4 text-gold-400" />
          <span className="text-xs font-bold text-white">สั่งงานเฉพาะกิจ:</span>
          <select
            value={targetAgent}
            onChange={(e) => setTargetAgent(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-[#141a29] border border-[#232d44] text-xs text-gold-300 focus:outline-none"
          >
            {agents.map(a => (
              <option key={a.id} value={a.id}>
                {a.code}: {a.nameTh}
              </option>
            ))}
          </select>
        </div>

        <input
          type="text"
          value={customTask}
          onChange={(e) => setCustomTask(e.target.value)}
          placeholder="พิมพ์คำสั่งเฉพาะกิจ เช่น: ตรวจสอบความถี่แคมเปญ #1 หรือ ค้นหา Interest สินค้าแม่และเด็ก..."
          className="flex-1 px-3 py-1.5 rounded-lg bg-[#141a29] border border-[#232d44] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gold-500"
        />

        <button
          type="submit"
          className="px-4 py-1.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs flex items-center justify-center space-x-1.5 cursor-pointer shrink-0 transition-all"
        >
          <Send className="w-3.5 h-3.5" />
          <span>สั่งงาน Subagent</span>
        </button>
      </form>

      {/* Division Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
        {divisions.map(div => (
          <button
            key={div.id}
            onClick={() => setSelectedDivision(div.id)}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedDivision === div.id
                ? 'bg-gold-500 text-black font-bold shadow-md'
                : 'bg-[#0e131e] text-gray-400 hover:text-white border border-[#1e273d]'
            }`}
          >
            {div.name}
          </button>
        ))}
      </div>

      {/* Agents Roster Grid (Filtered) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAgents.map(agent => (
          <div
            key={agent.id}
            className="p-5 rounded-2xl bg-[#0e131e] border border-[#1d263b] hover:border-gold-500/40 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-gold-500/10 text-gold-400 border border-gold-500/20">
                  {agent.code}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center space-x-1 ${
                  agent.status === 'executing' 
                    ? 'bg-emerald-500/20 text-emerald-300' 
                    : agent.status === 'alerting'
                    ? 'bg-rose-500/20 text-rose-300 animate-pulse'
                    : 'bg-blue-500/10 text-blue-300'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${agent.status === 'alerting' ? 'bg-rose-400' : 'bg-emerald-400'}`} />
                  <span className="capitalize">{agent.status}</span>
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">{agent.nameTh}</h3>
                <p className="text-[11px] text-gray-400 font-mono">{agent.name}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#141a29] border border-[#1f283d] text-xs">
                <div className="text-[10px] text-gray-400">งานปัจจุบัน (Current Task):</div>
                <div className="text-white text-xs font-medium mt-0.5 line-clamp-2">
                  {agent.currentTask}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#1a2336] flex items-center justify-between text-[11px] text-gray-400">
              <span>งานที่ทำเสร็จ: <strong className="text-white font-mono">{agent.tasksCompleted}</strong></span>
              <span className="text-emerald-400 font-mono">Score: {agent.efficiencyScore}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Swarm Communication Stream (Console Log) */}
      <div className="rounded-2xl bg-[#090d16] border border-[#1b253b] overflow-hidden">
        <div className="px-5 py-3 border-b border-[#182236] bg-[#0c111c] flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-bold text-white uppercase tracking-wider">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>Inter-Agent Swarm Message Stream (Console Log)</span>
          </div>
          <span className="text-[10px] text-gray-400 font-mono">Live WebSocket Simulation</span>
        </div>

        <div className="p-4 space-y-2 max-h-60 overflow-y-auto font-mono text-xs text-gray-300">
          {messages.map(msg => (
            <div key={msg.id} className="flex items-start space-x-2 leading-relaxed">
              <span className="text-gray-500 shrink-0">[{msg.timestamp}]</span>
              <span className="text-gold-400 font-bold shrink-0">{msg.fromAgentId} &rarr; {msg.toAgentId}:</span>
              <span className={msg.type === 'alert' ? 'text-rose-400' : 'text-gray-200'}>
                {msg.content}
              </span>
            </div>
          ))}
          {messages.length === 0 && (
            <div className="text-gray-500 text-center py-4">ยังไม่มีประวัติการส่งข้อความระหว่างเอเจนต์</div>
          )}
        </div>
      </div>
    </div>
  );
}
