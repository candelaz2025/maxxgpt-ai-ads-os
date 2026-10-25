'use client';

import React, { useState } from 'react';
import { Sparkles, ShieldCheck, CheckCircle2, ArrowRight, Activity, AlertCircle } from 'lucide-react';

export default function AIImproveCampaignPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [healthScore, setHealthScore] = useState(88);

  const handleRunAudit = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setHealthScore(92);
      alert('Agent A22 (AI Campaign Doctor) ได้วิเคราะห์ความเสี่ยงการประมูลชนกันและโครงสร้างบัญชีเรียบร้อย!');
    }, 1000);
  };

  const recommendations = [
    {
      id: 'rec-1',
      title: 'แก้ไขปัญหา Auction Overlap (กลุ่มเป้าหมายชนกันเอง)',
      description: 'พบ AdSet #1 และ AdSet #2 ประมูลแข่งกันเอง 18% ในกลุ่มผู้หญิงอายุ 25-35 ปี',
      impact: 'ประหยัดงบได้ 12%',
      actionText: 'Exclude กลุ่มซ้ำอัตโนมัติ'
    },
    {
      id: 'rec-2',
      title: 'เพิ่มชิ้นงานวิดีโอ Reels 9:16 ในแคมเปญ Flash Sale',
      description: 'แคมเปญนี้มีเฉพาะภาพนิ่ง 1:1 การเพิ่มวิดีโอสั้นจะช่วยลดค่า CPM ลงเฉลี่ย 25%',
      impact: 'เพิ่มยอดเข้าถึง +35%',
      actionText: 'ส่งงานให้ Agent A04'
    },
    {
      id: 'rec-3',
      title: 'เปิดใช้งาน Advantage+ Placements เพื่อกระจายทราฟฟิก',
      description: 'ระบบตรวจพบบางชุดโฆษณาจำกัดเฉพาะ Feed อย่างเดียว ทำให้ต้นทุนต่อคลิกแพงขึ้น',
      impact: 'ลด CPC ลง ฿1.20',
      actionText: 'เปิดทุก Placement'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2.5">
            <Sparkles className="w-6 h-6 text-gold-400" />
            <span>AI Improve Campaign (หมอตรวจสุขภาพและวินิจฉัยแคมเปญ)</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            ขับเคลื่อนโดย Agent A22 — ตรวจสอบการประมูลชนกัน (Auction Overlap), ช่วง Learning Phase และโครงสร้างบัญชีโฆษณา
          </p>
        </div>

        <button
          onClick={handleRunAudit}
          disabled={analyzing}
          className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md disabled:opacity-50"
        >
          <Activity className="w-4 h-4" />
          <span>{analyzing ? 'กำลังวิเคราะห์บัญชี...' : 'ตรวจสุขภาพบัญชีใหม่ (Full Audit)'}</span>
        </button>
      </div>

      {/* Health Score Overview */}
      <div className="p-6 rounded-2xl bg-[#0e131e] border border-gold-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            ACCOUNT HEALTH STATUS: EXCELLENT
          </span>
          <h2 className="text-xl font-bold text-white">คะแนนสุขภาพบัญชีโฆษณาโดยรวม</h2>
          <p className="text-xs text-gray-400 max-w-xl">
            โครงสร้างแคมเปญของคุณมีการกระจายงบประมาณที่ดี มีจุดปรับปรุงเล็กน้อย 3 จุดที่จะช่วยลดต้นทุนต่อออเดอร์ลงได้อีก
          </p>
        </div>

        <div className="flex items-center space-x-4 shrink-0 bg-[#141a29] p-4 rounded-xl border border-[#232d44]">
          <div className="text-4xl font-extrabold text-gold-400 font-mono">{healthScore}/100</div>
          <div className="text-xs text-gray-400">
            <div>พร้อมสเกลระดับ Enterprise</div>
            <div className="text-emerald-400 font-semibold mt-0.5">Pixel & CAPI ทำงานสมบูรณ์</div>
          </div>
        </div>
      </div>

      {/* Actionable Recommendations List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white">รายการคำแนะนำที่ควรปรับปรุง (3 Action Items)</h3>

        <div className="space-y-3">
          {recommendations.map(r => (
            <div key={r.id} className="p-5 rounded-xl bg-[#0e131e] border border-[#1d263b] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-bold text-white">{r.title}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold">
                    {r.impact}
                  </span>
                </div>
                <p className="text-xs text-gray-400">{r.description}</p>
              </div>

              <button
                onClick={() => alert(`ดำเนินการ: ${r.actionText} เรียบร้อยแล้ว`)}
                className="px-4 py-2 rounded-lg bg-[#1a2336] hover:bg-gold-500 hover:text-black text-gray-200 text-xs font-semibold shrink-0 transition-all flex items-center space-x-1"
              >
                <span>{r.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
