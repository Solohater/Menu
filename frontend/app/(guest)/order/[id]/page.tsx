"use client";

import { useEffect, useState } from "react";
import HeaderPill from "@/components/guest/HeaderPill";
import PickupAlarmModal from "@/components/guest/PickupAlarmModal";

interface OrderStatusPageProps {
  params: { id: string };
}

export default function GuestOrderStatusPage({ params }: OrderStatusPageProps) {
  const [order, setOrder] = useState<any>({
    id: params.id || "01J8ORD100",
    orderRef: "MF-8942-T4",
    status: "Preparing",
    paymentStatus: "paid",
    totalAmount: 1012,
    estimatedWaitMins: 12,
    items: [
      { name_en: "Special Sizzling Shekla Tibs", name_am: "የሸክላ ጥብስ", quantity: 1, price: 480 },
      { name_en: "Traditional Jebena Buna", name_am: "የጀበና ቡና ሥነ ሥርዓት", quantity: 2, price: 240 },
    ],
  });

  const [isPickupAlarmOpen, setIsPickupAlarmOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOrder((prev: any) => ({ ...prev, status: "Ready" }));
      setIsPickupAlarmOpen(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleConfirmPickedUp = () => {
    setIsPickupAlarmOpen(false);
    setOrder((prev: any) => ({ ...prev, status: "Closed" }));
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto min-h-screen bg-teff space-y-6 text-left pb-20">
      <header className="flex justify-between items-center border-b border-buna/10 pb-4">
        <div>
          <h1 className="text-xl font-bold text-buna">Order Live Status Tracker</h1>
          <span className="text-xs text-buna-mocha font-mono">Ref: {order.orderRef}</span>
        </div>
        <HeaderPill label="04" type="table" />
      </header>

      {/* 2-Column Desktop Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Status Timeline & Wait Time */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white rounded-2xl p-6 border border-buna/10 shadow-sm space-y-5">
            <div className="flex justify-between items-center border-b border-buna/10 pb-4">
              <span className="text-xs font-bold text-buna-mocha uppercase tracking-wider">Status Tracker</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  order.status === "Closed"
                    ? "bg-buna/20 text-buna"
                    : order.status === "Ready"
                    ? "bg-yetsom-container text-white animate-pulse"
                    : "bg-primary-fixed text-primary"
                }`}
              >
                {order.status === "Preparing" && "Preparing… (በዝግጅት ላይ…)"}
                {order.status === "Ready" && "Ready — Please pick up!"}
                {order.status === "Closed" && "Order Completed"}
              </span>
            </div>

            {order.status !== "Closed" && (
              <div className="bg-teff p-4 rounded-xl flex justify-between items-center border border-buna/10">
                <span className="text-xs text-buna-mocha font-semibold">Estimated Wait Time:</span>
                <span className="text-base font-bold text-primary">{order.estimatedWaitMins} mins</span>
              </div>
            )}

            <div className="space-y-3 text-xs text-buna pt-2">
              <div className="flex items-center space-x-3">
                <span className="w-3 h-3 rounded-full bg-yetsom-container" />
                <span className="font-semibold">Payment Confirmed ({order.totalAmount} ETB)</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`w-3 h-3 rounded-full ${order.status !== 'Payment Confirmed' ? 'bg-yetsom-container' : 'bg-buna/20'}`} />
                <span className="font-semibold">Order Received at Kitchen Pass</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`w-3 h-3 rounded-full ${order.status === 'Ready' || order.status === 'Closed' ? 'bg-yetsom-container' : 'bg-buna/20'}`} />
                <span className="font-semibold">Food Ready Signal Emitted</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Order Receipt Summary */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-2xl p-6 border border-buna/10 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-buna-mocha uppercase tracking-wider border-b border-buna/10 pb-2">
              Order Items Summary
            </h3>
            <div className="divide-y divide-buna/10">
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className="py-2.5 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-buna block">{item.name_en}</span>
                    <span className="text-[10px] text-primary gees-text block" lang="am">({item.name_am}) × {item.quantity}</span>
                  </div>
                  <span className="font-bold text-primary">ETB {item.price}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-buna/10 pt-3 flex justify-between items-center text-sm font-bold">
              <span>Total Amount Paid</span>
              <span className="text-primary">ETB {order.totalAmount}</span>
            </div>
          </div>
        </div>
      </div>

      <PickupAlarmModal
        isOpen={isPickupAlarmOpen}
        orderRef={order.orderRef}
        onPickedUp={handleConfirmPickedUp}
      />
    </div>
  );
}
