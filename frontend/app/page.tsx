import Link from "next/link";

export default function RootHubPage() {
  return (
    <div className="min-h-screen bg-[#fff8f5] text-[#1e1b19] p-6 max-w-4xl mx-auto space-y-6">
      <header className="border-b border-[#33302d]/10 pb-4 text-left">
        <h1 className="text-3xl font-black text-[#9d3e0f]">MenuFlow Platform Navigation</h1>
        <p className="text-sm text-[#57423b]">
          Ethiopian QR-code digital menu & ordering platform. Click any surface below to test.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
        {/* Customer PWA */}
        <div className="bg-white p-5 rounded-2xl border border-[#33302d]/10 shadow-sm space-y-3">
          <span className="text-xs font-bold text-[#268451] uppercase tracking-wider block">● Customer PWA (Guest)</span>
          <h2 className="text-lg font-bold text-[#1e1b19]">Table & Takeaway Ordering</h2>
          <ul className="space-y-2 text-xs text-[#9d3e0f] font-semibold">
            <li>
              <Link href="/t/demo_token/menu" className="hover:underline flex items-center justify-between">
                <span>Table 04 Menu Browse (`/t/demo_token/menu`)</span>
                <span>→</span>
              </Link>
            </li>
            <li>
              <Link href="/p/demo_token/menu" className="hover:underline flex items-center justify-between">
                <span>Takeaway Pickup Menu (`/p/demo_token/menu`)</span>
                <span>→</span>
              </Link>
            </li>
            <li>
              <Link href="/checkout" className="hover:underline flex items-center justify-between">
                <span>Tray Checkout & Tax Invoice (`/checkout`)</span>
                <span>→</span>
              </Link>
            </li>
            <li>
              <Link href="/order/01J8ORD100" className="hover:underline flex items-center justify-between">
                <span>Guest Order Live Tracker (`/order/01J8ORD100`)</span>
                <span>→</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Real-time Operations */}
        <div className="bg-white p-5 rounded-2xl border border-[#33302d]/10 shadow-sm space-y-3">
          <span className="text-xs font-bold text-[#b87e14] uppercase tracking-wider block">● Staff Operations</span>
          <h2 className="text-lg font-bold text-[#1e1b19]">KDS, Waiter & Cashier</h2>
          <ul className="space-y-2 text-xs text-[#9d3e0f] font-semibold">
            <li>
              <Link href="/kds" className="hover:underline flex items-center justify-between">
                <span>Kitchen Display System (`/kds`)</span>
                <span>→</span>
              </Link>
            </li>
            <li>
              <Link href="/waiter" className="hover:underline flex items-center justify-between">
                <span>Waiter Ready Alerts App (`/waiter`)</span>
                <span>→</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/cashier" className="hover:underline flex items-center justify-between">
                <span>Cashier Counter Register (`/admin/cashier`)</span>
                <span>→</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Restaurant Admin */}
        <div className="bg-white p-5 rounded-2xl border border-[#33302d]/10 shadow-sm space-y-3">
          <span className="text-xs font-bold text-[#9d3e0f] uppercase tracking-wider block">● Tenant Management</span>
          <h2 className="text-lg font-bold text-[#1e1b19]">Restaurant Admin</h2>
          <ul className="space-y-2 text-xs text-[#9d3e0f] font-semibold">
            <li>
              <Link href="/admin/menu" className="hover:underline flex items-center justify-between">
                <span>Menu CRUD & Bulk Pricing (`/admin/menu`)</span>
                <span>→</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/tables" className="hover:underline flex items-center justify-between">
                <span>Tables & QR Code Sheet Print (`/admin/tables`)</span>
                <span>→</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/settings" className="hover:underline flex items-center justify-between">
                <span>Establishment Mode & Toggles (`/admin/settings`)</span>
                <span>→</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/orders" className="hover:underline flex items-center justify-between">
                <span>Sales Analytics & Reconciliation (`/admin/orders`)</span>
                <span>→</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Platform Operator */}
        <div className="bg-white p-5 rounded-2xl border border-[#33302d]/10 shadow-sm space-y-3">
          <span className="text-xs font-bold text-[#33302d] uppercase tracking-wider block">● Platform Operations</span>
          <h2 className="text-lg font-bold text-[#1e1b19]">Platform Operator (Jo)</h2>
          <ul className="space-y-2 text-xs text-[#9d3e0f] font-semibold">
            <li>
              <Link href="/admin/ops/health" className="hover:underline flex items-center justify-between">
                <span>Cross-Tenant System Health (`/admin/ops/health`)</span>
                <span>→</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
