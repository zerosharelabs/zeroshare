"use client";

import { useRef, useState } from "react";
import { SecureShare } from "@/lib/encryption";
import LinkModal from "@/components/LinkModal";
import ErrorCard from "@/components/ErrorCard";
import { fetchApi } from "@/lib/api";
import { validatePassword, validateSecretData } from "@/lib/validation";

import { cn } from "@/lib/utils";

import SecretTextarea from "./SecretTextarea";
import SecretExpirationSelect from "./SecretExpirationSelect";
import SecretPasswordInput from "./SecretPasswordInput";
import SecretSubmitButton from "./SecretSubmitButton";
import SecretAdvancedOptionsSwitch from "./SecretAdvancedOptionsSwitch";

const REQUESTS_ENABLED = false;
const DEFAULT_EXPIRATION = 60 * 60 * 24;

type Props = {
  initialAdvancedOptions?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export default function ShareSecretForm({
  initialAdvancedOptions = false,
  className,
  children,
}: Props) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState("");
  const [expiresIn, setExpiresIn] = useState(DEFAULT_EXPIRATION);
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>();
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [advancedOptions, setAdvancedOptions] = useState(
    initialAdvancedOptions
  );
  const [activeTab, setActiveTab] = useState<"share" | "request">("share");

  const passwordRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const clearFields = () => {
    setData("");
    setPassword("");
    setExpiresIn(DEFAULT_EXPIRATION);
    setError(null);
    setShareUrl(undefined);
    setAdvancedOptions(false);
    setActiveTab("share");
  };

  const handleShare = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    // Validate input
    const dataValidation = validateSecretData(data);
    if (!dataValidation.valid) {
      setError(dataValidation.message!);
      setLoading(false);
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      setError(passwordValidation.message!);
      setLoading(false);
      return;
    }

    try {
      // Generate share link
      const { linkId, secretKey } = SecureShare.generateShareLink();

      // Encrypt data
      const encrypted = await SecureShare.encrypt({ data }, secretKey, linkId);
      const expiration = advancedOptions ? expiresIn : DEFAULT_EXPIRATION;

      // Store encrypted data using fetchApi (includes credentials)
      const response = await fetchApi("/secure", {
        method: "POST",
        body: JSON.stringify({
          linkId,
          encryptedData: encrypted.encrypted,
          iv: encrypted.iv,
          expiresIn: expiration,
          password:
            advancedOptions && password
              ? btoa(unescape(encodeURIComponent(password)))
              : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error occurred" }));
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      setShareUrl(`${window.location.origin}/secure#${linkId + secretKey}`);
      setOpen(true);
    } catch (err) {
      console.error(err);
      const errMessage =
        err instanceof Error ? err.message : "Failed to create share";
      setError(errMessage);
    } finally {
      setLoading(false);
      setData("");
    }
  };

  return (
    <>
      <LinkModal
        open={open}
        onOpenChangeAction={(open) => {
          setOpen(open);
          if (!open) {
            clearFields();
            setTimeout(() => {
              textareaRef.current?.focus();
            }, 0);
          }
        }}
        password={password}
        link={shareUrl}
      />
      <form
        className={cn(
          "max-w-3xl mx-auto flex items-center justify-center flex-wrap gap-4 mt-6 mb-4 bg-neutral-925/0 px-6 pt-6 pb-2 border-0 border-neutral-800",
          className
        )}
        onSubmit={handleShare}
      >
        <SecretTextarea
          data={data}
          loading={loading}
          setData={setData}
          textareaRef={textareaRef}
        />

        <div className="flex flex-wrap sm:flex-nowrap justify-between w-full mt-2 gap-6 sm:gap-0 flex-col-reverse sm:flex-row">
          <SecretAdvancedOptionsSwitch
            value={advancedOptions}
            onChange={setAdvancedOptions}
          />

          <SecretSubmitButton loading={loading} />
        </div>

        <div
          className={cn(
            "  w-full transition-all duration-300 flex flex-col gap-8",
            advancedOptions
              ? "mt-2 h-[20rem] sm:h-[16rem] opacity-100"
              : "opacity-0 h-0"
          )}
        >
          <SecretPasswordInput
            password={password}
            setPassword={setPassword}
            passwordVisibility={passwordVisibility}
            setPasswordVisibility={setPasswordVisibility}
            passwordRef={passwordRef}
          />
          <SecretExpirationSelect
            expiresIn={expiresIn}
            setExpiresIn={setExpiresIn}
          />
        </div>

        {children}

        <ErrorCard error={error} />
      </form>
    </>
  );
}
