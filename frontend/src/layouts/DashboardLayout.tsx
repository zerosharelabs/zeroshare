"use client";

import SecondaryButton from "@/components/common/SecondaryButton";
import CurrentVersion from "@/components/CurrentVersion";
import Icon from "@/components/Icon";
import Layout from "@/components/Layout";
import SessionLost from "@/components/SessionLost";
import { SidebarItem } from "@/components/SidebarItem";
import Logo from "@/components/ui/Logo";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/modules/profile/UserAvatar";
import UserAvatarDropdown from "@/modules/profile/UserAvatarDropdown";
import Link from "next/link";

const UsersIcon = () => <Icon name="group" />;
const ActivityIcon = () => <Icon name="overview" />;
const SettingsIcon = () => <Icon name="settings" />;
const EncryptedIcon = () => <Icon name="password" />;
const AddCommentIcon = () => <Icon name="add_comment" />;
const StyleIcon = () => <Icon name="format_shapes" />;
const HelpCenterIcon = () => <Icon name="chat" />;
const DocsIcon = () => <Icon name="docs" />;
const StickyNoteIcon = () => <Icon name="sticky_note_2" />;
const LightBulbIcon = () => <Icon name="lightbulb" />;
const APIIcon = () => <Icon name="sdk" />;

type Props = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  return (
    <Layout>
      <SessionLost />
      <style>
        {`html {
              background-color: oklch(0.165 0 0) !important;
            }`}
      </style>
      <main>
        <nav className="w-full justify-between flex items-center py-5 border-b border-neutral-850 px-6 h-18 sticky top-0 left-0 bg-neutral-940 z-50">
          <div className="flex items-center gap-4 leading-0">
            <Logo width={130} />
            <CurrentVersion />
          </div>

          <div className="flex gap-4 items-center">
            <Link href="mailto:feedback@zeroshare.io?subject=Feedback">
              <SecondaryButton className="text-xs px-4 h-10">
                <Icon name="feedback" size={14} />
                Feedback
              </SecondaryButton>
            </Link>

            <UserAvatarDropdown />
          </div>
        </nav>
        <aside className="w-64 border-r border-neutral-850 fixed left-0 top-0 h-full overflow-hidden z-40 bg-neutral-940">
          <div className="h-18" />
          <div className="flex flex-col justify-between h-full w-full">
            <ul className="flex flex-col gap-1 p-4">
              <SidebarItem icon={AddCommentIcon} href="/dashboard">
                Share Secret
              </SidebarItem>
              <SidebarItem icon={EncryptedIcon} href="/dashboard/secrets">
                Secrets
              </SidebarItem>
              <SidebarItem icon={UsersIcon} href="/dashboard/users">
                Users
              </SidebarItem>
            </ul>
            <ul className="flex flex-col gap-1 p-4 mb-18">
              <SidebarItem
                icon={LightBulbIcon}
                href="mailto:request@zeroshare.io?subject=Feature%20Request"
              >
                Request Feature
              </SidebarItem>

              <SidebarItem
                icon={HelpCenterIcon}
                href="mailto:support@zeroshare.io?subject=Support%20Request"
              >
                Support & Help
              </SidebarItem>
            </ul>
          </div>
        </aside>
        <section className="flex-1 pl-64">{children}</section>
      </main>
    </Layout>
  );
}
