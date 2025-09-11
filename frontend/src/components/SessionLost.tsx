import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { useSession } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Icon from "./Icon";
import Loader from "@/assets/loading.gif";

export default function SessionLost() {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const isLoggedIn = !!user && !user.isAnonymous;
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn && !isPending) {
      router.push("/login");
    }
  }, [isLoggedIn, isPending, router]);

  return isLoggedIn && !isPending ? (
    <></>
  ) : (
    <div className="fixed h-screen w-screen text-neutral-300 left-0 top-0 bg-neutral-950 flex items-center justify-center z-[999]">
      <Icon name="progress_activity" className="animate-spin" size={28} />
    </div>
  );
}
