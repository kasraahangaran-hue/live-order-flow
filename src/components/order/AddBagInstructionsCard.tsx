import { Plus } from "lucide-react";

interface AddBagInstructionsCardProps {
  onClick?: () => void;
}

export const AddBagInstructionsCard = ({ onClick }: AddBagInstructionsCardProps) => {
  const handleClick = () => {
    if (onClick) return onClick();
    // No-op fallback when no onClick handler is provided (prototype state).
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="mx-5 mt-4 flex w-[calc(100%-2.5rem)] items-center justify-between rounded-xl border border-border bg-card px-4 py-3.5 text-left transition-transform duration-100 ease-out hover:bg-secondary/40 active:duration-75 active:scale-[0.99]"
    >
      <span className="text-sm font-medium text-primary">Add Bag Instructions (optional)</span>
      <Plus className="h-4 w-4 text-primary" strokeWidth={2.5} />
    </button>
  );
};
