'use client';

import React from 'react';
import { Flame, ArrowUpRight, Sparkles, Share2, ThumbsUp } from 'lucide-react';

export default function PostSpotlightPage() {
  const posts = [
    {
      id: 'post-1',
      title: 'รีวิวพลีชีพ 7 วันหน้าสด จากลูกค้าใช้เซรั่มเปปไทด์',
      likes: 2420,
      comments: 318,
      shares: 489,
      engagementRate: '8.4%',
      status: 'พร้อมบูสต์ (Viral Ready)',
      recommendation: 'คอนเทนต์ออร์แกนิกยอดแชร์สูงมาก แนะนำตั้งแคมเปญ Engagement หรือ Sales ทันที'
    },
    {
      id: 'post-2',
      title: 'วิดีโอแกะกล่องแพ็กของส่งด่วน 100 ออเดอร์แรกของวัน',
      likes: 1140,
      comments: 92,
      shares: 115,
      engagementRate: '5.1%',
      status: 'ปานกลาง',
      recommendation: 'สร้างความน่าเชื่อถือได้ดี เหมาะสำหรับทำเป็น Retargeting Ad'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center space-x-2.5">
          <Flame className="w-6 h-6 text-amber-500" />
          <span>Post Spotlight (สปอตไลท์โพสต์เพจยอดนิยม)</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          ดึงข้อมูลโพสต์บน Facebook Page ออร์แกนิก เพื่อคัดกรองโพสต์ที่มี Engagement สูง และเปลี่ยนเป็นแอดโฆษณาขายดี
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map(p => (
          <div key={p.id} className="p-6 rounded-2xl bg-[#0e131e] border border-[#1d263b] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {p.status}
              </span>
              <span className="text-xs font-mono text-gray-400">ER: {p.engagementRate}</span>
            </div>

            <h3 className="text-sm font-bold text-white leading-snug">{p.title}</h3>

            <div className="flex items-center space-x-4 text-xs text-gray-300">
              <span className="flex items-center space-x-1">
                <ThumbsUp className="w-3.5 h-3.5 text-blue-400" />
                <span>{p.likes.toLocaleString()} ไลก์</span>
              </span>
              <span>{p.comments} คอมเมนต์</span>
              <span className="flex items-center space-x-1">
                <Share2 className="w-3.5 h-3.5 text-gold-400" />
                <span>{p.shares} แชร์</span>
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#141a29] text-xs text-gray-300 leading-relaxed">
              <strong className="text-gold-400">คำแนะนำ:</strong> {p.recommendation}
            </div>

            <button 
              onClick={() => alert(`ส่งโพสต์ "${p.title}" ไปให้ Agent A04 สร้างแคมเปญโฆษณาแล้ว!`)}
              className="w-full py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs transition-all flex items-center justify-center space-x-1.5"
            >
              <span>เปลี่ยนโพสต์นี้เป็นโฆษณา (1-Click Boost)</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
