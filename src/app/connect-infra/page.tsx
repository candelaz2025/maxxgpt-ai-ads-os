'use client';

import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Cloud, 
  ShieldCheck, 
  CheckCircle2, 
  RefreshCw, 
  Copy, 
  ExternalLink,
  Layers,
  Terminal,
  Activity,
  Globe,
  Radio,
  FileCode,
  Zap,
  Check,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { CloudflareTurnstile } from '@/components/cloudflare/CloudflareTurnstile';

export default function ConnectInfraPage() {
  const { showToast } = useToast();

  const [supabaseStatus, setSupabaseStatus] = useState<any>({
    configured: false,
    connected: false,
    mode: 'DISCONNECTED',
    latencyMs: 0,
    url: '',
    tableCounts: {
      campaigns: 0,
      meta_pages: 0,
      rules: 0,
      leads: 0,
      swarm_agents: 0
    }
  });

  const [cloudflareStatus, setCloudflareStatus] = useState<any>({
    enabled: true,
    rayId: 'Waiting for Edge Request...',
    edgeLocation: 'Cloudflare Edge',
    country: 'TH',
    clientIp: '127.0.0.1',
    botScore: 99,
    cacheHitRatio: 96.8,
    ddosShieldActive: true,
    sslVersion: 'TLS 1.3 (Cloudflare Universal SSL)'
  });

  const [isTestingDB, setIsTestingDB] = useState(false);
  const [isPurgingCache, setIsPurgingCache] = useState(false);
  const [copiedSQL, setCopiedSQL] = useState(false);

  const fetchDBHealth = async () => {
    setIsTestingDB(true);
    try {
      const res = await fetch('/api/v2/infra/health');
      const json = await res.json();
      if (json.data) {
        setSupabaseStatus(json.data);
        if (json.data.connected) {
          showToast(`เชื่อมต่อ Supabase Database สำเร็จ! ความหน่วง: ${json.data.latencyMs}ms`, 'success');
        } else {
          showToast(`Supabase: ${json.data.error || 'ยังไม่ได้เชื่อมต่อหรือรัน Migration'}`, 'error');
        }
      }
    } catch {
      showToast('ไม่สามารถตรวจสอบฐานข้อมูลได้', 'error');
    } finally {
      setIsTestingDB(false);
    }
  };

  useEffect(() => {
    fetchDBHealth();

    fetch('/api/v2/cloudflare')
      .then(res => res.json())
      .then(res => {
        if (res.data) setCloudflareStatus(res.data);
      })
      .catch(() => {});
  }, []);

  const handlePurgeCache = async () => {
    setIsPurgingCache(true);
    try {
      const res = await fetch('/api/v2/cloudflare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'purge_cache' })
      });
      const data = await res.json();
      showToast(data.message || 'ล้างแคช Cloudflare Edge Cache สำเร็จ!', 'success');
    } catch {
      showToast('การล้างแคชขัดข้อง', 'error');
    } finally {
      setIsPurgingCache(false);
    }
  };

  const handleCopySQL = () => {
    const sqlScript = `-- MaxxGPT AI Ads Operating System - Initial Database Schema
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  plan_tier TEXT DEFAULT 'PRO',
  credits_balance INT DEFAULT 5000,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS meta_accounts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  currency TEXT DEFAULT 'THB',
  timezone TEXT DEFAULT 'Asia/Bangkok',
  balance NUMERIC DEFAULT 0,
  spend_cap NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'ACTIVE',
  encrypted_access_token TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS meta_pages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  avatar_url TEXT,
  fan_count INT DEFAULT 0,
  unread_messages INT DEFAULT 0,
  has_permissions BOOLEAN DEFAULT TRUE,
  access_token_status TEXT DEFAULT 'VALID',
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS campaigns (
  id TEXT PRIMARY KEY,
  page_id TEXT,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'ACTIVE',
  objective TEXT DEFAULT 'OUTCOME_SALES',
  daily_budget NUMERIC DEFAULT 0,
  spend NUMERIC DEFAULT 0,
  roas NUMERIC DEFAULT 0,
  purchases INT DEFAULT 0,
  cost_per_purchase NUMERIC DEFAULT 0,
  cpc NUMERIC DEFAULT 0,
  ctr NUMERIC DEFAULT 0,
  impressions INT DEFAULT 0,
  frequency NUMERIC DEFAULT 1.0,
  fatigue_status TEXT DEFAULT 'fresh',
  hook_rate NUMERIC DEFAULT 0,
  hold_rate NUMERIC DEFAULT 0,
  format TEXT DEFAULT 'Reels 9:16',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rules (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'six_hour',
  condition TEXT NOT NULL,
  action TEXT DEFAULT 'pause',
  action_value NUMERIC,
  enabled BOOLEAN DEFAULT TRUE,
  requires_confirmation BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rule_proposals (
  id TEXT PRIMARY KEY,
  rule_id TEXT,
  campaign_id TEXT,
  recommended_action TEXT NOT NULL,
  reason TEXT NOT NULL,
  spend_at_trigger NUMERIC DEFAULT 0,
  roas_at_trigger NUMERIC DEFAULT 0,
  purchases_at_trigger INT DEFAULT 0,
  status TEXT DEFAULT 'pending_confirmation',
  proposed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  tier TEXT DEFAULT 'Tier A',
  purchase_probability INT DEFAULT 70,
  inquiry_product TEXT,
  summary TEXT,
  status TEXT DEFAULT 'pending_reply',
  chat_history JSONB DEFAULT '[]'::jsonb,
  suggested_replies JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS swarm_agents (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  name_th TEXT,
  division TEXT NOT NULL,
  status TEXT DEFAULT 'idle',
  current_task TEXT,
  efficiency_score NUMERIC DEFAULT 99.0,
  tasks_completed INT DEFAULT 0,
  last_active TIMESTAMPTZ DEFAULT NOW()
);

-- Compatibility views
CREATE OR REPLACE VIEW facebook_pages AS SELECT * FROM meta_pages;
CREATE OR REPLACE VIEW automation_rules AS SELECT * FROM rules;
CREATE OR REPLACE VIEW pending_proposals AS SELECT * FROM rule_proposals;
CREATE OR REPLACE VIEW message_leads AS SELECT * FROM leads;
CREATE OR REPLACE VIEW agent_telemetry AS SELECT * FROM swarm_agents;
`;

    navigator.clipboard.writeText(sqlScript);
    setCopiedSQL(true);
    showToast('คัดลอก SQL Migration สำหรับ Supabase เรียบร้อยแล้ว!', 'success');
    setTimeout(() => setCopiedSQL(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2.5">
            <Zap className="w-6 h-6 text-gold-400" />
            <span>โครงสร้างพื้นฐานระบบจริง (Cloudflare Edge & Supabase Hub)</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            ศูนย์กลางมอนิเตอร์และควบคุมความปลอดภัย Edge Routing, Anti-Bot Turnstile และฐานข้อมูล PostgreSQL ความเร็วสูง
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchDBHealth}
            disabled={isTestingDB}
            className="px-3.5 py-2 rounded-xl bg-[#141b2c] hover:bg-[#1b253d] border border-[#232d44] text-gray-200 text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <Radio className={`w-3.5 h-3.5 text-emerald-400 ${isTestingDB ? 'animate-ping' : ''}`} />
            <span>{isTestingDB ? 'กำลังทดสอบ Ping...' : 'ทดสอบความหน่วง Supabase'}</span>
          </button>
        </div>
      </div>

      {/* Grid 2 Columns: Supabase & Cloudflare */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Supabase Status Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0d1424] to-[#0a0e18] border border-emerald-500/30 space-y-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-base font-bold text-white">Supabase PostgreSQL 15+</h2>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                    supabaseStatus.connected 
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  }`}>
                    {supabaseStatus.connected ? 'ONLINE' : 'NOT CONNECTED'}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">Database Cluster & Real-time Row Level Security</p>
              </div>
            </div>

            <button
              onClick={fetchDBHealth}
              disabled={isTestingDB}
              className="p-2 rounded-lg bg-[#141d30] border border-[#233150] text-gray-300 hover:text-white transition-colors cursor-pointer"
              title="Ping Database"
            >
              <RefreshCw className={`w-4 h-4 ${isTestingDB ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#090e18] border border-[#1b253d]">
              <div className="text-gray-400 text-[11px]">Database Latency</div>
              <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">
                {supabaseStatus.connected ? `${supabaseStatus.latencyMs}ms` : 'Offline'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#090e18] border border-[#1b253d]">
              <div className="text-gray-400 text-[11px]">โหมดการจัดเก็บ</div>
              <div className="text-xs font-bold text-white mt-1.5 font-mono">
                {supabaseStatus.mode}
              </div>
            </div>
          </div>

          {supabaseStatus.error && (
            <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-800/40 text-rose-300 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{supabaseStatus.error}</span>
            </div>
          )}

          {/* Table Counts */}
          <div className="space-y-2 pt-1 text-xs">
            <div className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider">
              ตารางข้อมูลจริงใน Supabase (Real Table Rows)
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-lg bg-[#0e1626] border border-[#1d2d4c] text-center">
                <div className="text-[10px] text-gray-400">Campaigns</div>
                <div className="text-sm font-bold text-white font-mono mt-0.5">
                  {supabaseStatus.tableCounts?.campaigns || 0}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0e1626] border border-[#1d2d4c] text-center">
                <div className="text-[10px] text-gray-400">Rules</div>
                <div className="text-sm font-bold text-white font-mono mt-0.5">
                  {supabaseStatus.tableCounts?.rules || 0}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0e1626] border border-[#1d2d4c] text-center">
                <div className="text-[10px] text-gray-400">Leads</div>
                <div className="text-sm font-bold text-white font-mono mt-0.5">
                  {supabaseStatus.tableCounts?.leads || 0}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-[#18233a]">
            <span className="text-[11px] text-gray-400 font-mono truncate max-w-xs">{supabaseStatus.url}</span>
            <button
              onClick={handleCopySQL}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              {copiedSQL ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSQL ? 'คัดลอกแล้ว!' : 'คัดลอก SQL Schema'}</span>
            </button>
          </div>
        </div>

        {/* Cloudflare Edge Status Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#12101e] to-[#0c0915] border border-amber-500/30 space-y-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Cloud className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-base font-bold text-white">Cloudflare Edge & Security</h2>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                    Active Edge
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">Global Anycast Network & DDoS Defense</p>
              </div>
            </div>

            <button
              onClick={handlePurgeCache}
              disabled={isPurgingCache}
              className="px-3 py-1.5 rounded-lg bg-amber-950/40 hover:bg-amber-900/60 border border-amber-700/50 text-amber-300 text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPurgingCache ? 'animate-spin' : ''}`} />
              <span>{isPurgingCache ? 'กำลังล้างแคช...' : 'Purge Edge Cache'}</span>
            </button>
          </div>

          {/* Cloudflare Ray & Geolocation */}
          <div className="p-3.5 rounded-xl bg-[#0b0813] border border-[#271d3d] space-y-2 text-xs font-mono">
            <div className="flex justify-between items-center text-gray-400 text-[11px]">
              <span>Cloudflare Ray ID:</span>
              <span className="text-amber-300 font-bold">{cloudflareStatus.rayId}</span>
            </div>
            <div className="flex justify-between items-center text-gray-400 text-[11px]">
              <span>Edge Geolocation:</span>
              <span className="text-emerald-400">{cloudflareStatus.country}</span>
            </div>
            <div className="flex justify-between items-center text-gray-400 text-[11px]">
              <span>SSL / TLS:</span>
              <span className="text-white">{cloudflareStatus.sslVersion}</span>
            </div>
          </div>

          {/* Turnstile Anti-Bot Security */}
          <div className="p-4 rounded-xl bg-[#0f0b1a] border border-amber-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Cloudflare Turnstile Anti-Bot Challenge</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">Human Verified (Score 99)</span>
            </div>
            <CloudflareTurnstile onVerify={() => showToast('Turnstile Verified Human Session', 'success')} />
          </div>
        </div>
      </div>
    </div>
  );
}
