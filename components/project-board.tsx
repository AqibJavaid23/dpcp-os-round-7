"use client";

import { Surface } from "@/components/bits";
import { PEOPLE } from "@/lib/seed";
import { useApp } from "@/lib/store";

const STATUS = ["done", "now", "waiting", "blocked"] as const;

export function ProjectBoard() {
  const app = useApp();
  return (
    <section className="mb-10">
      <h2 className="font-heading text-2xl text-dpcp-navy">Projects</h2>
      <p className="mt-1 mb-4 text-sm text-muted-foreground">Shared work. A phase that is now shows up on that person's Today.</p>
      {app.model.projects.map((project) => (
        <Surface key={project.id} className="mb-4">
          <p className="text-lg font-medium text-dpcp-navy">{project.name}</p>
          <ul className="mt-4 space-y-4">
            {project.phases.map((phase) => (
              <li key={phase.id} className="grid gap-2 border-t border-[#f0f2f5] pt-3 md:grid-cols-[1.2fr_1fr_0.7fr_0.8fr]">
                <div>
                  <input
                    defaultValue={phase.name}
                    aria-label="Phase name"
                    className="w-full bg-transparent text-sm font-medium text-dpcp-navy outline-none"
                    onBlur={(e) => app.updateProjectPhase(project.id, phase.id, { name: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">{phase.detail}{phase.dependsOn ? ` · after ${phase.dependsOn}` : ""}</p>
                </div>
                <select
                  className="h-10 rounded-xl bg-[#f4f6f8] px-2 text-sm"
                  value={phase.ownerId}
                  onChange={(e) => app.updateProjectPhase(project.id, phase.id, { ownerId: e.target.value })}
                  aria-label="Owner"
                >
                  {PEOPLE.map((person) => (
                    <option key={person.id} value={person.id}>{person.name}</option>
                  ))}
                </select>
                <input
                  defaultValue={phase.due}
                  aria-label="Due"
                  className="h-10 rounded-xl bg-[#f4f6f8] px-2 text-sm"
                  onBlur={(e) => app.updateProjectPhase(project.id, phase.id, { due: e.target.value })}
                />
                <select
                  className="h-10 rounded-xl bg-[#f4f6f8] px-2 text-sm"
                  value={phase.status}
                  onChange={(e) => app.updateProjectPhase(project.id, phase.id, { status: e.target.value as (typeof STATUS)[number] })}
                  aria-label="Status"
                >
                  {STATUS.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </li>
            ))}
          </ul>
        </Surface>
      ))}
      {app.model.projectTemplates.map((template) => (
        <Surface key={template.id}>
          <p className="text-sm font-medium text-dpcp-navy">Template · {template.name}</p>
          <p className="mt-1 mb-3 text-xs text-muted-foreground">Change a phase name here. New projects can follow it.</p>
          <div className="space-y-2">
            {template.phases.map((phase) => (
              <input
                key={phase.id}
                defaultValue={phase.name}
                aria-label={`${phase.name} template name`}
                className="h-10 w-full rounded-xl bg-[#f4f6f8] px-3 text-sm"
                onBlur={(e) => app.updateTemplatePhase(template.id, phase.id, e.target.value)}
              />
            ))}
          </div>
        </Surface>
      ))}
    </section>
  );
}
