"use client";

import { useState } from "react";
import { DepartmentMark } from "@/components/brand";
import { ModelsPanel } from "@/components/models-panel";
import { PageFrame } from "@/components/app-shell";
import { Surface } from "@/components/bits";
import { Button } from "@/components/ui/button";
import { DEPARTMENTS, PEOPLE } from "@/lib/seed";
import { useApp } from "@/lib/store";
import type { DepartmentId, TeamRole } from "@/lib/types";

const SYSTEM_EMAIL = "george@hariribusinessservices.com";

export function ManageScreen() {
  const app = useApp();
  const [personId, setPersonId] = useState("nadia");
  const [departmentId, setDepartmentId] = useState<DepartmentId>("insurance");
  const [teamRole, setTeamRole] = useState<TeamRole>("member");
  const person = PEOPLE.find((p) => p.id === personId) ?? PEOPLE[0];
  const locked = person.id === "george" || person.role === "administrator";

  if (!app.canViewAccess) {
    return (
      <PageFrame title="Manage access">
        <Surface>
          <p className="text-sm">Only an administrator assigns people, teams, and access. In the live product there is no switcher.</p>
        </Surface>
      </PageFrame>
    );
  }

  return (
    <PageFrame title="Manage access" lede="Administrators act under the system owner. The live product has no View as switcher.">
      <Surface className="mb-4 border-dpcp-navy">
        <p className="text-[11px] tracking-wide text-dpcp-blue uppercase">System owner · locked</p>
        <p className="font-heading mt-1 text-lg text-dpcp-navy">System owner</p>
        <p className="mt-1 text-sm">{SYSTEM_EMAIL}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          The single top-level account. It can grant or revoke Administrator, Leader, and Employee, and it sees everything. Nobody else can remove or demote it.
        </p>
      </Surface>

      <Surface className="mb-4">
        <p className="text-[11px] tracking-wide text-dpcp-navy uppercase">Owner's day-to-day account · locked</p>
        <p className="font-heading mt-1 text-lg text-dpcp-navy">George</p>
        <p className="mt-1 text-sm">georgehariri@gmail.com</p>
        <p className="mt-2 text-sm text-muted-foreground">
          This is the George view: his own workday, reviews, and company-wide visibility. It is not the system owner.
        </p>
      </Surface>

      {!app.canEditAccess && (
        <p className="mb-3 text-sm">You can see this. Only an administrator, under the system owner, can change assignments.</p>
      )}

      <div className="mb-4 flex gap-2 overflow-x-auto">
        {PEOPLE.filter((p) => p.id !== "george").map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPersonId(p.id)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm ${personId === p.id ? "bg-dpcp-navy text-white" : "bg-card"}`}
          >
            {p.firstName}
          </button>
        ))}
      </div>

      <Surface>
        <p className="font-heading text-lg text-dpcp-navy">{person.name}</p>
        <p className="text-sm text-muted-foreground">{person.email}</p>
        <p className="mt-1 text-sm">
          Access: {person.role === "administrator" ? "Administrator" : person.role === "leader" ? "Leader" : "Employee"}
          {person.role === "administrator" ? ". Granted by the system owner. This screen cannot change that." : ""}
        </p>
        <div className="mt-4 space-y-3">
          <p className="text-[11px] tracking-wide text-muted-foreground uppercase">Teams</p>
          {DEPARTMENTS.map((dept) => {
            const row = app.model.memberships.find((m) => m.personId === person.id && m.departmentId === dept.id);
            if (!row) return null;
            return (
              <div key={dept.id} className="flex flex-wrap items-center gap-2">
                <DepartmentMark departmentId={dept.id} family={dept.family} name={dept.name} className="h-7" />
                <span className="text-sm">{dept.name}</span>
                <span className="text-sm text-muted-foreground">{row.teamRole === "leader" ? "Leader" : "Member"}</span>
                {app.canEditAccess && !locked && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => app.setMembership(person.id, dept.id, row.teamRole === "leader" ? "member" : "leader")}
                    >
                      Make {row.teamRole === "leader" ? "member" : "leader"}
                    </Button>
                    <Button variant="outline" onClick={() => app.removeMembership(person.id, dept.id)}>
                      Remove
                    </Button>
                  </>
                )}
              </div>
            );
          })}
        </div>
        {app.canEditAccess && !locked && (
          <form
            className="mt-4 flex flex-col gap-2 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              app.setMembership(person.id, departmentId, teamRole);
            }}
          >
            <select
              className="h-11 rounded-lg border border-border bg-white px-2 text-sm"
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value as DepartmentId)}
            >
              {DEPARTMENTS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            <select
              className="h-11 rounded-lg border border-border bg-white px-2 text-sm"
              value={teamRole}
              onChange={(e) => setTeamRole(e.target.value as TeamRole)}
            >
              <option value="member">Member</option>
              <option value="leader">Leader</option>
            </select>
            <Button type="submit">Add to team</Button>
          </form>
        )}
      </Surface>

      {app.canViewAccess && (
        <div className="mt-6">
          <ModelsPanel />
        </div>
      )}

      <div className="mt-6 space-y-3">
        <p className="text-[11px] tracking-wide text-muted-foreground uppercase">All teams</p>
        {DEPARTMENTS.map((dept) => (
          <Surface key={dept.id}>
            <DepartmentMark departmentId={dept.id} family={dept.family} name={dept.name} />
            <p className="mt-2 font-medium">{dept.name}</p>
          </Surface>
        ))}
      </div>
    </PageFrame>
  );
}
