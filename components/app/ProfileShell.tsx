"use client";

import { useState } from "react";
import { IdCard } from "lucide-react";
import { RelatedDocsCard } from "@/components/help/RelatedDocsCard";
import type { UserProfile } from "@/lib/fixtures/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { ProfileForm } from "./ProfileForm";

export function ProfileShell({ initial }: { initial: UserProfile }) {
  const [cardOpen, setCardOpen] = useState(false);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="My User Settings - Profile"
        actions={
          <Button variant="secondary" className="inline-flex items-center gap-2" onClick={() => setCardOpen(true)}>
            <IdCard className="h-4 w-4" />
            Manage my virtual business card
          </Button>
        }
      />
      <RelatedDocsCard presetId="profile" />
      <ProfileForm initial={initial} />

      {cardOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-w-md rounded-lg border border-border bg-surface p-4 shadow-lg">
            <div className="text-sm font-semibold">Virtual business card</div>
            <p className="mt-2 text-sm text-muted">Demo only. In a real product this would open an editor.</p>
            <div className="mt-4">
              <Button variant="secondary" onClick={() => setCardOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
