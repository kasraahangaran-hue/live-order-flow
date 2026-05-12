import { OrderShell } from "@/components/order/OrderShell";
import { DeliveryCard } from "@/components/order/DeliveryCard";
import { OrderConfirmations, ServicesSelection, OrderInstructions } from "@/components/order/OrderSections";
import { useOrderData } from "@/lib/useOrderData";
import type { Stage } from "@/components/order/StatusTimeline";

const ItemsSorted = () => {
  const order = useOrderData();
  const ts = order.stageTimestamps;

  const stages: Stage[] = [
    { key: "order_received", label: "Order Received", timestamp: ts.order_received },
    { key: "pickup_completed", label: "Order Picked-up", timestamp: ts.pickup_completed },
    { key: "items_sorted", label: "Items in Process", timestamp: ts.items_sorted },
    { key: "dropoff_today", label: "Drop Off Today" },
    { key: "dropoff_completed", label: "Dropped Off" },
  ];

  return (
    <OrderShell
      hero={{
        status: "Items in Process",
        subtitle: "Your laundry is being cared for",
        orderType: order.orderType,
        orderId: order.orderId,
        showSupport: true,
        stages,
        currentIndex: 2,
        variant: "processing",
      }}
    >
      <DeliveryCard
        dropoffNote={order.pickupNote ?? "Picked up at door"}
        address={order.pickupLocation}
        when={ts.pickup_completed ?? order.pickupWindow}
        pickupDone
        dropoff={{ label: order.dropoffNote ?? "Drop off at door", when: order.dropoffWindow }}
      />

      <OrderConfirmations stage="items-in" orderId={order.orderId} order={order} />
      <ServicesSelection locked />
      <OrderInstructions locked />
    </OrderShell>
  );
};

export default ItemsSorted;
