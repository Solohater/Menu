"use client";

interface CompactDishCardProps {
  id: string;
  nameEN: string;
  nameAM: string;
  descriptionEN: string;
  descriptionAM: string;
  price: number;
  isAvailable: boolean;
  lang: "en" | "am";
  onAddToCart: (item: any) => void;
}

export default function CompactDishCard({
  id,
  nameEN,
  nameAM,
  descriptionEN,
  descriptionAM,
  price,
  isAvailable,
  lang,
  onAddToCart,
}: CompactDishCardProps) {
  const handleTap = () => {
    if (!isAvailable) return;
    onAddToCart({
      id,
      nameEN,
      nameAM,
      basePrice: price,
      options: [
        { name_en: "Extra Injera", name_am: "ተጨማሪ እንጀራ", price_delta: 30, type: "addon" },
      ],
    });
  };

  return (
    <div
      onClick={handleTap}
      className="bg-white rounded-xl border border-buna/10 p-3 shadow-sm flex items-center justify-between space-x-3 cursor-pointer hover:shadow-md transition-all"
    >
      {/* Left Info */}
      <div className="space-y-1 flex-1 text-left">
        <div className="flex items-baseline space-x-2">
          <h4 className="text-sm font-bold text-buna">{nameEN}</h4>
          <span className="text-xs text-primary font-semibold gees-text" lang="am">
            ({nameAM})
          </span>
        </div>
        <p className="text-xs text-buna-mocha line-clamp-2">
          {lang === "am" ? descriptionAM : descriptionEN}
        </p>
        <div className="flex items-center space-x-2 pt-1">
          <span className="text-sm font-bold text-primary">ETB {price}</span>
        </div>
      </div>

      {/* Right Thumbnail & Action */}
      <div className="flex flex-col items-center space-y-2">
        <div className="w-20 h-20 rounded-lg bg-buna/80 flex items-center justify-center text-white text-xs font-bold shadow-inner">
          [PHOTO]
        </div>
        {isAvailable ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleTap();
            }}
            className="min-h-[36px] px-3 py-1 bg-primary text-white text-xs font-bold rounded-lg shadow-sm hover:bg-primary-container"
          >
            + Add
          </button>
        ) : (
          <span className="text-[10px] text-red-600 font-bold bg-red-50 px-2 py-1 rounded">
            Sold Out
          </span>
        )}
      </div>
    </div>
  );
}
