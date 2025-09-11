"use client";

import SecondaryButton from "@/components/common/SecondaryButton";
import Icon from "@/components/Icon";
import Layout from "@/components/Layout";
import Logo from "@/components/ui/Logo";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/modules/profile/UserAvatar";
import UserAvatarDropdown from "@/modules/profile/UserAvatarDropdown";
import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarItemProps = {
  icon: React.ElementType;
  children: React.ReactNode;
  active?: boolean;
  soon?: boolean;
  href?: string;
};

export const SidebarItem = ({
  icon: Icon,
  children,
  active,
  soon,
  href = "/not-found",
}: SidebarItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <li>
      <Link
        href={href}
        className={cn(
          "flex w-full gap-3 text-neutral-450 items-center border border-transparent h-10 px-3  tracking-wide text-sm whitespace-nowrap w-full",
          isActive
            ? "bg-neutral-900 text-neutral-100  border-neutral-800"
            : "hover:text-neutral-300",
          soon && "text-neutral-700 pointer-events-none"
        )}
      >
        <Icon />
        {children}
        {soon && (
          <span
            className={
              "uppercase text-[9px] leading-0 bg-neutral-900 text-neutral-400 rounded-none px-2 py-2.5 ml-auto"
            }
          >
            Soon
          </span>
        )}
      </Link>
    </li>
  );
};
