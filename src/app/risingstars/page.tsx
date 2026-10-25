'use client';

import React from 'react';
import { Star, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { MOCK_CAMPAIGNS } from '@/data/mockData';

export default function RisingStarsPage() {
  const risingStars = [...MOCK_CAMPAIGNS].filter(c => (c.hookRate || 0) > 45 || c.roas > 4.5);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center space-x-2.5">
          <Star className="w-6 h-6 text-gold-400 fill-gold-400" />
          <span>Rising Stars Ads (โฆษณาดาวรุ่งที่กำลังมาแรง)</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          ตรวจจับโดย Agent A18 — แคมเปญที่เพิ่งรันไม่เกิน 48 ชม. แต่มีอัตราเร่ง (Momentum) และ Hook Rate สูงกว่าค่าเฉลี่ย
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {risingStars.map(star => (
          <div key={star.id} className="p-6 rounded-2xl bg-[#0e131e] border border-gold-500/40 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-gold-500/20 text-gold-300 border border-gold-500/30 flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-gold-400" />
                <span>RISING STAR BADGE</span>
              </span>
              <span className="text-sm font-extrabold text-gold-400">{star.roas}x ROAS</span>
            </div>

            <h3 className="text-sm font-bold text-white">{star.name}</h3>

            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#141a29] text-center text-xs">
              <div>
                <span className="text-[10px] text-gray-400 block">3s Hook Rate</span>
                <span className="font-bold text-gold-400 font-mono text-sm">{star.hookRate}%</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block">15s Hold Rate</span>
                <span className="font-bold text-indigo-300 font-mono text-sm">{star.holdRate}%</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block">CTR</span>
                <span className="font-bold text-emerald-400 font-mono text-sm">{star.ctr}%</span>
              </div>
            </div>

            <button 
              onClick={() => alert(`Agent A06 ได้เตรียมขยายแคมเปญนี้ไปยังกลุ่มเป้าหมาย Broad Audience เรียบร้อย!`)}
              className="w-full py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs transition-all flex items-center justify-center space-x-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>ดันงบตัวนี้ทันที (Early Scale)</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
