"use client";

import DashboardLayout from "@/layouts/DashboardLayout";
import { useApi } from "@/lib/api";
import {
  compareAsc,
  format,
  formatDate,
  formatDistance,
  formatDistanceToNowStrict,
  formatRelative,
} from "date-fns";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Icon from "@/components/Icon";
import Input from "@/components/common/Input";
import StatCard from "@/components/ui/StatCard";
import { useMemo } from "react";
import Heading2 from "@/components/typography/Heading2";
import HeadingDescription from "@/components/typography/HeadingDescription";
import PrimaryButton from "@/components/common/PrimaryButton";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/dropdown/Dropdown";
import SecretsTableActionCell from "@/modules/secrets/SecretsTableActionCell";
import TertiaryButton from "@/components/buttons/TertiaryButton";

export interface Secret {
  id: string;
  linkId: string;
  passwordHash: string;
  createdAt: Date;
  expiresAt: Date;
  lastAccessedAt: Date;
  maxPasswordAttempts: number; //typo in backend
  passwordAttempts: number;
}

const columnHelper = createColumnHelper<Secret>();

export const getStatus = (secret: Secret) => {
  const { lastAccessedAt, expiresAt } = secret;
  const isExpired = compareAsc(expiresAt, new Date()) === -1;
  const hasBeenViewed = lastAccessedAt !== null;
  const isLocked = secret.passwordAttempts >= secret.maxPasswordAttempts;

  if (isLocked) {
    return {
      bgColor: "bg-red-400",
      label: "Destroyed",
    };
  }

  if (isExpired) {
    return {
      bgColor: "bg-red-400",
      label: "Expired",
    };
  }

  if (hasBeenViewed) {
    return {
      bgColor: "bg-purple-400",
      label: "Viewed",
    };
  }

  return {
    bgColor: "bg-green-400",
    label: "Active",
  };
};

const columns = [
  columnHelper.accessor("id", {
    header: () => "ID",
    cell: (s) => {
      let name = s.getValue();
      const reverse = name.split(" ").reverse().join(" ").slice(-6);
      const chars = reverse.slice(0, 2);

      return (
        <div className="flex items-center justify-start gap-2">
          <div className="h-5 w-5 uppercase text-[0.55rem] flex items-center justify-center bg-neutral-850 border border-neutral-700 font-medium text-indigo-300">
            {chars}
          </div>
          <div className="text-neutral-300 text-xs uppercase">{reverse}</div>
        </div>
      );
    },
  }),
  columnHelper.accessor("linkId", {
    header: () => "Status",
    cell: (info) => {
      let status = info.getValue();
      const { bgColor, label } = getStatus(info.row.original);
      // Active (green), Viewed (purple), Expired (red), Locked (red)

      return (
        <div className="flex items-center justify-start gap-2">
          <span className={`h-2 w-2 rounded-full ${bgColor}`}></span>
          <span className={`text-neutral-300 text-xs`}>{label}</span>
        </div>
      );
    },
  }),
  columnHelper.accessor("lastAccessedAt", {
    header: () => "Viewed",
    cell: (info) => {
      const lastAccessedAt = info.getValue();
      const result = formatRelative(lastAccessedAt, new Date());
      const hasBeenViewed = lastAccessedAt !== null;

      if (!hasBeenViewed) {
        return <span className="text-neutral-400">-</span>;
      }

      return (
        <span className="text-neutral-300 capitalize flex items-center gap-2">
          <Icon name="visibility" size={12} className="relative" />
          {result}
        </span>
      );
    },
  }),

  columnHelper.accessor("expiresAt", {
    header: () => "Expires",
    cell: (info) => {
      const expiresAt = info.getValue();
      const result = formatDistanceToNowStrict(expiresAt, {
        addSuffix: true,
      });

      const isExpired = compareAsc(expiresAt, new Date()) === -1;

      if (isExpired) {
        return <span className="text-neutral-400">-</span>;
      }

      return (
        <span className="text-neutral-300 flex items-center gap-2">
          <Icon name="timer" size={12} className="relative" />
          {result}
        </span>
      );
    },
  }),
  columnHelper.accessor("passwordHash", {
    header: () => "Password Attempts",
    cell: (info) => {
      const hasPassword = info.getValue() !== null;
      if (!hasPassword) return <span className="text-neutral-400">-</span>;
      return (
        <span className="text-neutral-300">
          {info.row.original.passwordAttempts}/
          {info.row.original.maxPasswordAttempts}
        </span>
      );
    },
  }),
  columnHelper.accessor("createdAt", {
    header: () => "Created",
    cell: (info) => {
      const createdAt = info.getValue();
      // date and time August, 12, 12:00 PM
      const result = format(createdAt, "LLL d, yyyy 'at' hh:mm a");

      return (
        <span className="text-neutral-300 flex items-center gap-2">
          <Icon name="calendar_today" size={12} className="relative" />
          {result}
        </span>
      );
    },
  }),
  columnHelper.accessor("id", {
    header: () => "Actions",
    cell: (info) => {
      return <SecretsTableActionCell secret={info.row.original} />;
    },
  }),
];

export default function SecretsTable() {
  const { isPending, isError, data, error } = useApi<Secret[]>("/secrets");

  const myData = useMemo(() => {
    try {
      if (isError || error) return [];
      if (isPending) return [];
      if (!data || !Array.isArray(data)) return [];
      return data;
    } catch (error) {
      console.error("Error processing secrets data:", error);
      return [];
    }
  }, [data, isError, isPending, error]);

  const table = useReactTable({
    data: Array.isArray(myData) ? myData : [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const totalSecrets = Array.isArray(myData) ? myData.length : 0;

  const viewedSecrets = Array.isArray(myData)
    ? myData.filter((secret) => secret.lastAccessedAt).length
    : 0;

  const expiredSecrets = Array.isArray(myData)
    ? myData.filter((secret) => secret.expiresAt < new Date()).length
    : 0;

  return (
    <div className="py-8 px-10">
      <div className="mb-8 grid grid-cols-4 gap-8">
        <StatCard title="Total Secrets" value={totalSecrets} />
        <StatCard title="Viewed Secrets" value={viewedSecrets} />
        <StatCard title="Expired Secrets" value={expiredSecrets} />
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

      {totalSecrets === 0 && (
        <div className="border border-t-0 border-neutral-800 relative -top-4 py-10 px-4">
          <Heading2>No Secrets to Show</Heading2>
          <HeadingDescription className="max-w-lg mb-6">
            Looks like you don't have any secrets right now. Create and share
            your first secret, and it will appear here.
          </HeadingDescription>
          <Link href="/dashboard">
            <TertiaryButton>
              <Icon name="add_comment" size={16} />
              Share Secret
            </TertiaryButton>
          </Link>
        </div>
      )}
    </div>
  );
}
