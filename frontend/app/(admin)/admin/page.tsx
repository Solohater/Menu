import Link from "next/link";

export default function AdminIndexPage() {
  return (
    <div className="space-y-6 text-left">
      <header className="border-b border-buna/20 pb-4">
        <h1 className="text-2xl font-bold text-primary">Restaurant Admin Portal</h1>
        <p className="text-sm text-buna-mocha">Select a tenant management option to manage your restaurant.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/admin/menu" className="bg-white p-5 rounded-xl border border-buna/10 shadow-sm hover:border-primary block">
          <h2 className="text-lg font-bold text-buna">Menu Management</h2>
          <p className="text-xs text-buna-mocha mt-1">CRUD categories, items, prices, options, and availability toggles.</p>
        </Link>

        <Link href="/admin/tables" className="bg-white p-5 rounded-xl border border-buna/10 shadow-sm hover:border-primary block">
          <h2 className="text-lg font-bold text-buna">Tables & QR Codes</h2>
          <p className="text-xs text-buna-mocha mt-1">Manage physical tables, takeaway points, print QR sheets, and revoke tokens.</p>
        </Link>

        <Link href="/admin/settings" className="bg-white p-5 rounded-xl border border-buna/10 shadow-sm hover:border-primary block">
          <h2 className="text-lg font-bold text-buna">Establishment Settings</h2>
          <p className="text-xs text-buna-mocha mt-1">Configure service mode (table vs self-service), tax %, and cash fallback.</p>
        </Link>

        <Link href="/admin/orders" className="bg-white p-5 rounded-xl border border-buna/10 shadow-sm hover:border-primary block">
          <h2 className="text-lg font-bold text-buna">Sales Analytics & Orders</h2>
          <p className="text-xs text-buna-mocha mt-1">View gross sales, best sellers, and payment provider reconciliation.</p>
        </Link>

        <Link href="/admin/cashier" className="bg-white p-5 rounded-xl border border-buna/10 shadow-sm hover:border-primary block">
          <h2 className="text-lg font-bold text-buna">Cashier Register</h2>
          <p className="text-xs text-buna-mocha mt-1">View unpaid orders and mark cash orders as paid.</p>
        </Link>

        <Link href="/admin/ops/health" className="bg-white p-5 rounded-xl border border-buna/10 shadow-sm hover:border-primary block">
          <h2 className="text-lg font-bold text-buna">Platform Health</h2>
          <p className="text-xs text-buna-mocha mt-1">View system availability, active connections, and webhook queue health.</p>
        </Link>
      </div>
    </div>
  );
}
