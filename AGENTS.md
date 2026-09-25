<!-- bmad:context -->
<!-- Verified 2026-09-22 (no commits yet — repo to be initialized after the app is built). Managed by bmad-project-context; edits inside this block are replaced on refresh. Keep anything you want preserved outside the markers. -->

## MenuFlow

QR-code digital menu and ordering platform for Ethiopian restaurants and cafes. Decided stack: **Go** backend (REST + native WebSockets for real-time), Next.js frontends (customer PWA, KDS, waiter, admin), PostgreSQL, Redis. Product planning and the implementation brief live in `plan.md`.

## Policy

- Never store raw card/wallet credentials — payments use provider-hosted checkout/tokenized flows only.
- Payment webhooks must be idempotent — providers may resend the same confirmation.
- Every table, menu item, order, and staff account is scoped to a `restaurant_id`; keep tenants strictly isolated.
- QR codes encode an opaque/signed token, never raw sequential IDs; enforce RBAC on all staff endpoints.

## Where things are

- Product & technical brief: `plan.md` (stack, data model, order lifecycle state machine).
- `plan.md` §7 lists unresolved build questions (multi-tenant vs single build, Chapa vs Telebirr, cash fallback, customer phone) — resolve before implementing; never guess.

## Running and verifying

- No code yet. Build is TODO per `plan.md`: Go service (REST + WebSockets), Next.js frontends, PostgreSQL, Redis. Verify the real commands on the first refresh after code lands.

## Known pitfalls

- `plan.md` duplicates the full document; the first copy (~lines 1–240) names a stale Node/React stack. The Go + Next.js stack is authoritative.

<!-- /bmad:context -->