import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Props = {} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function DangerButton({ children, className, ...props }: Props) {
  return (
    <button
      className={cn(
        "mx-auto gap-2 items-center justify-center flex py-3 px-5 ",
        "rounded-none font-medium text-white bg-red-500 border border-red-500",
        "shadow hover:bg-red-400 transition-colors hover:border-red-400 shrink-0 h-12",
        "focus:outline-none focus:ring-1 focus:ring-red-600",
        "active:bg-red-600 active:border-red-600 text-sm",
        "cursor-pointer shrink-0 whitespace-nowrap leading-0",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
