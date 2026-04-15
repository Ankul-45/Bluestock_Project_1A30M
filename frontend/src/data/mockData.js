export const stateDirectory = [
  {
    id: 1,
    name: "Maharashtra",
    districts: [
      {
        id: 11,
        name: "Pune",
        subDistricts: [
          { id: 111, name: "Haveli" },
          { id: 112, name: "Baramati" },
        ],
      },
      {
        id: 12,
        name: "Mumbai Suburban",
        subDistricts: [
          { id: 121, name: "Andheri" },
          { id: 122, name: "Borivali" },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Karnataka",
    districts: [
      {
        id: 21,
        name: "Bengaluru Urban",
        subDistricts: [
          { id: 211, name: "Bengaluru North" },
          { id: 212, name: "Bengaluru South" },
        ],
      },
      {
        id: 22,
        name: "Mysuru",
        subDistricts: [
          { id: 221, name: "Nanjangud" },
          { id: 222, name: "Hunsur" },
        ],
      },
    ],
  },
  {
    id: 3,
    name: "Tamil Nadu",
    districts: [
      {
        id: 31,
        name: "Chennai",
        subDistricts: [
          { id: 311, name: "Mylapore" },
          { id: 312, name: "Ambattur" },
        ],
      },
      {
        id: 32,
        name: "Coimbatore",
        subDistricts: [
          { id: 321, name: "Mettupalayam" },
          { id: 322, name: "Sulur" },
        ],
      },
    ],
  },
];

export const villages = [
  {
    villageCode: "IN-MH-PUN-HAV-0001",
    villageName: "Alandi",
    subDistrictName: "Haveli",
    districtName: "Pune",
    stateName: "Maharashtra",
  },
  {
    villageCode: "IN-MH-PUN-BAR-0002",
    villageName: "Katewadi",
    subDistrictName: "Baramati",
    districtName: "Pune",
    stateName: "Maharashtra",
  },
  {
    villageCode: "IN-KA-BLR-BNS-0003",
    villageName: "Yelahanka",
    subDistrictName: "Bengaluru North",
    districtName: "Bengaluru Urban",
    stateName: "Karnataka",
  },
  {
    villageCode: "IN-KA-BLR-BSS-0004",
    villageName: "Anekal",
    subDistrictName: "Bengaluru South",
    districtName: "Bengaluru Urban",
    stateName: "Karnataka",
  },
  {
    villageCode: "IN-TN-CHN-MYL-0005",
    villageName: "Kotturpuram",
    subDistrictName: "Mylapore",
    districtName: "Chennai",
    stateName: "Tamil Nadu",
  },
  {
    villageCode: "IN-TN-CBE-MET-0006",
    villageName: "Karamadai",
    subDistrictName: "Mettupalayam",
    districtName: "Coimbatore",
    stateName: "Tamil Nadu",
  },
];

export const adminMetrics = [
  {
    title: "Total Villages",
    value: "6,43,123",
    change: "+2.4%",
    trend: "up",
  },
  {
    title: "Active Users",
    value: "4,281",
    change: "+8.1%",
    trend: "up",
  },
  {
    title: "Today's API Requests",
    value: "1,92,430",
    change: "+5.8%",
    trend: "up",
  },
  {
    title: "Avg Response Time",
    value: "83 ms",
    change: "SLA: <100 ms",
    trend: "neutral",
  },
  {
    title: "Total Revenue",
    value: "INR 18.7L",
    change: "+12.2%",
    trend: "up",
  },
];

export const topStatesByVillageCount = [
  { state: "UP", villages: 10231 },
  { state: "Bihar", villages: 9410 },
  { state: "MP", villages: 9085 },
  { state: "Maharashtra", villages: 8454 },
  { state: "Rajasthan", villages: 8120 },
  { state: "Odisha", villages: 7841 },
  { state: "Karnataka", villages: 7262 },
  { state: "Tamil Nadu", villages: 7020 },
  { state: "Gujarat", villages: 6748 },
  { state: "Assam", villages: 6412 },
];

export const requestTrend30Days = Array.from({ length: 30 }).map((_, index) => ({
  day: `D${index + 1}`,
  requests: 120000 + Math.round(Math.sin(index / 3) * 15000) + index * 400,
}));

export const planDistribution = [
  { plan: "Free", users: 1034 },
  { plan: "Premium", users: 1902 },
  { plan: "Pro", users: 1088 },
  { plan: "Unlimited", users: 257 },
];

export const responseTimeTrend = Array.from({ length: 24 }).map((_, index) => ({
  hour: `${index}:00`,
  p95: 70 + Math.round(Math.sin(index / 2) * 12) + (index % 4),
  p99: 94 + Math.round(Math.cos(index / 3) * 16) + (index % 5),
}));

export const endpointUsage = [
  { day: "Mon", search: 15200, villages: 10300, states: 4100 },
  { day: "Tue", search: 17100, villages: 11200, states: 4300 },
  { day: "Wed", search: 16650, villages: 10890, states: 4210 },
  { day: "Thu", search: 18500, villages: 12120, states: 4680 },
  { day: "Fri", search: 19840, villages: 13011, states: 4900 },
  { day: "Sat", search: 14220, villages: 10110, states: 3880 },
  { day: "Sun", search: 12610, villages: 9260, states: 3520 },
];

export const hourlyHeatMap = [
  { slot: "00-03", traffic: 22 },
  { slot: "03-06", traffic: 15 },
  { slot: "06-09", traffic: 42 },
  { slot: "09-12", traffic: 78 },
  { slot: "12-15", traffic: 86 },
  { slot: "15-18", traffic: 74 },
  { slot: "18-21", traffic: 69 },
  { slot: "21-24", traffic: 48 },
];

export const users = [
  {
    id: "U-1001",
    businessEmail: "ops@rapidlogix.com",
    businessName: "Rapid Logix Pvt Ltd",
    status: "Pending",
    plan: "Premium",
    registrationDate: "2026-04-08",
    lastActive: "2026-04-14",
    requestCount: 24389,
    phone: "+91 9811122233",
    gst: "27AAECR1138A1Z4",
    statesAllowed: ["Maharashtra", "Karnataka"],
    keys: 2,
  },
  {
    id: "U-1002",
    businessEmail: "tech@gramgrid.in",
    businessName: "GramGrid Analytics",
    status: "Active",
    plan: "Pro",
    registrationDate: "2026-03-21",
    lastActive: "2026-04-15",
    requestCount: 81234,
    phone: "+91 9919988877",
    gst: "29ABBCG9384R1Z9",
    statesAllowed: ["All India"],
    keys: 3,
  },
  {
    id: "U-1003",
    businessEmail: "api@kartdispatch.com",
    businessName: "Kart Dispatch",
    status: "Suspended",
    plan: "Free",
    registrationDate: "2026-02-11",
    lastActive: "2026-04-10",
    requestCount: 5230,
    phone: "+91 9000022233",
    gst: "-",
    statesAllowed: ["Tamil Nadu", "Karnataka"],
    keys: 1,
  },
  {
    id: "U-1004",
    businessEmail: "product@northroute.ai",
    businessName: "NorthRoute AI",
    status: "Active",
    plan: "Unlimited",
    registrationDate: "2026-01-15",
    lastActive: "2026-04-15",
    requestCount: 178100,
    phone: "+91 9777711111",
    gst: "07AAVFN1122B1ZA",
    statesAllowed: ["Delhi", "UP", "Haryana", "Punjab"],
    keys: 5,
  },
];

export const stateAccessAuditLog = [
  { date: "2026-04-15 10:21", admin: "admin@bluestock.in", action: "Granted all-state access", target: "U-1002" },
  { date: "2026-04-14 18:43", admin: "admin@bluestock.in", action: "Revoked Telangana", target: "U-1004" },
  { date: "2026-04-14 11:04", admin: "lead@bluestock.in", action: "Granted South region", target: "U-1001" },
];

export const b2bSummaryCards = [
  { title: "Today's Requests / Daily Limit", value: "8,420 / 20,000" },
  { title: "This Month's Requests", value: "2,21,480" },
  { title: "Avg Response Time (24h)", value: "88 ms" },
  { title: "Success Rate", value: "99.73%" },
];

export const b2bUsageDaily = Array.from({ length: 30 }).map((_, index) => ({
  day: index + 1,
  search: 650 + Math.round(Math.sin(index / 2) * 130 + 180),
  villages: 420 + Math.round(Math.cos(index / 4) * 95 + 120),
  states: 120 + Math.round(Math.sin(index / 5) * 40 + 45),
}));

export const sampleApiKeys = [
  { id: "KEY-1", key: "bk_live_2h8f....nQ3a", createdAt: "2026-03-01", lastUsedAt: "2026-04-15", status: "Active" },
  { id: "KEY-2", key: "bk_live_8m2k....mR1d", createdAt: "2026-01-10", lastUsedAt: "2026-04-12", status: "Active" },
];
