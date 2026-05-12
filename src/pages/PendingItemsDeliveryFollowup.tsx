import { Package } from "lucide-react";

import { OrderShell } from "@/components/order/OrderShell";
import { ActionCard } from "@/components/order/ActionCard";
import { DeliveryCard } from "@/components/order/DeliveryCard";
import { OrderConfirmations, ServicesSelection, OrderInstructions } from "@/components/order/OrderSections";
import { useOrderData } from "@/lib/useOrderData";
import type { Stage } from "@/components/order/StatusTimeline";

const PendingItemDelivery = () => {
  const order = useOrderData();
  const ts = order.stageTimestamps;
  const pending = order.itemsPending ?? 3;
  const noun = pending === 1 ? "item" : "items";

  const stages: Stage[] = [
    { key: "received", label: "Order Received", timestamp: ts.received },
    { key: "collected", label: "Order Pick Up", timestamp: ts.collected },
    { key: "items_in_process", label: "Items in Process", timestamp: ts.items_in_process },
    {
      key: "approval_done",
      label: "2 items needed approval",
      icon: "approval",
      timestamp: ts.approval_completed ?? "22 Aug, 10:00 am",
    },
    { key: "delivery_today", label: "Drop Off Today", timestamp: ts.delivery_today },
    { key: "partially_delivered", label: "Order Partially Delivered", timestamp: ts.partially_delivered },
    { key: "pending_item_delivery", label: "Pending Item Delivery", icon: "truck" },
    { key: "complete", label: "Delivered" },
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
        when={ts.collected ?? order.pickupWindow}
        pickupDone
        dropoff={{ label: "Remaining items", when: "Today · before 08:00 PM" }}
      />

      <OrderConfirmations stage="delivery" orderId={order.orderId} order={order} />
      <ServicesSelection locked />
      <OrderInstructions locked />
    </OrderShell>
  );
};

export default PendingItemDelivery;
