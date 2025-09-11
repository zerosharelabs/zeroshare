import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/dropdown/Dropdown";
import Icon from "@/components/Icon";
import { api } from "@/lib/api";
import { Secret } from "@/modules/secrets/SecretsTable";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  secret: Secret;
};

export default function SecretsTableActionCell({ secret }: Props) {
  const { id } = secret;
  const qc = useQueryClient();

  const refetch = () => {
    qc.invalidateQueries({ queryKey: ["/secrets"] });
  };

  const handleRevoke = async () => {
    // confirm with user
    if (
      !confirm(
        "Are you sure you want to revoke this secret? This action cannot be undone."
      )
    ) {
      return;
    }

    const res = await api(`/secrets/${id}`, {
      method: "POST",
    });

    if (!res.ok) {
      // Handle error TODO
      return;
    }

    refetch();
  };

  const handleDelete = async () => {
    // confirm with user
    if (
      !confirm(
        "Are you sure you want to delete this secret? This action cannot be undone."
      )
    ) {
      return;
    }

    const res = await api(`/secrets/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      // Handle error TODO
      return;
    }

    refetch();
  };

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
          <DropdownMenuItem onClick={handleRevoke} variant="default">
            <Icon name="delete_history" size={14} />
            Revoke
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete} variant="destructive">
            <Icon name="delete" size={14} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
