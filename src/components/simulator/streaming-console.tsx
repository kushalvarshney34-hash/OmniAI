"use client";

import { memo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useSimulatorStore } from "@/stores/simulator-store";
import { formatNumber, formatCurrency } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

function StreamingConsoleComponent() {
  const { streamTokens, isStreaming, inputTokens, outputTokens, totalCost, latency } =
    useSimulatorStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [streamTokens]);

  const fullText = streamTokens.map((t) => t.content).join("");

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold">Live Token Stream</h3>
        <div className="flex items-center gap-4 text-xs text-muted">
          <span>
            In: <span className="font-mono text-foreground">{formatNumber(inputTokens)}</span>
          </span>
          <span>
            Out: <span className="font-mono text-foreground">{formatNumber(outputTokens)}</span>
          </span>
          <span>
            Cost: <span className="font-mono text-primary">{formatCurrency(totalCost)}</span>
          </span>
          <span>
            Latency: <span className="font-mono text-foreground">{latency}ms</span>
          </span>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="font-mono text-sm leading-relaxed">
          {fullText ? (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={isStreaming ? "streaming-cursor" : ""}
            >
              {fullText}
            </motion.span>
          ) : (
            <span className="text-muted">Waiting for execution...</span>
          )}
        </div>
      </ScrollArea>

      <div className="border-t border-border px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-accent">
            <motion.div
              className="h-full bg-gradient-primary"
              animate={{ width: `${Math.min(100, (outputTokens / 500) * 100)}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className="text-xs text-muted">{formatNumber(inputTokens + outputTokens)} tokens</span>
        </div>
      </div>
    </div>
  );
}

export const StreamingConsole = memo(StreamingConsoleComponent);
