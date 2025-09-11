import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  value: boolean;
  onChange: (b: boolean) => void;
  title?: string;
  description?: string;
};

export default function Switch({
  className,
  value,
  onChange,
  title,
  description,
}: Props) {
  return (
    <label
      className={cn(
        "relative inline-flex items-center cursor-pointer text-neutral-200",
        className
      )}
    >
      <input
        type="checkbox"
        className="sr-only"
        value={1}
        checked={value}
        onChange={(e) => {
          if (e.target.checked) {
            onChange(true);
          } else {
            onChange(false);
          }
        }}
      />
      <div
        className={cn(
          "w-14 h-8 bg-neutral-950 rounded-none border border-neutral-700 transition-all duration-200",
          value && "border-neutral-600"
        )}
      ></div>
      <span
        className={cn(
          "absolute left-0 w-6 h-6  rounded-none shadow transition-all duration-200 transform",
          {
            "translate-x-1 bg-neutral-800": !value,
            "translate-x-7 bg-neutral-300": value,
          }
        )}
      ></span>
      <div className="ml-6 flex flex-col items-start justify-center">
        <div className={cn("text-sm font-medium text-neutral-300 select-none")}>
          {title}
        </div>
        <div className="text-xs text-neutral-400 mt-0.5 select-none font-normal">
          {description}
        </div>
      </div>
    </label>
  );
}
