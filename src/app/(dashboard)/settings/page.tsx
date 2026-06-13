"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PageContainer, PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Save, Key, Plug, Bell, User, Building2 } from "lucide-react";

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: "Kush Admin",
    email: "admin@omniagent.io",
    workspace: "OmniAgent Workspace",
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    budgetWarnings: true,
    executionFailures: true,
    teamActivity: false,
    weeklyReports: true,
  });

  const [apiKeys] = useState([
    { id: "1", name: "OpenAI Production", provider: "OpenAI", masked: "sk-...x7Kp" },
    { id: "2", name: "Claude API", provider: "Anthropic", masked: "sk-ant-...9mNq" },
  ]);

  const handleSaveProfile = () => {
    toast.success("Profile updated");
  };

  return (
    <PageContainer>
      <PageHeader title="Settings" description="Manage your account and workspace preferences" />

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="workspace" className="gap-2">
            <Building2 className="h-4 w-4" /> Workspace
          </TabsTrigger>
          <TabsTrigger value="api-keys" className="gap-2">
            <Key className="h-4 w-4" /> API Keys
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2">
            <Plug className="h-4 w-4" /> Integrations
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" /> Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="glass max-w-2xl">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/20 text-primary text-lg">KA</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm">Change Avatar</Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={handleSaveProfile}>
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workspace">
          <Card className="glass max-w-2xl">
            <CardHeader>
              <CardTitle>Workspace</CardTitle>
              <CardDescription>Manage your workspace settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="workspace">Workspace Name</Label>
                <Input
                  id="workspace"
                  value={profile.workspace}
                  onChange={(e) => setProfile({ ...profile, workspace: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Workspace URL</Label>
                <Input id="slug" value="omniagent" disabled className="opacity-60" />
              </div>
              <Button onClick={handleSaveProfile}>
                <Save className="h-4 w-4" />
                Save Workspace
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api-keys">
          <Card className="glass max-w-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>Manage your AI provider API keys</CardDescription>
              </div>
              <Button size="sm">Add Key</Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {apiKeys.map((key) => (
                <div
                  key={key.id}
                  className="flex items-center justify-between rounded-lg border border-border/50 p-4"
                >
                  <div>
                    <p className="text-sm font-medium">{key.name}</p>
                    <p className="font-mono text-xs text-muted">{key.masked}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{key.provider}</Badge>
                    <Button variant="ghost" size="sm" className="text-danger">
                      Revoke
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card className="glass max-w-2xl">
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>Connect third-party services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Slack", description: "Send notifications to Slack channels", connected: true },
                { name: "Gmail", description: "Email automation and notifications", connected: true },
                { name: "GitHub", description: "Sync workflows with repositories", connected: false },
                { name: "Stripe", description: "Billing and payment processing", connected: false },
              ].map((integration) => (
                <div
                  key={integration.name}
                  className="flex items-center justify-between rounded-lg border border-border/50 p-4"
                >
                  <div>
                    <p className="text-sm font-medium">{integration.name}</p>
                    <p className="text-xs text-muted">{integration.description}</p>
                  </div>
                  <Button variant={integration.connected ? "outline" : "default"} size="sm">
                    {integration.connected ? "Connected" : "Connect"}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="glass max-w-2xl">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Configure how you receive alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { key: "emailAlerts" as const, label: "Email Alerts", desc: "Receive alerts via email" },
                { key: "budgetWarnings" as const, label: "Budget Warnings", desc: "Alert when approaching budget limits" },
                { key: "executionFailures" as const, label: "Execution Failures", desc: "Notify on workflow failures" },
                { key: "teamActivity" as const, label: "Team Activity", desc: "Updates on team member actions" },
                { key: "weeklyReports" as const, label: "Weekly Reports", desc: "Weekly usage and cost summaries" },
              ].map((item, i) => (
                <div key={item.key}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted">{item.desc}</p>
                    </div>
                    <Switch
                      checked={notifications[item.key]}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, [item.key]: checked })
                      }
                    />
                  </div>
                  {i < 4 && <Separator className="mt-4" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
