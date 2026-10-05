"use client";

import Link from "next/link";
import { PageFrame } from "@/components/app-shell";
import { AppointmentsToday } from "@/components/round4/experience";
import { CopilotLogo } from "@/components/round6/marks";
import { Bars, Ring } from "@/components/round6/charts";
import { ROLE_META } from "@/lib/round6/nav";
import { copilotForDepartment } from "@/lib/round6/copilots";
import { PRACTICES } from "@/lib/round2/data";
import { PEOPLE } from "@/lib/seed";
import { useApp } from "@/lib/store";
import type { Role } from "@/lib/types";

const ICONS: Record<Role, string> = {
  employee: "M12 3v2M12 19v2M5 12H3M21 12h-2M6 6l1.5 1.5M16.5 16.5 18 18M6 18l1.5-1.5M16.5 7.5 18 6",
  leader: "M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM16 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM4 19c0-2 2-3 4-3s4 1 4 3M14 19c0-1.6 1.2-2.6 2.5-2.6S19 17.4 19 19",
  administrator: "M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z",
  george: "M12 3l2.2 4.6L19 8.2l-3.5 3.4.8 4.9L12 14.8 7.7 16.5l.8-4.9L5 8.2l4.8-.6L12 3Z",
  owner: "M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-8.5Z",
};

export function RoleIcon({ role, color }: { role: Role; color: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke={color} strokeWidth="1.6" aria-hidden>
      <path d={ICONS[role]} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function RoleHome() {
  const app = useApp();
  const role = app.ui.role;
  if (role === "employee") return null;
  const meta = ROLE_META[role];
  const copilot = copilotForDepartment(app.viewer.departmentId);
  return (
    <PageFrame title={meta.hero} lede={meta.line}>
      <section className="rounded-3xl px-5 py-6 text-white" style={{ background: meta.accent }}>
        <div className="flex items-center gap-3">
          <RoleIcon role={role} color="#ffffff" />
          <div>
            <p className="text-xs tracking-wide text-white/70 uppercase">{meta.label}</p>
            <h2 className="font-heading text-2xl">{app.viewer.name}</h2>
            <p className="text-sm text-white/80">{app.viewer.title}</p>
          </div>
        </div>
      </section>
      {role === "leader" && <LeadBody />}
      {role === "administrator" && <AdminBody />}
      {role === "george" && <ExecutiveBody />}
      <div className="mt-6 flex items-center gap-3">
        <CopilotLogo id={copilot.id} labeled />
      </div>
      <AppointmentsToday />
    </PageFrame>
  );
}

function LeadBody() {
  const people = ["omar", "nadia", "imran", "sana", "faisal", "hina"].map((id) => PEOPLE.find((person) => person.id === id)!);
  return (
    <div className="mt-4 grid gap-3 lg:grid-cols-2">
      <article className="rounded-3xl bg-white p-4">
        <p className="text-xs text-muted-foreground">Workload today</p>
        <div className="mt-3">
          <Bars
            rows={people.map((person) => ({
              label: person.firstName,
              value: person.todayTotal,
              color: person.status === "blocked" ? "#c4322b" : "#0E6B5C",
            }))}
          />
        </div>
        <Link href="/teams" className="mt-3 inline-block text-sm text-dpcp-blue">
          Open the project board
        </Link>
      </article>
      <article className="rounded-3xl bg-status-red-bg p-4 text-status-red">
        <p className="text-xs uppercase">Overdue</p>
        <p className="font-heading mt-2 text-3xl">12</p>
        <p className="text-sm">New location items are overdue. 5 have no proof. Imran Cole’s make-up is still open.</p>
      </article>
    </div>
  );
}

function AdminBody() {
  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-3">
      {[
        ["People", "15", "Profiles and roles"],
        ["Access", "2 red", "Day-1 checks still open"],
        ["Hours", "3 zones", "Arizona, South Africa, Pakistan"],
      ].map(([label, value, note]) => (
        <article key={label} className="rounded-3xl bg-white p-4">
          <Ring value={label === "Access" ? 40 : 82} center={value} caption={label} color="#3E4C6B" />
          <p className="mt-2 text-center text-xs text-muted-foreground">{note}</p>
        </article>
      ))}
      <Link href="/settings" className="text-sm text-dpcp-blue sm:col-span-3">
        Open Settings & Admin
      </Link>
    </div>
  );
}

function ExecutiveBody() {
  return (
    <div className="mt-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {PRACTICES.map((practice) => (
          <article key={practice.id} className="rounded-3xl bg-white p-4">
            <p className="text-xs text-muted-foreground">{practice.town}</p>
            <p className="font-heading text-lg text-dpcp-navy">{practice.name}</p>
            <p className="mt-2 text-sm">One office. Same picture for every practice.</p>
          </article>
        ))}
      </div>
      <Link href="/review" className="mt-3 inline-block text-sm text-dpcp-blue">
        Review waiting on you
      </Link>
    </div>
  );
}
