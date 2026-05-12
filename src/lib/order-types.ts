/**
 * Customer-app status keys aligned with backend status mapping.
 * Source: Notion "Order Status Mapping — Backend → Customer App".
 *
 * Notes:
 * - `pickup_assigned` and `order_received` collapse to the same customer-facing
 *   id (ORDER_RECEIVED) per backend, but we render them as distinct UX states.
 * - `pickup_in_progress` rarely surfaces; backend mapping has isRequired: false.
 * - `pending_items_delivery_partial` and `pending_items_delivery_followup` both
 *   collapse to PENDING_ITEMS_DELIVERY on the backend; we keep them split because
 *   they render as distinct UX states in multi-delivery flows.
 */
export type OrderType = "laundry" | "shoe_bag" | "finery" | "laundry_bag";

export type OrderStatus =
  | "order_received"
  | "pickup_assigned"
  | "pickup_in_progress"
  | "pickup_completed"
  | "items_sorted"
  | "items_pending_approval"
  | "dropoff_assigned"
  | "dropoff_today"
  | "dropoff_in_progress"
  | "dropoff_failed"
  | "pending_items_delivery_partial"
  | "pending_items_delivery_followup"
  | "dropoff_completed"
  | "order_cancelled"
  | "payment_failed"
  | "laundry_bag_requested"
  | "laundry_bag_delivered";

export type StatusCategory =
  | "in_flight"
  | "needs_attention_soft"
  | "needs_attention_urgent"
  | "completed"
  | "special";

export const STATUS_TO_CATEGORY: Record<OrderStatus, StatusCategory> = {
  order_received: "in_flight",
  pickup_assigned: "in_flight",
  pickup_in_progress: "in_flight",
  pickup_completed: "in_flight",
  items_sorted: "in_flight",
  items_pending_approval: "needs_attention_soft",
  dropoff_assigned: "in_flight",
  dropoff_today: "in_flight",
  dropoff_in_progress: "in_flight",
  dropoff_failed: "needs_attention_urgent",
  pending_items_delivery_partial: "in_flight",
  pending_items_delivery_followup: "in_flight",
  payment_failed: "needs_attention_urgent",
  dropoff_completed: "completed",
  order_cancelled: "completed",
  laundry_bag_requested: "special",
  laundry_bag_delivered: "completed",
};

export const STATUS_LABEL: Record<OrderStatus, string> = {
  order_received: "Order Received",
  pickup_assigned: "Driver Assigned",
  pickup_in_progress: "Driver on the Way",
  pickup_completed: "Order Picked-up",
  items_sorted: "Items in Process",
  items_pending_approval: "Approval Required",
  dropoff_assigned: "Out for Drop Off",
  dropoff_today: "Drop Off Today",
  dropoff_in_progress: "Driver on the Way",
  dropoff_failed: "Drop Off Failed",
  pending_items_delivery_partial: "Order Partially Dropped Off",
  pending_items_delivery_followup: "Pending Item Drop Off",
  dropoff_completed: "Completed",
  order_cancelled: "Cancelled",
  payment_failed: "Payment Failed",
  laundry_bag_requested: "Laundry Bag Requested",
  laundry_bag_delivered: "Laundry Bag Delivered",
};

export const ORDER_TYPE_LABEL: Record<OrderType, string> = {
  laundry: "Laundry Order",
  shoe_bag: "Shoe & Bag Order",
  finery: "The Finery Order",
  laundry_bag: "Laundry Bag Order",
};

export const STATUS_TO_BG_CLASS: Record<StatusCategory, string> = {
  in_flight: "bg-surface-in-flight",
  needs_attention_soft: "bg-surface-attention-soft",
  needs_attention_urgent: "bg-surface-attention-urgent",
  completed: "bg-surface-completed",
  special: "bg-surface-special",
};

export interface OrderStageTimestamps {
  order_received?: string;
  pickup_assigned?: string;
  pickup_in_progress?: string;
  pickup_completed?: string;
  items_sorted?: string;
  items_pending_approval?: string;
  dropoff_assigned?: string;
  dropoff_today?: string;
  dropoff_in_progress?: string;
  dropoff_completed?: string;
  pending_items_delivery_partial?: string;
  pending_items_delivery_followup?: string;
}

export interface OrderData {
  orderId: string;
  orderType: OrderType;
  status: OrderStatus;
  /** Timestamp shown on the Orders list card. */
  listTimestamp: string;
  /** Delivery / pickup info shown in DeliveryCard */
  pickupLocation: string;
  pickupWindow: string;
  dropoffWindow: string;
  pickupNote?: string;
  dropoffNote?: string;
  /** Per-stage timestamps; only filled in for stages that have occurred or are imminently scheduled */
  stageTimestamps: OrderStageTimestamps;
  /** State-specific data */
  itemsAwaitingApproval?: number;
  approvalDeadline?: string;
  itemsPending?: number;
  amountDue?: string;
  /** Door-pickup reminder flag */
  leaveBagsOutside?: boolean;
  /** Whether the order can still be cancelled */
  cancellable?: boolean;
  /** Only present when status === "order_cancelled" */
  cancelledAt?: string;
  /** Reason the order was cancelled (only present when status === "order_cancelled") */
  cancelReason?: "pickup_failed" | "expired" | "user_cancelled";
}
