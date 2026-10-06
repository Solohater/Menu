# MenuFlow (ሜኑ ፍሎው) — Comprehensive Testing & Feature Guide

> **How to run, test, and experience all MenuFlow features across Customer PWA, Kitchen Display System (KDS), Waiter Handheld, and Backoffice Command Center.**

---

## 📸 MenuFlow UI Operations Suite Showcase

![MenuFlow Multi-Surface UI Suite](menuflow_ui_suite.jpg)
*Figure 1: Complete MenuFlow Operations Suite — Customer Mobile PWA (Table 04), Chef KDS Landscape Display, Waiter Handheld Runner, and Desktop Manager Command Center.*

---

## 1. Quick Start: Running the Platform

To test real-time ordering and live WebSocket synchronization across devices on your local network (`10.10.4.109`), ensure both the Go backend and Next.js frontend are running.

### Terminal 1: Start the Go Backend (Port 8080)
```bash
cd backend
go run ./cmd/server/main.go
```
*Runs on `http://0.0.0.0:8080` with the native RFC 6455 WebSocket Hub, Order Engine, KDS pipelines, and Service Request dispatchers.*

### Terminal 2: Start the Next.js Frontend (Port 3000)
```bash
cd frontend
npm run dev
```
*Runs on `http://0.0.0.0:3000` accessible from your computer or any smartphone connected to the same Wi-Fi at `http://10.10.4.109:3000`.*

---

## 2. Directory of Surfaces & Direct URLs

| Surface Role | Localhost URL | Network URL (Mobile / Tablet) | Purpose & Key Features |
|---|---|---|---|
| **Customer Menu (Dine-in)** | [`http://localhost:3000/t/demo_token/menu`](http://localhost:3000/t/demo_token/menu) | `http://10.10.4.109:3000/t/demo_token/menu` | Browse food/drinks, bilingual EN/አማ toggle, dish customization drawer, **🛎️ Table Assistance Bell**, cart tray dock. |
| **Customer Menu (Takeaway)** | [`http://localhost:3000/p/demo_token/menu`](http://localhost:3000/p/demo_token/menu) | `http://10.10.4.109:3000/p/demo_token/menu` | Pickup #P04 takeaway ordering with packaging options. |
| **Tray Checkout** | [`http://localhost:3000/checkout`](http://localhost:3000/checkout) | `http://10.10.4.109:3000/checkout` | Itemized review, 10% Service + 15% VAT invoice calculation, Telebirr/Chapa/CBE/Cash selection, **live backend order dispatch**. |
| **Live Order Progress Tracker** | [`http://localhost:3000/order/01J8ORD100`](http://localhost:3000/order/01J8ORD100) | `http://10.10.4.109:3000/order/01J8ORD100` | Real-time WebSocket 4-step status timeline, pickup alert, **🛎️ Table Service Request Modal**. |
| **Chef Kitchen Display (KDS)** | [`http://localhost:3000/kds`](http://localhost:3000/kds) | `http://10.10.4.109:3000/kds` | High-contrast dark mode, aging warning badges (<8m green, 8–15m amber, >15m red), **live incoming ticket chimes**, 1-tap **Bump** button. |
| **Waiter Runner Handheld** | [`http://localhost:3000/waiter`](http://localhost:3000/waiter) | `http://10.10.4.109:3000/waiter` | Priority "Ready" orders queue, **active table assistance alerts (Water, Waiter, Bill)** with `[ On My Way 🏃 ]` and `[ Done ✓ ]`, 1-tap **`[ MARK DELIVERED ✔ ]`**. |
| **Desktop Manager Command Center** | [`http://localhost:3000/admin`](http://localhost:3000/admin) | `http://10.10.4.109:3000/admin` | Persistent sidebar, weekly sales spline chart, live active floor map, 1-tap stock availability switches (86'ing). |
| **Cashier Till Register** | [`http://localhost:3000/admin/cashier`](http://localhost:3000/admin/cashier) | `http://10.10.4.109:3000/admin/cashier` | Live cash orders to collect, settled till history, 1-tap `[ ✓ Mark Cash Paid ]`. |
| **Sales Analytics & Orders** | [`http://localhost:3000/admin/orders`](http://localhost:3000/admin/orders) | `http://10.10.4.109:3000/admin/orders` | Gross sales in ETB, AOV, best-sellers ranking, and provider reconciliation (Telebirr vs Chapa vs CBE vs Cash). |
| **Tables & QR Generator** | [`http://localhost:3000/admin/tables`](http://localhost:3000/admin/tables) | `http://10.10.4.109:3000/admin/tables` | Table floor cards, HMAC token version bump, 1-click printable QR sheet modal. |
| **Establishment Settings** | [`http://localhost:3000/admin/settings`](http://localhost:3000/admin/settings) | `http://10.10.4.109:3000/admin/settings` | Operational modes (Table Service vs Counter Pickup), tax sliders, payment provider toggles. |

---

## 3. Step-by-Step Interactive Test Scenarios

### 🧪 Test Scenario 1: Table Assistance & Service Requests (Water, Waiter, Bill)
*Demonstrates customer-to-waiter direct communication without waving hands across a busy restaurant.*

1. **Open Customer Menu on Phone or Tab 1:**  
   Navigate to [`http://10.10.4.109:3000/t/demo_token/menu`](http://10.10.4.109:3000/t/demo_token/menu).
2. **Open Waiter Handheld on Tab 2 (or a second phone):**  
   Navigate to [`http://10.10.4.109:3000/waiter`](http://10.10.4.109:3000/waiter).
3. **Trigger Assistance from Customer Screen:**  
   - In Tab 1 (Customer Menu), look at the top header next to the cart icon `🛒`.  
   - Click the **`🛎️` Assistance Bell** button.  
   - An interactive modal slides up presenting 5 options:
     - 🛎️ **Call Waiter** (General table assistance)
     - 💧 **Water & Glasses** (Drinking water request)
     - 🍴 **Napkins & Cutlery** (Extra forks, napkins, toothpicks)
     - 🧾 **Request Bill** (Ready to pay at table)
     - ⚠️ **Report an Issue** (Delay, temperature, or dish error)
   - Select **"Water & Glasses"**, optionally type *"2 glasses of cold water"*, and tap **"🔔 Send Request to Waiter"**.
4. **Observe Waiter Handheld (Tab 2):**  
   - The waiter handheld plays an **audible double-chime** in real time!
   - A pulsing amber alert card appears at the top:  
     `TABLE 04 • WATER - "2 glasses of cold water"`.
   - Tap **`[ On My Way 🏃 ]`**: the card updates to in-progress status.
   - Tap **`[ Done ✓ ]`**: the request is resolved and dismissed from the waiter's queue.

---

### 🧪 Test Scenario 2: End-to-End Live Ordering & Kitchen Coordination (KDS $\rightarrow$ Waiter $\rightarrow$ Guest)
*Demonstrates live multi-device WebSocket synchronization without page refreshes.*

1. **Set Up Three Windows/Tabs Side-by-Side:**
   - **Window A:** [`http://10.10.4.109:3000/t/demo_token/menu`](http://10.10.4.109:3000/t/demo_token/menu) (Customer)
   - **Window B:** [`http://10.10.4.109:3000/kds`](http://10.10.4.109:3000/kds) (Chef KDS)
   - **Window C:** [`http://10.10.4.109:3000/waiter`](http://10.10.4.109:3000/waiter) (Waiter Runner)
2. **Customer Builds & Places an Order (Window A):**
   - Click on the **Food** card.
   - Click on **Classic Addis Cheeseburger**.
   - In the slide-up customization drawer, select **"No Onions"**, **"+ Extra Cheddar Cheese"**, and type special instruction: *"Medium well please"*.
   - Tap **"Add to Active Tray"**.
   - Tap the floating cart pill at the bottom or the top `🛒` icon $\rightarrow$ Click **"Proceed to Checkout"**.
   - On the Checkout page, select **"Telebirr"** or **"Cash at Counter"**.
   - Click **"Confirm & Pay ETB 638"**.
   - Notice: The order is sent via `POST /api/v1/orders/create` to the live Go backend!
   - Click **"Track Live Kitchen Progress →"** to enter `/order/[order_id]`.
3. **Observe Chef KDS (Window B):**
   - In real time, the KDS **chimes with a high-pitched ping**!
   - A brand new ticket card appears on the KDS board:  
     `ORDER #... • TABLE 04` listing the burger with *"NO ONIONS | + Extra Cheddar Cheese | Medium well please"*.
4. **Advance Cooking State (Window B):**
   - Chef taps **"Bump"** on the ticket card:
     - The status advances to **Cooking** (Timer starts ticking).
     - **Look at Window A (Customer):** The timeline automatically animates to **"Chef is Preparing Your Food (በማዘጋጀት ላይ)"** in real time!
5. **Mark Order Ready (Window B):**
   - Chef taps **"Bump"** again:
     - The order disappears from the kitchen cooking pass.
     - The backend broadcasts `order.ready` to floor staff and customer.
6. **Observe Waiter Handheld (Window C) & Customer (Window A):**
   - **Waiter Handheld (Window C):** Chimes with a triple ready alert! The burger appears in the **Kitchen Pass** priority delivery queue with table number badge `Table 04`.
   - **Customer Phone (Window A):** Chimes and pops up the **"Your Food is Ready!"** modal notification!
7. **Deliver the Food (Window C):**
   - Waiter runner walks to Table 04 and taps **`[ MARK DELIVERED ✔ ]`**.
   - **Look at Window A (Customer):** The tracker instantly updates to **"Order Delivered — መልካም ምግብ!"** with a green checkmark!

![MenuFlow Customer Experience Showcase](menuflow_ui_showcase_1790942077060.jpg)
*Figure 2: Customer PWA Experience — Dish Customization, Itemized Invoice Checkout, and Live 4-Step Preparation Progress Tracker.*

---

### 🧪 Test Scenario 3: Bilingual Ethiopic (Ge'ez) & English Switching
1. Open [`http://10.10.4.109:3000/t/demo_token/menu`](http://10.10.4.109:3000/t/demo_token/menu).
2. Tap the floating capsule button in the header: **`[EN | አማ]`**.
3. Tap **`አማ`**:
   - Headers switch to Amharic: *"ምን ማዘዝ ይፈልጋሉ?"*.
   - Categories switch to: *"ምግቦች"* and *"መጠጦች"*.
   - Dish names and ingredients render in clean Ethiopic Ge'ez typography (*ሽክላ ጥብስ*, *የጀበና ቡና*, *የፍስክ በያይነቱ*).
4. Tap **`EN`** to switch back to Latin English typography instantly.

---

### 🧪 Test Scenario 4: Quick 86'ing (Menu Stock Availability)
*Demonstrates instant sold-out synchronization between manager and guests.*

1. Open Manager Dashboard: [`http://10.10.4.109:3000/admin`](http://10.10.4.109:3000/admin).
2. Look at **Card 3 — Menu Items Quick Stock Manager**:
   - Find **"Gomen Be Siga"** or **"Special Kitfo"**.
   - Tap the stock switch to toggle between **In Stock** (🟢) and **Out of Stock** (🔴).
3. On the guest menu, sold-out items are automatically greyed out with an "86'd / Sold Out" badge to prevent customer ordering errors.

---

### 🧪 Test Scenario 5: Cashier Register & Cash Settlement
1. Open Cashier Till: [`http://10.10.4.109:3000/admin/cashier`](http://10.10.4.109:3000/admin/cashier).
2. Review the **Till Balance KPI Cards**:
   - *Pending Cash to Collect* (Orders placed with cash payment).
   - *Settled Till Total* (Verified cash collected today).
3. View the **Live Orders Table**:
   - Look at unpaid cash orders (e.g. Table 04, Table 02).
   - Click **`[ ✓ Mark Cash Paid ]`**:
     - The order moves into the Settled Ledger with a green verified badge.
     - Till total updates immediately.

---

## 4. Verification Checklists

- [x] Go backend API running on port `8080` with RFC 6455 WebSockets.
- [x] Next.js frontend running on port `3000` with bilingual fonts and Tailwind CSS.
- [x] Customer QR menu accessible via table token `/t/demo_token/menu`.
- [x] Live assistance modal operational with 5 request types (Water, Waiter, Cutlery, Bill, Issue).
- [x] Real-time order creation connected to backend `POST /api/v1/orders/create`.
- [x] KDS live socket reception and 2-stage Bump state transitions.
- [x] Waiter handheld ready alerts and 1-tap "Mark Delivered" action.
- [x] Cashier till settlement register operational.
