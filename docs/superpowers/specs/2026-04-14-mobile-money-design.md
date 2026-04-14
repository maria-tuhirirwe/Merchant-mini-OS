# Mobile Money Transaction Feature — Design Spec

**Date:** 2026-04-14  
**Status:** Approved  
**Scope:** Add Transaction page — new Mobile Money entry mode

---

## 1. Overview

Extend the existing Add Transaction page (`/add`) with a Mobile Money entry mode. Users choose between Manual Entry and Mobile Money using two large tap-card tiles at the top of the page. The Mobile Money mode captures payment-provider details while still requiring category, date, and reason for record-keeping.

All logic is frontend-only with simulated async behaviour. The implementation is API-ready: provider calls are isolated behind a single async function that can be swapped for a real integration later.

---

## 2. Decisions Made

| Decision | Choice | Reason |
|---|---|---|
| Mode switcher layout | Big tap-card tiles (two columns) | Most visible, unmissable for first-time users |
| Mobile Money form layout | Pill provider selector + single grouped field list | Compact, touch-friendly, less scanning |
| Provider auto-detection | Yes — from phone prefix | 077x/078x → MTN · 075x/070x → Airtel |
| Pending state presentation | Modal overlay over the form | Keeps context visible; user can cancel without losing their form data |
| States to implement | Default, Loading, Pending, Success, Failed | Per spec |

---

## 3. Page Structure

### 3.1 Mode Selector (top of page, always visible)

Two equal-width tap cards rendered as a grid at the top of the Add Transaction page, replacing the current segmented control. The selected card gets a teal border and teal-tinted background; the unselected card is muted with a dashed border.

```
┌─────────────────┐  ┌─────────────────┐
│  ✏️              │  │  📱              │
│  Manual Entry   │  │  Mobile Money   │
│  Type it in     │  │  MTN · Airtel   │
└─────────────────┘  └─────────────────┘
```

**Selected state:**
- Active card: `border-teal-500 bg-teal-50/80 text-teal-700`
- Inactive card: `border-dashed border-navy-200 text-navy-400 opacity-60`

---

### 3.2 Manual Entry Mode (unchanged)

When Manual Entry is selected, show the existing form exactly as it is today:
- Transaction type segmented control (Money In / Money Out)
- Amount field
- Category selector
- Date field
- Note textarea
- Submit button
- Quick amount chips

No changes to this mode.

---

### 3.3 Mobile Money Mode — Form Fields

Shown in order, all in a single glass card:

#### Provider pills (full-width row)
Two pill buttons side by side. Auto-selected based on phone prefix. Manual override always allowed.

- **MTN MoMo pill** — yellow border (`#FFCC00`), yellow-tinted bg when active
- **Airtel Money pill** — red border (`#EF4444`), red-tinted bg when active
- Unselected pill: dashed navy border, muted

#### Transaction type toggle
Segmented control: `↑ Money In` / `↓ Money Out`

#### Amount field
Large numeric input, `USh` left icon, same quick-amount chips as manual mode below the card.

#### Phone number field
- Label: "Phone number"
- `type="tel"`, `inputMode="numeric"`, `placeholder="e.g. 0772 000 000"`
- On change: strip non-digits, detect prefix, auto-select provider pill
- Prefix rules: `077`, `078` → MTN · `075`, `070` → Airtel
- Show a small inline chip next to the field when auto-detected: `"MTN detected"` or `"Airtel detected"` in the provider's colour

#### Grouped classification fields (single list card)
Presented as a grouped list card (one card, rows with dividers) to feel lighter than separate input boxes:

- **Category** — tap to open a select/sheet; shows current value with `›` chevron; pre-filtered by transaction type
- **Date** — defaults to today; tap to reveal date input
- **Reason / Note** — single-line text input, placeholder "What's this for?"

Below the list card, a small helper line:
> *"Category and reason help this appear correctly in your summaries."*

#### Primary CTA button
- Money In: `"Request Payment via [Provider]"` — teal
- Money Out: `"Send via [Provider]"` — teal (same colour; red is reserved for error states only)
- Disabled and shows spinner while loading

---

## 4. State Machine

```
DEFAULT → [tap CTA] → LOADING → PENDING (modal)
                                    ├── [approved on phone] → SUCCESS
                                    └── [timeout / denied]  → FAILED
FAILED → [Retry] → LOADING
FAILED → [Record Manually] → switch to Manual mode, pre-fill amount + category + date + note
```

### 4.1 Loading state
- CTA button shows spinner, label changes to `"Connecting to [Provider]…"`
- All form fields become `pointer-events-none opacity-60`
- No modal yet — modal only appears once the simulated "request sent" resolves (~800ms)

### 4.2 Pending modal
Bottom-sheet style modal (slides up from bottom, backdrop blur behind it). The form is visible but blurred behind.

Content:
- Provider icon (📱) + provider name
- Heading: `"Check your phone"`
- Body: `"[Provider] has sent a prompt to [phone]. Approve it to complete the payment."`
- Summary card: amount, category, date, reason (read-only)
- Animated pulsing indicator ("Waiting for approval…")
- **Cancel** button (ghost) — closes modal, re-enables form, no transaction saved
- Simulate: after 3 seconds auto-transition to SUCCESS (70% chance) or FAILED (30% chance) — makes the demo feel real

### 4.3 Success state
Modal becomes a success screen (same modal shell, content replaced):
- Large green checkmark circle (animated scale-in)
- `"Payment confirmed!"` heading
- Receipt summary: amount, provider, category, date, reason
- Two buttons: `"Add Another"` (resets form, closes modal) · `"Go to Dashboard"`
- A transaction is written to AppContext at this point (same as manual entry)

### 4.4 Failed state
Modal becomes a failed screen:
- Warning icon (⚠️) in red
- `"Payment not confirmed"` heading
- Friendly message: `"The [Provider] request was not approved or timed out."`
- Amount shown with a red FAILED badge
- Two buttons: `"Try Again"` (returns to LOADING → PENDING) · `"Record Manually Instead"` (closes modal, switches to Manual mode, pre-fills all fields)

---

## 5. Validation

All validation runs client-side before the CTA is tappable:

| Field | Rule | Error message |
|---|---|---|
| Amount | > 0, numeric | "Enter a valid amount" |
| Phone | 10 digits, starts with 07 | "Enter a valid Ugandan phone number" |
| Provider | Must be selected | "Select a provider" (auto-selected if phone given, so rarely shown) |
| Category | Required | "Select a category" |
| Date | Required, not future | "Date is required" |

Errors shown inline beneath each field. CTA button remains enabled (validation fires on submit, not on blur) to avoid frustrating the user mid-typing.

---

## 6. Component Plan

### New components
- `MobileMoneyForm` (`src/components/mobilemoney/MobileMoneyForm.jsx`) — the full Mobile Money form
- `ProviderPill` (`src/components/mobilemoney/ProviderPill.jsx`) — single provider tap pill (MTN / Airtel)
- `MobileMoneyModal` (`src/components/mobilemoney/MobileMoneyModal.jsx`) — pending / success / failed modal

### Modified files
- `src/pages/AddTransaction.jsx` — add mode-selector tiles at top; conditionally render `MobileMoneyForm` or existing form
- `src/context/AppContext.jsx` — no changes needed; MobileMoneyForm calls existing `addTransaction`

### Utility
- `src/utils/phoneUtils.js` — `detectProvider(phoneNumber)` returns `'mtn' | 'airtel' | null`
- `src/utils/momoSimulator.js` — `simulateMomoRequest(details)` returns a Promise that resolves with `{ status: 'success' | 'failed' }` after a random delay (2–4s)

---

## 7. Data Model

Mobile Money transactions are saved identically to manual transactions in AppContext. No new fields needed. The provider and phone number are captured in the `note` field automatically:

```js
{
  id: `t-${Date.now()}`,
  type: 'in' | 'out',
  amount: Number,
  category: String,
  date: String,          // YYYY-MM-DD
  note: `${provider} · ${phone} · ${userNote}`,
}
```

This keeps the data model simple and backwards-compatible while preserving the mobile money context in transaction history.

---

## 8. Design Tokens (existing system)

Uses the existing glassmorphic design system:
- Glass cards: `bg-white/70 backdrop-blur-md border border-white/60`
- Primary action: `bg-teal-600` (never red for CTAs)
- Red: error/failed states only
- MTN accent: `#FFCC00` border, `#FFF9E6` bg
- Airtel accent: `#EF4444` border, `#FFF1F2` bg
- Modal backdrop: `bg-navy-900/40 backdrop-blur-md`

---

## 9. Out of Scope

- Real mobile money API integration (Beyonic, MTN MoMo API, Airtel Money API)
- Push notifications for payment confirmation
- Transaction PIN or 2FA
- Receipt sharing / export
- Saving favourite phone numbers
