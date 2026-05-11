We were not talking about the same top bar. The moving bar in your screenshot is the `StatusHero` / `OrderHeader` at the top of `/approval-required`, not the `Review Your Items` header inside the item review page.

Plan:
1. Update `ApprovalRequired.tsx` so the phone-sized order page uses a fixed full-height viewport container and only the content area scrolls.
2. Update the hero/top-bar behavior in `StatusHero.tsx` so the header remains visually locked at the top of that scroll container.
3. Keep the existing collapse/tuck behavior for the lower hero content if possible, but ensure the `Laundry Order / CUI376` bar itself does not move when scrolling.
4. Verify the affected files compile cleanly or note any pre-existing lint issues separately.