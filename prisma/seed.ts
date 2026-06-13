import { prisma } from "@/lib/prisma";

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "admin@omniagent.io" },
    update: {},
    create: {
      email: "admin@omniagent.io",
      name: "Kush Admin",
      avatar: null,
    },
  });

  const workspace = await prisma.workspace.upsert({
    where: { slug: "omniagent" },
    update: {},
    create: {
      name: "OmniAgent Workspace",
      slug: "omniagent",
      budgetLimit: 5000,
      budgetUsed: 1240.82,
    },
  });

  await prisma.teamMember.upsert({
    where: { userId_workspaceId: { userId: user.id, workspaceId: workspace.id } },
    update: {},
    create: {
      userId: user.id,
      workspaceId: workspace.id,
      role: "ADMIN",
    },
  });

  const templates = [
    {
      name: "Customer Support Agent",
      description: "AI-powered customer support with ticket routing and auto-responses.",
      category: "Support",
      icon: "🎧",
      rating: 4.8,
      downloads: 12400,
      featured: true,
      nodes: JSON.stringify([
        { id: "1", type: "workflowNode", position: { x: 100, y: 200 }, data: { label: "OpenAI", nodeType: "openai", category: "ai" } },
        { id: "2", type: "workflowNode", position: { x: 400, y: 200 }, data: { label: "If/Else", nodeType: "ifElse", category: "logic" } },
      ]),
      edges: JSON.stringify([{ id: "e1", source: "1", target: "2" }]),
    },
    {
      name: "Sales Agent",
      description: "Automated lead qualification and CRM integration.",
      category: "Sales",
      icon: "💼",
      rating: 4.6,
      downloads: 8900,
      featured: true,
      nodes: JSON.stringify([]),
      edges: JSON.stringify([]),
    },
    {
      name: "Lead Generator",
      description: "Scrape, enrich, and score leads automatically.",
      category: "Marketing",
      icon: "🎯",
      rating: 4.5,
      downloads: 6700,
      featured: false,
      nodes: JSON.stringify([]),
      edges: JSON.stringify([]),
    },
    {
      name: "Research Agent",
      description: "Deep web research and report generation.",
      category: "Research",
      icon: "🔬",
      rating: 4.7,
      downloads: 5200,
      featured: false,
      nodes: JSON.stringify([]),
      edges: JSON.stringify([]),
    },
    {
      name: "Email Agent",
      description: "Smart email drafting and inbox management.",
      category: "Communication",
      icon: "📧",
      rating: 4.4,
      downloads: 9800,
      featured: true,
      nodes: JSON.stringify([]),
      edges: JSON.stringify([]),
    },
  ];

  for (const template of templates) {
    const existing = await prisma.marketplaceTemplate.findFirst({
      where: { name: template.name },
    });
    if (!existing) {
      await prisma.marketplaceTemplate.create({ data: template });
    }
  }

  const providers = ["openai", "claude", "gemini", "deepseek"];
  const existingCosts = await prisma.costRecord.count();
  if (existingCosts === 0) {
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      for (const provider of providers) {
        await prisma.costRecord.create({
          data: {
            provider,
            model: `${provider}-default`,
            tokens: Math.floor(Math.random() * 50000) + 10000,
            cost: parseFloat((Math.random() * 50 + 10).toFixed(2)),
            date,
          },
        });
      }
    }
  }

  console.log("Seed completed successfully");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
