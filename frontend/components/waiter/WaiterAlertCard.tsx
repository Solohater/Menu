"use client";

interface WaiterAlertCardProps {
  id: string;
  orderRef: string;
  tableLabel: string;
  itemsSummary: string[];
  readyAt: string;
  onDeliver: (id: string) => void;
}

export default function WaiterAlertCard({
  id,
  orderRef,
  tableLabel,
  itemsSummary,
  readyAt,
  onDeliver,
}: WaiterAlertCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 border-l-8 border-l-yetsom-container border-y border-r border-buna/10 shadow-md text-left space-y-4">
      {/* Alert Header */}
      <div className="flex justify-between items-center border-b border-buna/10 pb-3">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-yetsom-container block">
            ● READY FOR DELIVERY
          </span>
          <h3 className="text-xl font-black text-buna">{tableLabel}</h3>
        </div>
        <div className="text-right">
          <span className="text-xs text-buna-mocha font-mono block">Ref: {orderRef}</span>
          <span className="text-[10px] text-buna-mocha block">{readyAt}</span>
        </div>
      </div>

      {/* Item Summary */}
      <div className="space-y-1">
        <span className="text-xs font-bold text-buna-mocha uppercase block">Items to Deliver:</span>
        <ul className="text-sm font-semibold text-buna space-y-1 list-disc pl-4">
          {itemsSummary.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Deliver Action Button */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => onDeliver(id)}
          className="w-full min-h-[48px] bg-primary text-white rounded-xl text-sm font-bold shadow-md hover:bg-primary-container transition-all flex items-center justify-center space-x-2"
        >
          <span>🚚</span>
          <span>Mark Delivered to Table</span>
        </button>
      </div>
    </div>
  );
}
