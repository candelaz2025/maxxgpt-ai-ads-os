'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldAlert, 
  Search, 
  Layers, 
  TrendingUp, 
  Clock, 
  Video, 
  Zap, 
  MessageSquare, 
  Flame, 
  CheckCircle,
  Play,
  Pause,
  ShieldCheck
} from 'lucide-react';
import { useMetaAuth } from '@/context/MetaAuthContext';
import { useToast } from '@/components/ui/Toast';
import { ActionProposal } from '@/types';

export default function HomePage() {
  const { activePage, isConnected, setShowConnectModal } = useMetaAuth();
  const { showToast } = useToast();

  const [proposals, setProposals] = useState<ActionProposal[]>([]);
  const [summary, setSummary] = useState({
    totalSpend: 0,
    totalPurchases: 0,
    avgRoas: 0,
    activeCampaignsCount: 0
  });

  useEffect(() => {
    // Fetch live summary from real campaigns
    fetch('/api/v2/campaigns')
      .then(res => res.json())
      .then(res => {
        if (res.summary) setSummary(res.summary);
      })
      .catch(() => {});

    // Fetch live proposals
    fetch('/api/v2/swarm/agents')
      .then(res => res.json())
      .then(res => {
        if (res.data?.pendingProposals) {
          setProposals(res.data.pendingProposals.filter((p: ActionProposal) => p.status === 'pending_confirmation'));
        }
      })
      .catch(() => {});
  }, []);

  const handleConfirmPause = async (proposalId: string) => {
    try {
      const res = await fetch('/api/v2/swarm/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve_proposal', proposalId })
      });
      const data = await res.json();
      if (data.success) {
        setProposals(prev => prev.filter(p => p.id !== proposalId));
        showToast('ยืนยันหยุดแอดเรียบร้อยแล้ว: Agent A07 ดำเนินการปรับใช้คำสั่งทันที', 'success');
      }
    } catch {
      showToast('การยืนยันขัดข้อง', 'error');
    }
  };

  const handleRejectProposal = async (proposalId: string) => {
    try {
      await fetch('/api/v2/swarm/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject_proposal', proposalId })
      });
      setProposals(prev => prev.filter(p => p.id !== proposalId));
      showToast('ละเว้นข้อเสนอเรียบร้อย', 'info');
    } catch {
      setProposals(prev => prev.filter(p => p.id !== proposalId));
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Top Banner / Hero */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#111726] via-[#161f33] to-[#121828] border border-gold-500/20 p-8 overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl -z-10" />
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MaxxGPT AI Ads Operating System • Meta Business Partner Architecture</span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            ระบบบริหารจัดการและยิงโฆษณา <span className="gold-gradient-text">Meta Ads อัตโนมัติ</span>
          </h1>

          <p className="text-gray-400 text-sm leading-relaxed">
            เชื่อมต่อกับเพจ <strong className="text-blue-400">{activePage?.name || 'Facebook Page'}</strong> ขับเคลื่อนด้วยโครงสร้าง <strong className="text-white">30-Subagent Swarm Orchestrator</strong> ดูแลตั้งแต่ค้นหา Interest ที่ซ่อนอยู่, ร่างแคปชั่น, ปล่อยแคมเปญ, เฝ้าผลทุก 6 ชม., ตัดแอดเผางบ ไปจนถึงสเกลงบให้ตัวที่ทำกำไรสูงสุด
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-bold text-xs flex items-center space-x-2 shadow-lg shadow-gold-500/20 transition-all cursor-pointer"
            >
              <span>เปิดแดชบอร์ด Meta Ads</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => setShowConnectModal(true)}
              className="px-5 py-2.5 rounded-xl bg-[#1877F2]/20 hover:bg-[#1877F2]/30 text-blue-300 font-semibold text-xs border border-blue-500/40 flex items-center space-x-2 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>{isConnected ? `เพจ: ${activePage?.name}` : 'เข้าสู่ระบบ Facebook'}</span>
            </button>

            <Link
              href="/swarm-orchestrator"
              className="px-5 py-2.5 rounded-xl bg-[#172033] hover:bg-[#1f2b45] text-white font-medium text-xs border border-[#2b3959] flex items-center space-x-2 transition-all cursor-pointer"
            >
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>ตรวจห้องควบคุม 30 Subagents</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-[#0f1420] border border-[#1e273d]">
          <div className="text-xs text-gray-400 font-medium">ยอดใช้จ่ายแอด (Spend)</div>
          <div className="text-2xl font-bold text-white mt-1 font-mono">฿{summary.totalSpend.toLocaleString()}</div>
          <div className="text-[11px] text-gray-400 mt-1 flex items-center">
            <span>{summary.activeCampaignsCount} แคมเปญเปิดอยู่</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#0f1420] border border-[#1e273d]">
          <div className="text-xs text-gray-400 font-medium">ค่าเฉลี่ย ROAS รวม</div>
          <div className="text-2xl font-bold text-gold-400 mt-1 font-mono">{summary.avgRoas}x</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center">
            <span>เกณฑ์คุ้มทุน 2.0x</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#0f1420] border border-[#1e273d]">
          <div className="text-xs text-gray-400 font-medium">จำนวนออเดอร์ (Purchases)</div>
          <div className="text-2xl font-bold text-white mt-1 font-mono">{summary.totalPurchases} รายการ</div>
          <div className="text-[11px] text-gray-400 mt-1 flex items-center">
            <span>{summary.totalPurchases > 0 ? `เฉลี่ย ฿${(summary.totalSpend / summary.totalPurchases).toFixed(1)} / ชิ้น` : '-'}</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#0f1420] border border-[#1e273d]">
          <div className="text-xs text-gray-400 font-medium">สถานะ 30 เอเจนต์</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">30/30 Active</div>
          <div className="text-[11px] text-gray-400 mt-1 flex items-center">
            <span>{proposals.length > 0 ? `${proposals.length} รอการกดยืนยัน` : 'ทุกระบบทำงานปกติ'}</span>
          </div>
        </div>
      </div>

      {/* Urgent Pending Proposal (Kill Switch Alert) */}
      {proposals.length > 0 && (
        <div className="p-5 rounded-xl bg-rose-950/30 border border-rose-500/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 animate-bounce" />
              <span>แจ้งเตือนด่วน: แอดเผางบผิดปกติ (Kill Switch Safeguard)</span>
            </div>
            <span className="text-[11px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-mono">Requires Human Confirmation</span>
          </div>
          {proposals.map(p => (
            <div key={p.id} className="p-4 rounded-lg bg-[#141018] border border-rose-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-white">{p.campaignName}</div>
                <div className="text-xs text-gray-400 mt-0.5">
                  ใช้เงินไปแล้ว <strong className="text-rose-400">฿{p.metricsSnapshot?.spend?.toLocaleString() || 0}</strong> • {p.reason}
                </div>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <button 
                  onClick={() => handleConfirmPause(p.id)}
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md shadow-rose-950 cursor-pointer"
                >
                  <Pause className="w-3.5 h-3.5" />
                  <span>ยืนยันอนุมัติคำสั่ง</span>
                </button>
                <button 
                  onClick={() => handleRejectProposal(p.id)}
                  className="px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium cursor-pointer"
                >
                  ละเว้น
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3 Core Operating Phases */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-white">3 ขั้นตอนการทำงานของ MaxxGPT Ads System</h2>
          <p className="text-xs text-gray-400">ระบบถูกจัดระเบียบตามวงจรชีวิตการยิงแอดจริง เพื่อให้การบริหารจัดการมีระเบียบและไม่พลาดจุดสำคัญ</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Phase 1 */}
          <div className="p-6 rounded-2xl bg-[#0e131e] border border-[#1d263b] hover:border-gold-500/30 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  ขั้นที่ 1 • ก่อนยิงแอด
                </span>
                <span className="text-xs text-gray-500">Agent A03 & A04</span>
              </div>
              <h3 className="text-base font-bold text-white">หากลุ่มเป้าหมายและเตรียมคอนเทนต์</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                ค้นหา Interest ที่มีอยู่จริงบน Meta Marketing API พร้อมคัดเลือกตัวที่เข้ากับสินค้า ร่างแคปชั่นขายดี และปล่อยแคมเปญอัตโนมัติ
              </p>
              <div className="space-y-2 pt-2">
                <Link 
                  href="/ai-tools"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#141a29] text-xs text-gray-300 hover:text-gold-300 hover:bg-[#1a2336] transition-all cursor-pointer"
                >
                  <span className="flex items-center space-x-2">
                    <Search className="w-3.5 h-3.5 text-gold-400" />
                    <span>Interest Finder & Hidden Audiences</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-500" />
                </Link>
                <Link 
                  href="/prompt-builder"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#141a29] text-xs text-gray-300 hover:text-gold-300 hover:bg-[#1a2336] transition-all cursor-pointer"
                >
                  <span className="flex items-center space-x-2">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Prompt Builder (AIDA / PAS)</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-500" />
                </Link>
              </div>
            </div>
            <div className="text-[11px] text-gray-500 flex items-center space-x-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>พร้อมสำหรับการยิงแอดวันแรก</span>
            </div>
          </div>

          {/* Phase 2 */}
          <div className="p-6 rounded-2xl bg-[#0e131e] border border-[#1d263b] hover:border-gold-500/30 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  ขั้นที่ 2 • ระหว่างยิงแอด
                </span>
                <span className="text-xs text-gray-500">Agent A05, A07 & A08</span>
              </div>
              <h3 className="text-base font-bold text-white">คุมงบและตรวจจับแอดล้า</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                ระบบ 6-Hour Rules เฝ้าตรวจจับทุกการกระตุกของค่าแอด หากแอดตัวไหนเผางบเกินเกณฑ์หรือเริ่มล้า ระบบจะแจ้งเตือนพร้อมหยุดแอดฉุกเฉิน
              </p>
              <div className="space-y-2 pt-2">
                <Link 
                  href="/creative-fatigue"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#141a29] text-xs text-gray-300 hover:text-gold-300 hover:bg-[#1a2336] transition-all cursor-pointer"
                >
                  <span className="flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-rose-400" />
                    <span>Creative Fatigue Analyzer</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-500" />
                </Link>
                <Link 
                  href="/hour-rules"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#141a29] text-xs text-gray-300 hover:text-gold-300 hover:bg-[#1a2336] transition-all cursor-pointer"
                >
                  <span className="flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>6-Hour Rules (Intra-day Fast)</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-500" />
                </Link>
              </div>
            </div>
            <div className="text-[11px] text-gray-500 flex items-center space-x-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>ป้องกันงบรั่วไหลได้ทันที</span>
            </div>
          </div>

          {/* Phase 3 */}
          <div className="p-6 rounded-2xl bg-[#0e131e] border border-[#1d263b] hover:border-gold-500/30 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  ขั้นที่ 3 • หลังได้ผลลัพธ์
                </span>
                <span className="text-xs text-gray-500">Agent A06 & A10</span>
              </div>
              <h3 className="text-base font-bold text-white">หาตัวผู้ชนะแล้วสเกลงบ</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                จัดอันดับกลุ่มเป้าหมายที่สร้างยอดซื้อจริงด้วย Audience Heatmap และขยายงบประมาณ (Budget Scale) ให้ตัวที่ทำ ROAS สูง
              </p>
              <div className="space-y-2 pt-2">
                <Link 
                  href="/topads"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#141a29] text-xs text-gray-300 hover:text-gold-300 hover:bg-[#1a2336] transition-all cursor-pointer"
                >
                  <span className="flex items-center space-x-2">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Top Rank Winner Ads</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-500" />
                </Link>
                <Link 
                  href="/messagetierlist"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#141a29] text-xs text-gray-300 hover:text-gold-300 hover:bg-[#1a2336] transition-all cursor-pointer"
                >
                  <span className="flex items-center space-x-2">
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Message Tier List (Inbox Lead)</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-500" />
                </Link>
              </div>
            </div>
            <div className="text-[11px] text-gray-500 flex items-center space-x-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>ต่อยอดกำไรสูงสุดแบบยั่งยืน</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
