'use client';

import React, { useState } from 'react';
import { Video, Sparkles, TrendingUp, AlertCircle, Play, CheckCircle2, Calculator, Plus } from 'lucide-react';
import { MOCK_CAMPAIGNS } from '@/data/mockData';
import { useToast } from '@/components/ui/Toast';

export default function VideoAnalysisPage() {
  const { showToast } = useToast();
  const [videoList, setVideoList] = useState(MOCK_CAMPAIGNS.filter(c => c.hookRate));

  // Interactive Calculator State
  const [calcImpressions, setCalcImpressions] = useState(10000);
  const [calcHookViews, setCalcHookViews] = useState(4200);
  const [calcHoldViews, setCalcHoldViews] = useState(2100);

  const calculatedHookRate = calcImpressions > 0 ? Number(((calcHookViews / calcImpressions) * 100).toFixed(1)) : 0;
  const calculatedHoldRate = calcHookViews > 0 ? Number(((calcHoldViews / calcHookViews) * 100).toFixed(1)) : 0;

  const handleAddVideo = () => {
    const newVideo = {
      id: `camp-${Date.now()}`,
      name: `[NEW REEL] ทดสอบวิดีโอตัวใหม่ (Hook Rate ${calculatedHookRate}%)`,
      status: 'ACTIVE' as const,
      objective: 'OUTCOME_SALES' as const,
      dailyBudget: 2500,
      spend: 1500,
      roas: 4.2,
      purchases: 18,
      costPerPurchase: 83.3,
      cpc: 3.1,
      ctr: 3.8,
      impressions: calcImpressions,
      frequency: 1.1,
      fatigueStatus: 'fresh' as const,
      hookRate: calculatedHookRate,
      holdRate: calculatedHoldRate,
      format: 'Reels 9:16',
      adSetsCount: 1,
      adsCount: 1,
      updatedAt: 'Just now'
    };
    setVideoList(prev => [newVideo, ...prev]);
    showToast('เพิ่มวิดีโอใหม่เข้าสู่รายการวิเคราะห์แล้ว!', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center space-x-2.5">
          <Video className="w-6 h-6 text-gold-400" />
          <span>Video Ads Analysis (วิเคราะห์อัตราการหยุดดู 3 วิ และความต่อเนื่อง)</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          วิเคราะห์คลิป Reels / TikTok format เพื่อดูว่า 3 วินาทีแรกหยุดคนดูได้ดีแค่ไหน (Hook Rate) และดูต่อจนถึง 15 วินาทีหรือไม่ (Hold Rate)
        </p>
      </div>

      {/* Benchmark Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#0f1420] border border-[#1e273d]">
          <div className="text-xs text-gray-400">เกณฑ์มาตรฐาน 3s Hook Rate</div>
          <div className="text-2xl font-bold text-gold-400 mt-1">&gt; 35.0%</div>
          <div className="text-[11px] text-emerald-400 mt-0.5">เกิน 40% ถือเป็นคลิปไวรัล (Top 10%)</div>
        </div>
        <div className="p-4 rounded-xl bg-[#0f1420] border border-[#1e273d]">
          <div className="text-xs text-gray-400">เกณฑ์มาตรฐาน 15s Hold Rate</div>
          <div className="text-2xl font-bold text-indigo-300 mt-1">&gt; 20.0%</div>
          <div className="text-[11px] text-gray-400 mt-0.5">วัดความน่าติดตามของเนื้อหากลางคลิป</div>
        </div>
        <div className="p-4 rounded-xl bg-[#0f1420] border border-[#1e273d]">
          <div className="text-xs text-gray-400">ผู้ดูแลการวิเคราะห์</div>
          <div className="text-2xl font-bold text-white mt-1">Agent A12</div>
          <div className="text-[11px] text-gray-400 mt-0.5">Video Hook Rate & Retention Analyst</div>
        </div>
      </div>

      {/* Interactive Hook Rate & Hold Rate Calculator */}
      <div className="p-6 rounded-2xl bg-[#0e131e] border border-gold-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-gold-400" />
              <span>เครื่องมือคำนวณ Hook Rate & Hold Rate แบบสด (Interactive Calculator)</span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              ใส่ยอด Impressions และจำนวนคนดูเพื่อคำนวณอัตราความสำเร็จและรับคำแนะนำปรับปรุงสคริปต์
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">ยอดการมองเห็น (Impressions)</label>
            <input
              type="number"
              value={calcImpressions}
              onChange={(e) => setCalcImpressions(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-[#141a29] border border-[#232d44] text-xs text-white focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">ยอดคนดูถึง 3 วินาที (3s Video Views)</label>
            <input
              type="number"
              value={calcHookViews}
              onChange={(e) => setCalcHookViews(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-[#141a29] border border-[#232d44] text-xs text-gold-300 font-bold focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">ยอดคนดูถึง 15 วินาที (15s Video Views)</label>
            <input
              type="number"
              value={calcHoldViews}
              onChange={(e) => setCalcHoldViews(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-[#141a29] border border-[#232d44] text-xs text-indigo-300 font-bold focus:outline-none focus:border-gold-500"
            />
          </div>
        </div>

        {/* Calculated Result Card */}
        <div className="p-4 rounded-xl bg-[#141a29] border border-[#232d44] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-6">
            <div>
              <span className="text-[10px] text-gray-400 block font-medium">3-Second Hook Rate</span>
              <span className="text-2xl font-extrabold text-gold-400 font-mono">{calculatedHookRate}%</span>
            </div>
            <div className="h-8 w-px bg-gray-700" />
            <div>
              <span className="text-[10px] text-gray-400 block font-medium">15-Second Hold Rate</span>
              <span className="text-2xl font-extrabold text-indigo-300 font-mono">{calculatedHoldRate}%</span>
            </div>
            <div className="h-8 w-px bg-gray-700" />
            <div>
              <span className="text-[10px] text-gray-400 block font-medium">เกรดคุณภาพ (Grade)</span>
              <span className={`text-sm font-bold ${calculatedHookRate >= 40 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {calculatedHookRate >= 40 ? 'Top 10% ไวรัลวินเนอร์' : 'ปานกลาง (ควรปรับ Hook)'}
              </span>
            </div>
          </div>

          <button
            onClick={handleAddVideo}
            className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs flex items-center space-x-1.5 cursor-pointer shadow-md shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>บันทึกเข้าสู่ตารางติดตาม</span>
          </button>
        </div>
      </div>

      {/* Video Performance Cards */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-white">รายการวิดีโอที่กำลังมอนิเตอร์ ({videoList.length} วิดีโอ)</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {videoList.map(vc => (
            <div key={vc.id} className="p-5 rounded-2xl bg-[#0e131e] border border-[#1d263b] space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white max-w-sm truncate">{vc.name}</h3>
                  <div className="text-[10px] text-gray-500 mt-0.5">ROAS {vc.roas}x • {vc.impressions.toLocaleString()} วิว</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-gold-500/10 text-gold-400 border border-gold-500/30">
                  {vc.format || 'Reels 9:16'}
                </span>
              </div>

              {/* Hook & Hold Bars */}
              <div className="space-y-3 p-3 rounded-xl bg-[#141a29]">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-300 font-medium">3-Second Hook Rate (อัตราหยุดดู 3 วิ)</span>
                    <span className="font-bold text-gold-400 font-mono">{vc.hookRate}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full" 
                      style={{ width: `${Math.min(vc.hookRate || 0, 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-300 font-medium">15-Second Hold Rate (อัตราดูต่อจนถึง 15 วิ)</span>
                    <span className="font-bold text-indigo-300 font-mono">{vc.holdRate}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" 
                      style={{ width: `${Math.min((vc.holdRate || 0) * 2, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* AI Insight */}
              <div className="text-xs text-gray-300 flex items-start space-x-2 pt-1">
                <Sparkles className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  {(vc.hookRate || 0) > 45 ? (
                    <span><strong>วินเนอร์คอนเทนต์:</strong> 3 วิแรกดึงดูดสายตาดีเยี่ยม ควรนำไปตัดต่อ Hook เปิดหัวสำรองอีก 3 แบบเพื่อขยายผล</span>
                  ) : (
                    <span><strong>จุดควรปรับปรุง:</strong> คนเลื่อนผ่านใน 3 วิแรก แนะนำให้ใส่ข้อความพาดหัวตัวใหญ่และซูมภาพสินค้าเร็วขึ้น 1.5 เท่า</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
