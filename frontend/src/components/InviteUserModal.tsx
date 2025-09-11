"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { CopyIcon, GlobeLockIcon } from "lucide-react";
import PrimaryButton from "@/components/common/PrimaryButton";
import Input from "./common/Input";
import HeadingDescription from "./typography/HeadingDescription";
import Heading3 from "./typography/Heading3";
import { useState } from "react";
import TertiaryButton from "./buttons/TertiaryButton";
import { organization } from "@/lib/auth";

type Props = {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
};

export default function InviteUserModal({ open, onOpenChangeAction }: Props) {
  const [email, setEmail] = useState("");
  const [role] = useState<"admin" | "member">("member");

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChangeAction}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            "fixed inset-0 flex justify-center items-start overflow-y-auto z-50 bg-black/80",
            "transition-opacity duration-300",
            "data-[state=open]:opacity-100 data-[state=closed]:opacity-0"
          )}
        >
          <Dialog.Content
            className={cn(
              "border border-neutral-800 shadow-2xl bg-neutral-950 h-auto min-h-0 mt-24 text-white",
              "px-6 pt-8",
              "max-w-md"
            )}
          >
            <Dialog.Title className="mx-auto text-center block">
              <Heading3 as={"span"}>Invite User</Heading3>
            </Dialog.Title>
            <Dialog.Description className="text-center mt-2">
              <HeadingDescription className="text-base" as={"span"}>
                Invite a new user to your organization by entering their email
                address below. They will receive an invitation email with a link
                to join.
              </HeadingDescription>
            </Dialog.Description>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await organization.inviteMember(
                  {
                    email,
                    role,
                  },
                  {
                    onSuccess: () => {
                      setEmail("");
                      onOpenChangeAction(false);
                    },
                    onError: (error) => {
                      console.error("Error inviting member:", error);
                    },
                  }
                );
              }}
            >
              <div className={"flex flex-wrap gap-5 mt-8"}>
                <fieldset className="flex flex-col gap-2 w-full">
                  <div>
                    <label className="font-medium text-neutral-300 text-sm">
                      E-Mail Address
                    </label>
                  </div>
                  <Input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.currentTarget.value)}
                    placeholder="hello@example.com"
                    className="w-full"
                  />
                </fieldset>
              </div>
              <div className={"flex mt-6 w-full justify-between gap-4"}>
                <TertiaryButton type="submit" className={"w-full"}>
                  Send Invite
                </TertiaryButton>
              </div>
            </form>

            <Dialog.Close />
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
