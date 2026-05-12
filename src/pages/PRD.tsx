import { Link } from "react-router-dom";
import {
  ChevronLeft,
  Package,
  PackageOpen,
  Sparkles,
  Truck,
  AlertTriangle,
  PackageCheck,
  Camera,
  CreditCard,
  ClipboardList,
  MapPin,
  History,
  Headphones,
  Receipt,
  Pencil,
  ArrowRight,
} from "lucide-react";

const PRD = () => {
  return (
    <main className="min-h-screen bg-gradient-surface-mint font-sans antialiased">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-full bg-card px-3 py-1.5 text-sm font-semibold text-primary shadow-press transition-transform active:scale-95"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to demo
          </Link>
          <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary-foreground">
            PRD · v1.0
          </span>
        </div>
      </header>

      <article className="mx-auto max-w-4xl px-6 py-10">
        {/* Title */}
        <Section>
          <Eyebrow>For Product Managers · Figma rebuild reference</Eyebrow>
          <h1 className="mt-3 font-sans text-4xl font-extrabold leading-tight text-primary md:text-5xl">
            Order Tracking — Product Requirements
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            This document describes every screen, status, component, and rule
            powering the Washmen post-checkout order tracking experience. Use it
            to recreate, extend, or hand off the design in Figma.
          </p>

          <div className="mt-6 grid gap-3 rounded-3xl border border-border bg-card p-5 shadow-card md:grid-cols-3">
            <Stat label="Order screens" value="6" />
            <Stat label="Pipeline statuses" value="5" />
            <Stat label="Edge states" value="4" />
          </div>
        </Section>

        {/* TOC */}
        <Section>
          <H2>Contents</H2>
          <ol className="mt-4 grid gap-2 text-sm md:grid-cols-2">
            {[
              "1. Product overview",
              "2. The 5-stage pipeline",
              "3. Screen-by-screen breakdown",
              "4. Shared components",
              "5. Edge cases & branching",
              "6. Visual system & motion",
              "7. Content & copy rules",
            ].map((t) => (
              <li
                key={t}
                className="rounded-xl border border-border bg-card px-4 py-2.5 font-semibold text-primary shadow-card"
              >
                {t}
              </li>
            ))}
          </ol>
        </Section>

        {/* 1. Overview */}
        <Section>
          <H2>1. Product overview</H2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            After a customer places a Washmen laundry order, they land on a
            single, dynamic order page. The page <strong className="text-primary">always renders the
            same shell</strong> (header → status hero → contextual banners →
            delivery card → details/confirmations) but its <strong className="text-primary">content,
            illustration, copy, and progress mutate</strong> based on the
            current pipeline status.
          </p>

          <Subhead>Goals</Subhead>
          <Bullets
            items={[
              "Reduce 'where's my order?' support tickets by giving live, glanceable status.",
              "Build trust through proof-of-pickup, in-facility, and proof-of-drop-off photos.",
              "Surface contextual actions only when relevant (review items, retry payment, contact support).",
              "Drive incremental revenue via a soft upsell at the earliest, calmest stage.",
            ]}
          />

          <Subhead>Non-goals</Subhead>
          <Bullets
            items={[
              "This page does not handle checkout, scheduling new orders, or account settings.",
              "No live chat in v1 — support is a phone/handoff button only.",
            ]}
          />
        </Section>

        {/* 2. Pipeline */}
        <Section>
          <H2>2. The 5-stage pipeline</H2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Every order moves linearly through 5 stages. The status hero,
            timeline, illustration, and section composition all derive from the
            <em> current stage index</em> (0–4).
          </p>

          <div className="mt-5 overflow-hidden rounded-3xl border border-border bg-card shadow-card">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60 text-primary">
                <tr>
                  <Th>Idx</Th>
                  <Th>Stage key</Th>
                  <Th>Customer label</Th>
                  <Th>Means</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <Tr i={0} k="order_received" l="Order received" m="Order placed, awaiting pickup driver." />
                <Tr i={1} k="pickup_completed" l="Collected" m="Driver has the bag, en route to facility." />
                <Tr i={2} k="items_sorted" l="Processing" m="Items at facility being cleaned/ironed." />
                <Tr i={3} k="dropoff_assigned" l="Out for delivery" m="Bag is on its way back to customer." />
                <Tr i={4} k="dropoff_completed" l="Delivered" m="Delivered to customer. Photos & receipt available." />
              </tbody>
            </table>
          </div>

          <Subhead>Pipeline rules</Subhead>
          <Bullets
            items={[
              "Forward-only progression — stages cannot regress in the happy path.",
              "Exactly one stage is 'active' (= currentIndex). Earlier stages render as completed; later stages render as upcoming.",
              "Visual completion exception: the active 'Collected' and 'Delivered' stages render as completed (blue checkmark) — they're milestones, not in-progress work.",
              "Active timestamps render in bold green (text-success). Past stages render in muted grey. Upcoming stages have none.",
              "If an active stage has no timestamp (e.g. Processing), a green pulsing 'Live' badge is shown in its place.",
              "Timestamps are stacked two lines: 'Wed 24/03/26' on top, time on the bottom (right-aligned, tabular).",
              "Cancellation is only allowed at stage 0 (received). The cancel chip disappears at stage 1+.",
              "Service selection is editable only at stage 0. From stage 1 onward, services are locked and only the selected service (Wash & Fold + add-on) is shown.",
            ]}
          />
        </Section>

        {/* 3. Screens */}
        <Section>
          <H2>3. Screen-by-screen breakdown</H2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Six routes, each demoing a single state of the order page. They all
            share the same shell — only the variant props change.
          </p>

          <div className="mt-6 space-y-5">
            <ScreenCard
              icon={<Package className="h-5 w-5" />}
                title="Order Received"
                route="/order-received"
              orderId="CUD138"
              currentIndex={0}
              illustration="Phone with notification card (PhoneConfirm)"
              heroAnimation="Float (gentle vertical bob)"
              copy={{
                status: "Order Received",
                subtitle: "Pickup tomorrow · 8:00 – 10:00 AM",
              }}
              flags={[
                "cancellable: true",
                "doorPickup: true → solid yellow pill 'Leave laundry bags at door' under the subtitle",
                "Pickup pending, drop-off scheduled",
                "Service selection fully editable",
              ]}
              sections={[
                "OrderHeader (with support button)",
                "StatusHero — phone illustration, cancel chip, door-pickup pill",
                "UpsellBanner — sneaker care (only on this stage)",
                "OrderDetails (services accordion open by default, all services visible)",
                "DeliveryCard — pickup pending, dropoff scheduled (collapsed by default)",
                "OrderConfirmations (stage='received' → all pending)",
              ]}
            />

            <ScreenCard
              icon={<PackageOpen className="h-5 w-5" />}
              title="Order Collected"
              route="/pickup-completed"
              orderId="CUD138"
              currentIndex={1}
              illustration="Delivery truck (DeliveryTruck) — bag in transit to facility"
              heroAnimation="Truck-roll (horizontal sway w/ wheel rotation)"
              copy={{
                status: "Order Collected",
                subtitle: "Your laundry is on its way to our facility",
              }}
              flags={["cancellable: false", "pickupDone: true", "Active stage renders as completed (blue checkmark)"]}
              sections={[
                "OrderHeader",
                "StatusHero — truck illustration",
                "DeliveryCard — pickup ✓ done, dropoff scheduled (collapsed)",
                "OrderConfirmations (stage='collected' → pickup ✓, items pending, drop pending)",
                "OrderDetails (locked, collapsed) — only the selected Wash & Fold + Press & Hang add-on visible",
              ]}
            />

            <ScreenCard
              icon={<Sparkles className="h-5 w-5" />}
              title="Processing"
              route="/items-sorted"
              orderId="CUD137"
              currentIndex={2}
              illustration="Washing machine with rotating drum (WashingMachine)"
              heroAnimation="Sway + drum spin-slow"
              copy={{
                status: "Cleaning at Our Facility",
                subtitle: "Your laundry is being cared for",
              }}
              flags={["pickupDone: true", "Items received → review CTA shown"]}
              sections={[
                "OrderHeader",
                "StatusHero — washing machine",
                "ReviewBanner — '3 items need your review' (warning style)",
                "DeliveryCard — pickup ✓, dropoff window today",
                "OrderSections (stage='items-in') → confirmations + details combined",
              ]}
            />

            <ScreenCard
              icon={<Truck className="h-5 w-5" />}
              title="Out for Drop Off"
              route="/dropoff-today"
              orderId="CUD137"
              currentIndex={3}
              illustration="Delivery truck (return trip)"
              heroAnimation="Truck-roll"
              copy={{
                status: "Out for Drop Off",
                subtitle: "Today, Sat · Anytime during the day",
              }}
              flags={["No support button in header (different from earlier stages)"]}
              sections={[
                "OrderHeader (no support icon)",
                "StatusHero — truck",
                "DelayBanner — '2 items may be delayed' (warning style, shown when facility flags risk of delay)",
                "QuickActions — receipt + support buttons",
                "DeliveryCard — pickup ✓, delivery scheduled",
                "OrderSections (default stage='delivery')",
              ]}
            />

            <ScreenCard
              icon={<AlertTriangle className="h-5 w-5" />}
              title="Payment failed (edge state)"
              route="/payment-failed"
              orderId="CUD137"
              currentIndex={3}
              illustration="Credit card with red alert badge (CardAlert)"
              heroAnimation="Shake (anxious wobble)"
              copy={{
                status: "Payment Required",
                subtitle: "Delivery on hold · capture payment to release",
              }}
              flags={[
                "onHold: true → LIVE badge becomes red 'On hold' badge",
                "Branches off the 'Out for delivery' stage",
                "Drop-off label flips to 'Delivery on hold · Pending payment'",
              ]}
              sections={[
                "OrderHeader",
                "StatusHero — card+alert, shake animation",
                "PaymentFailedBanner — destructive surface w/ Retry & Update card buttons",
                "QuickActions",
                "DeliveryCard — drop-off shows 'Pending payment'",
                "OrderSections (stage='delivery')",
              ]}
            />

            <ScreenCard
              icon={<PackageCheck className="h-5 w-5" />}
              title="Delivered"
              route="/dropoff-completed"
              orderId="CUD135"
              currentIndex={4}
              illustration="Success check badge (ShirtHanger) — sized smaller (h-16 w-16)"
              heroAnimation="Float + sparkles"
              copy={{
                status: "Completed Order",
                subtitle: "Delivered Sat 26/03/26 at 4:49 PM",
              }}
              flags={[
                "completed: true → forces 'complete' variant",
                "Delivered stage renders as completed (blue checkmark) with its timestamp shown in muted grey",
                "All 3 confirmations unlocked",
              ]}
              sections={[
                "OrderHeader",
                "StatusHero — success badge, smaller icon",
                "QuickActions",
                "OrderConfirmations (stage='delivered' → all 3 ✓ tappable)",
                "DeliveryCard — both rows ✓ done, collapsed by default",
                "OrderDetails (locked) — only the selected service shown",
              ]}
            />
          </div>
        </Section>

        {/* 4. Components */}
        <Section>
          <H2>4. Shared components</H2>

          <ComponentBlock
            name="OrderHeader"
            purpose="Sticky top bar with back, order id, and optional support button."
            props={[
              "orderId: string — displayed monospace, e.g. CUD138",
              "showSupport?: boolean — toggles headphones icon (right side)",
            ]}
            notes={[
              "Background uses the mint gradient with backdrop-blur for scroll-through transparency.",
              "Back button always routes to /  (the demo picker).",
            ]}
          />

          <ComponentBlock
            name="StatusHero"
            purpose="The primary status surface: title, subtitle, optional door-pickup pill, animated illustration, and timeline progress bar."
            props={[
              "status: string — large display title (e.g. 'Order received'). Always reserves 2 lines of height to keep layout stable.",
              "subtitle: string — secondary line, kept on a single line (whitespace-nowrap)",
              "stages: Stage[] — full list of 5 pipeline stages",
              "currentIndex: number — drives progress fill % and active marker",
              "cancellable?: boolean — shows red 'Cancel' chip on the right of the toggle row",
              "completed?: boolean — forces 'complete' variant (smaller success icon)",
              "onHold?: boolean — forces 'hold' variant + red 'On hold' badge in the timeline",
              "doorPickup?: boolean — shows a solid yellow pill 'Leave laundry bags at door' under the subtitle",
              "variant?: 'received'|'processing'|'delivery'|'complete'|'hold' — picks the illustration",
            ]}
            notes={[
              "Variant resolution: onHold > completed > variant prop.",
              "Illustration size: 96×96 normally, 64×64 for 'complete' (more breathing room).",
              "Each variant has a distinct CSS animation: float, sway, truck-roll, shake.",
            ]}
          />

          <ComponentBlock
            name="StatusTimeline"
            purpose="Slim progress bar with 5 dot markers + collapsible vertical step list."
            props={[
              "stages, currentIndex — same as hero",
              "rightSlot — optional element (e.g. cancel button) rendered next to the toggle",
              "onHold — flips the active row's right side to a red 'On hold' badge",
            ]}
            notes={[
              "Progress bar fills `currentIndex / 4 * 100%` with the gradient-progress fill animation.",
              "Toggle button: 'View timeline' / 'Hide timeline' with a History icon and rotating chevron.",
              "Stage state mapping (visual): past = filled blue dot + check. Active = ringed accent dot with stage icon. Future = hollow muted dot. Exception: active 'Collected' and 'Delivered' render as past (blue check) — they're milestones.",
              "Right side of each row: completed = timestamp in muted grey; active = bold green timestamp OR green pulsing 'Live' badge if no timestamp; on-hold active = red 'On hold' badge; future = nothing.",
              "Timestamps render stacked on two lines (whitespace-pre-line, right-aligned, tabular). Format: 'Wed 24/03/26' on top, time on the bottom.",
            ]}
          />

          <ComponentBlock
            name="DeliveryCard"
            purpose="Accordion card grouping pickup time, drop-off time, and address."
            props={[
              "address, when, dropoffNote — pickup row content",
              "pickupDone?: boolean — replaces edit pencil with a green checkmark",
              "dropoff?: { label, when, done? } — second editable row",
              "defaultOpen?: boolean — default false; section is collapsed on every page (user opens to inspect).",
            ]}
            notes={[
              "Edit pencil only appears when row is editable AND not done. Address row is never editable.",
              "Address row uses MapPin icon, never editable (changing address = new order).",
            ]}
          />

          <ComponentBlock
            name="OrderConfirmations"
            purpose="Photo proof list — pickup, items received, drop off."
            props={[
              "stage: 'received' | 'collected' | 'items-in' | 'delivery' | 'delivered'",
            ]}
            notes={[
              "Pickup unlocks at stage 'collected' or later.",
              "Items received unlocks at 'items-in', 'delivery', or 'delivered'.",
              "Drop-off unlocks only at 'delivered'.",
              "Locked rows: 50% opacity, dashed border icon, disabled button, no chevron.",
            ]}
          />

          <ComponentBlock
            name="OrderDetails"
            purpose="Two-item accordion: Services Selection + Order Instructions. Mirrors the Pickup & Drop Off rhythm — divider-separated rows with small icon tiles, uppercase eyebrow labels, and a single trailing pill button per row."
            props={[
              "defaultOpen?: 'services' | 'instructions' — which accordion item starts open",
              "locked?: boolean — when true, hides all unselected services, removes Add buttons, and disables editing of the selected add-on. Set automatically by the combined OrderSections wrapper for any stage > 0.",
            ]}
            notes={[
              "Eyebrows: 'Selected' (Wash & Fold), 'Add-on' (Press & Hang, with yellow NEW badge), 'Available' (everything else).",
              "Selected service shows a filled blue circular checkmark on the right (not a + button).",
              "Press & Hang renders nested under Wash & Fold via a left border + indentation to communicate it's part of that service.",
              "When locked: only Wash & Fold + the Press & Hang add-on row remain visible; all + buttons and the edit pencil are hidden.",
            ]}
          />

          <ComponentBlock
            name="UpsellBanner"
            purpose="Soft promo card for ancillary services (sneaker care)."
            props={[]}
            notes={[
              "Shown ONLY on /order-received — earliest, lowest-anxiety moment.",
              "Image + 'NEW' chip + headline + arrow CTA. Tappable as a single button.",
            ]}
          />

          <ComponentBlock
            name="ReviewBanner"
            purpose="Warning-tinted CTA that appears mid-pipeline when items need approval."
            props={["count?: number — defaults to 3"]}
            notes={[
              "Uses warning color tokens, not destructive.",
              "Singular/plural copy handled via the count prop.",
            ]}
          />

          <ComponentBlock
            name="PaymentFailedBanner"
            purpose="Destructive surface with retry + update card actions."
            props={[
              "amount?: string (default 'AED 142.00')",
              "reason?: string (default 'Your card was declined')",
            ]}
            notes={[
              "Two buttons: primary 'Retry payment' (destructive bg) + secondary 'Update card'.",
              "Always paired with onHold=true on the StatusHero above it.",
            ]}
          />

          <ComponentBlock
            name="DelayBanner"
            purpose="Soft warning that one or more items may push the drop-off window."
            props={["count?: number — number of at-risk items (default 2)"]}
            notes={[
              "Uses warning color tokens (warning/10 surface, warning/30 border) — not destructive.",
              "Shown on /dropoff-today when the facility flags possible delay; copy: '{N} items may be delayed' + 'We'll confirm shortly if your drop-off time needs to shift.'",
              "Singular/plural handled via the count prop. Non-actionable (informational only).",
            ]}
          />

          <ComponentBlock
            name="QuickActions"
            purpose="2-button row: View receipt + Contact support."
            props={["showReceipt?: boolean (default true)"]}
            notes={["Used on later stages where a receipt exists and support may be needed."]}
          />
        </Section>

        {/* 5. Edge cases */}
        <Section>
          <H2>5. Edge cases & branching</H2>

          <EdgeCase
            title="Payment failed on delivery"
            trigger="Driver attempts delivery, payment auth fails."
            behavior="Order stays at currentIndex=3 but enters onHold mode. Hero swaps to CardAlert + shake animation. PaymentFailedBanner appears at top. Drop-off row in DeliveryCard re-labels to 'Delivery on hold · Pending payment'. Resuming requires successful retry."
          />

          <EdgeCase
            title="Items requiring review (mid-processing)"
            trigger="Facility flags N items at processing stage (stains, damage, missing items)."
            behavior="ReviewBanner appears above DeliveryCard with item count. Customer must approve before processing continues. Banner uses warning palette, not destructive (it's not a failure)."
          />

          <EdgeCase
            title="Cancellation"
            trigger="Customer wants to cancel."
            behavior="Cancel chip is only present at stage 0 (received). Once the driver is dispatched (stage 1+), self-serve cancellation is removed and customer must contact support."
          />

          <EdgeCase
            title="Possible delivery delay"
            trigger="Facility flags items at risk of delaying the drop-off window during the 'Out for delivery' stage."
            behavior="DelayBanner appears between StatusHero and QuickActions with the at-risk item count. Order stays at currentIndex=3 — the timeline does not regress and the drop-off label is unchanged until a confirmed reschedule. Banner is informational; no customer action required."
          />

          <EdgeCase
            title="Door pickup"
            trigger="Customer chose 'Pickup at door' as the pickup method."
            behavior="A solid yellow pill 'Leave laundry bags at door' renders under the StatusHero subtitle on /order-received as a reminder. Pill disappears once the bag has been collected (stage 1+)."
          />

          <EdgeCase
            title="Completed-state rendering"
            trigger="currentIndex hits 4 OR completed=true."
            behavior="Hero illustration shrinks (96 → 64px). Stage label is 'Delivered' and renders as a blue checkmark with its timestamp in muted grey (no Live badge). DeliveryCard stays collapsed. All photo proofs unlock and become tappable. Subtitle format: 'Delivered Sat 26/03/26 at 4:49 PM'."
          />
        </Section>

        {/* 6. Visual */}
        <Section>
          <H2>6. Visual system & motion</H2>

          <Subhead>Color tokens</Subhead>
          <p className="mt-2 text-sm text-muted-foreground">
            All colors are HSL semantic tokens (no raw hex in components). Key
            tokens: <Code>primary</Code>, <Code>accent</Code>,{" "}
            <Code>secondary</Code>, <Code>card</Code>, <Code>muted-foreground</Code>,
            <Code>success</Code>, <Code>warning</Code>, <Code>destructive</Code>,
            and the bespoke <Code>indigo-deep</Code>, <Code>surface-lavender-soft</Code>.
          </p>

          <Subhead>Surfaces</Subhead>
          <Bullets
            items={[
              "Page background: solid bg-background (off-white).",
              "Header strip: gradient-mint with backdrop-blur.",
              "Status hero: gradient-hero, rounded-3xl, shadow-hero.",
              "Cards: bg-card, rounded-3xl, border-border, shadow-card.",
              "Banners: tinted by intent — destructive/10, warning/15, secondary→surface-lavender-soft for promo.",
            ]}
          />

          <Subhead>Typography</Subhead>
          <Bullets
            items={[
              "Display font (font-display, Plus Jakarta Sans) reserved for hero status headlines only.",
              "Sans body for paragraphs and metadata.",
              "Tabular numerals (.tabular) for timestamps, IDs, currency.",
              "Uppercase tracking-wide micro-labels (e.g. 'Live', 'NEW', 'Selected', 'Add-on', 'Available', section eyebrows).",
            ]}
          />

          <Subhead>Motion</Subhead>
          <Bullets
            items={[
              "fade-in on every section, staggered 60–300ms via inline animationDelay.",
              "Hero variants: float (received/complete), sway (processing), truck-roll (collected/delivery), shake (hold).",
              "Washing machine drum: spin-slow infinite while sway plays on the body.",
              "Progress bar: animate-progress-fill from 0 to target % on mount.",
              "Pulsing 1×1 dot inside Live / On hold badges (animate-pulse).",
              "Button press: active:scale-[0.95–0.99] across all tappables.",
            ]}
          />
        </Section>

        {/* 7. Copy */}
        <Section>
          <H2>7. Content & copy rules</H2>
          <Bullets
            items={[
              "Stage labels are sentence case ('Order received', 'Delivered') — not title case. Note: the Completed timeline label is the single word 'Delivered'.",
              "Subtitles never wrap — keep under ~36 chars or use abbreviations.",
              "Timeline timestamps follow 'Day DD/MM/YY' on line 1 + 'h:mm AM/PM' on line 2 (e.g. 'Wed 24/03/26' / '9:12 PM'). Hero subtitles can be long-form ('Delivered Sat 26/03/26 at 4:49 PM'). Never ISO.",
              "Action verbs are imperative ('Retry payment', 'View timeline', 'Contact support').",
              "Currency is prefix + space + amount with 2 decimals ('AED 142.00').",
              "Order IDs are uppercase alphanumeric, monospace, prefixed CUD (e.g. CUD138).",
            ]}
          />

          <div className="mt-8 rounded-3xl border border-accent/40 bg-card p-6 shadow-card">
            <p className="font-sans text-lg font-bold text-primary">
              When in doubt, default to clarity over cleverness.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Customers visit this page when they're anxious about laundry they
              can't see. Every word, color, and animation should reduce that
              anxiety — not perform brand personality.
            </p>
          </div>
        </Section>

        <footer className="mt-16 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          PRD generated for the Washmen tracking experience · Recreate freely in Figma.
        </footer>
      </article>
    </main>
  );
};

/* ---------- helpers ---------- */

const Section = ({ children }: { children: React.ReactNode }) => (
  <section className="mt-12 first:mt-0">{children}</section>
);

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-primary shadow-press">
    {children}
  </span>
);

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-sans text-2xl font-extrabold leading-tight text-primary md:text-3xl">
    {children}
  </h2>
);

const Subhead = ({ children }: { children: React.ReactNode }) => (
  <h3 className="mt-6 font-sans text-base font-bold text-primary">{children}</h3>
);

const Bullets = ({ items }: { items: string[] }) => (
  <ul className="mt-3 space-y-2">
    {items.map((t) => (
      <li
        key={t}
        className="flex gap-3 rounded-2xl bg-card/60 px-4 py-2.5 text-sm leading-relaxed text-muted-foreground"
      >
        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
        <span>{t}</span>
      </li>
    ))}
  </ul>
);

const Code = ({ children }: { children: React.ReactNode }) => (
  <code className="rounded-md bg-secondary px-1.5 py-0.5 font-mono text-[12px] text-primary">
    {children}
  </code>
);

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-2xl bg-secondary/60 px-4 py-3">
    <p className="font-sans text-3xl font-extrabold text-primary">{value}</p>
    <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
      {label}
    </p>
  </div>
);

const Th = ({ children }: { children: React.ReactNode }) => (
  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider">
    {children}
  </th>
);

const Td = ({ children }: { children: React.ReactNode }) => (
  <td className="px-4 py-3 align-top text-sm text-muted-foreground">{children}</td>
);

const Tr = ({ i, k, l, m }: { i: number; k: string; l: string; m: string }) => (
  <tr>
    <Td>
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
        {i}
      </span>
    </Td>
    <Td>
      <Code>{k}</Code>
    </Td>
    <Td>
      <span className="font-semibold text-primary">{l}</span>
    </Td>
    <Td>{m}</Td>
  </tr>
);

interface ScreenCardProps {
  icon: React.ReactNode;
  title: string;
  route: string;
  orderId: string;
  currentIndex: number;
  illustration: string;
  heroAnimation: string;
  copy: { status: string; subtitle: string };
  flags: string[];
  sections: string[];
}

const ScreenCard = ({
  icon,
  title,
  route,
  orderId,
  currentIndex,
  illustration,
  heroAnimation,
  copy,
  flags,
  sections,
}: ScreenCardProps) => (
  <article className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border bg-gradient-surface-mint/40 p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          {icon}
        </span>
        <div>
          <h3 className="font-sans text-lg font-bold text-primary">{title}</h3>
          <p className="mt-0.5 text-xs font-mono text-muted-foreground">
            {orderId} · stage {currentIndex} / 4
          </p>
        </div>
      </div>
      <Link
        to={route}
        className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground transition-transform active:scale-95"
      >
        Open {route}
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>

    <div className="grid gap-5 p-5 md:grid-cols-2">
      <div>
        <SmallLabel>Hero copy</SmallLabel>
        <p className="mt-1 font-sans text-base font-bold text-primary">
          {copy.status}
        </p>
        <p className="text-sm text-muted-foreground">{copy.subtitle}</p>

        <SmallLabel className="mt-4">Illustration</SmallLabel>
        <p className="mt-1 text-sm text-muted-foreground">{illustration}</p>

        <SmallLabel className="mt-4">Animation</SmallLabel>
        <p className="mt-1 text-sm text-muted-foreground">{heroAnimation}</p>

        <SmallLabel className="mt-4">Key flags</SmallLabel>
        <ul className="mt-1 space-y-1">
          {flags.map((f) => (
            <li key={f} className="text-sm text-muted-foreground">
              <Code>{f}</Code>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <SmallLabel>Composition (top → bottom)</SmallLabel>
        <ol className="mt-2 space-y-2">
          {sections.map((s, idx) => (
            <li
              key={s}
              className="flex gap-2 rounded-xl bg-secondary/40 px-3 py-2 text-sm text-primary"
            >
              <span className="font-mono text-xs text-muted-foreground">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <span className="font-medium">{s}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  </article>
);

const SmallLabel = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <p
    className={`text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground ${className}`}
  >
    {children}
  </p>
);

interface ComponentBlockProps {
  name: string;
  purpose: string;
  props: string[];
  notes: string[];
}

const ComponentBlock = ({ name, purpose, props, notes }: ComponentBlockProps) => (
  <div className="mt-5 rounded-3xl border border-border bg-card p-5 shadow-card">
    <div className="flex flex-wrap items-baseline justify-between gap-2">
      <h3 className="font-sans text-lg font-bold text-primary">{name}</h3>
      <Code>component</Code>
    </div>
    <p className="mt-2 text-sm text-muted-foreground">{purpose}</p>

    {props.length > 0 && (
      <>
        <SmallLabel className="mt-4">Props</SmallLabel>
        <ul className="mt-2 space-y-1.5">
          {props.map((p) => (
            <li key={p} className="font-mono text-[12px] leading-relaxed text-muted-foreground">
              · {p}
            </li>
          ))}
        </ul>
      </>
    )}

    {notes.length > 0 && (
      <>
        <SmallLabel className="mt-4">Notes</SmallLabel>
        <ul className="mt-2 space-y-1.5">
          {notes.map((n) => (
            <li key={n} className="text-sm leading-relaxed text-muted-foreground">
              · {n}
            </li>
          ))}
        </ul>
      </>
    )}
  </div>
);

const EdgeCase = ({
  title,
  trigger,
  behavior,
}: {
  title: string;
  trigger: string;
  behavior: string;
}) => (
  <div className="mt-4 rounded-3xl border border-border bg-card p-5 shadow-card">
    <h3 className="font-sans text-base font-bold text-primary">{title}</h3>
    <p className="mt-2 text-sm">
      <span className="font-bold text-primary">Trigger: </span>
      <span className="text-muted-foreground">{trigger}</span>
    </p>
    <p className="mt-1.5 text-sm">
      <span className="font-bold text-primary">Behavior: </span>
      <span className="text-muted-foreground">{behavior}</span>
    </p>
  </div>
);

export default PRD;
