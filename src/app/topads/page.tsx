'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, ArrowUpRight, Plus, RefreshCw } from 'lucide-react';
import { Campaign } from '@/types';
import { useToast } from '@/components/ui/Toast';

export default function TopAdsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetch('/api/v2/campaigns')
      .then(res => res.json())
      .then(res => {
        if (res.data) setCampaigns(res.data);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const topAds = campaigns.filter(c => c.roas >= 3.0);

  const handleScale = async (camp: Campaign) => {
    try {
      const res = await fetch('/api/v2/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'scale_budget', campaignId: camp.id, scalePercent: 20 })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`สเกลงบ +20% ให้กับ ${camp.name} เรียบร้อย!`, 'success');
        setCampaigns(prev => prev.map(c => c.id === camp.id ? { ...c, dailyBudget: data.dailyBudget } : c));
      }
    } catch {
      showToast('การสเกลงบล้มเหลว', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center space-x-2.5">
          <TrendingUp className="w-6 h-6 text-emerald-400" />
          <span>Top Rank Winner Ads (โฆษณาผลงานดีเด่น)</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          รวมแคมเปญและโฆษณาที่ทำ ROAS เกินเกณฑ์เป้าหมาย (ROAS &gt; 3.0x) พร้อมปุ่มคำสั่งขยายงบประมาณ
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
                    onClick={() => handleScale(ad)}
                    className="px-3 py-1 rounded-lg bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs cursor-pointer transition-colors"
                  >
                    สเกลงบ +20%
                  </button>
                </td>
              </tr>
            ))}

            {topAds.length === 0 && !isLoading && (
              <tr>
                <td colSpan={7} className="py-12 text-center text-gray-400">
                  {campaigns.length === 0 
                    ? 'ยังไม่มีแคมเปญในระบบ กรุณาเชื่อมต่อ Meta หรือซิงค์ข้อมูล'
                    : 'ยังไม่มีแคมเปญที่ผ่านเกณฑ์ ROAS > 3.0x'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
