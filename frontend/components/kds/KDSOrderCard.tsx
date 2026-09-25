"use client";

import { useEffect, useState } from "react";

interface KDSItem {
  id: string;
  name_en: string;
  name_am: string;
  quantity: number;
  options?: string[];
  special_instructions?: string;
}

interface KDSOrderCardProps {
  id: string;
  orderRef: string;
  tableLabel: string;
  status: string; // Received | Preparing | Ready
  paymentStatus: string; // paid | unpaid
  items: KDSItem[];
  elapsedMins: number;
  isOverdue?: boolean;
  onStatusChange: (id: string, nextStatus: string) => void;
}

export default function KDSOrderCard({
  id,
  orderRef,
  tableLabel,
  status,
  paymentStatus,
  items,
  elapsedMins: initialElapsed,
  isOverdue: initialOverdue = false,
  onStatusChange,
}: KDSOrderCardProps) {
  const [elapsed, setElapsed] = useState(initialElapsed);
  const isPaid = paymentStatus === "paid";

  // Continuous elapsed timer tick per FR-11 & UX-DR6
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 60000); // Increment elapsed time every minute

    return () => clearInterval(timer);
  }, []);

  const isOverdue = elapsed >= 15 || initialOverdue;

  return (
    <div
      className={`bg-kds-card rounded-xl p-5 border text-left flex flex-col justify-between space-y-4 shadow-md transition-all ${
        isOverdue
          ? "border-l-8 border-l-gold border-r-outline/40 border-y-outline/40"
          : "border-outline/45"
      }`}
    >
      {/* Card Header */}
      <div className="space-y-1 border-b border-outline/30 pb-3">
        <div className="flex justify-between items-center">
          <span className="text-xl font-extrabold text-kds-text tracking-tight">
            {tableLabel}
          </span>
          {/* Steady Gold Overdue Rail & Bumped Timer per UX-DR6 & FR-11 (No strobing/flashing) */}
          <span
            className={`text-xs font-bold font-mono px-2 py-0.5 rounded transition-all ${
              isOverdue
                ? "bg-gold text-buna font-extrabold text-sm shadow-sm"
                : "text-gold"
            }`}
          >
            ⏱ {elapsed} mins {isOverdue && "• OVERDUE"}
          </span>
        </div>
        <div className="flex justify-between items-center text-xs text-outline">
          <span>Ref: {orderRef}</span>
          <span
            className={`font-bold px-2 py-0.5 rounded text-[10px] ${
              isPaid
                ? "bg-yetsom-container text-white"
                : "bg-gold-text text-white font-extrabold"
            }`}
          >
            {isPaid ? "PAID" : "UNPAID (Pay at Counter)"}
          </span>
        </div>
      </div>

      {/* Amharic-First Dish Lines per UX-DR6 */}
      <div className="space-y-3 flex-1 divide-y divide-outline/20">
        {items.map((item) => (
          <div key={item.id} className="pt-2 first:pt-0 space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="text-base font-extrabold text-kds-text gees-text" lang="am">
                {item.name_am}{" "}
                <span className="text-xs font-normal text-outline">({item.name_en})</span>
              </span>
              <span className="text-lg font-extrabold text-primary-dim">
                × {item.quantity}
              </span>
            </div>

            {item.options && item.options.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {item.options.map((opt) => (
                  <span
                    key={opt}
                    className="text-[10px] font-semibold bg-primary-container/20 text-primary-dim px-2 py-0.5 rounded border border-primary-container/40"
                  >
                    + {opt}
                  </span>
                ))}
              </div>
            )}

            {item.special_instructions && (
              <p className="text-xs text-gold font-semibold italic pt-0.5">
                Note: "{item.special_instructions}"
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Tall Status Tap Control (≥56px) per UX-DR6 & AD-6 */}
      <div className="pt-2">
        {status === "Received" && (
          <button
            type="button"
            onClick={() => onStatusChange(id, "Preparing")}
            className="w-full min-h-[56px] bg-primary text-white text-base font-extrabold rounded-xl shadow-md hover:bg-primary-container transition-all flex items-center justify-center space-x-2"
          >
            <span>▶ Start Preparing</span>
          </button>
        )}

        {status === "Preparing" && (
          <button
            type="button"
            onClick={() => onStatusChange(id, "Ready")}
            className="w-full min-h-[56px] bg-yetsom-container text-white text-base font-extrabold rounded-xl shadow-md hover:bg-yetsom transition-all flex items-center justify-center space-x-2"
          >
            <span>✓ Mark Ready (Signal Pass)</span>
          </button>
        )}

        {status === "Ready" && (
          <div className="w-full min-h-[56px] bg-yetsom-container/20 border border-yetsom-container text-yetsom-container text-sm font-bold rounded-xl flex items-center justify-center space-x-2">
            <span>● Ready (Notified)</span>
          </div>
        )}
      </div>
    </div>
  );
}
