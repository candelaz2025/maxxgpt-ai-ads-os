'use client';

import React from 'react';
import { BarChart3, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function BenchmarkPage() {
  const metrics = [
    { name: 'Click-Through Rate (CTR)', account: '2.85%', benchmark: '1.45%', status: 'เหนือกว่าค่าเฉลี่ย 96%' },
    { name: 'Cost Per Click (CPC)', account: '฿4.80', benchmark: '฿6.50', status: 'ถูกกว่าค่าเฉลี่ย 26%' },
    { name: 'Average ROAS', account: '4.18x', benchmark: '2.80x', status: 'เหนือกว่าค่าเฉลี่ย 49%' },
    { name: '3s Video Hook Rate', account: '46.2%', benchmark: '32.0%', status: 'ระดับ Top 10% ของตลาด' }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center space-x-2.5">
          <BarChart3 className="w-6 h-6 text-gold-400" />
          <span>Ad Metric Benchmark (เทียบค่ามาตรฐานอุตสาหกรรม)</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          เปรียบเทียบผลงานของบัญชีกับค่าเฉลี่ยของแบรนด์ในกลุ่มธุรกิจความงาม สกินแคร์ และสุขภาพในประเทศไทย
        </p>
      </div>

      <div className="rounded-2xl bg-[#0e131e] border border-[#1d263b] overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#1f283d] bg-[#0c0f18] text-gray-400 text-[11px]">
              <th className="py-3 px-4">ตัวชี้วัด (KPI Metric)</th>
              <th className="py-3 px-4">บัญชีของคุณ (Your Account)</th>
              <th className="py-3 px-4">ค่าเฉลี่ยอุตสาหกรรม (Benchmark)</th>
              <th className="py-3 px-4 text-right">การประเมิน (Agent A19)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#172033]">
            {metrics.map((m, idx) => (
              <tr key={idx} className="hover:bg-[#121826] transition-colors">
                <td className="py-3.5 px-4 font-semibold text-white">{m.name}</td>
                <td className="py-3.5 px-4 font-mono font-bold text-gold-400">{m.account}</td>
                <td className="py-3.5 px-4 font-mono text-gray-400">{m.benchmark}</td>
                <td className="py-3.5 px-4 text-right">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    {m.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
