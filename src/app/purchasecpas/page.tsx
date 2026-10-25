'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Campaign } from '@/types';

export default function PurchaseCPASPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    fetch('/api/v2/campaigns')
      .then(res => res.json())
      .then(res => {
        if (res.data) setCampaigns(res.data);
      })
      .catch(() => {});
  }, []);

  const cpasCampaigns = campaigns.filter(c => c.name.toLowerCase().includes('cpas') || c.objective === 'OUTCOME_SALES');
  const totalSpend = cpasCampaigns.reduce((a, c) => a + c.spend, 0);
  const totalPurchases = cpasCampaigns.reduce((a, c) => a + c.purchases, 0);
  const avgRoas = cpasCampaigns.length > 0 
    ? (cpasCampaigns.reduce((a, c) => a + c.roas, 0) / cpasCampaigns.length).toFixed(2)
    : '0.00';

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center space-x-2.5">
          <ShoppingBag className="w-6 h-6 text-gold-400" />
          <span>CPAS Purchase (โฆษณาแคตตาล็อก Shopee / Lazada)</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          ดูแลโดย Agent A13 — ติดตามยอดขายแบบ Collaborative Ads ยิงเข้าหน้าร้านใน Marketplaces
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#0f1420] border border-[#1e273d]">
          <div className="text-xs text-gray-400">ยอดขาย Marketplace (ROAS เฉลี่ย)</div>
          <div className="text-2xl font-bold text-gold-400 mt-1">{avgRoas}x</div>
          <div className="text-[11px] text-emerald-400 mt-0.5">ยอดออเดอร์ {totalPurchases} รายการ</div>
        </div>
        <div className="p-4 rounded-xl bg-[#0f1420] border border-[#1e273d]">
          <div className="text-xs text-gray-400">ค่าแอดใช้ไป (Spend รวม)</div>
          <div className="text-2xl font-bold text-white mt-1">฿{totalSpend.toLocaleString()}</div>
          <div className="text-[11px] text-gray-400 mt-0.5">
            ต้นทุนเฉลี่ย {totalPurchases > 0 ? `฿${(totalSpend / totalPurchases).toFixed(1)} / ออเดอร์` : '-'}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-[#0f1420] border border-[#1e273d]">
          <div className="text-xs text-gray-400">สถานะแคตตาล็อก (Catalog Feed)</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">Ready</div>
          <div className="text-[11px] text-gray-400 mt-0.5">{cpasCampaigns.length} แคมเปญพร้อมขาย</div>
        </div>
      </div>
    </div>
  );
}
