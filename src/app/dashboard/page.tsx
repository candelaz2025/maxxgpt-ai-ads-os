'use client';

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Search, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingBag, 
  Eye, 
  MousePointerClick, 
  AlertTriangle,
  Play,
  Pause,
  ArrowUpDown,
  Sparkles,
  RefreshCw,
  Plus,
  Check,
  X,
  Edit2,
  Trash2,
  ShieldAlert
} from 'lucide-react';
import { Campaign } from '@/types';
import { useMetaAuth } from '@/context/MetaAuthContext';
import { useToast } from '@/components/ui/Toast';

export default function DashboardPage() {
  const { activePage, activeAdAccount, setShowConnectModal } = useMetaAuth();
  const { showToast } = useToast();

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'PAUSED'>('ALL');
  const [dateRange, setDateRange] = useState('Last 7 Days');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Inline budget edit state
  const [editingBudgetId, setEditingBudgetId] = useState<string | null>(null);
  const [tempBudget, setTempBudget] = useState<number>(0);

  // New campaign modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCampName, setNewCampName] = useState('');
  const [newCampBudget, setNewCampBudget] = useState('3000');
  const [newCampObjective, setNewCampObjective] = useState<Campaign['objective']>('OUTCOME_SALES');
  const [newCampFormat, setNewCampFormat] = useState('Reels 9:16');

  // Load campaigns from API
  const fetchCampaigns = () => {
    setIsRefreshing(true);
    fetch('/api/v2/campaigns')
      .then(res => res.json())
      .then(res => {
        if (res.data) setCampaigns(res.data);
      })
      .catch(() => {})
      .finally(() => setIsRefreshing(false));
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Toggle active/pause status
  const handleToggleStatus = async (id: string) => {
    try {
      const res = await fetch('/api/v2/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_status', campaignId: id })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCampaigns(data.data);
        const camp = data.data.find((c: Campaign) => c.id === id);
        showToast(`สถานะแคมเปญเปลี่ยนเป็น: ${camp?.status}`, 'info');
      }
    } catch {
      showToast('ไม่สามารถเปลี่ยนสถานะได้', 'error');
    }
  };

  // Scale budget (+20%)
  const handleScaleBudget = async (id: string) => {
    try {
      const res = await fetch('/api/v2/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'scale_budget', campaignId: id, scalePercent: 20 })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCampaigns(data.data);
        showToast('Agent A06 (Budget Scaler) สเกลงบ 20% บน Meta API เรียบร้อย!', 'success');
      }
    } catch {
      showToast('การสเกลงบล้มเหลว', 'error');
    }
  };

  // Emergency Pause (Kill Switch)
  const handleEmergencyPause = async (id: string) => {
    const confirmAction = confirm('คำสั่งหยุดฉุกเฉิน (Kill Switch): คุณต้องการหยุดแคมเปญนี้เพื่อป้องกันงบรั่วไหลใช่หรือไม่?');
    if (!confirmAction) return;

    try {
      const res = await fetch('/api/v2/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'kill_campaign', campaignId: id })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCampaigns(data.data);
        showToast('Agent A07 หยุดแคมเปญฉุกเฉินเรียบร้อยแล้ว (Paused)', 'success');
      }
    } catch {
      showToast('การสั่งหยุดฉุกเฉินล้มเหลว', 'error');
    }
  };

  // Save inline budget
  const handleSaveBudget = async (id: string) => {
    try {
      const res = await fetch('/api/v2/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_budget', campaignId: id, dailyBudget: tempBudget })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCampaigns(data.data);
        setEditingBudgetId(null);
        showToast('อัปเดตงบประมาณต่อวันสำเร็จ', 'success');
      }
    } catch {
      showToast('อัปเดตงบล้มเหลว', 'error');
    }
  };

  // Create new campaign action
  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampName.trim()) {
      showToast('กรุณาระบุชื่อแคมเปญ', 'error');
      return;
    }

    try {
      const res = await fetch('/api/v2/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_campaign',
          newCampaign: {
            name: newCampName,
            dailyBudget: Number(newCampBudget) || 2500,
            objective: newCampObjective,
            format: newCampFormat,
            pageId: activePage?.id,
            pageName: activePage?.name
          }
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCampaigns(data.data);
        setShowCreateModal(false);
        setNewCampName('');
        showToast(`ปล่อยแคมเปญใหม่สู่ ${activePage?.name || 'Meta'} สำเร็จ!`, 'success');
      }
    } catch {
      showToast('สร้างแคมเปญล้มเหลว', 'error');
    }
  };

  const filteredCampaigns = campaigns.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalSpend = campaigns.reduce((acc, c) => acc + c.spend, 0);
  const totalPurchases = campaigns.reduce((acc, c) => acc + c.purchases, 0);
  const avgRoas = campaigns.length > 0 ? (campaigns.reduce((acc, c) => acc + c.roas, 0) / campaigns.length).toFixed(2) : '0.00';
  const avgCpc = campaigns.length > 0 ? (campaigns.reduce((acc, c) => acc + c.cpc, 0) / campaigns.length).toFixed(2) : '0.00';
  const avgCtr = campaigns.length > 0 ? (campaigns.reduce((acc, c) => acc + c.ctr, 0) / campaigns.length).toFixed(2) : '0.00';

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2.5">
            <LayoutDashboard className="w-6 h-6 text-gold-400" />
            <span>Meta Ads Executive Dashboard</span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            เพจที่เชื่อมต่อ: <strong className="text-blue-400">{activePage?.name || 'ไม่ได้เลือกเพจ'}</strong> • บัญชี: {activeAdAccount?.name}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>สร้างแคมเปญใหม่</span>
          </button>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[#121724] border border-[#212b42] text-xs text-gray-300 focus:outline-none focus:border-gold-500 cursor-pointer"
          >
            <option>Today (วันนี้)</option>
            <option>Yesterday (เมื่อวาน)</option>
            <option>Last 7 Days (7 วันที่ผ่านมา)</option>
            <option>Last 14 Days (14 วันที่ผ่านมา)</option>
            <option>This Month (เดือนนี้)</option>
          </select>

          <button
            onClick={fetchCampaigns}
            disabled={isRefreshing}
            className="p-2.5 rounded-lg bg-[#121724] border border-[#212b42] text-gray-400 hover:text-white hover:border-gold-500/50 transition-all cursor-pointer disabled:opacity-50"
            title="รีเฟรชข้อมูลสดจาก Meta"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-gold-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-xl bg-[#0f1420] border border-[#1e273d]">
          <div className="text-[11px] text-gray-400 font-medium">ยอดใช้จ่าย (Spend)</div>
          <div className="text-xl font-bold text-white mt-1">฿{totalSpend.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-400 mt-1 flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" />
            <span>+18.4% จากสัปดาห์ก่อน</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0f1420] border border-[#1e273d]">
          <div className="text-[11px] text-gray-400 font-medium">เฉลี่ย ROAS รวม</div>
          <div className="text-xl font-bold text-gold-400 mt-1">{avgRoas}x</div>
          <div className="text-[10px] text-emerald-400 mt-1 flex items-center">
            <span>เกณฑ์คุ้มทุน: 2.2x</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0f1420] border border-[#1e273d]">
          <div className="text-[11px] text-gray-400 font-medium">ยอดออเดอร์ (Purchases)</div>
          <div className="text-xl font-bold text-white mt-1">{totalPurchases} รายการ</div>
          <div className="text-[10px] text-gray-400 mt-1">
            เฉลี่ย ฿{(totalSpend / (totalPurchases || 1)).toFixed(1)} / ชิ้น
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0f1420] border border-[#1e273d]">
          <div className="text-[11px] text-gray-400 font-medium">ราคาต่อคลิก (CPC)</div>
          <div className="text-xl font-bold text-white mt-1">฿{avgCpc}</div>
          <div className="text-[10px] text-emerald-400 mt-1">
            <span>ถูกกว่าค่าเฉลี่ยตลาด 14%</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0f1420] border border-[#1e273d]">
          <div className="text-[11px] text-gray-400 font-medium">อัตราคลิก (CTR)</div>
          <div className="text-xl font-bold text-indigo-300 mt-1">{avgCtr}%</div>
          <div className="text-[10px] text-gray-400 mt-1">
            <span>วิดีโอ Reels ดึงคะแนนขึ้น</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#0e131e] border border-[#1d263b] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาชื่อแคมเปญ..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#141a29] border border-[#232d44] text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gold-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          {(['ALL', 'ACTIVE', 'PAUSED'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-gold-500 text-black font-bold'
                  : 'bg-[#141a29] text-gray-400 hover:text-white border border-[#212b42]'
              }`}
            >
              {st === 'ALL' ? 'ทั้งหมด (All)' : st === 'ACTIVE' ? 'เปิดอยู่ (Active)' : 'หยุดอยู่ (Paused)'}
            </button>
          ))}
        </div>
      </div>

      {/* Campaigns Data Table */}
      <div className="rounded-2xl bg-[#0e131e] border border-[#1d263b] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1f283d] bg-[#0c0f18] text-gray-400 text-[11px]">
                <th className="py-3 px-4">สวิตช์</th>
                <th className="py-3 px-4">ชื่อแคมเปญ / วัตถุประสงค์</th>
                <th className="py-3 px-3">งบ/วัน</th>
                <th className="py-3 px-3">ใช้จ่าย</th>
                <th className="py-3 px-3">ROAS</th>
                <th className="py-3 px-3">ออเดอร์</th>
                <th className="py-3 px-3">CPA</th>
                <th className="py-3 px-3">Hook 3s</th>
                <th className="py-3 px-3">อาการล้า</th>
                <th className="py-3 px-4 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#172033]">
              {filteredCampaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-[#121826] transition-colors">
                  {/* Status Toggle Switch */}
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggleStatus(camp.id)}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out flex items-center cursor-pointer ${
                        camp.status === 'ACTIVE' ? 'bg-emerald-500 justify-end' : 'bg-gray-700 justify-start'
                      }`}
                      title={camp.status === 'ACTIVE' ? 'คลิกเพื่อหยุด' : 'คลิกเพื่อเปิด'}
                    >
                      <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                    </button>
                  </td>

                  {/* Campaign Name */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white max-w-sm truncate">{camp.name}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5 flex items-center space-x-2">
                      <span className="font-mono text-gray-400">{camp.id}</span>
                      <span>•</span>
                      <span className="text-blue-400">{camp.pageName || activePage?.name}</span>
                      <span>•</span>
                      <span>{camp.format || 'Reels'}</span>
                    </div>
                  </td>

                  {/* Daily Budget (with Inline Edit) */}
                  <td className="py-3.5 px-3">
                    {editingBudgetId === camp.id ? (
                      <div className="flex items-center space-x-1">
                        <input
                          type="number"
                          value={tempBudget}
                          onChange={(e) => setTempBudget(Number(e.target.value))}
                          className="w-20 px-1.5 py-0.5 rounded bg-[#1c2436] border border-gold-500 text-xs text-white"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveBudget(camp.id)}
                          className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-500 cursor-pointer"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setEditingBudgetId(null)}
                          className="p-1 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div 
                        onClick={() => {
                          setEditingBudgetId(camp.id);
                          setTempBudget(camp.dailyBudget);
                        }}
                        className="group flex items-center space-x-1 cursor-pointer hover:text-gold-300"
                        title="คลิกเพื่อแก้ไขงบประมาณ"
                      >
                        <span className="text-gray-200 font-semibold font-mono">฿{camp.dailyBudget.toLocaleString()}</span>
                        <Edit2 className="w-3 h-3 text-gray-600 group-hover:text-gold-400" />
                      </div>
                    )}
                  </td>

                  {/* Spend */}
                  <td className="py-3.5 px-3 text-gray-200 font-mono">
                    ฿{camp.spend.toLocaleString()}
                  </td>

                  {/* ROAS */}
                  <td className="py-3.5 px-3 font-bold text-gold-400 font-mono">
                    {camp.roas}x
                  </td>

                  {/* Purchases */}
                  <td className="py-3.5 px-3 text-white font-semibold">
                    {camp.purchases}
                  </td>

                  {/* CPA */}
                  <td className="py-3.5 px-3 text-gray-300 font-mono">
                    ฿{camp.costPerPurchase.toFixed(1)}
                  </td>

                  {/* Hook Rate 3s */}
                  <td className="py-3.5 px-3 font-mono text-indigo-300">
                    {camp.hookRate ? `${camp.hookRate}%` : '-'}
                  </td>

                  {/* Fatigue Status */}
                  <td className="py-3.5 px-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                      camp.fatigueStatus === 'fresh' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : camp.fatigueStatus === 'warning'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse'
                    }`}>
                      {camp.fatigueStatus.toUpperCase()}
                    </span>
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      {camp.roas >= 3.5 && (
                        <button
                          onClick={() => handleScaleBudget(camp.id)}
                          className="px-2.5 py-1 rounded bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 border border-gold-500/40 text-[11px] font-bold transition-all cursor-pointer"
                          title="สเกลงบ +20%"
                        >
                          Scale +20%
                        </button>
                      )}

                      {camp.spend > 500 && camp.purchases <= 1 && (
                        <button
                          onClick={() => handleEmergencyPause(camp.id)}
                          className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold transition-all shadow-sm cursor-pointer"
                          title="หยุดฉุกเฉิน (Kill Switch)"
                        >
                          Kill Switch
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-[#0f1422] border border-[#232d44] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1c2438] pb-3">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Plus className="w-5 h-5 text-gold-400" />
                <span>สร้างแคมเปญ Meta Ads ใหม่</span>
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-gray-300 block mb-1">ชื่อแคมเปญ (Campaign Name)</label>
                <input
                  type="text"
                  value={newCampName}
                  onChange={(e) => setNewCampName(e.target.value)}
                  placeholder="เช่น [TEST] ยิงแอดวิดีโอชุดใหม่ - กลุ่มผู้หญิง 25-35..."
                  className="w-full px-3 py-2 rounded-lg bg-[#141a29] border border-[#232d44] text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-300 block mb-1">งบต่อวัน (THB)</label>
                  <input
                    type="number"
                    value={newCampBudget}
                    onChange={(e) => setNewCampBudget(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#141a29] border border-[#232d44] text-white focus:outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-300 block mb-1">รูปแบบชิ้นงาน</label>
                  <select
                    value={newCampFormat}
                    onChange={(e) => setNewCampFormat(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#141a29] border border-[#232d44] text-white focus:outline-none focus:border-gold-500 cursor-pointer"
                  >
                    <option>Reels 9:16 (วิดีโอสั้น)</option>
                    <option>Feed 1:1 (รูปภาพ)</option>
                    <option>Carousel (อัลบั้ม)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-300 block mb-1">วัตถุประสงค์ (Objective)</label>
                <select
                  value={newCampObjective}
                  onChange={(e) => setNewCampObjective(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-[#141a29] border border-[#232d44] text-white focus:outline-none focus:border-gold-500 cursor-pointer"
                >
                  <option value="OUTCOME_SALES">ยอดขาย / คำสั่งซื้อ (Sales / Purchase)</option>
                  <option value="MESSAGING">ข้อความ Inbox (Messaging Inquiries)</option>
                  <option value="OUTCOME_LEADS">รายชื่อลูกค้าเป้าหมาย (Leads)</option>
                  <option value="OUTCOME_ENGAGEMENT">การมีส่วนร่วม (Engagement)</option>
                </select>
              </div>

              <div className="p-3 rounded-lg bg-[#141a29] text-[11px] text-gray-400">
                ปล่อยในนามแฟนเพจ: <strong className="text-blue-400">{activePage?.name || 'ไม่ได้เลือก'}</strong>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#1a2336] text-gray-300 text-xs font-semibold cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs cursor-pointer shadow-md"
                >
                  ยืนยันปล่อยแคมเปญ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
