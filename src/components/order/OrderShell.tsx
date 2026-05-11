import { useRef, useState, type ReactNode, type ComponentProps } from "react";
import { OrderHeader } from "./OrderHeader";
import { StatusHero } from "./StatusHero";

type StatusHeroProps = ComponentProps<typeof StatusHero>;

type OrderShellProps = {
  /** Props forwarded to StatusHero. `showHeader` and `tucked` are owned by OrderShell. */
  hero: Omit<StatusHeroProps, "showHeader" | "tucked">;
  children: ReactNode;
};

/**
 * Shared shell for order status pages. Renders:
 * - A locked top bar (no rubber-band drift) with the OrderHeader.
 * - A pinned hero card whose status block collapses on scroll (smooth border-radius).
 * - A scroll body with overscroll containment and an over-scroll spacer.
 */
export const OrderShell = ({ hero, children }: OrderShellProps) => {
  const [tucked, setTucked] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const touchYRef = useRef<number | null>(null);
  const gradientClass =
    hero.orderType === "finery" ? "bg-gradient-hero-finery" : "bg-gradient-hero";

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const top = e.currentTarget.scrollTop;
    setTucked((prev) => {
      if (!prev && top > 24) return true;
      if (prev && top < 8) return false;
      return prev;
    });
  };

  // Forward wheel/touch gestures over the hero region to the scroll body
  // so the user can keep scrolling without lifting their finger off the hero.
  const handleHeroWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop += e.deltaY;
  };

  const handleHeroTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchYRef.current = e.touches[0]?.clientY ?? null;
  };

  const handleHeroTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchYRef.current == null || !scrollRef.current) return;
    const y = e.touches[0]?.clientY ?? touchYRef.current;
    const delta = touchYRef.current - y;
    scrollRef.current.scrollTop += delta;
    touchYRef.current = y;
  };

  const handleHeroTouchEnd = () => {
    touchYRef.current = null;
  };

  return (
    <main className="fixed inset-0 overflow-hidden bg-background font-sans antialiased overscroll-none">
      <div className="mx-auto flex h-[100dvh] max-w-md flex-col overflow-hidden bg-background md:my-6 md:h-[calc(100vh-3rem)] md:rounded-[2.25rem] md:border md:border-border">
        <div
          className={`relative z-[60] shrink-0 overflow-hidden ${
            tucked ? "rounded-b-none" : "rounded-b-[28px]"
          } transition-[border-radius] duration-300 ease-out ${gradientClass} shadow-hero`}
          onWheel={handleHeroWheel}
          onTouchStart={handleHeroTouchStart}
          onTouchMove={handleHeroTouchMove}
          onTouchEnd={handleHeroTouchEnd}
          onTouchCancel={handleHeroTouchEnd}
        >
          <OrderHeader
            orderId={hero.orderId}
            orderType={hero.orderType ?? "laundry"}
            showSupport={hero.showSupport}
            onBack={hero.onBack}
            variant="inline"
          />
          <StatusHero {...hero} showHeader={false} tucked={tucked} />
        </div>
        <div
          ref={scrollRef}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-32 touch-pan-y"
          onScroll={handleScroll}
        >
          <div className="min-h-[calc(100%+120px)]">{children}</div>
        </div>
      </div>
    </main>
  );
};
