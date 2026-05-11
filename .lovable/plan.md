Plan:

1. Update `/approval-required` so the browser document itself cannot scroll or rubber-band; the page will be a fixed full-viewport shell.
2. Move scrolling into the internal order content container only, with `overscroll-behavior` containment so reaching the top/bottom does not pull the top bar down.
3. Adjust `StatusHero` so the `Laundry Order / CUI376` header is fixed/anchored independently from the collapsible hero body, instead of relying on a sticky section that can visually move during bounce scrolling.
4. Keep the current hero collapse behavior for the lower status content, but ensure the top bar remains locked at the top throughout normal scroll and over-scroll at both ends.