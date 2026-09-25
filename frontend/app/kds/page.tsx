"use client";

import { useEffect, useState } from "react";
import KDSOrderCard from "@/components/kds/KDSOrderCard";

export default function KDSPage() {
  const [orders, setOrders] = useState<any[]>([
    {
      id: "01J8ORDKDS01",
      orderRef: "MF-8942-T4",
      tableLabel: "Table 04",
      status: "Received",
      paymentStatus: "paid",
      elapsedMins: 4,
      isOverdue: false,
      items: [
        {
          id: "item1",
          name_en: "Special Sizzling Shekla Tibs",
          name_am: "የሸክላ ጥብስ",
          quantity: 1,
          options: ["Extra Injera (+30 ETB)"],
          special_instructions: "Medium spice level",
        },
        {
          id: "item2",
          name_en: "Traditional Jebena Buna",
          name_am: "የጀበና ቡና ሥነ ሥርዓት",
          quantity: 2,
          options: [],
        },
      ],
    },
    {
      id: "01J8ORDKDS02",
      orderRef: "MF-8943-P4",
      tableLabel: "Pickup #P04",
      status: "Preparing",
      paymentStatus: "unpaid",
      elapsedMins: 16,
      isOverdue: true,
      items: [
        {
          id: "item3",
          name_en: "Royal Beyaynetu Platter",
          name_am: "የፍስክ በያይነቱ",
          quantity: 1,
          options: ["Takeaway Pack"],
        },
      ],
    },
    {
      id: "01J8ORDKDS03",
      orderRef: "MF-8944-T7",
      tableLabel: "Table 07",
      status: "Received",
      paymentStatus: "paid",
      elapsedMins: 2,
      isOverdue: false,
      items: [
        {
          id: "item4",
          name_en: "Special Bozena Shiro",
          name_am: "ቦዘና ሽሮ",
          quantity: 2,
          options: ["Extra Qibe (+40 ETB)"],
        },
      ],
    },
  ]);

  const handleStatusChange = (id: string, nextStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: nextStatus } : o))
    );
  };

  return (
    <div className="min-h-screen bg-kds-surface text-kds-text p-6 space-y-6 w-full">
      {/* Top Header & Connection Strip */}
      <header className="flex justify-between items-center border-b border-outline/30 pb-4">
        <div>
          <h1 className="text-2xl font-black text-kds-text tracking-tight">
            Kitchen Display System (KDS)
          </h1>
          <p className="text-xs text-outline">
            Habesha Gourmet Cafe • Live Kitchen Queue
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-kds-card px-3 py-1.5 rounded-lg border border-outline/30">
            <span className="w-2.5 h-2.5 rounded-full bg-yetsom-container animate-pulse" />
            <span className="text-xs font-mono font-bold text-kds-text">
              WS CONNECTED
            </span>
          </div>
          <span className="text-lg font-mono font-extrabold text-gold">
            14:30 UTC
          </span>
        </div>
      </header>

      {/* 2-5 Column Queue Grid per UX-DR6 (TV / Landscape Display Optimized) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
        {orders.map((order) => (
          <KDSOrderCard
            key={order.id}
            id={order.id}
            orderRef={order.orderRef}
            tableLabel={order.tableLabel}
            status={order.status}
            paymentStatus={order.paymentStatus}
            items={order.items}
            elapsedMins={order.elapsedMins}
            isOverdue={order.isOverdue}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>
    </div>
  );
}
