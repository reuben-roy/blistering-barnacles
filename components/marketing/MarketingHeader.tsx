"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { LoftyLogo } from "./LoftyLogo";
import { LOFTY } from "./constants";

type PanelKey = "who" | "solutions" | "resources" | "partners" | "company" | null;

const whoItems = [
  {
    href: `${LOFTY}/solutions-agents`,
    title: "For Agents",
    desc: "Automate your marketing programs, capture and convert more leads into deals.",
    icon: `${LOFTY}/hubfs/home_nav_icon_1.png`,
  },
  {
    href: `${LOFTY}/solutions-teams`,
    title: "For Teams",
    desc: "Streamline your sales process, maximize collaboration, and increase sales volume.",
    icon: `${LOFTY}/hubfs/home_nav_icon_2.png`,
  },
  {
    href: `${LOFTY}/solutions-brokers`,
    title: "For Brokers",
    desc: "Boost agent productivity, lower operating costs, and accelerate profitable growth.",
    icon: `${LOFTY}/hubfs/home_nav_icon_3.png`,
  },
];

const solutionTabs = [
  {
    id: "lead" as const,
    label: "Lead Generation",
    desc: "Lofty offers more than 33 different ways to generate real estate leads.",
    icon: "https://cdn.chime.me/image/fs/sitebuild/20231016/4/original_1ef241fe-dbd3-46f1-97ae-a6ec1633658b.png",
    links: [
      { href: `${LOFTY}/feature/marketing`, title: "360° Marketing", desc: "Boost advertising performance with targeted cross-platform marketing campaigns." },
      { href: `${LOFTY}/feature/branding`, title: "Brand Advertising", desc: "Establish and grow your market presence with high-impact brand awareness campaigns." },
      { href: `${LOFTY}/feature/googleppc`, title: "Google PPC", desc: "Target a high-volume, high-intent audience with Google Search PPC." },
      { href: `${LOFTY}/feature/mail`, title: "Direct Mail", desc: "Maximize brand awareness and dominate your local market with targeted direct mailers." },
      { href: `${LOFTY}/feature/lsa`, title: "Google LSA", desc: "Capture local leads on a pay-per-lead basis (PPL) with Google’s local search ads." },
      { href: `${LOFTY}/bloom/package`, title: "Lofty Bloom", desc: "Fully automated, hyper-local lead generation with zip code exclusivity." },
    ],
  },
  {
    id: "platform" as const,
    label: "Platform",
    desc: "Our award-winning, AI-powered platform for real estate professionals.",
    icon: "https://cdn.chime.me/image/fs/sitebuild/20231016/4/original_893945dd-d6d8-4d36-9494-a350fbebc7ab.png",
    links: [
      { href: `${LOFTY}/real-estate/crm`, title: "Real Estate CRM", desc: "Powered by AI, our Smart CRM is designed to identify and develop sales opportunities." },
      { href: `${LOFTY}/feature/dialer`, title: "Power Dialer", desc: "Easily scale outbound communications to your leads, team members, and loyal customers." },
      { href: `${LOFTY}/feature/idx-site`, title: "Agent Websites", desc: "#1 Rated, SEO optimized, stunning IDX websites for real estate professionals." },
      { href: `${LOFTY}/lofty-idx-plugin`, title: "WordPress IDX Plugin", desc: "Lofty’s IDX Plugin provides a seamless integration between WordPress websites and our award-winning AI-powered platform." },
      { href: `${LOFTY}/feature/social-studio`, title: "Social Studio", desc: "Put social on autopilot with a fully automated social media marketing tool." },
      { href: `${LOFTY}/feature/transaction`, title: "Transaction Management", desc: "Streamline transactions from start to finish with paperless tools, and a full reporting suite." },
      { href: `${LOFTY}/feature/mobile`, title: "Mobile Apps", desc: "All the power of our award-winning platform in the palm of your hand." },
      { href: `${LOFTY}/feature/closely-app`, title: "Closely App", desc: "Deliver an elevated, mobile-optimized home search experience for your customers." },
      { href: `${LOFTY}/back-office-solution`, title: "Back Office", desc: "From first interview to closed transaction, we handle the operations so you can focus on growing your business." },
    ],
  },
  {
    id: "ai" as const,
    label: "Lofty AI",
    desc: "Put your business growth on auto-pilot with Lofty AI.",
    icon: "https://cdn.chime.me/image/fs/sitebuild/20231016/4/original_1ef241fe-dbd3-46f1-97ae-a6ec1633658b.png",
    links: [
      { href: `${LOFTY}/AOS`, title: "Overview", desc: "Flexible and scalable AI solutions that save time and boost productivity." },
      { href: `${LOFTY}/ai/assistant`, title: "AI Assistant", desc: "Streamline daily business operations and maximize productivity." },
      { href: `${LOFTY}/ai/sales-agent`, title: "Sales Agent", desc: "Your very own virtual ISA, working 24/7 to capture and convert more leads into appointments." },
      { href: `${LOFTY}/ai/social-agent`, title: "Social Agent", desc: "Your always-on digital marketing assistant, to amplify your brand across social media and boost lead generation." },
    ],
  },
];

const resourceItems = [
  { href: `${LOFTY}/blog`, title: "Blog", desc: "Stay informed with the latest on real estate technology, growth strategies, marketing, and more." },
  { href: `${LOFTY}/success-stories`, title: "Success Stories", desc: "Hear directly from top real estate teams and brokers who have found success with Lofty." },
  { href: `${LOFTY}/lofty-customer-awards`, title: "Lofty Legends", desc: "Each year we recognize customers who have best leveraged the Lofty Platform to grow their business!" },
  { href: `${LOFTY}/training`, title: "Lofty LIVE Training", desc: "Customers have access to over 50 LIVE training sessions a week." },
];

const partnerItems = [
  { href: `${LOFTY}/refer`, title: "Customer Referrals", desc: "Lofty customers can earn up to $1000 in instant rewards for every successful referral." },
  { href: `${LOFTY}/integrations`, title: "Integration Center", desc: "Join us in bringing value to a community of over 70,000 tech-savvy real estate professionals." },
];

const companyItems = [
  { href: `${LOFTY}/about`, title: "About", desc: "The Lofty origin story." },
  { href: `${LOFTY}/mission`, title: "Mission", desc: "The vision, mission, and values that guide us." },
  { href: `${LOFTY}/leadership`, title: "Leadership", desc: "Based in Phoenix, AZ our team is committed to driving customer success." },
  { href: `${LOFTY}/news`, title: "News", desc: "Stay up to date with Lofty company news." },
];

export function MarketingHeader() {
  const [open, setOpen] = useState<PanelKey>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [solutionTab, setSolutionTab] = useState<(typeof solutionTabs)[number]["id"]>("lead");
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(null);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function toggle(panel: Exclude<PanelKey, null>) {
    setOpen((v) => (v === panel ? null : panel));
  }

  return (
    <header ref={rootRef} className="sticky top-0 z-50 border-b border-white/10 bg-[#151826] text-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:text-[#151826]"
      >
        Skip to content
      </a>
      <div className="mx-auto flex max-w-[1320px] items-center gap-4 px-4 py-3 lg:px-6">
        <Link href="/" className="shrink-0" aria-label="Lofty home">
          <LoftyLogo />
        </Link>

        <nav className="ml-auto hidden flex-1 items-center justify-end gap-1 lg:flex">
          <div className="relative">
            <button
              type="button"
              className="flex items-center gap-1 rounded-md px-3 py-2 text-sm text-white/90 hover:bg-white/10"
              aria-expanded={open === "who"}
              onClick={(e) => {
                e.stopPropagation();
                toggle("who");
              }}
            >
              Who We Help
              <ChevronDown className={`h-4 w-4 transition ${open === "who" ? "rotate-180" : ""}`} />
            </button>
            {open === "who" ? (
              <div className="absolute right-0 top-full mt-2 w-[min(100vw-2rem,520px)] rounded-xl border border-white/10 bg-[#1b2030] p-4 shadow-2xl">
                <div className="grid gap-3 sm:grid-cols-3">
                  {whoItems.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="rounded-lg p-3 hover:bg-white/5"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <div className="flex items-center gap-2">
                        <img src={item.icon} alt="" className="h-8 w-8 object-contain" />
                        <span className="text-sm font-semibold">{item.title}</span>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-white/65">{item.desc}</p>
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="relative">
            <button
              type="button"
              className="flex items-center gap-1 rounded-md px-3 py-2 text-sm text-white/90 hover:bg-white/10"
              aria-expanded={open === "solutions"}
              onClick={(e) => {
                e.stopPropagation();
                toggle("solutions");
              }}
            >
              Solutions
              <ChevronDown className={`h-4 w-4 transition ${open === "solutions" ? "rotate-180" : ""}`} />
            </button>
            {open === "solutions" ? (
              <div className="absolute right-0 top-full mt-2 w-[min(100vw-2rem,900px)] rounded-xl border border-white/10 bg-[#1b2030] p-4 shadow-2xl">
                <div className="flex flex-col gap-4 lg:flex-row">
                  <div className="flex shrink-0 flex-col gap-2 lg:w-56">
                    {solutionTabs.map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setSolutionTab(tab.id)}
                        className={`rounded-lg p-3 text-left transition ${
                          solutionTab === tab.id ? "bg-white/10" : "hover:bg-white/5"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <img src={tab.icon} alt="" className="h-8 w-8 object-contain" />
                          <span className="text-sm font-semibold">{tab.label}</span>
                        </div>
                        <p className="mt-1 text-xs text-white/60">{tab.desc}</p>
                      </button>
                    ))}
                  </div>
                  <div className="max-h-[min(70vh,420px)] flex-1 overflow-y-auto rounded-lg bg-[#12151f] p-3">
                    <div className="grid gap-2 sm:grid-cols-2">
                      {solutionTabs
                        .find((t) => t.id === solutionTab)!
                        .links.map((l) => (
                          <a
                            key={l.href}
                            href={l.href}
                            className="rounded-lg border border-white/5 p-3 hover:border-white/15 hover:bg-white/5"
                            target="_blank"
                            rel="noreferrer"
                          >
                            <div className="text-sm font-semibold">{l.title}</div>
                            <p className="mt-1 text-xs leading-relaxed text-white/60">{l.desc}</p>
                          </a>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <NavSimpleList id="resources" label="Resources" items={resourceItems} open={open} onToggle={toggle} />
          <NavSimpleList id="partners" label="Partners" items={partnerItems} open={open} onToggle={toggle} />
          <NavSimpleList id="company" label="Company" items={companyItems} open={open} onToggle={toggle} />

          <div className="ml-2 flex items-center gap-2 border-l border-white/10 pl-4">
            <Link
              href="/app"
              className="rounded-full border border-white/25 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
            >
              Sign In
            </Link>
            <a
              href="#cta"
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#151826] hover:bg-white/90"
            >
              Request a Demo
            </a>
          </div>
        </nav>

        <button
          type="button"
          className="ml-auto inline-flex rounded-md p-2 text-white hover:bg-white/10 lg:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-white/10 bg-[#151826] px-4 py-4 lg:hidden">
          <div className="mx-auto flex max-w-[1320px] flex-col gap-3">
            <MobileAccordion title="Who We Help">
              {whoItems.map((item) => (
                <a key={item.href} href={item.href} className="block rounded-md py-2 text-sm hover:text-white/80" target="_blank" rel="noreferrer">
                  {item.title}
                </a>
              ))}
            </MobileAccordion>
            <MobileAccordion title="Solutions">
              {solutionTabs.flatMap((t) => t.links).slice(0, 8).map((l) => (
                <a key={l.href} href={l.href} className="block rounded-md py-2 text-sm hover:text-white/80" target="_blank" rel="noreferrer">
                  {l.title}
                </a>
              ))}
            </MobileAccordion>
            <MobileAccordion title="Resources">
              {resourceItems.map((l) => (
                <a key={l.href} href={l.href} className="block rounded-md py-2 text-sm" target="_blank" rel="noreferrer">
                  {l.title}
                </a>
              ))}
            </MobileAccordion>
            <div className="flex flex-col gap-2 pt-2">
              <Link href="/app" className="rounded-full border border-white/25 py-2 text-center text-sm font-medium">
                Sign In
              </Link>
              <a href="#cta" className="rounded-full bg-white py-2 text-center text-sm font-semibold text-[#151826]">
                Request a Demo
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function NavSimpleList({
  id,
  label,
  items,
  open,
  onToggle,
}: {
  id: Exclude<PanelKey, null>;
  label: string;
  items: { href: string; title: string; desc: string }[];
  open: PanelKey;
  onToggle: (k: Exclude<PanelKey, null>) => void;
}) {
  return (
    <div className="relative">
      <button
        type="button"
        className="flex items-center gap-1 rounded-md px-3 py-2 text-sm text-white/90 hover:bg-white/10"
        aria-expanded={open === id}
        onClick={(e) => {
          e.stopPropagation();
          onToggle(id);
        }}
      >
        {label}
        <ChevronDown className={`h-4 w-4 transition ${open === id ? "rotate-180" : ""}`} />
      </button>
      {open === id ? (
        <div className="absolute right-0 top-full z-10 mt-2 w-[min(100vw-2rem,380px)] rounded-xl border border-white/10 bg-[#1b2030] p-3 shadow-2xl">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="block rounded-lg p-3 hover:bg-white/5"
              target="_blank"
              rel="noreferrer"
            >
              <div className="text-sm font-semibold">{item.title}</div>
              <p className="mt-1 text-xs text-white/60">{item.desc}</p>
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function MobileAccordion({ title, children }: { title: string; children: ReactNode }) {
  const [x, setX] = useState(false);
  return (
    <div className="border-b border-white/10 pb-2">
      <button type="button" className="flex w-full items-center justify-between py-2 text-left text-sm font-semibold" onClick={() => setX(!x)}>
        {title}
        <ChevronDown className={`h-4 w-4 transition ${x ? "rotate-180" : ""}`} />
      </button>
      {x ? <div className="pl-1 text-white/75">{children}</div> : null}
    </div>
  );
}
