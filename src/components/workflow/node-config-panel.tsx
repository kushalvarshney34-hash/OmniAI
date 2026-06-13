"use client";

import { memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWorkflowStore } from "@/stores/workflow-store";
import { NODE_REGISTRY } from "@/features/workflow/nodes/node-registry";
import { validateNodeConfig } from "@/features/workflow/validation/connection-rules";

function NodeConfigPanelComponent() {
  const { nodes, selectedNodeId, selectNode, updateNodeConfig } = useWorkflowStore();
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  const handleConfigChange = useCallback(
    (key: string, value: unknown) => {
      if (!selectedNodeId) return;
      updateNodeConfig(selectedNodeId, { [key]: value });
    },
    [selectedNodeId, updateNodeConfig]
  );

  if (!selectedNode) {
    return (
      <div className="flex h-full w-80 flex-col items-center justify-center border-l border-border bg-card/50 p-6 text-center backdrop-blur-xl">
        <p className="text-sm text-muted">Select a node to configure</p>
      </div>
    );
  }

  const config = NODE_REGISTRY[selectedNode.data.nodeType];
  const nodeConfig = selectedNode.data.config;
  const validation = validateNodeConfig(selectedNode.data.nodeType, nodeConfig);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={selectedNode.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="flex h-full w-80 flex-col border-l border-border bg-card/50 backdrop-blur-xl"
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <div>
            <h3 className="text-sm font-semibold">{selectedNode.data.label}</h3>
            <p className="text-xs text-muted">{config.description}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => selectNode(null)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {!validation.valid && (
              <div className="rounded-lg border border-danger/30 bg-danger/10 p-3">
                <p className="text-xs text-danger">{validation.message}</p>
              </div>
            )}

            {(selectedNode.data.nodeType === "openai" ||
              selectedNode.data.nodeType === "claude" ||
              selectedNode.data.nodeType === "gemini" ||
              selectedNode.data.nodeType === "deepseek") && (
              <>
                <div className="space-y-2">
                  <Label>Model</Label>
                  <Select
                    value={String(nodeConfig.model ?? "")}
                    onValueChange={(v) => handleConfigChange("model", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedNode.data.nodeType === "openai" && (
                        <>
                          <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                          <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                        </>
                      )}
                      {selectedNode.data.nodeType === "claude" && (
                        <>
                          <SelectItem value="claude-3-5-sonnet">Claude 3.5 Sonnet</SelectItem>
                          <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
                        </>
                      )}
                      {selectedNode.data.nodeType === "gemini" && (
                        <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                      )}
                      {selectedNode.data.nodeType === "deepseek" && (
                        <SelectItem value="deepseek-chat">DeepSeek Chat</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Prompt</Label>
                  <Textarea
                    value={String(nodeConfig.prompt ?? "")}
                    onChange={(e) => handleConfigChange("prompt", e.target.value)}
                    placeholder="Enter your prompt..."
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Temperature: {Number(nodeConfig.temperature ?? 0.7)}</Label>
                  <Slider
                    value={[Number(nodeConfig.temperature ?? 0.7)]}
                    onValueChange={([v]) => handleConfigChange("temperature", v)}
                    min={0}
                    max={2}
                    step={0.1}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max Tokens</Label>
                  <Input
                    type="number"
                    value={Number(nodeConfig.maxTokens ?? 4096)}
                    onChange={(e) => handleConfigChange("maxTokens", Number(e.target.value))}
                  />
                </div>
              </>
            )}

            {selectedNode.data.nodeType === "ifElse" && (
              <div className="space-y-2">
                <Label>Condition</Label>
                <Input
                  value={String(nodeConfig.condition ?? "")}
                  onChange={(e) => handleConfigChange("condition", e.target.value)}
                  placeholder="e.g. response.status === 'success'"
                />
              </div>
            )}

            {selectedNode.data.nodeType === "postgresql" && (
              <div className="space-y-2">
                <Label>SQL Query</Label>
                <Textarea
                  value={String(nodeConfig.query ?? "")}
                  onChange={(e) => handleConfigChange("query", e.target.value)}
                  placeholder="SELECT * FROM users"
                  rows={4}
                  className="font-mono text-xs"
                />
              </div>
            )}

            {selectedNode.data.nodeType === "delay" && (
              <div className="space-y-2">
                <Label>Duration (ms)</Label>
                <Input
                  type="number"
                  value={Number(nodeConfig.duration ?? 1000)}
                  onChange={(e) => handleConfigChange("duration", Number(e.target.value))}
                />
              </div>
            )}

            {selectedNode.data.nodeType === "gmail" && (
              <>
                <div className="space-y-2">
                  <Label>To</Label>
                  <Input
                    value={String(nodeConfig.to ?? "")}
                    onChange={(e) => handleConfigChange("to", e.target.value)}
                    placeholder="recipient@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input
                    value={String(nodeConfig.subject ?? "")}
                    onChange={(e) => handleConfigChange("subject", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Body</Label>
                  <Textarea
                    value={String(nodeConfig.body ?? "")}
                    onChange={(e) => handleConfigChange("body", e.target.value)}
                    rows={4}
                  />
                </div>
              </>
            )}

            {selectedNode.data.nodeType === "slack" && (
              <>
                <div className="space-y-2">
                  <Label>Channel</Label>
                  <Input
                    value={String(nodeConfig.channel ?? "")}
                    onChange={(e) => handleConfigChange("channel", e.target.value)}
                    placeholder="#general"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Message</Label>
                  <Textarea
                    value={String(nodeConfig.message ?? "")}
                    onChange={(e) => handleConfigChange("message", e.target.value)}
                    rows={3}
                  />
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </motion.div>
    </AnimatePresence>
  );
}

export const NodeConfigPanel = memo(NodeConfigPanelComponent);
