"use client";

import { useState } from "react";
import "@/app/globals.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-teff text-buna">
      <nav className="bg-buna text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="font-bold text-lg text-white">MenuFlow Admin Portal</span>
          
          {/* Desktop Nav Links */}
          <div className="hidden md:flex space-x-4 text-xs font-semibold">
            <a href="/admin/menu" className="hover:text-gold-text">Menu</a>
            <a href="/admin/tables" className="hover:text-gold-text">Tables & QRs</a>
            <a href="/admin/settings" className="hover:text-gold-text">Settings</a>
            <a href="/admin/orders" className="hover:text-gold-text">Sales</a>
            <a href="/admin/cashier" className="hover:text-gold-text">Cashier</a>
            <a href="/admin/ops/health" className="hover:text-gold-text">Health</a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white font-bold p-1 text-sm border border-white/20 rounded"
          >
            {mobileMenuOpen ? "✕ Close" : "☰ Menu"}
          </button>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-3 border-t border-white/20 mt-3 space-y-2 text-xs font-semibold flex flex-col items-start">
            <a href="/admin/menu" className="py-1 hover:text-gold-text">Menu Management</a>
            <a href="/admin/tables" className="py-1 hover:text-gold-text">Tables & QRs</a>
            <a href="/admin/settings" className="py-1 hover:text-gold-text">Settings</a>
            <a href="/admin/orders" className="py-1 hover:text-gold-text">Sales Analytics</a>
            <a href="/admin/cashier" className="py-1 hover:text-gold-text">Cashier Register</a>
            <a href="/admin/ops/health" className="py-1 hover:text-gold-text">System Health</a>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-6 overflow-x-auto">{children}</main>
    </div>
  );
}
