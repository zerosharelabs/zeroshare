"use client";

import { signIn, useSession } from "@/lib/auth";
import { useEffect } from "react";

export default function AnonymousSignIn() {
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      (async () => {
        await signIn.anonymous();
      })();
    }
  }, [session, isPending]);

  return null;
}
