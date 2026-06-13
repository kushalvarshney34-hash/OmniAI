"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { PageContainer, PageHeader } from "@/components/shared/page-header";
import { MetricCard } from "@/components/shared/metric-card";
import {
  LineChartWidget,
  BarChartWidget,
  PieChartWidget,
} from "@/components/analytics/charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MOCK_COST_DATA, generateTimeSeriesData } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { DollarSign, AlertTriangle, TrendingUp, Zap } from "lucide-react";

const ALERTS = [
  {
    id: "1",
    type: "budget" as const,
    title: "Budget Warning",
    message: "You've used 85% of your monthly AI budget ($4,250 / $5,000)",
    severity: "warning" as const,
  },
  {
    id: "2",
    type: "spike" as const,
    title: "Usage Spike Detected",
    message: "OpenAI token usage increased 340% in the last hour",
    severity: "critical" as const,
  },
  {
    id: "3",
    type: "anomaly" as const,
    title: "Anomaly Detected",
    message: "Unusual cost pattern detected for Claude API calls",
    severity: "warning" as const,
  },
];

export default function BillingPage() {
  const costTrend = useMemo(() => generateTimeSeriesData(30, 40, 25), []);
  const providerComparison = MOCK_COST_DATA.providers.map((p) => ({
    name: p.name,
    spend: p.value,
  }));

  const budgetUsedPercent = (MOCK_COST_DATA.monthly / 5000) * 100;

  return (
    <PageContainer>
      <PageHeader
        title="Billing & Cost Monitoring"
        description="Track AI usage costs and manage your budget"
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          label="Today's Cost"
          value={formatCurrency(MOCK_COST_DATA.today)}
          change={12}
          trend="up"
          icon={<DollarSign className="h-5 w-5" />}
        />
        <MetricCard
          label="Weekly Cost"
          value={formatCurrency(MOCK_COST_DATA.weekly)}
          change={-3}
          trend="down"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <MetricCard
          label="Monthly Cost"
          value={formatCurrency(MOCK_COST_DATA.monthly)}
          change={8}
          trend="up"
          icon={<Zap className="h-5 w-5" />}
        />
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Monthly Budget</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>{formatCurrency(MOCK_COST_DATA.monthly)} used</span>
            <span className="text-muted">{formatCurrency(5000)} limit</span>
          </div>
          <Progress value={budgetUsedPercent} />
          <p className="text-xs text-muted">{budgetUsedPercent.toFixed(1)}% of budget used</p>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <LineChartWidget title="Cost Trends" data={costTrend} dataKey="cost" />
        <BarChartWidget title="Provider Comparison" data={providerComparison} dataKey="spend" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <PieChartWidget
          title="Cost Distribution"
          data={MOCK_COST_DATA.providers.map((p) => ({ name: p.name, value: p.value }))}
        />

        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Cost Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ALERTS.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-lg border border-border/50 p-3"
              >
                <div className="flex items-center gap-2">
                  <Badge variant={alert.severity === "critical" ? "danger" : "warning"}>
                    {alert.type}
                  </Badge>
                  <span className="text-sm font-medium">{alert.title}</span>
                </div>
                <p className="mt-1 text-xs text-muted">{alert.message}</p>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MOCK_COST_DATA.providers.map((provider, index) => (
          <motion.div
            key={provider.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass p-4">
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: provider.color }}
                />
                <span className="text-sm font-medium">{provider.name}</span>
              </div>
              <p className="mt-2 text-xl font-bold">{formatCurrency(provider.value)}</p>
              <p className="text-xs text-muted">This month</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </PageContainer>
  );
}
