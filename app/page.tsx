import type { Metadata } from "next";
import { Figtree, Manrope } from "next/font/google";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { MarketingHomeClient } from "@/components/marketing/MarketingHomeClient";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-figtree",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lofty Solution Suite",
  description:
    "Lofty is an all-in-one real estate solution that offers CRM, IDX, team management, lead generation and more bundled in a seamless, easy to use package.",
  openGraph: {
    title: "Lofty Solution Suite",
    description:
      "Lofty is an all-in-one real estate solution that offers CRM, IDX, team management, lead generation and more bundled in a seamless, easy to use package.",
    url: "https://lofty.com",
  },
  twitter: {
    card: "summary",
    title: "Lofty Solution Suite",
    description:
      "Lofty is an all-in-one real estate solution that offers CRM, IDX, team management, lead generation and more bundled in a seamless, easy to use package.",
  },
};

export default function Home() {
  return (
    <div className={`${manrope.variable} ${figtree.variable} min-h-screen font-[family-name:var(--font-manrope)] antialiased`}>
      <MarketingHeader />
      <main id="main-content">
        <MarketingHomeClient />
      </main>
      <MarketingFooter />
    </div>
  );
}
