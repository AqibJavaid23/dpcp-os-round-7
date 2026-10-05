"use client";

import { useState } from "react";
import Link from "next/link";
import { PageFrame } from "@/components/app-shell";
import { Surface } from "@/components/bits";
import { CopilotLogo } from "@/components/round6/marks";
import { COPILOT_BRANDS, RACI, type RaciRow } from "@/lib/round6/copilots";
import { profileFor } from "@/lib/life";
import { PEOPLE } from "@/lib/seed";

export function PeopleOrg() {
  const [copilotId, setCopilotId] = useState<string | null>(null);
  const brand = COPILOT_BRANDS.find((item) => item.id === copilotId);

  if (!brand) {
    return (
      <PageFrame title="People & Org" lede="Start with a department. Open it for the people and the RACI.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {COPILOT_BRANDS.map((item) => (
            <button key={item.id} type="button" onClick={() => setCopilotId(item.id)} className="rounded-3xl bg-white p-4 text-left shadow-[0_8px_30px_rgba(18,59,120,0.05)]">
              <CopilotLogo id={item.id} size="lg" />
              <p className="font-heading mt-3 text-lg text-dpcp-navy">{item.name}</p>
              <p className="text-sm text-muted-foreground">{item.people.length} {item.people.length === 1 ? "person" : "people"}</p>
            </button>
          ))}
        </div>
      </PageFrame>
    );
  }

  const people = brand.people.map((id) => PEOPLE.find((person) => person.id === id)).filter(Boolean);
  const rows = RACI[brand.id] ?? [];
  return (
    <PageFrame title={brand.name} lede="People, then who is responsible.">
      <button type="button" className="text-sm text-dpcp-blue" onClick={() => setCopilotId(null)}>
        All departments
      </button>
      <div className="mt-4 flex items-center gap-3">
        <CopilotLogo id={brand.id} size="lg" />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {people.map((person) => {
          if (!person) return null;
          const profile = profileFor(person);
          return (
            <Link key={person.id} href={`/people/${person.id}`} className="no-underline">
              <Surface className="h-full">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold text-white" style={{ background: brand.color }}>
                    {person.initials}
                  </span>
                  <div>
                    <p className="font-medium text-dpcp-navy">{person.name}</p>
                    <p className="text-sm text-muted-foreground">{person.title}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm">Started {profile.started}</p>
                <p className="mt-1 text-sm text-muted-foreground">{profile.about}</p>
                <p className="mt-1 text-xs text-muted-foreground">{profile.place} · {profile.enjoys}</p>
              </Surface>
            </Link>
          );
        })}
      </div>
      <RaciMatrix rows={rows} />
    </PageFrame>
  );
}

function RaciMatrix({ rows }: { rows: RaciRow[] }) {
  return (
    <section className="mt-8">
      <h2 className="font-heading text-2xl text-dpcp-navy">RACI</h2>
      <p className="mt-1 text-sm text-muted-foreground">Sample only. The real matrices replace this later.</p>
      <div className="mt-3 space-y-2">
        {rows.map((row) => (
          <div key={row.work} className="rounded-2xl bg-white px-4 py-3">
            <p className="text-sm font-medium text-dpcp-navy">{row.work}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {row.cells.map((cell) => (
                <span key={`${row.work}-${cell.person}-${cell.letter}`} className="inline-flex items-center gap-2 rounded-full bg-[#E7EEF6] px-3 py-1 text-xs text-dpcp-navy">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-dpcp-navy text-[10px] text-white">{cell.letter}</span>
                  {cell.person}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">R responsible · A accountable · C consulted · I informed</p>
    </section>
  );
}
