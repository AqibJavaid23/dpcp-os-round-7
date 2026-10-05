"use client";

import { useState } from "react";

export function AskBar({
  prompts,
  onAsk,
}: {
  prompts: string[];
  onAsk: (query: string) => void;
}) {
  const [value, setValue] = useState("");

  function submit(query: string) {
    const next = query.trim();
    setValue(next);
    onAsk(next);
  }

  return (
    <form
      className="mb-4"
      onSubmit={(e) => {
        e.preventDefault();
        submit(value);
      }}
    >
      <label className="block">
        <span className="sr-only">Ask in plain words</span>
        <input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (!e.target.value.trim()) onAsk("");
          }}
          placeholder="Ask in plain words…"
          className="h-12 w-full rounded-2xl border border-dpcp-tint bg-white px-4 text-sm outline-none focus:border-dpcp-blue"
        />
      </label>
      <div className="mt-2 flex flex-wrap gap-2">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => submit(prompt)}
            className="rounded-full bg-dpcp-wash px-3 py-1.5 text-left text-xs text-dpcp-navy"
          >
            {prompt}
          </button>
        ))}
      </div>
    </form>
  );
}
