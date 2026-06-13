export const APP_NAME = "OmniAgent OS";
export const APP_DESCRIPTION = "Visual AI Agent Builder & Operating System";

export const SIDEBAR_WIDTH = 260;
export const SIDEBAR_COLLAPSED_WIDTH = 72;

export const TOKEN_COSTS: Record<string, { input: number; output: number }> = {
  "gpt-4o": { input: 0.000005, output: 0.000015 },
  "gpt-4o-mini": { input: 0.00000015, output: 0.0000006 },
  "claude-3-5-sonnet": { input: 0.000003, output: 0.000015 },
  "claude-3-haiku": { input: 0.00000025, output: 0.00000125 },
  "gemini-pro": { input: 0.0000005, output: 0.0000015 },
  "deepseek-chat": { input: 0.00000014, output: 0.00000028 },
};

export const PROVIDER_COLORS: Record<string, string> = {
  openai: "#10A37F",
  claude: "#D97706",
  gemini: "#4285F4",
  deepseek: "#6366F1",
  postgresql: "#336791",
  mongodb: "#47A248",
  redis: "#DC382D",
  gmail: "#EA4335",
  slack: "#4A154B",
  whatsapp: "#25D366",
  discord: "#5865F2",
  s3: "#FF9900",
};

export const CHART_COLORS = [
  "#7C3AED",
  "#8B5CF6",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
  "#06B6D4",
  "#EC4899",
  "#6366F1",
];

export const KEYBOARD_SHORTCUTS = {
  undo: { key: "z", ctrl: true, shift: false },
  redo: { key: "z", ctrl: true, shift: true },
  copy: { key: "c", ctrl: true, shift: false },
  paste: { key: "v", ctrl: true, shift: false },
  delete: { key: "Backspace", ctrl: false, shift: false },
  selectAll: { key: "a", ctrl: true, shift: false },
  save: { key: "s", ctrl: true, shift: false },
  commandPalette: { key: "k", ctrl: true, shift: false },
} as const;
