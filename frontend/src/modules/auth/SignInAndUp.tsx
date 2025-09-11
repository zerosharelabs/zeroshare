"use client";

import TertiaryButton from "@/components/buttons/TertiaryButton";
import Input from "@/components/common/Input";
import PrimaryButton from "@/components/common/PrimaryButton";
import Layout from "@/components/Layout";
import Heading1 from "@/components/typography/Heading1";
import InlineLink from "@/components/typography/InlineLink";
import { useMeta } from "@/hooks/useMeta";

import loginImage from "@/assets/pawel-czerwinski-6lQDFGOB1iw-unsplash.jpg";
import Heading2 from "@/components/typography/Heading2";
import HeadingDescription from "@/components/typography/HeadingDescription";
import Logo from "@/components/ui/Logo";
import LogoMark from "@/components/ui/LogoMark";
import { MailIcon } from "lucide-react";
import InlineLinkColor from "@/components/typography/InlineLinkColor";
import { useEffect, useMemo, useState } from "react";
import { signUp, signIn, organization } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import ErrorCard from "@/components/ErrorCard";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { uuidv4 } from "better-auth";

type Props = {
  isSignUp: boolean;
  inviteId?: string;
};

const REDIRECT_URL = "/dashboard";

export default function SignInAndUp({ isSignUp, inviteId }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (error) {
      setError("");
    }
  }, [email, password]);

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await signIn.email(
      {
        email: email,
        password: password,
      },
      {
        onRequest: (ctx) => {},
        onSuccess: (ctx) => {
          if (inviteId) return joinOrganization();
          router.push(REDIRECT_URL);
        },
        onError: (ctx) => {
          setError(ctx.error.message);
        },
      }
    );
  };

  const createAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await signUp.email(
      {
        email: email,
        password: password,
        name: "Anonymous",
      },
      {
        onSuccess: (ctx) => {
          if (inviteId) return joinOrganization();
          return createOrganization();
        },
        onError: (ctx) => {
          setError(ctx.error.message);
        },
      }
    );
  };

  const createOrganization = async () => {
    // TODO, could be improved, not so random, but good enough for now
    const randomSlug = Math.random().toString(36).substring(2, 8);
    await organization.create(
      {
        name: companyName ?? "My Organization",
        slug: randomSlug,
      },
      {
        onRequest: (ctx) => {},
        onSuccess: (ctx) => {},
        onError: (ctx) => {
          setError(ctx.error.message);
        },
        onResponse: (ctx) => {
          router.push(REDIRECT_URL);
        },
      }
    );
  };

  const joinOrganization = async () => {
    if (!inviteId) return;
    await organization.acceptInvitation(
      {
        invitationId: inviteId,
      },
      {
        onSuccess: (ctx) => {
          router.push(REDIRECT_URL);
        },
        onError: (ctx) => {
          setError(ctx.error.message);
        },
      }
    );
  };

  const title = useMemo(() => {
    if (inviteId) return "Join your team on ZeroShare";
    if (isSignUp) return "Create your ZeroShare Account";
    return "Welcome Back!";
  }, [isSignUp, inviteId]);

  const description = useMemo(() => {
    if (inviteId) return "Someone invited you to join their organization.";
    if (isSignUp)
      return "Start sharing sensitive secrets and files with confidence";
    return "Login to your ZeroShare account below.";
  }, [isSignUp, inviteId]);

  return (
    <Layout>
      <main
        className={
          "grid grid-cols-1 md:grid-cols-2 p-2 h-screen overflow-hidden"
        }
      >
        <div className="h-full overflow-hidden relative hidden md:block">
          <LogoMark className="absolute top-0 left-0 z-10 m-10" width={32} />
          <Image
            src={loginImage}
            alt="Login"
            width={800}
            quality={30}
            className={"object-cover h-full w-full grayscale opacity-50"}
          />
          <a
            href="https://unsplash.com/@pawel_czerwinski"
            target="_blank"
            rel="noreferrer"
          >
            <span className="absolute bottom-0 left-0 mb-8 ml-10 text-center text-xs text-neutral-400 hover:text-neutral-300">
              Image by Pawel Czerwinski
            </span>
          </a>
        </div>
        <form
          className="flex flex-col justify-center relative p-4 md:p-10"
          onSubmit={isSignUp ? createAccount : login}
        >
          <Logo className="mb-2 mx-auto md:hidden" width={160} />
          <Heading2 as="h1" className="mb-2">
            {title}
          </Heading2>
          <HeadingDescription className="mt-0 font-light max-w-lg">
            {description}
          </HeadingDescription>
          <div className="flex flex-col gap-4 mt-6 max-w-md mx-auto w-full">
            <fieldset className="gap-2 flex flex-col">
              <label className="font-normal text-neutral-300 text-sm">
                E-Mail
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username email"
                required
                autoFocus
                placeholder="hello@company.com"
              />
            </fieldset>
            {isSignUp && (
              <fieldset className="gap-2 flex flex-col">
                <label className="font-normal text-neutral-300 text-sm">
                  Company
                </label>
                <Input
                  type="text"
                  id="company"
                  name="company"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  autoComplete="organization"
                  required
                  placeholder="Acme Inc."
                />
              </fieldset>
            )}

            <fieldset className="gap-2 flex flex-col">
              <label className="font-normal text-neutral-300 text-sm">
                Password
              </label>
              <Input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
                placeholder="Enter a secure password"
              />
            </fieldset>

            <ErrorCard
              error={error}
              className="text-sm py-3 px-4"
              iconSize={14}
            />

            <PrimaryButton className="w-full mt-3" type="submit">
              {isSignUp ? "Sign Up Free" : "Login"}
            </PrimaryButton>

            <p className="text-neutral-400 text-sm text-center mt-4">
              {isSignUp
                ? "Already have an account?"
                : "Don't have an account yet?"}{" "}
              <InlineLinkColor href={isSignUp ? "/login" : "/signup"}>
                {isSignUp ? "Log in instead" : "Create an account"}
              </InlineLinkColor>
            </p>
          </div>
          <p className="font-mono text-neutral-500 text-xs text-center absolute bottom-0 left-0 right-0 mb-8 hidden">
            By clicking continue, you agree to our{" "}
            <InlineLink href="#">Terms of Service</InlineLink> and{" "}
            <InlineLink href="#">Privacy Policy.</InlineLink>
          </p>
        </form>
      </main>
    </Layout>
  );
}
