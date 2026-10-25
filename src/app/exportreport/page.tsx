'use client';

import React, { useState } from 'react';
import { FileSpreadsheet, Download, ExternalLink, Check, Copy, Calendar, Layers } from 'lucide-react';
import { MOCK_CAMPAIGNS } from '@/data/mockData';
import { useMetaAuth } from '@/context/MetaAuthContext';
import { useToast } from '@/components/ui/Toast';

export default function ExportReportPage() {
  const { activePage, activeAdAccount } = useMetaAuth();
  const { showToast } = useToast();

  const [selectedFormat, setSelectedFormat] = useState<'sheets' | 'csv'>('csv');
  const [isExporting, setIsExporting] = useState(false);
  const [includeHookRate, setIncludeHookRate] = useState(true);
  const [includeFatigue, setIncludeFatigue] = useState(true);

  // Generate & Download actual CSV
  const handleDownloadCSV = () => {
    setIsExporting(true);
    setTimeout(() => {
      const headers = ['Campaign ID', 'Campaign Name', 'Status', 'Daily Budget', 'Spend', 'ROAS', 'Purchases', 'CPA'];
      if (includeHookRate) headers.push('3s Hook Rate (%)', '15s Hold Rate (%)');
      if (includeFatigue) headers.push('Frequency', 'Fatigue Status');

      const rows = MOCK_CAMPAIGNS.map(c => {
        const row = [
          c.id,
          `"${c.name.replace(/"/g, '""')}"`,
          c.status,
          c.dailyBudget,
          c.spend,
          c.roas,
          c.purchases,
          c.costPerPurchase.toFixed(2)
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
      link.setAttribute('download', `maxxgpt_ads_report_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsExporting(false);
      showToast('ดาวน์โหลดไฟล์ CSV เรียบร้อยแล้ว!', 'success');
    }, 600);
  };

  // Copy to Google Sheets format
  const handleSyncGoogleSheets = () => {
    setIsExporting(true);
    setTimeout(() => {
      const rows = MOCK_CAMPAIGNS.map(c => 
        `${c.name}\t${c.status}\t${c.spend}\t${c.roas}x\t${c.purchases}\t${c.hookRate || '-'}%`
      );
      const tsvContent = `Campaign Name\tStatus\tSpend\tROAS\tPurchases\tHook Rate\n` + rows.join('\n');
      navigator.clipboard.writeText(tsvContent);

      setIsExporting(false);
      showToast('คัดลอกตารางข้อมูลพร้อมสูตรสำหรับ Google Sheets ลงในคลิปบอร์ดแล้ว!', 'success');
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center space-x-2.5">
          <FileSpreadsheet className="w-6 h-6 text-gold-400" />
          <span>Export Ads Report (ระบบส่งออกรายงานโฆษณา)</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          ดึงข้อมูลสรุปผลงานโฆษณาของเพจ <strong className="text-blue-400">{activePage?.name || 'ทุกเพจ'}</strong> ส่งออกไปยัง Google Sheets หรือไฟล์ CSV
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-[#0e131e] border border-[#1d263b] max-w-2xl space-y-5">
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
                  ? 'bg-gold-500/10 border-gold-500/50 text-gold-300'
                  : 'bg-[#141a29] border-[#232d44] text-gray-400'
              }`}
            >
              <div className="text-sm font-bold flex items-center space-x-2">
                <ExternalLink className="w-4 h-4 text-emerald-400" />
                <span>Google Sheets Sync</span>
              </div>
              <div className="text-[11px] text-gray-400 mt-1">คัดลอกตารางไปวางใน Google Sheet</div>
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-300 block mb-2">ตัวชี้วัดที่รวมในรายงาน (Included Metrics)</label>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-300 bg-[#141a29] p-4 rounded-xl border border-[#232d44]">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" defaultChecked disabled className="rounded text-gold-500" />
              <span>ยอดใช้จ่าย (Spend) & ROAS</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={includeHookRate} 
                onChange={(e) => setIncludeHookRate(e.target.checked)} 
                className="rounded text-gold-500 cursor-pointer" 
              />
              <span>3s Hook Rate & 15s Hold Rate</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" defaultChecked disabled className="rounded text-gold-500" />
              <span>จำนวนออเดอร์และ CPA</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={includeFatigue} 
                onChange={(e) => setIncludeFatigue(e.target.checked)} 
                className="rounded text-gold-500 cursor-pointer" 
              />
              <span>คะแนนความล้า (Frequency & Fatigue)</span>
            </label>
          </div>
        </div>

        {selectedFormat === 'csv' ? (
          <button
            onClick={handleDownloadCSV}
            disabled={isExporting}
            className="w-full py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'กำลังเตรียมไฟล์ CSV...' : 'ดาวน์โหลดไฟล์ CSV ทันที'}</span>
          </button>
        ) : (
          <button
            onClick={handleSyncGoogleSheets}
            disabled={isExporting}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            <Copy className="w-4 h-4" />
            <span>{isExporting ? 'กำลังดึงข้อมูล...' : 'คัดลอกตารางไปวางใน Google Sheets'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
