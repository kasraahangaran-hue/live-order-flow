import { OrderShell } from "@/components/order/OrderShell";
import { DeliveryCard } from "@/components/order/DeliveryCard";
import { OrderConfirmations, ServicesSelection, OrderInstructions } from "@/components/order/OrderSections";
import { useOrderData } from "@/lib/useOrderData";
import type { Stage } from "@/components/order/StatusTimeline";

const PickupInProgress = () => {
  const order = useOrderData();
  const ts = order.stageTimestamps;
  const arriving = ts.dropoff_in_progress ?? order.dropoffWindow;

  const stages: Stage[] = [
    { key: "order_received", label: "Order Received", timestamp: ts.order_received },
    { key: "pickup_completed", label: "Order Picked-up", timestamp: ts.pickup_completed },
    { key: "items_sorted", label: "Items in Process", timestamp: ts.items_sorted },
    { key: "dropoff_today", label: "Drop Off Today", timestamp: ts.dropoff_today ?? arriving },
    {
      key: "pickup_in_progress",
      label: "Driver on the Way",
      icon: "truck",
      timestamp: arriving,
    },
    { key: "dropoff_completed", label: "Dropped Off" },
  ];

  return (
    <OrderShell
      hero={{
        status: "Driver on the Way",
        subtitle: `Arriving ${arriving}`,
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
        when={ts.pickup_completed ?? order.pickupWindow}
        pickupDone
        dropoff={{ label: order.dropoffNote ?? "Delivery at door", when: arriving }}
      />

      <OrderConfirmations stage="delivery" orderId={order.orderId} order={order} />
      <ServicesSelection locked />
      <OrderInstructions locked />
    </OrderShell>
  );
};

export default PickupInProgress;
