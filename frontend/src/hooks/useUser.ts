import { useSession } from "@/lib/auth";

export function useUser() {
  const { data: session } = useSession();
  const user = session?.user;
  const isLoggedIn = !!user && !user.isAnonymous;

  return {
    user,
    isLoggedIn,
  };
}
