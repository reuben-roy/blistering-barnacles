"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { UserProfile } from "@/lib/fixtures/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { AtSign, Building2, Link2, MapPin, MessageCircle, Mic, Share2, Video } from "lucide-react";

const timeZones = [
  "America/Phoenix",
  "America/Los_Angeles",
  "America/Denver",
  "America/Chicago",
  "America/New_York",
];

const platformLabel: Record<string, string> = {
  facebook: "Facebook",
  linkedin: "LinkedIn",
  x: "X",
  zillow: "Zillow",
  yelp: "Yelp",
  instagram: "Instagram",
  youtube: "YouTube",
  tiktok: "TikTok",
  snapchat: "Snapchat",
  pinterest: "Pinterest",
};

function iconFor(platform: string) {
  switch (platform) {
    case "facebook":
      return <Share2 className="h-4 w-4" />;
    case "linkedin":
      return <Link2 className="h-4 w-4" />;
    case "instagram":
      return <MessageCircle className="h-4 w-4" />;
    case "youtube":
      return <Video className="h-4 w-4" />;
    case "pinterest":
      return <MapPin className="h-4 w-4" />;
    case "zillow":
      return <Building2 className="h-4 w-4" />;
    case "tiktok":
      return <Mic className="h-4 w-4" />;
    default:
      return <AtSign className="h-4 w-4" />;
  }
}

export function ProfileForm({ initial }: { initial: UserProfile }) {
  const [firstName, setFirstName] = useState(initial.firstName);
  const [lastName, setLastName] = useState(initial.lastName);
  const [email] = useState(initial.email);
  const [phone, setPhone] = useState(initial.phone.display);
  const [timeZone, setTimeZone] = useState(initial.timeZone);
  const [start, setStart] = useState(initial.workingHours.start);
  const [end, setEnd] = useState(initial.workingHours.end);
  const [licenseId, setLicenseId] = useState(initial.licenseId);
  const [position, setPosition] = useState(initial.position);
  const [vacation, setVacation] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {vacation ? (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Vacation mode is on (local demo state). Routing may skip you in a real product.
        </div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <div className="space-y-3">
          <div className="relative aspect-square w-full max-w-[220px] overflow-hidden rounded-lg border border-border bg-app-bg">
            <Image src={initial.avatarUrl} alt="" fill className="object-cover" sizes="220px" unoptimized />
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" />
          <Button variant="secondary" className="w-full max-w-[220px]" onClick={() => fileRef.current?.click()}>
            Upload photo
          </Button>
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <Input label="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
          <div>
            <div className="flex items-end justify-between gap-3">
              <div className="flex-1">
                <Input label="Email address" value={email} readOnly />
              </div>
              <button type="button" className="mb-2 text-sm text-accent hover:underline">
                Change email address
              </button>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
            <Select label="Country" defaultValue="US">
              <option value="US">US</option>
            </Select>
            <Input label="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <Select label="Time zone" value={timeZone} onChange={(e) => setTimeZone(e.target.value)}>
            {timeZones.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </Select>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input type="time" label="Working hours start" value={start} onChange={(e) => setStart(e.target.value)} />
            <Input type="time" label="Working hours end" value={end} onChange={(e) => setEnd(e.target.value)} />
          </div>
          <button type="button" className="text-sm text-accent hover:underline" onClick={() => setVacation((v) => !v)}>
            Switch to vacation mode
          </button>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="License ID" value={licenseId} onChange={(e) => setLicenseId(e.target.value)} />
            <Select label="Position" value={position} onChange={(e) => setPosition(e.target.value as UserProfile["position"])}>
              <option value="Agent">Agent</option>
              <option value="Broker">Broker</option>
              <option value="TC">TC</option>
              <option value="Admin">Admin</option>
            </Select>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-base font-semibold text-text">Social media</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {initial.social.map((s) => (
            <div key={s.platform} className="rounded-lg border border-border bg-surface p-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                {iconFor(s.platform)}
                {platformLabel[s.platform] ?? s.platform}
              </div>
              {s.connected ? (
                <div className="mt-2 text-xs text-muted">
                  Connected as {s.handle}
                  <button type="button" className="ml-2 text-accent hover:underline">
                    Manage
                  </button>
                </div>
              ) : (
                <button type="button" className="mt-2 text-sm text-accent hover:underline">
                  + Add connection
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
