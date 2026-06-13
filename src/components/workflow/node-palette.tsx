"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getLucideIcon } from "@/lib/icons";
import { NODE_CATEGORIES, NODE_REGISTRY, getNodesByCategory } from "@/features/workflow/nodes/node-registry";
import type { NodeType } from "@/types";

function NodePaletteComponent() {
  const onDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-card/50 backdrop-blur-xl">
      <div className="border-b border-border p-4">
        <h3 className="text-sm font-semibold">Node Library</h3>
        <p className="text-xs text-muted">Drag nodes to canvas</p>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-4 p-3">
          {NODE_CATEGORIES.map((category) => {
            const nodes = getNodesByCategory(category.id);
            return (
              <div key={category.id}>
                <div className="mb-2 flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-xs font-medium text-muted">{category.label}</span>
                </div>
                <div className="space-y-1">
                  {nodes.map((nodeType) => {
                    const config = NODE_REGISTRY[nodeType];
                    const IconComponent = getLucideIcon(config.icon);

                    return (
                      <motion.div
                        key={nodeType}
                        draggable
                        onDragStart={(e) => onDragStart(e as unknown as React.DragEvent, nodeType)}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex cursor-grab items-center gap-2 rounded-lg border border-border/50 bg-background/50 px-3 py-2 transition-colors hover:border-primary/50 hover:bg-primary/5 active:cursor-grabbing"
                      >
                        <div
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
                          style={{ backgroundColor: `${config.color}20` }}
                        >
                          <IconComponent className="h-3.5 w-3.5" style={{ color: config.color }} />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-medium">{config.label}</p>
                          <p className="truncate text-[10px] text-muted">{config.description}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

export const NodePalette = memo(NodePaletteComponent);
