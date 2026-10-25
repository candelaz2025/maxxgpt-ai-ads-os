'use client';

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  ShieldCheck, 
  UserCheck, 
  Bot, 
  Sparkles, 
  Filter, 
  CheckCircle2, 
  Send, 
  X, 
  Check, 
  Search,
  ThumbsUp,
  Clock,
  Layers
} from 'lucide-react';
import { MessageTierLead } from '@/types';
import { useMetaAuth } from '@/context/MetaAuthContext';
import { useToast } from '@/components/ui/Toast';

export default function MessageTierListPage() {
  const { activePage } = useMetaAuth();
  const { showToast } = useToast();

  const [leads, setLeads] = useState<MessageTierLead[]>([]);
  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChatLead, setActiveChatLead] = useState<MessageTierLead | null>(null);
  const [replyInput, setReplyInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const fetchLeads = () => {
    fetch('/api/v2/messages')
      .then(res => res.json())
      .then(res => {
        if (res.data) setLeads(res.data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleSendReply = async (leadId: string, text: string) => {
    if (!text.trim()) return;
    setIsSending(true);
    try {
      const res = await fetch('/api/v2/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send_reply', leadId, replyText: text, newStatus: 'replied' })
      });
      const data = await res.json();
      if (data.success && data.lead) {
        setActiveChatLead(data.lead);
        setLeads(prev => prev.map(l => l.id === leadId ? data.lead : l));
        setReplyInput('');
        showToast(`ส่งข้อความตอบกลับ ${data.lead.customerName} สำเร็จ!`, 'success');
      }
    } catch {
      showToast('ส่งข้อความล้มเหลว', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const handleConvertLead = async (leadId: string) => {
    try {
      const res = await fetch('/api/v2/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_status', leadId, newStatus: 'converted' })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setLeads(data.data);
        if (activeChatLead?.id === leadId) {
          setActiveChatLead(prev => prev ? { ...prev, status: 'converted' } : null);
        }
        showToast('บันทึกลูกค้าปิดการขาย (Converted) เรียบร้อย!', 'success');
      }
    } catch {
      showToast('อัปเดตสถานะล้มเหลว', 'error');
    }
  };

  const filteredLeads = leads.filter(l => {
    const matchesTier = selectedTier === 'ALL' || l.tier === selectedTier;
    const matchesSearch = l.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.inquiryProduct.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTier && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center space-x-2.5">
          <MessageSquare className="w-6 h-6 text-indigo-400" />
          <span>Message Tier List (ระบบคัดกรองแชท Inbox อัจฉริยะ)</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          วิเคราะห์ข้อความทัก Inbox จัดเกรดเป็น Tier S ถึง Tier C และแยกแชทผี/บอทสแปมออก เพื่อให้แอดมินโฟกัสคนที่พร้อมโอนเงินจริง
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {['ALL', 'Tier S', 'Tier A', 'Tier B', 'Tier C', 'Spam / Ghost'].map(tier => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedTier === tier
                  ? 'bg-gold-500 text-black font-bold'
                  : 'bg-[#101522] border border-[#1e273d] text-gray-400 hover:text-white'
              }`}
            >
              {tier === 'ALL' ? 'ลูกค้าทั้งหมด' : tier}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาชื่อลูกค้า หรือสินค้า..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#141a29] border border-[#232d44] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gold-500"
          />
        </div>
      </div>

      {/* Leads Table */}
      <div className="rounded-2xl bg-[#0e131e] border border-[#1d263b] overflow-hidden">
        <div className="p-4 border-b border-[#1c2438] flex items-center justify-between text-xs font-semibold text-white">
          <span>รายการคัดกรองแชท Inbox ล่าสุด (ดูแลโดย Agent A11)</span>
          <span className="text-emerald-400 flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>AI Lead Qualifier Active</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1f283d] bg-[#0c0f18] text-gray-400 text-[11px]">
                <th className="py-3 px-4">ระดับ (Tier)</th>
                <th className="py-3 px-4">ชื่อลูกค้า / เพจ</th>
                <th className="py-3 px-3">โอกาสซื้อ (Probability)</th>
                <th className="py-3 px-3">สินค้าที่สนใจ</th>
                <th className="py-3 px-4">บทสรุปความต้องการจาก AI</th>
                <th className="py-3 px-3">สถานะ</th>
                <th className="py-3 px-4 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#172033]">
              {filteredLeads.map(lead => (
                <tr key={lead.id} className="hover:bg-[#121826] transition-colors">
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded font-bold text-[10px] ${
                      lead.tier === 'Tier S' 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                        : lead.tier === 'Tier A'
                        ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40'
                        : lead.tier === 'Tier B'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                        : lead.tier === 'Tier C'
                        ? 'bg-gray-700/50 text-gray-300'
                        : 'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}>
                      {lead.tier}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white">{lead.customerName}</div>
                    <div className="text-[10px] text-gray-500">{lead.pageName}</div>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-gold-400 font-mono text-sm">{lead.purchaseProbability}%</div>
                  </td>
                  <td className="py-3.5 px-3 text-gray-200">
                    {lead.inquiryProduct}
                  </td>
                  <td className="py-3.5 px-4 text-gray-300 max-w-sm leading-relaxed">
                    {lead.summary}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                      lead.status === 'converted' 
                        ? 'bg-emerald-500/20 text-emerald-300' 
                        : lead.status === 'replied'
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {lead.status === 'converted' ? 'ปิดการขายแล้ว' : lead.status === 'replied' ? 'ตอบแล้ว' : 'รอแอดมินตอบ'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {lead.tier !== 'Spam / Ghost' ? (
                      <button 
                        onClick={() => setActiveChatLead(lead)}
                        className="px-3 py-1.5 rounded-lg bg-[#1a2336] hover:bg-gold-500 hover:text-black text-gray-200 font-semibold text-xs transition-all cursor-pointer shadow-sm"
                      >
                        เปิดตอบแชท
                      </button>
                    ) : (
                      <span className="text-[10px] text-rose-400 font-medium">บล็อกสแปมแล้ว</span>
                    )}
                  </td>
                </tr>
              ))}

              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    ยังไม่มีข้อความ Inbox หรือ Leads ในหมวดนี้ (เชื่อมต่อ Facebook Page ที่ /connect-meta เพื่อซิงค์ข้อความจริง)
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Chat Drawer / Modal */}
      {activeChatLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-2xl rounded-2xl bg-[#0f1422] border border-[#232d44] shadow-2xl overflow-hidden flex flex-col h-[650px]">
            {/* Chat Header */}
            <div className="p-4 border-b border-[#1c2438] bg-[#121929] flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={activeChatLead.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover border border-emerald-400"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white text-sm">{activeChatLead.customerName}</span>
                    <span className="text-[10px] px-2 py-0.2 rounded font-bold bg-gold-500/20 text-gold-300 border border-gold-500/30">
                      {activeChatLead.tier} ({activeChatLead.purchaseProbability}%)
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-400">
                    เพจ: {activeChatLead.pageName} • สนใจ: {activeChatLead.inquiryProduct}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {activeChatLead.status !== 'converted' && (
                  <button
                    onClick={() => handleConvertLead(activeChatLead.id)}
                    className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>ปิดการขายแล้ว</span>
                  </button>
                )}
                <button
                  onClick={() => setActiveChatLead(null)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Transcript Stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#0a0d16] text-xs">
              {activeChatLead.chatHistory.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'customer' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[75%] p-3 rounded-2xl space-y-1 ${
                      msg.sender === 'customer'
                        ? 'bg-[#182133] text-gray-200 rounded-tl-none border border-[#25324d]'
                        : msg.sender === 'admin'
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-[#131c2c] text-gold-200 border border-gold-500/30'
                    }`}
                  >
                    <div className="text-[10px] opacity-75 font-semibold">
                      {msg.sender === 'customer' ? activeChatLead.customerName : msg.sender === 'admin' ? 'แอดมินเพจ' : 'AI Assistant'}
                    </div>
                    <div className="leading-relaxed">{msg.text}</div>
                    <div className="text-[9px] opacity-60 text-right">{msg.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Suggested Quick-Replies */}
            {activeChatLead.suggestedReplies.length > 0 && (
              <div className="p-3 bg-[#111726] border-t border-[#1c2438] space-y-1.5">
                <div className="text-[10px] font-bold text-gold-400 flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>คำตอบแนะนำจาก Agent A11 (คลิกเพื่อส่งทันที):</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {activeChatLead.suggestedReplies.map((reply, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendReply(activeChatLead.id, reply)}
                      className="text-left p-2 rounded-lg bg-[#182236] hover:bg-[#202d47] text-gray-200 text-xs transition-colors border border-[#273654] cursor-pointer"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Reply Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendReply(activeChatLead.id, replyInput);
              }}
              className="p-3 bg-[#0d121e] border-t border-[#1c2438] flex gap-2"
            >
              <input
                type="text"
                value={replyInput}
                onChange={(e) => setReplyInput(e.target.value)}
                placeholder="พิมพ์ข้อความตอบกลับลูกค้า..."
                className="flex-1 px-3 py-2 rounded-xl bg-[#141a29] border border-[#232d44] text-xs text-white focus:outline-none focus:border-gold-500"
              />
              <button
                type="submit"
                disabled={isSending || !replyInput.trim()}
                className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs flex items-center space-x-1 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>ส่ง</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
