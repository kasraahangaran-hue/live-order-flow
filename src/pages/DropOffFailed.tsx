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

const DropOffFailed = () => {
  const order = useOrderData();
  const ts = order.stageTimestamps;

  const stages: Stage[] = [
    { key: "received", label: "Order Received", timestamp: ts.received },
    { key: "collected", label: "Order Pick Up", timestamp: ts.collected },
    { key: "items_in_process", label: "Items in Process", timestamp: ts.items_in_process },
    {
      key: "delivery_today",
      label: "Drop Off",
      pill: { label: "DROP OFF FAILED", variant: "attention" },
      timestamp: ts.driver_on_the_way ?? ts.delivery_today,
    },
    { key: "complete", label: "Delivered" },
  ];

  return (
    <OrderShell
      hero={{
        status: "Drop off failed",
        subtitle: "We couldn't complete the delivery. Please contact support or reschedule.",
        orderType: order.orderType,
        orderId: order.orderId,
        showSupport: true,
        stages,
        currentIndex: 3,
        variant: "hold",
        onHold: true,
        heroIcon: <AlertTriangle strokeWidth={2.2} />,
      }}
    >
      <ActionCard
        variant="attention"
        icon={<AlertTriangle strokeWidth={2.4} />}
        title="Drop off couldn't be completed"
        message="The driver wasn't able to deliver your items. You can reschedule the drop off or reach out to support."
        primaryAction={{
          label: "Reschedule drop off",
          variant: "primary",
        }}
        secondaryAction={{
          label: "Contact support",
          variant: "secondary",
        }}
      />

      <DeliveryCard
        dropoffNote={order.pickupNote ?? "Picked up at door"}
        address={order.pickupLocation}
        when={ts.collected ?? order.pickupWindow}
        pickupDone
        dropoff={{ label: order.dropoffNote ?? "Drop off at door", when: order.dropoffWindow }}
      />

      <OrderConfirmations stage="items-in" orderId={order.orderId} order={order} />
      <ServicesSelection locked />
      <OrderInstructions locked />
    </OrderShell>
  );
};

export default DropOffFailed;
