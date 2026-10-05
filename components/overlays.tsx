"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CLOCK } from "@/lib/brand";
import { screenTitleFor } from "@/lib/evolve";
import { useApp } from "@/lib/store";

export function AckDialog() {
  return null;
}

export function FeedbackSheet() {
  const app = useApp();
  const pathname = usePathname();
  const title = screenTitleFor(pathname);
  const [mode, setMode] = useState<"text" | "voice">("text");
  const [body, setBody] = useState("");
  const [listening, setListening] = useState(false);
  const duplicate = /due date|phone|progress/i.test(body);

  return (
    <Sheet open={app.ui.feedbackOpen} onOpenChange={app.setFeedbackOpen}>
      <SheetContent side="right" className="w-full sm:max-w-[470px]">
        <SheetHeader>
          <SheetTitle className="font-heading text-xl text-dpcp-navy">Feedback on DPCP OS</SheetTitle>
        </SheetHeader>
        <form
          className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-6"
          onSubmit={(e) => {
            e.preventDefault();
            if (!body.trim()) return;
            app.submitIdea({ body, mode, screen: pathname, screenTitle: title });
            setBody("");
            setListening(false);
          }}
        >
          <p className="text-sm text-muted-foreground">
            The people who use this decide what it becomes. Say what is in the way, or what you want next.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Button type="button" variant={mode === "text" ? "default" : "outline"} onClick={() => setMode("text")}>
              Text
            </Button>
            <Button type="button" variant={mode === "voice" ? "default" : "outline"} onClick={() => setMode("voice")}>
              Voice
            </Button>
          </div>
          {mode === "voice" && (
            <div className="rounded-xl bg-dpcp-navy-deep px-4 py-4 text-white">
              <p className="text-[11px] tracking-wide text-dpcp-tint uppercase">{listening ? "Listening" : "Voice note"}</p>
              <p className="mt-2 text-sm text-dpcp-tint">
                {listening ? "Say it. This prototype writes the transcript when you stop." : "A short note. You can fix the words before it sends."}
              </p>
              <Button
                type="button"
                className="mt-3"
                variant="outline"
                onClick={() => {
                  if (listening) {
                    setListening(false);
                    if (!body.trim()) {
                      setBody("The phone card should show the original due date next to today. I keep missing that they differ.");
                    }
                  } else {
                    setListening(true);
                  }
                }}
              >
                {listening ? "Stop and transcribe" : "Start voice note"}
              </Button>
            </div>
          )}
          <label className="text-sm">
            {mode === "voice" ? "Transcript" : "What should we know?"}
            <textarea
              required
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="mt-1 min-h-28 w-full rounded-xl border border-border p-3 text-sm"
            />
          </label>
          <div className="rounded-xl bg-muted p-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">Captured with this note</p>
            <p className="mt-1">Screen: {title} · {pathname}</p>
            <p>Who: {app.viewer.name} · {app.ui.role}</p>
            <p>Time: {CLOCK.dateLine} · {CLOCK.time} {app.viewer.tz}</p>
            <p className="mt-2">No patient information. If a screen has any, leave it out of the note.</p>
          </div>
          {duplicate && (
            <p className="rounded-xl bg-dpcp-wash p-3 text-sm text-dpcp-navy">
              This matches a theme the Architect is already reading. Your note still goes on the board.
            </p>
          )}
          {app.offline && <p className="text-sm">Saved on this device. It sends when you are back.</p>}
          <Button type="submit">Send to the board</Button>
          <Link href="/ideas" className="text-sm text-dpcp-blue" onClick={() => app.setFeedbackOpen(false)}>
            Ideas & Roadmap
          </Link>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export function ToastHost() {
  const app = useApp();
  if (!app.ui.toast) return null;
  return (
    <div className="fixed bottom-24 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-3 rounded-full bg-dpcp-navy-deep px-4 py-2 text-sm text-white shadow-lg lg:bottom-8">
      <span>{app.ui.toast.text}</span>
      {app.ui.toast.undo && (
        <button type="button" className="font-medium text-dpcp-wash" onClick={app.undo}>
          Undo
        </button>
      )}
    </div>
  );
}
