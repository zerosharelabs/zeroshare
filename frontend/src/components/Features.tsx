import { cn } from "@/lib/utils";
import { isHosted, isSelfHosted } from "@/utils/selfhosted";
import {
  EyeOffIcon,
  FlameIcon,
  HeartIcon,
  LockIcon,
  ShieldCheckIcon,
} from "lucide-react";

export default function Features() {
  return (
    <div
      className={cn(
        " mx-auto relative pb-14 px-4",
        isSelfHosted ? "max-w-4xl" : "max-w-5xl"
      )}
    >
      <div
        className={
          "flex flex-wrap gap-x-8 gap-y-5 items-center justify-center my-4 mt-10 text-neutral-400"
        }
      >
        {isHosted && (
          <div className={"flex items-center justify-center gap-2"}>
            <img
              src="https://raw.githubusercontent.com/lipis/flag-icons/refs/heads/main/flags/4x3/de.svg"
              height={20}
              width={20}
              alt="German Flag"
              className="border-2 border-neutral-700"
            />
            Secured in Nuremberg, Germany
          </div>
        )}

        <div className={"flex items-center justify-center gap-2"}>
          <LockIcon size={16} className={"text-neutral-200"} />
          Client-Side AES-256 Encryption
        </div>
        <div className={"flex items-center justify-center gap-2"}>
          <ShieldCheckIcon size={17} className={"text-neutral-200"} />
          GDPR Compliant
        </div>

        <div className={"flex items-center justify-center gap-2"}>
          <FlameIcon size={17} className={"text-neutral-200"} />
          One-Time Self-Destructing Links
        </div>

        <div className={"flex items-center justify-center gap-2"}>
          <EyeOffIcon size={17} className={"text-neutral-200"} />
          Zero Logs & Zero Metadata
        </div>
        <div className={"flex items-center justify-center gap-2"}>
          <HeartIcon size={17} className={"text-neutral-200"} />
          Open Source{" "}
        </div>
      </div>
    </div>
  );
}

const SoonBadge = () => (
  <span
    className={
      "uppercase text-[10px] leading-0 bg-yellow-900 text-yellow-300 rounded-none px-2 py-2.5"
    }
  >
    Soon
  </span>
);
