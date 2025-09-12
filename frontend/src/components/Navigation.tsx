"use client";

import {
  MessageSquarePlusIcon,
  SquarePlusIcon,
  SquareUserIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";
import Logo from "./ui/Logo";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth";
import { SquareArrowUpRight } from "lucide-react";
import Icon from "./Icon";
import CurrentVersion from "./CurrentVersion";

const SHOWLOGIN_AND_SIGNUP = true;

const NAVIGATION_LINKS: {
  href: string;
  label: string;
  target?: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
}[] = [
  { href: "/#features", label: "How It Works" },
  { href: "/#privacy-first", label: "Privacy-First" },
  {
    href: "https://github.com/zerosharelabs/zeroshare",
    label: "Open Source",
    target: "_blank",
    suffixIcon: <Icon name="arrow_outward" size={14} />,
  },
];

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <>
      {/* Nav always above dialog overlay */}
      <nav
        className={cn(
          "fixed top-0 z-50 flex items-center justify-center w-full px-4 transition-all pointer-events-auto"
        )}
      >
        <div className="mx-auto w-full md:w-auto px-4 py-2 bg-neutral-900 border border-neutral-800 h-12 mt-5">
          <div className="flex items-center justify-between h-full gap-5 p-1">
            <Logo height={20} />
            <CurrentVersion />
            <div className="items-center justify-between h-full gap-5 hidden md:flex">
              <Separator />

              {NAVIGATION_LINKS.map((link) => (
                <NavLink key={link.href} href={link.href} target={link?.target}>
                  {link.prefixIcon}
                  {link.label}
                  {link.suffixIcon}
                </NavLink>
              ))}

              <Separator />
              {SHOWLOGIN_AND_SIGNUP && <LoginAndSignUp />}
            </div>
            <MobileNavButton
              mobileOpen={mobileOpen}
              setMobileOpen={setMobileOpen}
            />
          </div>
        </div>
      </nav>
      <div className="h-4 md:h-12"></div>
      <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
        <Dialog.Portal>
          <Dialog.Overlay
            className={cn(
              "fixed inset-0 flex justify-center items-start overflow-y-auto z-40 bg-black/80 h-screen",
              "transition-all",
              "data-[state=open]:animate-fadeIn data-[state=closed]:animate-fadeOut"
            )}
          >
            <Dialog.Content
              onInteractOutside={(e) => e.preventDefault()}
              className={cn(
                "h-auto min-h-0 text-white",
                "w-full h-screen transition-all",
                "data-[state=open]:animate-fadeIn data-[state=closed]:animate-fadeOut",
                "focus:outline-0 p-4 pt-22"
              )}
            >
              <div className="border border-neutral-800 shadow-2xl bg-neutral-925 h-full">
                <div className="flex flex-col gap-5 py-6 items-center justify-center">
                  <CurrentVersion />
                  <HorizontalSeparator />
                  {NAVIGATION_LINKS.map((link) => (
                    <NavLink key={link.href} href={link.href}>
                      {link.label}
                    </NavLink>
                  ))}
                  <HorizontalSeparator />
                  {SHOWLOGIN_AND_SIGNUP && <LoginAndSignUp />}
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Overlay>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

type MobileNavButtonProps = {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
};

const MobileNavButton = ({
  mobileOpen,
  setMobileOpen,
}: MobileNavButtonProps) => {
  return (
    <button
      className="md:hidden cursor-pointer"
      onClick={() => setMobileOpen(!mobileOpen)}
    >
      {mobileOpen ? (
        <XIcon size={24} className="text-neutral-300 hover:text-white" />
      ) : (
        <MenuIcon size={24} className="text-neutral-300 hover:text-white" />
      )}
    </button>
  );
};

const LoginAndSignUp = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const isLoggedIn = !!user && !user.isAnonymous;

  if (isLoggedIn) return <DashboardLink />;

  return (
    <>
      <NavLink href="/login">
        <SquareUserIcon size={14} />
        Login
      </NavLink>
      <CTANavLink href="/signup">
        <SquarePlusIcon size={14} />
        Sign Up
      </CTANavLink>
    </>
  );
};

const DashboardLink = () => {
  return (
    <>
      <CTANavLinkPrimmary href="/dashboard">
        Dashboard
        <SquareArrowUpRight size={14} />
      </CTANavLinkPrimmary>
    </>
  );
};

const Separator = () => {
  return <span className="w-[1px] h-[80%] bg-neutral-700 shrink-0 mx-1"></span>;
};

const HorizontalSeparator = () => {
  return (
    <span className="w-[100%] h-[1px] bg-neutral-850 shrink-0 mx-auto my-1"></span>
  );
};

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
};

const NavLink = ({ href, children, className, target }: NavLinkProps) => {
  return (
    <a
      target={target}
      href={href}
      className={cn(
        "text-neutral-300 hover:text-white font-mono font-medium text-base md:text-xs flex items-center justify-center whitespace-nowrap gap-2",
        className
      )}
    >
      {children}
    </a>
  );
};

const CTANavLink = ({ href, children }: NavLinkProps) => {
  return (
    <NavLink href={href} className="text-indigo-300 hover:text-indigo-200">
      {children}
    </NavLink>
  );
};

const CTANavLinkPrimmary = ({ href, children }: NavLinkProps) => {
  return (
    <NavLink href={href} className="text-yellow-500 hover:text-yellow-200">
      {children}
    </NavLink>
  );
};
