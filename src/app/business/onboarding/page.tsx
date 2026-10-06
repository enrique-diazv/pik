import type { Metadata, Viewport } from "next";
import { BusinessOnboarding } from "@/components/business/business-onboarding";

export const metadata: Metadata = {
  title: "Registra tu negocio | PIK",
};

export const viewport: Viewport = {
  themeColor: "#f2efef",
};

export default function BusinessOnboardingPage() {
  return <BusinessOnboarding />;
}