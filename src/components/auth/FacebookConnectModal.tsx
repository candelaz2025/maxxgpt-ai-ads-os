'use client';

import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  RefreshCw, 
  Power, 
  Layers, 
  ExternalLink,
  ChevronRight,
  Plus
} from 'lucide-react';
import { useMetaAuth } from '@/context/MetaAuthContext';

export const FacebookConnectModal: React.FC = () => {
  const { 
    showConnectModal, 
    setShowConnectModal, 
    isConnected, 
    user, 
    pages, 
    activePage, 
    selectPage, 
    connectFacebook, 
    disconnectFacebook,
    isConnecting
  } = useMetaAuth();

  const [showAddPage, setShowAddPage] = useState(false);
  const [newPageName, setNewPageName] = useState('');

  if (!showConnectModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#0d121c] border border-blue-500/30 shadow-2xl shadow-blue-950/50 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#1c263b] bg-gradient-to-r from-[#0d1527] to-[#11192e] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Meta Official SVG Logo */}
            <div className="w-8 h-8 rounded-lg bg-[#1877F2] flex items-center justify-center shadow-lg shadow-blue-500/30">
              <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <span>Meta Business & Facebook Login</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30">
                  Graph API v21.0
                </span>
              </h2>
              <p className="text-xs text-gray-400">เชื่อมต่อ Facebook Login เพื่อดึงข้อมูลแฟนเพจ, กลุ่มเป้าหมาย และยิงโฆษณา</p>
            </div>
          </div>

          <button
            onClick={() => setShowConnectModal(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#1a2336] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-gray-300">
          {/* User connection card */}
          {isConnected && user ? (
            <div className="p-4 rounded-xl bg-[#131a29] border border-[#232d44] flex items-center justify-between">
              <div className="flex items-center space-x-3.5">
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white text-sm">{user.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Connected</span>
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-400">{user.email} • User ID: {user.id}</div>
                  <div className="text-[10px] text-emerald-400 font-medium mt-0.5">
                    Token อายุใช้งาน: คงเหลือ {user.tokenExpiresInDays} วัน (Auto-Refresh โดย Agent A02)
                  </div>
                </div>
              </div>

              <button
                onClick={disconnectFacebook}
                className="px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 text-rose-300 font-semibold text-xs transition-colors cursor-pointer"
              >
                ตัดการเชื่อมต่อ
              </button>
            </div>
          ) : (
            <div className="p-6 rounded-xl bg-[#131a29] border border-blue-500/30 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">ยังไม่ได้เชื่อมต่อบัญชี Facebook</h3>
                <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
                  กดปุ่มด้านล่างเพื่อเข้าสู่ระบบผ่าน Meta OAuth 2.0 พร้อมอนุญาตสิทธิ์การจัดการเพจและโฆษณา
                </p>
              </div>
              <button
                onClick={connectFacebook}
                disabled={isConnecting}
                className="px-6 py-2.5 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs inline-flex items-center space-x-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
              >
                {isConnecting ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                <span>{isConnecting ? 'กำลังเชื่อมต่อ Meta Graph...' : 'เข้าสู่ระบบด้วย Facebook (Login with Facebook)'}</span>
              </button>
            </div>
          )}

          {/* Connected Facebook Pages Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs uppercase tracking-wider flex items-center space-x-1.5">
                <Layers className="w-4 h-4 text-blue-400" />
                <span>เลือกแฟนเพจที่ต้องการใช้งาน (Connected Facebook Pages)</span>
              </span>
              <span className="text-[11px] text-gray-400">คลิกที่เพจเพื่อตั้งเป็นเพจหลัก</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pages.map(page => {
                const isSelected = activePage?.id === page.id;
                return (
                  <button
                    key={page.id}
                    onClick={() => selectPage(page.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start justify-between ${
                      isSelected
                        ? 'bg-blue-950/30 border-blue-500/60 shadow-md shadow-blue-950/40'
                        : 'bg-[#101522] border-[#1e273d] hover:border-blue-500/30 hover:bg-[#141b2c]'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <img
                        src={page.avatarUrl}
                        alt={page.name}
                        className="w-10 h-10 rounded-lg object-cover border border-[#26324a]"
                      />
                      <div>
                        <div className="font-bold text-white text-xs line-clamp-1">{page.name}</div>
                        <div className="text-[10px] text-gray-400">{page.category}</div>
                        <div className="text-[10px] text-gray-500 font-mono mt-1">
                          ผู้ติดตาม {page.fanCount.toLocaleString()} คน • {page.id}
                        </div>
                        {page.connectedInstagram && (
                          <div className="text-[10px] text-amber-400 mt-0.5">
                            IG: @{page.connectedInstagram.username}
                          </div>
                        )}
                      </div>
                    </div>

                    {isSelected ? (
                      <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Meta Permission Scopes Granted */}
          <div className="p-4 rounded-xl bg-[#0c101a] border border-[#1b2336] space-y-2">
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center justify-between">
              <span>สิทธิ์การเข้าถึงที่ได้รับอนุมัติ (Approved Permissions)</span>
              <span className="text-emerald-400 font-mono text-[10px]">9 Scopes Active</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                'pages_show_list',
                'pages_read_engagement',
                'pages_manage_posts',
                'pages_messaging',
                'ads_management',
                'ads_read',
                'leads_retrieval'
              ].map(scope => (
                <span key={scope} className="text-[10px] px-2 py-0.5 rounded bg-[#162033] text-gray-300 font-mono border border-[#232f47]">
                  {scope}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-[#1c263b] bg-[#0c1019] flex items-center justify-between">
          <div className="text-[11px] text-gray-400 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>เพจที่ใช้งานอยู่: <strong className="text-white">{activePage?.name || 'ไม่ได้เลือก'}</strong></span>
          </div>

          <button
            onClick={() => setShowConnectModal(false)}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            เรียบร้อย (Done)
          </button>
        </div>
      </div>
    </div>
  );
};
