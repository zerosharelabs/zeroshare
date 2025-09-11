import { Form } from "@/components/Form";
import Features from "@/components/Features";
import Stats from "@/components/Stats";
import HowItWorks from "@/components/HowItWorks";
import PrivacyByDefault from "@/components/PrivacyByDefault";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import CallToActionCard from "@/components/CallToActionCard";
import ScrollToTop from "@/components/ScrollToTop";
import Layout from "@/components/Layout";
import Logo from "@/components/ui/Logo";
import BrandedFooter from "@/components/BrandedFooter";
import Heading1 from "@/components/typography/Heading1";
import HeadingDescription from "@/components/typography/HeadingDescription";
import ShareSecretForm from "@/modules/share-a-secret/ShareSecretForm";


export default function BrandedPage() {
    return   <>
          <main className={"pt-16 bg-neutral-950"}>
        
            <Logo width={200} />
            <div>
                  <div className={"max-w-3xl mx-auto relative mt-10"}>
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
          
        
          </main>
         <BrandedFooter />
          <ScrollToTop />
        </>
}