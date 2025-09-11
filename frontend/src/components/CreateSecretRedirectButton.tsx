"use client";

import { cn } from "@/lib/utils";
import { ShieldIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function CreateSecretRedirectButton() {
  return (
    <Link to="#create">
      <button
        className={cn(
          "mx-auto gap-2 items-center justify-center mt-8 flex py-3 px-5 rounded-md font-medium text-white bg-indigo-500 border border-indigo-400 shadow hover:bg-indigo-600 transition-all hover:border-indigo-500 shrink-0 h-12",
        )}
        onClick={() => {}}
      >
        <ShieldIcon size={18} />
        Encrypt & Create Link
      </button>
    </Link>
  );
}
