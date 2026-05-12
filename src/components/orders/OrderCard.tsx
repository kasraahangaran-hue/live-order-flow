import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import {
  ORDER_TYPE_LABEL,
  STATUS_LABEL,
  STATUS_TO_CATEGORY,
  type OrderData,
  type OrderStatus,
} from "@/lib/order-types";
import { OrderTypeIcon } from "@/components/order/OrderTypeIcon";

export interface OrderCardProps {
  order: OrderData;
}

const STATUS_TO_ROUTE: Record<OrderStatus, string> = {
  order_received: "/order-received",
  pickup_assigned: "/pickup-assigned",
  pickup_in_progress: "/pickup-in-progress",
  pickup_completed: "/pickup-completed",
  items_sorted: "/items-sorted",
  dropoff_assigned: "/dropoff-assigned",
  dropoff_today: "/dropoff-today",
  dropoff_in_progress: "/dropoff-in-progress",
  items_pending_approval: "/items-pending-approval",
  pending_items_delivery_partial: "/pending-items-delivery-partial",
  pending_items_delivery_followup: "/pending-items-delivery-followup",
  payment_failed: "/payment-failed",
  dropoff_failed: "/dropoff-failed",
  dropoff_completed: "/dropoff-completed",
  order_cancelled: "/order-cancelled",
  laundry_bag_requested: "/laundry-bag",
  laundry_bag_delivered: "/laundry-bag",
};

const cardBgForStatus = (status: OrderStatus): string => {
  const cat = STATUS_TO_CATEGORY[status];
  switch (cat) {
    case "in_flight":
      return "bg-surface-in-flight";
    case "needs_attention_soft":
      return "bg-surface-attention-soft";
    case "needs_attention_urgent":
      return "bg-surface-attention-urgent";
    case "special":
      return "bg-surface-special";
    case "completed":
      return "bg-card";
  }
};


export const OrderCard = ({ order }: OrderCardProps) => {
  const { orderId, orderType, status, listTimestamp } = order;
  const isCompleted = STATUS_TO_CATEGORY[status] === "completed";
  const route = STATUS_TO_ROUTE[status];
  const cardBg = cardBgForStatus(status);
  const isApproval = status === "items_pending_approval";
  const isPaymentFailed = status === "payment_failed";
  const isDropOffFailed = status === "dropoff_failed";

  return (
    <Link
      to={route}
      state={{ order }}
      className={`flex items-center gap-2 rounded-lg border border-black/[0.06] ${cardBg} p-3 transition-transform duration-100 ease-out active:duration-75 active:scale-[0.99]`}
    >
      <OrderTypeIcon orderType={orderType} size={32} className="shrink-0" />

      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1 truncate text-sm tracking-tight">
          <span className="font-semibold text-primary">{ORDER_TYPE_LABEL[orderType]}</span>
          <span className="font-medium text-primary/70">{orderId}</span>
        </p>
        <p
          className={`mt-0.5 truncate text-xs ${
            isApproval
              ? "font-bold text-warning-dark"
              : isPaymentFailed || isDropOffFailed
                ? "font-bold text-destructive"
                : "text-muted-foreground"
          }`}
        >
          {isCompleted ? listTimestamp : STATUS_LABEL[status]}
        </p>
      </div>

      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={2.5} />
    </Link>
  );
};
