# Digital Menu & Ordering Platform — Product & Technical Documentation

**Working name:** MenuFlow (placeholder — rename as needed)
**Market:** Ethiopia (restaurants & cafes)
**Version:** 1.0 Draft
**Date:** September 2026

---

## 1. Executive Summary

MenuFlow is a QR-code-based digital menu and ordering system for restaurants and cafes. A customer scans a QR code placed on their table, browses the menu on their own phone (no app install required — a web app), customizes and places their order, and pays directly through the platform using local payment providers (Telebirr, CBE Birr, Chapa, and other bank options). Orders are routed in real time to a **Kitchen/Cashier Display Screen** tagged with the table number, and the system notifies either the customer or the waiter when the order is ready, depending on whether the establishment has table service.

**Core value proposition**
- Faster table turnover, fewer order-taking errors, no printed menus to reprint when prices change
- Reduced staffing pressure (customers can self-order and self-pay)
- Real-time kitchen visibility by table
- Local payment rails built in from day one, not bolted on later

---

## 2. Goals & Success Metrics

| Goal | Metric |
|---|---|
| Reduce average order-to-kitchen time | < 10 seconds from payment confirmation to kitchen screen |
| Reduce order errors from miscommunication | Track % of orders edited/cancelled after kitchen receipt |
| Increase payment success rate | > 95% successful transaction rate across all providers |
| Table-to-notification speed | Customer/waiter notified within 5 seconds of "order ready" tap |
| Restaurant onboarding time | A new restaurant fully live (menu + QR codes + payments) in under 1 day |

---

## 3. User Roles

1. **Customer (Guest)** — no login required, or optional lightweight login (phone number) for order history/loyalty later.
2. **Waiter/Runner** — receives "food ready" alerts, marks orders as delivered.
3. **Kitchen Staff / Chef** — sees incoming orders on the Kitchen Display System (KDS), marks items as "preparing" / "ready".
4. **Cashier** — sees payment status, can also view/print receipts, handle manual/cash fallback if needed.
5. **Restaurant Admin/Manager** — manages menu items, categories, prices, tables, QR codes, staff accounts, and views sales reports.
6. **Platform Super Admin (you)** — onboards new restaurants, manages subscription/billing, monitors system health across all tenants.

---

## 4. Core Features

### 4.1 QR Code & Table Management
- Each table gets a unique QR code (encodes restaurant ID + table number).
- Scanning opens a mobile web app (PWA) directly to that table's ordering session — no app store download needed.
- Admin can generate/print/regenerate QR codes per table from the dashboard.
- Optional: QR code also works for "pickup/takeaway" mode (no table number).

### 4.2 Digital Menu
- Categories: Food, Drinks, Desserts, Specials, etc. (fully configurable per restaurant).
- Each item has: name, description, price, photo, availability toggle (in stock/out of stock), prep time estimate, allergen/dietary tags.
- Item customization options: add-ons (extra cheese, extra sauce), removals (no onions, no pickles), size/variant selection, and a free-text special-instructions field.
- Multi-language support recommended (Amharic + English at minimum).

### 4.3 Cart, Checkout & Payment
- Customer builds a cart, reviews items + customizations + subtotal + tax/service charge.
- Payment options at checkout:
  - **Telebirr** (mobile wallet)
  - **Chapa** (aggregator — can also cover CBE Birr, HelloCash, other bank cards/mobile money in one integration)
  - **Commercial Bank of Ethiopia (CBE)** direct integration or CBE Birr
  - Other banks/mobile money as needed (Awash, Dashen/Amole, Bank of Abyssinia, etc.)
  - Optional: "Pay at counter / Cash" fallback for restaurants that want it
- On successful payment, an order confirmation is shown to the customer with estimated wait time.
- Failed/pending payments must be clearly retryable without duplicating the order.

### 4.4 Kitchen/Cashier Display System (KDS)
- Real-time screen (tablet, TV, or monitor) showing incoming orders as cards or a queue.
- Each order card shows: table number, items + customizations, order time, elapsed time, payment status.
- Staff can mark item/order status: **Received → Preparing → Ready → Delivered**.
- Orders auto-highlight or flash if they exceed a configurable time threshold (e.g. > 15 minutes).
- Cashier view can filter to show only payment-related info (paid/unpaid, receipts) separately from the kitchen's prep-only view if desired.

### 4.5 Notifications
- **Waiter notification:** when kitchen marks an order "Ready," the assigned waiter's device (phone/tablet app or simple web view) gets a push/alert with table number and item summary.
- **Customer notification (no-waiter / self-service model):** the customer's ordering session shows a live status bar ("Preparing… Ready — please pick up at counter") and can trigger a push notification (if PWA notifications are enabled) or an on-screen/audible alert if they keep the page open.
- Optional: a numbered pickup-counter display board for self-service pickup.

### 4.6 Admin Dashboard
- Menu management (CRUD categories/items, bulk price updates, availability toggles).
- Table & QR code management.
- Staff account management with role-based permissions.
- Order history and sales analytics (best sellers, peak hours, average order value).
- Payment reconciliation (per provider, per day).

---

## 5. Technical Architecture

### 5.1 High-Level Components
1. **Customer Web App (PWA)** — React/Next.js or similar, mobile-first, opened via QR scan. No install required; supports "Add to Home Screen."
2. **Kitchen Display System (KDS) App** — real-time web app for tablets/TVs in the kitchen/cashier area.
3. **Waiter App** — lightweight Next.js web view (PWA) showing ready-order alerts; native app not required for v1.
4. **Admin Dashboard** — Next.js web app for restaurant managers.
5. **Backend API** — a single **Go** service handling menu data, orders, payments, notifications, and auth, exposed as a REST API to all four Next.js frontends above.
6. **Real-time layer** — WebSocket connections served directly from the Go backend to push order status updates instantly to KDS/waiter/customer screens (no separate real-time vendor required).
7. **Payment Gateway Layer** — abstraction layer, implemented in Go, integrating Telebirr API, Chapa API, CBE, and other providers behind a single internal "PaymentProvider" interface, so new providers can be added without touching order logic.
8. **Database** — relational DB (PostgreSQL recommended) for restaurants, menus, orders, users, payments; Redis for live order-queue/session state, accessed from the Go backend.
9. **Notification Service** — Web Push / FCM for browser & mobile push notifications, triggered from the Go backend; SMS fallback (e.g. via a local SMS gateway) optional for customers without smartphones.

### 5.2 Tech Stack
- Frontend (Customer app, KDS, Waiter app, Admin): **Next.js** (React) as a PWA — single codebase, works cross-platform without app-store friction, server-side rendering for fast first-load menu views.
- Backend: **Go** — a REST (or gRPC-for-internal/REST-for-public) API service. Go's concurrency model (goroutines/channels) is a strong fit for the real-time order pipeline (many simultaneous table sessions, KDS pushes, payment webhooks) and gives predictable low-latency performance under load. Recommended framework: `net/http` + `chi` or `Gin`/`Fiber` for routing, `sqlc` or `GORM` for the database layer.
- Database: PostgreSQL (primary), Redis (real-time/session/queue, and a natural fit alongside Go via `go-redis`).
- Real-time: Go backend exposes WebSocket connections directly (`gorilla/websocket` or `nhooyr.io/websocket`) to push order/status updates to the Next.js KDS, waiter, and customer-status views — no separate real-time service needed unless you want to offload it later.
- Hosting: Cloud provider with good Ethiopia/Africa latency (consider regional CDN for the Next.js frontend; Go backend as a lightweight containerized service, easy to run cheaply and scale horizontally).
- Payments: Chapa as the primary aggregator (covers many local banks/wallets through one integration) plus direct Telebirr integration; CBE integration either via Chapa or CBE's own merchant API depending on availability and fees. All provider calls happen server-side in Go behind the `PaymentProvider` interface (Section 5.5).

### 5.3 Data Model (Core Entities)
- **Restaurant**: id, name, branches, settings (service charge %, tax %, self-service vs waiter mode)
- **Table**: id, restaurant_id, table_number, QR code value/URL
- **MenuCategory**: id, restaurant_id, name, sort order
- **MenuItem**: id, category_id, name, description, price, photo_url, is_available, prep_time, tags
- **ItemOption/AddOn**: id, menu_item_id, name, price_delta, type (add-on/removal/variant)
- **Order**: id, restaurant_id, table_id, status, created_at, total_amount, payment_status
- **OrderItem**: id, order_id, menu_item_id, quantity, selected_options[], special_instructions
- **Payment**: id, order_id, provider (telebirr/chapa/cbe/…), provider_transaction_id, amount, status
- **User/Staff**: id, restaurant_id, role (admin/waiter/kitchen/cashier), name, contact
- **Notification**: id, order_id, recipient_type (customer/waiter), channel, status, sent_at

### 5.4 Order Lifecycle (State Machine)
```
Cart → Checkout → Payment Pending → Payment Confirmed
    → Order Received (Kitchen) → Preparing → Ready
    → Notified → Delivered (or Picked Up) → Closed
```
Failure/edge paths: Payment Failed (return to Checkout), Item Out of Stock (flag before payment), Order Cancelled (with refund flow if already paid).

### 5.5 Payment Integration Notes
- Use a **provider abstraction interface** (e.g. `initiatePayment()`, `verifyPayment()`, `handleWebhook()`) so Telebirr, Chapa, and CBE can plug in independently.
- Telebirr and CBE typically require merchant registration/approval and provide their own SDKs or REST APIs with callback/webhook verification — build the webhook handler to be idempotent (a payment confirmation may arrive more than once).
- Chapa, as an aggregator, can significantly reduce integration work since it already supports multiple Ethiopian banks and mobile money providers through one API — worth using as the default rail and adding direct integrations only where needed (e.g., large restaurant chains wanting direct CBE settlement).
- Always reconcile: store the provider's transaction reference and amount, and run a periodic reconciliation job against provider statements.

### 5.6 Non-Functional Requirements
- **Performance:** menu load < 2s on 3G/4G; order placed-to-kitchen-visible < 10s.
- **Reliability:** KDS and payment webhook handling must be resilient to network drops common in the region (retry queues, offline-tolerant UI states).
- **Security:** PCI-relevant data never touches your own servers — payments go through provider-hosted checkout/tokenized flows; staff accounts use role-based access control; QR codes should not expose sensitive IDs directly (use signed/opaque tokens).
- **Multi-tenancy:** the platform should support many restaurants (tenants) cleanly isolated from each other.
- **Localization:** Amharic and English UI at minimum; currency in ETB.
- **Offline/low-connectivity tolerance:** cache menu data client-side; gracefully handle intermittent connectivity for both customers and kitchen screens.

---

## 6. Suggested Build Phases

**Phase 1 — MVP**
- Single-restaurant support, QR-per-table, digital menu (view + customize), cart, one payment provider (Chapa, since it covers multiple rails fastest), basic KDS with status updates, admin menu management.

**Phase 2**
- Multi-restaurant/multi-tenant support, waiter notification app, direct Telebirr/CBE integration, sales analytics dashboard, self-service pickup notifications.

**Phase 3**
- Loyalty/repeat-customer accounts, multi-branch reporting, inventory/stock sync, SMS fallback notifications, printed-receipt integration, table reservation add-on.

---

## 7. Open Questions to Resolve Before Build
- Will the platform be **multi-tenant SaaS** (many restaurants, one system) or a **single custom build per restaurant**?
- Which payment provider should be the default/primary at MVP — Chapa (fastest breadth) vs. direct Telebirr?
- Does the restaurant keep a cash/manual payment fallback at the counter?
- Should customers be required to enter a phone number (for notifications/order history) or stay fully anonymous?
- Native apps (waiter/KDS) or web-only (PWA) for v1? Web-only is faster to ship and update.

---

## 8. Agent Prompt (for an AI coding agent, e.g. Claude Code)

Use the block below as the system/task prompt when handing this project to a coding agent.

```
You are building "MenuFlow," a QR-code-based digital menu and ordering platform for
restaurants and cafes in Ethiopia. Build it as a multi-tenant web application using a
PWA-first approach (no native app store dependency for the customer-facing menu).

TECH STACK (fixed):
- Backend: Go, exposing a REST API. Use `chi`, `Gin`, or `Fiber` for routing, and
  `sqlc` or `GORM` for the PostgreSQL data layer. Use `gorilla/websocket` (or
  `nhooyr.io/websocket`) for the real-time layer — serve WebSocket connections
  directly from the Go service to push order/status updates to the KDS, waiter,
  and customer-status views. Use `go-redis` for Redis-backed session/queue state.
- Frontend: Next.js (React) for all four surfaces — Customer PWA, KDS, Waiter view,
  and Admin dashboard — as a single Next.js codebase (or a small monorepo of
  Next.js apps) consuming the Go REST/WebSocket API.
- Database: PostgreSQL (primary), Redis (real-time/session/queue).

CORE REQUIREMENTS:
1. Customer flow: scan a table QR code -> land on that restaurant/table's menu ->
   browse categories/items with photos, descriptions, prices -> customize items
   (add-ons, removals, special instructions) -> add to cart -> checkout -> pay via
   an abstracted PaymentProvider interface supporting Telebirr, Chapa, and CBE
   (implement Chapa first since it aggregates multiple local rails) -> receive
   order confirmation and a live status indicator.
2. Kitchen/Cashier Display System (KDS): real-time web view (for tablet/TV) showing
   incoming paid orders as cards, each with table number, items, customizations,
   elapsed time, and status controls (Received -> Preparing -> Ready). Use
   WebSockets (or an equivalent real-time channel) so new orders and status changes
   appear instantly with no manual refresh.
3. Waiter notification: when kitchen marks an order "Ready," notify the assigned
   waiter's device instantly (push notification or real-time in-app alert) with
   table number and item summary; waiter can mark "Delivered."
4. Customer notification for self-service (no-waiter) mode: show a live order-status
   view to the customer and trigger a notification/alert when ready for pickup.
5. Admin dashboard: manage restaurants, tables/QR codes, menu categories/items
   (CRUD, availability toggles, pricing), staff accounts with roles
   (admin/waiter/kitchen/cashier), and basic sales/orders reporting.

ARCHITECTURE CONSTRAINTS:
- Backend: Go API service with PostgreSQL as primary datastore and Redis for
  real-time/session state (see TECH STACK above for library choices).
- Real-time layer: native WebSocket connections served from the Go backend,
  shared across KDS, waiter, and customer-status views.
- Payments: implement a `PaymentProvider` interface with `initiatePayment`,
  `verifyPayment`, and `handleWebhook` methods. Webhooks must be idempotent
  (a provider may send the same confirmation more than once). Store provider
  transaction IDs for reconciliation. Never store raw card/wallet credentials —
  use each provider's hosted checkout/tokenized flow.
- Multi-tenancy: every table, menu item, order, and staff account must be scoped to
  a `restaurant_id`. Ensure strict data isolation between tenants.
- Localization: support English and Amharic strings; currency is ETB.
- Resilience: assume intermittent connectivity; the customer app should cache the
  menu client-side, and the KDS/order pipeline should queue and retry rather than
  drop updates on brief network loss.
- Security: QR codes should encode an opaque/signed token (not raw sequential IDs)
  that resolves server-side to restaurant + table; enforce role-based access
  control on all staff-facing endpoints.

DELIVERABLES, IN ORDER:
1. Data model / database schema (restaurants, tables, menu categories/items,
   item options, orders, order items, payments, staff/users, notifications).
2. Backend API with the order lifecycle state machine:
   Cart -> Checkout -> Payment Pending -> Payment Confirmed -> Order Received
   -> Preparing -> Ready -> Notified -> Delivered/Picked Up -> Closed.
3. Customer PWA (menu browse, customize, cart, checkout, live order status).
4. KDS web app (real-time order queue with status controls).
5. Waiter notification view (real-time "ready" alerts + mark-delivered action).
6. Admin dashboard (menu/table/staff management, basic reporting).
7. Payment integration starting with Chapa, structured so Telebirr and CBE can be
   added later without changing order/business logic.

Ask clarifying questions only where the requirements above are ambiguous for the
specific screen/feature you are about to build; otherwise proceed using the
architecture and flow defined here as the source of truth.
```

---

*This document is a working draft. Update the "Open Questions" section as decisions are made, and treat Section 8 as the canonical brief to hand to any developer or coding agent picking up implementation.*