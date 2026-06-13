"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Bot,
  Users,
  Play,
  TrendingUp,
  DollarSign,
  Zap,
  ArrowRight,
  GitBranch,
} from "lucide-react";
import { PageContainer, PageHeader } from "@/components/shared/page-header";
import { MetricCard } from "@/components/shared/metric-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChartWidget, AreaChartWidget } from "@/components/analytics/charts";
import {
  MOCK_METRICS,
  MOCK_WORKFLOWS,
  MOCK_ACTIVITIES,
  generateTimeSeriesData,
} from "@/lib/mock-data";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

export default function DashboardPage() {
  const router = useRouter();
  const executionData = useMemo(() => generateTimeSeriesData(14, 800, 400), []);
  const costData = useMemo(
    () =>
      generateTimeSeriesData(14, 40, 20).map((d) => ({
        date: d.date,
        openai: d.cost * 0.5,
        claude: d.cost * 0.3,
        gemini: d.cost * 0.2,
      })),
    []
  );

  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        description="Overview of your AI agent platform"
        actions={
          <Button onClick={() => router.push("/workflows/new")}>
            <GitBranch className="h-4 w-4" />
            New Workflow
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total Agents"
          value={MOCK_METRICS.totalAgents}
          change={12}
          trend="up"
          icon={<Bot className="h-5 w-5" />}
        />
        <MetricCard
          label="Active Users"
          value={MOCK_METRICS.activeUsers}
          change={8}
          trend="up"
          icon={<Users className="h-5 w-5" />}
        />
        <MetricCard
          label="Executions"
          value={MOCK_METRICS.executions}
          change={23}
          trend="up"
          icon={<Play className="h-5 w-5" />}
        />
        <MetricCard
          label="Success Rate"
          value={formatPercent(MOCK_METRICS.successRate)}
          change={2.1}
          trend="up"
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <LineChartWidget title="Executions Over Time" data={executionData} dataKey="executions" />
        <AreaChartWidget
          title="AI Cost Breakdown"
          data={costData}
          dataKeys={["openai", "claude", "gemini"]}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="glass lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Recent Workflows</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => router.push("/workflows")}>
              View all
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {MOCK_WORKFLOWS.slice(0, 4).map((wf, i) => (
                <motion.button
                  key={wf.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => router.push(`/workflows/${wf.id}`)}
                  className="flex w-full items-center justify-between rounded-lg border border-border/50 p-3 text-left transition-colors hover:border-primary/30 hover:bg-primary/5"
                >
                  <div>
                    <p className="text-sm font-medium">{wf.name}</p>
                    <p className="text-xs text-muted">
                      {wf.nodes} nodes • {formatNumber(wf.executions)} runs
                    </p>
                  </div>
                  <Badge variant={wf.status === "PUBLISHED" ? "success" : "outline"}>
                    {wf.status}
                  </Badge>
                </motion.button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Activity Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {MOCK_ACTIVITIES.map((activity, i) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-3"
                >
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <div>
                    <p className="text-xs">
                      <span className="font-medium">{activity.userName}</span>{" "}
                      {activity.action}{" "}
                      <span className="text-primary">{activity.entity}</span>
                    </p>
                    <p className="text-[10px] text-muted">
                      {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          label="Revenue"
          value={formatCurrency(MOCK_METRICS.revenue)}
          change={15}
          trend="up"
          icon={<DollarSign className="h-5 w-5" />}
        />
        <MetricCard
          label="AI Costs"
          value={formatCurrency(MOCK_METRICS.aiCosts)}
          change={-5}
          trend="down"
          icon={<Zap className="h-5 w-5" />}
        />
        <MetricCard
          label="Token Usage"
          value={formatNumber(MOCK_METRICS.tokenUsage)}
          change={18}
          trend="up"
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>
    </PageContainer>
  );
}
