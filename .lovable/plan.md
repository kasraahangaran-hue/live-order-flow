## Goal

On the "Review Your Items" screen (`src/pages/portal/ApprovalItem.tsx`), the top bar (back button + "Review Your Items" title + progress segments) currently scrolls with the page on some devices. Pin it to the top so it never moves while the user scrolls the photo/decision content.

## Why it moves today

The screen uses `flex h-screen flex-col` with the middle section as `flex-1 overflow-y-auto`. On mobile Safari/Chrome, `h-screen` (100vh) includes the browser's collapsible URL bar area, so when the address bar shows/hides the whole layout shifts — making the header appear to move during scroll. Additionally, nothing inside the header explicitly pins it, so any accidental body scroll moves it too.

## Changes

File: `src/pages/portal/ApprovalItem.tsx`

1. Swap `h-screen` for `h-[100dvh]` on the outer wrapper so it uses the dynamic viewport (excludes the collapsing browser chrome) and the layout no longer shifts when the address bar toggles.
2. Add `sticky top-0 z-20 bg-background` to the header wrapper (the `<div className="px-5 pt-6">` containing the back button, title, and progress segments) so it's locked to the top of its container regardless of scroll source.
3. Keep all existing styles, content, and behavior otherwise unchanged. The scrollable middle and sticky bottom CTA stay as-is.

## Out of scope

- No changes to `ApprovalEntry.tsx` or other portal pages (let me know if you want the same treatment there).
- No visual redesign of the header — just pinning behavior.
