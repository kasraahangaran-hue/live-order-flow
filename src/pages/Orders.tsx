import { ClipboardList } from "lucide-react";
import { BottomTabBar } from "@/components/nav/BottomTabBar";
import { OrderCard } from "@/components/orders/OrderCard";
import { WardrobeCard } from "@/components/orders/WardrobeCard";
import { MOCK_ACTIVE_ORDERS, MOCK_PAST_ORDERS } from "@/lib/mock-orders";
import { STATUS_TO_CATEGORY } from "@/lib/order-types";

const Orders = () => {
  const needsAttentionOrders = MOCK_ACTIVE_ORDERS.filter(
    (o) =>
      STATUS_TO_CATEGORY[o.status] === "needs_attention_urgent" ||
      STATUS_TO_CATEGORY[o.status] === "needs_attention_soft",
  );
  const otherActiveOrders = MOCK_ACTIVE_ORDERS.filter(
    (o) =>
      STATUS_TO_CATEGORY[o.status] !== "needs_attention_urgent" &&
      STATUS_TO_CATEGORY[o.status] !== "needs_attention_soft",
  );
  const pastOrders = MOCK_PAST_ORDERS;

  const showActiveSection =
    otherActiveOrders.length > 0 || needsAttentionOrders.length === 0;

  return (
    <main className="min-h-screen bg-background font-sans antialiased">
      <div className="mx-auto max-w-md px-5 pb-24" style={{ paddingTop: "44px" }}>
        <h1 className="text-2xl font-extrabold text-primary">Orders</h1>

        <div className="mt-5">
          <WardrobeCard />
        </div>

        {/* Needs your attention — elevated above active orders */}
        {needsAttentionOrders.length > 0 && (
          <>
            <SectionHeader>Highlights</SectionHeader>
            <div className="flex flex-col gap-3">
              {needsAttentionOrders.map((o) => (
                <OrderCard key={o.orderId} order={o} />
              ))}
            </div>
          </>
        )}

        {/* Active Orders */}
        {showActiveSection && (
          <>
            <SectionHeader>Active Orders</SectionHeader>
            {otherActiveOrders.length === 0 ? (
              <EmptyActive />
            ) : (
              <div className="flex flex-col gap-3">
                {otherActiveOrders.map((o) => (
                  <OrderCard key={o.orderId} order={o} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Past Orders */}
        {pastOrders.length > 0 && (
          <>
            <SectionHeader>Past Orders</SectionHeader>
            <div className="flex flex-col gap-3">
              {pastOrders.map((o) => (
                <OrderCard key={o.orderId} order={o} />
              ))}
            </div>
          </>
        )}
      </div>
      <BottomTabBar />
    </main>
  );
};

const SectionHeader = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mb-3 mt-6 font-sans text-base font-bold text-primary">{children}</h2>
);

const EmptyActive = () => (
  <div className="flex h-60 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card/50 px-6 text-center">
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted text-muted-foreground">
      <ClipboardList className="h-10 w-10" strokeWidth={1.6} />
    </div>
    <div>
      <p className="font-sans text-sm font-semibold text-primary">No active orders</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Place an order to get your laundry picked up
      </p>
    </div>
    <button
      type="button"
      onClick={() => { /* no-op: place-order CTA is not wired in the prototype */ }}
      className="mt-2 w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-press transition-transform duration-100 ease-out active:duration-75 active:scale-[0.97]"
    >
      Place an order
    </button>
  </div>
);

export default Orders;
