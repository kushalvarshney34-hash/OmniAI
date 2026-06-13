export function generateTimeSeriesData(days: number, baseValue: number, variance: number) {
  const data = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: Math.floor(baseValue + (Math.random() - 0.5) * variance),
      executions: Math.floor(baseValue * 0.8 + Math.random() * variance),
      tokens: Math.floor(baseValue * 100 + Math.random() * variance * 50),
      cost: parseFloat((baseValue * 0.01 + Math.random() * 0.5).toFixed(2)),
    });
  }
  return data;
}

export function generateHeatmapData(): number[][] {
  return Array.from({ length: 7 }, () =>
    Array.from({ length: 24 }, () => Math.floor(Math.random() * 100))
  );
}

export const MOCK_METRICS = {
  totalAgents: 24,
  activeUsers: 156,
  executions: 12847,
  successRate: 94.2,
  failureRate: 5.8,
  revenue: 48250,
  aiCosts: 3240,
  tokenUsage: 2450000,
};

export const MOCK_COST_DATA = {
  today: 42.18,
  weekly: 287.45,
  monthly: 1240.82,
  providers: [
    { name: "OpenAI", value: 1840, color: "#10A37F" },
    { name: "Claude", value: 920, color: "#D97706" },
    { name: "Gemini", value: 340, color: "#4285F4" },
    { name: "DeepSeek", value: 140, color: "#6366F1" },
  ],
};

export const MOCK_MARKETPLACE: import("@/types").MarketplaceItem[] = [
  {
    id: "1",
    name: "Customer Support Agent",
    description: "AI-powered customer support with ticket routing, sentiment analysis, and auto-responses.",
    category: "Support",
    icon: "🎧",
    rating: 4.8,
    downloads: 12400,
    featured: true,
  },
  {
    id: "2",
    name: "Sales Agent",
    description: "Automated lead qualification, CRM integration, and personalized outreach sequences.",
    category: "Sales",
    icon: "💼",
    rating: 4.6,
    downloads: 8900,
    featured: true,
  },
  {
    id: "3",
    name: "Lead Generator",
    description: "Scrape, enrich, and score leads with multi-channel outreach automation.",
    category: "Marketing",
    icon: "🎯",
    rating: 4.5,
    downloads: 6700,
    featured: false,
  },
  {
    id: "4",
    name: "Research Agent",
    description: "Deep web research, summarization, and report generation with citations.",
    category: "Research",
    icon: "🔬",
    rating: 4.7,
    downloads: 5200,
    featured: false,
  },
  {
    id: "5",
    name: "Email Agent",
    description: "Smart email drafting, scheduling, follow-ups, and inbox management.",
    category: "Communication",
    icon: "📧",
    rating: 4.4,
    downloads: 9800,
    featured: true,
  },
];

export const MOCK_TEAM: import("@/types").TeamMember[] = [
  { id: "1", name: "Kush Admin", email: "admin@omniagent.io", role: "ADMIN", online: true },
  { id: "2", name: "Sarah Chen", email: "sarah@omniagent.io", role: "EDITOR", online: true },
  { id: "3", name: "Mike Johnson", email: "mike@omniagent.io", role: "EDITOR", online: false },
  { id: "4", name: "Emily Davis", email: "emily@omniagent.io", role: "VIEWER", online: true },
  { id: "5", name: "Alex Rivera", email: "alex@omniagent.io", role: "VIEWER", online: false },
];

export const MOCK_ACTIVITIES: import("@/types").ActivityItem[] = [
  { id: "1", action: "published workflow", entity: "Customer Support Agent", userName: "Sarah Chen", timestamp: new Date(Date.now() - 1800000) },
  { id: "2", action: "added comment on", entity: "Sales Pipeline", userName: "Mike Johnson", timestamp: new Date(Date.now() - 3600000) },
  { id: "3", action: "created agent", entity: "Research Bot v2", userName: "Kush Admin", timestamp: new Date(Date.now() - 7200000) },
  { id: "4", action: "updated settings in", entity: "API Keys", userName: "Emily Davis", timestamp: new Date(Date.now() - 14400000) },
];

export const MOCK_WORKFLOWS = [
  { id: "wf-1", name: "Customer Support Agent", status: "PUBLISHED", nodes: 8, executions: 3420, updatedAt: new Date(Date.now() - 86400000) },
  { id: "wf-2", name: "Sales Pipeline", status: "DRAFT", nodes: 12, executions: 0, updatedAt: new Date(Date.now() - 172800000) },
  { id: "wf-3", name: "Email Automation", status: "PUBLISHED", nodes: 6, executions: 8900, updatedAt: new Date(Date.now() - 259200000) },
  { id: "wf-4", name: "Data Enrichment", status: "PUBLISHED", nodes: 15, executions: 1560, updatedAt: new Date(Date.now() - 432000000) },
];

export const MOCK_AGENTS = [
  { id: "ag-1", name: "Support Bot", description: "Handles customer inquiries 24/7", status: "active", executions: 8420, successRate: 96.2 },
  { id: "ag-2", name: "Sales Assistant", description: "Qualifies and nurtures leads", status: "active", executions: 3210, successRate: 91.5 },
  { id: "ag-3", name: "Research Agent", description: "Automated market research", status: "paused", executions: 890, successRate: 88.3 },
  { id: "ag-4", name: "Email Writer", description: "Drafts personalized emails", status: "active", executions: 5600, successRate: 94.8 },
];
