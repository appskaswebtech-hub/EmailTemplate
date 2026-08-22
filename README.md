# Kaswebtech Feedback Platform

Central feedback collection system for every Kaswebtech Shopify app (WishKeeper, StockPing,
CartPulse, and any future app). Shopify apps call one authenticated API to trigger a branded
feedback-request email; merchants submit feedback on a hosted webpage; Kaswebtech staff review
everything in an admin dashboard.

No application is hardcoded — every app's name, logo, brand color, and API key lives in the
`Application` database table and is managed from `/admin/applications`.

## Stack

Next.js 14 (App Router, TypeScript) · Prisma + MySQL · NextAuth (admin login) · Gmail SMTP +
React Email (feedback-request email) · Tailwind CSS · Recharts (dashboard charts)

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Fill in:
   - `DATABASE_URL` — a MySQL connection string
   - `SMTP_USER` — the Gmail address to send from
   - `SMTP_PASS` — a Gmail **App Password** (myaccount.google.com/apppasswords), not your normal
     password. Requires 2-Step Verification to be enabled on the Google account first. Gmail SMTP
     has sending limits (~500/day on a free account) — fine for low volume/testing, but for real
     production volume swap `src/lib/email/smtp.ts` for a transactional provider (Resend, SES,
     Postmark, etc.) with a verified sending domain.
   - `EMAIL_FROM` — optional, defaults to `SMTP_USER`
   - `NEXTAUTH_SECRET` — `openssl rand -base64 32`
   - `APP_BASE_URL` — the public URL this app is served from (used to build feedback links —
     must be publicly reachable in production)
   - `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` — the first admin dashboard login, used only by the seed script

3. **Run migrations and seed data**

   ```bash
   npx prisma migrate dev --name init
   npm run db:seed
   ```

   The seed script creates your admin user and the **WishKeeper** application, and prints its
   API key to the console once — copy it somewhere safe, it is stored hashed and cannot be
   retrieved again (use "Regenerate API key" in the admin UI if it's lost).

4. **Run the app**

   ```bash
   npm run dev
   ```

   Admin dashboard: http://localhost:3000/admin (sign in with the seed admin credentials).

## Integrating a Shopify app

Any Shopify app (existing or future) integrates with three steps:

1. In `/admin/applications`, create an application entry **once** (name, logo URL, brand
   color). This is the only place that app's branding is ever set — it returns an API key,
   which you store as a secret in that Shopify app's environment, never in client-side code.
2. When a merchant should be asked for feedback (e.g. after N days of usage), call — note the
   body only needs to describe the *merchant*, not the app, since the API key already identifies
   which app (and therefore which name/logo/color) this is for:

   ```bash
   curl -X POST https://your-feedback-platform.example.com/api/v1/feedback-requests \
     -H "Content-Type: application/json" \
     -H "x-api-key: kw_live_xxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
     -d '{
       "merchantName": "Adom",
       "merchantEmail": "adom@example-store.com",
       "shopDomain": "example-store.myshopify.com"
     }'
   ```

   This creates the merchant record (if new), sends the branded feedback-request email via
   Gmail SMTP, and returns `{ "requestId": "...", "feedbackUrl": "..." }`.

3. That's it — the platform handles the feedback webpage, storage, and admin dashboard for you.
   No other code change is needed to add a new app; everything above is data, not code.

## Architecture notes / extension points

- **Feedback vs. FeatureRequest** are separate tables so feature suggestions can later carry
  their own lifecycle (`NEW → PLANNED → IN_PROGRESS → COMPLETED`) and a `votes` count for
  feature voting, without reshaping the core feedback table.
- **FeedbackRequest** doubles as the email-send log (`status`, `resendMessageId` — the SMTP
  message ID — `error`) and
  as the source of the unguessable token used in `/feedback/[token]` links — a natural place
  to later add scheduling (`sendAt`) or follow-up emails.
- **API keys** are bcrypt-hashed at rest; only a non-secret lookup prefix is stored in
  plaintext. The plaintext key is shown exactly once, at creation or regeneration time.
- **Rate limiting** (`src/lib/rate-limit.ts`) is an in-memory token bucket — fine for a single
  Node instance; swap for a shared store (e.g. Upstash Redis) before scaling horizontally.
- Adding **NPS surveys**, **email scheduling**, or **customer segmentation** later fits this
  schema without breaking changes: they're additive tables/columns, not a redesign.

## Useful commands

```bash
npm run db:studio   # browse the database with Prisma Studio
npm run build        # production build + typecheck
```
