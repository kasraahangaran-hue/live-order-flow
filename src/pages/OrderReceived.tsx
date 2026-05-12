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
    { key: "order_received", label: "Order Received", timestamp: ts.order_received ?? "Just now" },
    { key: "pickup_completed", label: "Order Picked-up" },
    { key: "items_sorted", label: "Items in Process" },
    { key: "dropoff_today", label: "Drop Off Today" },
    { key: "dropoff_completed", label: "Dropped Off" },
  ];

  return (
    <OrderShell
      hero={{
        status: "Order Received",
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
