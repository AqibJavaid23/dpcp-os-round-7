"use client";

import { useRouter } from "next/navigation";
import { useRound2 } from "@/lib/round2/context";

export default function Page() {
  const r2 = useRound2();
  const router = useRouter();
  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-6">
      <p className="text-xs tracking-[0.18em] text-dpcp-blue uppercase">Two requests</p>
      <h1 className="font-heading mt-2 text-4xl text-dpcp-navy">Play the demo</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Maria at Saguaro asks about a denied crown. Insurance drafts the appeal, Nadia reviews it, Omar signs it, and Maria sees it done. Then Casey at Copper Canyon reports a chair, and Equipment sets a visit.
      </p>
      <button
        type="button"
        className="mt-8 min-h-12 rounded-full bg-dpcp-navy px-5 text-white"
        onClick={() => {
          r2.startDemo();
          router.push("/practice/saguaro/");
        }}
      >
        Start with Maria
      </button>
    </main>
  );
}
