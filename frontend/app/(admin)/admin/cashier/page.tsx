"use client";

import { useState } from "react";

interface CashierOrder {
  id: string;
  orderRef: string;
  tableLabel: string;
  itemsSummary: string;
  totalAmount: number;
  paymentStatus: "paid" | "unpaid";
  provider: string;
  createdAt: string;
}

export default function StandaloneCashierPage() {
  const [orders, setOrders] = useState<CashierOrder[]>([
    {
      id: "01J8ORDCASH1",
      orderRef: "MF-8942-T4",
      tableLabel: "Table 04",
      itemsSummary: "Special Shekla Tibs, Jebena Buna x2",
      totalAmount: 900,
      paymentStatus: "unpaid",
      provider: "cash",
      createdAt: "10 mins ago",
    },
    {
      id: "01J8ORDCASH2",
      orderRef: "MF-8943-P4",
      tableLabel: "Pickup #P04",
      itemsSummary: "Royal Beyaynetu Platter",
      totalAmount: 650,
      paymentStatus: "paid",
      provider: "telebirr",
      createdAt: "15 mins ago",
    },
  ]);

  const handleSettle = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, paymentStatus: "paid" } : o))
    );
  };

  return (
    <div className="space-y-6 text-left">
      <header className="border-b border-buna/20 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Cashier Payment & Settlement View</h1>
          <p className="text-sm text-buna-mocha">Track paid and unpaid cash fallback orders independently of kitchen prep.</p>
        </div>
        <span className="bg-buna text-white text-xs font-bold px-3 py-1 rounded-full">
          CASHIER COUNTER REGISTER
        </span>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-buna/10 p-5">
        <table className="w-full text-left text-sm text-buna">
          <thead className="text-xs uppercase text-buna-mocha border-b border-buna/10 bg-teff">
            <tr>
              <th className="p-3">Order Ref / Location</th>
              <th className="p-3">Items Summary</th>
              <th className="p-3">Total Payable</th>
              <th className="p-3">Payment Rail</th>
              <th className="p-3">Payment Status</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-buna/10">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-teff/50">
                <td className="p-3">
                  <span className="font-bold text-primary block">{o.tableLabel}</span>
                  <span className="text-xs text-buna-mocha font-mono">Ref: {o.orderRef}</span>
                </td>
                <td className="p-3 font-medium text-xs">{o.itemsSummary}</td>
                <td className="p-3 font-bold text-primary">ETB {o.totalAmount}</td>
                <td className="p-3 uppercase text-xs font-semibold">{o.provider}</td>
                <td className="p-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      o.paymentStatus === "paid"
                        ? "bg-yetsom-container text-white"
                        : "bg-gold-text text-white font-extrabold"
                    }`}
                  >
                    {o.paymentStatus === "paid" ? "PAID" : "UNPAID (Pay at Counter)"}
                  </span>
                </td>
                <td className="p-3 text-right">
                  {o.paymentStatus === "unpaid" ? (
                    <button
                      onClick={() => handleSettle(o.id)}
                      className="px-4 py-2 bg-primary text-white rounded-md text-xs font-bold hover:bg-primary-container shadow-sm"
                    >
                      Mark Paid & Settle
                    </button>
                  ) : (
                    <span className="text-xs text-yetsom-container font-bold">✓ Settled</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
