import { cn } from "@/lib/utils";

export default function Heading3({
  children,
  className,
  as = "h3",
}: {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}) {
  const Component = as;

  return (
    <Component
      className={cn(
        "text-center text-xl font-semibold text-neutral-200 my-4 leading-[1.25]",
        className
      )}
    >
      {children}
    </Component>
  );
}
