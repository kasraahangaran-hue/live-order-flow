import { TriangleAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { OrderShell } from "@/components/order/OrderShell";
import { ActionCard } from "@/components/order/ActionCard";
import { DeliveryCard } from "@/components/order/DeliveryCard";
import { OrderConfirmations, ServicesSelection, OrderInstructions } from "@/components/order/OrderSections";

import { useOrderData } from "@/lib/useOrderData";
import type { Stage } from "@/components/order/StatusTimeline";

const ItemsPendingApproval = () => {
  const order = useOrderData();
  const navigate = useNavigate();
  const ts = order.stageTimestamps;
  const count = order.itemsAwaitingApproval ?? 0;
  const noun = count === 1 ? "item" : "items";

  const stages: Stage[] = [
    { key: "received", label: "Order Received", timestamp: ts.order_received },
    { key: "collected", label: "Order Pick Up", timestamp: ts.pickup_completed },
    {
      key: "items_in_process",
      label: "Items in Process",
      icon: "approval",
      pill: { label: "AWAITING APPROVAL", variant: "attention" },
      timestamp: ts.items_sorted,
    },
    { key: "delivery_today", label: "Drop Off Today" },
    { key: "driver_on_the_way", label: "Driver on the Way" },
    { key: "complete", label: "Delivered" },
  ];

  return (
    <OrderShell
      hero={{
        status: "Approval Required",
        subtitle: `${count} ${noun} awaiting your review`,
        orderType: order.orderType,
        orderId: order.orderId,
        showSupport: true,
        stages,
        currentIndex: 2,
        variant: "received",
      }}
    >
      <ActionCard
        variant="attention"
        icon={<TriangleAlert strokeWidth={2.4} />}
        title={`${count} ${noun} need approval`}
        message={`You need to review and approve ${count} ${noun} before they can be processed.`}
        countdown={order.approvalDeadline}
        primaryAction={{
          label: "Review items",
          variant: "primary",
          onClick: () => navigate(`/portal/${order.orderId}/approval`, { state: { order } }),
        }}
      />

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

export default ItemsPendingApproval;
