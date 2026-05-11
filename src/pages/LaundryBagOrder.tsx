import { OrderShell } from "@/components/order/OrderShell";
import { LaundryBagIcon } from "@/components/order/LaundryBagIcon";
import { useOrderData } from "@/lib/useOrderData";
import type { Stage } from "@/components/order/StatusTimeline";

const STEPS = [
  "You will shortly receive the Starter Kit so you have it ready for future orders",
  "After you place your order, fill the bags and leave them at your door step for pick up",
  "Your clean items will be returned to your door once they're ready",
];

const LaundryBagOrder = () => {
  const order = useOrderData();
  const isDelivered = order.status === "laundry_bag_delivered";

  const stages: Stage[] = [
    { key: "requested", label: "Requested", timestamp: order.stageTimestamps.received },
    { key: "delivered", label: "Delivered", timestamp: isDelivered ? order.stageTimestamps.complete : undefined },
  ];

  return (
    <OrderShell
      hero={{
        status: isDelivered ? "Laundry Bag delivered" : "Laundry Bag requested",
        subtitle: isDelivered
          ? ""
          : "Starter Kit orders placed after 9:00 PM will be delivered the next day",
        orderType: order.orderType,
        orderId: order.orderId,
        showSupport: true,
        stages,
        currentIndex: isDelivered ? 1 : 0,
        completed: isDelivered,
        heroIcon: <LaundryBagIcon size={48} />,
      }}
    >
      <h2 className="font-sans text-base font-bold text-primary mt-4 mx-5 mb-3">
        What's Next?
      </h2>

      <div className="flex flex-col gap-4 mx-5">
        {STEPS.map((copy, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-card overflow-hidden"
          >
            {/* TODO: replace with marketing image */}
            <div className="aspect-[16/10] w-full bg-washmen-light-grey" />
            <div className="p-4 flex gap-4 items-start">
              <div className="h-9 w-9 rounded-full bg-washmen-light-blue flex items-center justify-center shrink-0">
                <span className="text-primary font-bold text-base">{i + 1}</span>
              </div>
              <p className="text-primary text-base font-medium leading-snug">
                {copy}
              </p>
            </div>
          </div>
        ))}
      </div>
    </OrderShell>
  );
};

export default LaundryBagOrder;
