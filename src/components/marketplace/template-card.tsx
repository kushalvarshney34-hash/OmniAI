"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Star, Download, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import type { MarketplaceItem } from "@/types";

interface TemplateCardProps {
  template: MarketplaceItem;
  onInstall: (id: string) => void;
  index?: number;
}

function TemplateCardComponent({ template, onInstall, index = 0 }: TemplateCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card className="group overflow-hidden glass transition-shadow hover:shadow-glow">
        <div className="relative h-32 bg-gradient-card p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-2xl">
            {template.icon}
          </div>
          {template.featured && (
            <Badge className="absolute right-3 top-3" variant="secondary">
              Featured
            </Badge>
          )}
        </div>
        <div className="space-y-3 p-4">
          <div>
            <h3 className="font-semibold">{template.name}</h3>
            <p className="mt-1 line-clamp-2 text-xs text-muted">{template.description}</p>
          </div>
          <div className="flex items-center justify-between text-xs text-muted">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-warning text-warning" />
              <span>{template.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              <span>{formatNumber(template.downloads)}</span>
            </div>
          </div>
          <Button
            className="w-full group-hover:shadow-glow"
            size="sm"
            onClick={() => onInstall(template.id)}
          >
            Install Template
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

export const TemplateCard = memo(TemplateCardComponent);
