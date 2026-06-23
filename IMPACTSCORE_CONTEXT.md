# ImpactScore — Build Specification (for AI Agentic IDE)

> Stack: **MERN** (MongoDB, Express, React, Node) + **Cloudinary** for media.
> Source: Digital Heroes PRD v1.0 (Mar 2026) + Stitch design export folder list.
> This is a build spec, not a discussion doc — every PRD requirement below maps to a concrete implementation decision. Ambiguous PRD areas are resolved in §10 as **decisions**, not open questions, so the build can proceed without stalling on them.

---

## 0. How to Use This Document (agent instructions)

1. Read this entire file before writing code.
2. Follow the build order in §11 — don't jump to polish/animation before core data flows (auth → subscription → scores → draws → charity → admin → verification) work end to end.
3. Treat §10 (Decisions) as binding unless the user explicitly overrides one.
4. Every model, route, and business rule below must exist in the final codebase — this spec is the acceptance criteria, not a suggestion.
5. Comment code meaningfully (PRD §15 requires "clean, structured, well-commented codebase" as a graded deliverable).
6. Do not introduce a different database, auth provider, or hosting target than what's specified in §2/§12 without flagging it first.

---

## 1. Product Summary

ImpactScore is a subscription platform that combines:
1. **Golf score tracking** — Stableford scores, 1–45, rolling window of 5.
2. **Monthly draw engine** — lottery-style, using those scores as draw numbers.
3. **Charity giving** — a cut of every subscription funds a user-chosen charity.

Design mandate: must **not** look or feel like a golf website. Lead with charitable impact and emotional storytelling; golf is the underlying mechanic, not the visual identity.

---

## 2. Tech Stack (locked)

| Layer | Choice |
|---|---|
| Frontend | React (Vite) + TypeScript + Tailwind CSS + React Router |
| Backend | Node.js + Express.js + TypeScript |
| Database | MongoDB (Mongoose ODM) — MongoDB Atlas |
| Auth | Custom JWT (access + refresh tokens), bcrypt password hashing |
| Payments | Stripe Billing (subscriptions + webhooks) + Stripe one-time PaymentIntents (voluntary donations) |
| Media storage | Cloudinary — charity images, winner-proof screenshots |
| Email | Nodemailer (SMTP) or Resend API |
| Scheduled jobs | node-cron (monthly draw trigger, subscription status sweep) |
| Animation | Framer Motion |
| Charts (admin reports) | Recharts |

### Suggested dependencies

**server/package.json**
```
express mongoose dotenv cors helmet bcrypt jsonwebtoken cookie-parser
multer cloudinary multer-storage-cloudinary stripe nodemailer
node-cron express-validator morgan express-rate-limit
```

**client/package.json**
```
react react-dom react-router-dom axios tailwindcss framer-motion
@stripe/stripe-js @stripe/react-stripe-js react-hook-form zod
recharts lucide-react date-fns
```

---

## 3. Repository Structure

```
impactscore/
├── client/
│   └── src/
│       ├── pages/
│       │   ├── public/        Homepage, CharityDirectory, CharityProfile, HowItWorks
│       │   ├── auth/          Login, Register
│       │   ├── subscriber/    Dashboard, ScoreEntry, DrawResults, ProofUpload, SubscriptionSuccess
│       │   └── admin/         AdminDashboard, UserManagement, DrawManagement,
│       │                      CharityManagement, WinnerVerification, ReportsAnalytics, AdminSettings
│       ├── components/        shared UI (Navbar, ProtectedRoute, AdminRoute, ImpactCounter, etc.)
│       ├── context/           AuthContext (JWT, current user, role)
│       ├── api/               axios instance + per-resource API modules
│       └── App.tsx
├── server/
│   └── src/
│       ├── models/            User, Subscription, Charity, Score, Draw, DrawTicket, Winner, Donation, PlatformSetting
│       ├── routes/            auth, subscriptions, scores, charities, draws, winners, donations, admin, webhooks
│       ├── controllers/       one per route group
│       ├── middleware/        auth.js, requireAdmin.js, requireActiveSubscription.js, errorHandler.js, upload.js
│       ├── services/          drawEngine.js, prizePoolCalculator.js, stripeService.js, cloudinaryService.js, emailService.js
│       ├── jobs/               monthlyDraw.cron.js, subscriptionSweep.cron.js
│       ├── config/             db.js, cloudinary.js, stripe.js
│       ├── app.js
│       └── server.js
├── .env.example
└── README.md
```

---

## 4. Environment Variables

**server/.env**
```
PORT=5000
MONGODB_URI=
JWT_SECRET=
JWT_REFRESH_SECRET=
JWT_EXPIRES_IN=15m
REFRESH_EXPIRES_IN=7d
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID_MONTHLY=
STRIPE_PRICE_ID_YEARLY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL_API_KEY=
EMAIL_FROM=
CLIENT_URL=
```

**client/.env**
```
VITE_API_BASE_URL=
VITE_STRIPE_PUBLISHABLE_KEY=
```

---

## 5. User Roles & Permissions

| Capability | Public Visitor | Subscriber | Admin |
|---|---|---|---|
| View homepage, "how it works," charity directory | ✓ | ✓ | ✓ |
| Initiate subscription | ✓ | — | — |
| Manage profile/settings | — | ✓ | ✓ (self) |
| Enter/edit/delete scores | — | ✓ | ✓ (on behalf of user) |
| Select charity + contribution % | — | ✓ | — |
| Make a voluntary one-off donation | ✓ (or ✓ subscriber) | ✓ | — |
| View participation summary & winnings | — | ✓ | — |
| Upload winner proof screenshot | — | ✓ (if a winner) | — |
| Manage users & subscriptions | — | — | ✓ |
| Configure/simulate/publish draws | — | — | ✓ |
| CRUD charities & their media/events | — | — | ✓ |
| Review winner submissions, mark payouts | — | — | ✓ |
| View reports & analytics | — | — | ✓ |
| Change platform settings (pool %, charity min %, draw cadence) | — | — | ✓ |

Enforce with Express middleware: `requireAuth` (verifies JWT → `req.user`), `requireAdmin`, `requireActiveSubscription` (checked on **every** authenticated subscriber route per PRD §04's real-time validation requirement).

---

## 6. Database Schema (Mongoose)

```js
// User
const userSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  fullName: String,
  role: { type: String, enum: ['subscriber', 'admin'], default: 'subscriber' },
  createdAt: { type: Date, default: Date.now }
});

// Subscription
const subscriptionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: String, enum: ['monthly', 'yearly'], required: true },
  status: { type: String, enum: ['active', 'cancelled', 'lapsed'], default: 'active' },
  stripeCustomerId: String,
  stripeSubscriptionId: String,
  currentPeriodEnd: Date,
  renewalDate: Date,
  charity: { type: Schema.Types.ObjectId, ref: 'Charity' },
  charityContributionPct: { type: Number, default: 10, min: 10 }, // PRD §08: min 10%, user can raise
  createdAt: { type: Date, default: Date.now }
});

// Charity
const charitySchema = new Schema({
  name: { type: String, required: true },
  description: String,
  images: [String],            // Cloudinary URLs
  upcomingEvents: [{ title: String, date: Date, location: String, description: String }],
  isFeatured: { type: Boolean, default: false }, // homepage spotlight, PRD §08
  isActive: { type: Boolean, default: true }
});

// Score — rolling window of 5, one per date (PRD §05, §13)
const scoreSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  value: { type: Number, required: true, min: 1, max: 45 },
  playedOn: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});
scoreSchema.index({ user: 1, playedOn: 1 }, { unique: true });

// Draw — one per month (PRD §06)
const drawSchema = new Schema({
  drawMonth: { type: Date, required: true },
  logicType: { type: String, enum: ['random', 'algorithmic'], required: true },
  algorithmicBias: { type: String, enum: ['favor_frequent', 'favor_rare'], default: 'favor_frequent' },
  status: { type: String, enum: ['draft', 'simulated', 'published'], default: 'draft' },
  winningNumbers: { type: [Number], required: true }, // 5 unique numbers, 1-45
  prizePoolTotal: { type: Number, required: true },
  poolByTier: {
    fiveMatch: Number, // 40%
    fourMatch: Number, // 35%
    threeMatch: Number // 25%
  },
  jackpotRollover: { type: Number, default: 0 },
  simulationResult: Schema.Types.Mixed, // stored pre-publish dry-run output
  publishedAt: Date,
  runByAdmin: { type: Schema.Types.ObjectId, ref: 'User' }
});

// DrawTicket — snapshot of a user's 5 scores at draw time
const drawTicketSchema = new Schema({
  draw: { type: Schema.Types.ObjectId, ref: 'Draw', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  numbers: { type: [Number], required: true },
  matchCount: Number
});
drawTicketSchema.index({ draw: 1, user: 1 }, { unique: true });

// Winner / payout (PRD §09)
const winnerSchema = new Schema({
  draw: { type: Schema.Types.ObjectId, ref: 'Draw', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  matchType: { type: Number, enum: [3, 4, 5], required: true },
  prizeAmount: { type: Number, required: true },
  proofUrl: String,             // Cloudinary URL, screenshot of scores
  verificationStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  verifiedAt: Date,
  rejectionReason: String
});

// Donation — subscription-linked AND independent voluntary (PRD §08)
const donationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' }, // null if anonymous public donation
  charity: { type: Schema.Types.ObjectId, ref: 'Charity', required: true },
  amount: { type: Number, required: true },
  source: { type: String, enum: ['subscription_pct', 'voluntary'], required: true },
  stripePaymentIntentId: String,
  createdAt: { type: Date, default: Date.now }
});

// PlatformSetting — admin-configurable values (PRD §11 admin_settings)
const platformSettingSchema = new Schema({
  key: { type: String, required: true, unique: true },
  value: Schema.Types.Mixed
});
// Seed keys: poolContributionPct, charityMinPct (default 10), drawDayOfMonth,
// drawTimezone, currency (default 'INR'), platformFeePct
```

---

## 7. Feature Specifications

### 7.1 Subscription & Payments (PRD §04)
- Plans: monthly, yearly (discounted rate — discount % stored in `PlatformSetting`).
- Stripe Checkout for signup; Stripe Customer Portal or custom UI for cancel/upgrade.
- Non-subscribers: restricted access — score entry, charity selection, dashboard, and draw participation all gated behind `requireActiveSubscription`.
- Lifecycle states: `active`, `cancelled`, `lapsed`. Stripe webhooks (`checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.deleted`) are the source of truth.
- **Acceptance criteria**: subscribing creates a `Subscription` doc + Stripe customer/subscription; a lapsed payment flips status to `lapsed` within one webhook cycle; every protected route re-validates status server-side (not from a cached client flag).

### 7.2 Score Management (PRD §05, §13)
- Score input: value 1–45, with a date, via `score_entry` page.
- Rolling window: exactly 5 retained; inserting a 6th deletes the oldest by `playedOn`.
- One score per date: duplicate date on insert → reject with a clear error directing the user to edit instead; existing entries can only be edited or deleted, never duplicated.
- Display: reverse chronological.
- **Acceptance criteria**: inserting a 6th score always leaves exactly 5 in the DB; attempting a duplicate date returns a 409-style validation error, not a silent overwrite.

### 7.3 Draw & Reward Engine (PRD §06)
- Tiers: 5-, 4-, and 3-number match.
- Logic modes: `random` (uniform random 5 numbers, 1–45, no repeats) or `algorithmic` (weighted by score frequency across all active subscribers — see §10.4 for the exact algorithm).
- Monthly cadence, admin-triggered or cron-triggered.
- **Simulation mode is mandatory before publish**: admin runs `/api/admin/draws/simulate`, which computes results against current tickets without writing to `Winner` or notifying anyone, returning a preview (tier counts, total payout, jackpot status).
- Publishing locks the draw, generates `Winner` records, and triggers winner-alert emails.
- Jackpot rollover: if no 5-match winner, that tier's pool share carries into next month's `jackpotRollover`.
- **Acceptance criteria**: simulate is idempotent and side-effect-free; publish is one-way (status `simulated → published`, no un-publish); rollover amount is visible in the next month's draw before it's run.

### 7.4 Prize Pool Logic (PRD §07)
- Fixed split: 5-match 40%, 4-match 35%, 3-match 25% — hardcode this split (PRD states it's "pre-defined and enforced automatically," not admin-editable).
- Pool size = active subscriber count × subscription fee × `poolContributionPct` (admin-configurable, see §10.2 for default).
- Multiple winners in the same tier split that tier's prize equally.
- **Acceptance criteria**: pool total recalculates from live active-subscriber count at simulation/publish time, not a stale cached number.

### 7.5 Charity System (PRD §08)
- Signup requires selecting a charity; minimum 10% of subscription fee goes to it; user can raise this % anytime from their dashboard.
- **Independent donation**: a separate one-off donation flow (Stripe PaymentIntent), not tied to subscription or gameplay — accessible from a charity's profile page, available to both subscribers and public visitors.
- Charity directory: list + search/filter by name/cause.
- Charity profile: description, image gallery, upcoming events (e.g., golf days).
- Homepage featured/spotlight charity section — pulls charities where `isFeatured: true`.
- **Acceptance criteria**: raising contribution % updates future billing cycles' donation calculation; a voluntary donation never touches `Subscription.charityContributionPct`.

### 7.6 Winner Verification (PRD §09)
- Applies only to confirmed winners post-draw.
- User uploads a screenshot proof (Cloudinary) of their scores from the platform.
- Admin reviews: approve or reject (with optional reason).
- Payment states: `pending → paid`, set manually by admin once payout is sent (no automated payout transfer required by PRD).
- **Acceptance criteria**: a winner cannot be marked `paid` while `verificationStatus` is `pending` or `rejected`.

### 7.7 User Dashboard (PRD §10)
Must surface, in one view: subscription status + renewal date; score entry/edit; selected charity + contribution %; participation summary (draws entered, upcoming draw date); winnings overview (total won, current payment status per win).

### 7.8 Admin Dashboard (PRD §11)
- **User management**: view/edit profiles, edit a user's scores, manage their subscription state.
- **Draw management**: configure logic type + bias, run simulation, publish.
- **Charity management**: full CRUD + media/content management.
- **Winners management**: full winners list, verify submissions, mark payouts complete.
- **Reports & analytics**: total users, total prize pool (current + historical), charity contribution totals, draw statistics (entries per draw, win rate per tier, etc.) — render with Recharts.
- **Admin settings**: pool contribution %, charity minimum %, draw cadence/day, currency.

### 7.9 UI/UX (PRD §12)
- No golf clichés as primary visual language (no fairway/plaid/club-head motifs dominating the design system).
- Homepage sequence: what you do → how you win → charity impact → subscribe CTA.
- Subtle Framer Motion transitions/micro-interactions throughout (number reveals on draw results, animated impact counters on homepage).
- Subscribe CTA must be persistently visible and visually prominent.

### 7.10 Technical/Non-functional (PRD §13)
- Mobile-first, fully responsive (Tailwind breakpoints).
- Performance: code-split routes, optimize/compress images before Cloudinary upload, lazy-load below-fold content.
- Auth: JWT, HTTPS enforced (handled at hosting layer).
- Email notifications: subscription confirmation/renewal/cancellation, draw published, you-won alert, winner verification status change.

### 7.11 Scalability Hooks (PRD §14)
- Currency/locale as a `PlatformSetting`, not hardcoded.
- `role` field and middleware abstracted so a future `team`/`corporate` role can be added without restructuring auth.
- `PlatformSetting` collection doubles as the hook for a future campaign module / feature flags.
- Keep all business logic (draw engine, pool calc, donation calc) in `server/src/services/` — reusable by a future mobile client hitting the same API.

---

## 8. Page Inventory — Stitch Designs → Routes

| Design folder | Route | Notes |
|---|---|---|
| `impactscore_homepage` | `/` | Includes `impact_momentum` section inline |
| `impact_momentum` | `/` (homepage section) | Animated impact counters, spotlight charity |
| `charity_selection` | `/charities`, `/charities/:id` | Directory + profile, includes voluntary donate CTA |
| `subscription_success` | `/subscribe/success` | Post-checkout; routes into charity-selection onboarding if not yet set |
| `score_entry` | `/dashboard/scores` | |
| `user_dashboard` | `/dashboard` | |
| `draw_results` | `/draws`, `/draws/:id` | |
| `winner_verification` | `/dashboard/winnings/upload` (subscriber) **and** `/admin/winners` (admin review) | One design asset, two implemented views — both required |
| `admin_dashboard` | `/admin` | |
| `admin_settings` | `/admin/settings` | |
| `user_management` | `/admin/users` | |
| `draw_management` | `/admin/draws` | |
| `charity_management` | `/admin/charities` | |
| `reports_analytics` | `/admin/reports` | |

---

## 9. Express API Contracts

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout

POST   /api/subscriptions/checkout       create Stripe checkout session
POST   /api/webhooks/stripe              raw-body, syncs subscription + records donations

GET    /api/scores
POST   /api/scores
PUT    /api/scores/:id
DELETE /api/scores/:id

GET    /api/charities
GET    /api/charities/:id
PUT    /api/me/charity                   set charity + contribution %
POST   /api/donations                    one-off voluntary donation (Stripe PaymentIntent)

GET    /api/draws                        published draws
GET    /api/draws/:id
GET    /api/me/draw-entries              user's own ticket/match history

POST   /api/winners/:id/proof            upload screenshot (Cloudinary, multer)
GET    /api/me/winnings

GET    /api/admin/users
PUT    /api/admin/users/:id
PUT    /api/admin/users/:id/scores/:scoreId
PUT    /api/admin/subscriptions/:id

POST   /api/admin/draws/simulate
POST   /api/admin/draws/publish
GET    /api/admin/draws

POST   /api/admin/charities
PUT    /api/admin/charities/:id
DELETE /api/admin/charities/:id

GET    /api/admin/winners
PUT    /api/admin/winners/:id/verify
PUT    /api/admin/winners/:id/payout

GET    /api/admin/reports/overview
GET    /api/admin/settings
PUT    /api/admin/settings
```

`requireAuth` on everything except `auth/*`, public charity GETs, and webhooks. `requireAdmin` on all `/api/admin/*`.

---

## 10. Decisions (binding defaults for genuinely unspecified PRD areas)

1. **Draw numbers = stored scores.** A user's current 5 scores (1–45) are their draw ticket each month. This is the only reading consistent with the PRD's score range matching a standard 5/45 lottery format.
2. **Pool contribution default**: `poolContributionPct = 50` (i.e., 50% of subscription revenue → prize pool, 10%+ → charity per user setting, remainder → platform). Stored in `PlatformSetting`, editable in Admin Settings. Change if stakeholder specifies otherwise.
3. **Algorithmic draw weighting**: count frequency of each number (1–45) across all current `Score` documents. `favor_frequent` weights selection probability proportional to frequency; `favor_rare` weights it inversely. Use weighted sampling without replacement to pick 5 unique numbers. Admin picks the bias per draw.
4. **Currency**: default `INR`, stored in `PlatformSetting`, editable.
5. **Draw cadence**: default last day of the month, 23:59 in the configured timezone, via cron; admin can override the day in Settings and can always trigger a manual run.
6. **Hosting**: frontend → Vercel (satisfies PRD §15's literal Vercel requirement); backend Express API → Render (supports persistent processes and cron, which Vercel serverless does not); database → MongoDB Atlas (new project, not personal); media → Cloudinary. This substitutes for the PRD's Supabase example, which §15 itself frames as an example ("e.g. Supabase") for the database requirement.
7. **`winner_verification` covers two views** (subscriber upload + admin review) per PRD §09/§11, even though there's one design asset.

---

## 11. Build Order

1. **Foundation** — repo scaffold, Mongo connection, User model, JWT auth (register/login/refresh), role middleware.
2. **Subscriptions** — Stripe checkout + webhooks, `requireActiveSubscription` middleware, subscription lifecycle states.
3. **Scores** — CRUD with rolling-window + one-per-date rules.
4. **Charities** — CRUD, directory, profile, featured section, voluntary donations.
5. **Draw engine** — ticket snapshotting, random + algorithmic logic, simulation, publish, jackpot rollover, prize pool calculator.
6. **Winner verification** — proof upload (Cloudinary), admin review, payout state.
7. **Dashboards** — user dashboard, admin dashboard (users, draws, charities, winners, reports, settings).
8. **UI/UX pass** — homepage emotional narrative, Framer Motion micro-interactions, mobile responsiveness audit.
9. **Notifications** — email triggers for all events listed in §7.10.
10. **Deploy** — Vercel (client), Render (server), Atlas (DB), Cloudinary (media); configure env vars; smoke-test both test accounts (subscriber + admin).

---

## 12. Testing Checklist (verbatim, PRD §16 — acceptance criteria for the whole build)

- [ ] Signup & login
- [ ] Subscription flow — monthly and yearly
- [ ] Score entry — 5-score rolling logic, one-per-date
- [ ] Draw system logic and simulation
- [ ] Charity selection and contribution calculation
- [ ] Winner verification flow and payout tracking
- [ ] User Dashboard — all modules functional
- [ ] Admin Panel — full control and usability
- [ ] Data accuracy across all modules
- [ ] Responsive design on mobile and desktop
- [ ] Error handling and edge cases

---

## 13. Mandatory Deliverables (PRD §15)

- [ ] Live, publicly accessible URL
- [ ] User panel with working test credentials (signup/login/score entry/dashboard)
- [ ] Admin panel with working admin credentials (user mgmt, draw system, charities, winner verification)
- [ ] MongoDB Atlas database, new project, proper schema (substituting Supabase per §10.6)
- [ ] Clean, structured, well-commented source code
- [ ] All env vars properly configured on the deployed instances
