import { TaskDetailScreen } from "@/components/screens/task-detail";
import { createSeed } from "@/lib/seed";

export const dynamicParams = false;

export function generateStaticParams() {
  return createSeed().tasks.map((task) => ({ id: task.id }));
}

export default async function Page({ params }: PageProps<"/tasks/[id]">) {
  const { id } = await params;
  return <TaskDetailScreen id={id} />;
}
