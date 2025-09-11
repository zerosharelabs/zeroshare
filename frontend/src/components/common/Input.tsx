import { cn } from "@/lib/utils";
import { EyeIcon } from "lucide-react";
import { EyeOffIcon } from "lucide-react";
import React from "react";
import type { InputHTMLAttributes, ForwardedRef } from "react";

type Props = {
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  passwordVisibility?: boolean;
  setPasswordVisibility?: (visible: boolean) => void;
} & InputHTMLAttributes<HTMLInputElement>;
const Input = (
  {
    className,
    icon,
    rightIcon,
    passwordVisibility,
    setPasswordVisibility,
    type,
    ...props
  }: Props,
  ref: ForwardedRef<HTMLInputElement>
) => {
  const isPassword = type === "password";
  const showToggle =
    isPassword &&
    typeof passwordVisibility === "boolean" &&
    typeof setPasswordVisibility === "function";
  const inputType = showToggle
    ? passwordVisibility
      ? "text"
      : "password"
    : type;

  return (
    <div className="relative w-full">
      {icon && (
        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-300 flex items-center justify-center">
          {icon}
        </span>
      )}
      <input
        ref={ref}
        type={inputType}
        className={cn(
          "font-mono border border-neutral-800 rounded-none text-sm bg-neutral-925 text-white w-full px-4 py-3 h-12",
          "focus:outline-none focus:ring-0 focus:border-neutral-400 focus:bg-neutral-925/80",
          "hover:bg-neutral-925/80 transition-all",
          "focus:outline-none focus:ring-1 focus:ring-neutral-600",
          "placeholder:text-neutral-500 inline-block text-sm font-light",
          props?.disabled && "cursor-not-allowed text-neutral-400",
          icon && "pl-10",
          (rightIcon || showToggle) && "pr-10",
          className
        )}
        {...props}
      />
      {(rightIcon || showToggle) && (
        <span
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-300 cursor-pointer"
          onClick={
            showToggle
              ? () => setPasswordVisibility?.(!passwordVisibility)
              : undefined
          }
        >
          {rightIcon
            ? rightIcon
            : showToggle &&
              (passwordVisibility ? (
                <EyeOffIcon size={20} />
              ) : (
                <EyeIcon size={20} />
              ))}
        </span>
      )}
    </div>
  );
};

export default React.forwardRef(Input);
