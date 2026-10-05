"use client";

import Link from "next/link";
import { PageFrame } from "@/components/app-shell";
import { Surface } from "@/components/bits";
import { useApp } from "@/lib/store";

const SCREENS: { href: string; title: string; note: string; who: string }[] = [
  { href: "/workday", title: "Today", note: "The predicted day, then the counts that clear it.", who: "Everyone" },
  { href: "/growth", title: "Professional Growth", note: "Where you fit, orientation, and training.", who: "Everyone" },
  { href: "/people", title: "People & Org", note: "Teams, sub-teams, and individuals.", who: "Everyone" },
  { href: "/ideas", title: "Ideas & Roadmap", note: "What people asked for, and where it stands.", who: "Everyone" },
  { href: "/orientation", title: "Orientation", note: "The mission, then the first day.", who: "Everyone" },
  { href: "/tasks/nadia-mesa", title: "Task detail", note: "Draft, steps, dates, history.", who: "Everyone" },
  { href: "/use-ai", title: "AI", note: "A full workspace. Hand the result to Review or your workday.", who: "Everyone" },
  { href: "/communication", title: "Communication", note: "Ask for the thread. The one that needs you is first.", who: "Everyone" },
  { href: "/review", title: "Review", note: "Approve, ask for a change, see what changed.", who: "Everyone" },
  { href: "/calendar", title: "Calendar", note: "Today, then the rest of the week.", who: "Everyone" },
  { href: "/meetings", title: "Meetings", note: "Mandatory start-of-day and end-of-day check-ins, plus client meetings.", who: "Everyone" },
  { href: "/switch", title: "Switch view", note: "Employee, Lead, Admin, George, Practice Owner.", who: "Preview" },
  { href: "/departments", title: "Departments & Copilots", note: "Departments and the cross-team programs.", who: "Everyone" },
  { href: "/launch", title: "Location Launch Program", note: "Lanes, gates, and deadlines.", who: "Everyone" },
  { href: "/meetings", title: "Commitments ledger", note: "Proof of done, overdue, and make-up.", who: "Everyone" },
  { href: "/usage", title: "AI usage vs output", note: "Cost and tokens beside tasks, on-time, and Time Doctor. No spend cap.", who: "Lead and up" },
  { href: "/meetings/standup", title: "Meeting recap", note: "Confirm action items. One still needs an owner.", who: "Leader" },
  { href: "/week", title: "My week", note: "Private on-time rate, streak, hours saved.", who: "Everyone" },
  { href: "/teams", title: "My Teams", note: "Leader view or member view, per team.", who: "Everyone" },
  { href: "/manage", title: "Manage access", note: "Assign teams. The system owner is locked.", who: "Administrator" },
  { href: "/company", title: "Company", note: "Every department, with its own logo.", who: "George" },
  { href: "/system", title: "System", note: "Health, needs attention, pause AI.", who: "George" },
  { href: "/settings/time-off", title: "Time off", note: "Backups, what routes where, holding reply.", who: "Everyone" },
  { href: "/setup", title: "New employee setup", note: "Green, red, and waiting-on-Jamie checks.", who: "Owner" },
  { href: "/setup/finish", title: "Finish setup", note: "Jamie's first login, five short steps.", who: "New hire" },
  { href: "/onboarding", title: "First week", note: "Practice reply that cannot leave the company.", who: "New hire" },
  { href: "/more", title: "More", note: "Phone menu, including Request or Report.", who: "Everyone" },
  { href: "/practice/saguaro", title: "Practice desk", note: "No login. Tap a name. Lists, requests, and the day.", who: "Practice" },
  { href: "/copilot/insurance", title: "Insurance", note: "All nine modules, initials only.", who: "Insurance" },
  { href: "/owner", title: "Practice owner", note: "Value on top. Balance Assessment below. The one priority.", who: "Owner" },
  { href: "/knowledge", title: "Knowledge", note: "SOPs, roles, systems, and who does what. Sample.", who: "Everyone" },
  { href: "/tickets", title: "Tickets", note: "Every department queue. Same record as a request.", who: "Everyone" },
  { href: "/performance", title: "Performance", note: "Portfolio, practice detail, and alerts.", who: "Lead and up" },
  { href: "/workforce", title: "Workforce", note: "My work, the team, and the daily report.", who: "Everyone" },
  { href: "/training", title: "Training", note: "Paths, a short lesson, and a quiz.", who: "Everyone" },
  { href: "/clients", title: "Clients", note: "Onboarding, tiers, and invoices. Sample pricing.", who: "Lead and up" },
  { href: "/activity", title: "AI activity", note: "What the bots did, and the approvals inbox.", who: "Everyone" },
  { href: "/admin", title: "Admin", note: "People, permissions, audit, devices, and kill switches.", who: "Admin" },
  { href: "/mobile", title: "Mobile", note: "Brief, approvals, practices, tickets, and the team.", who: "Doctors and leads" },
  { href: "/design", title: "Design gallery", note: "Buttons, cards, sheets, and status, in one place.", who: "Design" },
  { href: "/demo", title: "Play the demo", note: "Crown appeal, then the chair.", who: "Everyone" },
];

export function HomeScreen() {
  const app = useApp();
  return (
    <PageFrame title="All screens" lede="Every screen, from the Demo menu. The app itself opens on sign-in.">
      <div className="grid gap-3 sm:grid-cols-2">
        {SCREENS.map((screen) => (
          <Link key={screen.href} href={screen.href} className="no-underline">
            <Surface className="h-full hover:border-dpcp-blue">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-heading text-lg text-dpcp-navy">{screen.title}</h2>
                <span className="text-[11px] text-muted-foreground">{screen.who}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{screen.note}</p>
            </Surface>
          </Link>
        ))}
      </div>
      <button type="button" className="mt-4 text-sm text-dpcp-blue" onClick={app.reopenNotice}>
        Show the notice
      </button>
    </PageFrame>
  );
}
