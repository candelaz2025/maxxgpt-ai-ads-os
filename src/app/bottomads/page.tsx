'use client';

import React, { useState, useEffect } from 'react';
import { TrendingDown, AlertTriangle, Pause } from 'lucide-react';
import { Campaign } from '@/types';
import { useToast } from '@/components/ui/Toast';

export default function BottomAdsPage() {
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

  const bottomAds = campaigns.filter(c => c.roas < 1.5 || (c.spend > 500 && c.purchases === 0) || c.fatigueStatus === 'saturated');

  const handlePause = async (camp: Campaign) => {
    if (!confirm(`คุณต้องการหยุดแคมเปญ "${camp.name}" ใช่หรือไม่?`)) return;
    try {
      const res = await fetch('/api/v2/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'kill_campaign', campaignId: camp.id })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`หยุดแคมเปญ ${camp.name} เรียบร้อยแล้ว (Paused)`, 'success');
        setCampaigns(prev => prev.map(c => c.id === camp.id ? { ...c, status: 'PAUSED' } : c));
      }
    } catch {
      showToast('การสั่งหยุดขัดข้อง', 'error');
    }
  };

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
              <th className="py-3 px-3">สถานะ</th>
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
                <td className="py-3.5 px-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    ad.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-700 text-gray-300'
                  }`}>
                    {ad.status}
                  </span>
                </td>
                <td className="py-3.5 px-3 text-rose-300 font-medium font-mono">฿{ad.spend.toLocaleString()}</td>
                <td className="py-3.5 px-3 font-bold text-rose-400 font-mono">{ad.roas}x</td>
                <td className="py-3.5 px-3 text-gray-300">{ad.purchases}</td>
                <td className="py-3.5 px-3 text-xs text-gray-400">
                  {ad.purchases === 0 ? 'มีค่าใช้จ่ายแต่ยังไม่มีออเดอร์' : 'ROAS ต่ำกว่าเกณฑ์คุ้มทุน (1.5x)'}
                </td>
                <td className="py-3.5 px-4 text-right">
                  {ad.status === 'ACTIVE' ? (
                    <button 
                      onClick={() => handlePause(ad)}
                      className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center space-x-1 ml-auto cursor-pointer"
                    >
                      <Pause className="w-3 h-3" />
                      <span>หยุดแอด (Pause)</span>
                    </button>
                  ) : (
                    <span className="text-gray-500 text-xs">หยุดทำงานแล้ว</span>
                  )}
                </td>
              </tr>
            ))}

            {bottomAds.length === 0 && !isLoading && (
              <tr>
                <td colSpan={7} className="py-12 text-center text-gray-400">
                  {campaigns.length === 0 
                    ? 'ยังไม่มีแคมเปญในระบบ' 
                    : 'ยินดีด้วย! ไม่พบแคมเปญที่ขาดทุนหรือเผางบผิดปกติ'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
