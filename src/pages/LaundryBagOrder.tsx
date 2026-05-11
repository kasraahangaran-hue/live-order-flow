import { OrderShell } from "@/components/order/OrderShell";
import { LaundryBagIcon } from "@/components/order/LaundryBagIcon";
import { useOrderData } from "@/lib/useOrderData";
import stickerSheetImage from "@/assets/images/laundry-bag-sticker-sheet.jpg";
import driverImage from "@/assets/images/laundry-bag-driver.jpg";
import cleanClothesImage from "@/assets/images/laundry-bag-clean-clothes.jpg";

const STEPS = [
  {
    image: stickerSheetImage,
    alt: "Washmen Starter Kit sticker sheet",
    copy: "You will shortly receive the Starter Kit so you have it ready for future orders",
  },
  {
    image: driverImage,
    alt: "Washmen driver in front of delivery van",
    copy: "After you place your order, fill the bags and leave them at your door step for pick up",
  },
  {
    image: cleanClothesImage,
    alt: "Clean clothes returned in Washmen garment bag",
    copy: "Your clean items will be returned to your door once they're ready",
  },
];

const LaundryBagOrder = () => {
  const order = useOrderData();
  const isDelivered = order.status === "laundry_bag_delivered";

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
        hideTimeline: true,
        heroIcon: <LaundryBagIcon size={48} />,
      }}
    >
      <h2 className="font-sans text-base font-bold text-primary mt-4 mx-5 mb-3">
        What's Next?
      </h2>

      <div className="flex flex-col gap-4 mx-5">
        {STEPS.map((step, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-card overflow-hidden"
          >
            <img
              src={step.image}
              alt={step.alt}
              loading="lazy"
              className="aspect-[900/358] w-full object-cover"
            />
            <div className="p-4 flex gap-4 items-start">
              <div className="h-9 w-9 rounded-full bg-washmen-light-blue flex items-center justify-center shrink-0">
                <span className="text-primary font-bold text-base">{i + 1}</span>
              </div>
              <p className="text-primary text-base font-medium leading-snug">
                {step.copy}
              </p>
            </div>
          </div>
        ))}
      </div>
    </OrderShell>
  );
};

export default LaundryBagOrder;
