"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSimulatorStore } from "@/stores/simulator-store";
import { cn } from "@/lib/utils";

const statusIcons = {
  pending: Clock,
  running: Loader2,
  success: CheckCircle,
  error: XCircle,
};

const statusColors = {
  pending: "text-muted",
  running: "text-primary animate-spin",
  success: "text-success",
  error: "text-danger",
};

function ExecutionLogsComponent() {
  const { logs } = useSimulatorStore();

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold">Execution Logs</h3>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-3">
          {logs.length === 0 ? (
            <p className="py-8 text-center text-xs text-muted">No logs yet. Run a workflow to see logs.</p>
          ) : (
            logs.map((log, index) => {
              const Icon = statusIcons[log.status];
              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-2 rounded-lg px-2 py-1.5 hover:bg-accent/50"
                >
                  <Icon className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", statusColors[log.status])} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs">{log.message}</p>
                    {log.duration && (
                      <p className="text-[10px] text-muted">{log.duration}ms</p>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

export const ExecutionLogs = memo(ExecutionLogsComponent);
