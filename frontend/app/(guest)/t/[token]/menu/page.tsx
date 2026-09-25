"use client";

import { useEffect, useState } from "react";
import HeaderPill from "@/components/guest/HeaderPill";
import LanguageToggle from "@/components/guest/LanguageToggle";
import CategoryChips from "@/components/guest/CategoryChips";
import HeroDishCard from "@/components/guest/HeroDishCard";
import CompactDishCard from "@/components/guest/CompactDishCard";
import CustomizeSheet from "@/components/guest/CustomizeSheet";
import ActiveTrayDock from "@/components/guest/ActiveTrayDock";
import ActiveTrayDrawer from "@/components/guest/ActiveTrayDrawer";
import QuantityStepper from "@/components/guest/QuantityStepper";
import OfflineBanner from "@/components/guest/OfflineBanner";
import QRErrorCard from "@/components/guest/QRErrorCard";
import { loadActiveTrayLocal, saveActiveTrayLocal } from "@/lib/offline-storage";

interface LandingProps {
  params: { token: string };
}

export default function TableQRLandingPage({ params }: LandingProps) {
  const [resolved, setResolved] = useState<any>(null);
  const [isError, setIsError] = useState(false);
  const [lang, setLang] = useState<"en" | "am">("en");
  const [activeCategoryId, setActiveCategoryId] = useState("all");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [isTrayDrawerOpen, setIsTrayDrawerOpen] = useState(false);
  const [trayItems, setTrayItems] = useState<any[]>([]);

  useEffect(() => {
    if (params.token.includes("invalid")) {
      setIsError(true);
    } else {
      setResolved({
        restaurant_name: "Habesha Gourmet Cafe",
        label: "04",
        type: "table",
      });
      const savedTray = loadActiveTrayLocal(params.token);
      if (savedTray && savedTray.length > 0) {
        setTrayItems(savedTray);
      }
    }
  }, [params.token]);

  useEffect(() => {
    if (params.token && !isError) {
      saveActiveTrayLocal(params.token, trayItems);
    }
  }, [trayItems, params.token, isError]);

  const categories = [
    { id: "cat1", name_en: "Traditional Meals", name_am: "የባህል ምግቦች" },
    { id: "cat2", name_en: "Clay Pot Delicacies", name_am: "የሸክላ ጥብስ" },
    { id: "cat3", name_en: "Coffee & Drinks", name_am: "ቡናና መጠጦች" },
  ];

  const handleOpenCustomize = (item: any) => {
    setSelectedItem(item);
    setIsCustomizeOpen(true);
  };

  const handleConfirmCustomization = (customizedItem: any) => {
    setTrayItems((prev) => {
      const existing = prev.find((i) => i.item_id === customizedItem.item_id);
      if (existing) {
        return prev.map((i) =>
          i.item_id === customizedItem.item_id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...customizedItem, id: `tray-${Date.now()}`, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      setTrayItems((prev) => prev.filter((i) => i.id !== id));
    } else {
      setTrayItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity: newQty } : i))
      );
    }
  };

  const totalItemCount = trayItems.reduce((acc, i) => acc + i.quantity, 0);
  const totalPriceETB = trayItems.reduce((acc, i) => acc + i.final_price * i.quantity, 0);

  const handleCheckout = () => {
    window.location.href = "/checkout";
  };

  if (isError) return <QRErrorCard />;
  if (!resolved) return <div className="p-6 text-center text-xs text-buna">Loading menu...</div>;

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 relative pb-28">
      <OfflineBanner lang={lang} />

      <header className="flex justify-between items-center border-b border-buna/10 pb-4 pt-2">
        <div className="flex items-center space-x-3">
          <span className="font-bold text-lg text-buna">{resolved.restaurant_name}</span>
          <HeaderPill label={resolved.label} type={resolved.type} />
        </div>
        <LanguageToggle currentLang={lang} onChange={setLang} />
      </header>

      {/* Main Desktop & Tablet 2-Column Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (70% width on Desktop): Menu Browsing */}
        <div className="lg:col-span-8 space-y-6">
          {/* Welcome Banner */}
          <div className="text-left bg-white p-5 md:p-6 rounded-2xl border border-buna/10 shadow-sm space-y-1">
            <span className="text-xs text-yetsom-container font-bold uppercase tracking-wider block">● Kitchen Open</span>
            <h1 className="text-lg md:text-2xl font-bold text-buna">
              {lang === "am" ? "እንኳን ደህና መጡ — የባህል ጣዕም" : "Welcome to Habesha Gourmet Cafe"}
            </h1>
            <p className="text-xs md:text-sm text-buna-mocha">
              {lang === "am" ? "ረቡዕና አርብ የጾም ምግቦች ዝግጁ ናቸው" : "Wednesday & Friday Fasting (Ye'Tsom) specials active today."}
            </p>
          </div>

          {/* Category Chips Bar */}
          <CategoryChips
            categories={categories}
            activeCategoryId={activeCategoryId}
            onSelectCategory={setActiveCategoryId}
            lang={lang}
          />

          {/* Hero Featured Dish */}
          <div className="space-y-2 text-left">
            <h2 className="text-xs md:text-sm font-bold text-buna-mocha uppercase tracking-wider">
              {lang === "am" ? "የቀኑ ልዩ ምርጥ" : "Chef's Featured Dish"}
            </h2>
            <HeroDishCard
              id="item1"
              nameEN="Royal Beyaynetu Platter"
              nameAM="የፍስክ በያይነቱ"
              descriptionEN="Served with three rolls of pure organic brown teff injera and spicy stews."
              descriptionAM="በንጹህ የሐበሻ ጤፍ እንጀራ የቀረበ"
              price={650}
              prepTimeMinutes={15}
              isAvailable={true}
              allergenTags={["Vegan Option"]}
              lang={lang}
              onAddToCart={handleOpenCustomize}
            />
          </div>

          {/* Responsive Dish Grid (1-col mobile, 2-col tablet/desktop) */}
          <div className="space-y-3 pt-2 text-left">
            <h3 className="text-xs md:text-sm font-bold text-buna-mocha uppercase tracking-wider">
              {lang === "am" ? "የሸክላ ምግቦችና ቡና" : "Clay Pot Stews & Coffee"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CompactDishCard
                id="item2"
                nameEN="Special Sizzling Shekla Tibs"
                nameAM="የሸክላ ጥብስ"
                descriptionEN="Tender prime beef seared in seasoned clarified butter"
                descriptionAM="በተነጠረ ለዛ ባለው ቅቤ የተጠበሰ"
                price={480}
                isAvailable={true}
                lang={lang}
                onAddToCart={handleOpenCustomize}
              />
              <CompactDishCard
                id="item3"
                nameEN="Traditional Jebena Buna"
                nameAM="የጀበና ቡና ሥነ ሥርዓት"
                descriptionEN="Fresh wood-roasted Buna ceremony coffee"
                descriptionAM="በእንጨት እሳት የተቆላ የጀበና ቡና"
                price={120}
                isAvailable={true}
                lang={lang}
                onAddToCart={handleOpenCustomize}
              />
              <CompactDishCard
                id="item4"
                nameEN="Special Bozena Shiro"
                nameAM="ቦዘና ሽሮ"
                descriptionEN="Slow-cooked spiced chickpea stew with tender beef chunks"
                descriptionAM="በጥንቃቄ የተቀቀለ ቦዘና ሽሮ"
                price={320}
                isAvailable={true}
                lang={lang}
                onAddToCart={handleOpenCustomize}
              />
            </div>
          </div>
        </div>

        {/* Right Column (30% width on Desktop): Permanent Active Tray Sidebar (Hidden on mobile < lg) */}
        <div className="hidden lg:block lg:col-span-4 sticky top-6">
          <div className="bg-white rounded-2xl border border-buna/10 p-6 shadow-md space-y-4 text-left">
            <div className="flex justify-between items-center border-b border-buna/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-buna">Active Tray</h3>
                <span className="text-xs text-buna-mocha">Table 04 Order Summary</span>
              </div>
              <span className="bg-primary-fixed text-primary text-xs font-bold px-2.5 py-1 rounded-full">
                {totalItemCount} {totalItemCount === 1 ? "item" : "items"}
              </span>
            </div>

            <div className="divide-y divide-buna/10 max-h-96 overflow-y-auto">
              {trayItems.length === 0 ? (
                <div className="py-8 text-center text-buna-mocha text-xs space-y-1">
                  <span className="text-2xl block">🛒</span>
                  <p>Your Active Tray is currently empty.</p>
                  <p className="text-[11px] text-buna-mocha/70">Click + Add on any dish to build your order.</p>
                </div>
              ) : (
                trayItems.map((item) => (
                  <div key={item.id} className="py-3 flex justify-between items-center space-x-2">
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-baseline space-x-1.5">
                        <span className="text-xs font-bold text-buna">{item.name_en}</span>
                        <span className="text-[11px] text-primary gees-text" lang="am">({item.name_am})</span>
                      </div>
                      {item.special_instructions && (
                        <span className="text-[10px] text-buna-mocha italic block">Note: "{item.special_instructions}"</span>
                      )}
                      <span className="text-xs font-bold text-primary block">ETB {item.final_price * item.quantity}</span>
                    </div>

                    <QuantityStepper
                      quantity={item.quantity}
                      onIncrement={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      onDecrement={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    />
                  </div>
                ))
              )}
            </div>

            {trayItems.length > 0 && (
              <div className="border-t border-buna/10 pt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-buna-mocha uppercase">Subtotal</span>
                  <span className="text-lg font-bold text-primary">ETB {totalPriceETB}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full min-h-[48px] bg-primary text-white rounded-xl text-sm font-bold shadow-md hover:bg-primary-container transition-all flex items-center justify-center space-x-2"
                >
                  <span>Proceed to Checkout</span>
                  <span>→</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <CustomizeSheet
        isOpen={isCustomizeOpen}
        item={selectedItem}
        lang={lang}
        onClose={() => setIsCustomizeOpen(false)}
        onConfirm={handleConfirmCustomization}
      />

      {/* Mobile Floating Bottom Dock (Hidden on desktop lg:hidden) */}
      <div className="lg:hidden">
        <ActiveTrayDock
          itemCount={totalItemCount}
          totalPriceETB={totalPriceETB}
          onOpenTray={() => setIsTrayDrawerOpen(true)}
          onCheckout={handleCheckout}
        />
      </div>

      <ActiveTrayDrawer
        isOpen={isTrayDrawerOpen}
        items={trayItems}
        totalPriceETB={totalPriceETB}
        lang={lang}
        onClose={() => setIsTrayDrawerOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onCheckout={handleCheckout}
      />
    </div>
  );
}
