"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { HbsFooter, Lockup } from "@/components/brand";
import { PageAsk } from "@/components/page-ask";
import { DemoBar } from "@/components/round2/demo-bar";
import { viewLabel } from "@/components/round4/experience";
import { CopilotLogo } from "@/components/round6/marks";
import { CLOCK } from "@/lib/brand";
import { copilotForDepartment } from "@/lib/round6/copilots";
import { mainTabsFor, ROLE_META } from "@/lib/round6/nav";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

const TITLES: Record<string, string> = {
  "/today": "Today",
  "/workday": "Today",
  "/growth": "Professional Growth",
  "/orientation": "Orientation",
  "/messages": "Communication",
  "/communication": "Communication",
  "/review": "Review",
  "/meetings": "Meetings",
  "/usage": "AI usage vs output",
  "/check-in": "Check-in",
  "/chat": "AI",
  "/use-ai": "AI",
  "/calendar": "Calendar",
  "/week": "My week",
  "/team": "My Teams",
  "/teams": "My Teams",
  "/company": "Company",
  "/decisions": "Decisions",
  "/system": "System",
  "/manage": "Manage access",
  "/settings": "Settings",
  "/settings/time-off": "Time off",
  "/setup": "New employee setup",
  "/setup/finish": "Finish setup",
  "/onboarding": "First week",
  "/more": "More",
  "/screens": "All screens",
  "/ideas": "Ideas & Roadmap",
  "/people": "People",
  "/offboard": "Ideas",
  "/switch": "Switch view",
  "/departments": "Departments & Copilots",
  "/launch": "Location Launch Program",
  "/outreach": "Outreach",
  "/portals": "Portal access",
  "/kit": "Standard kit",
  "/assets": "Asset register",
  "/plan-check": "Plan check",
  "/schedule": "Care team flow",
  "/study": "Time study",
  "/recare": "Recare",
  "/owner": "Home",
  "/owner-tickets": "Tickets",
  "/desk": "Practice desk",
  "/knowledge": "Knowledge",
  "/tickets": "Tickets",
  "/performance": "Performance",
  "/workforce": "Workforce",
  "/training": "Training",
  "/clients": "Clients",
  "/admin": "Admin",
  "/activity": "AI activity",
  "/mobile": "Mobile",
  "/design": "Design",
  "/demo": "Play the demo",
  "/practice": "Practice desk",
  "/copilot": "Department",
};

function navActive(pathname: string, href: string) {
  if (href === "/workday") return pathname === "/workday" || pathname === "/today" || pathname.startsWith("/tasks");
  if (href === "/owner") return pathname === "/owner";
  if (href === "/communication") return pathname === "/communication" || pathname === "/messages";
  if (href === "/use-ai") return pathname === "/use-ai" || pathname === "/chat";
  if (href === "/teams") return pathname === "/teams" || pathname === "/team";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const app = useApp();
  const isLogin = pathname === "/";
  const isPractice = pathname.startsWith("/practice") || pathname.startsWith("/demo") || pathname.startsWith("/desk");
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scroller.current;
    if (!el || typeof window === "undefined") return;
    const key = `dpcp-scroll:${pathname}`;
    const saved = window.sessionStorage.getItem(key);
    if (saved) el.scrollTop = Number(saved);
    const remember = () => window.sessionStorage.setItem(key, String(el.scrollTop));
    el.addEventListener("scroll", remember, { passive: true });
    return () => {
      remember();
      el.removeEventListener("scroll", remember);
    };
  }, [pathname]);

  if (app.booted && !app.signedIn && !isLogin && !isPractice) {
    app.signIn("employee");
  }

  useEffect(() => {
    if (!app.booted) return;
    if (app.signedIn && isLogin) router.replace(app.ui.role === "owner" ? "/owner" : "/workday");
  }, [app.booted, app.signedIn, isLogin, app.ui.role, router]);

  if (isPractice) {
    return (
      <div className="min-h-dvh bg-background text-foreground">
        {children}
        <DemoMenu />
        <DemoBar />
      </div>
    );
  }

  if (!isLogin && !app.booted) {
    return <div className="min-h-dvh bg-background" />;
  }

  if (!app.signedIn || isLogin) {
    return (
      <div className="min-h-dvh bg-background text-foreground">
        {isLogin ? children : null}
        <DemoMenu />
        <DemoBar />
      </div>
    );
  }

  const title =
    TITLES[pathname] ??
    (pathname.startsWith("/tasks")
      ? "Task"
      : pathname.startsWith("/meetings")
        ? "Meeting"
        : pathname.startsWith("/check-in")
          ? "Check-in"
          : pathname.startsWith("/copilot")
        ? "Department"
        : pathname.startsWith("/practice")
          ? "Practice desk"
          : "DPCP OS");
  const zone = app.viewer.tz;
  const accent = ROLE_META[app.ui.role].accent;
  const tabs = mainTabsFor(app.ui.role, app.viewer.departmentId);
  const copilot = copilotForDepartment(app.viewer.departmentId);

  return (
    <div className="flex h-dvh flex-col bg-background text-foreground" style={{ borderTop: `4px solid ${accent}` }}>
      <header className="z-30 shrink-0 border-b border-border bg-white">
        <div className="flex h-14 items-center gap-3 px-4 lg:px-6">
          <Link href={app.ui.role === "owner" ? "/owner" : "/workday"} className="flex shrink-0 items-center gap-2" aria-label="Dental Practice Copilot OS">
            <Lockup />
            <CopilotLogo id={copilot.id} size="sm" />
          </Link>
          <nav className="hidden items-center gap-1 lg:flex">
            {tabs.map(([href, label]) => {
              const on = navActive(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "rounded-lg px-2.5 py-1.5 text-sm no-underline",
                    on ? "font-semibold" : "text-muted-foreground hover:text-foreground"
                  )}
                  style={on ? { color: accent } : undefined}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <Link href="/switch" className="rounded-full px-2.5 py-1 text-[11px] font-medium no-underline" style={{ background: "#E7EEF6", color: accent }}>
              {viewLabel(app.ui.role)}
            </Link>
            <p className="hidden text-xs text-muted-foreground sm:block">
              {CLOCK.dateLine} · {CLOCK.time} {zone}
            </p>
            <p className="text-xs text-muted-foreground sm:hidden">{CLOCK.time}</p>
            <details className="relative">
              <summary className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-full bg-dpcp-navy text-xs font-medium text-white">
                {app.viewer.initials}
              </summary>
              <div className="absolute right-0 z-40 mt-2 w-52 rounded-xl border border-border bg-card p-2 text-sm shadow-lg">
                <p className="px-2 py-1 text-xs text-muted-foreground">{app.viewer.name}</p>
                <Link className="block rounded-lg px-2 py-2 no-underline hover:bg-muted" href="/settings">
                  Settings
                </Link>
                <Link className="block rounded-lg px-2 py-2 no-underline hover:bg-muted" href="/more">
                  Help
                </Link>
                <button
                  type="button"
                  className="block w-full rounded-lg px-2 py-2 text-left hover:bg-muted"
                  onClick={() => {
                    app.signOut();
                    router.push("/");
                  }}
                >
                  Sign out
                </button>
              </div>
            </details>
          </div>
        </div>
      </header>

      {app.banner && (
        <div
          className={cn(
            "px-4 py-2 text-sm lg:px-6",
            app.banner.tone === "amber" ? "bg-status-amber-bg text-status-amber" : "bg-[#eceff3] text-foreground"
          )}
        >
          <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-3">
            <p>{app.banner.text}</p>
            {app.banner.action && (
              <button type="button" className="shrink-0 font-medium underline" onClick={app.reconnectSlack}>
                {app.banner.action}
              </button>
            )}
          </div>
        </div>
      )}

      <div className="mx-auto flex min-h-0 w-full max-w-[1540px] flex-1">
        <div ref={scroller} className="min-h-0 min-w-0 flex-1 overflow-y-auto">
          <div className="px-4 pt-4 lg:hidden">
            <h1 className="font-heading text-2xl font-semibold text-dpcp-navy">{title}</h1>
          </div>
          <div className="px-4 pb-8 lg:px-6">{children}</div>
        </div>
      </div>

      <PageAsk />
      <DemoMenu />
      <DemoBar />

      <nav className="flex h-14 shrink-0 gap-1 overflow-x-auto border-t border-border bg-white px-2 lg:hidden">
        {tabs.map(([href, label]) => {
          const on = navActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex shrink-0 items-center px-3 text-[13px] no-underline",
                on ? "font-semibold" : "text-muted-foreground"
              )}
              style={on ? { color: accent } : undefined}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function DemoMenu() {
  const app = useApp();
  const pathname = usePathname();
  const dock = pathname === "/" ? "bottom-4" : "bottom-20 lg:bottom-4";
  if (app.ui.reviewHidden) {
    return (
      <button
        type="button"
        className={cn("fixed left-3 z-30 rounded-full bg-white/80 px-2.5 py-1 text-[11px] text-muted-foreground shadow-sm", dock)}
        onClick={() => app.setReviewHidden(false)}
      >
        Demo
      </button>
    );
  }
  return (
    <div className={cn("fixed left-3 z-40 w-56 rounded-3xl bg-white p-3 text-xs shadow-[0_16px_40px_rgba(18,59,120,0.14)]", dock)}>
      <div className="mb-2 flex items-center justify-between">
        <p className="font-medium text-dpcp-navy">Demo</p>
        <button type="button" className="text-muted-foreground" onClick={() => app.setReviewHidden(true)}>
          Hide
        </button>
      </div>
      <p className="text-muted-foreground">Switch view is in More.</p>
      <label className="mt-2 flex items-center gap-2 text-muted-foreground">
        State
        <select
          className="h-7 flex-1 rounded-lg bg-[#f4f6f8] px-1"
          value={app.ui.screenState}
          onChange={(e) => app.setScreenState(e.target.value as typeof app.ui.screenState)}
        >
          <option value="ready">Ready</option>
          <option value="empty">Empty</option>
          <option value="loading">Loading</option>
          <option value="error">Error</option>
          <option value="offline">Offline</option>
          <option value="paused">AI paused</option>
        </select>
      </label>
      <div className="mt-2 flex flex-wrap gap-2">
        <button type="button" className="text-dpcp-blue" onClick={app.reopenNotice}>Notice</button>
        <button type="button" className="text-dpcp-blue" onClick={() => app.setSlackReconnect(!app.ui.slackReconnect)}>Slack</button>
        <button type="button" className="text-dpcp-blue" onClick={app.reset}>Reset</button>
        <Link href="/screens" className="text-dpcp-blue">All screens</Link>
      </div>
    </div>
  );
}

export function PageFrame({
  title,
  lede,
  children,
}: {
  title?: string;
  lede?: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-[1200px]">
      {title && (
        <header className="mb-4 hidden lg:block">
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-dpcp-navy">{title}</h1>
          {lede && <p className="mt-2 max-w-xl text-base text-muted-foreground">{lede}</p>}
        </header>
      )}
      {lede && <p className="mb-3 text-sm text-muted-foreground lg:hidden">{lede}</p>}
      {children}
      <HbsFooter />
    </div>
  );
}
