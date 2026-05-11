
import { StatusHero } from "@/components/order/StatusHero";
import { QuickActions } from "@/components/order/QuickActions";
import { DeliveryCard } from "@/components/order/DeliveryCard";
import { DelayBanner } from "@/components/order/DelayBanner";
import { OrderConfirmations, ServicesSelection, OrderInstructions } from "@/components/order/OrderSections";
import { useOrderData } from "@/lib/useOrderData";
import type { Stage } from "@/components/order/StatusTimeline";

const Index = () => {
  const order = useOrderData();
  const ts = order.stageTimestamps;

  const stages: Stage[] = [
    { key: "received", label: "Order received", timestamp: ts.received },
    { key: "collected", label: "Collected", timestamp: ts.collected },
    { key: "processing", label: "Processing", timestamp: ts.items_in_process },
    { key: "delivery", label: "Out for delivery", timestamp: ts.delivery_today ?? "Today" },
    { key: "complete", label: "Delivered" },
  ];

  return (
    <main className="h-screen bg-background font-sans antialiased">
      <div className="mx-auto flex h-screen max-w-md flex-col bg-background shadow-hero md:my-6 md:h-[calc(100vh-3rem)] md:overflow-hidden md:rounded-[2.25rem] md:border md:border-border">
        <div className="flex-1 overflow-y-auto pb-32">
          <StatusHero
            status="Out for Drop Off"
            subtitle={`Today · ${order.dropoffWindow}`}
            orderType={order.orderType}
            orderId={order.orderId}
            stages={stages}
            currentIndex={3}
            variant="delivery"
          />

          <DelayBanner count={2} />

          <QuickActions />

          <DeliveryCard
            dropoffNote={order.pickupNote ?? "Picked up at door"}
            address={order.pickupLocation}
            when={ts.collected ?? order.pickupWindow}
            pickupDone
            dropoff={{ label: order.dropoffNote ?? "Delivery at door", when: order.dropoffWindow }}
          />

          <OrderConfirmations stage="delivery" orderId={order.orderId} order={order} />
          <ServicesSelection locked />
          <OrderInstructions locked />
        </div>
      </div>
    </main>
  );
};

export default Index;
