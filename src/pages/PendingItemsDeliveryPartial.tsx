import { Package } from "lucide-react";

import { OrderShell } from "@/components/order/OrderShell";
import { ActionCard } from "@/components/order/ActionCard";
import { DeliveryCard } from "@/components/order/DeliveryCard";
import { OrderConfirmations, ServicesSelection, OrderInstructions } from "@/components/order/OrderSections";
import { useOrderData } from "@/lib/useOrderData";
import type { Stage } from "@/components/order/StatusTimeline";

const PendingItemsDeliveryPartial = () => {
  const order = useOrderData();
  const ts = order.stageTimestamps;
  const pending = order.itemsPending ?? 3;
  const noun = pending === 1 ? "item" : "items";

  const stages: Stage[] = [
    { key: "order_received", label: "Order Received", timestamp: ts.order_received },
    { key: "pickup_completed", label: "Order Picked-up", timestamp: ts.pickup_completed },
    { key: "items_sorted", label: "Items in Process", timestamp: ts.items_sorted },
    {
      key: "items_pending_approval",
      label: "2 items needed approval",
      icon: "approval",
      timestamp: ts.items_pending_approval ?? "22 Aug, 10:00 am",
    },
    { key: "dropoff_today", label: "Drop Off Today", timestamp: ts.dropoff_today },
    { key: "pending_items_delivery_partial", label: "Order Partially Dropped Off", icon: "package" },
    { key: "pending_items_delivery_followup", label: "Pending Item Drop Off" },
    { key: "dropoff_completed", label: "Dropped Off" },
  ];

  return (
    <OrderShell
      hero={{
        status: "Order Partially Dropped Off",
        subtitle: `${pending} ${noun} pending · coming tomorrow`,
        orderType: order.orderType,
        orderId: order.orderId,
        showSupport: true,
        stages,
        currentIndex: 5,
        variant: "complete",
      }}
    >
      <ActionCard
        variant="attention"
        icon={<Package strokeWidth={2.4} />}
        title={`${pending} ${noun} pending delivery`}
        message="Your remaining items will be delivered tomorrow before 08:00 pm."
        primaryAction={{ label: "View pending items", variant: "primary" }}
      />

      <DeliveryCard
        dropoffNote={order.pickupNote ?? "Picked up at door"}
        address={order.pickupLocation}
        when={ts.pickup_completed ?? order.pickupWindow}
        pickupDone
        dropoff={{ label: "Partially delivered", when: order.dropoffWindow, done: true }}
      />

      <OrderConfirmations stage="delivery" orderId={order.orderId} order={order} />
      <ServicesSelection locked />
      <OrderInstructions locked />
    </OrderShell>
  );
};

export default PendingItemsDeliveryPartial;
