import { cn } from "@/lib/utils";

export default function Heading2({
  children,
  className,
  as,
}: {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}) {
  const Component = as || "h2";
  return (
    <Component
      className={cn(
        "text-center text-2xl font-semibold text-neutral-200 my-4 leading-[1.25] trackiing-wider",
        className
      )}
    >
      {children}
    </Component>
  );
}
