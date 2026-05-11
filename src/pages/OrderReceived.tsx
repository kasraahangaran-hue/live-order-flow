import { OrderShell } from "@/components/order/OrderShell";
import { DeliveryCard } from "@/components/order/DeliveryCard";
import { UpsellBanner } from "@/components/order/UpsellBanner";
import { AddBagInstructionsCard } from "@/components/order/AddBagInstructionsCard";
import { ServicesSelection, OrderInstructions, OrderConfirmations } from "@/components/order/OrderSections";
import { useOrderData } from "@/lib/useOrderData";
import type { Stage } from "@/components/order/StatusTimeline";

const OrderReceived = () => {
  const order = useOrderData();
  const ts = order.stageTimestamps;

  const stages: Stage[] = [
    { key: "received", label: "Order received", timestamp: ts.received ?? "Just now" },
    { key: "collected", label: "Collected" },
    { key: "processing", label: "Processing" },
    { key: "delivery", label: "Out for delivery" },
    { key: "complete", label: "Delivered" },
  ];

  return (
    <OrderShell
      hero={{
        status: "Order received",
        subtitle: `Pickup ${order.pickupWindow}`,
        orderType: order.orderType,
        orderId: order.orderId,
        showSupport: true,
        stages,
        currentIndex: 0,
        cancellable: order.cancellable,
        doorPickup: order.leaveBagsOutside,
      }}
    >
      <AddBagInstructionsCard />

      <UpsellBanner />

      <ServicesSelection />
      <OrderInstructions />

      <DeliveryCard
        dropoffNote={order.pickupNote ?? "Pickup at door"}
        address={order.pickupLocation}
        when={order.pickupWindow}
        dropoff={{ label: order.dropoffNote ?? "Drop off at door", when: order.dropoffWindow }}
      />

      <OrderConfirmations stage="received" />
    </OrderShell>
  );
};

export default OrderReceived;
