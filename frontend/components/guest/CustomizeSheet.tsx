"use client";

import { useState } from "react";

interface Option {
  name_en: string;
  name_am: string;
  price_delta: number;
  type: string; // "addon" | "removal" | "variant"
}

interface ItemPayload {
  id: string;
  nameEN: string;
  nameAM: string;
  basePrice: number;
  options: Option[];
}

interface CustomizeSheetProps {
  isOpen: boolean;
  item: ItemPayload | null;
  lang: "en" | "am";
  onClose: () => void;
  onConfirm: (customizedItem: any) => void;
}

export default function CustomizeSheet({
  isOpen,
  item,
  lang,
  onClose,
  onConfirm,
}: CustomizeSheetProps) {
  const [selectedAddons, setSelectedAddons] = useState<Record<string, boolean>>({});
  const [selectedRemovals, setSelectedRemovals] = useState<Record<string, boolean>>({});
  const [selectedVariant, setSelectedVariant] = useState<string>("default");
  const [instructions, setInstructions] = useState("");

  if (!isOpen || !item) return null;

  // Calculate live item price with selected option deltas per FR-3
  let calculatedPrice = item.basePrice;
  Object.keys(selectedAddons).forEach((optName) => {
    if (selectedAddons[optName]) {
      const opt = item.options.find((o) => o.name_en === optName);
      if (opt) calculatedPrice += opt.price_delta;
    }
  });

  const handleAddonToggle = (nameEN: string) => {
    setSelectedAddons((prev) => ({ ...prev, [nameEN]: !prev[nameEN] }));
  };

  const handleRemovalToggle = (nameEN: string) => {
    setSelectedRemovals((prev) => ({ ...prev, [nameEN]: !prev[nameEN] }));
  };

  const handleSubmit = () => {
    onConfirm({
      item_id: item.id,
      name_en: item.nameEN,
      name_am: item.nameAM,
      final_price: calculatedPrice,
      selected_addons: selectedAddons,
      selected_removals: selectedRemovals,
      selected_variant: selectedVariant,
      special_instructions: instructions,
    });
    onClose();
  };

  // Default options fallback if item has none specified
  const addons = item.options.filter((o) => o.type === "addon");
  if (addons.length === 0) {
    addons.push(
      { name_en: "Extra Teff Injera", name_am: "ተጨማሪ እንጀራ", price_delta: 30, type: "addon" },
      { name_en: "Extra Nitir Qibe", name_am: "የተነጠረ ቅቤ", price_delta: 40, type: "addon" }
    );
  }

  const removals = [
    { name_en: "No Onions", name_am: "ሹንኩርት የሌለው", price_delta: 0, type: "removal" },
    { name_en: "No Jalapeños", name_am: "ቃሪያ የሌለው", price_delta: 0, type: "removal" },
  ];

  return (
    <div
      role="dialog"
      aria-expanded={isOpen}
      aria-controls="customize-sheet-modal"
      className="fixed inset-0 bg-buna/50 backdrop-blur-sm z-50 flex items-end justify-center"
    >
      <div
        id="customize-sheet-modal"
        className="bg-surface-container border-t border-buna/10 rounded-t-2xl max-w-md w-full p-5 space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom"
      >
        {/* Header */}
        <div className="flex justify-between items-start border-b border-buna/10 pb-3">
          <div>
            <h2 className="text-base font-bold text-buna">
              {lang === "am" ? "ቅመሞችና ተጨማሪዎችን ይምረጡ" : "Customize Order"}
            </h2>
            <span className="text-xs text-primary font-semibold">
              {item.nameEN} ({item.nameAM})
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-buna/10 flex items-center justify-center text-buna font-bold text-sm"
          >
            ✕
          </button>
        </div>

        {/* Add-ons Section */}
        <div className="space-y-2 text-left">
          <span className="text-xs font-bold text-buna-mocha uppercase tracking-wider block">
            {lang === "am" ? "ተጨማሪዎች (Add-ons)" : "Add-ons"}
          </span>
          <div className="space-y-2">
            {addons.map((opt) => (
              <label
                key={opt.name_en}
                className="flex items-center justify-between p-3 rounded-xl bg-white border border-buna/10 cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={!!selectedAddons[opt.name_en]}
                    onChange={() => handleAddonToggle(opt.name_en)}
                    className="w-4 h-4 text-primary rounded focus:ring-primary"
                  />
                  <span className="text-xs font-semibold text-buna">
                    {lang === "am" ? opt.name_am : opt.name_en}
                  </span>
                </div>
                <span className="text-xs font-bold text-primary">+{opt.price_delta} ETB</span>
              </label>
            ))}
          </div>
        </div>

        {/* Removals Section */}
        <div className="space-y-2 text-left">
          <span className="text-xs font-bold text-buna-mocha uppercase tracking-wider block">
            {lang === "am" ? "የሚቀነሱ (Removals)" : "Removals"}
          </span>
          <div className="space-y-2">
            {removals.map((opt) => (
              <label
                key={opt.name_en}
                className="flex items-center justify-between p-3 rounded-xl bg-white border border-buna/10 cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={!!selectedRemovals[opt.name_en]}
                    onChange={() => handleRemovalToggle(opt.name_en)}
                    className="w-4 h-4 text-primary rounded focus:ring-primary"
                  />
                  <span className="text-xs font-semibold text-buna">
                    {lang === "am" ? opt.name_am : opt.name_en}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Special Instructions */}
        <div className="space-y-1 text-left">
          <label className="block text-xs font-bold text-buna-mocha uppercase tracking-wider">
            {lang === "am" ? "ለማብሰያ ክፍሉ ልዩ ማስታወሻ" : "Special Kitchen Instructions"}
          </label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="e.g. Mild spice level, extra crispy injera edges..."
            className="w-full p-3 border border-buna/20 rounded-xl text-xs text-buna bg-white focus:outline-primary"
            rows={2}
          />
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full min-h-[48px] bg-primary text-white rounded-xl text-sm font-bold shadow-md hover:bg-primary-container transition-all flex items-center justify-center space-x-2"
          >
            <span>🛒</span>
            <span>Add to Tray • {calculatedPrice} ETB</span>
          </button>
        </div>
      </div>
    </div>
  );
}
