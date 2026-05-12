import { FileX } from "lucide-react";

import { OrderShell } from "@/components/order/OrderShell";
import {
  ServicesSelection,
  OrderInstructions,
  OrderConfirmations,
} from "@/components/order/OrderSections";
import { DeliveryCard } from "@/components/order/DeliveryCard";
import { useOrderData } from "@/lib/useOrderData";

const OrderCancelled = () => {
  const order = useOrderData();
  const ts = order.stageTimestamps;
  const cancelledAt = order.cancelledAt ?? "—";
  const status =
    order.cancelReason === "pickup_failed" ? "Cancelled, pick up failed!" : "Cancelled";

  return (
    <OrderShell
      hero={{
        status,
        subtitle: cancelledAt,
        orderType: order.orderType,
        orderId: order.orderId,
        showSupport: true,
        hideTimeline: true,
        heroGradient: "cancelled",
        heroIcon: <FileX strokeWidth={2.2} />,
      }}
    >
      <DeliveryCard
        dropoffNote={order.pickupNote ?? "Pickup at door"}
        address={order.pickupLocation}
        when={ts.pickup_completed ?? order.pickupWindow}
        dropoff={{ label: order.dropoffNote ?? "Drop off at door", when: order.dropoffWindow }}
        defaultOpen={false}
      />
      <OrderConfirmations stage="received" orderId={order.orderId} order={order} />
      <ServicesSelection locked />
      <OrderInstructions locked />
    </OrderShell>
  );
};

export default OrderCancelled;
