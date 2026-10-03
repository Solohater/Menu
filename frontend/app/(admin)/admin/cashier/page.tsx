"use client";

import { useState } from "react";
import Link from "next/link";

interface CashierOrder {
  id: string;
  orderRef: string;
  tableLabel: string;
  itemsSummary: string;
  totalAmount: number;
  paymentStatus: "paid" | "unpaid";
  provider: "cash" | "telebirr" | "chapa" | "cbe";
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
    {
      id: "01J8ORDCASH3",
      orderRef: "MF-8945-T2",
      tableLabel: "Table 02",
      itemsSummary: "Special Kitfo, Mineral Water x2",
      totalAmount: 720,
      paymentStatus: "unpaid",
      provider: "cash",
      createdAt: "5 mins ago",
    },
    {
      id: "01J8ORDCASH4",
      orderRef: "MF-8946-T7",
      tableLabel: "Table 07",
      itemsSummary: "Doro Wat Stew, Extra Injera",
      totalAmount: 550,
      paymentStatus: "paid",
      provider: "chapa",
      createdAt: "22 mins ago",
    },
  ]);

  const [activeTab, setActiveTab] = useState<"all" | "unpaid" | "paid">("all");

  const handleSettle = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, paymentStatus: "paid" } : o))
    );
  };

  const filteredOrders = orders.filter((o) => {
    if (activeTab === "unpaid") return o.paymentStatus === "unpaid";
    if (activeTab === "paid") return o.paymentStatus === "paid";
    return true;
  });

  const unpaidTotal = orders
    .filter((o) => o.paymentStatus === "unpaid")
    .reduce((acc, o) => acc + o.totalAmount, 0);

  const collectedTotal = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((acc, o) => acc + o.totalAmount, 0);

  return (
    <div className="p-5 md:p-8 space-y-7 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#ebdcd3]/70">
        <div>
          <div className="flex items-center space-x-2">
            <Link href="/admin" className="text-xs font-bold text-primary hover:underline">
              ← Dashboard
            </Link>
            <span className="text-xs text-[#ebdcd3]">•</span>
            <span className="text-xs text-buna-mocha font-semibold">Till & Settlement</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-buna mt-1">
            Cashier Counter Register
          </h1>
          <p className="text-xs text-buna-mocha font-medium mt-0.5">
            Settle unpaid cash orders at the front counter, confirm mobile transaction codes, and print tax receipts.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="px-3 py-1.5 rounded-full text-xs font-black bg-primary/10 text-primary uppercase tracking-wider">
            Till Shift #04 Active
          </span>
        </div>
      </div>

      {/* Till Balances Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl p-6 border border-[#ebdcd3] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#DC2626]">Pending Cash to Collect</span>
            <p className="text-3xl font-black text-buna mt-1">ETB {unpaidTotal.toLocaleString()}</p>
            <span className="text-xs text-buna-mocha mt-1 block">
              {orders.filter((o) => o.paymentStatus === "unpaid").length} open table bills
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#DC2626]/10 text-[#DC2626] flex items-center justify-center text-xl font-bold">
            💵
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#ebdcd3] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#2D7A4D]">Settled Till Total</span>
            <p className="text-3xl font-black text-buna mt-1">ETB {collectedTotal.toLocaleString()}</p>
            <span className="text-xs text-buna-mocha mt-1 block">
              {orders.filter((o) => o.paymentStatus === "paid").length} reconciled receipts
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#2D7A4D]/10 text-[#2D7A4D] flex items-center justify-center text-xl font-bold">
            ✅
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#ebdcd3] shadow-sm flex items-center justify-between sm:col-span-2 lg:col-span-1">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-buna-mocha">Shift Compliance</span>
            <p className="text-3xl font-black text-buna mt-1">100% Tax VAT</p>
            <span className="text-xs text-buna-mocha mt-1 block">15% VAT & 10% Service pre-calculated</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gold/10 text-gold-text flex items-center justify-center text-xl font-bold">
            🧾
          </div>
        </div>
      </div>

      {/* Filter Tabs & Register Orders List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2 bg-white border border-[#ebdcd3] rounded-2xl p-1 shadow-sm">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "all" ? "bg-primary text-white" : "text-buna-mocha hover:text-buna"
              }`}
            >
              All Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab("unpaid")}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "unpaid" ? "bg-[#DC2626] text-white" : "text-buna-mocha hover:text-buna"
              }`}
            >
              Pending Cash ({orders.filter((o) => o.paymentStatus === "unpaid").length})
            </button>
            <button
              onClick={() => setActiveTab("paid")}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "paid" ? "bg-[#2D7A4D] text-white" : "text-buna-mocha hover:text-buna"
              }`}
            >
              Settled ({orders.filter((o) => o.paymentStatus === "paid").length})
            </button>
          </div>

          <span className="text-xs text-buna-mocha font-medium">
            Click "Mark Cash Paid" as soon as guest hands over physical ETB notes
          </span>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-[#ebdcd3] overflow-hidden">
          <table className="w-full text-left text-sm text-buna">
            <thead className="text-xs uppercase text-buna-mocha border-b border-[#ebdcd3] bg-[#faf5f0]">
              <tr>
                <th className="p-4">Table / Order Ref</th>
                <th className="p-4">Dishes Ordered</th>
                <th className="p-4">Total (Inc. Tax)</th>
                <th className="p-4">Payment Rail</th>
                <th className="p-4 text-right">Action / Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebdcd3]/50">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-[#faf5f0]/50 transition-colors">
                  <td className="p-4">
                    <span className="font-bold text-buna block text-sm">{ord.tableLabel}</span>
                    <span className="text-[11px] font-mono text-buna-mocha block">{ord.orderRef}</span>
                    <span className="text-[10px] text-buna-mocha">{ord.createdAt}</span>
                  </td>

                  <td className="p-4">
                    <p className="text-xs text-buna font-medium">{ord.itemsSummary}</p>
                  </td>

                  <td className="p-4">
                    <span className="font-extrabold text-base text-buna block">
                      ETB {ord.totalAmount}
                    </span>
                    <span className="text-[10px] text-buna-mocha">15% VAT + 10% Service incl.</span>
                  </td>

                  <td className="p-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        ord.provider === "cash"
                          ? "bg-amber-100 text-amber-900 border border-amber-300"
                          : ord.provider === "telebirr"
                          ? "bg-blue-100 text-blue-900 border border-blue-300"
                          : "bg-emerald-100 text-emerald-900 border border-emerald-300"
                      }`}
                    >
                      {ord.provider}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    {ord.paymentStatus === "unpaid" ? (
                      <button
                        onClick={() => handleSettle(ord.id)}
                        className="px-4 py-2 bg-[#2D7A4D] hover:bg-[#256640] text-white text-xs font-bold rounded-xl shadow-sm transition-all transform hover:scale-105 active:scale-95"
                      >
                        ✓ Mark Cash Paid
                      </button>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-bold bg-[#2D7A4D]/10 text-[#2D7A4D]">
                        <span>✓ Settled</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
