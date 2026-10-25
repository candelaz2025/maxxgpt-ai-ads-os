'use client';

import React, { useState, useEffect } from 'react';
import { Video, Sparkles, TrendingUp, AlertCircle, Play, CheckCircle2, Calculator, Plus } from 'lucide-react';
import { Campaign } from '@/types';
import { useToast } from '@/components/ui/Toast';

export default function VideoAnalysisPage() {
  const { showToast } = useToast();
  const [videoList, setVideoList] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Interactive Calculator State
  const [calcImpressions, setCalcImpressions] = useState(10000);
  const [calcHookViews, setCalcHookViews] = useState(4200);
  const [calcHoldViews, setCalcHoldViews] = useState(2100);

  const calculatedHookRate = calcImpressions > 0 ? Number(((calcHookViews / calcImpressions) * 100).toFixed(1)) : 0;
  const calculatedHoldRate = calcHookViews > 0 ? Number(((calcHoldViews / calcHookViews) * 100).toFixed(1)) : 0;

  useEffect(() => {
    fetch('/api/v2/campaigns')
      .then(res => res.json())
      .then(res => {
        if (res.data) {
          const videos = res.data.filter((c: Campaign) => (c.hookRate && c.hookRate > 0) || c.format?.includes('Reel') || c.format?.includes('Video'));
          setVideoList(videos.length > 0 ? videos : res.data);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const handleAddVideo = async () => {
    const newVideo = {
      name: `[NEW REEL] ทดสอบวิดีโอตัวใหม่ (Hook Rate ${calculatedHookRate}%)`,
      objective: 'OUTCOME_SALES',
      dailyBudget: 2500,
      format: 'Reels 9:16'
    };

    try {
      const res = await fetch('/api/v2/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_campaign', newCampaign: newVideo })
      });
      const data = await res.json();
      if (data.success && data.createdCampaign) {
        setVideoList(prev => [data.createdCampaign, ...prev]);
        showToast('บันทึกแคมเปญวิดีโอใหม่เข้าสู่ระบบเรียบร้อย!', 'success');
      }
    } catch {
      showToast('การเพิ่มแคมเปญขัดข้อง', 'error');
    }
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
          <div className="flex items-center space-x-2">
            <Calculator className="w-5 h-5 text-gold-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">เครื่องคำนวณและจำลอง Hook Rate แบบอินเตอร์แอคทีฟ</h2>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded bg-gold-500/10 text-gold-300 font-mono">Live Formula Simulation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-gray-300">จำนวนการแสดงผล (Impressions)</label>
            <input
              type="number"
              value={calcImpressions}
              onChange={(e) => setCalcImpressions(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-[#141a29] border border-[#232d44] text-white font-mono focus:border-gold-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-gray-300">คนดูคลิปเกิน 3 วินาที (3s Video Plays)</label>
            <input
              type="number"
              value={calcHookViews}
              onChange={(e) => setCalcHookViews(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-[#141a29] border border-[#232d44] text-white font-mono focus:border-gold-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-gray-300">คนดูคลิปเกิน 15 วินาที (15s ThruPlays)</label>
            <input
              type="number"
              value={calcHoldViews}
              onChange={(e) => setCalcHoldViews(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-[#141a29] border border-[#232d44] text-white font-mono focus:border-gold-500"
            />
          </div>
        </div>

        {/* Calculated Result Display */}
        <div className="p-4 rounded-xl bg-[#141926] border border-[#212b40] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-6 text-xs">
            <div>
              <span className="text-gray-400 block">3-Second Hook Rate:</span>
              <strong className="text-xl font-bold text-gold-400 font-mono">{calculatedHookRate}%</strong>
            </div>
            <div>
              <span className="text-gray-400 block">15-Second Hold Rate:</span>
              <strong className="text-xl font-bold text-indigo-300 font-mono">{calculatedHoldRate}%</strong>
            </div>
            <div>
              <span className="text-gray-400 block">การประเมินจากระบบ:</span>
              <span className={`text-xs font-bold ${calculatedHookRate >= 35 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {calculatedHookRate >= 35 ? '✅ ผ่านเกณฑ์ไวรัลระดับสูง' : '⚠️ ควรปรับปรุง 3 วินาทีแรก'}
              </span>
            </div>
          </div>

          <button
            onClick={handleAddVideo}
            className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>สร้างแคมเปญด้วยสถิตินี้</span>
          </button>
        </div>
      </div>

      {/* Video Campaigns Table */}
      <div className="rounded-2xl bg-[#0e131e] border border-[#1d263b] overflow-hidden">
        <div className="p-4 border-b border-[#1c2438] flex items-center justify-between">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">
            รายการแคมเปญวิดีโอที่กำลังวิเคราะห์ ({videoList.length})
          </h2>
          <span className="text-[11px] text-gray-400">อัปเดตจาก Meta Graph API</span>
        </div>

        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#1f283d] bg-[#0c0f18] text-gray-400 text-[11px]">
              <th className="py-3 px-4">ชื่อวิดีโอแอด / รูปแบบ</th>
              <th className="py-3 px-3">ยอดวิว (Impressions)</th>
              <th className="py-3 px-3">3s Hook Rate</th>
              <th className="py-3 px-3">15s Hold Rate</th>
              <th className="py-3 px-3">ROAS</th>
              <th className="py-3 px-4 text-right">คำแนะนำปรับปรุง Hook</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#172033]">
            {videoList.map(camp => (
              <tr key={camp.id} className="hover:bg-[#121826] transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-white">{camp.name}</div>
                  <div className="text-[10px] text-gray-400 font-mono mt-0.5">{camp.format || 'Reels 9:16'} • {camp.id}</div>
                </td>
                <td className="py-3.5 px-3 font-mono text-gray-300">
                  {camp.impressions?.toLocaleString() || '-'}
                </td>
                <td className="py-3.5 px-3 font-mono font-bold text-gold-400">
                  {camp.hookRate ? `${camp.hookRate}%` : '-'}
                </td>
                <td className="py-3.5 px-3 font-mono text-indigo-300">
                  {camp.holdRate ? `${camp.holdRate}%` : '-'}
                </td>
                <td className="py-3.5 px-3 font-mono text-emerald-400 font-bold">
                  {camp.roas}x
                </td>
                <td className="py-3.5 px-4 text-right">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                    (camp.hookRate || 0) >= 35 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {(camp.hookRate || 0) >= 35 ? 'Hook ทรงพลัง ขยายงบได้' : 'ควรเปลี่ยน 3 วินาทีแรก'}
                  </span>
                </td>
              </tr>
            ))}

            {videoList.length === 0 && !isLoading && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-gray-400">
                  ยังไม่พบแคมเปญวิดีโอบนบัญชีนี้ สามารถใช้เครื่องคำนวณด้านบนเพื่อจำลองอัตรา Hook Rate ได้ทันที
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
