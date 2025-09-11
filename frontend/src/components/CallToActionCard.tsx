import { MessageSquareLockIcon, MessageSquareShareIcon } from "lucide-react";
import BlackButton from "./buttons/BlackButton";
import BlackOutlineButton from "./buttons/BlackOutlineButton";
import Heading2 from "./typography/Heading2";
import HeadingDescription from "./typography/HeadingDescription";
import Link from "next/link";

const SHOW_REQUESTS = false;

export default function CallToActionCard() {
  return (
    <div className={"rounded-none py-14 max-w-6xl mx-auto px-10 bg-yellow-500"}>
      <Heading2 className="text-black font-semibold text-3xl leading-tight max-w-3xl mx-auto">
        Stop Sharing Secrets or Password Insecurely via Email, Chat, or
        Messaging Apps
      </Heading2>

      <HeadingDescription className="text-neutral-800 font-medium text-xl">
        Create encrypted, self-destructing links that keep your sensitive data
        private and vanish after a single view or after 24 hours - whichever
        comes first.
      </HeadingDescription>

      <div className="flex gap-4 items-center justify-center w-full mt-10">
        <div>
          <Link href="/">
            <BlackButton>
              <MessageSquareLockIcon size={16} /> Share One Time Secret
            </BlackButton>
          </Link>
        </div>
        {SHOW_REQUESTS && (
          <div>
            <Link href="/">
              <RequestSecretButton />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

const RequestSecretButton = () => {
  return (
    <BlackOutlineButton>
      <MessageSquareShareIcon size={16} /> Request Secret
    </BlackOutlineButton>
  );
};
