import type { NodeCategory, NodeType } from "@/types";

const CONNECTION_RULES: Record<NodeCategory, NodeCategory[]> = {
  ai: ["logic", "data", "communication", "storage", "utility"],
  logic: ["ai", "data", "communication", "storage", "utility"],
  data: ["logic", "communication", "storage", "utility"],
  communication: ["logic", "data", "storage", "utility"],
  storage: ["logic", "data", "communication", "utility"],
  utility: ["ai", "logic", "data", "communication", "storage"],
};

const FORBIDDEN_CONNECTIONS: [NodeType, NodeType][] = [
  ["postgresql", "gmail"],
  ["mongodb", "slack"],
  ["redis", "whatsapp"],
];

export interface ValidationResult {
  valid: boolean;
  message: string;
}

export function validateConnection(
  sourceType: NodeType,
  sourceCategory: NodeCategory,
  targetType: NodeType,
  targetCategory: NodeCategory
): ValidationResult {
  if (sourceType === targetType) {
    return { valid: false, message: "Cannot connect a node to itself" };
  }

  const isForbidden = FORBIDDEN_CONNECTIONS.some(
    ([src, tgt]) =>
      (src === sourceType && tgt === targetType) ||
      (src === targetType && tgt === sourceType)
  );

  if (isForbidden) {
    return {
      valid: false,
      message: `Database nodes cannot connect directly to ${targetCategory} nodes`,
    };
  }

  const allowedTargets = CONNECTION_RULES[sourceCategory];
  if (!allowedTargets.includes(targetCategory)) {
    return {
      valid: false,
      message: `${sourceCategory} nodes cannot connect to ${targetCategory} nodes`,
    };
  }

  return { valid: true, message: "Valid connection" };
}

export function validateNodeConfig(
  nodeType: NodeType,
  config: Record<string, unknown>
): ValidationResult {
  switch (nodeType) {
    case "openai":
    case "claude":
    case "gemini":
    case "deepseek":
      if (!config.prompt || String(config.prompt).trim() === "") {
        return { valid: false, message: "Prompt is required" };
      }
      break;
    case "ifElse":
      if (!config.condition || String(config.condition).trim() === "") {
        return { valid: false, message: "Condition is required" };
      }
      break;
    case "postgresql":
      if (!config.query || String(config.query).trim() === "") {
        return { valid: false, message: "SQL query is required" };
      }
      break;
    case "gmail":
      if (!config.to || !config.subject) {
        return { valid: false, message: "Recipient and subject are required" };
      }
      break;
    default:
      break;
  }
  return { valid: true, message: "Configuration valid" };
}
