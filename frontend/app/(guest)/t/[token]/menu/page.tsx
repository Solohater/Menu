"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CategoryChips from "@/components/guest/CategoryChips";
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

interface HeroDish {
  id: string;
  nameEN: string;
  nameAM: string;
  price: number;
  subtitleEN: string;
  subtitleAM: string;
  descriptionEN: string;
  descriptionAM: string;
  bgColor: string;
  badge: string;
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);

  // Hero Featured Dishes for the Carousel
  const heroDishes: HeroDish[] = [
    {
      id: "hero-1",
      nameEN: "Shekla Tibs",
      nameAM: "ሽክላ ጥብስ",
      price: 450,
      subtitleEN: "Injera, savory lamb",
      subtitleAM: "እንጀራ፣ የተጠበሰ የበግ ስጋ",
      descriptionEN: "Tender prime lamb seared sizzling in seasoned clay pot with rosemary, peppers & clarified spiced butter.",
      descriptionAM: "በሸክላ ድስት በተነጠረ ቅቤ፣ ሮዝመሪ እና ቃሪያ የተጠበሰ ጣፋጭ የበግ ጥብስ።",
      bgColor: "from-[#381a10] to-[#1e0e09]",
      badge: "Sizzling Clay Pot",
    },
    {
      id: "hero-2",
      nameEN: "Doro Wat",
      nameAM: "የዶሮ ወጥ",
      price: 520,
      subtitleEN: "Slow-cooked chicken, boiled egg",
      subtitleAM: "የተመረጠ ዶሮ፣ የተቀቀለ እንቁላል",
      descriptionEN: "Slow-simmered rich berbere chicken stew with hardboiled organic egg and pure teff injera.",
      descriptionAM: "በበርበሬና ቅቤ ተለስልሶ የተሰራ የዶሮ ወጥ ከእንቁላል ጋር።",
      bgColor: "from-[#4a1208] to-[#260904]",
      badge: "Traditional Classic",
    },
    {
      id: "hero-3",
      nameEN: "Royal Beyaynetu",
      nameAM: "የፍስክ በያይነቱ",
      price: 420,
      subtitleEN: "Fasting vegetable platter, teff injera",
      subtitleAM: "የጾም አታክልት፣ ንጹህ የጤፍ እንጀራ",
      descriptionEN: "A vibrant sampler of gomen, misir, kik alicha, and beetroot served on giant teff injera.",
      descriptionAM: "ጎመን፣ ምስር፣ ክክ አልጫ እና ቀይ ስር በጤፍ እንጀራ የቀረበ።",
      bgColor: "from-[#1c2e17] to-[#0d170a]",
      badge: "Ye'Tsom / የጾም",
    },
  ];

  const currentHero = heroDishes[heroIndex];

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
    <div className="min-h-screen bg-[#fff8f5] text-buna font-sans relative pb-28">
      <OfflineBanner lang={lang} />

      {/* Sticky Top Bar matching Mobile Phone UI */}
      <header className="sticky top-0 z-40 bg-[#fff8f5]/95 backdrop-blur-md border-b border-[#ebdcd3]/70 px-4 py-3 flex items-center justify-between">
        {/* Brand Logo with steaming Jebena */}
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.5 7.5c-.83 0-1.5.67-1.5 1.5v1.09C15.86 8.94 14.04 8 12 8c-3.87 0-7 3.13-7 7v1c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-1c0-.34-.04-.67-.1-1h.1c1.38 0 2.5-1.12 2.5-2.5s-1.12-2.5-2.5-2.5h-.5v-1c0-.83-.67-1.5-1.5-1.5zm-3.5 10.5H9c-1.1 0-2-.9-2-2v-1c0-2.76 2.24-5 5-5s5 2.24 5 5v1c0 1.1-.9 2-2 2zM12 2c-.55 0-1 .45-1 1v2.08C11.33 5.03 11.66 5 12 5s.67.03 1 .08V3c0-.55-.45-1-1-1z" />
            </svg>
          </div>
          <span className="font-black text-lg tracking-wider text-buna">MENUFLOW</span>
        </div>

        {/* Table Badge & Hamburger Menu Drawer */}
        <div className="flex items-center space-x-2">
          <span className="bg-[#ebdcd3] text-primary text-[11px] font-extrabold px-2.5 py-1 rounded-full">
            Table {resolved.label}
          </span>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-9 h-9 rounded-xl border border-[#ebdcd3] bg-white flex items-center justify-center text-buna shadow-sm hover:bg-[#faf2ee] transition-colors"
            aria-label="Open navigation menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Hamburger Drawer Modal */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="w-72 bg-[#fff8f5] h-full p-6 shadow-2xl flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-[#ebdcd3] pb-3">
                <span className="font-black text-lg text-buna">Menu Options</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#ebdcd3] flex items-center justify-center text-buna font-bold text-sm"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-sm font-bold text-buna">
                <div className="p-3 bg-white rounded-2xl border border-[#ebdcd3] space-y-1">
                  <span className="text-[10px] text-buna-mocha uppercase font-bold">Seated Location</span>
                  <p className="text-base font-black text-primary">Table {resolved.label}</p>
                  <p className="text-xs text-buna-mocha">{resolved.restaurant_name}</p>
                </div>

                <button
                  onClick={() => {
                    alert("Bell rang! A waiter has been dispatched to Table " + resolved.label);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3 bg-[#faf2ee] hover:bg-[#ebdcd3] rounded-2xl text-left px-4 flex items-center justify-between text-buna transition-colors"
                >
                  <span>🛎️ Call Waiter</span>
                  <span className="text-xs text-primary font-bold">Ring →</span>
                </button>

                <button
                  onClick={() => {
                    alert("Bill requested! Cashier notified for Table " + resolved.label);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3 bg-[#faf2ee] hover:bg-[#ebdcd3] rounded-2xl text-left px-4 flex items-center justify-between text-buna transition-colors"
                >
                  <span>🧾 Request Bill</span>
                  <span className="text-xs text-primary font-bold">Alert →</span>
                </button>

                <Link
                  href="/admin"
                  className="w-full py-3 bg-[#faf2ee] hover:bg-[#ebdcd3] rounded-2xl text-left px-4 flex items-center justify-between text-buna transition-colors block"
                >
                  <span>💼 Staff Admin Portal</span>
                  <span className="text-xs text-primary font-bold">Open →</span>
                </Link>
              </div>
            </div>

            <div className="text-center text-[11px] text-buna-mocha">
              MenuFlow Ethiopia • Addis Ababa
            </div>
          </div>
        </div>
      )}

      {/* Main Mobile Hero Showcase Container */}
      <main className="max-w-md mx-auto px-4 pt-3 space-y-5">
        {/* =================================================================== */}
        {/* HERO DISH SHOWCASE CAROUSEL (Directly matching user image)         */}
        {/* =================================================================== */}
        <section className="bg-white rounded-3xl overflow-hidden border border-[#ebdcd3] shadow-md relative">
          {/* Sizzling Dish Visual Header */}
          <div className={`relative h-64 sm:h-72 bg-gradient-to-br ${currentHero.bgColor} flex items-center justify-center overflow-hidden`}>
            {/* Visual Food Illustration / Presentation */}
            <div className="relative text-center select-none transform transition-transform duration-300">
              {/* Steaming Clay Pot Graphical Mockup */}
              <div className="relative w-44 h-44 mx-auto rounded-full bg-gradient-to-b from-[#8c3b1b] to-[#451808] border-4 border-[#331408] shadow-2xl flex items-center justify-center p-3">
                {/* Food Texture & Elements */}
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#2d1208] via-[#4d200e] to-[#6e2a10] flex flex-col items-center justify-center text-center p-2">
                  <span className="text-5xl block animate-bounce">
                    {heroIndex === 0 ? "🥩" : heroIndex === 1 ? "🍗" : "🍲"}
                  </span>
                  <span className="text-[11px] font-extrabold text-[#ffb598] tracking-wider uppercase mt-1">
                    {currentHero.badge}
                  </span>
                </div>

                {/* Steam Rising Emulation */}
                <div className="absolute -top-3 flex space-x-1 text-white/50 text-xs font-serif animate-pulse">
                  <span>~</span>
                  <span>~</span>
                  <span>~</span>
                </div>
              </div>

              {/* Wooden Serving Platter Base */}
              <div className="w-52 h-4 mx-auto bg-[#2b170c] rounded-full mt-2 shadow-lg border-t border-[#4a2817]" />
            </div>

            {/* Carousel Swipe Controls */}
            <button
              onClick={() => setHeroIndex((prev) => (prev === 0 ? heroDishes.length - 1 : prev - 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center text-sm font-bold backdrop-blur-sm hover:bg-black/60 transition-colors"
              aria-label="Previous dish"
            >
              ‹
            </button>
            <button
              onClick={() => setHeroIndex((prev) => (prev === heroDishes.length - 1 ? 0 : prev + 1))}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center text-sm font-bold backdrop-blur-sm hover:bg-black/60 transition-colors"
              aria-label="Next dish"
            >
              ›
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5 z-10">
              {heroDishes.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setHeroIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                    heroIndex === idx
                      ? "bg-white scale-125 shadow-sm"
                      : "bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Dish Information & ORDER NOW CTA (Matching reference layout) */}
          <div className="p-6 space-y-4 text-center">
            {/* Big Tactile ORDER NOW Terracotta Button */}
            <button
              type="button"
              onClick={() =>
                handleOpenCustomize({
                  id: currentHero.id,
                  nameEN: currentHero.nameEN,
                  nameAM: currentHero.nameAM,
                  basePrice: currentHero.price,
                  descriptionEN: currentHero.descriptionEN,
                  descriptionAM: currentHero.descriptionAM,
                  options: [
                    { name_en: "Extra Teff Injera", name_am: "ተጨማሪ የጤፍ እንጀራ", price_delta: 30, type: "addon" },
                    { name_en: "Extra Spiced Butter (ቅቤ)", name_am: "ተጨማሪ የተነጠረ ቅቤ", price_delta: 40, type: "addon" },
                    { name_en: "Extra Ayib Cheese", name_am: "ተጨማሪ አይብ", price_delta: 35, type: "addon" },
                  ],
                })
              }
              className="w-full py-4 px-6 bg-gradient-to-r from-[#9d3e0f] to-[#bd5627] hover:from-[#88350d] hover:to-[#a84c22] text-white text-lg font-black tracking-wider uppercase rounded-2xl shadow-lg transition-all transform active:scale-95 flex items-center justify-center space-x-2"
            >
              <span>ORDER NOW</span>
            </button>

            {/* Title, Subtitle & Amharic Ge'ez Script */}
            <div className="space-y-1 pt-1">
              <h2 className="text-2xl font-black text-buna tracking-tight">
                {lang === "am" ? `${currentHero.nameAM}፡ ${currentHero.price} ብር` : `${currentHero.nameEN}: Birr ${currentHero.price}`}
              </h2>
              <p className="text-sm font-semibold text-buna-mocha">
                {lang === "am" ? currentHero.subtitleAM : currentHero.subtitleEN}
              </p>
              <p className="text-lg font-bold text-buna gees-text pt-0.5" lang="am">
                {currentHero.nameAM}
              </p>
            </div>
          </div>
        </section>

        {/* Bilingual Language Switcher Pill (Matching image at bottom) */}
        <div className="flex justify-center pt-1">
          <div className="inline-flex items-center bg-[#ebdcd3]/70 backdrop-blur-md rounded-full p-1 shadow-sm border border-[#ebdcd3]">
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`px-4 py-1.5 rounded-full text-xs font-black transition-all duration-200 ${
                lang === "en"
                  ? "bg-primary text-white shadow-sm"
                  : "text-buna-mocha hover:text-buna"
              }`}
            >
              EN
            </button>
            <span className="text-xs text-buna-mocha font-bold px-1.5">/</span>
            <button
              type="button"
              onClick={() => setLang("am")}
              lang="am"
              className={`px-4 py-1.5 rounded-full text-xs font-black gees-text transition-all duration-200 ${
                lang === "am"
                  ? "bg-primary text-white shadow-sm"
                  : "text-buna-mocha hover:text-buna"
              }`}
            >
              አማ
            </button>
          </div>
        </div>

        {/* =================================================================== */}
        {/* FULL MENU BROWSER (Category Chips & Compact Dish Cards)             */}
        {/* =================================================================== */}
        <section className="space-y-4 pt-3">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-sm font-black text-buna uppercase tracking-wider">
              {lang === "am" ? "የሙሉ ሜኑ ዝርዝር" : "Explore Full Menu"}
            </h3>
            <span className="text-xs text-primary font-bold">Bole Kitchen</span>
          </div>

          {/* Category Chips Bar */}
          <CategoryChips
            categories={categories}
            activeCategoryId={activeCategoryId}
            onSelectCategory={setActiveCategoryId}
            lang={lang}
          />

          {/* Compact Dishes Grid */}
          <div className="space-y-3">
            <CompactDishCard
              id="item2"
              nameEN="Special Sizzling Shekla Tibs"
              nameAM="የሸክላ ጥብስ"
              descriptionEN="Prime tender lamb/beef seared with rosemary & peppers"
              descriptionAM="በተነጠረ ቅቤና ሮዝመሪ የተጠበሰ"
              price={450}
              isAvailable={true}
              lang={lang}
              onAddToCart={handleOpenCustomize}
            />
            <CompactDishCard
              id="item3"
              nameEN="Traditional Jebena Buna"
              nameAM="የጀበና ቡና ሥነ ሥርዓት"
              descriptionEN="Fresh clay-pot wood roasted Ethiopian buna ceremony"
              descriptionAM="በእንጨት እሳት የተቆላ የጀበና ቡና"
              price={60}
              isAvailable={true}
              lang={lang}
              onAddToCart={handleOpenCustomize}
            />
            <CompactDishCard
              id="item4"
              nameEN="Special Bozena Shiro"
              nameAM="ቦዘና ሽሮ"
              descriptionEN="Slow-simmered spiced chickpea stew with tender meat"
              descriptionAM="በጥንቃቄ የተቀቀለ ቦዘና ሽሮ"
              price={320}
              isAvailable={true}
              lang={lang}
              onAddToCart={handleOpenCustomize}
            />
          </div>
        </section>
      </main>

      {/* Slide-Up Customization Bottom Drawer */}
      <CustomizeSheet
        isOpen={isCustomizeOpen}
        item={selectedItem}
        lang={lang}
        onClose={() => setIsCustomizeOpen(false)}
        onConfirm={handleConfirmCustomization}
      />

      {/* Floating Active Tray Dock Capsule */}
      <ActiveTrayDock
        itemCount={totalItemCount}
        totalPriceETB={totalPriceETB}
        onOpenTray={() => setIsTrayDrawerOpen(true)}
        onCheckout={handleCheckout}
      />

      {/* Active Tray Full Drawer */}
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
