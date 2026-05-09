# Product Scope

This foundation follows the Notion project plan for "Commute Wallet for Vietnam."

## Product Pitch

Vietnam's commute economy runs on motorbikes, cash, rain, and trust-based reimbursement. Global expense products assume cards, receipts, and clean public transit; Commute Wallet is designed for the way Vietnamese workers actually commute.

## Target Persona

Office workers in Ho Chi Minh City or Hanoi, age 25-35, monthly salary from 15-40 million VND, commuting by motorbike, Grab/Be, bus, or mixed transport, and already comfortable with fintech apps.

## Core Features

### F1: True Cost of Commute Calculator

Formula:

```text
TrueCost = DirectCost + AmortizedCost + WeatherCost + RoutineCost
```

The implementation currently lives in `packages/domain/src/commute-cost.ts`.

### F2: Auto-Capture Mock

The current version parses sample SMS and wallet notification text with regex. The implementation currently lives in `packages/domain/src/sms-parser.ts`.

Production can later evolve toward Open Banking APIs, Android SMS permission, notification listener support, and consented data capture.

### F3: Vietnam Insights

The customer app shows:

- Rain cost
- Transport comparison between motorbike, electric motorbike, ride-hailing, and bus

### F4: Commute Wrapped

The current scaffold reserves space for wrapped-style storytelling. A next iteration should add monthly distance, most expensive commute day, rain streaks, and shareable summary cards.

## Deliberately Skipped In Foundation

- Real GPS tracking
- OCR
- Calendar integration
- Real notification listener
- Open Banking production integration
- Multi-tenant reimbursement workflows

## Next Product Slice

The next useful slice is a Supabase-backed onboarding flow:

1. Create or identify a user profile.
2. Save home/work labels, transport mode, vehicle model, and optional salary.
3. Calculate true monthly cost using `packages/domain`.
4. Persist transactions and monthly summaries.
5. Show the saved result in both customer and CRM apps.
