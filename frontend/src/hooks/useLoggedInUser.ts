import { useSession } from "@/lib/auth";

export function useLoggedInUser() {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const isLoggedIn = !!user && !user.isAnonymous;

  return isLoggedIn ? user : undefined;
}
