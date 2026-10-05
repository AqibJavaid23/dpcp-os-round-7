import type { Project, ProjectTemplate } from "@/lib/types";

export function createProjectTemplates(): ProjectTemplate[] {
  return [
    {
      id: "new-location",
      name: "New dental location opening",
      phases: [
        { id: "site", name: "Site search", detail: "Find the room and the neighborhood." },
        { id: "lease", name: "Lease", detail: "Terms a person has to sign." },
        { id: "build", name: "Construction", detail: "Build-out and equipment." },
        { id: "cred", name: "Credentialing", detail: "Payers and licenses." },
        { id: "hire", name: "Hiring", detail: "The people who open the doors." },
        { id: "launch", name: "Launch", detail: "First week of patients." },
      ],
    },
  ];
}

export function createProjects(): Project[] {
  return [
    {
      id: "mesa-verde",
      name: "Mesa Verde Plaza opening",
      templateId: "new-location",
      departmentId: "equipment",
      phases: [
        { id: "site", name: "Site search", detail: "Short list is down to two suites.", ownerId: "theo", due: "Oct 18", status: "done" },
        { id: "lease", name: "Lease", detail: "Differences are with Theo.", ownerId: "theo", due: "Oct 24", status: "now", dependsOn: "Site search" },
        { id: "build", name: "Construction", detail: "Waits on the signed lease.", ownerId: "theo", due: "Nov 20", status: "waiting", dependsOn: "Lease" },
        { id: "cred", name: "Credentialing", detail: "Payer packets.", ownerId: "omar", due: "Nov 6", status: "now", dependsOn: "Lease" },
        { id: "hire", name: "Hiring", detail: "Front desk and a hygienist.", ownerId: "amina", due: "Nov 13", status: "waiting", dependsOn: "Credentialing" },
        { id: "launch", name: "Launch", detail: "First scheduled week.", ownerId: "rowan", due: "Dec 1", status: "waiting", dependsOn: "Hiring" },
      ],
    },
  ];
}
