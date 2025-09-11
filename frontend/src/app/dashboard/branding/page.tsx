"use client";

import DangerButton from "@/components/common/DangerButton";
import Input from "@/components/common/Input";
import SecondaryButton from "@/components/common/SecondaryButton";
import Icon from "@/components/Icon";
import Card, { CardSeparator } from "@/components/ui/Card";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useState } from "react";

export default function Page() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  return (
    <DashboardLayout>
      <div className="py-8 px-10 flex flex-col gap-8 max-w-4xl">
        <div className="flex items-center">
          <SecondaryButton className="mx-0">
            Preview
            <Icon name="open_in_new" size={14} />
          </SecondaryButton>
        </div>

        <Card>
          <label className="text-base font-normal">Organization Name</label>
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
          <label className="text-base font-normal">Domain</label>
          <p className="text-sm text-neutral-400 my-1 font-light">
            Please enter your full name, or a display name you are comfortable
            with.
          </p>
          <div className="flex my-3">
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className=""
              readOnly
              disabled
            />
            <Input
              type="text"
              value={".zeroshare.io"}
              onChange={(e) => setName(e.target.value)}
              className="border-l-0"
              readOnly
              disabled
            />
          </div>

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
      </div>
    </DashboardLayout>
  );
}
