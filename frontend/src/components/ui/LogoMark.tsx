// import Image from "next/image"; // Removed for Vite
import ZeroShareLogo from "@/assets/monogram-white.svg";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

type Props = {
  promo?: boolean;
  height?: number;
  width?: number;
  className?: string;
};
export default function LogoMark({
  promo = false,
  height = 32,
  width = 120,
  className,
}: Props) {
  return (
    <>
      <Link href={"/"} className="shrink-0">
        <Image
          src={ZeroShareLogo}
          alt="Logo"
          height={height}
          width={width}
          className={cn(
            "mx-auto hover:opacity-80 transition-all shrink-0",
            className
          )}
        />
      </Link>
    </>
  );
}
