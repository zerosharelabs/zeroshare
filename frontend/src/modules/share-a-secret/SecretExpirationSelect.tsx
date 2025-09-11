import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { CalendarClockIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

type SecretExpirationSelectProps = {
  expiresIn: number;
  setExpiresIn: (expiresIn: number) => void;
};

export default function SecretExpirationSelect({
  expiresIn,
  setExpiresIn,
}: SecretExpirationSelectProps) {
  const user = useLoggedInUser();

  const pro = {
    disabled: !user,
    locked: !user,
  };

  return (
    <fieldset className="flex flex-col gap-2">
      <div>
        <label className="font-medium text-neutral-300 text-sm">
          Expiration Time
        </label>
        <p className="text-neutral-400 text-xs">
          Your secret will be destroyed automatically after a certain period of
          time if it has not been viewed.
        </p>
      </div>
      <Select
        value={expiresIn.toString()}
        onValueChange={(value) => setExpiresIn(parseInt(value))}
      >
        <SelectTrigger className="w-[240px]">
          <div className="flex gap-3 items-center">
            <CalendarClockIcon size={14} />
            <SelectValue placeholder="Select expiration" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="600" {...pro}>
            10 Minutes
          </SelectItem>
          <SelectItem value="3600" {...pro}>
            1 Hour
          </SelectItem>
          <SelectItem value="86400">24 Hours (Default)</SelectItem>
          <SelectItem value="604800" {...pro}>
            7 Days
          </SelectItem>
          <SelectItem value="2592000" {...pro}>
            30 Days
          </SelectItem>
        </SelectContent>
      </Select>
    </fieldset>
  );
}
