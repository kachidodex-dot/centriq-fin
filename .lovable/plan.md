# Ryport Email Intelligence Engine — MVP Plan

This is a large, multi-system feature (OAuth, token storage, email scanning, extraction, AI categorization, insights, sync orchestration, plan gating). I'll build it in **4 phases** so each phase is shippable and reviewable. Confirm the plan and I'll start Phase 1 immediately.

## Architecture overview

```text
Gmail (OAuth)
   │  access/refresh tokens (encrypted in DB)
   ▼
[email_accounts] ──► Sync worker (serverFn + pg_cron)
                       │
                       ▼
                 Gmail API search  (last 90d, financial filters)
                       │
                       ▼
              Provider parsers (Paystack / Flutterwave / GTBank /
              Access / Opay / Moniepoint / PalmPay / generic receipt)
                       │
                       ▼
              Extraction result {amount, currency, merchant, type,
              date, ref, confidence, category_guess}
                       │
                       ▼
        Dedup (ref OR amount+merchant+date hash)
                       │
                       ▼
              [transactions] (+ source='email', confidence, msg_id)
                       │
                       ▼
              AI Insights engine (Lovable AI Gateway)
                       │
                       ▼
              Dashboard + Insights panel (real-time)
```

## Database (new tables + columns)

- `email_accounts` — id, user_id, provider ('gmail'), email, access_token (encrypted), refresh_token (encrypted), token_expires_at, status, last_synced_at, last_history_id, scopes, created_at
- `email_sync_jobs` — id, account_id, status (queued/running/success/failed), started_at, finished_at, processed_count, imported_count, error
- `email_imported_messages` — id, account_id, gmail_message_id (unique), transaction_id (nullable), parsed_status, parser_name, created_at — for dedup at the message level
- `transactions` (extend) — `source` ('manual'|'email'), `email_message_id`, `email_account_id`, `confidence` (0-1), `merchant`, `reference`, `currency`, `imported_at`, `needs_review` (bool)
- `user_plans` — user_id, plan ('free'|'pro'|'advanced'), updated_at (foundation for gating)
- All tables: RLS scoped to `auth.uid()`, proper GRANTs, service_role full access for server fns.

## Server / backend

- **Google OAuth** via Lovable broker (`lovable.auth.signInWithOAuth("google", { extraParams: { scope: "...gmail.readonly", access_type: "offline", prompt: "consent" }})`) — OR direct Google OAuth client flow if broker scopes don't cover Gmail. I'll verify and choose the working path before implementing.
- Token encryption helper using `SUPABASE_SERVICE_ROLE_KEY`-derived key (AES-GCM via Node `crypto`).
- Server functions (`createServerFn` with `requireSupabaseAuth`):
  - `connectGmail`, `disconnectGmail`, `getEmailAccounts`
  - `triggerSync(accountId)` — manual sync
  - `getSyncStatus(accountId)`
  - `getAiInsights()` — calls Lovable AI Gateway
- Internal server route `/api/public/cron/sync-emails` (HMAC-protected) called by pg_cron every 15 min to sync all connected accounts incrementally (using Gmail `historyId`).
- **Provider parser registry** in `src/lib/email-parsers/` — one file per provider exporting `{ match(headers, body), parse(msg) => ExtractionResult }`. New providers = drop-in file, zero core changes.
- AI fallback parser: when no rule-based parser matches a financial-looking email, call Lovable AI (`google/gemini-3-flash-preview`) with JSON-schema output to extract fields + confidence.

## Frontend

- **Settings → Email Integrations** page: connect Gmail button, account list, connection status badge, Last Synced, Sync Now, Disconnect, Reconnect.
- **Dashboard**: existing widgets auto-pick up new `transactions` rows; add small "Synced X mins ago" indicator.
- **AI Insights panel** (new section on dashboard): trend cards generated from real data + AI summary lines ("Transport up 18% MoM", "₦45,000 on subscriptions", etc.).
- **Transactions table**: badge for "Email Imported", warning icon for low confidence (`needs_review`), edit/delete/recategorize all keep working.
- Plan gating UI scaffolding (free = 1 account, pro = many) — enforced server-side too.

## Security

- Tokens encrypted at rest, never returned to client.
- All Gmail API calls happen server-side only.
- OAuth state param verified.
- RLS on every new table.
- Cron endpoint protected by HMAC shared secret (added via `add_secret`).
- Minimum Gmail scope: `gmail.readonly` (read-only, no send/modify).

## Phased delivery

**Phase 1 — Foundation (this turn)**
- DB migration for all new tables + transaction columns + RLS + grants.
- Token encryption helper.
- `email_accounts` server fns (CRUD).
- Settings → Email Integrations page UI (Connect button stubbed; account list, status, disconnect work).
- Plan table seeded with 'free' for all users.

**Phase 2 — Gmail OAuth + manual sync**
- Working Google OAuth (Gmail scope).
- `triggerSync` pulls last 90 days, runs through Paystack + Flutterwave + GTBank + generic receipt parsers.
- Dedup + auto-insert transactions with `source='email'`, confidence, `needs_review` flag.
- Sync status surfaced in UI.

**Phase 3 — All providers + AI fallback parser + categorization**
- Add Access, Opay, Moniepoint, PalmPay, subscription/invoice parsers.
- AI fallback extraction for unmatched financial-looking emails.
- Smart categorization (rules + AI for low-confidence).

**Phase 4 — Background sync + AI Insights panel + plan gating**
- pg_cron + `/api/public/cron/sync-emails` for incremental sync.
- AI Insights panel on dashboard (trends, subscription tracking, anomalies).
- Plan-based feature gating (1 vs many accounts, advanced insights).

## Open questions (answer inline or I'll pick the default)

1. **Default currency for parsed transactions when not detected**: use the user's profile currency (default). OK?
2. **Auto-import vs review queue**: spec says auto-import even at low confidence, just flag `needs_review`. Confirmed.
3. **Categories**: spec lists Food, Transport, Utilities, Salary, Marketing, Software, Subscription, Inventory, Operations, Miscellaneous. Current DB enum is smaller. I'll extend the `transaction_category` enum in Phase 1 — OK?
4. **Multi-account on free plan**: enforced as 1 connected Gmail per user on free; Pro/Advanced unlimited. OK?

Reply "go" (or with answers) and I'll start Phase 1 immediately.
