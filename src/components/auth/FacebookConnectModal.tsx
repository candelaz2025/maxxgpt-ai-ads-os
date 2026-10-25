'use client';

import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  RefreshCw, 
  Key, 
  Layers, 
  ExternalLink,
  ChevronRight,
  AlertCircle
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

  const [customToken, setCustomToken] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!showConnectModal) return null;

  const handleConnectWithToken = async () => {
    setErrorMessage('');
    if (!customToken.trim()) {
      setErrorMessage('กรุณาวาง Facebook Access Token เพื่อเชื่อมต่อ');
      return;
    }
    const success = await connectFacebook(customToken.trim());
    if (!success) {
      setErrorMessage('ไม่สามารถเชื่อมต่อได้: Access Token ไม่ถูกต้องหรือหมดอายุ');
    } else {
      setCustomToken('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#0d121c] border border-blue-500/30 shadow-2xl shadow-blue-950/50 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#1c263b] bg-gradient-to-r from-[#0d1527] to-[#11192e] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#1877F2] flex items-center justify-center shadow-lg shadow-blue-500/30">
              <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <span>Meta Business & Facebook Graph API</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30">
                  v21.0 Live
                </span>
              </h2>
              <p className="text-xs text-gray-400">เชื่อมต่อ Facebook Account ของคุณเพื่อดึงแฟนเพจและแคมเปญโฆษณาจริง</p>
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
                  className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400 shadow-md"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white text-sm">{user.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Connected</span>
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-400">{user.email} • ID: {user.id}</div>
                  <div className="text-[10px] text-emerald-400 font-medium mt-0.5">
                    Meta Graph API v21.0 Active • Token อายุใช้งาน: {user.tokenExpiresInDays} วัน
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
            <div className="p-5 rounded-xl bg-[#131a29] border border-blue-500/30 space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-9 h-9 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">เชื่อมต่อด้วย Facebook User / System User Token</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    นำ Token จาก <strong>Meta for Developers &gt; Graph API Explorer</strong> หรือ <strong>Meta Business Manager &gt; System Users</strong> มาใส่ด้านล่าง
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] text-gray-300 font-medium">Meta Access Token (EAAB...)</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="password"
                    value={customToken}
                    onChange={(e) => setCustomToken(e.target.value)}
                    placeholder="วาง Access Token ของคุณที่นี่..."
                    className="flex-1 px-3 py-2 rounded-lg bg-[#0a0e17] border border-[#232d44] text-white text-xs placeholder:text-gray-600 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={handleConnectWithToken}
                    disabled={isConnecting}
                    className="px-4 py-2 rounded-lg bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs inline-flex items-center space-x-1.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isConnecting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                    <span>{isConnecting ? 'กำลังตรวจสอบ...' : 'เชื่อมต่อ'}</span>
                  </button>
                </div>
                {errorMessage && (
                  <div className="text-rose-400 text-xs flex items-center space-x-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Connected Facebook Pages Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs uppercase tracking-wider flex items-center space-x-1.5">
                <Layers className="w-4 h-4 text-blue-400" />
                <span>แฟนเพจที่เชื่อมต่อ ({pages.length})</span>
              </span>
              {pages.length > 0 && <span className="text-[11px] text-gray-400">คลิกที่เพจเพื่อตั้งเป็นเพจหลัก</span>}
            </div>

            {pages.length === 0 ? (
              <div className="p-6 rounded-xl bg-[#0e1320] border border-[#1b2336] text-center text-gray-400">
                <p>ยังไม่มีแฟนเพจเชื่อมต่อ กรุณากรอก Access Token ด้านบนเพื่อดึงเพจจริงจากบัญชีของคุณ</p>
              </div>
            ) : (
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
                            ผู้ติดตาม {page.fanCount.toLocaleString()} คน • ID: {page.id}
                          </div>
                        </div>
                      </div>

                      {isSelected ? (
                        <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Meta Permission Scopes Required */}
          <div className="p-4 rounded-xl bg-[#0c101a] border border-[#1b2336] space-y-2">
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center justify-between">
              <span>สิทธิ์การเข้าถึง Meta API v21.0 (Required Scopes)</span>
              <span className="text-emerald-400 font-mono text-[10px]">Meta Marketing Scopes</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                'pages_show_list',
                'pages_read_engagement',
                'pages_manage_posts',
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
            <span className={`w-2 h-2 rounded-full ${activePage ? 'bg-emerald-400' : 'bg-gray-500'}`} />
            <span>เพจที่ใช้งานอยู่: <strong className="text-white">{activePage?.name || 'ยังไม่ได้เลือกเพจ'}</strong></span>
          </div>

          <button
            onClick={() => setShowConnectModal(false)}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
