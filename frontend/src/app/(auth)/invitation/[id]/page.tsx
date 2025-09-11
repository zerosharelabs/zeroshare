import SignInAndUp from "@/modules/auth/SignInAndUp";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <SignInAndUp isSignUp={true} inviteId={id} />;
}
