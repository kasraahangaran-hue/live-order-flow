import { Link } from "react-router-dom";
import { ArrowRight, FileText } from "lucide-react";
import { OrderCard } from "@/components/orders/OrderCard";
import type { OrderData, OrderStatus, OrderType } from "@/lib/order-types";

const PRODUCT_TYPES: OrderType[] = ["laundry", "shoe_bag", "finery"];

const IN_FLIGHT: OrderStatus[] = [
  "order_received",
  "pickup_assigned",
  "pickup_in_progress",
  "pickup_completed",
  "items_sorted",
  "dropoff_assigned",
  "dropoff_today",
  "dropoff_in_progress",
];
const ATTENTION: OrderStatus[] = [
  "items_pending_approval",
  "pending_items_delivery_partial",
  "pending_items_delivery_followup",
  "dropoff_failed",
  "payment_failed",
];
const COMPLETED: OrderStatus[] = ["dropoff_completed", "order_cancelled"];

const fakeId = (i: number) => `DMO${String(100 + i).padStart(3, "0")}`;

const synthOrder = (orderId: string, orderType: OrderType, status: OrderStatus): OrderData => {
  const isComplete = status === "dropoff_completed" || status === "order_cancelled";
  return {
    orderId,
    orderType,
    status,
    listTimestamp: isComplete ? "Completed on 22 Apr 2026, 12:41 PM" : "22 Apr 2026, 12:41 PM",
    pickupLocation: "Apt 1402, Marina Heights, Dubai Marina",
    pickupWindow: "Tomorrow · 8:00 – 10:00 AM",
    dropoffWindow: "Sun · 6:00 – 8:00 PM",
    pickupNote: "Picked up at door",
    dropoffNote: "Drop off at door",
    stageTimestamps: {
      received: "20 Apr, 9:12 pm",
      collected: "21 Apr, 8:42 am",
      items_in_process: "21 Apr, 1:05 pm",
      delivery_today: "22 Apr, 11:20 am",
      complete: "22 Apr, 12:41 pm",
    },
    itemsAwaitingApproval: status === "items_pending_approval" ? 2 : undefined,
    approvalDeadline: status === "items_pending_approval" ? "2h 5m left to action" : undefined,
    amountDue: status === "payment_failed" ? "AED 142.00 due" : undefined,
    leaveBagsOutside: status === "order_received",
    cancellable: status === "order_received",
  };
};

const STATE_LINKS = [
  { to: "/order-received", label: "Order received" },
  { to: "/pickup-assigned", label: "Pickup assigned" },
  { to: "/pickup-in-progress", label: "Pickup in progress" },
  { to: "/pickup-completed", label: "Pickup completed" },
  { to: "/items-sorted", label: "Items sorted" },
  { to: "/items-pending-approval", label: "Items pending approval" },
  { to: "/dropoff-assigned", label: "Dropoff assigned" },
  { to: "/dropoff-today", label: "Dropoff today" },
  { to: "/dropoff-in-progress", label: "Dropoff in progress" },
  { to: "/pending-items-delivery-partial", label: "Pending items delivery (partial)" },
  { to: "/pending-items-delivery-followup", label: "Pending items delivery (followup)" },
  { to: "/dropoff-failed", label: "Dropoff failed" },
  { to: "/payment-failed", label: "Payment failed" },
  { to: "/order-cancelled", label: "Order cancelled" },
  { to: "/dropoff-completed", label: "Dropoff completed" },
];

const Demo = () => {
  let counter = 0;
  const cardsFor = (statuses: OrderStatus[], types: OrderType[] = PRODUCT_TYPES) =>
    statuses.flatMap((s) =>
      types.map((t) => {
        counter += 1;
        const order = synthOrder(fakeId(counter), t, s);
        return <OrderCard key={`${s}-${t}-${counter}`} order={order} />;
      }),
    );

  return (
    <main className="min-h-screen bg-background font-sans antialiased">
      <div className="mx-auto max-w-md px-5 pb-16 pt-11">
        <h1 className="text-2xl font-extrabold text-primary">Order Card States</h1>
        <p className="mt-1 text-xs text-muted-foreground">Design QA — every variant</p>

        <SectionHeader>In Flight</SectionHeader>
        <div className="flex flex-col gap-3">{cardsFor(IN_FLIGHT)}</div>

        <SectionHeader>Needs Attention</SectionHeader>
        <div className="flex flex-col gap-3">{cardsFor(ATTENTION)}</div>

        <SectionHeader>Completed</SectionHeader>
        <div className="flex flex-col gap-3">{cardsFor(COMPLETED)}</div>

        <SectionHeader>Special</SectionHeader>
        <div className="flex flex-col gap-3">
          {cardsFor(["laundry_bag_requested", "laundry_bag_delivered"], ["laundry_bag"])}
        </div>

        <SectionHeader>Pick a screen to preview</SectionHeader>
        <div className="flex flex-col gap-2">
          {STATE_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-primary"
            >
              {l.label}
              <ArrowRight className="h-4 w-4 text-muted-foreground" strokeWidth={2.5} />
            </Link>
          ))}
          <Link
            to="/prd"
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-full border border-primary/20 bg-card px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary shadow-press"
          >
            <FileText className="h-3.5 w-3.5" />
            Read the PRD
          </Link>
        </div>
      </div>
    </main>
  );
};

const SectionHeader = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mb-3 mt-8 font-sans text-base font-bold text-primary">{children}</h2>
);

export default Demo;
