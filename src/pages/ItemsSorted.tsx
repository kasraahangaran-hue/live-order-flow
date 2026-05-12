import { OrderShell } from "@/components/order/OrderShell";
import { DeliveryCard } from "@/components/order/DeliveryCard";
import { OrderConfirmations, ServicesSelection, OrderInstructions } from "@/components/order/OrderSections";
import { useOrderData } from "@/lib/useOrderData";
import type { Stage } from "@/components/order/StatusTimeline";

const ItemsSorted = () => {
  const order = useOrderData();
  const ts = order.stageTimestamps;

  const stages: Stage[] = [
    { key: "received", label: "Order received", timestamp: ts.order_received },
    { key: "collected", label: "Collected", timestamp: ts.pickup_completed },
    { key: "processing", label: "ItemsSorted", timestamp: ts.items_sorted },
    { key: "delivery", label: "Out for delivery" },
    { key: "complete", label: "Delivered" },
  ];

  return (
    <OrderShell
      hero={{
        status: "Cleaning at Our Facility",
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
