"use client";

import { useState } from "react";
import Link from "next/link";
import WaiterAlertCard from "@/components/waiter/WaiterAlertCard";

interface WaiterItem {
  name: string;
  quantity: number;
  customizations?: string[];
}

interface WaiterAlert {
  id: string;
  orderRef: string;
  tableLabel: string;
  items: WaiterItem[];
  readyAt: string;
  source: "chef" | "cashier";
}

export default function WaiterAppPage() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"all" | "chef" | "cashier">("all");
  const [deliveredCount, setDeliveredCount] = useState(14);
  const [guestCallAlert, setGuestCallAlert] = useState<string | null>("Table 03");

  // Active Ready Orders waiting for runner delivery
  const [alerts, setAlerts] = useState<WaiterAlert[]>([
    {
      id: "alert-1",
      orderRef: "MF-8942-T4",
      tableLabel: "Table 04",
      items: [
        {
          name: "Classic Addis Cheeseburger",
          quantity: 1,
          customizations: ["No Onions", "No Ketchup", "+ Extra Cheddar"],
        },
        {
          name: "Iced Caramel Macchiato",
          quantity: 1,
          customizations: ["No Ice"],
        },
      ],
      readyAt: "Just now",
      source: "chef", // Triggered by Chef
    },
    {
      id: "alert-2",
      orderRef: "MF-8945-T2",
      tableLabel: "Table 02",
      items: [
        {
          name: "Special Sizzling Shekla Tibs",
          quantity: 2,
          customizations: ["No Jalapeños / Mild", "+ Extra Spiced Butter"],
        },
        {
          name: "Traditional Jebena Buna",
          quantity: 2,
        },
      ],
      readyAt: "1 min ago",
      source: "cashier", // Triggered by Cashier
    },
    {
      id: "alert-3",
      orderRef: "MF-8947-T5",
      tableLabel: "Table 05",
      items: [
        {
          name: "Smoky BBQ Bacon Burger",
          quantity: 1,
          customizations: ["No Onions"],
        },
        {
          name: "Fresh Avocado Mango Spris",
          quantity: 1,
          customizations: ["No Sugar"],
        },
      ],
      readyAt: "3 mins ago",
      source: "chef", // Triggered by Chef
    },
  ]);

  const handleDeliver = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    setDeliveredCount((prev) => prev + 1);
  };

  const handleSimulateChefPing = () => {
    const newId = `alert-${Date.now()}`;
    const tableNum = Math.floor(Math.random() * 8) + 1;
    setAlerts((prev) => [
      {
        id: newId,
        orderRef: `MF-${Math.floor(8000 + Math.random() * 900)}-T${tableNum}`,
        tableLabel: `Table 0${tableNum}`,
        items: [
          {
            name: "Crispy Peri-Peri Chicken Burger",
            quantity: 1,
            customizations: ["No Mayo"],
          },
          {
            name: "Ambo Mineral Water",
            quantity: 1,
          },
        ],
        readyAt: "Just now",
        source: "chef",
      },
      ...prev,
    ]);
  };

  const handleSimulateCashierPing = () => {
    const newId = `alert-${Date.now()}`;
    const tableNum = Math.floor(Math.random() * 8) + 1;
    setAlerts((prev) => [
      {
        id: newId,
        orderRef: `MF-${Math.floor(8000 + Math.random() * 900)}-T${tableNum}`,
        tableLabel: `Table 0${tableNum}`,
        items: [
          {
            name: "Special Bozena Shiro",
            quantity: 1,
            customizations: ["Extra Injera"],
          },
          {
            name: "Fresh Papaya Orange Blend",
            quantity: 1,
          },
        ],
        readyAt: "Just now",
        source: "cashier",
      },
      ...prev,
    ]);
  };

  const filteredAlerts = alerts.filter((a) => {
    if (activeFilter === "all") return true;
    return a.source === activeFilter;
  });

  const chefAlertsCount = alerts.filter((a) => a.source === "chef").length;
  const cashierAlertsCount = alerts.filter((a) => a.source === "cashier").length;

  return (
    <div className="min-h-screen bg-[#fff8f5] text-buna font-sans p-4 max-w-md mx-auto space-y-4 pb-20 select-none">
      {/* Handheld Waiter Mobile Top Bar */}
      <header className="sticky top-0 z-40 bg-[#fff8f5]/95 backdrop-blur-md border-b border-[#ebdcd3] py-2.5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link
            href="/admin"
            className="w-8 h-8 rounded-xl bg-white border border-[#ebdcd3] flex items-center justify-center text-xs font-bold text-buna hover:bg-[#faf2ee]"
          >
            ←
          </Link>
          <div>
            <h1 className="text-base font-black text-buna leading-none">
              Waiter Handheld
            </h1>
            <span className="text-[10px] text-primary font-bold block mt-0.5">
              Floor Service Mode • Active Shift
            </span>
          </div>
        </div>

        {/* Audio Chime & Shift Pill */}
        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-black border transition-all flex items-center space-x-1 ${
              soundEnabled
                ? "bg-primary text-white border-primary shadow-sm"
                : "bg-white text-buna-mocha border-[#ebdcd3]"
            }`}
          >
            <span>{soundEnabled ? "🔔 Chime: ON" : "🔕 Muted"}</span>
          </button>
        </div>
      </header>

      {/* Guest Assistance Bell Alert Banner (If triggered by customer QR menu) */}
      {guestCallAlert && (
        <div className="bg-amber-500 text-black p-3.5 rounded-2xl shadow-lg border-2 border-amber-400 flex items-center justify-between animate-pulse">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🛎️</span>
            <div>
              <span className="text-xs font-black uppercase tracking-wider block">
                GUEST CALL BELL
              </span>
              <p className="text-sm font-black">
                {guestCallAlert} requested waiter assistance!
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setGuestCallAlert(null)}
            className="px-3 py-1 bg-black text-white text-xs font-black rounded-xl shadow active:scale-95"
          >
            Attending ✓
          </button>
        </div>
      )}

      {/* Notification Origin Tabs: All / Chef / Cashier */}
      <div className="bg-white p-1 rounded-2xl border border-[#ebdcd3] flex space-x-1 shadow-sm">
        <button
          type="button"
          onClick={() => setActiveFilter("all")}
          className={`flex-1 py-2 rounded-xl text-xs font-black transition-all text-center ${
            activeFilter === "all"
              ? "bg-primary text-white shadow-sm"
              : "text-buna-mocha hover:text-buna"
          }`}
        >
          All ({alerts.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter("chef")}
          className={`flex-1 py-2 rounded-xl text-xs font-black transition-all text-center flex items-center justify-center space-x-1 ${
            activeFilter === "chef"
              ? "bg-[#9d3e0f] text-white shadow-sm"
              : "text-buna-mocha hover:text-buna"
          }`}
        >
          <span>👨‍🍳 Chef</span>
          <span className="text-[10px] opacity-80">({chefAlertsCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter("cashier")}
          className={`flex-1 py-2 rounded-xl text-xs font-black transition-all text-center flex items-center justify-center space-x-1 ${
            activeFilter === "cashier"
              ? "bg-emerald-700 text-white shadow-sm"
              : "text-buna-mocha hover:text-buna"
          }`}
        >
          <span>💵 Cashier</span>
          <span className="text-[10px] opacity-80">({cashierAlertsCount})</span>
        </button>
      </div>

      {/* Runner Delivery Queue Cards */}
      <main className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-[#ebdcd3] text-center space-y-3 shadow-sm">
            <span className="text-4xl block animate-bounce">🎉</span>
            <h2 className="text-lg font-black text-buna">All Ready Orders Delivered!</h2>
            <p className="text-xs text-buna-mocha leading-relaxed max-w-xs mx-auto">
              When either the <strong className="text-primary font-bold">Chef</strong> or <strong className="text-emerald-700 font-bold">Cashier</strong> marks an order ready for a table, a live audible alert will pop up here.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <WaiterAlertCard
              key={alert.id}
              id={alert.id}
              orderRef={alert.orderRef}
              tableLabel={alert.tableLabel}
              items={alert.items}
              readyAt={alert.readyAt}
              source={alert.source}
              onDeliver={handleDeliver}
            />
          ))
        )}
      </main>

      {/* Simulator Triggers (Easy testing of Chef & Cashier pings) */}
      <div className="pt-2 bg-white p-3.5 rounded-2xl border border-[#ebdcd3] space-y-2 text-center">
        <span className="text-[10px] font-black uppercase tracking-wider text-buna-mocha block">
          Simulate Incoming Ready Notifications:
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleSimulateChefPing}
            className="py-2.5 px-2 bg-[#faf2ee] hover:bg-[#ebdcd3] text-[#9d3e0f] rounded-xl text-xs font-black border border-[#ebdcd3] transition-colors flex items-center justify-center space-x-1"
          >
            <span>👨‍🍳</span>
            <span>Chef Marks Ready</span>
          </button>
          <button
            type="button"
            onClick={handleSimulateCashierPing}
            className="py-2.5 px-2 bg-[#f0fdf4] hover:bg-[#dcfce7] text-emerald-800 rounded-xl text-xs font-black border border-emerald-200 transition-colors flex items-center justify-center space-x-1"
          >
            <span>💵</span>
            <span>Cashier Marks Ready</span>
          </button>
        </div>
      </div>

      {/* Delivered Today Stats Footer */}
      <footer className="text-center pt-2">
        <span className="text-[11px] text-buna-mocha font-semibold">
          🚀 {deliveredCount} tables served today • MenuFlow Runner Service
        </span>
      </footer>
    </div>
  );
}
