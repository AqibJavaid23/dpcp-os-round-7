import Link from "next/link";
import { whyThisMatters, chainFor } from "@/lib/chain";
import type { Task } from "@/lib/types";

export function WhyThisMatters({ task }: { task: Task }) {
  return (
    <div className="mt-3 rounded-xl border border-[#d5e4f2] bg-[#f7fbfe] px-3 py-3">
      <p className="text-[11px] tracking-wide text-dpcp-blue uppercase">Why this matters</p>
      <p className="mt-1 text-sm leading-relaxed text-dpcp-navy">{whyThisMatters(task)}</p>
    </div>
  );
}

export function ConnectionChain({ personId, link = true }: { personId: string; link?: boolean }) {
  const steps = chainFor(personId);
  return (
    <section className="rounded-[18px] bg-dpcp-navy-deep px-4 py-4 text-white">
      <p className="text-[11px] tracking-wide text-dpcp-tint uppercase">How your work connects</p>
      <p className="mt-1 text-sm text-dpcp-tint">You, then the team, the department, and the company.</p>
      <ol className="mt-4 grid gap-2 md:grid-cols-4">
        {steps.map((step, index) => (
          <li key={step.level} className="rounded-2xl bg-white/10 px-3 py-3">
            <p className="text-[11px] tracking-wide text-dpcp-tint uppercase">
              {index + 1} · {step.level}
            </p>
            <p className="mt-1 text-sm font-medium">{step.label}</p>
            <p className="mt-1 text-xs leading-relaxed text-dpcp-tint">{step.detail}</p>
          </li>
        ))}
      </ol>
      {link && (
        <Link href="/growth" className="mt-3 inline-block text-sm text-dpcp-wash">
          Growth
        </Link>
      )}
    </section>
  );
}
