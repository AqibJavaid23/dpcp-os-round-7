import { CopilotScreen } from "@/components/round2/copilot-view";
import { COPILOTS } from "@/lib/round2/data";

export const dynamicParams = false;

export function generateStaticParams() {
  return COPILOTS.map((copilot) => ({ id: copilot.id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CopilotScreen copilotId={id} />;
}
