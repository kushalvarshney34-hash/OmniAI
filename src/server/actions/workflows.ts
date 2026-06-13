"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getWorkflows() {
  try {
    const workflows = await prisma.workflow.findMany({
      orderBy: { updatedAt: "desc" },
      include: { user: { select: { name: true } } },
    });
    return workflows;
  } catch {
    return [];
  }
}

export async function getWorkflow(id: string) {
  try {
    return await prisma.workflow.findUnique({
      where: { id },
      include: { user: { select: { name: true } } },
    });
  } catch {
    return null;
  }
}

export async function createWorkflow(data: {
  name: string;
  description?: string;
  userId: string;
  workspaceId: string;
}) {
  const workflow = await prisma.workflow.create({ data });
  revalidatePath("/workflows");
  return workflow;
}

export async function updateWorkflow(
  id: string,
  data: {
    name?: string;
    description?: string;
    nodes?: string;
    edges?: string;
    viewport?: string;
    status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  }
) {
  const workflow = await prisma.workflow.update({
    where: { id },
    data: { ...data, version: { increment: 1 } },
  });
  revalidatePath("/workflows");
  revalidatePath(`/workflows/${id}`);
  return workflow;
}

export async function deleteWorkflow(id: string) {
  await prisma.workflow.delete({ where: { id } });
  revalidatePath("/workflows");
}

export async function getAgents() {
  try {
    return await prisma.agent.findMany({
      orderBy: { updatedAt: "desc" },
      include: { workflow: { select: { name: true, status: true } } },
    });
  } catch {
    return [];
  }
}

export async function getMarketplaceTemplates() {
  try {
    return await prisma.marketplaceTemplate.findMany({
      orderBy: { downloads: "desc" },
    });
  } catch {
    return [];
  }
}

export async function getCostRecords(days = 30) {
  try {
    const since = new Date();
    since.setDate(since.getDate() - days);
    return await prisma.costRecord.findMany({
      where: { date: { gte: since } },
      orderBy: { date: "asc" },
    });
  } catch {
    return [];
  }
}

export async function getTeamMembers(workspaceId: string) {
  try {
    return await prisma.teamMember.findMany({
      where: { workspaceId },
      include: { user: true },
    });
  } catch {
    return [];
  }
}

export async function getAnalyticsSummary() {
  try {
    const [agentCount, executionCount, costSum] = await Promise.all([
      prisma.agent.count(),
      prisma.execution.count(),
      prisma.costRecord.aggregate({ _sum: { cost: true } }),
    ]);

    return {
      totalAgents: agentCount,
      totalExecutions: executionCount,
      totalCost: costSum._sum.cost ?? 0,
    };
  } catch {
    return { totalAgents: 0, totalExecutions: 0, totalCost: 0 };
  }
}
