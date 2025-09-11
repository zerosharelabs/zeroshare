"use client";

import DashboardLayout from "@/layouts/DashboardLayout";
import { useApi } from "@/lib/api";
import {
  format,
  formatDate,
  formatDistance,
  formatDistanceToNowStrict,
  formatRelative,
} from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/dropdown/Dropdown";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Icon from "@/components/Icon";
import Input from "@/components/common/Input";
import StatCard from "@/components/ui/StatCard";
import { useMemo, useState } from "react";
import Heading2 from "@/components/typography/Heading2";
import HeadingDescription from "@/components/typography/HeadingDescription";
import PrimaryButton from "@/components/common/PrimaryButton";
import Link from "next/link";
import { Member, MembersResponse } from "@/interface/Organization";
import SecondaryButton from "@/components/common/SecondaryButton";
import TertiaryButton from "@/components/buttons/TertiaryButton";
import InviteUserModal from "@/components/InviteUserModal";
import { UserAvatar } from "@/modules/profile/UserAvatar";
import LogoMark from "@/components/ui/LogoMark";
import { cn } from "@/lib/utils";

interface Secrets {
  id: string;
  linkId: string;
  passwordHash: string;
  createdAt: Date;
  expiresAt: Date;
  lastAccessedAt: Date;
  maxPasswordAttemps: number; //typo in backend
  passwordAttempts: number;
}

const columnHelper = createColumnHelper<Member>();

const columns = [
  columnHelper.accessor("userId", {
    header: () => "Name",
    cell: (s) => {
      const { email, name } = s.row.original.user;

      return (
        <div className="flex items-center justify-start gap-3">
          <UserAvatar name={email} />
          <div className="flex flex-col relative">
            <div className="text-neutral-200 text-sm font-medium">{name}</div>
            <div className="text-neutral-400 text-xs">{email}</div>
          </div>
        </div>
      );
    },
  }),
  columnHelper.accessor("id", {
    header: () => "Status",
    cell: (s) => {
      return (
        <div className="flex items-center justify-start gap-2">
          <span className={`h-2 w-2 rounded-full bg-green-400`}></span>
          <span className={`text-neutral-300 text-xs`}>Active</span>
        </div>
      );
    },
  }),
  columnHelper.accessor("role", {
    header: () => "Role",
    cell: (s) => {
      const role = s.getValue();
      return (
        <div
          className={cn(
            "inline-flex items-center justify-start gap-2 capitalize bg-neutral-900 border border-neutral-800 py-2 px-3"
          )}
        >
          {role === "owner" ? (
            <LogoMark width={10} />
          ) : (
            <Icon name="person" size={14} className="text-neutral-300" />
          )}
          {role}
        </div>
      );
    },
  }),
  columnHelper.accessor("id", {
    header: () => "Actions",
    cell: (info) => {
      return (
        <div className="flex items-center gap-2 justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="h-6 w-8 border border-neutral-800 bg-neutral-900 flex items-center justify-center hover:bg-neutral-800 hover:border-neutral-700">
                <Icon
                  name="more_horiz"
                  size={18}
                  className="text-neutral-200 hover:text-neutral-400 cursor-pointer"
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={12}
              side="bottom"
              alignOffset={0}
              className="w-[10rem]"
            >
              <DropdownMenuItem onClick={() => {}} variant="destructive">
                <Icon name="delete" size={14} />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  }),
];

export default function UsersTable() {
  const { isPending, isError, data, error } = useApi<MembersResponse>(
    "/auth/organization/list-members"
  );

  const myData = useMemo(() => {
    try {
      if (isError || error) return [];
      if (isPending) return [];
      if (!data || !Array.isArray(data.members)) return [];
      return data.members;
    } catch (error) {
      console.error("Error processing members data:", error);
      return [];
    }
  }, [data, isError, isPending, error]);

  const table = useReactTable({
    data: Array.isArray(myData) ? myData : [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const totalMembers = Array.isArray(myData) ? myData.length : 0;

  // user invite modal state
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  return (
    <div className="py-8 px-10">
      <InviteUserModal
        open={isInviteModalOpen}
        onOpenChangeAction={setIsInviteModalOpen}
      />
      <div className="mb-6 grid grid-cols-4 gap-8">
        <StatCard title="Total Users" value={totalMembers} />
      </div>

      <div className="flex items-center justify-between mb-6 w-full gap-10">
        {totalMembers > 0 && (
          <div>
            <TertiaryButton
              className="ml-auto"
              onClick={() => setIsInviteModalOpen(true)}
            >
              <Icon name="person_add" size={16} />
              Invite User
            </TertiaryButton>
          </div>
        )}
      </div>

      <table className="table-auto w-full m-0">
        <thead>
          {table?.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header, index) => (
                <th
                  key={index}
                  className="text-neutral-400 bg-neutral-900/50 font-mono text-xs font-light text-left border border-separate border-neutral-800 py-4 px-4"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table?.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-neutral-900/50">
              {row.getVisibleCells().map((cell, index) => (
                <td
                  key={index}
                  className="border border-neutral-850 py-4 px-4 text-neutral-300 text-xs"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {totalMembers === 0 && (
        <div className="border border-t-0 border-neutral-800 relative -top-4 py-10 px-4">
          <Heading2>Invite Your First User</Heading2>
          <HeadingDescription className="max-w-lg mb-6">
            Users allow you to securely share secrets and manage access more
            granularly within your organization.
          </HeadingDescription>

          <TertiaryButton onClick={() => setIsInviteModalOpen(true)}>
            <Icon name="person_add" size={16} />
            Invite User
          </TertiaryButton>
        </div>
      )}
    </div>
  );
}
