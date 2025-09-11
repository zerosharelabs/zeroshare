"use client";

import { cn } from "@/lib/utils";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";

type Props = {
  children: React.ReactNode;
  value: string;
};

export default function InputWithCopy({ children, value }: Props) {
  const [isCopySuccess, setIsCopySuccess] = useState(false);

  const copyToClipboard = () => {
    setIsCopySuccess(false);
    navigator.clipboard.writeText(value).then(() => {
      setIsCopySuccess(true);
      setTimeout(() => {
        setIsCopySuccess(false);
      }, 600);
    });
  };

  return (
    <div
      className={cn(
        "flex gap-3 overflow-hidden bg-neutral-925 py-3 px-4",
        "border border-neutral-800",
        "items-center",
        "hover:bg-neutral-925/80 group w-full"
      )}
      role={"button"}
      tabIndex={-1}
      onClick={copyToClipboard}
    >
      <div className={"flex flex-wrap min-w-0 w-full"}>
        <label
          className={"text-white font-medium flex gap-2 items-center w-full"}
        >
          {children}
        </label>
        <div className={"min-w-0 mr-2 flex gap-2 items-center"}>
          <p
            className={
              "truncate min-w-0 w-full shrink text-indigogo-50 group-hover:text-indigogo-100 transition-all"
            }
          >
            {value}
          </p>
        </div>
      </div>
      <button
        className={cn(
          "h-10 w-10 bg-indigogo-700 border border-indigogo-600 rounded-md mx-auto flex items-center justify-center shrink-0",
          "appearance-none",
          "hover:bg-indigogo-700/80",
          "active:bg-indigogo-800",
          "outline-none focus:outline-none focus:ring-1 focus:ring-indigogo-400"
        )}
        onClick={copyToClipboard}
      >
        {isCopySuccess ? (
          <CheckIcon size={15} className={"text-white"} />
        ) : (
          <CopyIcon size={15} className={"text-white"} />
        )}
      </button>
    </div>
  );
}
