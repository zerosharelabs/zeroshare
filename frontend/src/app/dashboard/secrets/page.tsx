import DashboardLayout from "@/layouts/DashboardLayout";

import SecretsTable from "@/modules/secrets/SecretsTable";
import SignInAndUp from "@/modules/auth/SignInAndUp";

export default function Page() {
  return (
    <DashboardLayout>
      <SecretsTable />
    </DashboardLayout>
  );
}
