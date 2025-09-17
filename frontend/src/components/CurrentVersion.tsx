import { useApi, baseURL } from "@/lib/api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";

interface VersionResponse {
  version: string;
}

const DEFAULT_VERSION = "v0.0.0";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1,
    },
  },
});

// Server-side version fetching function
async function fetchVersionServer(): Promise<string> {
  try {
    const response = await fetch(`${baseURL}/api/version`, {
      next: {
        revalidate: 300, // Revalidate every 5 minutes
        tags: ["version"],
      },
    });
    if (!response.ok) return DEFAULT_VERSION;
    const data: VersionResponse = await response.json();
    return data.version && data.version !== "unknown" ? data.version : DEFAULT_VERSION;
  } catch (e) {
    console.error(e);
    return DEFAULT_VERSION;
  }
}

// Server component version
export function CurrentVersionServer() {
  return (
    <Suspense fallback={<CurrentVersionServerFallback />}>
      <CurrentVersionServerContent />
    </Suspense>
  );
}

async function CurrentVersionServerContent() {
  const version = await fetchVersionServer();

  return (
    <span className="text-neutral-300 font-mono text-sm md:text-xs whitespace-nowrap hidden md:inline">
      {version}
    </span>
  );
}

function CurrentVersionServerFallback() {
  return (
    <span className="text-neutral-300 font-mono text-sm md:text-xs whitespace-nowrap hidden md:inline">
      {DEFAULT_VERSION}
    </span>
  );
}

// Client component version
function CurrentVersionContent() {
  const { isPending, isError, data } = useApi<VersionResponse>('/version');
  
  const version = data?.version && data.version !== "unknown" 
    ? data.version 
    : DEFAULT_VERSION;

  return (
    <span className="text-neutral-300 font-mono text-sm md:text-xs whitespace-nowrap hidden md:inline">
      {isPending ? DEFAULT_VERSION : (isError ? DEFAULT_VERSION : version)}
    </span>
  );
}

export default function CurrentVersion() {
  return (
    <QueryClientProvider client={queryClient}>
      <CurrentVersionContent />
    </QueryClientProvider>
  );
}
