'use client';

import React from 'react';
import { Users, TrendingUp, Sparkles } from 'lucide-react';

export default function AudienceGrowthPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center space-x-2.5">
          <Users className="w-6 h-6 text-gold-400" />
          <span>Audience Growth (การเติบโตของฐานลูกค้าใหม่)</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          วิเคราะห์สัดส่วนระหว่างลูกค้าใหม่ (Prospecting / New Acquisition) และลูกค้าเก่า (Retargeting) ที่กลับมาซื้อซ้ำ
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#0f1420] border border-[#1e273d]">
          <div className="text-xs text-gray-400">สัดส่วนลูกค้าใหม่ (New Customers)</div>
          <div className="text-2xl font-bold text-white mt-1">74.2%</div>
          <div className="text-[11px] text-emerald-400 mt-0.5">+6.5% เมื่อเทียบกับเดือนที่แล้ว</div>
        </div>
        <div className="p-4 rounded-xl bg-[#0f1420] border border-[#1e273d]">
          <div className="text-xs text-gray-400">สัดส่วนลูกค้าซื้อซ้ำ (Returning Buyers)</div>
          <div className="text-2xl font-bold text-gold-400 mt-1">25.8%</div>
          <div className="text-[11px] text-gray-400 mt-0.5">ROAS กลุ่มนี้สูงถึง 6.4x</div>
        </div>
        <div className="p-4 rounded-xl bg-[#0f1420] border border-[#1e273d]">
          <div className="text-xs text-gray-400">ต้นทุนต่อลูกค้ารายใหม่ (CAC)</div>
          <div className="text-2xl font-bold text-indigo-300 mt-1">฿142.0</div>
          <div className="text-[11px] text-emerald-400 mt-0.5">ต่ำกว่าเกณฑ์เฉลี่ยอุตสาหกรรม</div>
        </div>
      </div>
    </div>
  );
}
