import { useQueryClient, useQuery } from "@tanstack/react-query";

export const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3030"
    : "https://zeroshare.io";

export const apiUrl = (url: string) => {
  return `${baseURL}/api${url}`;
};

export const API_OPTIONS: RequestInit = {
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
};

export const fetchApi = async (url: string, options?: RequestInit) => {
  return fetch(apiUrl(url), { ...API_OPTIONS, ...options });
};

export const api = fetchApi;

export function useApi<T = any>(url: string) {
  const { isPending, isError, data, error } = useQuery<T, Error>({
    queryKey: [url],
    queryFn: () => fetchApi(url).then((res) => res.json() as Promise<T>),
  });

  return { isPending, isError, data, error };
}
