"use client";

import DashboardLayout from "@/layouts/DashboardLayout";
import bgImage from "@/assets/pawel-czerwinski-yzbF63GQmhE-unsplash.jpg";
import Card, { CardSeparator } from "@/components/ui/Card";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import Input from "@/components/common/Input";
import { useState } from "react";
import SecondaryButton from "@/components/common/SecondaryButton";
import DangerButton from "@/components/common/DangerButton";
import { deleteUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Page() {
  const user = useLoggedInUser();
  const [name, setName] = useState(user?.name || "");
  const { push: navigate } = useRouter();

  const deleteAccount = async () => {
    const confirmed = confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (confirmed) {
      await deleteUser().then(() => {
        navigate("/");
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="py-8 px-10 max-w-4xl flex flex-col gap-8">
        <div className="h-44 w-full overflow-hidden relative border-0 border-neutral-800">
          <Image
            src={bgImage}
            alt="Login"
            className={
              "object-cover h-full w-full grayscale opacity-50 object-center"
            }
          />
          <div className="absolute bottom-0 left-0 mb-8 ml-10 text-left text-xs text-neutral-400 hover:text-neutral-300">
            <h1 className="text-2xl font-bold text-neutral-50 font-mono mb-1">
              {user?.name || "Anonymous"}
            </h1>
            <p className="text-base text-neutral-300">
              {user?.email || "No email provided"}
            </p>
          </div>
        </div>
        <Card>
          <label className="text-base font-normal">Display Name</label>
          <p className="text-sm text-neutral-400 my-1 font-light">
            Please enter your full name, or a display name you are comfortable
            with.
          </p>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="my-3"
            readOnly
            disabled
          />
          <CardSeparator />
          <div className="flex justify-between w-full">
            <p className="text-sm text-neutral-400 my-1 font-light">
              Updating your display name is currently not supported.
            </p>
            <div>
              <SecondaryButton
                onClick={() => {}}
                className="text-xs px-4 h-10 hidden"
              >
                Save Changes
              </SecondaryButton>
            </div>
          </div>
        </Card>
        <Card>
          <label className="text-base font-normal">E-Mail Address</label>
          <p className="text-sm text-neutral-400 my-1 font-light">
            Please enter your preferred email address. It is used to sign in and
            for account notifications.
          </p>
          <Input
            type="email"
            value={user?.email || ""}
            readOnly
            disabled
            className="my-3"
          />
          <CardSeparator />
          <div className="flex justify-between w-full">
            <p className="text-sm text-neutral-400 my-1 font-light">
              Updating your email address is currently not supported.
            </p>
            <div>
              <SecondaryButton
                onClick={() => {}}
                className="text-xs px-4 h-10 hidden"
              >
                Save Changes
              </SecondaryButton>
            </div>
          </div>
        </Card>

        <Card className="border-red-600 bg-red-950/10">
          <div className="flex justify-between items-center w-full gap-20">
            <div>
              <label className="text-base font-normal">Delete account</label>
              <p className="text-sm text-neutral-400 my-1 font-light">
                Deleting your account is a permanent action and cannot be
                undone. All associated data will be permanently removed. There
                are no recovery options available.
              </p>
            </div>
            <div>
              <DangerButton
                onClick={deleteAccount}
                className="text-xs px-4 h-10"
              >
                Delete Account
              </DangerButton>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
