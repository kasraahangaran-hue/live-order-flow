## Goal

Eliminate the two remaining defects on `/approval-required`:

1. The visible seam/gap between the pinned top bar and the status block below it.
2. The strip of leftover padding (and the rounded-corner curve) that peeks out under the top bar when the status block is collapsed.

Keep the over-scroll lock (top bar pinned during rubber-band) intact.

## Root causes

1. **Seam**: `bg-gradient-hero` is `linear-gradient(135deg, mint, lavender)`. The pinned header div and the `StatusHero <section>` each render their own copy of that gradient, so the colors at their shared edge don't match. Even though both use the same class, the gradient restarts in each element → visible horizontal seam = the perceived "gap".
2. **Peek-out on collapse**: inside `StatusHero`, only the inner grid row animates from `1fr → 0fr`. The wrapping `<section>` itself still contributes:
   - the `h-3` breathing-room spacer at the bottom of the section (~12px),
   - the `rounded-b-[28px]` curve on the section,
   - the `pt-2` top padding on the body container.
   When tucked, the inner content has 0 height but those wrapper bits remain, so a thin gradient strip with a rounded bottom curve sits below the pinned header.

## Fix

Render the entire hero (top bar + collapsible status body + rounded bottom + shadow) as **one** pinned card outside the scrollable area. This guarantees a single continuous gradient (no restart, no seam) and lets the entire card — spacer, padding, and rounded corners included — collapse together with no leftover strip.

### Files to change

- `src/pages/ApprovalRequired.tsx`
- `src/components/order/StatusHero.tsx`

### Approach

1. **Move `StatusHero` out of the scroll container** in `ApprovalRequired.tsx`. Layout becomes:

   ```text
   <main fixed inset-0 overflow-hidden>
     <div max-w-md flex-col h-[100dvh]>
       <div shrink-0>           ← pinned hero card (header + collapsible body)
         <OrderHeader inline />
         <StatusHero showHeader={false} ... />   ← collapses in place; pushes scroll area up
       </div>
       <div flex-1 min-h-0 overflow-y-auto overscroll-contain pb-32 touch-pan-y>
         <div min-h-[calc(100%+120px)]>          ← keeps over-scroll spacer
           <ActionCard />
           <DeliveryCard />
           <OrderConfirmations />
           <ServicesSelection />
           <OrderInstructions />
         </div>
       </div>
     </div>
   </main>
   ```

   The `min-h-[calc(100%+120px)]` over-scroll spacer stays — it lives in the scroll body, not the hero — so the rubber-band lock from the previous fix is preserved.

2. **Refactor `StatusHero` so the entire section collapses cleanly**, not just an inner grid row. Replace the current `sticky top-0` `<section>` + inner grid with a regular block whose **whole height** animates:
   - Wrap the collapsible content (the title + art + subtitle + timeline + the `h-3` breathing-room spacer + the body's `pt-2 pb-6` padding) in a single `<div>` whose `grid-template-rows` animates `1fr → 0fr` and whose child uses `overflow-hidden`. So when tucked, the section contributes literally 0 extra pixels below the header.
   - Drop the `sticky top-0`, the sentinel-based `IntersectionObserver`, and the `tucked` state from `StatusHero` — pinning is now handled by being inside the non-scrolling shrink-0 wrapper, and tuck state is driven by scroll position of the sibling scroller (see step 4).

3. **Remove the duplicate gradient seam.** Because header + body now sit inside one shared `bg-gradient-hero` wrapper (the pinned hero card), there is exactly one gradient instance covering both — no restart, no seam. `OrderHeader` (inline variant) and `StatusHero` content are both `bg-transparent`.

4. **Drive collapse from scroll position of the content scroller.** Add an `onScroll` handler on the scroll container in `ApprovalRequired.tsx`. When `scrollTop > THRESHOLD` (e.g. 16px), set `tucked = true`; when it returns near 0, `tucked = false`. Pass `tucked` into `StatusHero` as a controlled prop (`tucked?: boolean`) so the section animates accordingly. Keep a small hysteresis (e.g. expand at <8px, collapse at >24px) to avoid flicker. This is simpler and more reliable than the IO sentinel since the section is no longer sticky.

5. **Single rounded bottom + shadow on the pinned hero card.** The outer pinned card owns `rounded-b-[28px]` and `shadow-hero` permanently. When the body collapses, the card shrinks to just the header height, and the rounded bottom + shadow naturally sit right under the header — no separate hand-off logic needed (this also removes the previous round's `transition-[border-radius,box-shadow]` on the header wrapper). Animate the card's `height` change via the inner grid-row collapse so it feels smooth.

6. **Keep the gradient finery variant**: pinned card picks `bg-gradient-hero` vs `bg-gradient-hero-finery` based on `order.orderType` (already wired up).

### Technical notes

- `StatusHero` props: keep `showHeader`, replace internal `tucked` state with an external `tucked?: boolean` prop. Remove `onTuckedChange`, sentinel `<div>`, IO effect, `ioSettledRef`, and `commitLockUntil` logic.
- The collapsible region in `StatusHero` should look like:
  ```tsx
  <div
    className="grid transition-[grid-template-rows,opacity] duration-300 ease-out"
    style={{ gridTemplateRows: tucked ? "0fr" : "1fr", opacity: tucked ? 0 : 1 }}
    aria-hidden={tucked}
  >
    <div className="overflow-hidden">
      {/* existing px-6 pt-2 pb-6 body */}
      {/* the h-3 breathing-room spacer goes INSIDE this overflow-hidden wrapper so it collapses too */}
    </div>
  </div>
  ```
- `ApprovalRequired.tsx`:
  - Remove the standalone pinned `<div className="z-[60] shrink-0 ... shadow-hero">` wrapping just the header.
  - New pinned card wrapper: `className="shrink-0 ${headerGradient} shadow-hero rounded-b-[28px] overflow-hidden"` containing `<OrderHeader variant="inline" />` followed by `<StatusHero showHeader={false} tucked={tucked} ... />`.
  - Add `useState<boolean>(false)` for `tucked` and an `onScroll` handler on the scroll container with hysteresis thresholds.
- The `OrderHeader` inline variant already uses `bg-transparent`, so it inherits the gradient from the pinned card — no changes needed in `OrderHeader.tsx`.

## Out of scope

- No content/copy changes.
- No design token changes.
- No changes to `ActionCard`, `DeliveryCard`, timeline, or any other component.
- Other routes that still use `StatusHero` standalone keep working because `tucked` is optional (defaults to `false`) and `showHeader` defaults to `true`.