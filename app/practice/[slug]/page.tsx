import { PracticeFloor } from "@/components/round2/practice-floor";
import { PRACTICES, practiceBySlug } from "@/lib/round2/data";

export const dynamicParams = false;

export function generateStaticParams() {
  return PRACTICES.map((practice) => ({ slug: practice.slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const practice = practiceBySlug(slug);
  if (!practice) return null;
  return <PracticeFloor practice={practice} />;
}
