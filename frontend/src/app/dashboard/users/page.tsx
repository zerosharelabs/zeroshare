import DashboardLayout from "@/layouts/DashboardLayout";
import UsersTable from "@/modules/users/UsersTable";

export default function Page() {
  return (
    <DashboardLayout>
      <UsersTable />
    </DashboardLayout>
  );
}
