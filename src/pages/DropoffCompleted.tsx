import { OrderShell } from "@/components/order/OrderShell";
import { QuickActions } from "@/components/order/QuickActions";
import { DeliveryCard } from "@/components/order/DeliveryCard";
import { OrderConfirmations, ServicesSelection, OrderInstructions } from "@/components/order/OrderSections";
import { useOrderData } from "@/lib/useOrderData";
import type { Stage } from "@/components/order/StatusTimeline";

const DropoffCompleted = () => {
  const order = useOrderData();
  const ts = order.stageTimestamps;

  const stages: Stage[] = [
    { key: "order_received", label: "Order Received", timestamp: ts.order_received },
    { key: "pickup_completed", label: "Order Picked-up", timestamp: ts.pickup_completed },
    { key: "items_sorted", label: "Items in Process", timestamp: ts.items_sorted },
    { key: "dropoff_today", label: "Drop Off Today", timestamp: ts.dropoff_today },
    { key: "dropoff_completed", label: "Dropped Off", timestamp: ts.dropoff_completed },
  ];

  return (
    <OrderShell
      hero={{
        status: "Completed Order",
        subtitle: ts.dropoff_completed ? `Delivered ${ts.dropoff_completed}` : "Delivered",
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
        when={ts.pickup_completed ?? order.pickupWindow}
        pickupDone
        dropoff={{
          label: order.dropoffNote ?? "Dropped off at door",
          when: ts.dropoff_completed ?? order.dropoffWindow,
          done: true,
        }}
        defaultOpen={false}
      />

      <ServicesSelection locked />
      <OrderInstructions locked />
    </OrderShell>
  );
};

export default DropoffCompleted;
