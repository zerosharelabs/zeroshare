import Heading1 from "./typography/Heading1";
import HeadingDescription from "./typography/HeadingDescription";
import ShareSecretForm from "@/modules/share-a-secret/ShareSecretForm";

export function Form() {
  return (
    <div>
      <div className={"max-w-3xl mx-auto relative mt-14"}>
        <div className={"z-10 relative"} id={"#create"}>
          <div className="px-4">
            <Heading1>
              Securely Share <span>Passwords</span>, <span>Secrets</span> or{" "}
              <span>Sensitive Information</span> With Self-Destructing Links
            </Heading1>
            <HeadingDescription>
              Send sensitive information with Client-Side AES-GCM Encryption,
              One-Time Self-Destructing Links, Zero Logs & Zero Activity
              Tracking.
            </HeadingDescription>
          </div>

          <ShareSecretForm />
        </div>
      </div>
    </div>
  );
}
