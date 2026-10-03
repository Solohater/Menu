"use client";

import { useState } from "react";
import Link from "next/link";
import KDSOrderCard from "@/components/kds/KDSOrderCard";

interface KDSOrder {
  id: string;
  orderNumber: string;
  tableNumber: string;
  status: "Received" | "Cooking" | "Ready";
  paymentStatus: "paid" | "unpaid";
  initialSeconds: number;
  items: {
    id: string;
    name_en: string;
    name_am?: string;
    quantity: number;
    options?: string[];
  }[];
}

export default function KDSPage() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [orders, setOrders] = useState<KDSOrder[]>([
    {
      id: "ord-154",
      orderNumber: "154",
      tableNumber: "04",
      status: "Received",
      paymentStatus: "paid",
      initialSeconds: 240, // 4 mins
      items: [
        { id: "i1", name_en: "Doro Wat", name_am: "የዶሮ ወጥ", quantity: 1 },
        { id: "i2", name_en: "Tikil Gomen", name_am: "ጥቅል ጎመን", quantity: 2 },
        { id: "i3", name_en: "Ayib", name_am: "አይብ", quantity: 1 },
      ],
    },
    {
      id: "ord-123",
      orderNumber: "123",
      tableNumber: "02",
      status: "Cooking",
      paymentStatus: "paid",
      initialSeconds: 723, // 12 mins 03 secs (Aging warning)
      items: [
        { id: "i4", name_en: "Shekla Tibs", name_am: "የሸክላ ጥብስ", quantity: 2, options: ["Medium Spice"] },
        { id: "i5", name_en: "Beyaynetu", name_am: "የፍስክ በያይነቱ", quantity: 3 },
        { id: "i6", name_en: "Gomen", name_am: "ጎመን", quantity: 1 },
      ],
    },
    {
      id: "ord-160",
      orderNumber: "160",
      tableNumber: "05",
      status: "Cooking",
      paymentStatus: "unpaid",
      initialSeconds: 480, // 8 mins
      items: [
        { id: "i7", name_en: "Kitfo Special", name_am: "ልዩ ክትፎ", quantity: 1, options: ["Leb-leb", "Extra Kocho"] },
        { id: "i8", name_en: "Jebena Buna", name_am: "የጀበና ቡና", quantity: 2 },
      ],
    },
  ]);

  const handleBump = (id: string) => {
    // Play subtle audio ping emulation if sound is enabled
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#121110] text-white font-sans select-none flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      <div>
        {/* Tablet Top Navigation Bar (Matching Mockup) */}
        <header className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          {/* Back Navigation Button */}
          <Link
            href="/"
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-colors"
            title="Return to Main Navigation Hub"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>

          {/* Centered KDS Title */}
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-black tracking-widest uppercase text-white">
              KDS
            </h1>
            <span className="text-[10px] text-[#a3a3a3] uppercase tracking-wider font-semibold block">
              Kitchen Display Pass • Bole Kitchen
            </span>
          </div>

          {/* Right Action Icons: Notification, Settings, Volume */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => alert("Notification center: 3 active table orders.")}
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-colors"
              title="Alert Notifications"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>

            <Link
              href="/admin/settings"
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-colors"
              title="Kitchen Settings"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-colors ${
                soundEnabled
                  ? "bg-white/10 border-white/20 text-white"
                  : "bg-red-500/10 border-red-500/20 text-red-400"
              }`}
              title={soundEnabled ? "Audio Chime Enabled" : "Audio Muted"}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            </button>
          </div>
        </header>

        {/* Live Order Queue (Horizontal Tablet Scrolling Grid) */}
        {orders.length === 0 ? (
          <div className="py-24 text-center space-y-3">
            <span className="text-5xl block animate-bounce">🎉</span>
            <h2 className="text-2xl font-black text-white">All Kitchen Orders Cleared!</h2>
            <p className="text-sm text-[#a3a3a3]">New guest orders will chime and appear here in real time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
            {orders.map((order) => (
              <KDSOrderCard
                key={order.id}
                id={order.id}
                orderNumber={order.orderNumber}
                tableNumber={order.tableNumber}
                status={order.status}
                paymentStatus={order.paymentStatus}
                items={order.items}
                initialSeconds={order.initialSeconds}
                onBump={handleBump}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Status Bar */}
      <footer className="border-t border-white/10 pt-4 mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#a3a3a3]">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-pulse" />
          <span className="font-bold text-white">Live WebSocket Stream Connected</span>
          <span>•</span>
          <span>{orders.length} Active Tickets</span>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-[#f59e0b] font-bold">🟡 &gt;8m Warning</span>
          <span className="text-[#ef4444] font-bold">🔴 &gt;15m Expedite</span>
          <span className="font-mono text-white font-black">16:20 EAT</span>
        </div>
      </footer>
    </div>
  );
}
