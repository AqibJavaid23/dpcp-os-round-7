import { DirectoryScreen } from "@/components/screens/directory";
import { PEOPLE } from "@/lib/seed";

export const dynamicParams = false;

export function generateStaticParams() {
  return PEOPLE.map((person) => ({ id: person.id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DirectoryScreen personId={id} />;
}
