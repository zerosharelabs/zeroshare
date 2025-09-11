"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/dropdown/Dropdown";
import { UserAvatar } from "./UserAvatar";
import Icon from "@/components/Icon";
import { signOut } from "@/lib/auth";
import { redirect, useNavigate } from "react-router-dom";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { useRouter } from "next/navigation";

const UserAvatarDropdown = () => {
  let router = useRouter();
  const user = useLoggedInUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={12}
        side="bottom"
        alignOffset={0}
        className="w-[15rem]"
      >
        <div className="flex flex-col px-2 py-2">
          <label className="text-sm font-normal text-neutral-300">
            {user?.name ?? "Anonymous"}
          </label>
          <span className="text-xs text-neutral-400">{user?.email}</span>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
          <Icon name="account_circle" size={14} />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => signOut().then(() => router.push("/"))}
        >
          <Icon name="logout" size={14} />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAvatarDropdown;
