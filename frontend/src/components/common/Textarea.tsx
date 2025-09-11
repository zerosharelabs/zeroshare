import React from "react";
import { cn } from "@/lib/utils";
import type { TextareaHTMLAttributes, ForwardedRef } from "react";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement>;
const Textarea = (
  { className, ...props }: Props,
  ref: ForwardedRef<HTMLTextAreaElement>
) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "py-4 px-5 border border-neutral-800 rounded-none font-mono appearance-none bg-neutral-925 text-white w-full",
        "outline-none focus:ring-0 focus:border-neutral-400 focus:bg-neutral-925/80",
        "hover:bg-neutral-925/80",
        "focus:outline-none focus:ring-0 focus:ring-neutral-600 text-sm m-0",
        "placeholder:text-neutral-400 block",
        className
      )}
      {...props}
    />
  );
};

export default React.forwardRef(Textarea);
