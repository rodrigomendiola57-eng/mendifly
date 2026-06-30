"use client";

import { Aurora } from "@/components/ui/aurora";
import { ContactFormSection } from "@/components/sections/contact-form-section";
import { ContactPageHero } from "@/components/sections/contact-page-hero";

const CONTACT_AURORA = {
  colorStops: ["#0c09e8", "#7f08ed", "#5227ff"] as [string, string, string],
  speed: 1,
  blend: 0.26,
  amplitude: 1.0,
  yScale: 1.15,
};

export function ContactPageShell() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#050505]">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Aurora {...CONTACT_AURORA} className="aurora-page" />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-10%,rgba(127,8,237,0.18),transparent_55%),radial-gradient(ellipse_90%_60%_at_80%_30%,rgba(12,9,232,0.12),transparent_50%),radial-gradient(ellipse_80%_50%_at_20%_50%,rgba(82,39,255,0.1),transparent_45%)]"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[#050505]/20"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent"
      />

      <div className="relative z-10">
        <ContactPageHero />
        <ContactFormSection />
      </div>
    </div>
  );
}
