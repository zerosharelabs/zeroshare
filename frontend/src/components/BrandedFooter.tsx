import Logo from "@/components/ui/Logo";
import HeadingDescription from "./typography/HeadingDescription";

export default function BrandedFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-neutral-950 px-4">
      <div className="mx-auto max-w-3xl overflow-hidden py-16 px-6">
  
        <div className={"flex justify-between max-w-4xl mx-auto"}>
          <p className="mt-6 text-center text-neutral-400 text-sm font-mono">
            &copy; {year} ZeroShare. All Rights Reserved.
          </p>
          <div className="flex items-center justify-center gap-4">
  <p className="mt-6 text-center text-neutral-400 text-sm font-mono">
           Impressum
          </p>
            <p className="mt-6 text-center text-neutral-400 text-sm font-mono">
           Datenschutz
          </p>
          </div>
         
        </div>
      </div>
    </footer>
  );
}
