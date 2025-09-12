import useSWR from "swr";
import { Suspense } from "react";
import { baseURL } from "@/lib/api";

interface VersionResponse {
  version: string;
}

const DEFAULT_VERSION = "v0.0.0";

export const revalidate = 300; // Revalidate every 5 minutes

// Main component
export default function CurrentVersion() {
  return (
    <Suspense fallback={<CurrentVersionFallback />}>
      <CurrentVersionContent />
    </Suspense>
  );
}

async function CurrentVersionContent() {
  const version = await fetchVersion();

  return (
    <span className="text-neutral-300 font-mono text-sm md:text-xs whitespace-nowrap">
      {version}
    </span>
  );
}

function CurrentVersionFallback() {
  return (
    <span className="text-neutral-300 font-mono text-sm md:text-xs whitespace-nowrap">
      {DEFAULT_VERSION}
    </span>
  );
}

async function fetchVersion(): Promise<string> {
  try {
    const response = await fetch(`${baseURL}/api/version`, {
      next: {
        revalidate: 300, // Revalidate every 5 minutes
        tags: ["version"],
      },
    });
    if (!response.ok) return DEFAULT_VERSION;
    const data: VersionResponse = await response.json();
    return data.version && data.version !== "unknown"
      ? data.version
      : DEFAULT_VERSION;
  } catch (e) {
    console.error(e);
    return DEFAULT_VERSION;
  }
}
