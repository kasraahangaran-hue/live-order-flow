import { Truck } from "lucide-react";

import { OrderShell } from "@/components/order/OrderShell";
import { DeliveryCard } from "@/components/order/DeliveryCard";
import {
  ServicesSelection,
  OrderInstructions,
  OrderConfirmations,
} from "@/components/order/OrderSections";
import { useOrderData } from "@/lib/useOrderData";
import type { Stage } from "@/components/order/StatusTimeline";

const DropoffAssigned = () => {
  const order = useOrderData();
  const ts = order.stageTimestamps;

  const stages: Stage[] = [
    { key: "received", label: "Order received", timestamp: ts.received },
    { key: "collected", label: "Collected", timestamp: ts.collected },
    { key: "processing", label: "Processing", timestamp: ts.items_in_process },
    { key: "delivery", label: "Out for drop off" },
    { key: "complete", label: "Delivered" },
  ];

  return (
    <OrderShell
      hero={{
        status: "Out for Drop Off",
        subtitle: "Your items are with the driver and on their way back to you",
        orderType: order.orderType,
        orderId: order.orderId,
        showSupport: true,
        stages,
        currentIndex: 3,
        variant: "delivery",
        heroIcon: <Truck strokeWidth={2.2} />,
      }}
    >
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

export default DropoffAssigned;
