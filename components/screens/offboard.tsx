"use client";

import Link from "next/link";
import { PageFrame } from "@/components/app-shell";
import { Surface } from "@/components/bits";

export function OffboardScreen() {
  return (
    <PageFrame title="Ideas & Roadmap" lede="That page is not in this round.">
      <Surface>
        <p className="text-sm">Suggestions now live on Ideas & Roadmap.</p>
        <Link href="/ideas" className="mt-3 inline-block text-sm text-dpcp-blue">
          Open Ideas & Roadmap
        </Link>
      </Surface>
    </PageFrame>
  );
}
