import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Props = {} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function PrimaryButton({
  children,
  className,
  ...props
}: Props) {
  return (
    <button
      className={cn(
        "mx-auto gap-2 items-center justify-center flex py-3 px-5 transition-all",
        "rounded-none font-medium text-black bg-yellow-500 border border-yellow-500",
        " shadow hover:bg-yellow-600 transition-all hover:border-yellow-500 shrink-0 h-12",
        "focus:outline-none focus:ring-1 focus:ring-yellow-600",
        "active:bg-yellow-700 active:border-yellow-700",
        "disabled:bg-neutral-900 disabled:pointer-events-none disabled:select-none disabled:text-neutral-500 disabled:border-neutral-900 text-sm",
        "cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
