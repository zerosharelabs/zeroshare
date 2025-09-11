"use client";

import { useState } from "react";
import SecondaryButton from "./common/SecondaryButton";
import FeedbackModal from "./FeedbackModal";
import Icon from "./Icon";

export default function FeedbackButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <FeedbackModal open={open} onOpenChangeAction={setOpen} />
      <SecondaryButton
        className="text-xs px-4 h-10 mx-0 my-0"
        onClick={() => setOpen(true)}
      >
        <Icon name="feedback" size={14} />
        Feedback
      </SecondaryButton>
    </>
  );
}
