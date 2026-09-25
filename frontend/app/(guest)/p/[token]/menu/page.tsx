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
import OfflineBanner from "@/components/guest/OfflineBanner";
import QRErrorCard from "@/components/guest/QRErrorCard";
import { loadActiveTrayLocal, saveActiveTrayLocal } from "@/lib/offline-storage";

interface LandingProps {
  params: { token: string };
}

export default function TakeawayQRLandingPage({ params }: LandingProps) {
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
        label: "P04",
        type: "pickup",
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
    { id: "cat1", name_en: "Takeaway Platters", name_am: "የጥቅል ምግቦች" },
    { id: "cat2", name_en: "Drinks & Coffee", name_am: "መጠጦችና ቡና" },
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
    <div className="p-4 md:p-6 max-w-md md:max-w-4xl lg:max-w-6xl mx-auto space-y-5 relative pb-28">
      <OfflineBanner lang={lang} />

      <header className="flex justify-between items-center border-b border-buna/10 pb-3 pt-2">
        <HeaderPill label={resolved.label} type={resolved.type} />
        <LanguageToggle currentLang={lang} onChange={setLang} />
      </header>

      {/* Welcome Banner */}
      <div className="text-left bg-white p-4 md:p-6 rounded-2xl border border-buna/10 shadow-sm space-y-1">
        <span className="text-xs text-yetsom-container font-bold uppercase tracking-wider block">● Takeaway Express</span>
        <h1 className="text-base md:text-xl font-bold text-buna">
          {lang === "am" ? "የጥቅል ማዘዣ — ከካውንተሩ ይውሰዱ" : "Takeaway Ordering — Counter Pickup"}
        </h1>
        <p className="text-xs md:text-sm text-buna-mocha">
          {lang === "am" ? "ምግብዎን ይዘዙ፣ በቴሌብር/ቻፓ ይክፈሉ" : "Select your items and pay directly for fast counter pickup."}
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
      <div className="space-y-2">
        <div className="max-w-xl">
          <HeroDishCard
            id="item1"
            nameEN="Royal Beyaynetu Platter"
            nameAM="የፍስክ በያይነቱ"
            descriptionEN="Packed in thermal eco-container with three rolls of injera."
            descriptionAM="በጥንቃቄ የታሸገ የፍስክ በያይነቱ"
            price={650}
            prepTimeMinutes={15}
            isAvailable={true}
            allergenTags={["Takeaway Pack"]}
            lang={lang}
            onAddToCart={handleOpenCustomize}
          />
        </div>
      </div>

      {/* Responsive Grid for Compact Dish Cards */}
      <div className="space-y-3 pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        </div>
      </div>

      <CustomizeSheet
        isOpen={isCustomizeOpen}
        item={selectedItem}
        lang={lang}
        onClose={() => setIsCustomizeOpen(false)}
        onConfirm={handleConfirmCustomization}
      />

      <ActiveTrayDock
        itemCount={totalItemCount}
        totalPriceETB={totalPriceETB}
        onOpenTray={() => setIsTrayDrawerOpen(true)}
        onCheckout={handleCheckout}
      />

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
