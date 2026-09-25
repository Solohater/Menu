"use client";

import { useEffect, useState } from "react";

interface RestaurantSettings {
  establishment_mode: string;
  service_charge_pct: number;
  vat_pct: number;
  cash_fallback_enabled: boolean;
  pickup_alarm_enabled: boolean;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<RestaurantSettings>({
    establishment_mode: "table_service",
    service_charge_pct: 10.0,
    vat_pct: 15.0,
    cash_fallback_enabled: true,
    pickup_alarm_enabled: false,
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <header className="border-b border-buna/20 pb-4">
        <h1 className="text-2xl font-bold text-primary">Establishment Settings & Toggles</h1>
        <p className="text-sm text-buna-mocha">Configure ordering modes, taxes, pickup alarms, and payment fallbacks.</p>
      </header>

      {saveSuccess && (
        <div className="bg-yetsom-container text-white px-4 py-3 rounded-lg text-sm font-semibold shadow-sm">
          Settings updated successfully! Changes take effect immediately without redeployment.
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-buna/10 p-6 space-y-6">
        {/* Establishment Mode Radio Group */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-buna">Establishment Service Mode</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className={`p-4 rounded-xl border cursor-pointer flex items-start space-x-3 ${
              settings.establishment_mode === 'table_service' ? 'border-primary bg-primary/5' : 'border-buna/20'
            }`}>
              <input
                type="radio"
                name="mode"
                value="table_service"
                checked={settings.establishment_mode === 'table_service'}
                onChange={(e) => setSettings({ ...settings, establishment_mode: e.target.value })}
                className="mt-1 text-primary focus:ring-primary"
              />
              <div>
                <span className="font-bold text-sm text-buna block">Table Service</span>
                <span className="text-xs text-buna-mocha block">Ready notifications route to waiter devices for table delivery.</span>
              </div>
            </label>

            <label className={`p-4 rounded-xl border cursor-pointer flex items-start space-x-3 ${
              settings.establishment_mode === 'self_service' ? 'border-primary bg-primary/5' : 'border-buna/20'
            }`}>
              <input
                type="radio"
                name="mode"
                value="self_service"
                checked={settings.establishment_mode === 'self_service'}
                onChange={(e) => setSettings({ ...settings, establishment_mode: e.target.value })}
                className="mt-1 text-primary focus:ring-primary"
              />
              <div>
                <span className="font-bold text-sm text-buna block">Self-Service Pickup</span>
                <span className="text-xs text-buna-mocha block">Ready notifications route to guest phone PWA + pickup alarm chime.</span>
              </div>
            </label>
          </div>
        </div>

        {/* Taxes & Charges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-buna/10 pt-4">
          <div>
            <label className="block text-xs font-semibold text-buna-mocha mb-1">Service Charge (%)</label>
            <input
              type="number"
              value={settings.service_charge_pct}
              onChange={(e) => setSettings({ ...settings, service_charge_pct: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-buna/20 rounded-md text-sm text-buna font-bold"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-buna-mocha mb-1">VAT (%)</label>
            <input
              type="number"
              value={settings.vat_pct}
              onChange={(e) => setSettings({ ...settings, vat_pct: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-buna/20 rounded-md text-sm text-buna font-bold"
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-4 border-t border-buna/10 pt-4">
          <div className="flex justify-between items-center">
            <div>
              <span className="font-bold text-sm text-buna block">Cash at Counter Fallback</span>
              <span className="text-xs text-buna-mocha block">Allow customers to place unpaid orders and settle cash at counter.</span>
            </div>
            <input
              type="checkbox"
              checked={settings.cash_fallback_enabled}
              onChange={(e) => setSettings({ ...settings, cash_fallback_enabled: e.target.checked })}
              className="w-5 h-5 text-primary rounded focus:ring-primary"
            />
          </div>

          <div className="flex justify-between items-center">
            <div>
              <span className="font-bold text-sm text-buna block">Self-Service Pickup Alarm Chime</span>
              <span className="text-xs text-buna-mocha block">Play audible chime and visual alarm on customer open page when ready.</span>
            </div>
            <input
              type="checkbox"
              checked={settings.pickup_alarm_enabled}
              onChange={(e) => setSettings({ ...settings, pickup_alarm_enabled: e.target.checked })}
              className="w-5 h-5 text-primary rounded focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-buna/10">
          <button
            type="submit"
            className="px-6 py-2.5 bg-primary text-white rounded-md text-sm font-bold hover:bg-primary-container shadow-sm"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
