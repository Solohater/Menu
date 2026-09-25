"use client";

import { useEffect, useState } from "react";

interface BestSeller {
  name_en: string;
  name_am: string;
  units_sold: number;
  total_etb: number;
}

interface ProviderReconciliation {
  provider: string;
  total_orders: number;
  total_amount: number;
  status: string;
}

interface SalesSummary {
  total_sales_etb: number;
  total_orders: number;
  average_order_value_etb: number;
  best_sellers: BestSeller[];
  provider_totals: ProviderReconciliation[];
}

export default function AdminOrdersPage() {
  const [summary, setSummary] = useState<SalesSummary | null>(null);

  useEffect(() => {
    // Initial mock sales summary load
    setSummary({
      total_sales_etb: 125400,
      total_orders: 142,
      average_order_value_etb: 883.1,
      best_sellers: [
        { name_en: "Special Sizzling Shekla Tibs", name_am: "የሸክላ ጥብስ", units_sold: 88, total_etb: 42240 },
        { name_en: "Royal Beyaynetu Platter", name_am: "የፍስክ በያይነቱ", units_sold: 64, total_etb: 41600 },
        { name_en: "Traditional Jebena Buna", name_am: "የጀበና ቡና ሥነ ሥርዓት", units_sold: 120, total_etb: 14400 },
      ],
      provider_totals: [
        { provider: "Telebirr (ቴሌብር)", total_orders: 68, total_amount: 60112, status: "reconciled" },
        { provider: "Chapa Gateway (ቻፓ)", total_orders: 42, total_amount: 37086, status: "reconciled" },
        { provider: "CBE Direct (ንግድ ባንክ)", total_orders: 18, total_amount: 15890, status: "reconciled" },
        { provider: "Cash at Counter (በጥሬ ገንዘብ)", total_orders: 14, total_amount: 12312, status: "reconciled" },
      ],
    });
  }, []);

  if (!summary) return <div className="p-6 text-buna">Loading sales summary analytics...</div>;

  return (
    <div className="space-y-6 text-left">
      <header className="border-b border-buna/20 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Sales Analytics & Order History</h1>
          <p className="text-sm text-buna-mocha">Best sellers, peak hours, average order value, and provider payment reconciliation.</p>
        </div>
        <button className="px-4 py-2 border border-buna/20 text-buna rounded-md text-xs font-semibold hover:bg-teff">
          Export Sales Report (CSV)
        </button>
      </header>

      {/* Primary Sales Gauges per FR-19 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-buna/10">
          <span className="text-xs uppercase font-bold text-buna-mocha tracking-wider">Gross Sales Total</span>
          <p className="text-2xl font-black text-primary mt-1">ETB {summary.total_sales_etb.toLocaleString()}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-buna/10">
          <span className="text-xs uppercase font-bold text-buna-mocha tracking-wider">Average Order Value (AOV)</span>
          <p className="text-2xl font-black text-buna mt-1">ETB {summary.average_order_value_etb.toFixed(2)}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-buna/10">
          <span className="text-xs uppercase font-bold text-buna-mocha tracking-wider">Total Completed Orders</span>
          <p className="text-2xl font-black text-buna mt-1">{summary.total_orders}</p>
        </div>
      </div>

      {/* Best Sellers Table & Provider Payment Reconciliation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best Sellers */}
        <div className="bg-white rounded-xl shadow-sm border border-buna/10 p-5 space-y-3">
          <h2 className="text-base font-bold text-buna">Best-Selling Items</h2>
          <table className="w-full text-left text-xs text-buna">
            <thead className="uppercase text-buna-mocha border-b border-buna/10 bg-teff">
              <tr>
                <th className="p-2">Item Name</th>
                <th className="p-2">Units Sold</th>
                <th className="p-2 text-right">Total ETB</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-buna/10">
              {summary.best_sellers.map((item) => (
                <tr key={item.name_en}>
                  <td className="p-2">
                    <span className="font-bold block">{item.name_en}</span>
                    <span className="text-[10px] text-primary gees-text block" lang="am">({item.name_am})</span>
                  </td>
                  <td className="p-2 font-bold">{item.units_sold}</td>
                  <td className="p-2 text-right font-bold text-primary">ETB {item.total_etb.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Provider Payment Reconciliation per FR-19 */}
        <div className="bg-white rounded-xl shadow-sm border border-buna/10 p-5 space-y-3">
          <h2 className="text-base font-bold text-buna">Payment Provider Reconciliation</h2>
          <div className="space-y-3">
            {summary.provider_totals.map((prov) => (
              <div key={prov.provider} className="p-3 rounded-lg border border-buna/10 bg-teff flex justify-between items-center">
                <div>
                  <span className="font-bold text-xs text-buna block">{prov.provider}</span>
                  <span className="text-[10px] text-buna-mocha">{prov.total_orders} settled orders</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-primary block">ETB {prov.total_amount.toLocaleString()}</span>
                  <span className="text-[10px] text-yetsom-container font-bold uppercase">✓ Reconciled</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
