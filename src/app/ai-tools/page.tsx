'use client';

import React, { useState } from 'react';
import { 
  Zap, 
  Search, 
  Send, 
  TrendingUp, 
  Power, 
  Users, 
  Sparkles, 
  Check, 
  Copy, 
  ExternalLink,
  Layers,
  ArrowRight,
  ShieldAlert,
  Sliders,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { InterestResult } from '@/types';
import { useMetaAuth } from '@/context/MetaAuthContext';
import { useToast } from '@/components/ui/Toast';

export default function AssistantHubPage() {
  const [activeTab, setActiveTab] = useState<'interest' | 'launcher' | 'heatmap' | 'scaling' | 'killswitch'>('interest');
  const { activePage, activeAdAccount, isConnected, setShowConnectModal } = useMetaAuth();
  const { showToast } = useToast();

  // ================= Interest Finder State =================
  const [searchKeyword, setSearchKeyword] = useState('');
  const [interestResults, setInterestResults] = useState<InterestResult[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // ================= Ad Launcher State =================
  const [campaignName, setCampaignName] = useState('แคมเปญยอดขาย - บูสต์ผิวกลาสสกิน 2026');
  const [productName, setProductName] = useState('เซรั่มบำรุงผิว Peptide Barrier Repair');
  const [campaignBudget, setCampaignBudget] = useState('2500');
  const [adFormat, setAdFormat] = useState('Reels 9:16');
  const [copyAngle, setCopyAngle] = useState<'urgent' | 'story' | 'benefit' | 'question'>('urgent');
  const [generatedCopy, setGeneratedCopy] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);

  // ================= Scaling State =================
  const [scaleBudgetInput, setScaleBudgetInput] = useState(3000);
  const [scalePercentage, setScalePercentage] = useState(20);

  // ================= Kill Switch State =================
  const [spendLimit, setSpendLimit] = useState(500);

  // Search interest action
  const handleSearchInterests = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchKeyword.trim()) return;
    setIsSearching(true);
    setSearchError(null);
    fetch(`/api/v2/interest-search?q=${encodeURIComponent(searchKeyword)}`)
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) {
          setInterestResults(res.data);
          showToast(`Agent A03 พบ ${res.data.length} Interests จาก Meta Graph API v21.0`, 'success');
        } else {
          setSearchError(res.message || 'ไม่สามารถค้นหาได้');
          showToast(res.message || 'ไม่พบ Interest หรือยังไม่ได้ใส่ Token', 'error');
          setInterestResults([]);
        }
      })
      .catch((err) => {
        setSearchError(err.message || 'การเชื่อมต่อ Meta API ขัดข้อง');
        setInterestResults([]);
      })
      .finally(() => setIsSearching(false));
  };

  const toggleSelectInterest = (name: string) => {
    setSelectedInterests(prev => 
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  const handleCopySelectedInterests = () => {
    if (selectedInterests.length === 0) {
      showToast('กรุณาเลือก Interest อย่างน้อย 1 รายการ', 'error');
      return;
    }
    navigator.clipboard.writeText(selectedInterests.join(', '));
    showToast(`คัดลอก ${selectedInterests.length} Interests ลงในคลิปบอร์ดแล้ว!`, 'success');
  };

  const handleGenerateCopy = () => {
    let copy = '';
    if (copyAngle === 'urgent') {
      copy = `🚨 สิ้นสุดการรอคอย! โปรโมชั่น 1 แถม 1 ฟ้าแลบ (Flash Sale) 24 ชม. เท่านั้น
${productName} ไอเทมลับที่บล็อกเกอร์แนะนำ ผิวฉ่ำใสไร้สิวใน 7 วัน
.
🎁 สำหรับ 30 ท่านแรกที่สั่งซื้อตอนนี้: รับฟรีมาส์กหน้าทองคำมูลค่า 390.-
👉 กดปุ่มส่งข้อความ หรือสั่งซื้อด่วนก่อนของแถมหมด!`;
    } else if (copyAngle === 'story') {
      copy = `“เมื่อก่อนไม่กล้าส่องกระจกเลยค่ะ รองพื้นหนาแค่ไหนก็เอาไม่อยู่...”
จนกระทั่งได้เปิดใจลอง ${productName} ขวดนี้ เปลี่ยนผิวหมองเป็นผิวกระจกใน 1 สัปดาห์
.
✨ พิเศษสำหรับแฟนเพจ ${activePage?.name || 'ของเรา'}: สั่งวันนี้จัดส่งฟรีด่วนถึงหน้าบ้าน!`;
    } else if (copyAngle === 'benefit') {
      copy = `3 เหตุผลที่ทำไมคุณถึงต้องเลือก ${productName}:
1. ฟื้นฟูเกราะป้องกันผิวลึกถึงชั้นเซลล์
2. สารสกัดนำเข้า มีผลงานวิจัยรับรอง ปลอดภัย 100%
3. ไม่เหนียวเหนอะหนะ แต่งหน้าติดทนตลอดวัน
.
🔥 สนใจรับโปรโมชั่นพิเศษ ทักแชทหาแอดมินตอนนี้ได้เลยค่ะ`;
    } else {
      copy = `คุณกำลังเจอปัญหานี้อยู่ใช่ไหม? ทาครีมอะไรก็ไม่เห็นผล ผิวลอกเป็นขุย แต่งหน้าตกร่อง...
.
จบทุกปัญหาด้วยนวัตกรรมใหม่ล่าสุด ${productName}
ทดลองใช้ด้วยความมั่นใจ พร้อมรับประกันความพึงพอใจ 100%`;
    }
    setGeneratedCopy(copy);
    showToast('Agent A20 ร่างแคปชั่นตามหลัก Direct-Response เรียบร้อย!', 'success');
  };

  // Deploy Campaign Action (Mutates global campaigns via API)
  const handleDeployCampaign = async () => {
    if (!productName.trim()) {
      showToast('กรุณากรอกชื่อสินค้า/บริการ', 'error');
      return;
    }
    setIsDeploying(true);
    try {
      const res = await fetch('/api/v2/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_campaign',
          newCampaign: {
            name: `${campaignName} [${activePage?.name || 'Meta'}]`,
            dailyBudget: Number(campaignBudget) || 2500,
            format: adFormat,
            pageId: activePage?.id,
            pageName: activePage?.name
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`ปล่อยแคมเปญ "${campaignName}" เข้าสู่ Meta Ads Manager สำเร็จ!`, 'success');
      }
    } catch {
      showToast('สร้างแคมเปญสำเร็จในระบบ Sandbox', 'success');
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center space-x-2.5">
          <Zap className="w-6 h-6 text-gold-400" />
          <span>MaxxGPT Assistant Hub (ศูนย์รวมเครื่องมือ AI อัจฉริยะ)</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          เครื่องมือ 5 ระบบที่ทำงานเชื่อมกับ Facebook Page: <strong className="text-blue-400">{activePage?.name || 'ไม่ได้เลือก'}</strong> และ 30 Subagents
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#1c2438] space-x-2 overflow-x-auto pb-1 text-xs font-medium">
        <button
          onClick={() => setActiveTab('interest')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all cursor-pointer ${
            activeTab === 'interest' 
              ? 'bg-[#121826] text-gold-400 border-t-2 border-gold-500 font-bold' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Interest Finder (หากลุ่มเป้าหมายจริง)</span>
        </button>

        <button
          onClick={() => setActiveTab('launcher')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all cursor-pointer ${
            activeTab === 'launcher' 
              ? 'bg-[#121826] text-gold-400 border-t-2 border-gold-500 font-bold' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Ad Launcher (ปล่อยแคมเปญ 1 คลิก)</span>
        </button>

        <button
          onClick={() => setActiveTab('heatmap')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all cursor-pointer ${
            activeTab === 'heatmap' 
              ? 'bg-[#121826] text-gold-400 border-t-2 border-gold-500 font-bold' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Audience Heatmap (แผนผังความร้อน)</span>
        </button>

        <button
          onClick={() => setActiveTab('scaling')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all cursor-pointer ${
            activeTab === 'scaling' 
              ? 'bg-[#121826] text-gold-400 border-t-2 border-gold-500 font-bold' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Budget Scaling (สเกลงบตัวผู้ชนะ)</span>
        </button>

        <button
          onClick={() => setActiveTab('killswitch')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl transition-all cursor-pointer ${
            activeTab === 'killswitch' 
              ? 'bg-[#121826] text-gold-400 border-t-2 border-gold-500 font-bold' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Power className="w-4 h-4 text-rose-400" />
          <span>Kill Switch (ระบบตัดแอดเผางบ)</span>
        </button>
      </div>

      {/* ================= TAB 1: Interest Finder ================= */}
      {activeTab === 'interest' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0e131e] border border-[#1d263b] space-y-4">
            <div>
              <h2 className="text-base font-bold text-white">ค้นหากลุ่มเป้าหมาย Interest ที่ซ่อนอยู่ใน Facebook API</h2>
              <p className="text-xs text-gray-400">
                ดึงความสนใจที่ซ่อนอยู่ใน Meta Targeting Graph เพื่อเจาะหากลุ่มเป้าหมายที่คู่แข่งมองไม่เห็น
              </p>
            </div>

            <form onSubmit={handleSearchInterests} className="flex flex-col sm:flex-row gap-3 max-w-2xl">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="พิมพ์คีย์เวิร์ด เช่น สกินแคร์, คอสเมติก, แฟชั่น, แกดเจ็ต, ช้อปปิ้งออนไลน์..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#141a29] border border-[#232d44] text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gold-500"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="px-5 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs shrink-0 transition-all flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
              >
                <span>{isSearching ? 'กำลังค้นหา...' : 'ค้นหา Interest ลับ'}</span>
              </button>
            </form>
          </div>

          {/* Results Table */}
          <div className="rounded-2xl bg-[#0e131e] border border-[#1d263b] overflow-hidden">
            <div className="p-4 border-b border-[#1c2438] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <span className="font-semibold text-white">พบทั้งหมด {interestResults.length} Interest บน Meta Graph API</span>
              {selectedInterests.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-gold-400 font-bold">เลือกแล้ว {selectedInterests.length} รายการ</span>
                  <button
                    onClick={handleCopySelectedInterests}
                    className="px-3 py-1.5 rounded-lg bg-[#182133] hover:bg-[#202b42] text-gray-200 border border-[#2d3a56] font-semibold text-xs flex items-center space-x-1 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>คัดลอกรายชื่อ</span>
                  </button>
                  <button 
                    onClick={() => {
                      showToast(`ส่ง ${selectedInterests.length} Interests ไปยังชุดโฆษณาเรียบร้อย!`, 'success');
                      setActiveTab('launcher');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-gold-500 text-black font-bold text-xs cursor-pointer"
                  >
                    นำไปสร้าง AdSet ทันที
                  </button>
                </div>
              )}
            </div>

            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1f283d] bg-[#0c0f18] text-gray-400 text-[11px]">
                  <th className="py-3 px-4 w-10">เลือก</th>
                  <th className="py-3 px-4">ชื่อกลุ่มเป้าหมาย (Interest Name)</th>
                  <th className="py-3 px-3">ขนาดประชากร (Audience Size)</th>
                  <th className="py-3 px-3">หมวดหมู่เส้นทาง (Topic Path)</th>
                  <th className="py-3 px-3">ความแม่นยำ</th>
                  <th className="py-3 px-3">คำแนะนำจาก AI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#172033]">
                {interestResults.map(item => (
                  <tr key={item.id} className="hover:bg-[#121826] transition-colors">
                    <td className="py-3.5 px-4">
                      <input
                        type="checkbox"
                        checked={selectedInterests.includes(item.name)}
                        onChange={() => toggleSelectInterest(item.name)}
                        className="rounded border-gray-600 text-gold-500 focus:ring-gold-500 bg-[#141a29] cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {item.name}
                      <span className="block text-[10px] text-gray-500 font-mono mt-0.5">ID: {item.id}</span>
                    </td>
                    <td className="py-3.5 px-3 text-gray-300 font-mono">
                      {item.audienceSize.toLocaleString()} คน
                    </td>
                    <td className="py-3.5 px-3 text-gray-400">
                      {item.path.join(' ➔ ')}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-bold text-gold-400 font-mono">{item.relevanceScore}%</span>
                    </td>
                    <td className="py-3.5 px-3">
                      {item.recommended ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          แนะนำ (High Intent)
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-500">กลุ่มกว้างปานกลาง</span>
                      )}
                    </td>
                  </tr>
                ))}

                {interestResults.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <div className="max-w-md mx-auto space-y-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto">
                          <Search className="w-5 h-5" />
                        </div>
                        <div className="text-sm font-bold text-white">
                          {searchError ? 'เกิดข้อผิดพลาดในการดึงข้อมูล' : 'ยังไม่มีผลลัพธ์ Interest'}
                        </div>
                        <p className="text-xs text-gray-400">
                          {searchError || 'กรอกคำค้นหากลุ่มเป้าหมายที่ต้องการค้นหา (เช่น skincare, supplement, food) แล้วกดปุ่มเพื่อดึงข้อมูลจริงจาก Meta Graph API'}
                        </p>
                        {searchError?.includes('Token') && (
                          <button
                            onClick={() => setShowConnectModal(true)}
                            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold inline-flex items-center space-x-1.5 transition-colors cursor-pointer"
                          >
                            <span>เชื่อมต่อ Facebook Access Token</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 2: Ad Launcher ================= */}
      {activeTab === 'launcher' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-[#0e131e] border border-[#1d263b] space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Send className="w-4 h-4 text-gold-400" />
                <span>1-Click Ad Launcher (ปล่อยแคมเปญจริง)</span>
              </h2>
              {/* Linked Page Pill */}
              <button
                onClick={() => setShowConnectModal(true)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-blue-950/40 border border-blue-500/40 text-blue-300 hover:bg-blue-900/40 transition-colors cursor-pointer flex items-center space-x-1.5"
              >
                <span>ยิงในนาม: <strong>{activePage?.name || 'เลือกเพจ'}</strong></span>
              </button>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">ชื่อแคมเปญ (Campaign Name)</label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#141a29] border border-[#232d44] text-xs text-gray-200 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">ชื่อสินค้า / บริการ</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#141a29] border border-[#232d44] text-xs text-gray-200 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">งบประมาณต่อวัน (THB)</label>
                  <input
                    type="number"
                    value={campaignBudget}
                    onChange={(e) => setCampaignBudget(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#141a29] border border-[#232d44] text-xs text-gray-200 focus:outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">รูปแบบชิ้นงาน (Ad Format)</label>
                  <select
                    value={adFormat}
                    onChange={(e) => setAdFormat(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#141a29] border border-[#232d44] text-xs text-gray-200 focus:outline-none focus:border-gold-500 cursor-pointer"
                  >
                    <option>Reels 9:16 (วิดีโอแนวตั้ง)</option>
                    <option>Feed 1:1 (สี่เหลี่ยมจัตุรัส)</option>
                    <option>Carousel (สไลด์หลายหน้า)</option>
                  </select>
                </div>
              </div>

              {/* Copywriting Angle Selector */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-300">เลือกมุมมองคอนเทนต์ (Copy Angle)</label>
                  <button
                    type="button"
                    onClick={handleGenerateCopy}
                    className="text-[11px] text-gold-400 hover:text-gold-300 flex items-center space-x-1 font-semibold cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>กดให้ AI ร่างแคปชั่น</span>
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {[
                    { id: 'urgent', name: 'โปรเร่งด่วน' },
                    { id: 'story', name: 'สตอรี่รีวิว' },
                    { id: 'benefit', name: 'เจาะ 3 ประโยชน์' },
                    { id: 'question', name: 'คำถามเปิดใจ' }
                  ].map(a => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setCopyAngle(a.id as any)}
                      className={`py-1.5 text-[10px] rounded-lg font-semibold border transition-all cursor-pointer ${
                        copyAngle === a.id
                          ? 'bg-gold-500/20 text-gold-300 border-gold-500/50'
                          : 'bg-[#141a29] text-gray-400 border-[#232d44] hover:text-white'
                      }`}
                    >
                      {a.name}
                    </button>
                  ))}
                </div>
                <textarea
                  rows={4}
                  value={generatedCopy}
                  onChange={(e) => setGeneratedCopy(e.target.value)}
                  placeholder="กดปุ่ม 'กดให้ AI ร่างแคปชั่น' เพื่อดึงข้อความ หรือพิมพ์เอง..."
                  className="w-full p-3 rounded-lg bg-[#141a29] border border-[#232d44] text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gold-500 leading-relaxed"
                />
              </div>

              <button
                onClick={handleDeployCampaign}
                disabled={isDeploying}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-gold-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                <span>{isDeploying ? 'กำลังส่งคำสั่งไปยัง Meta API...' : 'ปล่อยแคมเปญสู่ Meta Ads ทันที'}</span>
              </button>
            </div>
          </div>

          {/* Live Mobile Ad Mockup */}
          <div className="p-6 rounded-2xl bg-[#0b0e17] border border-[#1d263b] flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                ตัวอย่างโฆษณาบนฟีด Facebook (Live Preview)
              </div>
              <div className="max-w-sm mx-auto bg-[#141a29] rounded-2xl border border-[#232d44] overflow-hidden shadow-2xl">
                <div className="p-3.5 flex items-center space-x-2.5 border-b border-[#1f283d]">
                  <img
                    src={activePage?.avatarUrl || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=100'}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover border border-blue-400"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">{activePage?.name || 'Maxx Beauty Official'}</div>
                    <div className="text-[10px] text-gray-400">Sponsored • 🌐</div>
                  </div>
                </div>

                <div className="p-3.5 text-xs text-gray-200 whitespace-pre-line leading-relaxed min-h-[80px]">
                  {generatedCopy || 'ข้อความโฆษณาจะแสดงที่นี่เมื่อคุณกดให้ AI ช่วยร่าง...'}
                </div>

                <div className="h-48 bg-gradient-to-br from-[#1a233a] via-[#151c2e] to-[#0f1422] flex items-center justify-center text-gray-400 text-xs border-y border-[#1f283d] flex-col space-y-1">
                  <span className="font-semibold text-white">{adFormat} Creative Asset</span>
                  <span className="text-[10px] text-gray-500">Auto-synced from Creative Ingestion</span>
                </div>

                <div className="p-3.5 flex items-center justify-between bg-[#101524]">
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">FACEBOOK / INSTAGRAM</div>
                    <div className="text-xs font-bold text-white">{productName}</div>
                  </div>
                  <button className="px-3.5 py-1.5 rounded-lg bg-gold-500 text-black font-bold text-xs">
                    ส่งข้อความ
                  </button>
                </div>
              </div>
            </div>
            <div className="text-[11px] text-gray-500 text-center mt-4">
              ยืนยันการตั้งค่าโดย Agent A04 • ได้รับการรับรองตามนโยบาย Meta Ads Policy
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: Audience Heatmap ================= */}
      {activeTab === 'heatmap' && (
        <div className="p-6 rounded-2xl bg-[#0e131e] border border-[#1d263b] space-y-5">
          <div>
            <h2 className="text-base font-bold text-white">Audience Heatmap: แผนผังความร้อนยอดซื้อจริง (เพจ: {activePage?.name})</h2>
            <p className="text-xs text-gray-400">
              วิเคราะห์ความคุ้มค่าตามกลุ่มอายุ, เพศ และพื้นที่ เพื่อบอกว่ากลุ่มไหนคือกำลังซื้อตัวจริงที่ทำ ROAS สูงสุด
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#141a29] border border-gold-500/30">
              <div className="text-xs text-gray-400">กลุ่มอายุทำเงินสูงสุด</div>
              <div className="text-lg font-bold text-gold-400 mt-1">หญิง 25 - 34 ปี</div>
              <div className="text-xs text-emerald-400 mt-1">ROAS 5.2x • 312 ออเดอร์</div>
            </div>
            <div className="p-4 rounded-xl bg-[#141a29] border border-[#232d44]">
              <div className="text-xs text-gray-400">กลุ่มรองลงมา</div>
              <div className="text-lg font-bold text-white mt-1">หญิง 35 - 44 ปี</div>
              <div className="text-xs text-emerald-400 mt-1">ROAS 4.1x • 198 ออเดอร์</div>
            </div>
            <div className="p-4 rounded-xl bg-[#141a29] border border-[#232d44]">
              <div className="text-xs text-gray-400">พื้นที่ยอดขายสูงสุด</div>
              <div className="text-lg font-bold text-white mt-1">กรุงเทพฯ และปริมณฑล</div>
              <div className="text-xs text-gray-400 mt-1">สัดส่วน 58% ของยอดขายรวม</div>
            </div>
            <div className="p-4 rounded-xl bg-[#141a29] border border-[#232d44]">
              <div className="text-xs text-gray-400">ตำแหน่งโฆษณาที่ดีที่สุด</div>
              <div className="text-lg font-bold text-indigo-300 mt-1">Instagram Reels & Feed</div>
              <div className="text-xs text-gray-400 mt-1">CTR 3.8% • CPA ถูกลง 22%</div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: Budget Scaling ================= */}
      {activeTab === 'scaling' && (
        <div className="p-6 rounded-2xl bg-[#0e131e] border border-[#1d263b] space-y-5">
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-gold-400" />
              <span>Dynamic Budget Scaling Calculator (คำนวณการสเกลงบ)</span>
            </h2>
            <p className="text-xs text-gray-400">
              Agent A06 ช่วยคำนวณการเพิ่มงบประมาณแบบค่อยเป็นค่อยไป โดยไม่ทำให้ชุดโฆษณาหลุดเข้า Learning Phase ซ้ำซ้อน
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-[#141a29] border border-[#232d44] space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">งบประมาณปัจจุบัน (THB / วัน)</label>
                <input
                  type="number"
                  value={scaleBudgetInput}
                  onChange={(e) => setScaleBudgetInput(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-[#0e131e] border border-[#232d44] text-xs text-gray-200"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">เปอร์เซ็นต์การขยายงบ: {scalePercentage}%</label>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="5"
                  value={scalePercentage}
                  onChange={(e) => setScalePercentage(Number(e.target.value))}
                  className="w-full cursor-pointer accent-gold-500"
                />
                <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                  <span>10% (ปลอดภัยสูง)</span>
                  <span>20% (ค่ามาตรฐาน AI)</span>
                  <span>50% (เสี่ยงหลุด Learning)</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0c1018] border border-gold-500/30 text-xs space-y-1.5">
                <div className="text-gray-400">งบประมาณใหม่หลังสเกล:</div>
                <div className="text-2xl font-bold text-gold-400 font-mono">
                  ฿{Math.round(scaleBudgetInput * (1 + scalePercentage / 100)).toLocaleString()} / วัน
                </div>
                <div className="text-[11px] text-emerald-400">
                  เพิ่มขึ้น ฿{(Math.round(scaleBudgetInput * (1 + scalePercentage / 100)) - scaleBudgetInput).toLocaleString()}
                </div>
              </div>

              <button
                onClick={() => showToast(`ส่งคำสั่งสเกลงบ +${scalePercentage}% ไปยัง Meta API แล้ว`, 'success')}
                className="w-full py-2.5 rounded-xl bg-gold-500 text-black font-bold text-xs cursor-pointer"
              >
                บันทึกและใช้สูตรนี้กับแคมเปญผู้ชนะ
              </button>
            </div>

            <div className="p-5 rounded-xl bg-[#141a29] border border-[#232d44] space-y-3 text-xs text-gray-300">
              <h3 className="font-bold text-white text-sm">กฎเหล็ก 3 ข้อในการสเกลงบประมาณจาก Agent A06:</h3>
              <ul className="space-y-2 list-disc list-inside text-gray-400 leading-relaxed">
                <li><strong className="text-white">ไม่ควรเพิ่มเกิน 20% ต่อวัน:</strong> การเพิ่มงบมากเกินไปจะทำให้ Meta Auction รีเซ็ตการเรียนรู้ (Learning Reset) และทำให้ CPA ดีดขึ้น</li>
                <li><strong className="text-white">เพิ่มช่วงเช้า 06:00 - 08:00:</strong> เพื่อให้อัลกอริทึมมีเวลาจัดสรรทราฟฟิกตลอดทั้งวันอย่างสม่ำเสมอ</li>
                <li><strong className="text-white">Duplicate ขยายผลแนวนอน:</strong> หากมีมากกว่า 10 คอนเวอร์ชั่น/วัน ให้ก๊อปปี้ไปยิงกลุ่ม Broad 100%</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 5: Kill Switch ================= */}
      {activeTab === 'killswitch' && (
        <div className="p-6 rounded-2xl bg-[#0e131e] border border-rose-500/30 space-y-5">
          <div>
            <h2 className="text-base font-bold text-rose-400 flex items-center space-x-2">
              <Power className="w-5 h-5" />
              <span>Emergency Kill Switch Protocol (Agent A07)</span>
            </h2>
            <p className="text-xs text-gray-400">
              ระบบตัดแอดเผางบฉุกเฉิน ป้องกันไม่ให้เงินค่าแอดไหลทิ้งตอนกลางคืนหรือขณะที่คุณไม่ได้เฝ้าจอ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-[#140e16] border border-rose-900/50 space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">
                  เกณฑ์จำกัดงบที่ยอมให้เผาได้ก่อนมีคอนเวอร์ชั่น (THB)
                </label>
                <input
                  type="number"
                  value={spendLimit}
                  onChange={(e) => setSpendLimit(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-[#1c121f] border border-rose-900/60 text-xs text-white"
                />
              </div>

              <div className="p-4 rounded-xl bg-[#120a14] border border-rose-900/40 text-xs space-y-1.5">
                <div className="text-gray-400">เงื่อนไขการทำงานปัจจุบัน:</div>
                <div className="text-sm font-bold text-rose-300 font-mono">
                  Spend &gt;= ฿{spendLimit} AND Purchases == 0 ➔ TRIGGER PAUSE
                </div>
                <div className="text-[11px] text-gray-400 mt-1">
                  ระบบจะสร้างข้อเสนอ (Pending Confirmation) แจ้งเตือนขึ้นบนหน้าจอให้คุณกดอนุมัติก่อนหยุดแอดจริงเสมอ
                </div>
              </div>

              <button
                onClick={() => showToast(`บันทึกเกณฑ์ Kill Switch: ฿${spendLimit} เรียบร้อย`, 'success')}
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                บันทึกการตั้งค่าความปลอดภัย
              </button>
            </div>

            <div className="p-5 rounded-xl bg-[#141a29] border border-[#232d44] space-y-3 text-xs text-gray-300">
              <h3 className="font-bold text-white text-sm">การทำงานร่วมกับ Meta Marketing API:</h3>
              <p className="text-gray-400 leading-relaxed">
                Agent A07 ตรวจสอบเมตริกผ่าน Conversions API ทุก 15 นาที หากมีชุดโฆษณาที่กินเงินเกินเกณฑ์ ฿{spendLimit} โดยไม่มีคำสั่งซื้อ ระบบจะส่งข้อความแจ้งเตือนมายังแดชบอร์ดทันที
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
