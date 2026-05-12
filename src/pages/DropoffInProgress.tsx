import { OrderShell } from "@/components/order/OrderShell";
import { DeliveryCard } from "@/components/order/DeliveryCard";
import { OrderConfirmations, ServicesSelection, OrderInstructions } from "@/components/order/OrderSections";
import { useOrderData } from "@/lib/useOrderData";
import type { Stage } from "@/components/order/StatusTimeline";

const DropoffInProgress = () => {
  const order = useOrderData();
  const ts = order.stageTimestamps;
  const arriving = ts.dropoff_in_progress ?? order.dropoffWindow;

  const stages: Stage[] = [
    { key: "received", label: "Order Received", timestamp: ts.order_received },
    { key: "collected", label: "Order Pick Up", timestamp: ts.pickup_completed },
    { key: "items_in_process", label: "Items in Process", timestamp: ts.items_sorted },
    { key: "delivery_today", label: "Drop Off Today", timestamp: ts.dropoff_today ?? arriving },
    {
      key: "driver_on_the_way",
      label: "Driver on the Way",
      icon: "truck",
      timestamp: arriving,
    },
    { key: "complete", label: "Delivered" },
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
        currentIndex: 4,
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

export default DropoffInProgress;
