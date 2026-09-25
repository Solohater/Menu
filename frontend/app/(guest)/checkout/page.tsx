"use client";

import { useState } from "react";
import HeaderPill from "@/components/guest/HeaderPill";
import OfflineBanner from "@/components/guest/OfflineBanner";

interface TrayItem {
  id: string;
  name_en: string;
  name_am: string;
  final_price: number;
  quantity: number;
  is_available: boolean;
  special_instructions?: string;
}

export default function TrayCheckoutPage() {
  const [items, setItems] = useState<TrayItem[]>([
    {
      id: "tray-1",
      name_en: "Special Sizzling Shekla Tibs",
      name_am: "የሸክላ ጥብስ",
      final_price: 480,
      quantity: 1,
      is_available: true,
      special_instructions: "Medium spice level",
    },
    {
      id: "tray-2",
      name_en: "Traditional Jebena Buna",
      name_am: "የጀበና ቡና ሥነ ሥርዓት",
      final_price: 120,
      quantity: 2,
      is_available: true,
    },
  ]);

  const [selectedRail, setSelectedRail] = useState("telebirr");
  const [orderConfirmed, setOrderConfirmed] = useState<any>(null);

  const subtotal = items.reduce((acc, i) => acc + i.final_price * i.quantity, 0);
  const serviceChargePct = 10.0;
  const vatPct = 15.0;

  const serviceChargeAmount = Math.round(subtotal * (serviceChargePct / 100));
  const vatAmount = Math.round(subtotal * (vatPct / 100));
  const totalPayable = subtotal + serviceChargeAmount + vatAmount;

  const hasSoldOutItem = items.some((i) => !i.is_available);

  const handlePlaceOrder = () => {
    if (selectedRail === "cash") {
      setOrderConfirmed({
        order_id: "MF-8942-T4",
        status: "Received",
        payment_status: "unpaid",
        total: totalPayable,
        message: "Order placed! Pay cashier directly at counter when order is ready.",
      });
    } else {
      alert(`Initiating ${selectedRail.toUpperCase()} checkout redirect...`);
    }
  };

  if (orderConfirmed) {
    return (
      <div className="p-4 md:p-6 max-w-xl mx-auto min-h-screen bg-teff space-y-5 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl border border-buna/10 shadow-lg text-center space-y-4 w-full">
          <div className="w-14 h-14 rounded-full bg-yetsom-container text-white flex items-center justify-center text-2xl font-bold mx-auto shadow-md">
            ✓
          </div>
          <div>
            <h1 className="text-xl font-bold text-buna">Order Confirmed!</h1>
            <span className="text-xs text-primary font-bold gees-text block" lang="am">
              ትዕዛዝዎ ተቀብለናል (Order Ref: {orderConfirmed.order_id})
            </span>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl text-left space-y-1">
            <span className="text-xs font-bold text-yellow-800 uppercase block">● Payment Status: UNPAID</span>
            <p className="text-xs text-yellow-700 leading-relaxed">
              {orderConfirmed.message}
            </p>
          </div>

          <div className="text-left bg-teff p-4 rounded-xl space-y-2 text-xs text-buna border border-buna/10">
            <div className="flex justify-between">
              <span>Estimated Wait Time:</span>
              <strong className="text-primary text-sm">12–15 mins</strong>
            </div>
            <div className="flex justify-between">
              <span>Total Payable:</span>
              <strong className="text-primary text-sm">ETB {orderConfirmed.total}</strong>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto min-h-screen bg-teff space-y-6 pb-20">
      <OfflineBanner />

      {/* Tray Checkout Header per UX-DR4 */}
      <header className="bg-white p-5 rounded-2xl border border-buna/10 shadow-sm flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-lg md:text-xl font-bold text-buna">Tray Checkout</h1>
            <span className="bg-primary-fixed text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
              LIVE
            </span>
          </div>
          <span className="text-xs text-buna-mocha uppercase font-bold tracking-wider block">
            Table Order Summary
          </span>
        </div>
        <HeaderPill label="04" type="table" />
      </header>

      {/* 2-Column Desktop Grid (`grid grid-cols-1 lg:grid-cols-12 gap-8`) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Items List & Sold-out Warnings */}
        <div className="lg:col-span-7 space-y-5 text-left">
          {/* Sold-out Retryable Block per FR-5 */}
          {hasSoldOutItem && (
            <div className="bg-red-50 border border-red-300 p-4 rounded-xl space-y-2">
              <div className="flex items-center space-x-2 text-red-700 font-bold text-xs">
                <span>⚠️ Order Blocked</span>
              </div>
              <p className="text-xs text-red-600 leading-relaxed">
                One or more items in your tray are currently <strong>sold out</strong>. Please remove or replace the item before placing your order.
              </p>
            </div>
          )}

          {/* Item Lines */}
          <div className="bg-white rounded-2xl border border-buna/10 p-6 shadow-sm space-y-4">
            <h2 className="text-xs font-bold text-buna-mocha uppercase tracking-wider border-b border-buna/10 pb-2">
              Tray Line Items ({items.length})
            </h2>
            <div className="divide-y divide-buna/10">
              {items.map((item) => (
                <div key={item.id} className="py-3 flex justify-between items-center">
                  <div className="space-y-0.5">
                    <span className="text-sm font-bold text-buna">{item.name_en}</span>
                    <span className="text-xs text-primary font-semibold gees-text block" lang="am">
                      ({item.name_am}) • Qty: {item.quantity}
                    </span>
                    {item.special_instructions && (
                      <span className="text-xs text-buna-mocha italic block">
                        Note: "{item.special_instructions}"
                      </span>
                    )}
                  </div>
                  <span className="text-base font-bold text-primary">
                    ETB {item.final_price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols, Sticky): Bill Breakdown & Payment Method Selection */}
        <div className="lg:col-span-5 space-y-5 text-left sticky top-6">
          {/* Bill Breakdown with TAX INVOICE Header per UX-DR4 & FR-7 */}
          <div className="bg-white rounded-2xl border border-buna/10 p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-buna/10 pb-2">
              <h3 className="text-xs font-bold text-buna-mocha uppercase tracking-wider">
                Bill Breakdown
              </h3>
              <span className="bg-buna/10 text-buna text-[10px] font-bold px-2.5 py-1 rounded">
                TAX INVOICE / የታክስ ደረሰኝ
              </span>
            </div>

            <div className="space-y-2 text-xs text-buna-mocha">
              <div className="flex justify-between">
                <span>Food & Beverage Subtotal</span>
                <span className="font-semibold text-buna">ETB {subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Hospitality Service Charge (10%)</span>
                <span className="font-semibold text-buna">ETB {serviceChargeAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT (15%)</span>
                <span className="font-semibold text-buna">ETB {vatAmount}</span>
              </div>
            </div>

            <div className="border-t border-buna/10 pt-3 flex justify-between items-baseline">
              <div>
                <span className="text-xs font-bold text-buna uppercase block">Total Payable</span>
                <span className="text-[10px] text-primary font-bold gees-text block" lang="am">
                  የሚከፈል አጠቃላይ ድምር
                </span>
              </div>
              <span className="text-2xl font-black text-primary">ETB {totalPayable}</span>
            </div>
          </div>

          {/* Selectable Payment Rails */}
          <div className="bg-white rounded-2xl border border-buna/10 p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-buna-mocha uppercase tracking-wider border-b border-buna/10 pb-2">
              Select Payment Method
            </h3>

            <div className="space-y-2">
              {[
                { id: "telebirr", name: "Telebirr (ቴሌብር)", desc: "FAST PUSH • Pay directly via Telebirr SuperApp" },
                { id: "chapa", name: "Chapa Gateway (ቻፓ)", desc: "CBE Birr, Awash, Dashen & Visa/MC" },
                { id: "cbe", name: "CBE Direct (ንግድ ባንክ)", desc: "Commercial Bank of Ethiopia Direct Banking" },
                { id: "cash", name: "Cash at Counter (በጥሬ ገንዘብ)", desc: "Pay cashier directly when order is ready" },
              ].map((rail) => (
                <label
                  key={rail.id}
                  className={`p-3 rounded-xl border cursor-pointer block transition-all ${
                    selectedRail === rail.id
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-buna/10 bg-surface-container-low"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="rail"
                      value={rail.id}
                      checked={selectedRail === rail.id}
                      onChange={(e) => setSelectedRail(e.target.value)}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="text-xs font-bold text-buna">{rail.name}</span>
                  </div>
                  <span className="text-[11px] text-buna-mocha block mt-1 pl-6">{rail.desc}</span>
                </label>
              ))}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={hasSoldOutItem}
                className={`w-full min-h-[50px] rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center space-x-2 ${
                  hasSoldOutItem
                    ? "bg-buna/20 text-buna-mocha cursor-not-allowed"
                    : "bg-primary text-white hover:bg-primary-container"
                }`}
              >
                <span>
                  {selectedRail === "telebirr" && `Pay ${totalPayable} ETB via Telebirr`}
                  {selectedRail === "chapa" && `Pay ${totalPayable} ETB via Chapa`}
                  {selectedRail === "cbe" && `Pay ${totalPayable} ETB via CBE Direct`}
                  {selectedRail === "cash" && `Confirm Order for Table 04 (Cash)`}
                </span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
