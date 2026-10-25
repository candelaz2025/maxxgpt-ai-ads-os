'use client';

import React from 'react';
import { TrendingDown, AlertTriangle, Pause } from 'lucide-react';
import { MOCK_CAMPAIGNS } from '@/data/mockData';

export default function BottomAdsPage() {
  const bottomAds = [...MOCK_CAMPAIGNS].filter(c => c.roas < 1.5 || c.fatigueStatus === 'saturated');

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center space-x-2.5">
          <TrendingDown className="w-6 h-6 text-rose-500" />
          <span>Bottom Rank Ads (โฆษณาที่ควรพิจารณาตัดงบ / ปิด)</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Surfaced โดย Agent A17 (Bottom Rank Auditor) — คัดกรองตัวที่เผางบสูงแต่คอนเวอร์ชั่นต่ำผิดปกติ
        </p>
      </div>

      <div className="rounded-2xl bg-[#0e131e] border border-[#1d263b] overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#1f283d] bg-[#0c0f18] text-gray-400 text-[11px]">
              <th className="py-3 px-4">ชื่อแคมเปญ</th>
              <th className="py-3 px-3">ยอดใช้จ่าย</th>
              <th className="py-3 px-3">ROAS</th>
              <th className="py-3 px-3">ออเดอร์</th>
              <th className="py-3 px-3">สาเหตุที่ติดอันดับท้าย</th>
              <th className="py-3 px-4 text-right">การจัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#172033]">
            {bottomAds.map(ad => (
              <tr key={ad.id} className="hover:bg-[#121826] transition-colors">
                <td className="py-3.5 px-4 font-semibold text-white max-w-sm truncate">{ad.name}</td>
                <td className="py-3.5 px-3 text-rose-300 font-medium">฿{ad.spend.toLocaleString()}</td>
                <td className="py-3.5 px-3 font-bold text-rose-400 font-mono">{ad.roas}x</td>
                <td className="py-3.5 px-3 text-gray-300">{ad.purchases}</td>
                <td className="py-3.5 px-3 text-xs text-gray-400">
                  {ad.purchases === 0 ? 'ใช้เงินเกิน 500 บาทโดยไม่มีออเดอร์' : 'ความถี่คนเห็นซ้ำ 3.8x ทำให้ CTR ตก'}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button 
                    onClick={() => alert(`Agent A07 ได้ส่งคำสั่งหยุดแคมเปญ ${ad.name} แล้ว`)}
                    className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center space-x-1 ml-auto"
                  >
                    <Pause className="w-3 h-3" />
                    <span>หยุดแอด (Pause)</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
