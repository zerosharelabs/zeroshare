import Logo from "@/components/ui/Logo";
import HeadingDescription from "./typography/HeadingDescription";
import Link from "next/link";

import SecondaryButton from "./common/SecondaryButton";
import Icon from "./Icon";
import FeedbackButton from "./FeedbackButton";
import { isHosted } from "@/utils/selfhosted";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-neutral-950 px-4">
      <div className="mx-auto max-w-3xl overflow-hidden py-16">
        <Logo height={60} width={160} className={"mx-0"} />
        <HeadingDescription className="text-left px-0 mx-0 text-base max-w-none">
          {`Share secrets safely with ZeroShare. Our one-time links use AES-GCM
          encryption to protect your sensitive information, automatically
          destroying it after a single view or after 24 hours. Whatever comes
          first. No more worrying about confidential data sitting in inboxes or
          message threads - when it's gone, it's gone for good.`}
        </HeadingDescription>

        <div className={"flex justify-between max-w-4xl mx-auto items-end"}>
          <p className="mt-6 text-center text-neutral-400 text-sm font-mono">
            &copy; {year} ZeroShare. All Rights Reserved.
          </p>
          <FeedbackButton />
        </div>
      </div>
    </footer>
  );
}
