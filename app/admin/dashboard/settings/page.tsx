"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Bell, Mail, Shield, Palette, Save, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    darkMode: false,
    twoFactorAuth: true,
    systemEmail: "admin@certportal.com",
    maxUploadSize: "10",
  });

  const handleSave = async () => {
    setSaving(true);
    // Simulate saving delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast({
      title: "Success!",
      description: "Settings saved successfully.",
    });
    setSaving(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your system preferences and configurations
        </p>
      </div>

      <div className="grid gap-6">
        {/* Notifications */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Bell className="h-5 w-5" />
            Notifications
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email notifications for important updates
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, emailNotifications: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive push notifications in your browser
                </p>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, pushNotifications: checked })
                }
              />
            </div>
          </div>
        </Card>

        {/* Email Settings */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Mail className="h-5 w-5" />
            Email Settings
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="systemEmail">System Email</Label>
              <Input
                id="systemEmail"
                type="email"
                value={settings.systemEmail}
                onChange={(e) =>
                  setSettings({ ...settings, systemEmail: e.target.value })
                }
              />
              <p className="text-sm text-muted-foreground">
                Email address used for sending system notifications
              </p>
            </div>
          </div>
        </Card>

        {/* Security */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5" />
            Security
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Switch
                checked={settings.twoFactorAuth}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, twoFactorAuth: checked })
                }
              />
            </div>
          </div>
        </Card>

        {/* System */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Palette className="h-5 w-5" />
            System
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="maxUploadSize">Maximum Upload Size (MB)</Label>
              <Input
                id="maxUploadSize"
                type="number"
                value={settings.maxUploadSize}
                onChange={(e) =>
                  setSettings({ ...settings, maxUploadSize: e.target.value })
                }
              />
              <p className="text-sm text-muted-foreground">
                Maximum file size allowed for certificate uploads
              </p>
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
