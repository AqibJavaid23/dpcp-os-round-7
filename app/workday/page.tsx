"use client";

import { TodayScreen } from "@/components/screens/today";
import { RoleHome } from "@/components/round6/homes";
import { useApp } from "@/lib/store";

export default function Page() {
  const app = useApp();
  if (!app.booted) return null;
  if (app.ui.role === "employee") return <TodayScreen />;
  return <RoleHome />;
}
