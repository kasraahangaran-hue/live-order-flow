import { OrderShell } from "@/components/order/OrderShell";
import { DeliveryCard } from "@/components/order/DeliveryCard";
import { OrderConfirmations, ServicesSelection, OrderInstructions } from "@/components/order/OrderSections";
import { useOrderData } from "@/lib/useOrderData";
import type { Stage } from "@/components/order/StatusTimeline";

const PickupInProgress = () => {
  const order = useOrderData();
  const ts = order.stageTimestamps;
  const arriving = ts.driver_on_the_way ?? order.dropoffWindow;

  const stages: Stage[] = [
    { key: "received", label: "Order Received", timestamp: ts.received },
    { key: "collected", label: "Order Pick Up", timestamp: ts.collected },
    { key: "items_in_process", label: "Items in Process", timestamp: ts.items_in_process },
    { key: "delivery_today", label: "Drop Off Today", timestamp: ts.delivery_today ?? arriving },
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
        currentIndex: 1,
        variant: "delivery",
      }}
    >
      <DeliveryCard
        dropoffNote={order.pickupNote ?? "Picked up at door"}
        address={order.pickupLocation}
        when={ts.collected ?? order.pickupWindow}
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
