-- =================================================================
-- MaxxGPT AI Ads Operating System - Complete Database Schema
-- Compatible with PostgreSQL 15+ / Supabase
-- Supports both standard and alias table names for 100% interoperability
-- =================================================================

-- 1. Profiles Table (Users & Credit Balance)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  plan_tier TEXT DEFAULT 'PRO',
  credits_balance INT DEFAULT 5000,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Meta Connected Ad Accounts
CREATE TABLE IF NOT EXISTS meta_accounts (
  id TEXT PRIMARY KEY, -- e.g. act_9821039481
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  currency TEXT DEFAULT 'THB',
  timezone TEXT DEFAULT 'Asia/Bangkok',
  balance NUMERIC DEFAULT 0,
  spend_cap NUMERIC DEFAULT 0,
  amount_spent NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'ACTIVE',
  encrypted_access_token TEXT,
  token_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Meta Connected Facebook Pages
CREATE TABLE IF NOT EXISTS meta_pages (
  id TEXT PRIMARY KEY, -- Facebook Page ID e.g. 1029384756
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT,
  avatar_url TEXT,
  fan_count INT DEFAULT 0,
  unread_messages INT DEFAULT 0,
  connected_instagram_handle TEXT,
  has_permissions BOOLEAN DEFAULT TRUE,
  access_token_status TEXT DEFAULT 'VALID',
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Meta Campaigns
CREATE TABLE IF NOT EXISTS campaigns (
  id TEXT PRIMARY KEY, -- Meta Campaign ID e.g. 23851029384
  page_id TEXT REFERENCES meta_pages(id) ON DELETE SET NULL,
  account_id TEXT REFERENCES meta_accounts(id) ON DELETE SET NULL,
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

-- 5. Automated Rules (6-Hour & Daily)
CREATE TABLE IF NOT EXISTS rules (
  id TEXT PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_th TEXT,
  type TEXT DEFAULT 'six_hour', -- 'six_hour' or 'daily'
  condition TEXT NOT NULL,
  action TEXT DEFAULT 'pause',
  action_value NUMERIC,
  enabled BOOLEAN DEFAULT TRUE,
  requires_confirmation BOOLEAN DEFAULT TRUE,
  last_triggered TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Rule Action Proposals (Safety Confirmation Queue)
CREATE TABLE IF NOT EXISTS rule_proposals (
  id TEXT PRIMARY KEY,
  rule_id TEXT REFERENCES rules(id) ON DELETE CASCADE,
  campaign_id TEXT REFERENCES campaigns(id) ON DELETE CASCADE,
  recommended_action TEXT NOT NULL,
  reason TEXT NOT NULL,
  spend_at_trigger NUMERIC DEFAULT 0,
  roas_at_trigger NUMERIC DEFAULT 0,
  purchases_at_trigger INT DEFAULT 0,
  status TEXT DEFAULT 'pending_confirmation', -- 'pending_confirmation', 'approved', 'rejected'
  proposed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Message Tier Leads (Messenger / Instagram Direct Leads)
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  page_id TEXT REFERENCES meta_pages(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  tier TEXT DEFAULT 'Tier A', -- 'Tier S', 'Tier A', 'Tier B', 'Tier C', 'Spam / Ghost'
  purchase_probability INT DEFAULT 70,
  inquiry_product TEXT,
  summary TEXT,
  status TEXT DEFAULT 'pending_reply', -- 'pending_reply', 'replied', 'converted', 'dropped'
  chat_history JSONB DEFAULT '[]'::jsonb,
  suggested_replies JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Swarm Agents Telemetry & State
CREATE TABLE IF NOT EXISTS swarm_agents (
  id TEXT PRIMARY KEY, -- agent-01 to agent-30
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

-- 9. Swarm Inter-Agent Message Log
CREATE TABLE IF NOT EXISTS swarm_messages (
  id TEXT PRIMARY KEY,
  from_agent TEXT NOT NULL,
  to_agent TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'task',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =================================================================
-- Views for Compatibility with Alternative Table Names
-- =================================================================
CREATE OR REPLACE VIEW facebook_pages AS SELECT * FROM meta_pages;
CREATE OR REPLACE VIEW automation_rules AS SELECT * FROM rules;
CREATE OR REPLACE VIEW pending_proposals AS SELECT * FROM rule_proposals;
CREATE OR REPLACE VIEW message_leads AS SELECT * FROM leads;
CREATE OR REPLACE VIEW agent_telemetry AS SELECT * FROM swarm_agents;

-- Indexes for lightning-fast queries
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_roas ON campaigns(roas);
CREATE INDEX IF NOT EXISTS idx_leads_tier ON leads(tier);
CREATE INDEX IF NOT EXISTS idx_leads_page ON leads(page_id);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON rule_proposals(status);
CREATE INDEX IF NOT EXISTS idx_agents_division ON swarm_agents(division);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE meta_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE meta_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE rule_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE swarm_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE swarm_messages ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for MaxxGPT operational service
CREATE POLICY "Public full access for profiles" ON profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access for meta_accounts" ON meta_accounts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access for meta_pages" ON meta_pages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access for campaigns" ON campaigns FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access for rules" ON rules FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access for rule_proposals" ON rule_proposals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access for leads" ON leads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access for swarm_agents" ON swarm_agents FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access for swarm_messages" ON swarm_messages FOR ALL USING (true) WITH CHECK (true);
