# anb simulation app

A mobile banking app **simulation** inspired by the **anb – Arab National Bank** app.
It recreates the layout, navigation and green/teal brand feel of a modern Saudi
banking app, with fully interactive (but entirely mock) functionality — no real
banking, accounts, or network calls are involved.

> ⚠️ This is a demo/educational project. It is **not** affiliated with, endorsed by,
> or connected to Arab National Bank. All names, numbers, IBANs and balances are
> fictional sample data.

Built with **Expo (React Native) + TypeScript** and **expo-router** (file-based
navigation).

---

## ✨ Features

| Area | What's included |
| --- | --- |
| **Onboarding & auth** | Animated splash, 3-slide onboarding, 4-digit passcode login (`1234`) with error shake + simulated biometric unlock |
| **Home dashboard** | Gradient header, total balance with hide/show, quick actions, accounts carousel, spending-vs-budget insight, card preview, recent activity |
| **Accounts** | List of current / savings / investment accounts, per-account detail screen with IBAN, balances, action bar and grouped transaction history |
| **Cards** | Realistic Visa / Mastercard / mada card visuals, freeze/unfreeze, show card number, spending controls (online, contactless, international), credit-limit usage |
| **Transfers** | Between own accounts, to anb, local (SARIE/IPS) and international — with account picker, beneficiary selection, amount validation, review & confirm, animated success + reference number |
| **Pay bills** | Due-soon billers, categories grid, saved billers, and a full pay flow that debits the account |
| **Beneficiaries** | Local / international tabs, add via bottom sheet, quick-send, remove |
| **Transactions** | Full history with search, income/expense filters and date grouping (Today / Yesterday / date), plus a transaction detail screen |
| **More / Profile** | Grouped services menu, profile screen, notifications feed, and log out |

State is held in a lightweight React context (`src/state/AppContext.tsx`) so actions
feel real: transfers and bill payments actually reduce the source account balance and
appear at the top of the transaction list; freezing a card updates it everywhere.

---

## 🎨 Design

The brand identity (anb's green/teal look) is defined in a single source of truth:
[`src/theme.ts`](./src/theme.ts). Change the `colors` there to re-skin the whole app.

- Primary: `#0B7D6E` (anb green/teal)
- Gradients, neutrals, status colours, spacing, radii, typography and shadows are all tokenised.

App icons and the splash image are generated programmatically (see the note in
`assets/`) so the repo stays self-contained.

---

## 🚀 Getting started

Requirements: Node 18+ and the [Expo](https://docs.expo.dev/) tooling.

```bash
# install dependencies
npm install

# start the dev server
npm start
```

Then:

- Press **`i`** for the iOS simulator, **`a`** for an Android emulator, or **`w`** for web.
- Or scan the QR code with the **Expo Go** app on your phone.

**Demo login:** passcode **`1234`**, or tap the fingerprint icon for simulated
biometric login.

Other scripts:

```bash
npm run typecheck   # tsc --noEmit
npm run web         # run in the browser
```

---

## 🗂️ Project structure

```
app/                      # expo-router screens (file-based routes)
  _layout.tsx             # root stack + providers
  index.tsx               # animated splash → routes onward
  onboarding.tsx
  login.tsx               # passcode / biometric
  (tabs)/                 # bottom tab navigator
    _layout.tsx
    index.tsx             # Home dashboard
    accounts.tsx
    transfers.tsx
    cards.tsx
    more.tsx
  account/[id].tsx        # account detail
  card/[id].tsx           # card detail & controls
  transfer/               # multi-step transfer flow
    new.tsx · confirm.tsx · success.tsx
  bill/[id].tsx           # pay a bill
  bills.tsx · transactions.tsx · beneficiaries.tsx
  transaction/[id].tsx · profile.tsx · notifications.tsx · coming-soon.tsx
src/
  theme.ts                # design tokens (brand colours, spacing, type)
  components/              # Screen, AppHeader, BankCard, TransactionRow, ui primitives …
  data/                   # types + mock banking data
  state/AppContext.tsx    # in-memory app state & actions
  utils/format.ts         # currency / date / masking helpers
assets/                   # generated icon & splash
```

---

## 🧭 Notes & limitations

- Everything runs locally in memory — nothing is persisted between app restarts and
  there are no network requests.
- Screens marked "Coming soon" are intentional placeholders for secondary features.
- This project is for demonstration and learning only.
