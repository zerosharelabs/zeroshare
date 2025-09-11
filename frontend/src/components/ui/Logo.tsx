import ZeroShareLogo from "@/assets/logo-white.svg";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

type Props = {
  promo?: boolean;
  height?: number;
  width?: number;
  className?: string;
};
export default function Logo({
  promo = false,
  height = 32,
  width = 120,
  className,
}: Props) {
  return (
    <>
      {promo && (
        <span
          className={
            "text-yellow-400 font-bold tracking-wider flex items-center justify-center mb-3 font-mono"
          }
        >
          SHARE SECURELY WITH{" "}
        </span>
      )}
      <Link href={"/"} className="shrink-0">
        <Image
          src={ZeroShareLogo}
          alt="Logo"
          width={width}
          height={height}
          priority
          className={cn(
            "mx-auto hover:opacity-80 transition-all shrink-0",
            className
          )}
        />
      </Link>
    </>
  );
}
