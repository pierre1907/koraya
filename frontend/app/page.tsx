"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth/token";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingHero from "@/components/landing/LandingHero";
import LandingLogos from "@/components/landing/LandingLogos";
import LandingProblem from "@/components/landing/LandingProblem";
import LandingBenefits from "@/components/landing/LandingBenefits";
import LandingServices from "@/components/landing/LandingServices";
import LandingTestimonials from "@/components/landing/LandingTestimonials";
import LandingAbout from "@/components/landing/LandingAbout";
import LandingFaq from "@/components/landing/LandingFaq";
import LandingCta from "@/components/landing/LandingCta";
import LandingFooter from "@/components/landing/LandingFooter";

export default function HomePage() {
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    if (getToken()) {
      router.replace("/dashboard");
    } else {
      setCheckingSession(false);
    }
  }, [router]);

  if (checkingSession) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingLogos />
        <LandingProblem />
        <LandingBenefits />
        <LandingServices />
        <LandingTestimonials />
        <LandingAbout />
        <LandingFaq />
        <LandingCta />
      </main>
      <LandingFooter />
    </div>
  );
}
