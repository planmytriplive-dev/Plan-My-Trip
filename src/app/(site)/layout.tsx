import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomBar } from "@/components/layout/MobileBottomBar";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { WelcomeSpeech } from "@/components/layout/WelcomeSpeech";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <WelcomeSpeech />
      {/* bottom padding keeps content clear of the fixed mobile bar */}
      <div className="pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-0">
        {children}
        <Footer />
      </div>
      <MobileBottomBar />
      <WhatsAppFloat />
    </>
  );
}
