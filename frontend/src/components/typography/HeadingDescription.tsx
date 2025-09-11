import { cn } from "@/lib/utils";

export default function HeadingDescription({
  children,
  className,
  as: Component = "p",
}: {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}) {
  return (
    <Component
      className={cn(
        "text-neutral-400 text-center text-lg my-4 font-normal max-w-3xl mx-auto",
        className
      )}
    >
      {children}
    </Component>
  );
}
