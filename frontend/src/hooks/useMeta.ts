import { useEffect } from "react";

interface MetaProps {
  title: string;
  description?: string;
}

export function useMeta({ title, description }: MetaProps) {
  useEffect(() => {
    document.title = title;
    let meta = document.querySelector("meta[name='description']");
    if (!description) return;
    if (meta) {
      meta.setAttribute("content", description);
    } else {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      meta.setAttribute("content", description);
      document.head.appendChild(meta);
    }
  }, [title, description]);
}
