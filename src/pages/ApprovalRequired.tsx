import { TriangleAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { StatusHero } from "@/components/order/StatusHero";
import { OrderHeader } from "@/components/order/OrderHeader";
import { ActionCard } from "@/components/order/ActionCard";
import { DeliveryCard } from "@/components/order/DeliveryCard";
import { OrderConfirmations, ServicesSelection, OrderInstructions } from "@/components/order/OrderSections";

import { useOrderData } from "@/lib/useOrderData";
import type { Stage } from "@/components/order/StatusTimeline";

const ApprovalRequired = () => {
  const order = useOrderData();
  const navigate = useNavigate();
  const ts = order.stageTimestamps;
  const count = order.itemsAwaitingApproval ?? 0;
  const noun = count === 1 ? "item" : "items";

  const stages: Stage[] = [
    { key: "received", label: "Order Received", timestamp: ts.received },
    { key: "collected", label: "Order Pick Up", timestamp: ts.collected },
    {
      key: "items_in_process",
      label: "Items in Process",
      icon: "approval",
      pill: { label: "AWAITING APPROVAL", variant: "attention" },
      timestamp: ts.items_in_process,
    },
    { key: "delivery_today", label: "Drop Off Today" },
    { key: "driver_on_the_way", label: "Driver on the Way" },
    { key: "complete", label: "Delivered" },
  ];

  return (
    <main className="fixed inset-0 overflow-hidden bg-background font-sans antialiased overscroll-none">
      <div className="mx-auto flex h-[100dvh] max-w-md flex-col overflow-hidden bg-background shadow-hero md:my-6 md:h-[calc(100vh-3rem)] md:rounded-[2.25rem] md:border md:border-border">
        <div className="z-[60] shrink-0 bg-gradient-hero shadow-hero">
          <OrderHeader
            orderId={order.orderId}
            orderType={order.orderType}
            showSupport
            variant="inline"
          />
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain pb-32">
          <div className="min-h-[calc(100%+120px)]">
          <StatusHero
            status="Approval required"
            subtitle={`${count} ${noun} awaiting your review`}
            orderType={order.orderType}
            orderId={order.orderId}
            showSupport
            stages={stages}
            currentIndex={2}
            variant="received"
            showHeader={false}
          />

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
            when={ts.collected ?? order.pickupWindow}
            pickupDone
            dropoff={{ label: order.dropoffNote ?? "Drop off at door", when: order.dropoffWindow }}
          />

          <OrderConfirmations stage="items-in" orderId={order.orderId} order={order} />
          <ServicesSelection locked />
          <OrderInstructions locked />
          </div>
        </div>
      </div>
    </main>
  );
};

export default ApprovalRequired;
