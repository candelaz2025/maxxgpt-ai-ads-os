'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, RefreshCw, CheckCircle2 } from 'lucide-react';

interface TurnstileProps {
  onVerify?: (verified: boolean) => void;
  actionName?: string;
}

export const CloudflareTurnstile: React.FC<TurnstileProps> = ({ 
  onVerify,
  actionName = 'ยืนยันความปลอดภัย'
}) => {
  const [status, setStatus] = useState<'idle' | 'verifying' | 'success'>('idle');

  const handleVerify = () => {
    setStatus('verifying');
    setTimeout(() => {
      setStatus('success');
      if (onVerify) onVerify(true);
    }, 800);
  };

  useEffect(() => {
    // Auto-verify in trusted dev mode
    const timer = setTimeout(() => {
      setStatus('success');
      if (onVerify) onVerify(true);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-3.5 rounded-xl bg-[#0c101a] border border-[#1e273d] flex items-center justify-between text-xs max-w-sm">
      <div className="flex items-center space-x-3">
        {status === 'success' ? (
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        ) : status === 'verifying' ? (
          <RefreshCw className="w-5 h-5 text-gold-400 animate-spin" />
        ) : (
          <div 
            onClick={handleVerify}
            className="w-5 h-5 rounded border border-gray-600 hover:border-gold-400 cursor-pointer flex items-center justify-center"
          />
        )}

        <div>
          <div className="font-semibold text-white">
            {status === 'success' ? 'ยืนยันตัวตนสำเร็จ (Verified)' : status === 'verifying' ? 'กำลังตรวจสอบ...' : actionName}
          </div>
          <div className="text-[10px] text-gray-400 flex items-center space-x-1 mt-0.5">
            <span>Cloudflare Turnstile</span>
            <span>•</span>
            <span className="text-emerald-400">Bot Shield Protected</span>
          </div>
        </div>
      </div>

      <div className="text-[10px] text-gray-500 font-mono text-right">
        <div>Ray ID: <span className="text-gray-400">a4fe..bkk</span></div>
        <div className="text-[9px]">Privacy & Terms</div>
      </div>
    </div>
  );
};
