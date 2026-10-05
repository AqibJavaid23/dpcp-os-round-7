"use client";

import { useRouter } from "next/navigation";
import { useRound2 } from "@/lib/round2/context";
import { useApp } from "@/lib/store";

const TITLES = [
  "",
  "Maria is at the Saguaro desk",
  "She describes the denied crown",
  "Insurance has it. AI works first.",
  "The draft is on Nadia's Today",
  "Open it in Review",
  "Leave a note. AI revises.",
  "Nadia approves v2",
  "Omar signs because it is $2,860",
  "Maria sees Done",
  "Maria rates the request",
  "Casey reports the Op 7 chair",
  "Theo's desk sets Thursday",
  "Copper Canyon sees the visit",
];

export function DemoBar() {
  const r2 = useRound2();
  const app = useApp();
  const router = useRouter();

  if (!r2.demoOn) return null;
  return (
    <div className="fixed inset-x-3 bottom-20 z-40 rounded-3xl bg-[#1c2430] px-4 py-3 text-sm text-white shadow-lg lg:bottom-4 lg:left-64 lg:right-auto lg:w-[420px]">
      <p className="text-xs text-white/60">Play the demo · {r2.demoStep} / 13</p>
      <p className="mt-1">{TITLES[r2.demoStep] ?? "Done"}</p>
      <div className="mt-2 flex gap-3">
        <button
          type="button"
          className="min-h-10 rounded-full bg-white px-3 text-[#1c2430]"
          onClick={() => {
            const leaving = r2.demoStep;
            const appeal = r2.requests.find((req) => req.kind === "appeal");
            if (leaving === 2 && !appeal) {
              r2.submitRequest({
                practiceId: "saguaro",
                authorName: "Maria Alvarez",
                category: "Insurance/billing",
                text: "Patient says insurance denied her crown, can you check?",
                urgency: "Today",
              });
            }
            if (leaving === 4 && appeal) r2.openReview(appeal.id);
            if (leaving === 6 && appeal && appeal.stage === "review") {
              r2.commentAppeal(appeal.id, "Cite the perio history and the date of the prior crown.");
            }
            if (leaving === 7 && appeal && appeal.stage !== "lead" && appeal.stage !== "done") r2.approveAppeal(appeal.id);
            if (leaving === 8 && appeal && appeal.stage === "lead") r2.approveLead(appeal.id);
            const repair = r2.requests.find((req) => req.kind === "repair");
            if (leaving === 10 && appeal && appeal.stage === "done" && !appeal.rating) r2.rateRequest(appeal.id, 4, "Clear and fast.");
            if (leaving === 12 && repair && repair.stage !== "done") r2.completeRepair(repair.id);
            if (leaving === 11 && !repair) {
              r2.submitRequest({
                practiceId: "copper",
                authorName: "Casey Nguyen",
                category: "Equipment",
                text: "Op 7 chair won't recline",
                urgency: "Today",
              });
            }
            const next = r2.nextDemo();
            if (!next) return;
            if (next.action === "as-nadia") app.signIn("employee");
            if (next.action === "as-omar") app.signIn("leader");
            if (next.action === "as-george") app.signIn("george");
            window.setTimeout(() => router.push(next.href), next.action ? 60 : 0);
          }}
        >
          Next
        </button>
        <button type="button" className="text-white/70" onClick={r2.stopDemo}>
          Close
        </button>
      </div>
    </div>
  );
}

export function DemoStart() {
  const r2 = useRound2();
  const router = useRouter();
  return (
    <button
      type="button"
      className="mt-4 text-sm text-dpcp-blue"
      onClick={() => {
        r2.startDemo();
        router.push("/practice/saguaro/");
      }}
    >
      Play the demo
    </button>
  );
}
