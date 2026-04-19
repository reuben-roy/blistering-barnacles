import type { SocialLink, UserProfile } from "./types";

const allPlatforms: SocialLink["platform"][] = [
  "facebook",
  "linkedin",
  "x",
  "zillow",
  "yelp",
  "instagram",
  "youtube",
  "tiktok",
  "snapchat",
  "pinterest",
];

export const defaultSocial: SocialLink[] = allPlatforms.map((platform, i) => ({
  platform,
  connected: i % 3 === 0,
  handle: i % 3 === 0 ? `@${platform}_demo` : undefined,
  profileUrl: i % 3 === 0 ? `https://example.com/${platform}` : undefined,
}));

export const userProfile: UserProfile = {
  id: "user-1",
  firstName: "Baylee",
  lastName: "Rhoades",
  email: "baylee.rhoades@example.com",
  phone: {
    country: "US",
    e164: "+16025550123",
    display: "(602) 555-0123",
  },
  timeZone: "America/Phoenix",
  workingHours: { start: "09:00", end: "17:00" },
  licenseId: "BR-928174",
  position: "Broker",
  avatarUrl: "https://i.pravatar.cc/240?u=baylee-rhoades",
  social: defaultSocial,
};
