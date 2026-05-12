import { AlertTriangle } from "lucide-react";

import { OrderShell } from "@/components/order/OrderShell";
import { ActionCard } from "@/components/order/ActionCard";
import { DeliveryCard } from "@/components/order/DeliveryCard";
import {
  ServicesSelection,
  OrderInstructions,
  OrderConfirmations,
} from "@/components/order/OrderSections";
import { useOrderData } from "@/lib/useOrderData";
import type { Stage } from "@/components/order/StatusTimeline";

const DropoffFailed = () => {
  const order = useOrderData();
  const ts = order.stageTimestamps;

  const stages: Stage[] = [
    { key: "order_received", label: "Order Received", timestamp: ts.order_received },
    { key: "pickup_completed", label: "Order Picked-up", timestamp: ts.pickup_completed },
    { key: "items_sorted", label: "Items in Process", timestamp: ts.items_sorted },
    { key: "dropoff_today", label: "Drop Off Today", timestamp: ts.dropoff_today },
    {
      key: "dropoff_in_progress",
      label: "Driver on the Way",
      icon: "hold",
      pill: { label: "DROP OFF FAILED", variant: "urgent" },
      timestamp: ts.dropoff_in_progress,
    },
    { key: "dropoff_completed", label: "Dropped Off" },
  ];

  return (
    <OrderShell
      hero={{
        status: "Drop Off Failed",
        subtitle: "We couldn't complete the delivery. Please reschedule to try again.",
        orderType: order.orderType,
        orderId: order.orderId,
        showSupport: true,
        stages,
        currentIndex: 4,
        onHold: true,
        heroIcon: <AlertTriangle strokeWidth={2.2} />,
      }}
    >
      <ActionCard
        variant="urgent"
        icon={<AlertTriangle strokeWidth={2.4} />}
        title="Drop off failed"
        message="The driver wasn't able to deliver your items. Reschedule the drop off to try again."
        primaryAction={{ label: "Reschedule drop off", variant: "primary" }}
      />

      <DeliveryCard
        dropoffNote={order.pickupNote ?? "Picked up at door"}
        address={order.pickupLocation}
        when={ts.pickup_completed ?? order.pickupWindow}
        pickupDone
        dropoff={{ label: "Drop off failed", when: "Awaiting reschedule" }}
      />

      <OrderConfirmations stage="items-in" orderId={order.orderId} order={order} />
      <ServicesSelection locked />
      <OrderInstructions locked />
    </OrderShell>
  );
};

export default DropoffFailed;
