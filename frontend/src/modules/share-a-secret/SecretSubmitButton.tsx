import PrimaryButton from "@/components/common/PrimaryButton";
import { ShieldIcon } from "lucide-react";
import { Loader2 } from "lucide-react";

type SecretSubmitButtonProps = {
  loading: boolean;
};

export default function SecretSubmitButton({
  loading,
}: SecretSubmitButtonProps) {
  return (
    <PrimaryButton type="submit" disabled={loading} className="w-full sm:w-56">
      {loading ? (
        <Loader2 size={18} className={"animate-spin"} />
      ) : (
        <ShieldIcon size={18} />
      )}
      Encrypt & Create Link
    </PrimaryButton>
  );
}
