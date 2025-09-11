import Link from "next/link";

export default function InlineLinkColor({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="text-neutral-300 hover:underline inline hover:text-neutral-200 underline-offset-4"
    >
      {children}
    </Link>
  );
}
