import { UserRound } from "lucide-react";

import { OrderShell } from "@/components/order/OrderShell";
import { DeliveryCard } from "@/components/order/DeliveryCard";
import { UpsellBanner } from "@/components/order/UpsellBanner";
import { AddBagInstructionsCard } from "@/components/order/AddBagInstructionsCard";
import {
  ServicesSelection,
  OrderInstructions,
  OrderConfirmations,
} from "@/components/order/OrderSections";
import { useOrderData } from "@/lib/useOrderData";
import type { Stage } from "@/components/order/StatusTimeline";

const DriverAssigned = () => {
  const order = useOrderData();
  const ts = order.stageTimestamps;

  const stages: Stage[] = [
    { key: "received", label: "Order received", timestamp: ts.received },
    { key: "collected", label: "Collected" },
    { key: "processing", label: "Processing" },
    { key: "delivery", label: "Out for delivery" },
    { key: "complete", label: "Delivered" },
  ];

  return (
    <OrderShell
      hero={{
        status: "Driver assigned",
        subtitle: "Your driver has been assigned and will be on the way shortly",
        orderType: order.orderType,
        orderId: order.orderId,
        showSupport: true,
        stages,
        currentIndex: 0,
        cancellable: order.cancellable,
        doorPickup: order.leaveBagsOutside,
        variant: "received",
        heroIcon: <UserRound strokeWidth={2.2} />,
      }}
    >
      <AddBagInstructionsCard />

      <UpsellBanner />

      <ServicesSelection />
      <OrderInstructions />

      <DeliveryCard
        dropoffNote={order.pickupNote ?? "Pickup at door"}
        address={order.pickupLocation}
        when={order.pickupWindow}
        dropoff={{ label: order.dropoffNote ?? "Drop off at door", when: order.dropoffWindow }}
      />

      <OrderConfirmations stage="received" />
    </OrderShell>
  );
};

export default DriverAssigned;
