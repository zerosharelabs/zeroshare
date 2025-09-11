"use client";

import { useLoggedInUser } from "@/hooks/useLoggedInUser";

type Props = {
  name?: string;
};

export function UserAvatar({ name = "Z" }: Props) {
  const user = useLoggedInUser();
  return (
    <div className="h-8 w-8 bg-white text-neutral-800 rounded-full flex items-center justify-center text-sm font-medium leading-0 p-0 m-0 hover:bg-neutral-200">
      {user?.email?.charAt(0).toUpperCase() || name.charAt(0).toUpperCase()}
    </div>
  );
}
