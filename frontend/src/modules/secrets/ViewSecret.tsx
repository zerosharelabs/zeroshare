"use client";

import { FormViewer } from "@/components/FormViewer";
import { Layout, Loader2 } from "lucide-react";
import { Suspense } from "react";

export default function ViewSecret() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[200px]">
          <Loader2 size={24} className="animate-spin text-white" />
        </div>
      }
    >
      <FormViewer />
    </Suspense>
  );
}
