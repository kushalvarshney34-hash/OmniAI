"use client";

import { memo, useMemo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getLucideIcon } from "@/lib/icons";
import { NODE_REGISTRY } from "@/features/workflow/nodes/node-registry";
import type { WorkflowNodeData } from "@/types";
import { Badge } from "@/components/ui/badge";

function WorkflowNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as WorkflowNodeData;
  const config = NODE_REGISTRY[nodeData.nodeType];
  const IconComponent = getLucideIcon(config.icon);

  const executionClass = useMemo(() => {
    switch (nodeData.executionState) {
      case "running":
        return "node-glow-running";
      case "success":
        return "node-glow-success";
      case "error":
        return "node-glow-error";
      default:
        return "";
    }
  }, [nodeData.executionState]);

  const inputHandles = Array.from({ length: config.inputs }, (_, i) => (
    <Handle
      key={`input-${i}`}
      type="target"
      position={Position.Left}
      id={`input-${i}`}
      style={{ top: `${((i + 1) / (config.inputs + 1)) * 100}%` }}
      className="!h-3 !w-3 !border-2 !border-border !bg-card hover:!border-primary hover:!bg-primary transition-colors"
    />
  ));

  const outputHandles = Array.from({ length: config.outputs }, (_, i) => (
    <Handle
      key={`output-${i}`}
      type="source"
      position={Position.Right}
      id={`output-${i}`}
      style={{ top: `${((i + 1) / (config.outputs + 1)) * 100}%` }}
      className="!h-3 !w-3 !border-2 !border-border !bg-card hover:!border-primary hover:!bg-primary transition-colors"
    />
  ));

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={cn(
        "workflow-node min-w-[200px] rounded-xl border border-border bg-card shadow-card transition-all duration-200",
        selected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
        nodeData.validationState === "invalid" && "border-danger shadow-glow-danger",
        executionClass
      )}
    >
      <div
        className="flex items-center gap-2 rounded-t-xl px-3 py-2"
        style={{ background: `linear-gradient(135deg, ${config.color}20, transparent)` }}
      >
        <div
          className="flex h-7 w-7 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${config.color}30` }}
        >
          <IconComponent className="h-4 w-4" style={{ color: config.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-semibold">{nodeData.label}</p>
          <p className="truncate text-[10px] text-muted">{nodeData.description}</p>
        </div>
        {nodeData.executionState === "running" && (
          <Badge variant="secondary" className="text-[10px] animate-pulse">
            Running
          </Badge>
        )}
      </div>

      {nodeData.validationState === "invalid" && nodeData.validationMessage && (
        <div className="border-t border-danger/30 bg-danger/10 px-3 py-1.5">
          <p className="text-[10px] text-danger">{nodeData.validationMessage}</p>
        </div>
      )}

      {inputHandles}
      {outputHandles}
    </motion.div>
  );
}

export const WorkflowNode = memo(WorkflowNodeComponent);
