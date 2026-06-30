import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { ScrollRestoration } from "@/components/ui/scroll-restoration";

interface SiteShellProps {
  children: React.ReactNode;
}

export function SiteShell({ children }: SiteShellProps) {
  return (
    <>
      <ScrollRestoration />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
