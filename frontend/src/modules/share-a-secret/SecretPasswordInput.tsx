import Input from "@/components/common/Input";
import SecondaryButton from "@/components/common/SecondaryButton";
import { SecureShare } from "@/lib/encryption";
import { RefreshCwIcon } from "lucide-react";

type SecretPasswordInputProps = {
  password: string;
  setPassword: (value: string) => void;
  passwordVisibility: boolean;
  setPasswordVisibility: (value: boolean) => void;
  passwordRef: React.RefObject<HTMLInputElement | null>;
};

export default function SecretPasswordInput({
  password,
  setPassword,
  passwordVisibility,
  setPasswordVisibility,
  passwordRef,
}: SecretPasswordInputProps) {
  return (
    <fieldset className="flex flex-col gap-2">
      <div>
        <label className="font-medium text-neutral-300 text-sm">
          Password Protection
        </label>
        <p className="text-neutral-400 text-xs">
          Require a password to access the one time secret link.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          type="password"
          value={password}
          ref={passwordRef}
          name="do-not-autofill"
          autoComplete={"none"}
          onChange={(event) => setPassword(event.currentTarget.value)}
          placeholder="Enter password (optional)"
          passwordVisibility={passwordVisibility}
          setPasswordVisibility={setPasswordVisibility}
        />
        <SecondaryButton
          type="button"
          onClick={() => {
            setPassword(SecureShare.generateRandomSecurePassword());
            setPasswordVisibility(true);
          }}
          className="w-full sm:w-56"
        >
          <RefreshCwIcon size={16} />
          Generate Password
        </SecondaryButton>
      </div>
    </fieldset>
  );
}
