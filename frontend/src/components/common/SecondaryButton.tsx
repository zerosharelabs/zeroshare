import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Props = {} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function SecondaryButton({
  children,
  className,
  ...props
}: Props) {
  return (
    <button
      className={cn(
        "mx-auto gap-2 items-center justify-center flex py-3 px-5 ",
        "rounded-none font-medium text-white bg-neutral-850 border border-neutral-800 ",
        "shadow hover:bg-neutral-800 transition-colors hover:border-neutral-700 shrink-0 h-12",
        "focus:outline-none focus:ring-1 focus:ring-neutral-600",
        "active:bg-neutral-900 active:border-neutral-900 text-sm",
        "cursor-pointer shrink-0 whitespace-nowrap",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
