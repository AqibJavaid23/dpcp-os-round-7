"use client";

import { useRouter } from "next/navigation";
import { Lockup, ProductFooter } from "@/components/brand";
import { DemoStart } from "@/components/round2/demo-bar";
import { useRound3 } from "@/lib/round3/store";
import { useApp } from "@/lib/store";

export function SignInScreen() {
  const app = useApp();
  const r3 = useRound3();
  const router = useRouter();
  const dark = r3.theme === "dark";

  return (
    <div className={dark ? "flex min-h-dvh flex-col bg-gradient-to-b from-[#0B254B] to-[#123B78] text-white" : "flex min-h-dvh flex-col bg-gradient-to-b from-white to-[#BFD0E8] text-dpcp-navy"}>
      <div className="flex justify-end px-5 pt-5">
        <button type="button" className="text-sm underline" onClick={() => r3.setTheme(dark ? "light" : "dark")}>
          {dark ? "Light" : "Dark"}
        </button>
      </div>
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
        <Lockup tone={dark ? "dark" : "light"} className="origin-center scale-150" />
        <h1 className="font-heading mt-16 text-center text-4xl font-semibold tracking-tight">The operating system for the practice.</h1>
        <p className={dark ? "mt-3 max-w-sm text-center text-sm text-[#BFD0E8]" : "mt-3 max-w-sm text-center text-sm text-[#123B78]/80"}>
          One day, already prepared. Sign in and start on Today.
        </p>
        <button
          type="button"
          onClick={() => {
            app.signIn("employee");
            router.push("/workday");
          }}
          className="mt-10 h-12 w-full max-w-xs rounded-full bg-[#0081CE] text-sm font-medium text-white"
        >
          Sign in
        </button>
        <div className={dark ? "mt-6 text-center [&_button]:text-[#BFD0E8]" : "mt-6 text-center"}>
          <DemoStart />
        </div>
      </main>
      <ProductFooter className={dark ? "mt-0 pb-8 text-[#BFD0E8]" : "mt-0 pb-8"} />
    </div>
  );
}
