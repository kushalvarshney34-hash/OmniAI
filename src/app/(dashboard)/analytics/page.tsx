"use client";

import { useMemo, useState } from "react";
import { PageContainer, PageHeader } from "@/components/shared/page-header";
import { MetricCard } from "@/components/shared/metric-card";
import {
  LineChartWidget,
  AreaChartWidget,
  BarChartWidget,
  PieChartWidget,
  HeatmapWidget,
} from "@/components/analytics/charts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOCK_METRICS, MOCK_COST_DATA, generateTimeSeriesData, generateHeatmapData } from "@/lib/mock-data";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";
import { Bot, Users, Play, TrendingUp, DollarSign, Zap, AlertTriangle } from "lucide-react";
import type { TimeRange } from "@/types";

const RANGE_DAYS: Record<TimeRange, number> = {
  daily: 7,
  weekly: 14,
  monthly: 30,
  yearly: 365,
};

export default function AnalyticsPage() {
  const [range, setRange] = useState<TimeRange>("monthly");
  const days = RANGE_DAYS[range];

  const executionData = useMemo(() => generateTimeSeriesData(days, 800, 400), [days]);
  const tokenData = useMemo(() => generateTimeSeriesData(days, 50000, 20000), [days]);
  const costTrendData = useMemo(() => generateTimeSeriesData(days, 40, 20), [days]);
  const heatmapData = useMemo(() => generateHeatmapData(), []);

  const providerBarData = MOCK_COST_DATA.providers.map((p) => ({
    name: p.name,
    cost: p.value,
  }));

  return (
    <PageContainer>
      <PageHeader
        title="Analytics"
        description="Platform performance and usage insights"
        actions={
          <Tabs value={range} onValueChange={(v) => setRange(v as TimeRange)}>
            <TabsList>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>
          </Tabs>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Total Agents" value={MOCK_METRICS.totalAgents} change={12} trend="up" icon={<Bot className="h-5 w-5" />} />
        <MetricCard label="Active Users" value={MOCK_METRICS.activeUsers} change={8} trend="up" icon={<Users className="h-5 w-5" />} />
        <MetricCard label="Executions" value={MOCK_METRICS.executions} change={23} trend="up" icon={<Play className="h-5 w-5" />} />
        <MetricCard label="Success Rate" value={formatPercent(MOCK_METRICS.successRate)} change={2.1} trend="up" icon={<TrendingUp className="h-5 w-5" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <LineChartWidget title="Executions" data={executionData} dataKey="executions" />
        <LineChartWidget title="Token Usage" data={tokenData} dataKey="tokens" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <AreaChartWidget
          title="Cost Trends"
          data={costTrendData.map((d) => ({ date: d.date, cost: d.cost }))}
          dataKeys={["cost"]}
        />
        <BarChartWidget title="Executions by Provider" data={providerBarData} dataKey="cost" />
        <PieChartWidget
          title="Cost Distribution"
          data={MOCK_COST_DATA.providers.map((p) => ({ name: p.name, value: p.value }))}
        />
      </div>

      <HeatmapWidget title="Execution Heatmap" data={heatmapData} />

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Revenue" value={formatCurrency(MOCK_METRICS.revenue)} change={15} trend="up" icon={<DollarSign className="h-5 w-5" />} />
        <MetricCard label="AI Costs" value={formatCurrency(MOCK_METRICS.aiCosts)} change={-5} trend="down" icon={<Zap className="h-5 w-5" />} />
        <MetricCard label="Failure Rate" value={formatPercent(MOCK_METRICS.failureRate)} change={-1.2} trend="down" icon={<AlertTriangle className="h-5 w-5" />} />
      </div>
    </PageContainer>
  );
}
