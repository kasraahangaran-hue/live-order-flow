## Goal

Bring the same pinned-hero behavior we shipped on `/approval-required` to every other order status page so they all share identical scroll/collapse behavior and visuals.

The behavior to propagate:
- Top bar pinned (no rubber-band drift).
- Header + status block render as one continuous gradient card (no seam).
- The status block collapses on scroll; the entire collapsible region (including breathing-room spacer) tucks together.
- Card has `rounded-b-[28px]` when expanded, flat bottom when collapsed; smooth border-radius transition.

## Approach

Rather than copy-paste the wrapper into 8 pages, **extract a reusable `OrderShell` component** that owns the shell, the pinned hero card, the scroll container, the over-scroll spacer, and the tucked state. Each order page becomes thin: it passes `StatusHero` props and renders its body cards as children.

### New component

`src/components/order/OrderShell.tsx`

```tsx
type OrderShellProps = {
  hero: Omit<StatusHeroProps, "showHeader" | "tucked">;
  children: React.ReactNode;
};
```

Internals:
- Outer `<main className="fixed inset-0 overflow-hidden bg-background font-sans antialiased overscroll-none">`
- Inner `max-w-md flex flex-col h-[100dvh]` shell (preserves desktop `md:` rounding/border).
- Pinned hero card: `relative z-[60] shrink-0 overflow-hidden ${tucked ? "rounded-b-none" : "rounded-b-[28px]"} transition-[border-radius] duration-300 ease-out ${gradientClass} shadow-hero`, containing `<OrderHeader variant="inline" ...>` + `<StatusHero showHeader={false} tucked={tucked} {...hero} />`.
- Scroll body: `min-h-0 flex-1 overflow-y-auto overscroll-contain pb-32 touch-pan-y`, `onScroll` with hysteresis (`>24` collapse, `<8` expand) flipping `tucked`.
- Inner `<div className="min-h-[calc(100%+120px)]">{children}</div>` to preserve the rubber-band-defeat spacer.
- Gradient class derived from `hero.orderType` (`bg-gradient-hero-finery` vs `bg-gradient-hero`).
- Pulls `orderId`, `orderType`, `showSupport`, `onBack` from `hero` to feed `OrderHeader`.

### Pages to refactor (use `OrderShell`)

All currently use `StatusHero` inside the same shell pattern:

1. `src/pages/ApprovalRequired.tsx` — replace inline shell with `OrderShell` (already has the behavior; this is just deduplication).
2. `src/pages/OrderReceived.tsx`
3. `src/pages/OrderCollected.tsx`
4. `src/pages/Processing.tsx`
5. `src/pages/DriverOnTheWay.tsx`
6. `src/pages/OrderComplete.tsx`
7. `src/pages/PendingItemDelivery.tsx`
8. `src/pages/PartialDelivery.tsx`
9. `src/pages/PaymentFailed.tsx`

For each: drop the `<main>` + scroll wrapper, pass `StatusHero` props as `hero={{ ... }}`, and put the cards (`ActionCard`, `DeliveryCard`, `OrderConfirmations`, etc.) as `children`.

### Pages NOT touched

- `src/pages/Cancelled.tsx` — does not use `StatusHero` (renders a custom `<section>` instead). Out of scope for this change to avoid altering its layout. Can be migrated separately if desired.
- `src/pages/Index.tsx`, `src/pages/PRD.tsx`, `src/pages/Demo.tsx` — landing/marketing/demo pages, not real order screens.
- `src/pages/portal/*` — portal routes use a different layout. Not touched.

### StatusHero

No changes. The component already supports the controlled `tucked` prop and `showHeader={false}` mode (added in the previous round). `OrderShell` simply wires those up.

## Out of scope

- No changes to copy, content cards, timeline, or design tokens.
- No changes to `Cancelled.tsx`, portal pages, or non-order pages.
- No changes to `OrderHeader` or `StatusHero` internals.

## Risk / verification

- Each refactored page should look and behave identically to `ApprovalRequired` re: pinned bar + collapse on scroll.
- Visual check on mobile viewport at top, mid-scroll, and over-scroll at both ends for at least 2 pages (e.g. `/order-received` and `/processing`).