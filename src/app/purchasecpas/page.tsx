'use client';

import React from 'react';
import { ShoppingBag, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { MOCK_CAMPAIGNS } from '@/data/mockData';

export default function PurchaseCPASPage() {
  const cpasCampaign = MOCK_CAMPAIGNS.find(c => c.name.includes('CPAS')) || MOCK_CAMPAIGNS[0];

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
          <div className="text-xs text-gray-400">ยอดขาย Marketplace (CPAS ROAS)</div>
          <div className="text-2xl font-bold text-gold-400 mt-1">4.60x</div>
          <div className="text-[11px] text-emerald-400 mt-0.5">ยอดออเดอร์ 210 รายการ</div>
        </div>
        <div className="p-4 rounded-xl bg-[#0f1420] border border-[#1e273d]">
          <div className="text-xs text-gray-400">ค่าแอดใช้ไป (CPAS Spend)</div>
          <div className="text-2xl font-bold text-white mt-1">฿18,900</div>
          <div className="text-[11px] text-gray-400 mt-0.5">ต้นทุนเฉลี่ย ฿90 / ออเดอร์</div>
        </div>
        <div className="p-4 rounded-xl bg-[#0f1420] border border-[#1e273d]">
          <div className="text-xs text-gray-400">สถานะแคตตาล็อก (Catalog Feed)</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">100% Synced</div>
          <div className="text-[11px] text-gray-400 mt-0.5">เชื่อมต่อ Brand Portal สำเร็จ</div>
        </div>
      </div>
    </div>
  );
}
