"use client";

import {
  FlameIcon,
  KeyRoundIcon,
  LockIcon,
  ServerIcon,
  ShieldCheckIcon,
  SquareArrowDownIcon,
  SquareAsteriskIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { useState } from "react";
import HeadingTag from "./typography/HeadingTag";
import Heading2 from "./typography/Heading2";
import HeadingDescription from "./typography/HeadingDescription";
import TertiaryButton from "./buttons/TertiaryButton";

export default function HowItWorks() {
  const [showAll, setShowAll] = useState(false);

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  return (
    <div className={"bg-neutral-950 py-20 anchor px-4"} id="features">
      <div className={"max-w-3xl mx-auto relative"}>
        <HeadingTag className="text-indigo-300">How It Works</HeadingTag>

        <Heading2>Secure Data Sharing Made Simple</Heading2>
        <HeadingDescription>
          {`When you share sensitive information through our platform, you get a
          single secure link that contains everything needed to access the data.
          Here's how it works in simple terms:`}
        </HeadingDescription>

        <ol
          className={"max-w-3xl mx-auto my-14 flex flex-wrap gap-10 relative"}
        >
          <Item
            icon={<SquareAsteriskIcon size={18} />}
            title={"Create Unique Link & Secret Key"}
          >
            When you submit your sensitive information, your browser
            automatically generates a unique <strong>Link-ID</strong> that tells
            us which data to fetch and a <strong>Secret Key</strong> {"that's"}{" "}
            used for encryption. We never store the Secret on our servers, which
            makes it impossible for us to decrypt your data. All this is done
            client-side.
          </Item>
          <Item
            icon={<LockIcon size={18} />}
            title={"Encrypt Data Client-Side"}
          >
            Your browser uses the Secret to encrypt your data before it ever
            leaves your device. It uses the strong AES-GCM encryption algorithm
            and runs the key through a special strengthening process via PBKDF2
            & 100k rounds. The encrypted data is then sent to our servers.
          </Item>
          <Item
            icon={<ServerIcon size={18} />}
            title={"Server-Side Protection"}
          >
            Once we receive your encrypted data, our server adds another layer
            of encryption using our own secret key. This means that even if
            someone gained access to our database at rest, they {"couldn't"}{" "}
            read your data without having access to your link and our secret
            key.
          </Item>
          <Item
            icon={<KeyRoundIcon size={18} />}
            title={"Optional Password Protection"}
            show={showAll}
          >
            For extra security, you can add a password requirement. This means
            that even if someone has the link, {"they'll"} still need to enter
            the correct password to access the data. This password is securely
            hashed using Argon2, making it impossible to reverse even if our
            database was compromised.
          </Item>

          <Item
            icon={<FlameIcon size={18} />}
            title={"One-Time Self-Destructing Links"}
            show={showAll}
          >
            When you share sensitive information, you want to ensure it{" "}
            {"doesn't"}
            remain accessible forever. When someone opens the link, the data is
            immediately deleted from our servers, making it impossible to access
            again. If the link {"isn't"} opened within 24 Hours, it
            self-destructs automatically.
          </Item>
          <Item
            icon={<ShieldCheckIcon size={18} />}
            title={"GDPR Compliance"}
            show={showAll}
          >
            {`Our service is fully GDPR compliant, respecting user privacy and
            data rights: we don't store any personal information, we don't use
            cookies, and we don't track you. We only store your encrypted data
            for a short period of time before it's deleted. Our data center is
            located in Germany, Frankfurt. There are no Backups. If you want to
            read the full legal details, you can find them in our Privacy
            Policy.`}
          </Item>
        </ol>
        {!showAll && (
          <div
            className={
              "absolute bottom-0 left-0 w-full h-64  bg-gradient-to-b from-transparent to-neutral-950 flex items-center justify-end"
            }
          >
            <TertiaryButton onClick={toggleShowAll}>
              Expand & Learn More
              <SquareArrowDownIcon size={16} />
            </TertiaryButton>
          </div>
        )}
      </div>
    </div>
  );
}

type ItemProps = {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  show?: boolean;
};

const Item = ({ icon, title, children, show = true }: ItemProps) => {
  return (
    <li className={cn("flex justify-start gap-8", !show && "opacity-0 hidden")}>
      <div
        className={
          "h-10 w-10 shrink-0 bg-neutral-900 text-indigo-300 rounded-none border border-neutral-800 flex items-center justify-center top-1 relative"
        }
      >
        {icon}
      </div>
      <div>
        <h3
          className={cn(
            "text-xl text-neutral-100 font-medium flex items-center rounded-r-md"
          )}
        >
          {title}
        </h3>
        <p className={"text-neutral-400 text-base my-2 font-normal"}>
          {children}
        </p>
      </div>
    </li>
  );
};
