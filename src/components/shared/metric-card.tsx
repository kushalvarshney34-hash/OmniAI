"use client";

import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { cn, formatNumber, formatPercent } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: number;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
  className?: string;
}

export function MetricCard({
  label,
  value,
  change,
  trend = "neutral",
  icon,
  className,
}: MetricCardProps) {
  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      <Card className={cn("glass p-6 transition-shadow hover:shadow-glow", className)}>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted">{label}</p>
            <p className="text-2xl font-bold tracking-tight">
              {typeof value === "number" ? formatNumber(value) : value}
            </p>
            {change !== undefined && (
              <div
                className={cn(
                  "flex items-center gap-1 text-xs font-medium",
                  trend === "up" && "text-success",
                  trend === "down" && "text-danger",
                  trend === "neutral" && "text-muted"
                )}
              >
                <TrendIcon className="h-3 w-3" />
                <span>{formatPercent(Math.abs(change))}</span>
                <span className="text-muted">vs last period</span>
              </div>
            )}
          </div>
          {icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {icon}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
