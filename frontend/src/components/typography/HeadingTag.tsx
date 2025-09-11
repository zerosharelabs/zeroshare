import { cn } from "@/lib/utils";

export default function HeadingTag({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "text-yellow-500 font-bold tracking-wider flex items-center justify-center font-mono uppercase",
        className
      )}
    >
      {children}
    </span>
  );
}
