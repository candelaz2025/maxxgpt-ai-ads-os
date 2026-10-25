'use client';

import React from 'react';
import { Clock, AlertTriangle, CheckCircle, TrendingDown, RefreshCw, Sparkles } from 'lucide-react';
import { MOCK_CAMPAIGNS } from '@/data/mockData';

export default function CreativeFatiguePage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center space-x-2.5">
          <Clock className="w-6 h-6 text-rose-400" />
          <span>Creative Fatigue Analyzer (ตรวจจับโฆษณาที่เริ่มล้า)</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          ระบบตรวจจับความสัมพันธ์ระหว่างความถี่ในการเห็น (Frequency) และอัตราการคลิก (CTR) เพื่อแจ้งเตือนก่อนแอดบวมและ ROAS ตก
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#0f1420] border border-[#1e273d]">
          <div className="text-xs text-emerald-400 font-semibold flex items-center space-x-1.5">
            <CheckCircle className="w-4 h-4" />
            <span>โฆษณาสดใหม่ (Fresh Creatives)</span>
          </div>
          <div className="text-2xl font-bold text-white mt-1">4 รายการ</div>
          <div className="text-[11px] text-gray-400 mt-0.5">Frequency &lt; 2.0x • CTR ยังคงสูง</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0f1420] border border-amber-500/30">
          <div className="text-xs text-amber-400 font-semibold flex items-center space-x-1.5">
            <AlertTriangle className="w-4 h-4" />
            <span>เริ่มมีอาการล้า (Fatigue Warning)</span>
          </div>
          <div className="text-2xl font-bold text-amber-400 mt-1">1 รายการ</div>
          <div className="text-[11px] text-gray-400 mt-0.5">Frequency 2.0x - 3.0x • CTR เริ่มลดลง</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0f1420] border border-rose-500/40">
          <div className="text-xs text-rose-400 font-semibold flex items-center space-x-1.5">
            <TrendingDown className="w-4 h-4" />
            <span>อิ่มตัว / เผางบ (Saturated / Burned)</span>
          </div>
          <div className="text-2xl font-bold text-rose-400 mt-1">1 รายการ</div>
          <div className="text-[11px] text-rose-300 mt-0.5">Frequency &gt; 3.5x • ควรเปลี่ยนภาพใหม่ทันที</div>
        </div>
      </div>

      {/* Fatigue Table */}
      <div className="rounded-2xl bg-[#0e131e] border border-[#1d263b] overflow-hidden">
        <div className="p-4 border-b border-[#1c2438] flex items-center justify-between text-xs font-semibold text-white">
          <span>รายการตรวจสอบความล้าของชิ้นงานโฆษณา (Creative Saturation Index)</span>
          <span className="text-xs text-gray-400 font-normal">ดูแลโดย Agent A05</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1f283d] bg-[#0c0f18] text-gray-400 text-[11px]">
                <th className="py-3 px-4">ชื่อแคมเปญ</th>
                <th className="py-3 px-3">ความถี่ (Frequency)</th>
                <th className="py-3 px-3">CTR เฉลี่ย</th>
                <th className="py-3 px-3">ROAS</th>
                <th className="py-3 px-3">สถานะความสดใหม่</th>
                <th className="py-3 px-4">คำแนะนำของ Agent A05</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#172033]">
              {MOCK_CAMPAIGNS.map(c => (
                <tr key={c.id} className="hover:bg-[#121826] transition-colors">
                  <td className="py-3.5 px-4 font-medium text-white max-w-sm truncate">{c.name}</td>
                  <td className="py-3.5 px-3 font-mono font-bold text-gray-200">{c.frequency}x</td>
                  <td className="py-3.5 px-3 font-mono text-gray-300">{c.ctr}%</td>
                  <td className="py-3.5 px-3 font-bold text-gold-400">{c.roas}x</td>
                  <td className="py-3.5 px-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                      c.fatigueStatus === 'fresh' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : c.fatigueStatus === 'warning'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse'
                    }`}>
                      {c.fatigueStatus.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-gray-300">
                    {c.fatigueStatus === 'fresh' && 'ประสิทธิภาพยอดเยี่ยม ปล่อยให้ระบบ AI รันต่อเนื่อง'}
                    {c.fatigueStatus === 'warning' && 'เริ่มมีคนเห็นซ้ำบ่อย แนะนำเตรียมภาพสำรองหรือขยาย Interest'}
                    {c.fatigueStatus === 'saturated' && 'คนเห็นซ้ำ 3.8x แล้ว! แนะนำให้หยุดแล้วขึ้น Creative ชุดใหม่ทันที'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
