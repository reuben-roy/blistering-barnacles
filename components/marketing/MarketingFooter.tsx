import { LOFTY } from "./constants";

const year = new Date().getFullYear();

export function MarketingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-[#f8f9fc] text-sm text-slate-700">
      <div className="mx-auto max-w-[1320px] px-4 py-12 lg:px-6">
        <div className="grid gap-10 lg:grid-cols-[200px_1fr]">
          <a href={LOFTY} className="inline-block shrink-0" target="_blank" rel="noreferrer">
            <img
              src="https://static.chimeroi.com/servicetool-temp/20231011/2/909d1fff-2120-4401-b3a2-f58a69e6bfd4_lofty_logo.svg"
              alt="Lofty"
              className="h-8 w-auto"
            />
          </a>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
            <FooterCol
              title="Who We Help"
              links={[
                ["Agents", `${LOFTY}/solutions-agents`],
                ["Teams", `${LOFTY}/solutions-teams`],
                ["Brokers", `${LOFTY}/solutions-brokers`],
              ]}
            />
            <FooterCol
              title="Resources"
              links={[
                ["Blog", `${LOFTY}/blog`],
                ["Success Stories", `${LOFTY}/success-stories`],
              ]}
            />
            <FooterCol
              title="Partners"
              links={[
                ["Customer Referrals", `${LOFTY}/refer`],
                ["Integration Center", `${LOFTY}/integrations`],
              ]}
            />
            <div>
              <p className="font-semibold text-slate-900">Contact</p>
              <ul className="mt-3 space-y-2">
                <li>
                  <a href="tel:8559817557" className="hover:text-indigo-600">
                    855-981-7557
                  </a>
                </li>
                <li>
                  <a href="mailto:support@lofty.com" className="hover:text-indigo-600">
                    support@lofty.com
                  </a>
                </li>
                <li className="text-slate-500">7 Days a Week</li>
                <li className="text-slate-500">8 am to 8 pm Eastern Time</li>
              </ul>
            </div>
            <FooterCol
              title="Lead Generation"
              links={[
                ["360 Marketing", `${LOFTY}/feature/marketing`],
                ["Google PPC", `${LOFTY}/feature/googleppc`],
                ["Google LSA", `${LOFTY}/feature/lsa`],
                ["Brand Advertising", `${LOFTY}/feature/branding`],
                ["Direct Mail", `${LOFTY}/feature/mail`],
              ]}
            />
            <FooterCol
              title="Platform"
              links={[
                ["Real Estate CRM", `${LOFTY}/real-estate/crm`],
                ["Agent Websites", `${LOFTY}/feature/idx-site`],
                ["Social Studio", `${LOFTY}/feature/social-studio`],
                ["AI Assistant", `${LOFTY}/feature/assistant`],
                ["Mobile Apps", `${LOFTY}/feature/mobile`],
                ["Power Dialer", `${LOFTY}/feature/dialer`],
                ["Transaction Management", `${LOFTY}/feature/transaction`],
              ]}
            />
            <FooterCol
              title="Company"
              links={[
                ["About", `${LOFTY}/about`],
                ["Mission", `${LOFTY}/mission`],
                ["News", `${LOFTY}/news`],
                ["Contact Us", `${LOFTY}/contact-us`],
              ]}
            />
            <div>
              <p className="font-semibold text-slate-900">Get the app</p>
              <div className="mt-3 flex flex-col gap-3">
                <a href="https://itunes.apple.com/app/id1066013148" target="_blank" rel="noreferrer">
                  <img
                    src="https://static.chimeroi.com/servicetool-temp/20231011/18/b736a5f7-b764-413f-992a-fd0cd662fe6f_app_store.svg"
                    alt="App Store"
                    className="h-10 w-auto"
                  />
                </a>
                <a href="https://play.google.com/store/apps/details?id=com.renren.estate.android" target="_blank" rel="noreferrer">
                  <img
                    src="https://static.chimeroi.com/servicetool-temp/20231011/18/e50351fb-8e3a-4676-abc3-339dcfc463cf_google_play.svg"
                    alt="Google Play"
                    className="h-10 w-auto"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-6 px-4 py-8 lg:flex-row lg:items-center lg:justify-between lg:px-6">
          <div className="flex flex-wrap items-center gap-6">
            <a href="https://www.google.com/partners/agency?id=2598888266" target="_blank" rel="noreferrer">
              <img
                src="https://static.chimeroi.com/servicetool-temp/20231011/22/fb68e131-4d39-4603-b543-ec73e0fd03b7_Ma_group.svg"
                alt="Google Partner"
                className="h-10 w-auto"
              />
            </a>
            <div className="text-xs text-slate-500">
              <div>Lofty Inc. Copyright {year}. All Rights Reserved.</div>
              <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                <li>
                  <a href={`${LOFTY}/privacy-terms?from=terms`} className="hover:text-indigo-600" target="_blank" rel="noreferrer">
                    Terms of Use
                  </a>
                </li>
                <li>
                  <a href={`${LOFTY}/privacy-terms?from=privacy`} className="hover:text-indigo-600" target="_blank" rel="noreferrer">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href={`${LOFTY}/accessibility`} className="hover:text-indigo-600" target="_blank" rel="noreferrer">
                    Accessibility
                  </a>
                </li>
                <li>
                  <a href={`${LOFTY}/security-compliance`} className="hover:text-indigo-600" target="_blank" rel="noreferrer">
                    Security
                  </a>
                </li>
                <li>
                  <a href="https://status.lofty.com" className="hover:text-indigo-600" target="_blank" rel="noreferrer">
                    Platform Status
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://www.tiktok.com/@loftyplatform" target="_blank" rel="noreferrer" aria-label="TikTok">
              <img
                src="https://static.chimeroi.com/servicetool-temp/2023118/17/eaa93783-7690-4e1e-ba23-a45c8f2457d4_tiktokButton.svg"
                alt=""
                className="h-9 w-9"
              />
            </a>
            <a href="https://www.instagram.com/lofty_platform" target="_blank" rel="noreferrer" aria-label="Instagram">
              <img
                src="https://static.chimeroi.com/servicetool-temp/2023118/17/352b4cf8-e106-46db-ba9b-9845b15f333d_insButton.svg"
                alt=""
                className="h-9 w-9"
              />
            </a>
            <a href="https://www.facebook.com/loftyplatform" target="_blank" rel="noreferrer" aria-label="Facebook">
              <img
                src="https://static.chimeroi.com/servicetool-temp/20231012/0/27177b12-fc42-435b-83ed-8d16e7166278_facebook_02.svg"
                alt=""
                className="h-9 w-9"
              />
            </a>
            <a href="https://www.youtube.com/@loftyplatform" target="_blank" rel="noreferrer" aria-label="YouTube">
              <img
                src="https://static.chimeroi.com/servicetool-temp/20231012/0/88b442ff-45b0-4899-af89-cf1f9d4b49f3_youtube_02.svg"
                alt=""
                className="h-9 w-9"
              />
            </a>
            <a href="https://linkedin.com/company/loftyplatform" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <img
                src="https://static.chimeroi.com/servicetool-temp/20231012/0/1b2eb5a0-3126-43fa-b280-f9ce445f9eff_linkedin_02.svg"
                alt=""
                className="h-9 w-9"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <p className="font-semibold text-slate-900">{title}</p>
      <ul className="mt-3 space-y-2">
        {links.map(([label, href]) => (
          <li key={href}>
            <a href={href} className="hover:text-indigo-600" target="_blank" rel="noreferrer">
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
