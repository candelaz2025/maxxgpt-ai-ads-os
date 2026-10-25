# MaxxGPT Clone — AI Ads Operating System & 30-Subagent Swarm

> **Full Clone & Modernization of [MaxxGPT](https://app.maxxgpt.ai/home)**  
> Next-generation AI Marketing & Ads Management Platform for Meta (Facebook & Instagram) Ads, driven by an autonomous **30-Subagent Swarm Orchestrator**.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies (already installed)
npm install

# 2. Start the development server
npm run dev

# 3. Open in your browser
http://localhost:3000
```

---

## 🏛️ 30-Subagent Swarm Architecture

The system is coordinated by a central **Master Orchestrator (Agent 01)** routing tasks and enforcing human safety confirmation across **6 Specialized Divisions**:

```
                              [ User / Marketer ]
                                       ▲
                                       ▼
                   ┌───────────────────────────────────────┐
                   │    A01: Master Orchestrator Agent     │
                   └───────────────────┬───────────────────┘
                                       │
     ┌──────────────┬──────────────┬───┴──────────┬──────────────┬──────────────┐
     ▼              ▼              ▼              ▼              ▼              ▼
[Division 1]   [Division 2]   [Division 3]   [Division 4]   [Division 5]   [Division 6]
Core Ad Engine  Rules & Safe   Conversion &   Spotlight &    Strategy &     Infra, Billing
& Meta API      Safeguards     Video Formats  Ranking        Integrations   & Security
(A02 - A05)    (A06 - A10)    (A11 - A15)    (A16 - A20)    (A21 - A25)    (A26 - A30)
```

### Complete Subagents Roster

| ID | Name (TH) | Role |
|---|---|---|
| **A01** | หัวหน้าผู้ควบคุมระบบและกระจายงาน | Master Orchestrator & Swarm State Dispatcher |
| **A02** | ตัวเชื่อมต่อ Meta Marketing API v21+ | Meta Graph API Bridge & Rate Limiter |
| **A03** | ค้นหา Interest ที่ซ่อนอยู่ในระบบ Meta | Interest Finder & Hidden Graph Discovery |
| **A04** | ระบบปล่อยแคมเปญอัตโนมัติ 1 คลิก | Ad Launcher & Asset Ingestion Deployer |
| **A05** | ตรวจจับครีเอทีฟล้าและการเสื่อมสภาพ | Creative Fatigue & Saturation Decay Watcher |
| **A06** | เพิ่มงบประมาณให้ตัวผู้ชนะอัตโนมัติ | Dynamic Budget Scaling Engine (+20%) |
| **A07** | ระบบหยุดแคมเปญเผางบฉุกเฉิน | Emergency Kill Switch Safeguard (Human Confirm) |
| **A08** | ระบบเฝ้าผลและตรวจจับทุก 6 ชั่วโมง | 6-Hour Fast Intra-day Rule Engine |
| **A09** | กฎประจำวันและปรับสมดุลงบประมาณ | Daily Rules & End-of-Day Balancer |
| **A10** | สร้างแผนผังความร้อนเจาะกลุ่มเป้าหมาย | Audience Demographic Heatmap Engine |
| **A11** | จัดเกรดแชท Inbox และคัดกรองผี/สแปม | Message Tier List & Lead Qualifier (S/A/B/C) |
| **A12** | วิเคราะห์อัตราหยุดดู 3 วิ และ Hold Rate | Video 3s Hook Rate & 15s Hold Rate Analyst |
| **A13** | ผู้เชี่ยวชาญโฆษณา Collaborative Ads | CPAS Marketplace Specialist (Shopee/Lazada) |
| **A14** | เพิ่มประสิทธิภาพยอดขายตรงและ Pixel | Meta Purchase & Conversions API Maximizer |
| **A15** | ลดต้นทุน Lead และปรับปรุง Instant Form | Lead Ads CPL & Instant Form Optimizer |
| **A16** | คัดสรรโฆษณาอันดับหนึ่งและถอดรหัส | Top Rank Ad Spotlighter (Winner Reverse-Eng) |
| **A17** | ตรวจจับโฆษณาผลงานแย่และตัดงบรั่วไหล | Bottom Rank Ad Auditor (Budget Drain Isolate) |
| **A18** | ตรวจจับโฆษณาดาวรุ่งที่กำลังพุ่งแรง | Rising Star Momentum Detector (<48h Breakout) |
| **A19** | เปรียบเทียบตัวชี้วัดกับค่าเฉลี่ยอุตสาหกรรม | Ad Metric Industry Benchmark Evaluator |
| **A20** | คลัง Prompt สร้างแคปชั่นและบทโฆษณา | Prompt Builder & Direct Response Copy Architect |
| **A21** | แตกไอเดียมุมมองคอนเทนต์ใหม่จากตัวขายดี | Content Angle & Creative Iteration Expander |
| **A22** | หมอตรวจสุขภาพแคมเปญและประมูล | AI Campaign Health & Auction Overlap Doctor |
| **A23** | ส่งออกรายงานไปยัง Google Sheets / CSV | Report Exporter & BI Sync Specialist |
| **A24** | ตัวเชื่อมต่อ MCP สำหรับ Claude & ChatGPT | Claude & ChatGPT Model Context Protocol Bridge |
| **A25** | จัดการหลายบัญชีโฆษณาและหลายแฟนเพจ | Multi-Account & Multi-Page Tenant Manager |
| **A26** | ระบบเครดิตการใช้งานและจัดการแพ็กเกจ | Credit Ledger & Stripe Billing Controller |
| **A27** | ควบคุมธีม Dark & Gold และ UI/UX | Cyber-Gold Aesthetics & Design System Enforcer |
| **A28** | แคชข้อมูลความเร็วสูงและฐานข้อมูล | In-Memory TTL Cache & High-Speed Data Store |
| **A29** | ความปลอดภัย เข้ารหัส Access Token | AES-256 Token Encryption & Immutable Audit Vault |
| **A30** | ทดสอบระบบอัตโนมัติและจำลองข้อมูล | QA Synthetic Sandbox & Swarm Health Verifier |

---

## ⚡ Core Features & Navigation Routes

1. **Dashboard (`/dashboard`)**: Full Meta Ads command center with live campaign switches, metric cards, date range filtering, and inline scaling/kill switch triggers.
2. **30-Subagent Swarm Control Center (`/swarm-orchestrator`)**: Live multi-agent telemetries, filter by division, broadcast scan, custom manual task dispatcher, and pending proposals approval modal.
3. **Assistant Hub (`/ai-tools`)**:
   - **Interest Finder**: Queries unlisted Meta interests with audience size and relevance score.
   - **Ad Launcher**: 1-click campaign builder from creative assets with AI-generated captions.
   - **Audience Heatmap**: Demographic breakdown (Age x Gender x Region).
   - **Budget Scaling**: Strategic expansion calculations for winner adsets.
   - **Kill Switch**: Safety-guarded pause mechanism.
4. **Creative Fatigue Analyzer (`/creative-fatigue`)**: Detects frequency vs CTR decay curves to prevent budget waste.
5. **Rules Automation (`/hour-rules` & `/basic-rule`)**: High-frequency 6-hour intra-day rules and midnight 24-hour balance rules.
6. **Message Tier List (`/messagetierlist`)**: Grades Messenger leads (Tier S, A, B, C, Spam/Ghost) with conversion probabilities.
7. **Video Ads Analysis (`/videoanalysis`)**: Computes 3-second Hook Rate and 15-second Hold Rate for Reels and Feed videos.
8. **Prompt Builder (`/prompt-builder`)**: Instant templates for AIDA, PAS, and 5 Viral Hook Openers.
9. **Spotlights & Rankings (`/ad-spotlight`, `/post-spotlight`, `/topads`, `/bottomads`, `/risingstars`)**: In-depth creative breakdowns.
10. **Custom Reports (`/exportreport`)**: 1-click export to Google Sheets and CSV.

---

## 🛡️ Safety Confirmation Guard
To prevent accidental budget changes, any destructive action proposed by the AI (such as pausing an AdSet or scaling by >30%) creates a **Pending Proposal** that strictly requires explicit **Marketer Confirmation** before execution.

---

## 🌐 Cloudflare Edge & Supabase Production Infrastructure

### 1. Supabase Database Schema
Run the migration script located at `supabase/migrations/20261025_init_maxxgpt.sql` in your Supabase SQL Editor.
The tables include:
- `meta_accounts`: Connected Meta Ads accounts and CAPI tokens.
- `facebook_pages`: Fanpages with active access tokens and verification states.
- `campaigns`: Synchronized ad campaigns with real-time budget and performance metrics.
- `automation_rules`: 6-hour fast rules and daily midnight balancing rules.
- `pending_proposals`: Swarm agent proposals awaiting human verification.
- `message_leads`: Messenger/Instagram DM leads graded by AI (Tier S, A, B, C, Ghost).
- `agent_telemetry`: Operational logs and consensus data for all 30 subagents.

### 2. Cloudflare Security & Edge Routing
- **Edge Middleware (`src/middleware.ts`)**: Injects Cloudflare Ray ID (`cf-ray`), edge geolocation (`cf-ipcountry`), and cache headers (`CDN-Cache-Control`).
- **Turnstile Verification**: Built-in widget protecting `/connect-infra` and `/api/v2/cloudflare/turnstile`.
- **Cache Purge API**: Purges edge cache tags on budget updates and ad launcher triggers.

### 3. Facebook OAuth & Page Connection Flow (`/connect-meta`)
- Direct Meta Graph API v21.0 integration.
- Instant Facebook Page Switcher with granular permission check (`pages_read_engagement`, `pages_manage_posts`, `ads_management`, `leads_retrieval`).
- Conversions API (CAPI) Event Match Quality (EMQ) scoring monitor.

---

## 💻 Tech Stack
- **Framework**: Next.js 15 (App Router, Turbopack ready, React 19)
- **Styling**: Tailwind CSS v3.4, Lucide React icons, dark cyber-gold theme (`#080a0f`, `#d4af37`)
- **State & Swarm**: Multi-Agent Consensus Swarm with human-in-the-loop safeguards
- **Database & Auth**: Supabase PostgreSQL + Facebook Graph OAuth
- **Edge CDN & Defense**: Cloudflare Workers / Turnstile Captcha
