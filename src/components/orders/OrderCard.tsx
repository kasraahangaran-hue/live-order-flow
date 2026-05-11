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
  received: "/order-received",
  driver_assigned: "/driver-assigned",
  collected: "/order-collected",
  items_in_process: "/processing",
  out_for_drop_off: "/out-for-drop-off",
  delivery_today: "/out-for-delivery",
  driver_on_the_way: "/driver-on-the-way",
  approval_required: "/approval-required",
  partially_delivered: "/partial-delivery",
  pending_item_delivery: "/pending-item-delivery",
  payment_failed: "/payment-failed",
  drop_off_failed: "/drop-off-failed",
  complete: "/order-complete",
  cancelled: "/cancelled",
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
  const isApproval = status === "approval_required";
  const isPaymentFailed = status === "payment_failed";
  const isDropOffFailed = status === "drop_off_failed";

  return (
    <Link
      to={route}
      state={{ order }}
      className={`flex items-center gap-3 rounded-xl border border-black/[0.06] ${cardBg} px-3.5 py-3.5 transition-transform duration-100 ease-out active:duration-75 active:scale-[0.99]`}
    >
      <OrderTypeIcon orderType={orderType} size={40} className="shrink-0" />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm tracking-tight">
          <span className="font-semibold text-primary">{ORDER_TYPE_LABEL[orderType]}</span>{" "}
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
