"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";

export function NotificationsForm() {
  const [email, setEmail] = useState(true);
  const [sms, setSms] = useState(false);
  const [push, setPush] = useState(true);
  const [inApp, setInApp] = useState(true);

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Card>
        <div className="text-sm font-semibold">Channels</div>
        <div className="mt-4 space-y-3 text-sm">
          <Toggle label="Email" checked={email} onChange={setEmail} guideId="settings.notifications.email-toggle" />
          <Toggle label="SMS" checked={sms} onChange={setSms} guideId="settings.notifications.sms-toggle" />
          <Toggle label="Push" checked={push} onChange={setPush} />
          <Toggle label="In-app" checked={inApp} onChange={setInApp} />
        </div>
      </Card>
      <Card>
        <div className="text-sm font-semibold">Quiet hours (demo)</div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 text-sm">
          <label className="text-muted">
            Start
            <input
              type="time"
              defaultValue="21:00"
              className="mt-1 w-full rounded-md border border-border px-2 py-2"
              data-guide="settings.notifications.quiet-start"
            />
          </label>
          <label className="text-muted">
            End
            <input type="time" defaultValue="07:00" className="mt-1 w-full rounded-md border border-border px-2 py-2" />
          </label>
        </div>
      </Card>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
  guideId,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  guideId?: string;
}) {
  return (
    <label
      className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2"
      data-guide={guideId}
    >
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="accent-accent" />
    </label>
  );
}
