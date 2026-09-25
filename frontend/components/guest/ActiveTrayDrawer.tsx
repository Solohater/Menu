"use client";

import QuantityStepper from "./QuantityStepper";

interface TrayItem {
  id: string;
  name_en: string;
  name_am: string;
  final_price: number;
  quantity: number;
  selected_options?: Record<string, boolean>;
  special_instructions?: string;
}

interface ActiveTrayDrawerProps {
  isOpen: boolean;
  items: TrayItem[];
  totalPriceETB: number;
  lang: "en" | "am";
  onClose: () => void;
  onUpdateQuantity: (id: string, newQty: number) => void;
  onCheckout: () => void;
}

export default function ActiveTrayDrawer({
  isOpen,
  items,
  totalPriceETB,
  lang,
  onClose,
  onUpdateQuantity,
  onCheckout,
}: ActiveTrayDrawerProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-expanded={isOpen}
      className="fixed inset-0 bg-buna/50 backdrop-blur-sm z-50 flex items-end justify-center"
    >
      <div className="bg-white rounded-t-2xl border-t border-buna/10 max-w-md w-full p-5 space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-buna/10 pb-3">
          <div>
            <h2 className="text-base font-bold text-buna">
              {lang === "am" ? "የተመረጡ ምግቦች ዝርዝር" : "Active Tray Review"}
            </h2>
            <span className="text-xs text-buna-mocha">Dine-in Table Tray</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-teff border border-buna/10 flex items-center justify-center text-buna font-bold text-sm"
          >
            ✕
          </button>
        </div>

        {/* Item List */}
        <div className="divide-y divide-buna/10">
          {items.length === 0 ? (
            <p className="text-xs text-buna-mocha py-6 text-center">Your Active Tray is currently empty.</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="py-3 flex justify-between items-center space-x-3">
                <div className="space-y-1 text-left flex-1">
                  <div className="flex items-baseline space-x-2">
                    <h4 className="text-sm font-bold text-buna">{item.name_en}</h4>
                    <span className="text-xs text-primary font-semibold gees-text" lang="am">
                      ({item.name_am})
                    </span>
                  </div>
                  {item.special_instructions && (
                    <p className="text-xs text-buna-mocha italic">Note: "{item.special_instructions}"</p>
                  )}
                  <span className="text-xs font-bold text-primary block">
                    ETB {item.final_price * item.quantity}
                  </span>
                </div>

                <QuantityStepper
                  quantity={item.quantity}
                  onIncrement={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  onDecrement={() => onUpdateQuantity(item.id, item.quantity - 1)}
                />
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {items.length > 0 && (
          <div className="border-t border-buna/10 pt-3 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase font-bold text-buna-mocha">Total Subtotal</span>
              <span className="text-lg font-bold text-primary">ETB {totalPriceETB}</span>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onCheckout();
              }}
              className="w-full min-h-[48px] bg-primary text-white rounded-xl text-sm font-bold shadow-md hover:bg-primary-container transition-all flex items-center justify-center space-x-2"
            >
              <span>Proceed to Checkout</span>
              <span>→</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
