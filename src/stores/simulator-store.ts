import { create } from "zustand";
import type { ExecutionLog, StreamToken } from "@/types";

type ExecutionStatus = "idle" | "running" | "paused" | "completed" | "failed" | "stopped";

interface SimulatorStore {
  status: ExecutionStatus;
  currentNodeIndex: number;
  executionOrder: string[];
  logs: ExecutionLog[];
  streamTokens: StreamToken[];
  inputTokens: number;
  outputTokens: number;
  totalCost: number;
  latency: number;
  progress: number;
  timelinePosition: number;
  isStreaming: boolean;

  start: (nodeIds: string[]) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  reset: () => void;
  addLog: (log: ExecutionLog) => void;
  addStreamToken: (token: StreamToken) => void;
  setCurrentNodeIndex: (index: number) => void;
  setTimelinePosition: (position: number) => void;
  setProgress: (progress: number) => void;
  updateMetrics: (metrics: {
    inputTokens?: number;
    outputTokens?: number;
    totalCost?: number;
    latency?: number;
  }) => void;
  complete: () => void;
  fail: (message: string) => void;
}

export const useSimulatorStore = create<SimulatorStore>((set, get) => ({
  status: "idle",
  currentNodeIndex: 0,
  executionOrder: [],
  logs: [],
  streamTokens: [],
  inputTokens: 0,
  outputTokens: 0,
  totalCost: 0,
  latency: 0,
  progress: 0,
  timelinePosition: 0,
  isStreaming: false,

  start: (nodeIds) =>
    set({
      status: "running",
      executionOrder: nodeIds,
      currentNodeIndex: 0,
      logs: [],
      streamTokens: [],
      inputTokens: 0,
      outputTokens: 0,
      totalCost: 0,
      latency: 0,
      progress: 0,
      timelinePosition: 0,
      isStreaming: true,
    }),

  pause: () => set({ status: "paused", isStreaming: false }),

  resume: () => set({ status: "running", isStreaming: true }),

  stop: () => set({ status: "stopped", isStreaming: false }),

  reset: () =>
    set({
      status: "idle",
      currentNodeIndex: 0,
      executionOrder: [],
      logs: [],
      streamTokens: [],
      inputTokens: 0,
      outputTokens: 0,
      totalCost: 0,
      latency: 0,
      progress: 0,
      timelinePosition: 0,
      isStreaming: false,
    }),

  addLog: (log) => set({ logs: [...get().logs, log] }),

  addStreamToken: (token) =>
    set({ streamTokens: [...get().streamTokens, token] }),

  setCurrentNodeIndex: (index) => set({ currentNodeIndex: index }),

  setTimelinePosition: (position) => set({ timelinePosition: position }),

  setProgress: (progress) => set({ progress }),

  updateMetrics: (metrics) => set(metrics),

  complete: () => set({ status: "completed", isStreaming: false, progress: 100 }),

  fail: (message) => {
    get().addLog({
      id: crypto.randomUUID(),
      nodeId: get().executionOrder[get().currentNodeIndex] ?? "",
      nodeType: "openai",
      status: "error",
      message,
      timestamp: Date.now(),
    });
    set({ status: "failed", isStreaming: false });
  },
}));
