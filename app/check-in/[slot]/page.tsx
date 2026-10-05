import { CheckinScreen } from "@/components/screens/check-in";
import type { CheckinSlot } from "@/lib/types";

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ slot: "morning" }, { slot: "evening" }];
}

export default async function Page({ params }: { params: Promise<{ slot: string }> }) {
  const { slot } = await params;
  const safe: CheckinSlot = slot === "evening" ? "evening" : "morning";
  return <CheckinScreen slot={safe} />;
}
