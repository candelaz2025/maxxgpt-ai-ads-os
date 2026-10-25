'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  LayoutDashboard,
  Sparkles,
  Flame,
  Search,
  Zap,
  Clock,
  Video,
  TrendingUp,
  TrendingDown,
  Star,
  Users,
  BarChart3,
  MessageSquare,
  ShoppingBag,
  FileSpreadsheet,
  Layers,
  Settings,
  ShieldCheck,
  FileText,
  Database
} from 'lucide-react';
import { useMetaAuth } from '@/context/MetaAuthContext';

interface NavItem {
  name: string;
  nameTh?: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

interface NavSection {
  title: string;
  titleTh?: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { isConnected, activePage } = useMetaAuth();

  const navSections: NavSection[] = [
    {
      title: 'OVERVIEW',
      titleTh: 'ภาพรวม',
      items: [
        { name: 'Home', nameTh: 'หน้าหลัก', href: '/', icon: Home },
        { name: 'Dashboard', nameTh: 'แดชบอร์ดหลัก', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Connect Facebook', nameTh: 'เชื่อมต่อเพจ Meta', href: '/connect-meta', icon: ShieldCheck, badge: isConnected ? 'SYNCED' : 'CONNECT', badgeColor: isConnected ? 'bg-blue-500/20 text-blue-300' : 'bg-amber-500/20 text-amber-300' },
        { name: 'Cloud & Database', nameTh: 'Supabase & Cloudflare', href: '/connect-infra', icon: Database, badge: 'PROD', badgeColor: 'bg-emerald-500/20 text-emerald-300' },
      ]
    },
    {
      title: 'SPOTLIGHTS',
      titleTh: 'จุดโฟกัสครีเอทีฟ',
      items: [
        { name: 'Ad Spotlight', nameTh: 'สปอตไลท์โฆษณา', href: '/ad-spotlight', icon: Sparkles },
        { name: 'Post Spotlight', nameTh: 'สปอตไลท์โพสต์เพจ', href: '/post-spotlight', icon: Flame },
        { name: 'Creative Fatigue', nameTh: 'ตรวจจับโฆษณาล้า', href: '/creative-fatigue', icon: Clock, badge: 'ALERT', badgeColor: 'bg-rose-500/20 text-rose-300' },
      ]
    },
    {
      title: 'AI & AUTOMATION',
      titleTh: 'ผู้ช่วย AI อัจฉริยะ',
      items: [
        { name: 'Assistant Hub', nameTh: 'ศูนย์รวมเครื่องมือ AI', href: '/ai-tools', icon: Zap, badge: 'HOT', badgeColor: 'bg-gold-500/20 text-gold-300' },
        { name: 'Prompt Builder', nameTh: 'สร้างบทโฆษณา AI', href: '/prompt-builder', icon: FileText },
        { name: 'AI Improve Campaign', nameTh: 'แนะนำปรับปรุงแคมเปญ', href: '/ai-improve-campaign', icon: Sparkles },
        { name: 'Message Tier List', nameTh: 'คัดกรองเกรดลูกค้า Inbox', href: '/messagetierlist', icon: MessageSquare },
      ]
    },
    {
      title: 'RULES AUTOMATION',
      titleTh: 'ระบบกฎอัตโนมัติ',
      items: [
        { name: '6-Hour Rules', nameTh: 'กฎเฝ้าผล 6 ชั่วโมง', href: '/hour-rules', icon: Clock, badge: 'FAST', badgeColor: 'bg-amber-500/20 text-amber-300' },
        { name: 'Daily Rules', nameTh: 'กฎประจำวัน', href: '/basic-rule', icon: Settings },
      ]
    },
    {
      title: '30-AGENT SWARM',
      titleTh: 'ศูนย์สั่งการ 30 เอเจนต์',
      items: [
        { name: 'Swarm Orchestrator', nameTh: 'ห้องควบคุม 30 Subagents', href: '/swarm-orchestrator', icon: Layers, badge: 'LIVE', badgeColor: 'bg-emerald-500/20 text-emerald-300' },
      ]
    },
    {
      title: 'DEEP ANALYTICS',
      titleTh: 'วิเคราะห์เชิงลึก',
      items: [
        { name: 'Video Ads (Hook Rate)', nameTh: 'วิเคราะห์วิดีโอ 3 วิ', href: '/videoanalysis', icon: Video },
        { name: 'Top Rank Ads', nameTh: 'โฆษณาทำผลงานดีเด่น', href: '/topads', icon: TrendingUp },
        { name: 'Bottom Rank Ads', nameTh: 'โฆษณาที่ควรตัดงบ', href: '/bottomads', icon: TrendingDown },
        { name: 'Rising Stars Ads', nameTh: 'โฆษณาดาวรุ่งมาแรง', href: '/risingstars', icon: Star },
        { name: 'Audience Growth', nameTh: 'การเติบโตกลุ่มเป้าหมาย', href: '/audiencegrowth', icon: Users },
        { name: 'Ad Metric Benchmark', nameTh: 'เทียบค่าเฉลี่ยตลาด', href: '/ad-metric-benchmark', icon: BarChart3 },
        { name: 'CPAS Purchase', nameTh: 'โฆษณา Shopee/Lazada', href: '/purchasecpas', icon: ShoppingBag },
        { name: 'Export Ads Report', nameTh: 'ส่งออกรายงาน Google Sheet', href: '/exportreport', icon: FileSpreadsheet },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-[#0a0d15] border-r border-[#1a2133] h-screen sticky top-0 flex flex-col justify-between select-none shrink-0">
      {/* Brand header */}
      <div>
        <div className="h-16 px-6 flex items-center border-b border-[#1a2133] space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-400 via-amber-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-gold-500/20">
            <span className="font-extrabold text-black text-sm tracking-wider">M</span>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-white text-base tracking-tight">MaxxGPT</span>
              <span className="text-[10px] bg-gold-500/20 text-gold-400 border border-gold-500/30 px-1 py-0.2 rounded font-semibold">AI ADS</span>
            </div>
            <div className="text-[10px] text-gray-500 font-medium">Meta Ads OS v2.8</div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="p-3 overflow-y-auto max-h-[calc(100vh-8.5rem)] space-y-5">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <div className="px-3 text-[10px] font-bold text-gray-400 tracking-wider flex items-center justify-between">
                <span>{section.title}</span>
                <span className="text-[9px] text-gray-500 font-normal">{section.titleTh}</span>
              </div>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        isActive
                          ? 'bg-gold-500/15 text-gold-300 border border-gold-500/30 shadow-sm'
                          : 'text-gray-400 hover:text-gray-200 hover:bg-[#121724]'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-gold-400' : 'text-gray-500'}`} />
                        <span className="truncate">{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${item.badgeColor || 'bg-gray-800 text-gray-300'}`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer support & status */}
      <div className="p-4 border-t border-[#1a2133] bg-[#0c0f18] text-xs">
        <div className="flex items-center justify-between text-gray-400 mb-1.5">
          <span className="text-[11px]">Active Page</span>
          <span className="text-[11px] font-semibold text-blue-400 truncate max-w-[120px]">
            {activePage?.name || 'Not Connected'}
          </span>
        </div>
        <div className="text-[10px] text-gray-500">
          Graph API v21.0 • 30 Subagents Online
        </div>
      </div>
    </aside>
  );
};
