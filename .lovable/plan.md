## Goal

Make the pinned top bar and the collapsible status block on `/approval-required` look like a single uniform hero "card" that smoothly collapses and expands — while keeping the top bar locked in place during over-scroll (the fix from the previous round).

## Problem

Right now we have two visually independent pieces:

1. The pinned `OrderHeader` wrapper in `ApprovalRequired.tsx`
   - `bg-gradient-hero` + `shadow-hero` of its own
   - No bottom corner radius
2. The `StatusHero` `<section>` directly below it inside the scroll area
   - Also `bg-gradient-hero` + `shadow-hero`
   - Animates `rounded-b-[28px]` ↔ `rounded-b-none`

Result: a visible seam (double shadow + a hard horizontal line where the two backgrounds meet), and the rounded bottom + drop shadow only wrap the lower piece instead of the whole hero unit. When the body collapses, the top bar still looks like a separate strip glued on top.

## Fix

Treat the pinned bar + collapsible body as one visual hero with shared background, shared bottom rounding, and a single drop shadow that always sits at the bottom edge of the currently-visible hero (whether expanded or tucked).

### Files to change

- `src/pages/ApprovalRequired.tsx`
- `src/components/order/StatusHero.tsx`

### Approach

1. **Single shared background.** Keep the pinned header div as the top of the hero. Remove its independent `shadow-hero` and let the gradient continue seamlessly into the collapsible body below. Both pieces use the same `bg-gradient-hero` (or `bg-gradient-hero-finery`) so there is no seam.

2. **Move the bottom rounding + shadow to the "current bottom" of the hero.**
   - When **expanded**, the bottom of the hero is the `StatusHero` section inside the scroll container → it owns `rounded-b-[28px]` + `shadow-hero` (as today).
   - When **tucked** (body collapsed to 0), the bottom of the hero is the pinned header itself → the pinned header takes on `rounded-b-[28px]` + `shadow-hero`, and the collapsed body underneath has no shadow/radius so nothing peeks out.
   - Drive this with the same `tucked` state that already controls the collapse. Easiest: lift `tucked` into `ApprovalRequired` (or expose it via a callback from `StatusHero`) so the pinned header wrapper can react to it. A small `onTuckedChange` callback prop on `StatusHero` is the least invasive.

3. **Smooth transition.** Animate `border-radius` and `box-shadow` on the pinned header with the same `duration-300 ease-out` already used for the collapse, so the rounded corners + shadow appear to "travel" from the bottom of the body up to the bottom of the header as it tucks, instead of popping.

4. **Remove the inline `OrderHeader` from `StatusHero`.** It is already gated by `showHeader={false}` from `ApprovalRequired`, but we will keep that prop and continue to render the pinned one in the page so the layout stays single-source.

5. **No changes to the over-scroll lock.** The `fixed inset-0 overflow-hidden` shell, `overscroll-contain` on the inner scroller, and the `min-h-[calc(100%+120px)]` spacer all stay exactly as they are — this change is purely cosmetic seam-removal.

### Technical notes

- `StatusHero` will gain an optional `onTuckedChange?: (tucked: boolean) => void` and call it from inside the existing `setTucked` updater (after the commit-lock check) so the page can mirror the state without changing the IO logic.
- The pinned header wrapper in `ApprovalRequired.tsx` becomes:
  ```tsx
  <div
    className={`z-[60] shrink-0 bg-gradient-hero transition-[border-radius,box-shadow] duration-300 ease-out ${
      tucked ? "rounded-b-[28px] shadow-hero" : "rounded-b-none shadow-none"
    }`}
  >
    <OrderHeader ... />
  </div>
  ```
- The `StatusHero` `<section>` keeps its current `rounded-b-[28px] ↔ rounded-b-none` + `shadow-hero` logic unchanged; together with the header logic above, exactly one of the two pieces owns the rounded bottom + shadow at any given time.
- Finery variant: header wrapper picks gradient based on `order.orderType` so the two pieces always match.

## Out of scope

- No changes to timeline, action card, delivery card, or any other content.
- No changes to scroll/over-scroll behavior.
- No design token or color changes.