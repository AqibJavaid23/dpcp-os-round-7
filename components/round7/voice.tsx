"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const PROMPTS = [
  "Good morning. What did you finish since yesterday?",
  "What is on your list today?",
  "Anything blocked, and who can unblock it?",
  "That is enough. I will write the summary.",
];

export function VoiceCall({ title, onClose }: { title: string; onClose: () => void }) {
  const [seconds, setSeconds] = useState(0);
  const [step, setStep] = useState(0);
  const [ended, setEnded] = useState(false);
  const [mic, setMic] = useState(true);

  useEffect(() => {
    if (ended) return;
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [ended]);

  useEffect(() => {
    if (ended) return;
    const timer = window.setInterval(() => setStep((value) => Math.min(value + 1, PROMPTS.length - 1)), 4000);
    return () => window.clearInterval(timer);
  }, [ended]);

  const clock = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-dpcp-navy-deep text-white" role="dialog" aria-label={title}>
      <div className="flex items-center justify-between px-5 py-4">
        <p className="text-sm text-white/70">Voice session</p>
        <p className="font-heading text-lg">{clock}</p>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <p className="text-xs tracking-[0.16em] text-white/60 uppercase">{title}</p>
        {ended ? (
          <>
            <h2 className="font-heading mt-4 text-3xl">Summary</h2>
            <ul className="mt-6 max-w-md space-y-2 text-left text-sm text-white/90">
              <li>Finished the Lakeview filing list.</li>
              <li>Today: the Mesa Verde reply, then the portal check.</li>
              <li>Blocked: Imran Cole is still waiting on a scan from the office.</li>
            </ul>
            <Button className="mt-8" onClick={onClose}>Done</Button>
          </>
        ) : (
          <>
            <h2 className="font-heading mt-4 max-w-lg text-3xl leading-tight">{PROMPTS[step]}</h2>
            <div className="mt-10 flex h-16 items-end gap-1" aria-hidden>
              {Array.from({ length: 18 }).map((_, index) => (
                <span
                  key={index}
                  className="w-1.5 rounded-full bg-white/80"
                  style={{
                    height: mic ? `${12 + ((index * 17 + seconds * 13) % 48)}px` : "8px",
                    opacity: mic ? 1 : 0.35,
                  }}
                />
              ))}
            </div>
            <p className="mt-4 text-sm text-white/70">{mic ? "Microphone on. Speak when you are ready." : "Microphone muted."}</p>
            <div className="mt-8 flex gap-3">
              <button type="button" className="min-h-14 rounded-full bg-white/15 px-5 text-sm" onClick={() => setMic((value) => !value)}>
                {mic ? "Mute" : "Unmute"}
              </button>
              <button type="button" className="min-h-14 rounded-full bg-[#c4322b] px-5 text-sm" onClick={() => setEnded(true)}>
                End call
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
