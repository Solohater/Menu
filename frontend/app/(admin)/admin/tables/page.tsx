"use client";

import { useEffect, useState } from "react";
import CreateTableModal from "@/components/admin/CreateTableModal";
import QRPrintSheet from "@/components/admin/QRPrintSheet";

interface TableEntity {
  id: string;
  table_number: string;
  type: string;
  qr_token?: string;
  created_at: string;
}

export default function AdminTablesPage() {
  const [tables, setTables] = useState<TableEntity[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [tokenVersion, setTokenVersion] = useState(1);

  useEffect(() => {
    // Initial mock tables state
    setTables([
      { id: "01J8TBL1", table_number: "T01", type: "table", qr_token: "eyJyaWQiOiIwMUo4UkVTVDEwMCIsInR5cGUiOiJ0YWJsZSIsInRhcmdldF9pZCI6IjAxSjhUQUJMRTEwMCIsImxhYmVsIjoiVDAxIiwidiI6MX0=.sig", created_at: "2026-09-22" },
      { id: "01J8TBL2", table_number: "T02", type: "table", qr_token: "eyJyaWQiOiIwMUo4UkVTVDEwMCIsInR5cGUiOiJ0YWJsZSIsInRhcmdldF9pZCI6IjAxSjhUQUJMRTIwMCIsImxhYmVsIjoiVDAyIiwidiI6MX0=.sig", created_at: "2026-09-22" },
      { id: "01J8TBL3", table_number: "P01", type: "pickup", qr_token: "eyJyaWQiOiIwMUo4UkVTVDEwMCIsInR5cGUiOiJwaWNrdXAiLCJ0YXJnZXRfaWQiOiIwMUo4UElDS1VQMTAwIiwibGFiZWwiOiJQMDEiLCJ2IjoxfQ==.sig", created_at: "2026-09-22" },
    ]);
  }, []);

  const handleCreateTable = (tableNumber: string, type: string) => {
    const newTbl: TableEntity = {
      id: `01J8TBL${Date.now()}`,
      table_number: tableNumber,
      type: type,
      qr_token: `eyJyaWQiOiIwMUo4UkVTVDEwMCIsInR5cGUiOiI${type}\",\"target_id\":\"01J8${Date.now()}\",\"label\":\"${tableNumber}\",\"v\":${tokenVersion}}.sig`,
      created_at: new Date().toISOString(),
    };
    setTables([...tables, newTbl]);
  };

  const handleRegenerateTokens = () => {
    if (confirm("Are you sure you want to regenerate all QR tokens? All currently printed physical QR codes will be immediately revoked!")) {
      const newVer = tokenVersion + 1;
      setTokenVersion(newVer);
      setTables(
        tables.map((t) => ({
          ...t,
          qr_token: `eyJyaWQiOiIwMUo4UkVTVDEwMCIsInR5cGUiOiI${t.type}\",\"target_id\":\"${t.id}\",\"label\":\"${t.table_number}\",\"v\":${newVer}}.sig`,
        }))
      );
      alert(`Token version updated to v${newVer}. All old physical QR prints have been revoked.`);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center border-b border-buna/20 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Tables & QR Code Management</h1>
          <p className="text-sm text-buna-mocha">Generate, print, and revoke table and takeaway QR tokens (v{tokenVersion}).</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleRegenerateTokens}
            className="px-3 py-2 border border-red-600 text-red-600 rounded-md text-xs font-semibold hover:bg-red-50"
          >
            Regenerate All Tokens (Revoke Old)
          </button>
          <button
            onClick={() => setIsPrintOpen(true)}
            className="px-3 py-2 border border-primary text-primary rounded-md text-xs font-semibold hover:bg-teff"
          >
            Print QR Sheet
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-primary text-white rounded-md text-xs font-semibold hover:bg-primary-container"
          >
            + Add Table / Pickup
          </button>
        </div>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-buna/10 p-5">
        <table className="w-full text-left text-sm text-buna">
          <thead className="text-xs uppercase text-buna-mocha border-b border-buna/10 bg-teff">
            <tr>
              <th className="p-3">Label</th>
              <th className="p-3">Type</th>
              <th className="p-3">Opaque HMAC Token Payload</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-buna/10">
            {tables.map((tbl) => (
              <tr key={tbl.id} className="hover:bg-teff/50">
                <td className="p-3 font-bold text-primary">
                  {tbl.type === 'pickup' ? `Pickup #${tbl.table_number}` : `Table ${tbl.table_number}`}
                </td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    tbl.type === 'pickup' ? 'bg-primary/10 text-primary' : 'bg-buna/10 text-buna'
                  }`}>
                    {tbl.type === 'pickup' ? 'Takeaway Counter' : 'Dine-in Table'}
                  </span>
                </td>
                <td className="p-3 font-mono text-xs text-buna-mocha truncate max-w-xs">
                  {tbl.qr_token}
                </td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-yetsom-container text-white">
                    Active (v{tokenVersion})
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CreateTableModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateTable}
      />

      {isPrintOpen && (
        <QRPrintSheet
          tables={tables}
          restaurantName="Habesha Gourmet Cafe"
          onClose={() => setIsPrintOpen(false)}
        />
      )}
    </div>
  );
}
