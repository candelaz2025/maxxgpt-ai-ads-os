'use client';

import React from 'react';
import { TrendingUp, ArrowUpRight } from 'lucide-react';
import { MOCK_CAMPAIGNS } from '@/data/mockData';

export default function TopAdsPage() {
  const topAds = [...MOCK_CAMPAIGNS].filter(c => c.roas >= 3.5);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center space-x-2.5">
          <TrendingUp className="w-6 h-6 text-emerald-400" />
          <span>Top Rank Winner Ads (โฆษณาผลงานดีเด่น)</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          รวมแคมเปญและโฆษณาที่ทำ ROAS เกินเกณฑ์เป้าหมาย (ROAS &gt; 3.5x) พร้อมปุ่มคำสั่งขยายงบประมาณ
        </p>
      </div>

      <div className="rounded-2xl bg-[#0e131e] border border-[#1d263b] overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#1f283d] bg-[#0c0f18] text-gray-400 text-[11px]">
              <th className="py-3 px-4">ชื่อแคมเปญ</th>
              <th className="py-3 px-3">งบ/วัน</th>
              <th className="py-3 px-3">ยอดใช้จ่าย</th>
              <th className="py-3 px-3">ROAS</th>
              <th className="py-3 px-3">ออเดอร์</th>
              <th className="py-3 px-3">CPA</th>
              <th className="py-3 px-4 text-right">คำแนะนำ AI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#172033]">
            {topAds.map(ad => (
              <tr key={ad.id} className="hover:bg-[#121826] transition-colors">
                <td className="py-3.5 px-4 font-semibold text-white max-w-sm truncate">{ad.name}</td>
                <td className="py-3.5 px-3 text-gray-300">฿{ad.dailyBudget.toLocaleString()}</td>
                <td className="py-3.5 px-3 text-gray-300">฿{ad.spend.toLocaleString()}</td>
                <td className="py-3.5 px-3 font-bold text-gold-400 font-mono text-sm">{ad.roas}x</td>
                <td className="py-3.5 px-3 text-emerald-400 font-bold">{ad.purchases}</td>
                <td className="py-3.5 px-3 text-gray-200">฿{ad.costPerPurchase.toFixed(1)}</td>
                <td className="py-3.5 px-4 text-right">
                  <button 
                    onClick={() => alert(`Agent A06 ได้เตรียมข้อเสนอเพิ่มงบ 20% ให้กับ ${ad.name}`)}
                    className="px-3 py-1 rounded-lg bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs"
                  >
                    สเกลงบ +20%
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
