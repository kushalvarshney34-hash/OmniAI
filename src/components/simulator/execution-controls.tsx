"use client";

import { memo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  SkipForward,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useSimulatorStore } from "@/stores/simulator-store";
import { useWorkflowStore } from "@/stores/workflow-store";
import { TOKEN_COSTS } from "@/lib/constants";
import type { NodeType } from "@/types";

const SAMPLE_RESPONSES: Partial<Record<NodeType, string[]>> = {
  openai: [
    "Analyzing the input data... ",
    "Based on the context provided, I can determine that ",
    "the optimal approach would be to process the request ",
    "through the validation pipeline first, then route to ",
    "the appropriate handler based on the classification results.",
  ],
  claude: [
    "I'll help you process this request. ",
    "Let me break down the task into manageable steps... ",
    "First, I'll validate the input parameters, ",
    "then execute the core logic with appropriate safeguards.",
  ],
  gemini: [
    "Processing your request with Gemini... ",
    "The analysis indicates multiple viable paths. ",
    "Recommending the most efficient route based on current load.",
  ],
};

function ExecutionControlsComponent() {
  const {
    status,
    progress,
    timelinePosition,
    start,
    pause,
    resume,
    stop,
    reset,
    setTimelinePosition,
    setCurrentNodeIndex,
    addLog,
    addStreamToken,
    updateMetrics,
    setProgress,
    complete,
    executionOrder,
    currentNodeIndex,
  } = useSimulatorStore();

  const { nodes, setNodeExecutionState, resetExecutionStates } = useWorkflowStore();

  const runExecution = useCallback(async () => {
    const executionNodes = nodes.length > 0 ? nodes.map((n) => n.id) : [];
    if (executionNodes.length === 0) return;

    resetExecutionStates();
    start(executionNodes);

    let totalInput = 0;
    let totalOutput = 0;
    let totalCost = 0;

    for (let i = 0; i < executionNodes.length; i++) {
      const nodeId = executionNodes[i];
      const node = nodes.find((n) => n.id === nodeId);
      if (!node) continue;

      setCurrentNodeIndex(i);
      setNodeExecutionState(nodeId, "running");
      setProgress(((i + 0.5) / executionNodes.length) * 100);

      addLog({
        id: crypto.randomUUID(),
        nodeId,
        nodeType: node.data.nodeType,
        status: "running",
        message: `Executing ${node.data.label}...`,
        timestamp: Date.now(),
      });

      await new Promise((r) => setTimeout(r, 800));

      const isAiNode = ["openai", "claude", "gemini", "deepseek"].includes(node.data.nodeType);
      if (isAiNode) {
        const responses = SAMPLE_RESPONSES[node.data.nodeType as NodeType] ?? SAMPLE_RESPONSES.openai!;
        const model = String(node.data.config.model ?? "gpt-4o");
        const costs = TOKEN_COSTS[model] ?? TOKEN_COSTS["gpt-4o"]!;

        for (const chunk of responses) {
          for (const char of chunk.split("")) {
            addStreamToken({
              id: crypto.randomUUID(),
              content: char,
              timestamp: Date.now(),
            });
            await new Promise((r) => setTimeout(r, 15));
          }
        }

        const inputTokens = Math.floor(Math.random() * 500) + 100;
        const outputTokens = Math.floor(Math.random() * 300) + 50;
        totalInput += inputTokens;
        totalOutput += outputTokens;
        totalCost += inputTokens * costs.input + outputTokens * costs.output;
      }

      setNodeExecutionState(nodeId, "success");
      addLog({
        id: crypto.randomUUID(),
        nodeId,
        nodeType: node.data.nodeType,
        status: "success",
        message: `${node.data.label} completed successfully`,
        tokens: isAiNode ? { input: 200, output: 150 } : undefined,
        duration: Math.floor(Math.random() * 500) + 200,
        timestamp: Date.now(),
      });

      setProgress(((i + 1) / executionNodes.length) * 100);
      await new Promise((r) => setTimeout(r, 300));
    }

    updateMetrics({
      inputTokens: totalInput,
      outputTokens: totalOutput,
      totalCost,
      latency: Math.floor(Math.random() * 200) + 100,
    });
    complete();
  }, [
    nodes,
    start,
    resetExecutionStates,
    setCurrentNodeIndex,
    setNodeExecutionState,
    setProgress,
    addLog,
    addStreamToken,
    updateMetrics,
    complete,
  ]);

  const handleStop = () => {
    stop();
    resetExecutionStates();
  };

  const handleReset = () => {
    reset();
    resetExecutionStates();
  };

  const handleTimelineChange = (value: number[]) => {
    const pos = value[0] ?? 0;
    setTimelinePosition(pos);
    const index = Math.floor((pos / 100) * executionOrder.length);
    setCurrentNodeIndex(Math.min(index, executionOrder.length - 1));
  };

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge
            variant={
              status === "running"
                ? "default"
                : status === "completed"
                  ? "success"
                  : status === "failed"
                    ? "danger"
                    : "outline"
            }
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
          {status === "running" && (
            <span className="text-xs text-muted">
              Node {currentNodeIndex + 1} of {executionOrder.length}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {status === "idle" || status === "completed" || status === "stopped" ? (
            <Button size="sm" onClick={runExecution}>
              <Play className="h-4 w-4" />
              Run Workflow
            </Button>
          ) : status === "running" ? (
            <Button size="sm" variant="outline" onClick={pause}>
              <Pause className="h-4 w-4" />
              Pause
            </Button>
          ) : status === "paused" ? (
            <Button size="sm" onClick={resume}>
              <Play className="h-4 w-4" />
              Resume
            </Button>
          ) : null}

          {(status === "running" || status === "paused") && (
            <Button size="sm" variant="destructive" onClick={handleStop}>
              <Square className="h-4 w-4" />
              Stop
            </Button>
          )}

          {(status === "completed" || status === "stopped" || status === "failed") && (
            <>
              <Button size="sm" variant="outline" onClick={runExecution}>
                <SkipForward className="h-4 w-4" />
                Replay
              </Button>
              <Button size="sm" variant="ghost" onClick={handleReset}>
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted">
          <span>Timeline</span>
          <span>{timelinePosition}%</span>
        </div>
        <Slider
          value={[timelinePosition]}
          onValueChange={handleTimelineChange}
          max={100}
          step={1}
          disabled={status === "idle"}
        />
      </div>
    </div>
  );
}

export const ExecutionControls = memo(ExecutionControlsComponent);
