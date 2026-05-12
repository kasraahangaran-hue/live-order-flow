import { Pencil, MapPin, ArrowDownToLine, ArrowUpFromLine, Truck, Check } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface DropoffSection {
  label: string;
  when: string;
  done?: boolean;
}

interface Props {
  address: string;
  when: string;
  dropoffNote: string;
  /** Whether pickup is already completed. */
  pickupDone?: boolean;
  /** Optional second editable row (e.g. Drop off at door). */
  dropoff?: DropoffSection;
  /** Whether the section is open by default. */
  defaultOpen?: boolean;
}

const Row = ({
  icon,
  label,
  value,
  ariaLabel,
  editable = true,
  done = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  ariaLabel?: string;
  editable?: boolean;
  done?: boolean;
}) => (
  <div className="flex items-center gap-3 py-2.5">
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
      {done ? <Check className="h-4 w-4" strokeWidth={3} /> : icon}
    </span>
    <div className="min-w-0 flex-1">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="truncate text-sm font-semibold text-primary tabular">{value}</p>
    </div>
    {editable && !done && (
      <button
        aria-label={ariaLabel}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-transparent text-primary transition-[transform,background-color] duration-100 ease-out hover:bg-secondary/40 active:scale-90 active:duration-75"
      >
        <Pencil className="h-3.5 w-3.5" />
      </button>
    )}
  </div>
);

export const DeliveryCard = ({
  address,
  when,
  dropoffNote,
  dropoff,
  pickupDone = false,
  defaultOpen = false,
}: Props) => {
  return (
    <section
      className="mx-5 mt-4 rounded-lg border border-border bg-card animate-fade-in"
      style={{ animationDelay: "160ms" }}
      aria-label="Pickup and drop off details"
    >
      <Accordion type="single" collapsible defaultValue={defaultOpen ? "pickup-dropoff" : undefined} className="w-full">
        <AccordionItem value="pickup-dropoff" className="border-b-0 px-4">
          <AccordionTrigger className="py-3 hover:no-underline">
            <span className="font-sans text-sm font-bold text-primary">Pickup & Drop Off</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="divide-y divide-border/60 pb-1">
              <Row
                icon={<ArrowUpFromLine className="h-4 w-4" />}
                label={dropoffNote}
                value={when}
                ariaLabel="Edit pickup time"
                done={pickupDone}
              />
              {dropoff && (
                <Row
                  icon={<ArrowDownToLine className="h-4 w-4" />}
                  label={dropoff.label}
                  value={dropoff.when}
                  ariaLabel="Edit drop off time"
                  done={dropoff.done}
                />
              )}
              <Row
                icon={<MapPin className="h-4 w-4" />}
                label="Where"
                value={address}
                editable={false}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
};
