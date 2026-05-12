import { Package } from "lucide-react";

import { OrderShell } from "@/components/order/OrderShell";
import { ActionCard } from "@/components/order/ActionCard";
import { DeliveryCard } from "@/components/order/DeliveryCard";
import { OrderConfirmations, ServicesSelection, OrderInstructions } from "@/components/order/OrderSections";
import { useOrderData } from "@/lib/useOrderData";
import type { Stage } from "@/components/order/StatusTimeline";

const PendingItemsDeliveryFollowup = () => {
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
    { key: "pending_items_delivery_partial", label: "Order Partially Dropped Off", timestamp: ts.pending_items_delivery_partial },
    { key: "pending_items_delivery_followup", label: "Pending Item Drop Off", icon: "truck" },
    { key: "dropoff_completed", label: "Dropped Off" },
  ];

  return (
    <OrderShell
      hero={{
        status: "Pending Item Drop Off",
        subtitle: "Today, before 08:00 pm",
        orderType: order.orderType,
        orderId: order.orderId,
        showSupport: true,
        stages,
        currentIndex: 6,
        variant: "delivery",
      }}
    >
      <ActionCard
        variant="attention"
        icon={<Package strokeWidth={2.4} />}
        title={`Pending delivery today`}
        message={`Your remaining ${pending} ${noun} arrive today before 08:00 pm.`}
        primaryAction={{ label: "View pending items", variant: "primary" }}
      />

      <DeliveryCard
        dropoffNote={order.pickupNote ?? "Picked up at door"}
        address={order.pickupLocation}
        when={ts.pickup_completed ?? order.pickupWindow}
        pickupDone
        dropoff={{ label: "Remaining items", when: "Today · before 08:00 PM" }}
      />

      <OrderConfirmations stage="delivery" orderId={order.orderId} order={order} />
      <ServicesSelection locked />
      <OrderInstructions locked />
    </OrderShell>
  );
};

export default PendingItemsDeliveryFollowup;
