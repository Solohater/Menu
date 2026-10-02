# MenuFlow (ሜኑ ፍሎው)

> **Customizable Digital Menu & Real-Time Ordering Platform for Ethiopian Restaurants & Cafes**  
> *One cohesive, self-contained application — easily customized and white-labeled per restaurant deployment.*

---

## 📸 Multi-Device UI Design Suite

![MenuFlow Multi-Device UI Suite](menuflow_ui_suite.jpg)

*Left: Desktop Admin & Cashier Dashboard (sales analytics in Birr, live table status grid, stock toggles).*  
*Center: Customer Mobile Web App (appetizing Shekla Tibs photography, bilingual English/Amharic toggle, Birr 450, terracotta action buttons).*  
*Right: Tablet Kitchen Display System (KDS dark mode with real-time tickets and timers).*

---

## 🚦 Current Implementation Status

This repository is currently transitioning from prototype UI/domain modeling to full production wiring. Here is the exact status of each layer:

| Component | Status | Details |
|---|---|---|
| **Frontend UI Suite (Next.js 14)** | ✅ **Finished** | All 14 routes compile cleanly (`npm run build` exits 0). Responsive across mobile, tablet, and desktop. |
| **Bilingual Support (EN / አማርኛ)** | ✅ **Finished** | Language toggle with optical alignment and line-height protection for Ge'ez diacritics (`Noto Sans Ethiopic`). |
| **Design System & Assets** | ✅ **Finished** | Warm Culinary Modern tokens (`#FDFBF7` cream, `#C85A32` terracotta, `#E89F4C` amber gold) + authentic Ethiopian food photography in `frontend/public/images/`. |
| **Go Domain Logic & State Machine** | ✅ **Finished** | Core modules (`order`, `menu`, `payment`, `kds`, `auth`, `tenant`, `websocket`) implemented with 100% passing unit tests (`go test ./...` exits 0). |
| **Docker Infrastructure** | ✅ **Finished** | `docker-compose.yml` configures PostgreSQL 16 and Redis 7.2. |
| **Backend Server Wiring (`cmd/server/main.go`)** | ⚠️ **Not Finished** | `main.go` currently only exposes `/health`. The domain HTTP routes and WebSocket handlers need to be wired together on the HTTP router. |
| **Database Migrations on Live DB** | ⚠️ **Not Finished** | SQL migration files exist in `backend/db/migrations/`, but need to be executed against the live PostgreSQL instance and seeded with initial demo data. |
| **Live Frontend-to-Backend Network Sync** | ⚠️ **Not Finished** | Frontend surfaces currently use in-memory / local storage mock data so all screens can be demoed offline. They need to be connected to `http://localhost:8080/api/v1` and `ws://localhost:8080/ws`. |
| **Live Payment Credentials** | ⚠️ **Not Finished** | Telebirr, Chapa, and CBE Birr use test stubs. Production merchant keys and live callback endpoints need to be configured. |

---

## 🎯 Architecture: Single Customizable App

MenuFlow is **NOT a multi-tenant SaaS platform**. It does not have shared-tenant databases, cross-tenant marketplace routing, or platform subscription layers.

Instead, MenuFlow is **ONE deployable application** that runs independently for a specific restaurant or cafe. Deploying for a new client requires zero code modifications:

1. **Brand & Operations Config (`restaurant.config.json`):** Set restaurant name, logo, address, operating mode (full table service vs. fast-casual pickup counter), tax rates (10% Service, 15% VAT), and payment provider keys.
2. **Design Tokens (`theme.json`):** Set brand primary color, accent color, background surface, and typography.

---

## 🚀 Quickstart & Setup Guide

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) & Docker Compose
- [Node.js](https://nodejs.org/) (v18 or v20+)
- [Go](https://golang.org/) (v1.22+)

---

### Step 1: Launch Database & Cache
```bash
docker compose up -d
```
Starts PostgreSQL 16 on `localhost:5432` and Redis 7.2 on `localhost:6379`.

---

### Step 2: Start the Go Backend
```bash
cd backend
go mod tidy
go run ./cmd/server/main.go
```
The Go API runs on `http://localhost:8080`.  
To run backend unit tests:
```bash
go test ./...
```

---

### Step 3: Start the Next.js Web App
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser to view the Platform Navigation Hub.

---

## 🗺️ Screen Navigation & Available Routes

| Route | Surface | Recommended Device | Description |
|---|---|---|---|
| `/` | **Platform Hub** | Any | Central index linking to all test surfaces |
| `/t/demo_token/menu` | **Guest Table Menu** | Mobile Smartphone | Table 04 ordering session with bilingual menu & photo cards |
| `/p/demo_token/menu` | **Guest Takeaway Menu** | Mobile Smartphone | Pickup/counter ordering without table assignment |
| `/checkout` | **Checkout & Invoice** | Mobile Smartphone | Itemized summary, 10% Service Charge, 15% VAT, payment selector |
| `/order/01J8ORD100` | **Live Order Tracker** | Mobile Smartphone | Real-time animated progress bar (`Paid → Cooking → Ready`) |
| `/kds` | **Kitchen Display (KDS)** | Tablet / TV (Landscape) | High-contrast dark mode ticket queue with aging timer alerts |
| `/waiter` | **Waiter Runner App** | Mobile Smartphone | Floor runner alerts for ready orders with 1-tap "Mark Delivered" |
| `/admin/cashier` | **Cashier Register** | Desktop / Tablet | Manual cash settlement and receipt review |
| `/admin/menu` | **Menu Catalog Admin** | Desktop Browser | Dish CRUD, pricing in ETB, and instant stock toggles |
| `/admin/tables` | **Table & QR Manager** | Desktop Browser | Live table occupancy map and printable QR code sheet |
| `/admin/orders` | **Sales Analytics** | Desktop Browser | Daily revenue breakdown and provider reconciliation |
| `/admin/settings` | **Restaurant Settings** | Desktop Browser | Operational toggles (waiter vs pickup mode), tax percentages |
| `/admin/ops/health` | **Platform Health** | Desktop Browser | Service health monitor and uptime metrics |

---

## 🎨 How to Customize for a New Restaurant

To adapt MenuFlow for a different client (e.g., "Entoto Forest Cafe", "Habesha Gourmet"):

### 1. Update Restaurant Information (`restaurant.config.json`)
```json
{
  "restaurant": {
    "name": "Entoto Forest Cafe",
    "logo_url": "/images/logo.png",
    "currency": "ETB",
    "locales": ["en", "am"]
  },
  "operations": {
    "service_mode": "counter_pickup", // "table_service" or "counter_pickup"
    "service_charge_percent": 5.0,
    "vat_percent": 15.0,
    "allow_cash_fallback": true
  }
}
```

### 2. Customize Theme Colors (`theme.json`)
```json
{
  "tokens": {
    "colors": {
      "brand_primary": "#2D6A4F",
      "brand_accent": "#D4A373",
      "surface_base": "#F8F9FA",
      "surface_card": "#FFFFFF"
    }
  }
}
```
All UI elements automatically adopt the new brand identity.

---

## 🛠️ Roadmap to Full Production

The remaining steps to make the platform fully operational end-to-end:

1. **Connect `cmd/server/main.go`:**
   - Instantiate PostgreSQL connection pool (`pgx` / `database/sql`).
   - Instantiate Redis client (`go-redis`).
   - Initialize the WebSocket Hub (`pkg/websocket/hub.go`).
   - Wire all domain handlers (`tenant`, `menu`, `order`, `payment`, `kds`) onto the HTTP router.
2. **Execute Database Migrations:**
   - Run `backend/db/migrations/000001_create_tenant_tables.up.sql`, `000002_create_menu_tables.up.sql`, and `000003_create_order_tables.up.sql`.
   - Seed initial menu items (Shekla Tibs, Shiro, Kitfo) and tables.
3. **Connect Frontend to Go API & WebSockets:**
   - Replace in-memory states with HTTP `fetch` requests to `http://localhost:8080/api/v1/...`.
   - Connect KDS and Waiter pages to `ws://localhost:8080/ws/...` so order tickets update live without page refreshing.
4. **Configure Payment Webhooks:**
   - Add live Chapa and Telebirr webhook endpoints with HMAC secret validation.
