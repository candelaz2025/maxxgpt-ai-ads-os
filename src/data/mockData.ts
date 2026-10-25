import { 
  AdAccount, 
  Campaign, 
  RuleDefinition, 
  InterestResult, 
  MessageTierLead,
  FacebookUser,
  FacebookPage
} from '../types';

export const MOCK_FACEBOOK_USER: FacebookUser = {
  id: 'fb_usr_9918237190',
  name: 'Kittikorn Tanaporn',
  email: 'growth@brandalpha.co',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  connectedAt: '2026-10-25 09:30',
  tokenExpiresInDays: 58,
  scopes: [
    'email',
    'public_profile',
    'pages_show_list',
    'pages_read_engagement',
    'pages_manage_posts',
    'pages_messaging',
    'ads_management',
    'ads_read',
    'leads_retrieval'
  ]
};

export const MOCK_FACEBOOK_PAGES: FacebookPage[] = [
  {
    id: 'page_beauty_01',
    name: 'Maxx Beauty & Skincare Official',
    category: 'Beauty, Cosmetic & Personal Care',
    avatarUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=150&auto=format&fit=crop&q=80',
    fanCount: 142800,
    unreadMessagesCount: 14,
    connectedInstagram: {
      id: 'ig_beauty_maxx',
      username: 'maxxbeauty.official'
    },
    hasPermissions: true,
    accessTokenStatus: 'VALID',
    isDefault: true
  },
  {
    id: 'page_gadget_02',
    name: 'Neo Gadgets Thailand',
    category: 'Electronics & Smart Living',
    avatarUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=150&auto=format&fit=crop&q=80',
    fanCount: 68500,
    unreadMessagesCount: 5,
    connectedInstagram: {
      id: 'ig_neogadgets_th',
      username: 'neogadgets.th'
    },
    hasPermissions: true,
    accessTokenStatus: 'VALID'
  },
  {
    id: 'page_health_03',
    name: 'Supreme Wellness & Supplements',
    category: 'Health & Wellness Lab',
    avatarUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=150&auto=format&fit=crop&q=80',
    fanCount: 89300,
    unreadMessagesCount: 8,
    connectedInstagram: {
      id: 'ig_supremewellness',
      username: 'supreme_wellness_th'
    },
    hasPermissions: true,
    accessTokenStatus: 'VALID'
  },
  {
    id: 'page_life_04',
    name: 'Siam Modern Lifestyle Home',
    category: 'Home Decor & Furniture',
    avatarUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=150&auto=format&fit=crop&q=80',
    fanCount: 32100,
    unreadMessagesCount: 2,
    hasPermissions: true,
    accessTokenStatus: 'VALID'
  }
];

export const MOCK_AD_ACCOUNTS: AdAccount[] = [
  {
    id: 'act_9821039481',
    name: 'Maxx Beauty & Skincare Official (TH)',
    currency: 'THB',
    timezone: 'Asia/Bangkok',
    balance: 48500,
    status: 'ACTIVE',
    spendCap: 150000,
    amountSpent: 84250,
  },
  {
    id: 'act_1049283749',
    name: 'Neo Gadgets & Home Living Thailand',
    currency: 'THB',
    timezone: 'Asia/Bangkok',
    balance: 21400,
    status: 'ACTIVE',
    spendCap: 80000,
    amountSpent: 42100,
  },
  {
    id: 'act_5501928371',
    name: 'Supreme Wellness & Supplements',
    currency: 'THB',
    timezone: 'Asia/Bangkok',
    balance: 110200,
    status: 'ACTIVE',
    spendCap: 300000,
    amountSpent: 168900,
  }
];

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-1',
    name: '[PROMO] Serum 1-Free-1 Flash Sale - Broad Women 22-45',
    status: 'ACTIVE',
    objective: 'OUTCOME_SALES',
    dailyBudget: 3500,
    spend: 18450,
    roas: 4.35,
    purchases: 142,
    costPerPurchase: 129.9,
    cpc: 4.8,
    ctr: 2.85,
    impressions: 182400,
    frequency: 1.48,
    fatigueStatus: 'fresh',
    hookRate: 46.2,
    holdRate: 24.8,
    format: 'Reels 9:16',
    pageId: 'page_beauty_01',
    pageName: 'Maxx Beauty & Skincare Official',
    adSetsCount: 4,
    adsCount: 12,
    updatedAt: '10 mins ago'
  },
  {
    id: 'camp-2',
    name: '[SCALE] Best Seller Whitening Cream - Interest: Korean Cosmetics',
    status: 'ACTIVE',
    objective: 'OUTCOME_SALES',
    dailyBudget: 5000,
    spend: 26800,
    roas: 3.82,
    purchases: 184,
    costPerPurchase: 145.6,
    cpc: 5.2,
    ctr: 2.45,
    impressions: 245000,
    frequency: 1.82,
    fatigueStatus: 'fresh',
    hookRate: 41.5,
    holdRate: 21.0,
    format: 'Feed 1:1',
    pageId: 'page_beauty_01',
    pageName: 'Maxx Beauty & Skincare Official',
    adSetsCount: 5,
    adsCount: 15,
    updatedAt: '25 mins ago'
  },
  {
    id: 'camp-3',
    name: '[RETARGET] Cart Abandoners & Video Viewers 75% 7D',
    status: 'ACTIVE',
    objective: 'OUTCOME_SALES',
    dailyBudget: 1500,
    spend: 850,
    roas: 0.95,
    purchases: 1,
    costPerPurchase: 850.0,
    cpc: 14.5,
    ctr: 0.92,
    impressions: 14200,
    frequency: 3.85,
    fatigueStatus: 'saturated',
    hookRate: 18.4,
    holdRate: 7.2,
    format: 'Carousel',
    pageId: 'page_beauty_01',
    pageName: 'Maxx Beauty & Skincare Official',
    adSetsCount: 2,
    adsCount: 6,
    updatedAt: '1 hour ago'
  },
  {
    id: 'camp-4',
    name: '[CHAT LEAD] Instant Messenger Inquiries - Collagen Plus',
    status: 'ACTIVE',
    objective: 'MESSAGING',
    dailyBudget: 2000,
    spend: 9400,
    roas: 3.10,
    purchases: 78,
    costPerPurchase: 120.5,
    cpc: 3.9,
    ctr: 3.20,
    impressions: 112000,
    frequency: 1.65,
    fatigueStatus: 'warning',
    hookRate: 38.6,
    holdRate: 19.4,
    format: 'Story 9:16',
    pageId: 'page_beauty_01',
    pageName: 'Maxx Beauty & Skincare Official',
    adSetsCount: 3,
    adsCount: 9,
    updatedAt: '3 hours ago'
  },
  {
    id: 'camp-5',
    name: '[RISING STAR] New Video UGC Unboxing - Reels Format',
    status: 'ACTIVE',
    objective: 'OUTCOME_SALES',
    dailyBudget: 2500,
    spend: 4200,
    roas: 5.12,
    purchases: 48,
    costPerPurchase: 87.5,
    cpc: 3.2,
    ctr: 4.15,
    impressions: 68000,
    frequency: 1.15,
    fatigueStatus: 'fresh',
    hookRate: 58.4,
    holdRate: 36.2,
    format: 'Reels 9:16',
    pageId: 'page_beauty_01',
    pageName: 'Maxx Beauty & Skincare Official',
    adSetsCount: 3,
    adsCount: 8,
    updatedAt: 'Just now'
  },
  {
    id: 'camp-6',
    name: '[CPAS] Shopee Brand Super Day Catalog Ads',
    status: 'ACTIVE',
    objective: 'OUTCOME_SALES',
    dailyBudget: 4000,
    spend: 18900,
    roas: 4.60,
    purchases: 210,
    costPerPurchase: 90.0,
    cpc: 4.1,
    ctr: 2.90,
    impressions: 198000,
    frequency: 1.55,
    fatigueStatus: 'fresh',
    hookRate: 35.0,
    holdRate: 18.0,
    format: 'Catalog Collection',
    pageId: 'page_gadget_02',
    pageName: 'Neo Gadgets Thailand',
    adSetsCount: 4,
    adsCount: 16,
    updatedAt: '4 hours ago'
  }
];

export const MOCK_RULES: RuleDefinition[] = [
  {
    id: 'rule-ks-1',
    name: '6-Hour Fast Kill Switch (CPA Spike)',
    nameTh: 'กฎหยุดแอดด่วน 6 ชม. เมื่อเผางบแต่ไม่มีคอนเวอร์ชั่น',
    type: 'six_hour',
    condition: 'Spend >= 500 THB AND Purchases == 0',
    action: 'pause',
    enabled: true,
    requiresConfirmation: true,
    lastTriggered: '10:32 AM',
    targetCount: 1
  },
  {
    id: 'rule-scale-1',
    name: 'Winner AdSet Budget Scaler (+20%)',
    nameTh: 'กฎเพิ่มงบประมาณ 20% ให้ตัวผู้ชนะที่ ROAS สูง',
    type: 'daily',
    condition: 'ROAS >= 3.5 AND Purchases >= 5',
    action: 'increase_budget',
    actionValue: 20,
    enabled: true,
    requiresConfirmation: false,
    lastTriggered: 'Yesterday 23:59',
    targetCount: 3
  },
  {
    id: 'rule-fatigue-1',
    name: 'Creative Fatigue Alert (Frequency > 3.0x)',
    nameTh: 'แจ้งเตือนครีเอทีฟเริ่มล้าและคนเห็นซ้ำบ่อยเกินไป',
    type: 'daily',
    condition: 'Frequency > 3.0 AND CTR < 1.2%',
    action: 'alert_only',
    enabled: true,
    requiresConfirmation: false,
    lastTriggered: 'Today 08:00 AM',
    targetCount: 2
  },
  {
    id: 'rule-cpc-1',
    name: 'Intra-day CPC Inflation Guard',
    nameTh: 'ตรวจจับราคาคลิกแพงเกินปกติช่วงกลางวัน',
    type: 'six_hour',
    condition: 'CPC > 12 THB in 6h window',
    action: 'alert_only',
    enabled: true,
    requiresConfirmation: true,
    lastTriggered: 'Never',
    targetCount: 0
  }
];

export const MOCK_INTERESTS: InterestResult[] = [
  {
    id: 'int-6003182901',
    name: 'Cosmeceuticals & Medical Skincare',
    audienceSize: 2840000,
    path: ['Beauty', 'Personal Care', 'Skincare'],
    relevanceScore: 98,
    topic: 'High Intent Buyers',
    recommended: true,
    suggestedBidMultiplier: 1.15
  },
  {
    id: 'int-6004928172',
    name: 'Dermatology & Skin Barrier Repair',
    audienceSize: 1450000,
    path: ['Health & Wellness', 'Dermatology'],
    relevanceScore: 95,
    topic: 'Problem-Aware Audience',
    recommended: true,
    suggestedBidMultiplier: 1.10
  },
  {
    id: 'int-6001293849',
    name: 'Korean Beauty (K-Beauty Culture)',
    audienceSize: 5200000,
    path: ['Cosmetics', 'Asian Beauty'],
    relevanceScore: 91,
    topic: 'Trend Followers',
    recommended: true,
    suggestedBidMultiplier: 1.00
  },
  {
    id: 'int-6007718290',
    name: 'Anti-aging Treatments & Peptides',
    audienceSize: 980000,
    path: ['Luxury Beauty', 'Anti-aging'],
    relevanceScore: 89,
    topic: 'High Purchasing Power',
    recommended: true,
    suggestedBidMultiplier: 1.25
  },
  {
    id: 'int-6008827101',
    name: 'Sunscreen & UV Protection Routine',
    audienceSize: 3100000,
    path: ['Skin Protection', 'Daily Care'],
    relevanceScore: 86,
    topic: 'Broad Lifestyle',
    recommended: false,
    suggestedBidMultiplier: 0.95
  }
];

export const MOCK_LEAD_TIERS: MessageTierLead[] = [
  {
    id: 'lead-1',
    customerName: 'คุณกิตติยา รุ่งเรือง',
    pageId: 'page_beauty_01',
    pageName: 'Maxx Beauty & Skincare Official',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    tier: 'Tier S',
    purchaseProbability: 96,
    firstMessageTime: '09:42 AM',
    inquiryProduct: 'Serum 1-Free-1 Flash Set',
    summary: 'ถามเลขบัญชีพร้อมโอน แจ้งที่อยู่จัดส่งแล้ว รอแอดมินส่งยอดสุทธิพร้อมโปรโมชั่นของแถม',
    status: 'pending_reply',
    chatHistory: [
      { id: 'c1', sender: 'customer', text: 'สวัสดีค่ะ เซ็ตโปร 1 แถม 1 มีของพร้อมส่งไหมคะ?', timestamp: '09:40 AM' },
      { id: 'c2', sender: 'bot', text: 'สวัสดีค่ะคุณกิตติยา สินค้ามีพร้อมส่งค่ะ วันนี้มีแถมมาส์กหน้าทองคำฟรี 2 แผ่นด้วยนะคะ', timestamp: '09:41 AM' },
      { id: 'c3', sender: 'customer', text: 'สนใจรับ 1 เซ็ตค่ะ ขอเลขบัญชีโอนเงินกับยอดสุทธิด้วยนะคะ เดี๋ยวส่งสลิปให้เลย', timestamp: '09:42 AM' }
    ],
    suggestedReplies: [
      'ยอดสุทธิ 990 บาท จัดส่งฟรีด่วนค่ะ โอนเข้า บัญชี กสิกรไทย 092-X-XXXXX บริษัท แมกซ์ กรุ๊ป แล้วแจ้งสลิปได้เลยนะคะ',
      'รับออเดอร์เรียบร้อยค่ะคุณกิตติยา พิเศษวันนี้หากเพิ่มครีมกันแดดอีก 1 ชิ้น ได้รับส่วนลดทันที 50% รับเพิ่มด้วยไหมคะ?',
      'ส่งเลขบัญชีพร้อมสรุปรายการสั่งซื้อ: เซ็ตเซรั่ม 1 แถม 1 + มาส์กทองคำ 2 แผ่น รวม 990 บาทถ้วนค่ะ'
    ]
  },
  {
    id: 'lead-2',
    customerName: 'คุณพัชรีวรรณ วงศ์สว่าง',
    pageId: 'page_beauty_01',
    pageName: 'Maxx Beauty & Skincare Official',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
    tier: 'Tier A',
    purchaseProbability: 84,
    firstMessageTime: '10:05 AM',
    inquiryProduct: 'Whitening Cream (กระปุกใหญ่)',
    summary: 'ถามเรื่องการแพ้และสารสกัด ถ้ามีโปรส่งฟรีพร้อมสั่งซื้อทันที',
    status: 'pending_reply',
    chatHistory: [
      { id: 'c4', sender: 'customer', text: 'ผิวแพ้ง่ายมาก ใช้ครีมไวท์เทนนิ่งตัวนี้ได้ไหมคะ มีสารอันตรายไหม?', timestamp: '10:02 AM' },
      { id: 'c5', sender: 'bot', text: 'ครีมของเราผ่านการทดสอบโดยแพทย์ผิวหนัง อ่อนโยน ปราศจากแอลกอฮอล์และพาราเบน 100% ค่ะ', timestamp: '10:03 AM' },
      { id: 'c6', sender: 'customer', text: 'ถ้าสั่งตอนนี้มีโปรส่งฟรีไหมคะ อยากลองกระปุกใหญ่ค่ะ', timestamp: '10:05 AM' }
    ],
    suggestedReplies: [
      'มีโปรส่งฟรีด่วนถึงหน้าบ้านค่ะคุณพัชรีวรรณ สำหรับกระปุกใหญ่ 50g เพียง 690 บาท แถมเทสเตอร์เซรั่มฟรี 1 ซองค่ะ รับเลยไหมคะ?',
      'ยืนยันผิวแพ้ง่ายใช้ได้ปลอดภัย 100% ค่ะ มีรีวิวผู้ใช้จริงกว่า 500 ท่าน จัดส่งฟรีวันนี้พร้อมเก็บเงินปลายทางได้ค่ะ',
      'ขออนุญาตส่งรายละเอียดโปรโมชั่นกระปุกใหญ่ พร้อมรับประกันความพึงพอใจ ยินดีคืนเงินใน 14 วันค่ะ'
    ]
  },
  {
    id: 'lead-3',
    customerName: 'สมศักดิ์ มหาทรัพย์',
    pageId: 'page_gadget_02',
    pageName: 'Neo Gadgets Thailand',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    tier: 'Tier B',
    purchaseProbability: 52,
    firstMessageTime: '08:15 AM',
    inquiryProduct: 'Smart Sensor Light',
    summary: 'ถามขนาดสินค้าและราคา ไม่ตอบกลับหลังจากแอดมินแจ้งรายละเอียด',
    status: 'pending_reply',
    chatHistory: [
      { id: 'c7', sender: 'customer', text: 'ตัวไฟเซ็นเซอร์ติดตู้เสื้อผ้ามีสีอะไรบ้างครับ?', timestamp: '08:12 AM' },
      { id: 'c8', sender: 'admin', text: 'มีแสงขาว Warm White และแสง Daylight ค่ะ ติดตั้งด้วยแม่เหล็กไม่ต้องเจาะผนัง', timestamp: '08:14 AM' },
      { id: 'c9', sender: 'customer', text: 'ยาวกี่เซนติเมตรครับ และชาร์จไฟอยู่ได้กี่วัน?', timestamp: '08:15 AM' }
    ],
    suggestedReplies: [
      'รุ่นมาตรฐานยาว 40 ซม. แบตเตอรี่อึด ใช้งานได้ 60-90 วันต่อการชาร์จ 1 ครั้งค่ะ วันนี้ซื้อ 2 ชิ้นลดเพิ่ม 100 บาทครับ',
      'เรียนคุณสมศักดิ์ แนะนำเซ็ตคู่ 40cm + 20cm เหมาะสำหรับติดตู้เสื้อผ้าและใต้บันได พร้อมสายชาร์จ Type-C ครบชุดครับ'
    ]
  },
  {
    id: 'lead-4',
    customerName: 'Noppadol_2026',
    pageId: 'page_beauty_01',
    pageName: 'Maxx Beauty & Skincare Official',
    tier: 'Tier C',
    purchaseProbability: 25,
    firstMessageTime: '07:30 AM',
    inquiryProduct: 'General Inquiry',
    summary: 'กดปุ่มอัตโนมัติ "มีสินค้าไหม" แล้วเงียบหาย',
    status: 'dropped',
    chatHistory: [
      { id: 'c10', sender: 'customer', text: 'มีสินค้าไหมคะ', timestamp: '07:30 AM' },
      { id: 'c11', sender: 'bot', text: 'สวัสดีค่ะ มีสินค้าพร้อมส่งทุกรายการค่ะ สามารถสอบถามโปรโมชั่นได้เลยนะคะ', timestamp: '07:30 AM' }
    ],
    suggestedReplies: [
      'สวัสดีค่ะคุณนพดล ตอนนี้ทางร้านมีโค้ดลดพิเศษ 100 บาทสำหรับลูกค้าใหม่ สนใจดูสินค้าตัวไหนเป็นพิเศษไหมคะ?'
    ]
  },
  {
    id: 'lead-5',
    customerName: 'Telegram Loan Bot #491',
    pageId: 'page_beauty_01',
    pageName: 'Maxx Beauty & Skincare Official',
    tier: 'Spam / Ghost',
    purchaseProbability: 0,
    firstMessageTime: '06:12 AM',
    inquiryProduct: 'None (Spam Link)',
    summary: 'ส่งลิงก์ชวนกู้เงินนอกระบบและบอทแชทผี - ระบบทำการบล็อกและซ่อนอัตโนมัติ',
    status: 'dropped',
    chatHistory: [
      { id: 'c12', sender: 'customer', text: 'เงินด่วน อนุมัติไว แอดไลน์ @fastmoney2026', timestamp: '06:12 AM' }
    ],
    suggestedReplies: []
  }
];

export const MOCK_PROMPT_TEMPLATES = [
  {
    id: 'aida',
    name: 'AIDA Framework (Attention - Interest - Desire - Action)',
    description: 'โครงสร้างคลาสสิกสำหรับสร้างยอดขาย ปูพื้นเปิดปัญหา สร้างความอยากได้ และตบท้ายด้วยโปรโมชั่นเร่งด่วน',
    sampleOutput: `🚨 หยุดสิวเห่อ ผิวพัง ใน 7 วัน! ไม่ต้องเลเซอร์แพงๆ (Attention)
.
สาวๆ วัย 25+ สังเกตไหม ผิวเริ่มหมอง รูขุมขนกว้าง แต่งหน้าไม่ติด? เซรั่มทั่วไปเติมแค่น้ำ แต่ตัวนี้คือ นวัตกรรม Peptide Barrier Repair เติมลึกถึงชั้นเซลล์ (Interest)
.
⭐️ 98% ของผู้ใช้จริงกว่า 50,000 คน ยืนยัน หน้าเนียนใสขึ้นจนคนรอบข้างทัก รอยสิวจางลงชัดเจนในขวดแรก! (Desire)
.
🎁 พิเศษเฉพาะ 50 ท่านแรกของวันนี้: ซื้อ 1 แถม 1 ฟรี! แถมส่งด่วนฟรีถึงหน้าบ้าน
👉 ทักข้อความ Inbox เพื่อรับสิทธิ์ก่อนสินค้าหมด!`
  },
  {
    id: 'pas',
    name: 'PAS Framework (Problem - Agitate - Solution)',
    description: 'เจาะจุดเจ็บปวด (Pain Point) ตอกย้ำความหงุดหงิด แล้วมอบทางออกด้วยสินค้าของคุณทันที',
    sampleOutput: `เหนื่อยไหมกับการต้องตื่นมากลบรองพื้นหนาๆ ทุกเช้า? (Problem)
.
ยิ่งโบกแป้ง ผิวยิ่งอุดตัน สิวใหม่ยิ่งขึ้น พอส่องกระจกตอนเย็น แป้งตกร่องจนหมดความมั่นใจ... เสียเงินลองครีมมาเป็นหมื่นแต่หน้าก็ยังพังเหมือนเดิม (Agitate)
.
จบวงจรนี้ด้วย [ชื่อสินค้า] บูสต์ผิวกลาสสกินตัวจริง เผยผิวสดแบบไม่ต้องพึ่งฟิลเตอร์
✨ ดูรีวิวจากลูกค้าตัวจริงได้ใต้โพสต์นี้เลย!`
  },
  {
    id: 'hook-gen',
    name: '5 Viral Hook Openers (สำหรับวิดีโอ Reels / TikTok)',
    description: '5 ประโยคเปิดหัวหยุดนิ้วโป้งใน 3 วินาทีแรก เพิ่ม Hook Rate ทะลุ 45%+',
    sampleOutput: `1. "ถ้าคุณกำลังจะซื้อ [สินค้าคู่แข่ง]... หยุดดูคลิปนี้ก่อน 30 วิ!"
2. "3 สิ่งที่หมอผิวหนังไม่เคยบอกคุณเรื่อง..."
3. "เตือนแล้วนะ! ใครที่มีปัญหา [...] อย่าเพิ่งเลื่อนผ่านคลิปนี้"
4. "ลองมาหมดแล้วเป็นแสน สุดท้ายมาจบที่กระปุกละ [...] บาทนี้เฉยเลย"
5. "POV: ตอนที่คุณรู้ความลับนี้เมื่อ 5 ปีก่อน ผิวคุณคงไม่พังขนาดนี้"`
  }
];
