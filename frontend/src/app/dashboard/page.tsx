import DashboardLayout from "@/layouts/DashboardLayout";
import ShareSecretForm from "@/modules/share-a-secret/ShareSecretForm";

export default function Page() {
  return (
    <DashboardLayout>
      <div className="py-8 px-10 flex flex-col gap-8">
        <div className="mx-auto w-full">
          <h1 className="text-2xl font-semibold text-neutral-50 mb-1">
            Create New Secret
          </h1>
          <p className="text-base text-neutral-300">
            Enter your secret message below.
          </p>
        </div>

        <ShareSecretForm initialAdvancedOptions={true} className="m-0 p-0" />
      </div>
    </DashboardLayout>
  );
}
