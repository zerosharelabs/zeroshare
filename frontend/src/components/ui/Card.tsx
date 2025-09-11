import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function Card({ children, className }: Props) {
  return (
    <div
      className={cn(
        "border border-neutral-800 text-neutral-300 px-8 py-6",
        className
      )}
    >
      {children}
    </div>
  );
}

export const CardSeparator = () => {
  return <div className="bg-neutral-800 -mx-8 my-6 h-px" />;
};
