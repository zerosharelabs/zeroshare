"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { CopyIcon, GlobeLockIcon } from "lucide-react";
import PrimaryButton from "@/components/common/PrimaryButton";
import Input from "./common/Input";
import HeadingDescription from "./typography/HeadingDescription";
import Heading3 from "./typography/Heading3";
import { useMemo, useState } from "react";
import * as openpgp from "openpgp";
import TertiaryButton from "./buttons/TertiaryButton";
import { organization } from "@/lib/auth";
import Textarea from "./common/Textarea";
import { api } from "@/lib/api";
import Icon from "./Icon";
import ErrorCard from "./ErrorCard";

type Props = {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
};

export default function FeedbackModal({ open, onOpenChangeAction }: Props) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, setIsPending] = useState(false);
  const num1 = useMemo(() => Math.floor(Math.random() * 10), []);
  const num2 = useMemo(() => Math.floor(Math.random() * 10), []);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const correctAnswer = (num1 + num2).toString();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      if (captchaAnswer.trim() !== correctAnswer) {
        setError("Captcha answer is incorrect.");
        return;
      }

      setIsPending(true);
      // Fetch public key from backend
      const res = await api("/public-key");
      const publicKeyArmored = await res.text();
      const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });
      // Encrypt email and message
      const encEmail = await openpgp.encrypt({
        message: await openpgp.createMessage({ text: email }),
        encryptionKeys: publicKey,
      });
      const encMessage = await openpgp.encrypt({
        message: await openpgp.createMessage({ text: message }),
        encryptionKeys: publicKey,
      });
      // Send encrypted data as armored PGP
      await api("/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: encEmail,
          message: encMessage,
        }),
      });
      setIsPending(false);
      setEmail("");
      setMessage("");
      setCaptchaAnswer("");
      setError(null);
      onOpenChangeAction(false);
    } catch (error) {
      console.error("Error sending feedback:", error);
      setError(
        "Failed to send feedback. Please try again later or write directly to support@zeroshare.io"
      );
      setIsPending(false);
    }
  };

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
            <Dialog.Title className="text-left block">
              <Heading3 as={"span"}>Feedback</Heading3>
            </Dialog.Title>
            <Dialog.Description className="text-left mt-2">
              <HeadingDescription className="text-base" as={"span"}>
                Provide your feedback by entering your message below. If you
                want a response, you can optionally include your email address.
              </HeadingDescription>
            </Dialog.Description>

            <form onSubmit={handleSubmit}>
              <div className={"flex flex-wrap gap-5 mt-8"}>
                <fieldset className="flex flex-col gap-2 w-full">
                  <div>
                    <label className="font-medium text-neutral-300 text-sm">
                      Message
                      <span className="text-red-400 ml-1">*</span>
                    </label>
                  </div>
                  <Textarea
                    value={message}
                    onChange={(event) => setMessage(event.currentTarget.value)}
                    placeholder="Your message..."
                    className="w-full"
                  />
                </fieldset>
                <fieldset className="flex flex-col gap-2 w-full">
                  <div>
                    <label className="font-medium text-neutral-300 text-sm">
                      E-Mail Address (optional)
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
                <fieldset className="flex flex-col gap-2 w-full">
                  <div>
                    <label className="font-medium text-neutral-300 text-sm">
                      Captcha
                      <span className="text-red-400 ml-1">*</span>
                    </label>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center">
                      <Input
                        type="text"
                        value={num1}
                        readOnly
                        placeholder=""
                        className="w-12 text-center border-r-0"
                      />
                      <Input
                        type="text"
                        value={"+"}
                        readOnly
                        placeholder=""
                        className="w-12 border-l-0 border-r-0 text-center"
                      />
                      <Input
                        type="text"
                        value={num2}
                        readOnly
                        placeholder=""
                        className="w-12 border-l-0 border-r-0 text-center"
                      />
                      <Input
                        type="text"
                        value={"="}
                        readOnly
                        placeholder=""
                        className="w-12 border-l-0 text-center"
                      />
                    </div>

                    <Input
                      type="text"
                      value={captchaAnswer}
                      onChange={(event) =>
                        setCaptchaAnswer(event.currentTarget.value)
                      }
                      placeholder="Your answer"
                      className="w-full"
                    />
                  </div>
                </fieldset>
              </div>
              <ErrorCard error={error} className="mt-4" />
              <div className={"flex mt-6 w-full justify-between gap-4"}>
                <TertiaryButton
                  type="submit"
                  className={"w-full"}
                  disabled={!message}
                >
                  {isPending ? (
                    <Icon
                      name="progress_activity"
                      className="animate-spin"
                      size={28}
                    />
                  ) : (
                    "Send Feedback (Encrypted)"
                  )}
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
