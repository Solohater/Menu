"use client";

import { useState } from "react";
import WaiterAlertCard from "@/components/waiter/WaiterAlertCard";

interface WaiterAlert {
  id: string;
  orderRef: string;
  tableLabel: string;
  itemsSummary: string[];
  readyAt: string;
}

export default function WaiterAppPage() {
  const [alerts, setAlerts] = useState<WaiterAlert[]>([
    {
      id: "01J8ORD100",
      orderRef: "MF-8942-T4",
      tableLabel: "Table 04",
      itemsSummary: ["Special Shekla Tibs x1", "Traditional Jebena Buna x2"],
      readyAt: "Just now",
    },
    {
      id: "01J8ORD101",
      orderRef: "MF-8945-T2",
      tableLabel: "Table 02",
      itemsSummary: ["Royal Beyaynetu Platter x1"],
      readyAt: "2 mins ago",
    },
  ]);

  const handleDeliver = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-teff p-4 md:p-6 max-w-lg md:max-w-4xl mx-auto space-y-5 text-left pb-16">
      <header className="flex justify-between items-center border-b border-buna/10 pb-3">
        <div>
          <h1 className="text-xl font-bold text-primary">Waiter Ready Alerts</h1>
          <p className="text-xs text-buna-mocha">Table Service Delivery Queue</p>
        </div>
        <div className="flex items-center space-x-2 bg-white px-3 py-1 rounded-full border border-buna/10">
          <span className="w-2 h-2 rounded-full bg-yetsom-container animate-pulse" />
          <span className="text-[10px] font-bold text-buna">LIVE ALERTS</span>
        </div>
      </header>

      {alerts.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 border border-buna/10 text-center space-y-2">
          <span className="text-3xl">🎉</span>
          <h2 className="text-base font-bold text-buna">All Ready Orders Delivered!</h2>
          <p className="text-xs text-buna-mocha">New ready orders from the kitchen pass will chime here instantly.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.map((alert) => (
            <WaiterAlertCard
              key={alert.id}
              id={alert.id}
              orderRef={alert.orderRef}
              tableLabel={alert.tableLabel}
              itemsSummary={alert.itemsSummary}
              readyAt={alert.readyAt}
              onDeliver={handleDeliver}
            />
          ))}
        </div>
      )}
    </div>
  );
}
