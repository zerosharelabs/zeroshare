import { cn } from "@/lib/utils";
import { CircleAlert } from "lucide-react";

type Props = {
  error?: string | null;
  className?: string;
  iconSize?: number;
};
export default function ErrorCard({ error, className, iconSize = 16 }: Props) {
  if (!error) return null;
  return (
    <div
      className={cn(
        "bg-red-950 text-red-300 w-full px-5 py-4 border border-red-900",
        className
      )}
    >
      <CircleAlert
        size={iconSize}
        className={"inline mr-2 relative -top-[1px]"}
      />
      {error}
    </div>
  );
}
