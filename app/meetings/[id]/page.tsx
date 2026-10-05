import { MeetingDetailScreen } from "@/components/screens/meetings";
import { createSeed } from "@/lib/seed";

export const dynamicParams = false;

export function generateStaticParams() {
  return createSeed().meetings.map((meeting) => ({ id: meeting.id }));
}

export default async function Page({ params }: PageProps<"/meetings/[id]">) {
  const { id } = await params;
  return <MeetingDetailScreen id={id} />;
}
