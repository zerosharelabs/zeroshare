import useSWR from "swr";
import { Suspense } from "react";
import { api, baseURL, fetchApi } from "@/lib/api";
import { cn } from "@/lib/utils";

// Type definitions
interface Statistics {
  id: string;
  name: string;
  value: number;
}

type StatName =
  | "links_created"
  | "bytes_destroyed"
  | "links_created_with_password"
  | "links_viewed";

type Stats = {
  [K in StatName]: string;
};

function isStatName(name: string): name is StatName {
  return [
    "links_created",
    "bytes_destroyed",
    "links_created_with_password",
    "links_viewed",
  ].includes(name);
}

const DEFAULT_STATS: Stats = {
  links_created: "0",
  bytes_destroyed: "0 Bytes",
  links_created_with_password: "0",
  links_viewed: "0",
};

export const revalidate = 120;

// Main component
export default function Stats() {
  return (
    <Suspense fallback={<StatsFallback />}>
      <StatsContent />
    </Suspense>
  );
}

async function StatsContent() {
  const data = await fetchStats();

  return (
    <div className="bg-transparent py-10">
      <div className="max-w-5xl mx-auto relative text-white grid md:grid-cols-3 justify-center text-4xl font-bold">
        <Card title="One Time Secrets Shared" value={data.links_created} />
        <Card title="One Time Secrets Viewed" value={data.links_viewed} />
        <Card title="Data Shredded" value={data.bytes_destroyed} />
      </div>
      <LiveDot />
    </div>
  );
}

function StatsFallback() {
  return (
    <div className="bg-transparent py-10">
      <div className="max-w-5xl mx-auto relative text-white grid md:grid-cols-3 justify-center text-4xl font-bold animate-pulse">
        <Card title="One Time Secrets Shared" value="..." />
        <Card title="One Time Secrets Viewed" value="..." />
        <Card title="Data Shredded" value="..." />
      </div>
      <LiveDot />
    </div>
  );
}

async function fetchStats() {
  try {
    // Use Next.js fetch with revalidation instead of the custom api function
    const response = await fetch(`${baseURL}/api/statistics`, {
      next: {
        revalidate: 120, // Revalidate every 120 seconds
        tags: ["statistics"], // Optional: add cache tags for more control
      },
    });
    if (!response.ok) return DEFAULT_STATS;
    const res: Statistics[] = await response.json();
    const newObj: Stats = { ...DEFAULT_STATS };
    for (const stat of res) {
      if (isStatName(stat.name)) {
        newObj[stat.name] = stat.value.toString();
      }
    }
    return newObj;
  } catch (e) {
    console.error(e);
    return DEFAULT_STATS;
  }
}

const LiveDot = () => {
  return (
    <div className="flex items-center justify-center text-neutral-400 font-medium mt-4 gap-4">
      <span className="relative size-3 flex items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75"></span>
        <span className="relative inline-flex size-2.5 rounded-full bg-yellow-500"></span>
      </span>
      Live Sharing Statistics
    </div>
  );
};

const Card = ({ title, value }: { title: string; value: string }) => {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center bg-neutral-950 py-8 px-10 rounded-none border border-neutral-800",
        "md:first:border-r-0 md:last:border-l-0",
        "first:border-b-0 md:first:border-b last:border-t-0 md:last:border-t"
      )}
    >
      <div className="w-full text-center font-mono font-bold text-stroke text-4xl">
        {value}
      </div>
      <div className="text-base mt-3 text-neutral-400 font-medium font-mono text-center">
        {title}
      </div>
    </div>
  );
};
