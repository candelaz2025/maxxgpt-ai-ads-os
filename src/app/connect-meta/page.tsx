'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  RefreshCw, 
  Layers, 
  Key, 
  Radio, 
  Check,
  AlertCircle
} from 'lucide-react';
import { useMetaAuth } from '@/context/MetaAuthContext';
import { useToast } from '@/components/ui/Toast';

export default function ConnectMetaPage() {
  const { 
    isConnected, 
    user, 
    pages, 
    activePage, 
    selectPage, 
    adAccounts, 
    activeAdAccount, 
    selectAdAccount,
    connectFacebook, 
    disconnectFacebook,
    isConnecting
  } = useMetaAuth();

  const { showToast } = useToast();
  const [isTestingPing, setIsTestingPing] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [pingResult, setPingResult] = useState<string | null>(null);

  const handleTestPing = async () => {
    setIsTestingPing(true);
    setPingResult(null);
    const start = Date.now();
    try {
      const res = await fetch('/api/v2/auth/facebook');
      const latency = Date.now() - start;
      const json = await res.json();
      if (res.ok) {
        setPingResult(`Meta Graph API v21.0: 200 OK (${latency}ms)`);
        showToast(`Meta API Latency: ${latency}ms`, 'success');
      } else {
        setPingResult(`Meta API Error: ${json.error || 'Failed'}`);
        showToast('การเชื่อมต่อมีปัญหา', 'error');
      }
    } catch {
      setPingResult('ไม่สามารถติดต่อเซิร์ฟเวอร์ได้');
    } finally {
      setIsTestingPing(false);
    }
  };

  const handleSaveToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;
    const ok = await connectFacebook(tokenInput.trim());
    if (ok) {
      setShowTokenInput(false);
      setTokenInput('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#1877F2] flex items-center justify-center text-white">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>
            <span>เชื่อมต่อ Facebook และจัดการเพจ (Meta Assets Hub)</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            เชื่อมต่อ Facebook Account ของคุณเพื่อดึงแฟนเพจ, จัดการสิทธิ์การยิงโฆษณา, และรับข้อความ Inbox เข้าระบบคัดกรอง
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {pingResult && (
            <span className="text-xs text-emerald-400 font-mono bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-800/40">
              {pingResult}
            </span>
          )}
          <button
            onClick={handleTestPing}
            disabled={isTestingPing}
            className="px-3.5 py-2 rounded-xl bg-[#141b2c] hover:bg-[#1b253d] border border-[#232d44] text-gray-200 text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <Radio className={`w-3.5 h-3.5 text-emerald-400 ${isTestingPing ? 'animate-ping' : ''}`} />
            <span>{isTestingPing ? 'กำลังทดสอบ Ping...' : 'ทดสอบสัญญาณ Meta API'}</span>
          </button>
        </div>
      </div>

      {/* Main Connection Status Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0d1424] via-[#0f182d] to-[#0e1322] border border-blue-500/30 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            {isConnected && user ? (
              <img
                src={user.avatarUrl}
                alt=""
                className="w-16 h-16 rounded-full object-cover border-2 border-emerald-400 shadow-xl"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#1877F2]/20 border border-blue-500/40 flex items-center justify-center text-[#1877F2]">
                <ShieldCheck className="w-8 h-8" />
              </div>
            )}

            <div>
              <div className="flex items-center space-x-2.5">
                <h2 className="text-lg font-bold text-white">
                  {isConnected && user ? user.name : 'ยังไม่ได้เชื่อมต่อ Facebook'}
                </h2>
                {isConnected ? (
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Meta Graph v21.0 Online</span>
                  </span>
                ) : (
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                    Disconnected
                  </span>
                )}
              </div>

              <div className="text-xs text-gray-400 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                {isConnected && user ? (
                  <>
                    <span>อีเมล: {user.email}</span>
                    <span>•</span>
                    <span>User ID: {user.id}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-medium">เชื่อมต่อแล้ว {pages.length} แฟนเพจ</span>
                  </>
                ) : (
                  <span>กรุณาเชื่อมต่อเพื่อซิงค์ข้อมูลแฟนเพจและแคมเปญโฆษณาจริง</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {isConnected ? (
              <button
                onClick={disconnectFacebook}
                className="px-4 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 text-rose-300 text-xs font-bold transition-all cursor-pointer"
              >
                ตัดการเชื่อมต่อ
              </button>
            ) : (
              <button
                onClick={() => setShowTokenInput(!showTokenInput)}
                className="px-5 py-2.5 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-bold flex items-center space-x-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
              >
                <Key className="w-4 h-4" />
                <span>เชื่อมต่อ Facebook ด้วย Token</span>
              </button>
            )}
          </div>
        </div>

        {/* Token Input Form */}
        {showTokenInput && !isConnected && (
          <form onSubmit={handleSaveToken} className="p-4 rounded-xl bg-[#090d16] border border-blue-500/40 space-y-3">
            <div className="text-xs font-bold text-white flex items-center space-x-1.5">
              <Key className="w-4 h-4 text-amber-400" />
              <span>กรอก Facebook User Access Token หรือ System User Token</span>
            </div>
            <p className="text-[11px] text-gray-400">
              นำ Token ที่ได้จาก Meta for Developers &gt; Tools &gt; Graph API Explorer หรือจาก System User ใน Business Manager มาใส่เพื่อซิงค์ข้อมูลจริง
            </p>
            <div className="flex items-center space-x-2">
              <input
                type="password"
                value={tokenInput}
                onChange={e => setTokenInput(e.target.value)}
                placeholder="EAAB..."
                className="flex-1 px-3 py-2 rounded-lg bg-[#121929] border border-[#232f48] text-white text-xs placeholder:text-gray-600 focus:outline-none focus:border-blue-500 font-mono"
              />
              <button
                type="submit"
                disabled={isConnecting}
                className="px-4 py-2 rounded-lg bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 flex items-center space-x-1"
              >
                {isConnecting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>{isConnecting ? 'กำลังเชื่อมต่อ...' : 'ยืนยันและซิงค์ข้อมูล'}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Pages Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white">แฟนเพจที่เชื่อมต่อ ({pages.length})</h2>
          </div>
          <span className="text-xs text-gray-400">คลิกที่เพจเพื่อตั้งเป็นเพจเป้าหมายของระบบ</span>
        </div>

        {pages.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#0c101a] border border-[#1b2336] text-center space-y-2">
            <p className="text-sm font-semibold text-gray-300">ยังไม่มีแฟนเพจเชื่อมต่อ</p>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              เมื่อคุณเชื่อมต่อ Facebook Access Token ด้านบน เพจทั้งหมดที่คุณเป็นผู้ดูแลจะแสดงขึ้นที่นี่โดยอัตโนมัติ
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pages.map(page => {
              const isSelected = activePage?.id === page.id;
              return (
                <div
                  key={page.id}
                  onClick={() => selectPage(page.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-blue-950/30 border-blue-500/60 shadow-lg shadow-blue-950/50'
                      : 'bg-[#0f1422] border-[#1d263b] hover:border-blue-500/40 hover:bg-[#131b2e]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={page.avatarUrl}
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover border border-[#273550]"
                      />
                      <div>
                        <h3 className="font-bold text-white text-sm line-clamp-1">{page.name}</h3>
                        <p className="text-[11px] text-gray-400">{page.category}</p>
                        <p className="text-[10px] text-gray-500 font-mono mt-0.5">ID: {page.id}</p>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="p-1 rounded-full bg-blue-500/20 text-blue-400">
                        <Check className="w-4 h-4" />
                      </span>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#1a2336] flex items-center justify-between text-xs">
                    <span className="text-gray-400">ผู้ติดตาม: <strong className="text-white">{page.fanCount.toLocaleString()}</strong></span>
                    <span className="text-emerald-400 font-medium">สิทธิ์พร้อมยิงแอด</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Ad Accounts Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">บัญชีโฆษณา (Ad Accounts)</h2>
        {adAccounts.length === 0 ? (
          <div className="p-6 rounded-2xl bg-[#0c101a] border border-[#1b2336] text-center text-xs text-gray-400">
            ยังไม่มีบัญชีโฆษณาเชื่อมต่อ
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {adAccounts.map(acc => {
              const isSelected = activeAdAccount?.id === acc.id;
              return (
                <div
                  key={acc.id}
                  onClick={() => selectAdAccount(acc.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-950/30 border-blue-500/60'
                      : 'bg-[#0f1422] border-[#1d263b] hover:bg-[#131b2e]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-white text-sm">{acc.name}</h3>
                      <p className="text-xs text-gray-400 font-mono">{acc.id} • {acc.currency} • {acc.timezone}</p>
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-400" />}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
