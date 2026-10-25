'use client';

import React from 'react';
import { Sparkles, Trophy, ArrowUpRight, TrendingUp, CheckCircle2 } from 'lucide-react';
import { MOCK_CAMPAIGNS } from '@/data/mockData';

export default function AdSpotlightPage() {
  const topCreatives = [...MOCK_CAMPAIGNS].sort((a, b) => b.roas - a.roas).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center space-x-2.5">
          <Sparkles className="w-6 h-6 text-gold-400" />
          <span>Ad Spotlight (สปอตไลท์ชิ้นงานโฆษณาระดับท็อป)</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          ถอดรหัสชิ้นงานโฆษณาที่สร้างยอดขายและ ROAS สูงสุดในบัญชีของคุณ เพื่อนำองค์ประกอบความสำเร็จไปต่อยอด
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topCreatives.map((ad, idx) => (
          <div key={ad.id} className="p-6 rounded-2xl bg-[#0e131e] border border-gold-500/30 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gold-500/20 text-gold-300 font-bold">
                  RANK #{idx + 1} WINNER
                </span>
                <span className="text-sm font-extrabold text-gold-400">{ad.roas}x ROAS</span>
              </div>

              <h3 className="text-sm font-bold text-white line-clamp-2">{ad.name}</h3>

              <div className="p-3 rounded-xl bg-[#141a29] space-y-1 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>ยอดใช้จ่าย:</span>
                  <span className="text-white font-medium">฿{ad.spend.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>ออเดอร์สะสม:</span>
                  <span className="text-emerald-400 font-bold">{ad.purchases} ชิ้น</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Hook Rate (3s):</span>
                  <span className="text-indigo-300 font-mono">{ad.hookRate}%</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#1a2336] text-[11px] text-gray-400 flex items-center justify-between">
              <span>ดูแลโดย: Agent A16</span>
              <button 
                onClick={() => alert(`Agent A21 จะนำองค์ประกอบของ ${ad.name} ไปแตกเป็น 5 Hook ใหม่`)}
                className="text-gold-400 font-semibold hover:underline flex items-center"
              >
                <span>แตกไอเดียเพิ่ม</span>
                <ArrowUpRight className="w-3 h-3 ml-0.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
