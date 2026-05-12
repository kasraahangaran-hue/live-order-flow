import { OrderShell } from "@/components/order/OrderShell";
import { DeliveryCard } from "@/components/order/DeliveryCard";

import { ServicesSelection, OrderInstructions, OrderConfirmations } from "@/components/order/OrderSections";
import { useOrderData } from "@/lib/useOrderData";
import type { Stage } from "@/components/order/StatusTimeline";

const OrderCollected = () => {
  const order = useOrderData();
  const ts = order.stageTimestamps;

  const stages: Stage[] = [
    { key: "received", label: "Order received", timestamp: ts.received },
    { key: "collected", label: "Collected", timestamp: ts.collected },
    { key: "processing", label: "Processing" },
    { key: "delivery", label: "Out for delivery" },
    { key: "complete", label: "Delivered" },
  ];

  return (
    <OrderShell
      hero={{
        status: "Order Collected",
        subtitle: "Your laundry is on its way to our facility",
        orderType: order.orderType,
        orderId: order.orderId,
        showSupport: true,
        stages,
        currentIndex: 1,
        variant: "delivery",
      }}
    >
      <DeliveryCard
        dropoffNote={order.pickupNote ?? "Picked up at door"}
        address={order.pickupLocation}
        when={ts.collected ?? order.pickupWindow}
        pickupDone
        dropoff={{ label: order.dropoffNote ?? "Drop off at door", when: order.dropoffWindow }}
        defaultOpen={false}
      />

      <OrderConfirmations stage="collected" orderId={order.orderId} order={order} />

      <ServicesSelection locked />
      <OrderInstructions locked />
    </OrderShell>
  );
};

export default OrderCollected;
