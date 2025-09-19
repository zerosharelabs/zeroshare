"use client";

import { useEffect, useState } from "react";
import { SecureShare } from "@/lib/encryption";
import { EyeIcon, Loader2, UnlockIcon } from "lucide-react";
import Logo from "@/components/ui/Logo";
import PrimaryButton from "@/components/common/PrimaryButton";
import Textarea from "@/components/common/Textarea";
import Input from "@/components/common/Input";
import ErrorCard from "@/components/ErrorCard";
import Icon from "@/components/Icon";
import { apiUrl } from "@/lib/api";
import { isValidHashFragment } from "@/lib/validation";
import { useLocationHash } from "@/hooks/useLocationHash";

import Heading1 from "./typography/Heading1";
import HeadingDescription from "./typography/HeadingDescription";
import {cn} from "@/lib/utils";
import {formatFileSize} from "@/modules/share-a-secret/FileUploadArea";
import SecondaryButton from "@/components/common/SecondaryButton";

export function FormViewer() {
  const [password, setPassword] = useState("");
  const hash = useLocationHash();
  const [url, setUrl] = useState("");

  const [data, setData] = useState<string>("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [notFound, setNotFound] = useState(false);
  const [shareType, setShareType] = useState<"text" | "file" | null>(null);

  useEffect(() => {
    // Validate hash format
    if (hash && !isValidHashFragment(hash)) {
      setError("Invalid share link format");
      setNotFound(true);
      return;
    } else {
      setError(null);
      setNotFound(false);
    }

    setUrl(hash);
  }, [hash]);

  const [isProtected, setIsProtected] = useState();

  useEffect(() => {
    const linkId = url.substring(0, 16);
    const detectShareType = async () => {
      try {
        const response = await fetch(apiUrl(`/secure/${linkId}`));
        if (!response.ok) {
          const error = await response.json();
          setError(error.error || "Failed to load share");
          if (response.status === 404) {
            setNotFound(true);
          }
          return;
        }

        const { protected: isProtected, type } = await response.json();
        setIsProtected(isProtected);
        setShareType(type);
      } catch (err) {
        const errMessage =
          err instanceof Error ? err.message : "Failed to load share";
        setNotFound(true);
        setError(errMessage);
      }
    };

    if (url && linkId) {
      detectShareType();
    }
  }, [url]);

  const reveal = async () => {
    setLoading(true);
    setData("");
    setAttachment(null);

    try {
      const secretKey = url.substring(16);
      const linkId = url.substring(0, 16);

      const response = await fetch(apiUrl(`/secure/${linkId}`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: password
            ? btoa(unescape(encodeURIComponent(password)))
            : undefined,
        }),
      });
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error occurred" }));
        setError(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`
        );
        if (response.status === 404) {
          setNotFound(true);
        }
        return;
      }

      const { encryptedData, iv } = await response.json();
      const decrypted = await SecureShare.decrypt(
        encryptedData,
        iv,
        secretKey,
        linkId
      );

      setData(decrypted.text.data);
      setAttachment(decrypted.attachment);
      setError(null);
      setNotFound(false);
    } catch (err) {
      const errMessage =
        err instanceof Error ? err.message : "Failed to load share";
      setError(errMessage);
    } finally {
      setLoading(false);
    }
  };

  const downloadAttachment = () => {

        if (!attachment) return;
      const url = URL.createObjectURL(attachment);
      const link = document.createElement('a');
      link.href = url;
      link.download = attachment.name;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      setAttachment(null);

    };


  return (
    <div>
      <div className={"max-w-3xl mx-auto relative"}>
        <div className={"z-10 relative"}>
          <Heading1>Someone shared a secret with you!</Heading1>

          <HeadingDescription>
            This secret can only be accessed once and will self-destruct after
            being viewed. Save the information securely to a safe place before
            closing this page.
          </HeadingDescription>


            {shareType === "file" &&   <div className={"max-w-2xl bg-yellow-950 border border-yellow-900 mx-auto px-4 my-8"}>
                <HeadingDescription className={"text-sm text-yellow-400"}>
                    Important: This secret includes a file attachment.
                    Please ensure you trust the sender before viewing or downloading the file, as we cannot verify the safety of the attached file.
                </HeadingDescription>
            </div>}


          <div
            className={
              "max-w-2xl mx-auto flex items-center justify-center flex-wrap gap-4 mb-12"
            }
          >
            {!notFound && (
              <div className={"w-full relative space-y-4"}>
                {/* Text content */}
                <Textarea
                  cols={30}
                  disabled={!data}
                  rows={5}
                  value={data}
                  readOnly
                />

                  {/* Attachment download */}
                  {attachment && (
                      <div className="bg-neutral-925 border border-neutral-800 p-4 my-8">
                          <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                  <div className={cn("h-10 w-10 bg-neutral-925 border border-neutral-800 flex items-center justify-center")}>
                                    <Icon name="attach_file" size={20} className="text-neutral-400" />
                                  </div>
                                  <div>
                                      <p className="text-sm font-medium text-neutral-200">{attachment.name}</p>
                                      <p className="text-xs text-neutral-400">{formatFileSize(attachment.size)}</p>
                                  </div>
                              </div>


                              <div><SecondaryButton onClick={downloadAttachment}>
                                  <Icon name="download" size={16}  />
                                  Download
                              </SecondaryButton></div>



                          </div>
                      </div>
                  )}

                {!data && !notFound && (
                  <div
                    className={
                      "absolute w-full h-full z-10 top-0 left-0 flex items-center justify-center gap-4"
                    }
                  >
                    <div className="flex items-center justify-center gap-4">
                      {isProtected === undefined && (
                        <Loader2
                          size={24}
                          className={"animate-spin text-white"}
                        />
                      )}

                      {isProtected && (
                        <Input
                          autoFocus={true}
                          value={password}
                          onChange={(event) =>
                            setPassword(event.currentTarget.value)
                          }
                          placeholder={"Password (required)"}
                          className={"w-auto min-w-[350px] -top-1 relative"}
                          disabled={loading}
                        />
                      )}
                      {isProtected !== undefined && (
                        <PrimaryButton
                          onClick={reveal}
                          disabled={loading || (isProtected && !password)}
                          className={"-top-1 relative mx-0"}
                        >
                          {loading ? (
                            <Loader2 size={18} className={"animate-spin"} />
                          ) : isProtected ? (
                            <UnlockIcon size={18} />
                          ) : (
                            <EyeIcon size={18} />
                          )}
                          {isProtected ? "Reveal Secret" : "View Secret"}
                        </PrimaryButton>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <ErrorCard error={error} />
          </div>


          <Logo promo={true} width={180} />
        </div>
      </div>
    </div>
  );
}
