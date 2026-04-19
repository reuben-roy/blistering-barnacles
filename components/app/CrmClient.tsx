"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Lead, LeadSource, LeadStage } from "@/lib/fixtures/types";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Table, Td, Th } from "@/components/ui/Table";
import { formatRelativeTime } from "@/lib/format";

const stages: LeadStage[] = ["New", "Nurture", "Hot", "ApptSet", "Closed", "Lost"];
const sources: LeadSource[] = ["IDX", "Referral", "OpenHouse", "PaidAds", "Sphere", "ZillowFlex", "Unknown"];

function stageTone(stage: LeadStage): "neutral" | "accent" | "danger" {
  if (stage === "Hot" || stage === "ApptSet") return "accent";
  if (stage === "Lost") return "danger";
  return "neutral";
}

export function CrmClient({ leads }: { leads: Lead[] }) {
  const [q, setQ] = useState("");
  const [stage, setStage] = useState<LeadStage | "All">("All");
  const [source, setSource] = useState<LeadSource | "All">("All");

  const rows = useMemo(() => {
    return leads.filter((l) => {
      const hay = `${l.fullName} ${l.email}`.toLowerCase();
      if (q.trim() && !hay.includes(q.trim().toLowerCase())) return false;
      if (stage !== "All" && l.stage !== stage) return false;
      if (source !== "All" && l.source !== source) return false;
      return true;
    });
  }, [leads, q, source, stage]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 lg:grid-cols-[1fr_200px_220px]">
        <Input placeholder="Search name or email" value={q} onChange={(e) => setQ(e.target.value)} />
        <Select label="Stage" value={stage} onChange={(e) => setStage(e.target.value as LeadStage | "All")}>
          <option value="All">All stages</option>
          {stages.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
        <Select label="Source" value={source} onChange={(e) => setSource(e.target.value as LeadSource | "All")}>
          <option value="All">All sources</option>
          {sources.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </div>

      <Table>
        <thead>
          <tr>
            <Th>Name</Th>
            <Th>Stage</Th>
            <Th>Source</Th>
            <Th>Last activity</Th>
            <Th>Assigned</Th>
            <Th>Tags</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((l) => (
            <tr key={l.id} className="hover:bg-app-bg">
              <Td>
                <Link className="font-medium text-accent hover:underline" href={`/app/crm/leads/${l.id}`}>
                  {l.fullName}
                </Link>
              </Td>
              <Td>
                <Badge tone={stageTone(l.stage)}>{l.stage}</Badge>
              </Td>
              <Td className="text-muted">{l.source}</Td>
              <Td className="text-muted">{formatRelativeTime(l.lastActivityAt)}</Td>
              <Td>{l.assignedTo}</Td>
              <Td className="max-w-[220px] truncate text-muted">{l.tags.join(", ")}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="text-xs text-muted">
        Showing {rows.length} of {leads.length} leads
      </div>
    </div>
  );
}
