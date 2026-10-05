/**
 * One data layer. Names match technical-design-v1 §3 where that doc already has them,
 * plus the round-3 request and assessment objects. Screens read these through the stores.
 */
export type { SopDoc as sop_documents, RoleDoc as roles, SystemDoc as systems, Duty as responsibilities } from "@/lib/round3/knowledge";
export type { Ticket as requests } from "@/lib/round3/tickets";
export type { ResolutionPlan as resolution_plans } from "@/lib/round3/store";
