'use client';

import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, Download, ExternalLink, Check, Copy, Calendar, Layers, Send, RefreshCw } from 'lucide-react';
import { Campaign } from '@/types';
import { useMetaAuth } from '@/context/MetaAuthContext';
import { useToast } from '@/components/ui/Toast';

export default function ExportReportPage() {
  const { activePage, activeAdAccount } = useMetaAuth();
  const { showToast } = useToast();

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<'sheets' | 'csv'>('csv');
  const [isExporting, setIsExporting] = useState(false);
  const [includeHookRate, setIncludeHookRate] = useState(true);
  const [includeFatigue, setIncludeFatigue] = useState(true);
  const [googleSheetWebhook, setGoogleSheetWebhook] = useState('');
  const [isSendingWebhook, setIsSendingWebhook] = useState(false);

  useEffect(() => {
    fetch('/api/v2/campaigns')
      .then(res => res.json())
      .then(res => {
        if (res.data) setCampaigns(res.data);
      })
      .catch(() => {});
  }, []);

  // Generate & Download actual CSV
  const handleDownloadCSV = () => {
    if (campaigns.length === 0) {
      showToast('ไม่มีข้อมูลแคมเปญให้ดาวน์โหลด', 'error');
      return;
    }

    setIsExporting(true);
    const headers = ['Campaign ID', 'Campaign Name', 'Status', 'Daily Budget (THB)', 'Spend (THB)', 'ROAS', 'Purchases', 'CPA (THB)'];
    if (includeHookRate) headers.push('3s Hook Rate (%)', '15s Hold Rate (%)');
    if (includeFatigue) headers.push('Frequency', 'Fatigue Status');

    const rows = campaigns.map(c => {
      const row = [
        c.id,
        `"${c.name.replace(/"/g, '""')}"`,
        c.status,
        c.dailyBudget,
        c.spend,
        c.roas,
        c.purchases,
        c.costPerPurchase ? c.costPerPurchase.toFixed(2) : '0'
      ];
      if (includeHookRate) row.push(c.hookRate || 0, c.holdRate || 0);
      if (includeFatigue) row.push(c.frequency, c.fatigueStatus);
      return row.join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `maxxgpt_ads_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsExporting(false);
    showToast(`ดาวน์โหลดไฟล์ CSV สำหรับ ${campaigns.length} แคมเปญเรียบร้อย!`, 'success');
  };

  // Copy to Google Sheets TSV format
  const handleCopyGoogleSheets = () => {
    if (campaigns.length === 0) {
      showToast('ไม่มีข้อมูลแคมเปญให้คัดลอก', 'error');
      return;
    }

    const rows = campaigns.map(c => 
      `${c.name}\t${c.status}\t฿${c.dailyBudget.toLocaleString()}\t฿${c.spend.toLocaleString()}\t${c.roas}x\t${c.purchases}\t${c.hookRate || '-'}%`
    );
    const tsvContent = `Campaign Name\tStatus\tDaily Budget\tSpend\tROAS\tPurchases\t3s Hook Rate\n` + rows.join('\n');
    navigator.clipboard.writeText(tsvContent);

    showToast('คัดลอกตารางข้อมูลพร้อมนำไป Paste ลงใน Google Sheets ได้ทันที!', 'success');
  };

  // Send to Google Sheets Webhook
  const handleSendToWebhook = async () => {
    setIsSendingWebhook(true);
    try {
      const res = await fetch('/api/v2/reports/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhookUrl: googleSheetWebhook.trim() })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'ส่งข้อมูลเข้า Google Sheets สำเร็จ!', 'success');
      } else {
        showToast(data.error || 'การส่งข้อมูลล้มเหลว', 'error');
      }
    } catch {
      showToast('ไม่สามารถเชื่อมต่อไปยัง Webhook ได้', 'error');
    } finally {
      setIsSendingWebhook(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center space-x-2.5">
          <FileSpreadsheet className="w-6 h-6 text-gold-400" />
          <span>Export Ads Report (ระบบส่งออกรายงานโฆษณาจริง)</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          ดึงข้อมูลสรุปผลงานโฆษณาจริงของเพจ <strong className="text-blue-400">{activePage?.name || 'ทุกเพจ'}</strong> ({campaigns.length} แคมเปญ) ส่งออกไปยัง Google Sheets หรือไฟล์ CSV
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0e131e] border border-[#1d263b] space-y-5">
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-2">เลือกรูปแบบการส่งออก (Export Format)</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedFormat('csv')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedFormat === 'csv'
                    ? 'bg-gold-500/10 border-gold-500/50 text-gold-300'
                    : 'bg-[#141a29] border-[#232d44] text-gray-400'
                }`}
              >
                <div className="text-sm font-bold flex items-center space-x-2">
                  <Download className="w-4 h-4 text-gold-400" />
                  <span>CSV File Download</span>
                </div>
                <div className="text-[11px] text-gray-400 mt-1">ดาวน์โหลดไฟล์ .csv ทันที</div>
              </button>

              <button
                onClick={() => setSelectedFormat('sheets')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedFormat === 'sheets'
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300'
                    : 'bg-[#141a29] border-[#232d44] text-gray-400'
                }`}
              >
                <div className="text-sm font-bold flex items-center space-x-2">
                  <ExternalLink className="w-4 h-4 text-emerald-400" />
                  <span>Google Sheets Integration</span>
                </div>
                <div className="text-[11px] text-gray-400 mt-1">ส่งผ่าน Webhook หรือคัดลอกลง Sheet</div>
              </button>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="text-xs font-semibold text-gray-300 block">ตัวเลือกคอลัมน์พิเศษ</label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2.5 text-xs text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeHookRate}
                  onChange={(e) => setIncludeHookRate(e.target.checked)}
                  className="rounded border-[#2a364f] text-gold-500 focus:ring-0"
                />
                <span>รวมข้อมูลอัตราหยุดดูวิดีโอ (3s Hook Rate & 15s Hold Rate)</span>
              </label>

              <label className="flex items-center space-x-2.5 text-xs text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeFatigue}
                  onChange={(e) => setIncludeFatigue(e.target.checked)}
                  className="rounded border-[#2a364f] text-gold-500 focus:ring-0"
                />
                <span>รวมข้อมูลความถี่และการเสื่อมสภาพของแอด (Frequency & Fatigue Status)</span>
              </label>
            </div>
          </div>

          {selectedFormat === 'sheets' && (
            <div className="p-4 rounded-xl bg-[#090d16] border border-emerald-500/30 space-y-3">
              <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                <Send className="w-3.5 h-3.5 text-emerald-400" />
                <span>Google Apps Script / Webhook Endpoint (ไม่บังคับ)</span>
              </div>
              <p className="text-[11px] text-gray-400">
                หากคุณมี Webhook URL ของ Google Sheets (Apps Script Web App) กรุณาวางด้านล่างเพื่อยิงข้อมูลเข้าชีตอัตโนมัติ
              </p>
              <div className="flex items-center space-x-2">
                <input
                  type="url"
                  value={googleSheetWebhook}
                  onChange={e => setGoogleSheetWebhook(e.target.value)}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="flex-1 px-3 py-2 rounded-lg bg-[#141b2c] border border-[#232f48] text-white text-xs font-mono placeholder:text-gray-600 focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={handleSendToWebhook}
                  disabled={isSendingWebhook}
                  className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs inline-flex items-center space-x-1 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSendingWebhook && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>ส่งเข้าชีต</span>
                </button>
              </div>
            </div>
          )}

          <div className="pt-2 flex items-center space-x-3">
            {selectedFormat === 'csv' ? (
              <button
                onClick={handleDownloadCSV}
                disabled={isExporting}
                className="px-6 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs flex items-center space-x-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{isExporting ? 'กำลังสร้างไฟล์ CSV...' : `ดาวน์โหลด CSV (${campaigns.length} แคมเปญ)`}</span>
              </button>
            ) : (
              <button
                onClick={handleCopyGoogleSheets}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg transition-all cursor-pointer"
              >
                <Copy className="w-4 h-4" />
                <span>คัดลอกตารางสำหรับ Paste ลง Google Sheets</span>
              </button>
            )}
          </div>
        </div>

        {/* Preview Summary Card */}
        <div className="p-6 rounded-2xl bg-[#0e131e] border border-[#1d263b] space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">ข้อมูลที่จะส่งออก (Data Summary)</h2>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-[#1b2336]">
              <span className="text-gray-400">จำนวนแคมเปญ:</span>
              <strong className="text-white font-mono">{campaigns.length} แคมเปญ</strong>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#1b2336]">
              <span className="text-gray-400">ยอดใช้จ่ายรวม (Spend):</span>
              <strong className="text-white font-mono">฿{campaigns.reduce((a, c) => a + c.spend, 0).toLocaleString()}</strong>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#1b2336]">
              <span className="text-gray-400">ยอดออเดอร์รวม:</span>
              <strong className="text-white font-mono">{campaigns.reduce((a, c) => a + c.purchases, 0)} ออเดอร์</strong>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#1b2336]">
              <span className="text-gray-400">ROAS เฉลี่ย:</span>
              <strong className="text-gold-400 font-mono">
                {campaigns.length > 0 ? (campaigns.reduce((a, c) => a + c.roas, 0) / campaigns.length).toFixed(2) : 0}x
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
