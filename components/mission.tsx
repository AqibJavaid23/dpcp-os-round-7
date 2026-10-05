import Link from "next/link";

export const MISSION = "Leveraging People + AI to become the #1 company in dental practice management.";
export const MISSION_MEANING = "Being the best at owning and operating dental practices.";

export function MissionImpact({ where = "workday" }: { where?: "workday" | "orientation" }) {
  return (
    <section className="rounded-[18px] bg-dpcp-navy-deep px-4 py-4 text-white">
      <p className="text-[11px] tracking-wide text-dpcp-tint uppercase">People + AI</p>
      <p className="font-heading mt-1 text-lg leading-snug">{MISSION}</p>
      <p className="mt-2 text-sm text-dpcp-tint">{MISSION_MEANING}</p>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="font-heading text-2xl">18</p>
          <p className="text-[11px] text-dpcp-tint">practices helped this month</p>
        </div>
        <div>
          <p className="font-heading text-2xl">3</p>
          <p className="text-[11px] text-dpcp-tint">of yours this week</p>
        </div>
        <div>
          <p className="font-heading text-2xl">1</p>
          <p className="text-[11px] text-dpcp-tint">company milestone</p>
        </div>
      </div>
      <p className="mt-3 text-sm">Every team now starts and ends the day together. Mesa Ridge, Saguaro, and Canyon View felt that this week.</p>
      {where === "workday" && (
        <Link href="/growth" className="mt-3 inline-block text-sm text-dpcp-wash">
          Your growth
        </Link>
      )}
    </section>
  );
}
