"use client";

import { memo, useMemo } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CHART_COLORS } from "@/lib/constants";
import { formatCurrency, formatNumber } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

function ChartCard({ title, children, className }: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className={`glass ${className ?? ""}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </motion.div>
  );
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-card">
      <p className="mb-1 text-xs text-muted">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-medium" style={{ color: entry.color }}>
          {entry.name}: {typeof entry.value === "number" && entry.name.toLowerCase().includes("cost")
            ? formatCurrency(entry.value)
            : formatNumber(entry.value)}
        </p>
      ))}
    </div>
  );
};

interface LineChartWidgetProps {
  title: string;
  data: Array<Record<string, string | number>>;
  dataKey: string;
  xKey?: string;
}

export const LineChartWidget = memo(function LineChartWidget({
  title,
  data,
  dataKey,
  xKey = "date",
}: LineChartWidgetProps) {
  return (
    <ChartCard title={title}>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
          <XAxis dataKey={xKey} stroke="#A1A1AA" fontSize={12} />
          <YAxis stroke="#A1A1AA" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke="#7C3AED"
            strokeWidth={2}
            dot={{ fill: "#7C3AED", r: 3 }}
            activeDot={{ r: 5, fill: "#8B5CF6" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
});

interface AreaChartWidgetProps {
  title: string;
  data: Array<Record<string, string | number>>;
  dataKeys: string[];
  xKey?: string;
}

export const AreaChartWidget = memo(function AreaChartWidget({
  title,
  data,
  dataKeys,
  xKey = "date",
}: AreaChartWidgetProps) {
  return (
    <ChartCard title={title}>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
          <XAxis dataKey={xKey} stroke="#A1A1AA" fontSize={12} />
          <YAxis stroke="#A1A1AA" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {dataKeys.map((key, i) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stackId="1"
              stroke={CHART_COLORS[i]}
              fill={CHART_COLORS[i]}
              fillOpacity={0.3}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
});

interface BarChartWidgetProps {
  title: string;
  data: Array<Record<string, string | number>>;
  dataKey: string;
  xKey?: string;
}

export const BarChartWidget = memo(function BarChartWidget({
  title,
  data,
  dataKey,
  xKey = "name",
}: BarChartWidgetProps) {
  return (
    <ChartCard title={title}>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
          <XAxis dataKey={xKey} stroke="#A1A1AA" fontSize={12} />
          <YAxis stroke="#A1A1AA" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey={dataKey} fill="#7C3AED" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
});

interface PieChartWidgetProps {
  title: string;
  data: Array<{ name: string; value: number }>;
}

export const PieChartWidget = memo(function PieChartWidget({ title, data }: PieChartWidgetProps) {
  return (
    <ChartCard title={title}>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
});

interface HeatmapWidgetProps {
  title: string;
  data: number[][];
}

export const HeatmapWidget = memo(function HeatmapWidget({ title, data }: HeatmapWidgetProps) {
  const maxValue = useMemo(() => Math.max(...data.flat()), [data]);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <ChartCard title={title}>
      <div className="overflow-x-auto">
        <div className="inline-grid gap-0.5" style={{ gridTemplateColumns: `40px repeat(24, 1fr)` }}>
          <div />
          {hours.map((h) => (
            <div key={h} className="text-center text-[9px] text-muted">
              {h}
            </div>
          ))}
          {days.map((day, dayIndex) => (
            <>
              <div key={`label-${day}`} className="flex items-center text-[10px] text-muted">
                {day}
              </div>
              {hours.map((hour) => {
                const value = data[dayIndex]?.[hour] ?? 0;
                const intensity = maxValue > 0 ? value / maxValue : 0;
                return (
                  <motion.div
                    key={`${day}-${hour}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: (dayIndex * 24 + hour) * 0.002 }}
                    className="h-4 w-4 rounded-sm"
                    style={{
                      backgroundColor: `rgba(124, 58, 237, ${0.1 + intensity * 0.9})`,
                    }}
                    title={`${day} ${hour}:00 - ${value} executions`}
                  />
                );
              })}
            </>
          ))}
        </div>
      </div>
    </ChartCard>
  );
});
