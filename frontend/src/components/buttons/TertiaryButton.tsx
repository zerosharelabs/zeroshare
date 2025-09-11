import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Props = {} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function TertiaryButton({
  children,
  className,
  ...props
}: Props) {
  return (
    <button
      className={cn(
        "mx-auto gap-2 items-center justify-center flex py-3 px-5 ",
        "rounded-none font-medium text-black bg-white border border-white ",
        "shadow hover:bg-neutral-300 transition-colors hover:border-neutral-50 shrink-0 h-12",
        "focus:outline-none focus:ring-1 focus:ring-neutral-600",
        "active:bg-neutral-900 active:border-neutral-900 text-sm",
        "cursor-pointer tracking-wide whitespace-nowrap",
        "disabled:cursor-not-allowed disabled:pointer-events-none disabled:bg-neutral-900",
        "disabled:border-neutral-800 disabled:text-neutral-600",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
