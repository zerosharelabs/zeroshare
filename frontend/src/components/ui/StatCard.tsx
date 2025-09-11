type Props = {
  title: string;
  value: number;
};

export default function StatCard({ title, value }: Props) {
  return (
    <div className="border border-neutral-800 text-neutral-300 p-8">
      <span className="font-mono text-xl">{value}</span>
      <p className="text-base text-neutral-400 mt-3 font-light">{title}</p>
    </div>
  );
}
