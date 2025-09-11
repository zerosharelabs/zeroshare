export default function Heading1({ children }: { children: React.ReactNode }) {
  return (
    <h1
      className={
        "text-center text-3xl font-semibold text-neutral-200 my-4 leading-[1.25]"
      }
    >
      {children}
    </h1>
  );
}
