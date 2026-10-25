'use client';

import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, CheckCircle, TrendingDown, RefreshCw, Sparkles } from 'lucide-react';
import { Campaign } from '@/types';

export default function CreativeFatiguePage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v2/campaigns')
      .then(res => res.json())
      .then(res => {
        if (res.data) setCampaigns(res.data);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const freshCount = campaigns.filter(c => c.fatigueStatus === 'fresh').length;
  const warningCount = campaigns.filter(c => c.fatigueStatus === 'warning').length;
  const saturatedCount = campaigns.filter(c => c.fatigueStatus === 'saturated').length;

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
          <div className="text-2xl font-bold text-white mt-1">{freshCount} รายการ</div>
          <div className="text-[11px] text-gray-400 mt-0.5">Frequency &lt; 2.2x • CTR ยังคงสูง</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0f1420] border border-amber-500/30">
          <div className="text-xs text-amber-400 font-semibold flex items-center space-x-1.5">
            <AlertTriangle className="w-4 h-4" />
            <span>เริ่มมีอาการล้า (Fatigue Warning)</span>
          </div>
          <div className="text-2xl font-bold text-amber-400 mt-1">{warningCount} รายการ</div>
          <div className="text-[11px] text-gray-400 mt-0.5">Frequency 2.2x - 2.8x • CTR เริ่มลดลง</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0f1420] border border-rose-500/40">
          <div className="text-xs text-rose-400 font-semibold flex items-center space-x-1.5">
            <TrendingDown className="w-4 h-4" />
            <span>อิ่มตัว / เผางบ (Saturated / Burned)</span>
          </div>
          <div className="text-2xl font-bold text-rose-400 mt-1">{saturatedCount} รายการ</div>
          <div className="text-[11px] text-rose-300 mt-0.5">Frequency &gt; 2.8x • ควรเปลี่ยนภาพใหม่ทันที</div>
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
                <th className="py-3 px-3">อัตราการคลิก (CTR)</th>
                <th className="py-3 px-3">ยอดใช้จ่าย (Spend)</th>
                <th className="py-3 px-3">ROAS</th>
                <th className="py-3 px-3">สถานะความสดใหม่</th>
                <th className="py-3 px-4 text-right">คำแนะนำจาก AI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#172033]">
              {campaigns.map(camp => (
                <tr key={camp.id} className="hover:bg-[#121826] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white">{camp.name}</div>
                    <div className="text-[10px] text-gray-500 font-mono mt-0.5">{camp.id}</div>
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold text-white">
                    {camp.frequency}x
                  </td>
                  <td className="py-3.5 px-3 font-mono text-indigo-300">
                    {camp.ctr}%
                  </td>
                  <td className="py-3.5 px-3 font-mono text-gray-300">
                    ฿{camp.spend.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold text-gold-400">
                    {camp.roas}x
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      camp.fatigueStatus === 'fresh'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : camp.fatigueStatus === 'warning'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {camp.fatigueStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="text-[11px] text-gray-300">
                      {camp.fatigueStatus === 'fresh' && 'ประสิทธิภาพดีเยี่ยม วิ่งแอดได้ต่อเนื่อง'}
                      {camp.fatigueStatus === 'warning' && 'เริ่มวนซ้ำ เตรียมภาพสำรอง'}
                      {camp.fatigueStatus === 'saturated' && 'กลุ่มเป้าหมายเห็นซ้ำเกินไป ควรเปลี่ยนมุมมอง'}
                    </span>
                  </td>
                </tr>
              ))}

              {campaigns.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    ยังไม่มีแคมเปญที่เชื่อมต่อ กรุณาเชื่อมต่อ Meta หรือซิงค์แคมเปญจริง
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
