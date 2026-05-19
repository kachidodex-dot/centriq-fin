import { useState } from "react";
import { Save, AlertCircle } from "lucide-react";
import { AdminLayout } from "@/admin/components/admin-layout";
import { DashboardSection } from "@/admin/components/dashboard-sections";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AdminSettingsPage() {
  const [platformName, setPlatformName] = useState("Zentriq");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [currency, setCurrency] = useState("USD");
  const [theme, setTheme] = useState("light");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AdminLayout
      title="Settings"
      subtitle="Configure platform settings and preferences"
    >
      {/* Save Success Alert */}
      {saved && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 flex items-center gap-3">
          <div className="h-4 w-4 rounded-full bg-green-600" />
          <p className="text-sm font-medium text-green-900">
            Settings saved successfully
          </p>
        </div>
      )}

      {/* General Settings */}
      <DashboardSection title="General Settings">
        <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6">
          {/* Platform Name */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Platform Name
            </label>
            <Input
              value={platformName}
              onChange={(e) => setPlatformName(e.target.value)}
              className="max-w-md"
            />
            <p className="mt-1 text-xs text-gray-500">
              Used in emails and notifications
            </p>
          </div>

          {/* Default Currency */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Default Currency
            </label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
                <SelectItem value="JPY">JPY (¥)</SelectItem>
                <SelectItem value="CAD">CAD (C$)</SelectItem>
              </SelectContent>
            </Select>
            <p className="mt-1 text-xs text-gray-500">
              Default currency for all transactions
            </p>
          </div>
        </div>
      </DashboardSection>

      {/* Feature Toggles */}
      <DashboardSection title="Feature Toggles">
        <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
          {/* Maintenance Mode */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 last:border-0">
            <div>
              <p className="font-medium text-gray-900">Maintenance Mode</p>
              <p className="text-sm text-gray-600">
                Temporarily disable access to the platform
              </p>
            </div>
            <button
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                maintenanceMode ? "bg-red-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  maintenanceMode ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* AI Features */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 last:border-0">
            <div>
              <p className="font-medium text-gray-900">AI Features</p>
              <p className="text-sm text-gray-600">
                Enable/disable AI-powered features
              </p>
            </div>
            <button
              onClick={() => setAiEnabled(!aiEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                aiEnabled ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  aiEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Maintenance Mode Alert */}
        {maintenanceMode && (
          <div className="mt-4 rounded-lg border border-orange-200 bg-orange-50 p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-orange-900">Maintenance Mode Active</p>
              <p className="text-sm text-orange-800 mt-1">
                Users will see a maintenance page and cannot access their accounts.
              </p>
            </div>
          </div>
        )}
      </DashboardSection>

      {/* Theme Settings */}
      <DashboardSection title="Theme & Appearance">
        <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Color Theme
            </label>
            <div className="flex gap-4">
              {["light", "dark", "auto"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    theme === t
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="capitalize text-sm font-medium">{t}</span>
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Currently set to: {theme} mode
            </p>
          </div>
        </div>
      </DashboardSection>

      {/* Notification Settings */}
      <DashboardSection title="Notifications">
        <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
          {[
            {
              id: "new-signup",
              label: "New User Signups",
              description: "Notify when new users join",
            },
            {
              id: "large-txn",
              label: "Large Transactions",
              description: "Alert on transactions > $10,000",
            },
            {
              id: "system-alerts",
              label: "System Alerts",
              description: "Platform errors and warnings",
            },
          ].map((notification) => (
            <div
              key={notification.id}
              className="flex items-center justify-between p-4 border-b border-gray-200 last:border-0"
            >
              <div>
                <p className="font-medium text-gray-900">{notification.label}</p>
                <p className="text-sm text-gray-600">{notification.description}</p>
              </div>
              <input type="checkbox" defaultChecked className="h-5 w-5" />
            </div>
          ))}
        </div>
      </DashboardSection>

      {/* Security */}
      <DashboardSection title="Security">
        <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Admin Session Timeout
            </label>
            <Select defaultValue="30">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="never">Never</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <p className="font-medium text-gray-900 mb-2">Two-Factor Authentication</p>
            <p className="text-sm text-gray-600 mb-3">
              Require 2FA for all admin accounts
            </p>
            <Button variant="outline" size="sm">
              Configure 2FA
            </Button>
          </div>
        </div>
      </DashboardSection>

      {/* Save Button */}
      <DashboardSection>
        <div className="flex gap-4">
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Settings
          </Button>
          <Button variant="outline">Cancel</Button>
        </div>
      </DashboardSection>
    </AdminLayout>
  );
}
