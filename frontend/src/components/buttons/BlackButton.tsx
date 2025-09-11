import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Props = {} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function BlackButton({ children, className, ...props }: Props) {
  return (
    <button
      className={cn(
        "mx-auto gap-2 items-center justify-center flex py-3 px-5 ",
        "rounded-none font-medium text-white bg-black border border-black ",
        "shadow hover:bg-neutral-850 transition-colors hover:border-neutral-950 shrink-0 h-12",
        "focus:outline-none focus:ring-1 focus:ring-neutral-600",
        "active:bg-neutral-900 active:border-neutral-900 text-sm",
        "cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
