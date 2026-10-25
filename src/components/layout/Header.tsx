'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Bot, 
  Coins, 
  ChevronDown, 
  Bell, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles,
  ExternalLink,
  Layers,
  Facebook
} from 'lucide-react';
import { useMetaAuth } from '@/context/MetaAuthContext';

export const Header: React.FC = () => {
  const { 
    isConnected, 
    user, 
    pages, 
    activePage, 
    selectPage, 
    adAccounts, 
    activeAdAccount, 
    selectAdAccount,
    setShowConnectModal 
  } = useMetaAuth();

  const [pageDropdownOpen, setPageDropdownOpen] = useState(false);
  const [adAccountDropdownOpen, setAdAccountDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 h-16 bg-[#090c13]/95 backdrop-blur-md border-b border-[#1a2133] px-6 flex items-center justify-between">
      {/* Left: Active Facebook Page & Ad Account selector */}
      <div className="flex items-center space-x-3">
        {/* Active Facebook Page Selector */}
        <div className="relative">
          <button 
            onClick={() => {
              setPageDropdownOpen(!pageDropdownOpen);
              setAdAccountDropdownOpen(false);
            }}
            className="flex items-center space-x-2.5 px-3 py-1.5 rounded-lg bg-[#111726] border border-blue-500/30 hover:border-blue-400/60 transition-all text-xs cursor-pointer"
          >
            {activePage?.avatarUrl ? (
              <img src={activePage.avatarUrl} alt="" className="w-5 h-5 rounded-full object-cover border border-blue-400" />
            ) : (
              <div className="w-5 h-5 rounded-full bg-[#1877F2] flex items-center justify-center text-white text-[10px] font-bold">f</div>
            )}
            <div className="text-left">
              <span className="text-[10px] text-blue-300 block font-medium">Facebook Page</span>
              <span className="font-bold text-white truncate max-w-[160px] sm:max-w-[190px] block">
                {activePage?.name || 'เลือกแฟนเพจ'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-0.5" />
          </button>

          {pageDropdownOpen && (
            <div className="absolute left-0 mt-2 w-80 bg-[#101522] border border-[#232d44] rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-gray-400">
                <span>เลือกแฟนเพจเป้าหมาย</span>
                <button
                  onClick={() => {
                    setPageDropdownOpen(false);
                    setShowConnectModal(true);
                  }}
                  className="text-blue-400 hover:text-blue-300 text-[11px] font-bold cursor-pointer"
                >
                  จัดการเพจ
                </button>
              </div>
              <div className="space-y-1 mt-1 max-h-60 overflow-y-auto">
                {pages.map(page => (
                  <button
                    key={page.id}
                    onClick={() => {
                      selectPage(page.id);
                      setPageDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      page.id === activePage?.id ? 'bg-blue-950/40 text-blue-300 border border-blue-500/30' : 'text-gray-300 hover:bg-[#182030]'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <img src={page.avatarUrl} alt="" className="w-6 h-6 rounded-full object-cover shrink-0" />
                      <div className="truncate">
                        <div className="font-semibold text-white truncate">{page.name}</div>
                        <div className="text-[10px] text-gray-500">{page.category}</div>
                      </div>
                    </div>
                    {page.id === activePage?.id && <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 ml-2" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Active Ad Account Selector */}
        <div className="relative hidden sm:block">
          <button 
            onClick={() => {
              setAdAccountDropdownOpen(!adAccountDropdownOpen);
              setPageDropdownOpen(false);
            }}
            className="flex items-center space-x-2.5 px-3 py-1.5 rounded-lg bg-[#121724] border border-[#212b42] hover:border-gold-500/50 transition-all text-xs cursor-pointer"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <div className="text-left">
              <span className="text-[10px] text-gray-400 block font-medium">Ad Account</span>
              <span className="font-medium text-white truncate max-w-[150px] block">
                {activeAdAccount?.name || 'เลือกบัญชีโฆษณา'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-0.5" />
          </button>

          {adAccountDropdownOpen && (
            <div className="absolute left-0 mt-2 w-80 bg-[#101522] border border-[#232d44] rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="text-xs font-semibold text-gray-400 px-3 py-1.5">Meta Ad Accounts</div>
              <div className="space-y-1 mt-1">
                {adAccounts.map(acc => (
                  <button
                    key={acc.id}
                    onClick={() => {
                      selectAdAccount(acc.id);
                      setAdAccountDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      acc.id === activeAdAccount?.id ? 'bg-gold-500/10 text-gold-400 border border-gold-500/30' : 'text-gray-300 hover:bg-[#182030]'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-white">{acc.name}</div>
                      <div className="text-[10px] text-gray-500">{acc.id} • {acc.currency}</div>
                    </div>
                    {acc.id === activeAdAccount?.id && <CheckCircle2 className="w-4 h-4 text-gold-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 30 Subagents Swarm Indicator */}
        <Link 
          href="/swarm-orchestrator"
          className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-indigo-950/40 border border-indigo-700/40 text-indigo-300 hover:border-indigo-500/60 transition-all text-xs cursor-pointer"
        >
          <Layers className="w-3.5 h-3.5 text-indigo-400 animate-spin" style={{ animationDuration: '10s' }} />
          <span className="font-semibold">30 Subagents Active</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </Link>
      </div>

      {/* Right: Facebook Connect Button, Credits, Kill Switch Proposals */}
      <div className="flex items-center space-x-3">
        {/* Facebook Connection Status Button */}
        <button
          onClick={() => setShowConnectModal(true)}
          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
            isConnected
              ? 'bg-[#1877F2]/15 border-[#1877F2]/40 text-blue-300 hover:bg-[#1877F2]/25'
              : 'bg-[#1877F2] text-white hover:bg-[#166fe5] shadow-md shadow-blue-600/30'
          }`}
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          <span className="hidden sm:inline">{isConnected ? 'Facebook: เชื่อมต่อแล้ว' : 'เข้าสู่ระบบ Facebook'}</span>
        </button>

        {/* Credits Badge */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#121724] border border-[#212b42] text-xs">
          <Coins className="w-3.5 h-3.5 text-gold-400" />
          <span className="text-gray-400 hidden sm:inline">เครดิต:</span>
          <span className="font-bold text-white">4,850</span>
          <span className="text-[10px] bg-gold-500/20 text-gold-300 px-1.5 py-0.2 rounded font-semibold">PRO</span>
        </div>

        {/* Kill Switch Proposal Badge */}
        <Link
          href="/swarm-orchestrator"
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-950/60 border border-rose-500/50 text-rose-300 hover:bg-rose-900/60 transition-all text-xs font-semibold cursor-pointer animate-pulse"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          <span className="hidden md:inline">1 ข้อเสนอตัดแอด</span>
        </Link>
      </div>
    </header>
  );
};
