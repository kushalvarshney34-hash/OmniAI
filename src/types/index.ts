import type { Node, Edge, Viewport } from "@xyflow/react";

export type NodeCategory =
  | "ai"
  | "logic"
  | "data"
  | "communication"
  | "storage"
  | "utility";

export type NodeType =
  | "openai"
  | "claude"
  | "gemini"
  | "deepseek"
  | "ifElse"
  | "switch"
  | "loop"
  | "merge"
  | "postgresql"
  | "mongodb"
  | "redis"
  | "vectorDb"
  | "gmail"
  | "slack"
  | "whatsapp"
  | "discord"
  | "s3"
  | "googleDrive"
  | "dropbox"
  | "delay"
  | "formatter"
  | "parser";

export interface NodeConfig {
  label: string;
  description: string;
  category: NodeCategory;
  icon: string;
  color: string;
  inputs: number;
  outputs: number;
  defaultData: Record<string, unknown>;
}

export interface WorkflowNodeData extends Record<string, unknown> {
  label: string;
  description: string;
  nodeType: NodeType;
  category: NodeCategory;
  config: Record<string, unknown>;
  validationState?: "valid" | "invalid" | "warning";
  validationMessage?: string;
  executionState?: "idle" | "running" | "success" | "error" | "paused";
}

export type WorkflowNode = Node<WorkflowNodeData>;
export type WorkflowEdge = Edge;

export interface WorkflowState {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  viewport: Viewport;
}

export interface HistorySnapshot {
  id: string;
  timestamp: number;
  label: string;
  state: WorkflowState;
}

export interface ExecutionLog {
  id: string;
  nodeId: string;
  nodeType: NodeType;
  status: "pending" | "running" | "success" | "error";
  message: string;
  tokens?: { input: number; output: number };
  cost?: number;
  duration?: number;
  timestamp: number;
}

export interface StreamToken {
  id: string;
  content: string;
  timestamp: number;
}

export interface AnalyticsMetric {
  label: string;
  value: number | string;
  change: number;
  trend: "up" | "down" | "neutral";
}

export interface CostAlert {
  id: string;
  type: "budget" | "spike" | "anomaly";
  title: string;
  message: string;
  severity: "info" | "warning" | "critical";
  timestamp: Date;
}

export interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  rating: number;
  downloads: number;
  featured: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "ADMIN" | "EDITOR" | "VIEWER";
  online: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error" | "budget" | "spike" | "anomaly";
  read: boolean;
  createdAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  mentions: string[];
  createdAt: Date;
}

export interface ActivityItem {
  id: string;
  action: string;
  entity: string;
  userName: string;
  userAvatar?: string;
  timestamp: Date;
}

export type TimeRange = "daily" | "weekly" | "monthly" | "yearly";
