"use client";

import { ArrowUpIcon } from "lucide-react";
import SecondaryButton from "./common/SecondaryButton";
import { useWindowScroll } from "@/hooks/useWindowScroll";
import { cn } from "@/lib/utils";

export default function ScrollToTop() {
  const pos = useWindowScroll();

  const handleScrollToTop = () => {
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Error scrolling to top:", error);
    }
  };

  const show = pos > 800;

  return (
    <SecondaryButton
      onClick={handleScrollToTop}
      className={cn(
        "fixed bottom-0 right-0 m-10 h-10 w-10 p-0 transition-opacity duration-300",
        show ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      title="Scroll to top"
    >
      <span className="sr-only">Scroll to top</span>
      <ArrowUpIcon size={16} />
    </SecondaryButton>
  );
}
