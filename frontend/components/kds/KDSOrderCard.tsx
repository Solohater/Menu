"use client";

import { useEffect, useState } from "react";

interface KDSItem {
  id: string;
  name_en: string;
  name_am?: string;
  quantity: number;
  options?: string[];
  special_instructions?: string;
}

interface KDSOrderCardProps {
  id: string;
  orderNumber: string;
  tableNumber: string;
  status: "Received" | "Cooking" | "Ready";
  paymentStatus: "paid" | "unpaid";
  items: KDSItem[];
  initialSeconds: number;
  onBump: (id: string) => void;
}

export default function KDSOrderCard({
  id,
  orderNumber,
  tableNumber,
  status: initialStatus,
  paymentStatus,
  items,
  initialSeconds,
  onBump,
}: KDSOrderCardProps) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [status, setStatus] = useState<"Received" | "Cooking" | "Ready">(initialStatus);

  // Live seconds ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formattedTimer = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;

  // Aging thresholds
  const isAgingWarning = mins >= 8 && mins < 15;
  const isCriticalLate = mins >= 15;

  let cardBorder = "border-[#2d3748]";
  let headerBg = "bg-[#253248]";
  let headerText = "text-white";

  if (isCriticalLate) {
    cardBorder = "border-[#dc2626] ring-2 ring-[#dc2626] animate-pulse";
    headerBg = "bg-[#7f1d1d]";
    headerText = "text-[#fecaca]";
  } else if (isAgingWarning) {
    cardBorder = "border-[#f59e0b] shadow-[0_0_15px_rgba(245,158,11,0.25)]";
    headerBg = "bg-[#453414]";
    headerText = "text-[#fef08a]";
  }

  const handleAction = () => {
    if (status === "Received") {
      setStatus("Cooking");
    } else {
      onBump(id);
    }
  };

  return (
    <div
      className={`bg-[#171717] rounded-2xl border-2 ${cardBorder} flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-200 min-h-[380px] max-w-sm w-full`}
    >
      {/* Top Header Banner with Order # and Table Number */}
      <div>
        <div className={`${headerBg} px-5 py-3.5 flex items-center justify-between border-b border-white/10`}>
          <div>
            <span className={`text-base font-black tracking-wider uppercase block ${headerText}`}>
              ORDER #{orderNumber}
            </span>
            <span className="text-xs font-black tracking-widest uppercase text-[#38bdf8] block mt-0.5">
              TABLE {tableNumber}
            </span>
          </div>

          <span
            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
              paymentStatus === "paid"
                ? "bg-[#22c55e]/20 text-[#4ade80]"
                : "bg-[#f59e0b]/20 text-[#fbbf24]"
            }`}
          >
            {paymentStatus === "paid" ? "PAID" : "UNPAID"}
          </span>
        </div>

        {/* Dish Items List with Quantities on Right */}
        <div className="p-5 space-y-3 divide-y divide-white/5">
          {items.map((item) => (
            <div key={item.id} className="pt-2 first:pt-0 flex items-start justify-between">
              <div className="pr-3">
                <span className="text-lg font-bold text-white block leading-snug">
                  {item.name_en}
                </span>
                {item.name_am && (
                  <span className="text-xs text-[#a3a3a3] block gees-text" lang="am">
                    {item.name_am}
                  </span>
                )}
                {item.options && item.options.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.options.map((opt, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold text-[#fbbf24] bg-[#f59e0b]/10 px-1.5 py-0.5 rounded"
                      >
                        + {opt}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Large Quantity on Right */}
              <span className="text-2xl font-black text-white shrink-0 pl-2">
                {item.quantity}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Status, Timer & Bump Button */}
      <div className="p-5 pt-2 space-y-3 bg-[#171717]">
        {/* Status Badge & Live Clock */}
        <div className="flex items-center justify-between text-xs">
          <span
            className={`px-3 py-1 rounded-lg font-extrabold uppercase text-xs ${
              status === "Cooking"
                ? "bg-[#ea580c] text-white shadow-sm"
                : status === "Received"
                ? "bg-[#38bdf8]/20 text-[#38bdf8]"
                : "bg-[#22c55e] text-white"
            }`}
          >
            {status}
          </span>

          <div className="font-mono text-sm font-extrabold flex items-center space-x-1.5">
            <span className="text-[#a3a3a3] text-xs font-normal">Timer</span>
            <span
              className={
                isCriticalLate
                  ? "text-[#ef4444]"
                  : isAgingWarning
                  ? "text-[#f59e0b]"
                  : "text-white"
              }
            >
              {formattedTimer}
            </span>
          </div>
        </div>

        {/* Large Tactile 1-Tap Bump Button */}
        <button
          type="button"
          onClick={handleAction}
          className={`w-full min-h-[50px] font-black text-base rounded-xl shadow-lg transition-all transform active:scale-95 flex items-center justify-center space-x-2 ${
            status === "Received"
              ? "bg-[#38bdf8] hover:bg-[#0284c7] text-[#0f172a]"
              : "bg-white hover:bg-[#f5f5f5] text-[#171717]"
          }`}
        >
          <span>{status === "Received" ? "Start Cooking ▶" : "Bump"}</span>
        </button>
      </div>
    </div>
  );
}
