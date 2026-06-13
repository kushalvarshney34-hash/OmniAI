"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageContainer, PageHeader } from "@/components/shared/page-header";
import { TemplateCard } from "@/components/marketplace/template-card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOCK_MARKETPLACE } from "@/lib/mock-data";
import { Search } from "lucide-react";
import { useState, useMemo } from "react";

export default function MarketplacePage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = useMemo(() => {
    return MOCK_MARKETPLACE.filter((t) => {
      const matchesSearch =
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "all" || t.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  const handleInstall = (id: string) => {
    const template = MOCK_MARKETPLACE.find((t) => t.id === id);
    toast.success("Template installed", {
      description: `${template?.name} has been added to your workflows.`,
    });
    router.push("/workflows/new");
  };

  return (
    <PageContainer>
      <PageHeader
        title="Marketplace"
        description="Pre-built agent templates to accelerate your workflow"
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Tabs value={category} onValueChange={setCategory}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="Support">Support</TabsTrigger>
            <TabsTrigger value="Sales">Sales</TabsTrigger>
            <TabsTrigger value="Marketing">Marketing</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((template, index) => (
          <TemplateCard
            key={template.id}
            template={template}
            onInstall={handleInstall}
            index={index}
          />
        ))}
      </div>
    </PageContainer>
  );
}
