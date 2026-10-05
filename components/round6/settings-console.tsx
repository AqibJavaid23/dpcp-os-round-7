"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { PageFrame } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { CopilotLogo } from "@/components/round6/marks";
import { COPILOT_BRANDS } from "@/lib/round6/copilots";
import { PRACTICES } from "@/lib/round2/data";
import { PEOPLE } from "@/lib/seed";
import { useApp } from "@/lib/store";
import { useRound3 } from "@/lib/round3/store";
import { cn } from "@/lib/utils";

const SECTIONS = [
  ["profile", "Profile"],
  ["notifications", "Notifications"],
  ["hours", "Working hours"],
  ["users", "Users & roles"],
  ["departments", "Departments"],
  ["practices", "Practices"],
  ["accounts", "Connected accounts"],
  ["brand", "Branding"],
  ["audit", "Audit log"],
  ["privacy", "Data & privacy"],
  ["security", "Security"],
  ["billing", "Billing"],
  ["help", "Help"],
] as const;

type SectionId = (typeof SECTIONS)[number][0];

const PERMS = ["See own work", "See the department", "See the company", "Manage users", "Pause AI jobs"];
const ROLES = ["DPCP Employee", "DPCP Lead", "DPCP Admin", "George", "Practice Owner"];
const MATRIX: boolean[][] = [
  [true, false, false, false, false],
  [true, true, false, false, false],
  [true, true, true, false, true],
  [false, false, true, true, false],
  [false, false, true, true, false],
];

export function SettingsConsole() {
  const app = useApp();
  const r3 = useRound3();
  const [section, setSection] = useState<SectionId>("profile");
  const [notes, setNotes] = useState(true);
  const [mail, setMail] = useState(true);
  const [start, setStart] = useState("8:00 AM");
  const [end, setEnd] = useState("4:30 PM");
  const viewer = app.viewer;
  const email = viewer.email.includes("gmail.com") ? "george@dpcp.example" : viewer.email;

  return (
    <PageFrame title="Settings & Admin" lede="The company console. Everything here is a sample.">
      <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {SECTIONS.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setSection(id)}
              className={cn("shrink-0 rounded-2xl px-3 py-2 text-left text-sm", section === id ? "bg-dpcp-navy text-white" : "bg-white text-dpcp-navy")}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="space-y-3">
          {section === "profile" && (
            <Card title="Profile">
              <p className="text-sm">{viewer.name}</p>
              <p className="text-sm text-muted-foreground">{viewer.title}</p>
              <p className="text-sm text-muted-foreground">{email}</p>
              <label className="mt-3 block text-sm">
                Preference
                <input className="mt-1 h-11 w-full rounded-2xl bg-muted px-3" defaultValue="Calm notifications. One task at a time." />
              </label>
              <Link href="/settings/time-off" className="mt-3 inline-block text-sm text-dpcp-blue">
                Time off & backup
              </Link>
            </Card>
          )}
          {section === "notifications" && (
            <Card title="Notifications">
              <Toggle on={notes} set={setNotes} label="In-app notes" />
              <Toggle on={mail} set={setMail} label="Mail digest at the end of the day" />
            </Card>
          )}
          {section === "hours" && (
            <Card title="Working hours">
              <p className="text-sm text-muted-foreground">{viewer.shift}</p>
              <div className="mt-3 flex gap-2">
                <input aria-label="Start" value={start} onChange={(event) => setStart(event.target.value)} className="h-11 rounded-2xl bg-muted px-3 text-sm" />
                <input aria-label="End" value={end} onChange={(event) => setEnd(event.target.value)} className="h-11 rounded-2xl bg-muted px-3 text-sm" />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">This sets today, rollovers, and close-out.</p>
            </Card>
          )}
          {section === "users" && (
            <Card title="Users and roles">
              <ul className="space-y-2">
                {PEOPLE.map((person) => (
                  <li key={person.id} className="flex items-center justify-between gap-3 text-sm">
                    <span>{person.name}</span>
                    <span className="text-muted-foreground">{person.title}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[520px] text-left text-xs">
                  <thead>
                    <tr>
                      <th className="py-2">Permission</th>
                      {ROLES.map((role) => (
                        <th key={role}>{role}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {PERMS.map((perm, row) => (
                      <tr key={perm} className="border-t border-border">
                        <td className="py-2">{perm}</td>
                        {MATRIX[row].map((on, col) => (
                          <td key={ROLES[col]}>{on ? "Yes" : "—"}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
          {section === "departments" && (
            <Card title="Departments and teams">
              <div className="grid gap-3 sm:grid-cols-2">
                {COPILOT_BRANDS.map((brand) => (
                  <div key={brand.id} className="flex items-center gap-3 rounded-2xl bg-muted px-3 py-3">
                    <CopilotLogo id={brand.id} size="sm" />
                    <div>
                      <p className="text-sm font-medium text-dpcp-navy">{brand.name}</p>
                      <p className="text-xs text-muted-foreground">{brand.people.length} people</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
          {section === "practices" && (
            <Card title="Practices and locations">
              <ul className="space-y-2 text-sm">
                {PRACTICES.map((practice) => (
                  <li key={practice.id} className="flex justify-between gap-3">
                    <span>{practice.name}</span>
                    <span className="text-muted-foreground">{practice.town}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
          {section === "accounts" && (
            <Card title="Connected accounts">
              <p className="text-sm">Gmail · connected</p>
              <p className="text-sm">Slack · {app.ui.slackReconnect ? "reconnect needed" : "connected"}</p>
              <p className="text-sm">Time Doctor · connected</p>
              <p className="mt-2 text-xs text-muted-foreground">Status only. Stored in the team vault. No credentials on this screen.</p>
              {app.ui.slackReconnect && (
                <Button className="mt-3" onClick={app.reconnectSlack}>
                  Reconnect Slack
                </Button>
              )}
            </Card>
          )}
          {section === "brand" && (
            <Card title="Branding and theme">
              <div className="flex flex-wrap gap-3">
                {COPILOT_BRANDS.map((brand) => (
                  <CopilotLogo key={brand.id} id={brand.id} labeled />
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" onClick={() => r3.setTheme("light")}>
                  Light
                </Button>
                <Button variant="outline" onClick={() => r3.setTheme("dark")}>
                  Dark
                </Button>
              </div>
            </Card>
          )}
          {section === "audit" && (
            <Card title="Audit log">
              <ul className="space-y-2 text-sm">
                <li>Oct 20, 10:41 · Nadia Reyes acknowledged the morning note.</li>
                <li>Oct 20, 9:15 · Omar Hale confirmed orientation for Jamie Okonkwo.</li>
                <li>Oct 19, 4:02 · Rowan Blake paused a nightly report. Sample.</li>
              </ul>
            </Card>
          )}
          {section === "privacy" && (
            <Card title="Data and privacy">
              <p className="text-sm">Patient information stays out of this app. Counts and slots only.</p>
              <p className="mt-2 text-sm">Each person sees their own work. A lead sees the department. The executive sees the company. On-time rate is never a ranking.</p>
            </Card>
          )}
          {section === "security" && (
            <Card title="Security">
              <p className="text-sm">Two-factor · on for every company account</p>
              <p className="text-sm">This session · Arizona · started today</p>
              <p className="mt-2 text-xs text-muted-foreground">Status only. Nothing secret is shown on this screen.</p>
            </Card>
          )}
          {section === "billing" && (
            <Card title="Billing and plan">
              <p className="font-heading text-xl text-dpcp-navy">Operating plan</p>
              <p className="mt-1 text-sm">Status · active · sample placeholder</p>
              <p className="mt-2 text-xs text-muted-foreground">No amounts on this screen.</p>
            </Card>
          )}
          {section === "help" && (
            <Card title="Help">
              <p className="text-sm">Ask in the chat box, or open a ticket from your department.</p>
              <Link href="/design" className="mt-2 block text-sm text-dpcp-blue">Design gallery</Link>
              <Link href="/screens" className="mt-2 block text-sm text-dpcp-blue">All screens</Link>
              <Link href="/system" className="mt-2 block text-sm text-dpcp-blue">System health</Link>
              <Link href="/activity" className="mt-2 block text-sm text-dpcp-blue">AI activity</Link>
              <Link href="/admin" className="mt-2 block text-sm text-dpcp-blue">Pause a nightly report</Link>
            </Card>
          )}
        </div>
      </div>
    </PageFrame>
  );
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl bg-white p-5 shadow-[0_8px_30px_rgba(18,59,120,0.05)]">
      <h2 className="font-heading text-xl text-dpcp-navy">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Toggle({ on, set, label }: { on: boolean; set: (value: boolean) => void; label: string }) {
  return (
    <button type="button" className="mt-2 flex w-full items-center justify-between rounded-2xl bg-muted px-3 py-3 text-sm" onClick={() => set(!on)}>
      <span>{label}</span>
      <span className={cn("rounded-full px-2 py-1 text-xs", on ? "bg-[#157a45] text-white" : "bg-white")}>{on ? "On" : "Off"}</span>
    </button>
  );
}
