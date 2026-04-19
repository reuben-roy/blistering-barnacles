"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { LOFTY } from "./constants";

const heroSlides = [
  {
    title: "Put your Business Growth on Auto-Pilot with Agentic AI",
    titleAs: "h1" as const,
    des: "Get more appointments and more listings with less effort. It's that simple.",
    right: `${LOFTY}/hubfs/banner-slide2-right.png`,
    bg: `${LOFTY}/hubfs/banner-slide2-bg.png`,
  },
  {
    title: "Close More Deals Faster",
    titleAs: "p" as const,
    des: "With Lofty, the award-winning, AI-powered platform for real estate professionals.",
    right: `${LOFTY}/hubfs/banner-slide1-right.png`,
    bg: `${LOFTY}/hubfs/banner-slide1-bg.png`,
  },
];

const audienceCards = [
  {
    img: `${LOFTY}/hubfs/agent1.png`,
    name: "For Agents",
    desc: "To automate your marketing programs, capture and convert more leads into transactions.",
    href: `${LOFTY}/solutions-agents`,
  },
  {
    img: `${LOFTY}/hubfs/agent2.png`,
    name: "For Teams",
    desc: "To streamline your sales process, maximize collaboration, and close more team deals.",
    href: `${LOFTY}/solutions-teams`,
  },
  {
    img: `${LOFTY}/hubfs/agent3.png`,
    name: "For Brokers",
    desc: "To accelerate profitable growth by boosting agent productivity and lowering operational costs.",
    href: `${LOFTY}/solutions-brokers`,
  },
];

const businessCards = [
  {
    href: `${LOFTY}/feature/idx-site`,
    title: "IDX Website",
    desc: "Intelligent IDX that attracts and captures more leads.",
    className: "from-sky-500/20 to-indigo-600/30",
  },
  {
    href: `${LOFTY}/real-estate/crm`,
    title: "AI-Powered CRM",
    desc: "Purpose built for real estate, and powered by our industry-leading agentic AI. You'll spend less time managing leads and more time selling.",
    className: "from-violet-500/20 to-fuchsia-600/25",
  },
  {
    href: `${LOFTY}/feature/mobile`,
    title: "Mobile App",
    desc: "Stay connected to your business at all times, and never miss a chance to close.",
    className: "from-emerald-500/15 to-teal-600/25",
  },
  {
    href: `${LOFTY}/AOS`,
    title: "Automation",
    desc: "Lofty AI initiates action autonomously, engaging leads and booking appointments.",
    className: "from-amber-500/15 to-orange-600/25",
  },
  {
    href: `${LOFTY}/feature/marketing`,
    title: "Marketing",
    desc: 'Automated "Smart Plans" nurture leads and surface new opportunities.',
    className: "from-rose-500/15 to-red-600/25",
  },
];

const oldWay = [
  "Manual data entry required",
  "Disconnected tools and workflow",
  "Human-reliant processes",
  "Time-consuming context switching",
];

const loftyWay = [
  "Workflow - centric automation",
  "Output - driven performance",
  "Autonomous execution",
  "Seamless context awareness",
];

const oldBadges = [
  ["https://cdn.lofty.com/image/fs/servicetool/2026124/2/original_17376fc86c8040d8.png", "CRM"],
  ["https://cdn.lofty.com/image/fs/servicetool/2026124/3/original_2f02b327643d4d06.png", "Email"],
  ["https://cdn.lofty.com/image/fs/servicetool/2026124/3/original_59ba38d988124f9a.png", "Tasks"],
  ["https://cdn.lofty.com/image/fs/servicetool/2026124/3/original_24e19e7f0b2547a9.png", "Calendar"],
  ["https://cdn.lofty.com/image/fs/servicetool/2026124/3/original_d04691ebab3f412c.png", "Reports"],
  ["https://cdn.lofty.com/image/fs/servicetool/2026124/3/original_b87303c4346448fe.png", "Forms"],
  ["https://cdn.lofty.com/image/fs/servicetool/2026124/3/original_e6957708c0c7468e.png", "Web Design"],
  ["https://cdn.lofty.com/image/fs/servicetool/2026124/3/original_23b1b8a9ffe34341.png", "Transactions"],
];

const aiStats = [
  { value: "3 hrs+", label: "Saved Every Day", desc: "AI handles call prep, follow-ups, notes, and content creation." },
  { value: "30%+", label: "Higher-Quality Calls", desc: "AI filters the right leads and tells you what to say on every call." },
  { value: "$4K+", label: "Savings on tools & services", desc: "Replace multiple tools, manual labor, and paid services with one AI system." },
  { value: "24/7", label: "Always-On AI Team", desc: "Your AI agents respond, follow up, and work even when you don't." },
  { value: "Instant", label: "Time to Build AI Workflows", desc: "Build your own AI workflows that automate your real estate operations in minutes." },
];

const partnerLogos = [
  ["https://cdn.lofty.com/image/fs/servicetool/2026124/6/original_2b99b67595924b7a.png", "Coldwell Banker"],
  ["https://cdn.lofty.com/image/fs/servicetool/2026124/6/original_c30c2fdc37af40fa.png", "LPT realty"],
  ["https://cdn.lofty.com/image/fs/servicetool/2026124/6/original_5eb41fbf3352446c.png", "VECTOR"],
  ["https://cdn.lofty.com/image/fs/servicetool/2026124/6/original_9e5e7c513f6e4ae0.png", "Weichert"],
  ["https://cdn.lofty.com/image/fs/servicetool/2026124/6/original_5cc8d70df51b4639.png", "berkshire-hathaway"],
  ["https://cdn.lofty.com/image/fs/servicetool/2026124/6/original_e1f80a64f313437c.png", "exp"],
  ["https://cdn.lofty.com/image/fs/servicetool/2026324/5/original_e18a6cc7c7f347a8.png", "Epique"],
  ["https://cdn.lofty.com/image/fs/servicetool/2026124/6/original_336a6d5ed91949b5.png", "Kellerwilliams"],
  ["https://cdn.lofty.com/image/fs/servicetool/2026324/5/original_b7b16f7c25494f67.png", "Real"],
  ["https://cdn.lofty.com/image/fs/servicetool/2026124/6/original_4bc030dce8e54863.png", "CENTURY 21"],
  ["https://cdn.lofty.com/image/fs/servicetool/2026124/6/original_fbc59d8c692044f3.png", "Exit Realty"],
  ["https://cdn.lofty.com/image/fs/servicetool/2026124/6/original_46eed10e2bcd4d45.png", "Better Homes and Gardens"],
];

const testimonials = [
  {
    href: `${LOFTY}/success-stories/AdamGillespie`,
    badge: "Agents",
    image: "https://cdn.lofty.com/image/fs/servicetool/2026124/8/original_5f5f15b275a243f0.png",
    heading: "Lofty Enables Top eXp Agent to Close Deals Through 100% ...",
    body: "I have a fully automated Lofty CRM that I really don't have to touch if I don't want to—and it still generates me six figures...",
    author: "Adam Gillespie",
    role: "eXp agent & CRM/AI Coach",
    avatar: "https://cdn.lofty.com/image/fs/servicetool/2026124/8/original_fd0760105b314284.png",
  },
  {
    href: `${LOFTY}/success-stories/1stclassrealtysandiego`,
    badge: "Teams",
    image: "https://cdn.lofty.com/image/fs/servicetool/2026129/10/original_2111841794a0493a.png",
    heading: "1st Class Realty San Diego Relies on Lofty to Scale Agent Success ...",
    body: "Everything we do—whether it’s door knocking, open houses, sphere of influence—it all runs through Lofty. There’s a playbook. Agents don’t have to think about what to do. Everything’s automated ...",
    author: "Josh Pono",
    role: "Owner",
    avatar: "https://cdn.lofty.com/image/fs/servicetool/2026129/10/original_49c904f013344dd0.png",
  },
  {
    href: `${LOFTY}/success-stories/EpiqueRealty`,
    badge: "Brokerages",
    image: "https://cdn.lofty.com/image/fs/servicetool/2026129/10/original_208d3039d5074a01.png",
    heading: "Fast-Growing Brokerage Relies on Lofty to Support National Expansion",
    body: "If you're a large, growing brokerage, I encourage you to consider Lofty as your platform of choice. We currently manage ...",
    author: "Josh Miller",
    role: "CEO & Co-founder",
    avatar: "https://cdn.lofty.com/image/fs/servicetool/2026129/10/original_f0255a5e07b24bd1.png",
  },
  {
    href: `${LOFTY}/success-stories/AdamFrank`,
    badge: "Agents",
    image: "https://cdn.lofty.com/image/fs/servicetool/2026129/10/original_0f0956ce5c234630.png",
    heading: "From Frustration to Full Control: How Adam Frank Scales Smarter ...",
    body: "My days before Lofty were full of dread and frustration, and trying to fight with a system that fought you right back. Once I moved to Lofty I would say at least 60% of my frustrations went away without having to do anything other than login.",
    author: "Adam Frank",
    role: "Agent & Real Estate Coach",
    avatar: "https://cdn.lofty.com/image/fs/servicetool/2026129/10/original_f0255a5e07b24bd1.png",
  },
  {
    href: `${LOFTY}/success-stories/LucidoGlobal`,
    badge: "Teams",
    image: "https://cdn.lofty.com/image/fs/servicetool/2026129/10/original_3a820723f1ee444b.png",
    heading: "Lofty Increases Conversion and Supports Accelerated Growth at ...",
    body: "If you want to be successful in real estate, you need to focus on business generation. Since migrating to Lofty, we have increased our business growth by 42%.",
    author: "Robert Lucido Jr.",
    role: "Chief Strategy Officer",
    avatar: "https://cdn.lofty.com/image/fs/servicetool/2026129/10/original_233b28d01a8243c4.png",
  },
  {
    href: `${LOFTY}/success-stories/BobbiBrant`,
    badge: "Brokerages",
    image: "https://cdn.lofty.com/image/fs/servicetool/2026124/8/original_0de56915384741ac.png",
    heading: "Lofty Powers Digital Transformation for Longstanding Independent",
    body: "We didn't want cookie-cutter. We wanted to do our own thing. With Lofty, the website creator and customization options let us stand out ...",
    author: "Bobbi Brant",
    role: "Broker/Owner",
    avatar: "https://cdn.lofty.com/image/fs/servicetool/2026124/8/original_6b77eaee76c64df7.png",
  },
];

export function MarketingHomeClient() {
  const [heroIdx, setHeroIdx] = useState(0);
  const [tIdx, setTIdx] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setHeroIdx((i) => (i + 1) % heroSlides.length), 8000);
    return () => window.clearInterval(id);
  }, []);

  const slide = heroSlides[heroIdx];
  const TitleTag = slide.titleAs;

  return (
    <div className="w-full bg-[#f4f5f8] text-[#1a1d29]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1e2340] via-[#252b45] to-[#12151f] text-white">
        <div className="absolute inset-0 opacity-40" aria-hidden>
          <img src={slide.bg} alt="" className="h-full w-full object-cover object-center" />
        </div>
        <div className="relative mx-auto grid max-w-[1320px] gap-10 px-4 py-16 lg:grid-cols-2 lg:items-center lg:px-6 lg:py-20">
          <div className="max-w-xl">
            <TitleTag className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[2.75rem]">
              {slide.title}
            </TitleTag>
            <p className="mt-4 text-base leading-relaxed text-white/85 sm:text-lg">{slide.des}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#cta"
                className="inline-flex rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/20"
              >
                Let&apos;s Go!
              </a>
              <Link href="/app" className="text-sm font-medium text-white/80 underline-offset-4 hover:text-white hover:underline">
                Open product demo
              </Link>
            </div>
            <div className="mt-8 flex gap-2">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${i === heroIdx ? "w-8 bg-white" : "w-2 bg-white/35 hover:bg-white/55"}`}
                  onClick={() => setHeroIdx(i)}
                />
              ))}
            </div>
          </div>
          <div className="relative flex justify-center lg:justify-end">
            <img src={slide.right} alt="" className="max-h-[320px] w-auto max-w-full object-contain drop-shadow-2xl sm:max-h-[380px]" />
          </div>
        </div>
      </section>

      {/* Audience cards */}
      <section className="mx-auto -mt-10 max-w-[1320px] px-4 lg:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {audienceCards.map((c) => (
            <div
              key={c.name}
              className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-lg shadow-slate-900/5"
            >
              <div className="flex gap-4">
                <img src={c.img} alt="" className="h-14 w-14 shrink-0 rounded-full object-cover" />
                <div>
                  <div className="text-lg font-semibold">{c.name}</div>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{c.desc}</p>
                </div>
              </div>
              <div className="mt-4 border-t border-slate-100 pt-4">
                <a href={c.href} className="text-sm font-semibold text-indigo-600 hover:text-indigo-500" target="_blank" rel="noreferrer">
                  Learn More →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Platform */}
      <section className="mx-auto max-w-[1320px] px-4 py-20 lg:px-6">
        <h2 className="mx-auto max-w-3xl text-center text-2xl font-bold tracking-tight sm:text-3xl">
          One Intuitive Platform. Everything you Need to Succeed
        </h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {businessCards.map((b) => (
            <a
              key={b.href}
              href={b.href}
              target="_blank"
              rel="noreferrer"
              className={`group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br ${b.className} p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md`}
            >
              <div className="relative rounded-xl bg-white/90 p-5 backdrop-blur-sm">
                <div className="text-lg font-semibold text-slate-900">{b.title}</div>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{b.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Smarter way + AI stats */}
      <section className="relative overflow-hidden bg-[#eef0f6] py-20">
        <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-indigo-300/30 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-violet-300/25 blur-3xl" aria-hidden />
        <div className="relative mx-auto max-w-[1320px] px-4 lg:px-6">
          <h3 className="text-center text-2xl font-bold sm:text-3xl">A Smarter Way to Grow</h3>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <h4 className="text-lg font-semibold">The Old Way</h4>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Feature-heavy systems built around tools—relying on manual effort and coordination to move work forward.
              </p>
              <ul className="mt-6 space-y-3">
                {oldWay.map((t) => (
                  <li key={t} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                      ×
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-8 rounded-xl bg-slate-50 p-4">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {oldBadges.map(([src, label]) => (
                    <div key={label} className="flex flex-col items-center gap-2 rounded-lg bg-white p-3 text-center text-xs font-medium text-slate-700 shadow-sm">
                      <img src={src} alt="" className="h-8 w-8 object-contain" />
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-indigo-200/80 bg-gradient-to-b from-white to-indigo-50/60 p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <img
                  src="https://cdn.lofty.com/image/fs/servicetool/2026124/2/original_38a70e8b5e6d4152.png"
                  alt=""
                  className="h-8 w-8 object-contain"
                />
                <h4 className="text-lg font-semibold">The Lofty Way</h4>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Agentic AI agents that understand context, take ownership of complete workflows, and act autonomously to achieve goals.
              </p>
              <ul className="mt-6 space-y-3">
                {loftyWay.map((t) => (
                  <li key={t} className="flex items-start gap-2 text-sm text-slate-800">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
                      ✓
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4 rounded-xl bg-white/80 p-4 sm:gap-6">
                {(
                  [
                    ["https://cdn.lofty.com/image/fs/servicetool/2026124/3/original_d7e1a40574424eed.png", "Input"],
                    ["https://cdn.lofty.com/image/fs/servicetool/2026124/3/original_8aa4cb61d3204f7f.png", "AI Agents"],
                    ["https://cdn.lofty.com/image/fs/servicetool/2026124/3/original_98e2cd2c61f34e27.png", "Output"],
                  ] as const
                ).map(([src, lab], i, arr) => (
                  <div key={lab} className="flex items-center gap-4 sm:gap-6">
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
                        <img src={src} alt="" className="h-9 w-9 object-contain" />
                      </div>
                      <p className="text-xs font-semibold text-slate-700">{lab}</p>
                    </div>
                    {i < arr.length - 1 ? (
                      <img
                        src="https://cdn.lofty.com/image/fs/servicetool/2026124/3/original_55045ff8792249e1.png"
                        alt=""
                        className="h-6 w-10 object-contain"
                      />
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-20 rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm sm:p-10">
            <h2 className="text-center text-2xl font-bold sm:text-3xl">Let Lofty AI Handle the Busy Work</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {aiStats.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl font-bold text-indigo-600 sm:text-3xl">{s.value}</p>
                  <p className="mt-2 text-sm font-semibold">{s.label}</p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">{s.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <a
                href={`${LOFTY}/AOS`}
                className="inline-flex rounded-full bg-[#151826] px-8 py-3 text-sm font-semibold text-white hover:bg-[#252a3d]"
                target="_blank"
                rel="noreferrer"
              >
                Explore Lofty AI
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Logos */}
      <section className="border-y border-slate-200/80 bg-white py-14">
        <div className="mx-auto max-w-[1320px] px-4 lg:px-6">
          <h2 className="text-center text-xl font-bold sm:text-2xl">Trusted by Top Agents, Teams and Brokerages</h2>
          <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-8 opacity-80 grayscale transition hover:grayscale-0">
            {partnerLogos.map(([src, alt]) => (
              <li key={alt}>
                <img src={src} alt={alt} className="h-8 w-auto max-w-[120px] object-contain sm:h-9" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#f4f5f8] py-16">
        <div className="mx-auto max-w-[1320px] px-4 lg:px-6">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">Real People. Real Results.</h2>
          <div className="relative mt-10">
            <div className="overflow-hidden rounded-2xl">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                  width: `${testimonials.length * 100}%`,
                  transform: `translateX(-${(100 / testimonials.length) * tIdx}%)`,
                }}
              >
                {testimonials.map((t) => (
                  <div key={t.href} className="shrink-0 px-1" style={{ width: `${100 / testimonials.length}%` }}>
                    <a
                      href={t.href}
                      target="_blank"
                      rel="noreferrer"
                      className="mx-auto flex max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-md transition hover:shadow-lg sm:flex-row"
                    >
                      <div className="relative sm:w-[42%]">
                        <img src={t.image} alt="" className="h-56 w-full object-cover sm:h-full sm:min-h-[280px]" />
                        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-indigo-700 shadow">
                          {t.badge}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col p-6 sm:p-8">
                        <h3 className="text-lg font-semibold leading-snug">{t.heading}</h3>
                        <p className="mt-3 text-sm leading-relaxed text-slate-600">{t.body}</p>
                        <div className="mt-auto flex items-center gap-3 border-t border-slate-100 pt-6">
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold">{t.author}</p>
                            <p className="text-sm text-slate-500">{t.role}</p>
                          </div>
                          <img src={t.avatar} alt="" className="h-12 w-12 rounded-full object-cover" />
                        </div>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </div>
            <button
              type="button"
              aria-label="Previous testimonial"
              className="absolute left-0 top-1/2 z-10 hidden -translate-x-2 -translate-y-1/2 rounded-full border border-slate-200 bg-white p-2 shadow-md hover:bg-slate-50 sm:inline-flex"
              onClick={() => setTIdx((i) => (i - 1 + testimonials.length) % testimonials.length)}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next testimonial"
              className="absolute right-0 top-1/2 z-10 hidden translate-x-2 -translate-y-1/2 rounded-full border border-slate-200 bg-white p-2 shadow-md hover:bg-slate-50 sm:inline-flex"
              onClick={() => setTIdx((i) => (i + 1) % testimonials.length)}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="mt-6 flex justify-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Testimonial ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${i === tIdx ? "w-8 bg-indigo-600" : "w-2 bg-slate-300 hover:bg-slate-400"}`}
                  onClick={() => setTIdx(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="scroll-mt-24 bg-gradient-to-r from-indigo-700 via-violet-700 to-indigo-800 py-16 text-white">
        <div className="mx-auto max-w-[720px] px-4 text-center lg:px-6">
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
            Ready To Accelerate
            <br />
            Your Business Growth?
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/app"
              className="inline-flex rounded-full border-2 border-white/80 bg-transparent px-8 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Request a Demo
            </Link>
            <a
              href={LOFTY}
              className="inline-flex rounded-full bg-white px-8 py-3 text-sm font-semibold text-indigo-800 hover:bg-white/90"
              target="_blank"
              rel="noreferrer"
            >
              Visit lofty.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
