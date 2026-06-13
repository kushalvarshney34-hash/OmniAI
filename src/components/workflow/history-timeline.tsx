"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Undo2, Redo2, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { historyManager } from "@/features/workflow/history/history-manager";
import { useWorkflowStore } from "@/stores/workflow-store";
import { cn } from "@/lib/utils";

function HistoryTimelineComponent() {
  const { undo, redo, canUndo, canRedo, loadState } = useWorkflowStore();
  const snapshots = historyManager.getSnapshots().slice().reverse();

  const restoreSnapshot = (snapshotId: string) => {
    const state = historyManager.restoreSnapshot(snapshotId);
    if (state) loadState(state);
  };

  return (
    <div className="flex h-12 items-center gap-2 border-b border-border bg-card/30 px-4 backdrop-blur-xl">
      <Button
        variant="ghost"
        size="icon"
        onClick={undo}
        disabled={!canUndo()}
        aria-label="Undo"
      >
        <Undo2 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={redo}
        disabled={!canRedo()}
        aria-label="Redo"
      >
        <Redo2 className="h-4 w-4" />
      </Button>

      <div className="mx-2 h-4 w-px bg-border" />

      <ScrollArea className="flex-1">
        <div className="flex items-center gap-2 py-1">
          {snapshots.length === 0 ? (
            <span className="text-xs text-muted">No history yet</span>
          ) : (
            snapshots.slice(0, 10).map((snapshot, index) => (
              <motion.button
                key={snapshot.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => restoreSnapshot(snapshot.id)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-md border border-border/50 bg-background/50 px-2 py-1 text-xs transition-colors hover:border-primary/50 hover:bg-primary/5",
                  index === 0 && "border-primary/30 bg-primary/5"
                )}
              >
                <Clock className="h-3 w-3 text-muted" />
                <span>{snapshot.label}</span>
                <span className="text-muted/70">
                  {formatDistanceToNow(snapshot.timestamp, { addSuffix: true })}
                </span>
              </motion.button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

export const HistoryTimeline = memo(HistoryTimelineComponent);
