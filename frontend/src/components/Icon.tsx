import { cn } from "@/lib/utils";

type IconProps = {
  name: string;
  size?: number;
  className?: string;
};

export default function Icon({ name, size = 18, className }: IconProps) {
  return (
    <span
      className={cn("material-symbols-sharp", className)}
      style={{ fontSize: size, width: size, height: size }}
    >
      {name}
    </span>
  );
}
