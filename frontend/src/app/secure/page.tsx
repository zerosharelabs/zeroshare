import ViewSecret from "@/modules/secrets/ViewSecret";
import Layout from "../layout";

export default function Page() {
  return (
    <Layout>
      <main className={"pt-20"}>
        <ViewSecret />
      </main>
    </Layout>
  );
}
