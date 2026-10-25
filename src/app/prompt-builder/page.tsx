'use client';

import React, { useState } from 'react';
import { FileText, Sparkles, Copy, Check, Zap, ArrowRight } from 'lucide-react';
import { MOCK_PROMPT_TEMPLATES } from '@/data/mockData';
import { useToast } from '@/components/ui/Toast';
import Link from 'next/link';

export default function PromptBuilderPage() {
  const { showToast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState(MOCK_PROMPT_TEMPLATES[0]);
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
5. "POV: ตอนที่คุณรู้ว่า ${keyBenefit} มีอยู่จริงในราคาหลักร้อย"`;
    }
  };

  const outputText = generateCustomCopy();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('คัดลอกบทโฆษณาลงในคลิปบอร์ดแล้ว!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center space-x-2.5">
          <FileText className="w-6 h-6 text-gold-400" />
          <span>Prompt Builder (คลังพร้อมท์สร้างแคปชั่นและบทโฆษณาขายดี)</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          สร้างบทโฆษณาตามหลักจิตวิทยาการขาย (Direct Response Copywriting) สำหรับ Facebook Ads, Reels และ TikTok
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Custom Inputs & Framework Picker */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-[#0e131e] border border-[#1d263b] space-y-3.5 text-xs">
            <span className="font-bold text-white text-xs block uppercase tracking-wider">
              1. ปรับแต่งข้อมูลสินค้า (Inputs)
            </span>

            <div>
              <label className="text-gray-300 font-semibold block mb-1">ชื่อสินค้า / บริการ</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#141a29] border border-[#232d44] text-white focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="text-gray-300 font-semibold block mb-1">กลุ่มลูกค้าเป้าหมาย (Target Audience)</label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#141a29] border border-[#232d44] text-white focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="text-gray-300 font-semibold block mb-1">จุดขายหลัก / ประโยชน์เด่น (Benefit)</label>
              <input
                type="text"
                value={keyBenefit}
                onChange={(e) => setKeyBenefit(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#141a29] border border-[#232d44] text-white focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="text-gray-300 font-semibold block mb-1">ข้อเสนอพิเศษ (Offer / Promo)</label>
              <input
                type="text"
                value={promoOffer}
                onChange={(e) => setPromoOffer(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#141a29] border border-[#232d44] text-white focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1">
              2. เลือกโมเดลการเขียน (Framework)
            </div>
            {MOCK_PROMPT_TEMPLATES.map(tmpl => (
              <button
                key={tmpl.id}
                onClick={() => setSelectedTemplate(tmpl)}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedTemplate.id === tmpl.id
                    ? 'bg-gold-500/10 border-gold-500/50 text-gold-300 shadow-md'
                    : 'bg-[#0f1420] border-[#1e273d] text-gray-300 hover:bg-[#141a29]'
                }`}
              >
                <div className="font-bold text-xs">{tmpl.name}</div>
                <div className="text-[11px] text-gray-400 mt-1 leading-relaxed">{tmpl.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Col: Output & Generator */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-2xl bg-[#0e131e] border border-[#1d263b] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-gold-400" />
                <span>บทโฆษณาที่สร้างโดย AI ({selectedTemplate.name})</span>
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleCopy(outputText)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#1a2336] hover:bg-gold-500 hover:text-black text-gray-200 text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'คัดลอกเรียบร้อย!' : 'คัดลอกบทนี้'}</span>
                </button>
                <Link
                  href="/ai-tools"
                  className="px-3.5 py-1.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-black text-xs font-bold flex items-center space-x-1 transition-all cursor-pointer shadow-md"
                >
                  <span>นำไปใช้ใน Ad Launcher</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#090c13] border border-[#1a2235] text-xs font-mono text-gray-200 whitespace-pre-line leading-relaxed min-h-[220px]">
              {outputText}
            </div>

            <div className="pt-2 text-[11px] text-gray-500 flex items-center justify-between">
              <span>สร้างโดย: Agent A20 (Copy Architect)</span>
              <span>คำนวณตามหลัก Direct-Response Conversion Optimization</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
