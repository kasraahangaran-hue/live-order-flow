import { TriangleAlert } from "lucide-react";

import { OrderShell } from "@/components/order/OrderShell";
import { ActionCard } from "@/components/order/ActionCard";
import { DeliveryCard } from "@/components/order/DeliveryCard";
import { OrderConfirmations, ServicesSelection, OrderInstructions } from "@/components/order/OrderSections";
import { useOrderData } from "@/lib/useOrderData";
import type { Stage } from "@/components/order/StatusTimeline";

const PaymentFailed = () => {
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
      pill: { label: "ON HOLD", variant: "urgent" },
    },
    { key: "dropoff_completed", label: "Dropped Off" },
  ];

  return (
    <OrderShell
      hero={{
        status: "Payment Required",
        subtitle: "Delivery on hold · capture payment to release",
        orderType: order.orderType,
        orderId: order.orderId,
        showSupport: true,
        stages,
        currentIndex: 4,
        onHold: true,
      }}
    >
      <ActionCard
        variant="urgent"
        icon={<TriangleAlert strokeWidth={2.4} />}
        title="Payment failed"
        message="Your card was declined. We can't deliver your order until payment is captured."
        amountDue={order.amountDue ?? "AED 142.00 due"}
        primaryAction={{ label: "Retry payment", variant: "primary" }}
        secondaryAction={{ label: "Update card", variant: "secondary" }}
      />

      <DeliveryCard
        dropoffNote={order.pickupNote ?? "Picked up at door"}
        address={order.pickupLocation}
        when={ts.pickup_completed ?? order.pickupWindow}
        pickupDone
        dropoff={{ label: "Drop Off on Hold", when: "Pending payment" }}
      />

      <OrderConfirmations stage="delivery" orderId={order.orderId} order={order} />
      <ServicesSelection locked />
      <OrderInstructions locked />
    </OrderShell>
  );
};

export default PaymentFailed;
