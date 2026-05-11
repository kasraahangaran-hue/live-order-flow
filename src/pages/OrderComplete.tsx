import { OrderShell } from "@/components/order/OrderShell";
import { QuickActions } from "@/components/order/QuickActions";
import { DeliveryCard } from "@/components/order/DeliveryCard";
import { OrderConfirmations, ServicesSelection, OrderInstructions } from "@/components/order/OrderSections";
import { useOrderData } from "@/lib/useOrderData";
import type { Stage } from "@/components/order/StatusTimeline";

const OrderComplete = () => {
  const order = useOrderData();
  const ts = order.stageTimestamps;

  const stages: Stage[] = [
    { key: "received", label: "Order received", timestamp: ts.received },
    { key: "collected", label: "Collected", timestamp: ts.collected },
    { key: "processing", label: "Processing", timestamp: ts.items_in_process },
    { key: "delivery", label: "Out for delivery", timestamp: ts.delivery_today },
    { key: "complete", label: "Delivered", timestamp: ts.complete },
  ];

  return (
    <OrderShell
      hero={{
        status: "Completed Order",
        subtitle: ts.complete ? `Delivered ${ts.complete}` : "Delivered",
        orderType: order.orderType,
        orderId: order.orderId,
        stages,
        currentIndex: 4,
        completed: true,
      }}
    >
      <QuickActions />

      <OrderConfirmations stage="delivered" orderId={order.orderId} order={order} />

      <DeliveryCard
        dropoffNote={order.pickupNote ?? "Picked up at door"}
        address={order.pickupLocation}
        when={ts.collected ?? order.pickupWindow}
        pickupDone
        dropoff={{
          label: order.dropoffNote ?? "Delivered at door",
          when: ts.complete ?? order.dropoffWindow,
          done: true,
        }}
        defaultOpen={false}
      />

      <ServicesSelection locked />
      <OrderInstructions locked />
    </OrderShell>
  );
};

export default OrderComplete;
