export type OrderType = "laundry" | "shoe_bag" | "finery" | "laundry_bag";

export type OrderStatus =
  | "received"
  | "driver_assigned"
  | "collected"
  | "items_in_process"
  | "approval_required"
  | "out_for_drop_off"
  | "delivery_today"
  | "driver_on_the_way"
  | "drop_off_failed"
  | "partially_delivered"
  | "pending_item_delivery"
  | "complete"
  | "cancelled"
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
  received: "in_flight",
  driver_assigned: "in_flight",
  collected: "in_flight",
  items_in_process: "in_flight",
  out_for_drop_off: "in_flight",
  delivery_today: "in_flight",
  driver_on_the_way: "in_flight",
  approval_required: "needs_attention_soft",
  partially_delivered: "needs_attention_soft",
  pending_item_delivery: "needs_attention_soft",
  drop_off_failed: "needs_attention_urgent",
  payment_failed: "needs_attention_urgent",
  complete: "completed",
  cancelled: "completed",
  laundry_bag_requested: "special",
  laundry_bag_delivered: "completed",
};

export const STATUS_LABEL: Record<OrderStatus, string> = {
  received: "Order Received",
  collected: "Order Collected",
  driver_assigned: "Driver Assigned",
  items_in_process: "Items in Process",
  approval_required: "Approval Required",
  out_for_drop_off: "Out for Drop Off",
  delivery_today: "Delivery Today",
  driver_on_the_way: "Driver on the Way",
  drop_off_failed: "Drop Off Failed",
  partially_delivered: "Order Partially Delivered",
  pending_item_delivery: "Pending Item Delivery",
  complete: "Completed",
  cancelled: "Cancelled",
  payment_failed: "Payment Failed",
  laundry_bag_requested: "Laundry Bag Requested",
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
  received?: string;
  collected?: string;
  items_in_process?: string;
  approval_completed?: string;
  delivery_today?: string;
  driver_on_the_way?: string;
  partially_delivered?: string;
  complete?: string;
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
  /** Only present when status === "cancelled" */
  cancelledAt?: string;
}
