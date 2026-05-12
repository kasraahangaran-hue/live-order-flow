import { FileX } from "lucide-react";

import { OrderShell } from "@/components/order/OrderShell";
import {
  ServicesSelection,
  OrderInstructions,
  OrderConfirmations,
} from "@/components/order/OrderSections";
import { useOrderData } from "@/lib/useOrderData";

const OrderCancelled = () => {
  const order = useOrderData();
  const cancelledAt = order.cancelledAt ?? "—";
  const status =
    order.cancelReason === "pickup_failed" ? "OrderCancelled, pick up failed!" : "OrderCancelled";

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
      <OrderConfirmations stage="received" orderId={order.orderId} order={order} />
      <ServicesSelection locked />
      <OrderInstructions locked />
    </OrderShell>
  );
};

export default OrderCancelled;
