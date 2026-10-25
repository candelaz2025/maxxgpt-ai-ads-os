'use client';

import React, { useState } from 'react';
import { FileText, Sparkles, Copy, Check, Zap, ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import Link from 'next/link';

const COPYWRITING_FRAMEWORKS = [
  {
    id: 'aida',
    name: 'AIDA Framework (Attention - Interest - Desire - Action)',
    description: 'โครงสร้างคลาสสิกสำหรับสร้างยอดขาย ปูพื้นเปิดปัญหา สร้างความอยากได้ และตบท้ายด้วยโปรโมชั่นเร่งด่วน',
    sampleOutput: `🚨 หยุดปัญหาผิวพัง ใน 7 วัน! ไม่ต้องเลเซอร์แพงๆ (Attention)\n.\nสาวๆ วัย 25+ สังเกตไหม ผิวเริ่มหมอง รูขุมขนกว้าง แต่งหน้าไม่ติด? เซรั่มทั่วไปเติมแค่น้ำ แต่ตัวนี้คือ นวัตกรรม Peptide Barrier Repair เติมลึกถึงชั้นเซลล์ (Interest)\n.\n⭐️ 98% ของผู้ใช้จริงกว่า 50,000 คน ยืนยัน หน้าเนียนใสขึ้นจนคนรอบข้างทัก รอยสิวจางลงชัดเจนในขวดแรก! (Desire)\n.\n🎁 พิเศษเฉพาะวันนี้: ซื้อ 1 แถม 1 ฟรี! แถมส่งด่วนฟรีถึงหน้าบ้าน\n👉 ทักข้อความ Inbox เพื่อรับสิทธิ์ก่อนสินค้าหมด!`
  },
  {
    id: 'pas',
    name: 'PAS Framework (Problem - Agitate - Solution)',
    description: 'เจาะจุดเจ็บปวด (Pain Point) ตอกย้ำความหงุดหงิด แล้วมอบทางออกด้วยสินค้าของคุณทันที',
    sampleOutput: `เหนื่อยไหมกับการต้องตื่นมากลบรองพื้นหนาๆ ทุกเช้า? (Problem)\n.\nยิ่งโบกแป้ง ผิวยิ่งอุดตัน สิวใหม่ยิ่งขึ้น พอส่องกระจกตอนเย็น แป้งตกร่องจนหมดความมั่นใจ... เสียเงินลองครีมมาเป็นหมื่นแต่หน้าก็ยังพังเหมือนเดิม (Agitate)\n.\nจบวงจรนี้ด้วย [ชื่อสินค้า] บูสต์ผิวกลาสสกินตัวจริง เผยผิวสดแบบไม่ต้องพึ่งฟิลเตอร์\n✨ ดูรีวิวจากลูกค้าตัวจริงได้ใต้โพสต์นี้เลย!`
  },
  {
    id: 'hook',
    name: '5 Viral Hooks For Reels / Video (5 ท่อนเปิดคลิปหยุดนิ้ว)',
    description: 'ท่อนเปิด 3 วินาทีแรกที่หยุดสายตาผู้ชมบน Feed และ Reels เพื่อเพิ่ม 3s Hook Rate เกิน 40%',
    sampleOutput: `1. "ถ้าคุณกำลังจะซื้อครีมเคาน์เตอร์แบรนด์... หยุดดูคลิปนี้ก่อน 30 วิ!"\n2. "3 สิ่งที่คนผิวแพ้ง่ายต้องรู้ก่อนหน้าจะพังไปกว่านี้"\n3. "เตือนแล้วนะ! ใครที่มีปัญหารอยสิว อย่าเพิ่งเลื่อนผ่านคลิปนี้"\n4. "ลองมาหมดแล้วเป็นหมื่น สุดท้ายมาจบที่ขวดนี้เฉยเลย"\n5. "ความจริงที่แบรนด์ครีมส่วนใหญ่ไม่เคยบอกคุณเกี่ยวกับผิวติดสาร"`
  }
];

export default function PromptBuilderPage() {
  const { showToast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState(COPYWRITING_FRAMEWORKS[0]);
  const [productName, setProductName] = useState('เซรั่มกู้ผิวใสด่วน Peptide Barrier Repair');
  const [targetAudience, setTargetAudience] = useState('ผู้หญิงวัยทำงาน 24-38 ปี ที่แต่งหน้าทุกวัน');
  const [keyBenefit, setKeyBenefit] = useState('ฟื้นฟูผิวติดสาร รูขุมขนกระชับ หน้าฉ่ำโกลว์ใน 7 วัน');
  const [promoOffer, setPromoOffer] = useState('โปร 1 แถม 1 ฟรี + ส่งด่วนฟรีวันนี้');
  const [copied, setCopied] = useState(false);

  // Dynamic Generator based on user inputs
  const generateCustomCopy = () => {
    if (selectedTemplate.id === 'aida') {
      return `🚨 หยุดปัญหาผิวพัง ใน 7 วัน! ไม่ต้องเลเซอร์แพงๆ
.
สาวๆ ${targetAudience} สังเกตไหม ผิวเริ่มหมอง รูขุมขนกว้าง แต่งหน้าไม่ติด? เซรั่มทั่วไปเติมแค่น้ำ แต่ ${productName} คือนวัตกรรม ${keyBenefit}
.
⭐️ 98% ของผู้ใช้จริงกว่า 50,000 คน ยืนยัน หน้าเนียนใสขึ้นจนคนรอบข้างทัก รอยสิวจางลงชัดเจนในขวดแรก!
.
🎁 สิทธิพิเศษเฉพาะวันนี้: ${promoOffer}
👉 ทักข้อความ Inbox เพื่อรับสิทธิ์ก่อนสินค้าหมด!`;
    } else if (selectedTemplate.id === 'pas') {
      return `เหนื่อยไหมกับการต้องตื่นมากลบรองพื้นหนาๆ ทุกเช้า?
.
ยิ่งโบกแป้ง ผิวยิ่งอุดตัน สิวใหม่ยิ่งขึ้น พอส่องกระจกตอนเย็น แป้งตกร่องจนหมดความมั่นใจ... เสียเงินลองครีมมาเป็นหมื่นแต่หน้าก็ยังพังเหมือนเดิม
.
จบวงจรนี้ด้วย ${productName} ที่ช่วย ${keyBenefit} เผยผิวสดแบบไม่ต้องพึ่งฟิลเตอร์
✨ พิเศษ: ${promoOffer} ทักแชทสั่งซื้อได้เลยค่ะ!`;
    } else {
      return `1. "ถ้าคุณกำลังจะซื้อครีมเคาน์เตอร์แบรนด์... หยุดดูคลิปนี้ก่อน 30 วิ!"
2. "3 สิ่งที่คน ${targetAudience} ต้องรู้ก่อนผิวจะพังไปกว่านี้"
3. "เตือนแล้วนะ! ใครที่มีปัญหาหน้าหมอง อย่าเพิ่งเลื่อนผ่านคลิปนี้"
4. "ลองมาหมดแล้วเป็นหมื่น สุดท้ายมาจบที่ ${productName} ตัวนี้เฉยเลย"
5. "ความลับที่แบรนด์ครีมไม่เคยบอก: ${keyBenefit}"`;
    }
  };

  const currentGeneratedCopy = generateCustomCopy();

  const handleCopy = () => {
    navigator.clipboard.writeText(currentGeneratedCopy);
    setCopied(true);
    showToast('คัดลอกบทโฆษณา Direct-Response ลงคลิปบอร์ดแล้ว!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center space-x-2.5">
          <FileText className="w-6 h-6 text-gold-400" />
          <span>Prompt Builder (คลัง Prompt เขียนแคปชั่นโฆษณาขายดี)</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          ขับเคลื่อนโดย Agent A20 (Prompt Architect) — สร้างแคปชั่นโฆษณาตรงกลุ่มเป้าหมายตามหลัก Direct-Response Copywriting
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form & Template Select */}
        <div className="lg:col-span-2 space-y-6">
          {/* Template Selector Cards */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-gray-300 block">เลือกโครงสร้างโฆษณา (Framework)</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {COPYWRITING_FRAMEWORKS.map(template => {
                const isSelected = selectedTemplate.id === template.id;
                return (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template)}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gold-500/10 border-gold-500/60 shadow-lg shadow-gold-500/5'
                        : 'bg-[#0e131e] border-[#1d263b] hover:border-gold-500/30'
                    }`}
                  >
                    <div className="text-xs font-bold text-white mb-1">{template.name.split(' (')[0]}</div>
                    <div className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">{template.description}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input Form Fields */}
          <div className="p-6 rounded-2xl bg-[#0e131e] border border-[#1d263b] space-y-4">
            <h2 className="text-xs font-bold text-gold-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4" />
              <span>ปรับแต่งข้อมูลสินค้าเฉพาะของคุณ</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-gray-300 font-medium">ชื่อสินค้า / บริการ</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="เช่น ครีมบำรุงผิวหน้า..."
                  className="w-full px-3 py-2 rounded-lg bg-[#141a29] border border-[#232d44] text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-medium">กลุ่มเป้าหมาย (Target Audience)</label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="เช่น ผู้หญิงอายุ 25-45 ปี..."
                  className="w-full px-3 py-2 rounded-lg bg-[#141a29] border border-[#232d44] text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-medium">จุดขายเด่น / ผลลัพธ์ (Key Benefit)</label>
                <input
                  type="text"
                  value={keyBenefit}
                  onChange={(e) => setKeyBenefit(e.target.value)}
                  placeholder="เช่น ผิวใสใน 7 วัน..."
                  className="w-full px-3 py-2 rounded-lg bg-[#141a29] border border-[#232d44] text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-medium">ข้อเสนอเร่งด่วน (Offer / Promo)</label>
                <input
                  type="text"
                  value={promoOffer}
                  onChange={(e) => setPromoOffer(e.target.value)}
                  placeholder="เช่น 1 แถม 1 เฉพาะวันนี้..."
                  className="w-full px-3 py-2 rounded-lg bg-[#141a29] border border-[#232d44] text-white focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Output Preview */}
        <div className="p-6 rounded-2xl bg-[#0e131e] border border-gold-500/30 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                <Zap className="w-4 h-4 text-gold-400" />
                <span>ตัวอย่างบทโฆษณาที่ระบบสร้างสด</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-gold-500/10 text-gold-300 font-mono">
                {selectedTemplate.id.toUpperCase()}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#141a29] border border-[#212b40] text-xs text-gray-200 whitespace-pre-wrap leading-relaxed max-h-[380px] overflow-y-auto font-sans">
              {currentGeneratedCopy}
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={handleCopy}
              className="w-full py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'คัดลอกบทโฆษณาแล้ว!' : 'คัดลอกนำไปยิงแอด (Copy Text)'}</span>
            </button>

            <Link
              href="/ai-tools"
              className="w-full py-2 rounded-xl bg-[#141a29] hover:bg-[#1a2336] text-gray-300 hover:text-white border border-[#222c42] text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
            >
              <span>นำไปปล่อยแคมเปญใน Ad Launcher</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
