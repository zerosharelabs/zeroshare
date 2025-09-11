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

type Props = {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  link?: string;
  password: string;
};

export default function LinkModal({
  open,
  onOpenChangeAction,
  link = "",
  password,
}: Props) {
  const [passwordVisibility, setPasswordVisibility] = useState(false);

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
              "max-w-lg"
            )}
          >
            <Dialog.Title className="mx-auto text-center block">
              <Heading3 as={"span"}>
                Your data is successfully <br />
                encrypted & ready to share!
              </Heading3>
            </Dialog.Title>
            <Dialog.Description className="text-center mt-2">
              <HeadingDescription className="text-base" as={"span"}>
                Share this link with the recipient to let them view the
                encrypted data. The data will self-destruct after being viewed.
              </HeadingDescription>
            </Dialog.Description>

            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className={"flex flex-wrap gap-5 mt-8"}>
                <fieldset className="flex flex-col gap-2 w-full">
                  <div>
                    <label className="font-medium text-neutral-300 text-sm">
                      Shareable Link
                    </label>
                  </div>
                  <div className="flex gap-4">
                    <Input
                      type="text"
                      value={link}
                      readOnly
                      icon={<GlobeLockIcon size={16} />}
                    />
                    <PrimaryButton
                      onClick={() => {
                        navigator.clipboard.writeText(link);
                      }}
                    >
                      <CopyIcon size={16} />
                      Copy
                    </PrimaryButton>
                  </div>
                </fieldset>

                {password != "" && (
                  <fieldset className="flex flex-col gap-2 w-full">
                    <div>
                      <label className="font-medium text-neutral-300 text-sm">
                        Password (Required)
                      </label>
                    </div>
                    <div className="flex gap-4">
                      <Input
                        autoComplete="none"
                        type="password"
                        value={password}
                        readOnly
                        passwordVisibility={passwordVisibility}
                        setPasswordVisibility={setPasswordVisibility}
                      />
                      <PrimaryButton
                        onClick={() => {
                          navigator.clipboard.writeText(password);
                        }}
                      >
                        <CopyIcon size={16} />
                        Copy
                      </PrimaryButton>
                    </div>
                  </fieldset>
                )}
              </div>
              <div className={"flex mt-6 w-full justify-between gap-4"}>
                <TertiaryButton
                  onClick={() => {
                    onOpenChangeAction(false);
                  }}
                  type="submit"
                  className={"w-full"}
                >
                  Close & Create Another Secret
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
