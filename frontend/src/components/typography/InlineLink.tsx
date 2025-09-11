export default function InlineLink({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  return (
    <a
      href={href}
      className="text-neutral-500 underline inline hover:text-neutral-400 underline-offset-4"
    >
      {children}
    </a>
  );
}
