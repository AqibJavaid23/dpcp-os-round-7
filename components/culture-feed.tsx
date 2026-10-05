"use client";

import { useState } from "react";
import Link from "next/link";
import { PillarTag, PillarTrio } from "@/components/pillars";
import { Surface } from "@/components/bits";
import { Button } from "@/components/ui/button";
import { PILLARS, REACTION_LABEL, cultureKindLabel, suggestPillar } from "@/lib/culture";
import { PEOPLE } from "@/lib/seed";
import { useApp } from "@/lib/store";
import type { CulturePost, Pillar } from "@/lib/types";
import { cn } from "@/lib/utils";

function nameOf(id?: string) {
  if (!id || id === "ai") return "DPCP OS";
  return PEOPLE.find((p) => p.id === id)?.name ?? id;
}

export function countsFor(personId: string, posts: CulturePost[]) {
  const mine = posts.filter((post) => post.aboutId === personId);
  return {
    intelligence: mine.filter((p) => p.pillar === "intelligence").length,
    energy: mine.filter((p) => p.pillar === "energy").length,
    integrity: mine.filter((p) => p.pillar === "integrity").length,
    total: mine.length,
  };
}

export function TodaysWin({ inMeeting = false }: { inMeeting?: boolean }) {
  const app = useApp();
  const post = app.model.culture.find((item) => item.featured) ?? app.model.culture.find((item) => item.kind === "win");
  if (!post) return null;
  return (
    <div className="mb-4 overflow-hidden rounded-[18px] border border-[#d5e4f2] bg-[#f7fbfe]">
      <div className="border-b border-[#d5e4f2] px-4 py-3">
        <p className="text-[11px] tracking-wide text-dpcp-blue uppercase">Today's win</p>
        <p className="mt-1 text-sm text-dpcp-navy">
          {inMeeting ? "Start here, then the check-in." : "The company is celebrating this before the rest of the day."}
        </p>
      </div>
      <div className="px-4 py-4">
        <PillarTag pillar={post.pillar} />
        <h2 className="font-heading mt-3 text-xl text-dpcp-navy">{post.title}</h2>
        <p className="mt-2 text-sm leading-relaxed">{post.body}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          {nameOf(post.aboutId)} · {PILLARS[post.pillar].line}. {PILLARS[post.pillar].definition}
        </p>
        <Link href="/communication" className="mt-3 inline-block text-sm text-dpcp-blue">
          Open Wins & Culture
        </Link>
      </div>
    </div>
  );
}

export function PillarSpotlight() {
  const app = useApp();
  const pillars = (Object.keys(PILLARS) as Pillar[]).map((pillar) => {
    const counts = new Map<string, number>();
    for (const post of app.model.culture) {
      if (post.pillar !== pillar || !post.aboutId) continue;
      counts.set(post.aboutId, (counts.get(post.aboutId) ?? 0) + 1);
    }
    const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
    return { pillar, personId: top?.[0], count: top?.[1] ?? 0 };
  });
  return (
    <Surface className="mb-4 bg-[#fbfcfe]">
      <p className="text-[11px] tracking-wide text-dpcp-navy uppercase">October spotlight</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Recognitions and Friday appreciations this month. This is not a performance score.
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {pillars.map((row) => (
          <div key={row.pillar} className="rounded-xl p-3" style={{ background: PILLARS[row.pillar].soft }}>
            <PillarTag pillar={row.pillar} />
            <p className="mt-2 text-xs leading-relaxed text-dpcp-navy">{PILLARS[row.pillar].definition}</p>
            <p className="mt-2 font-medium text-dpcp-navy">{row.personId ? nameOf(row.personId) : "No one yet"}</p>
            <p className="text-xs text-muted-foreground">{row.count} {row.count === 1 ? "recognition" : "recognitions"}</p>
          </div>
        ))}
      </div>
    </Surface>
  );
}

export function PillarCounts({ personId }: { personId: string }) {
  const app = useApp();
  const counts = countsFor(personId, app.model.culture);
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {(Object.keys(PILLARS) as Pillar[]).map((pillar) => (
        <span key={pillar} className="inline-flex items-center gap-2">
          <PillarTag pillar={pillar} />
          <span className="text-sm text-dpcp-navy">{counts[pillar]}</span>
        </span>
      ))}
    </div>
  );
}

function PostCard({ post }: { post: CulturePost }) {
  const app = useApp();
  const [draft, setDraft] = useState("");
  return (
    <article className="rounded-[18px] border border-[#d5e4f2] bg-white p-4">
      <div className="flex flex-wrap items-center gap-2">
        <PillarTag pillar={post.pillar} />
        <span className="text-[11px] tracking-wide text-muted-foreground uppercase">{cultureKindLabel(post.kind)}</span>
        <span className="text-[11px] text-muted-foreground">{post.at}</span>
      </div>
      <h3 className="font-heading mt-2 text-lg text-dpcp-navy">{post.title}</h3>
      <p className="mt-1 text-sm leading-relaxed">{post.body}</p>
      <p className="mt-2 text-xs text-muted-foreground">
        {post.aboutId ? nameOf(post.aboutId) : "The company"} · from {nameOf(post.authorId)} · {PILLARS[post.pillar].definition}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {(Object.keys(REACTION_LABEL) as (keyof typeof REACTION_LABEL)[]).map((kind) => {
          const count = post.reactions.filter((r) => r.kind === kind).length;
          const mine = post.reactions.some((r) => r.personId === app.viewer.id && r.kind === kind);
          return (
            <button
              key={kind}
              type="button"
              onClick={() => app.reactToCulture(post.id, kind)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs",
                mine ? "border-dpcp-blue bg-[#e5f4fc] text-dpcp-navy" : "border-border text-muted-foreground"
              )}
            >
              {REACTION_LABEL[kind]} {count > 0 ? count : ""}
            </button>
          );
        })}
      </div>
      {post.comments.length > 0 && (
        <ul className="mt-3 space-y-2">
          {post.comments.map((comment) => (
            <li key={comment.id} className="text-sm">
              <span className="font-medium text-dpcp-navy">{nameOf(comment.authorId)}</span> {comment.text}
            </li>
          ))}
        </ul>
      )}
      <form
        className="mt-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          app.commentOnCulture(post.id, draft);
          setDraft("");
        }}
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Say something kind and specific"
          className="h-10 flex-1 rounded-xl border border-border px-3 text-sm outline-none focus:border-dpcp-blue"
          aria-label="Comment"
        />
        <Button type="submit" variant="outline">
          Comment
        </Button>
      </form>
    </article>
  );
}

function FridayAppreciation() {
  const app = useApp();
  const [aboutId, setAboutId] = useState("faisal");
  const [text, setText] = useState("");
  const [pillar, setPillar] = useState<Pillar>("energy");
  return (
    <Surface className="mb-4">
      <p className="text-[11px] tracking-wide text-dpcp-blue uppercase">Friday appreciation</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Friday is the day. Leave one early if you want. It is pillar-tagged and it feeds the monthly spotlight.
      </p>
      <form
        className="mt-3 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          app.addAppreciation(aboutId, text, pillar);
          setText("");
        }}
      >
        <select
          className="h-11 w-full rounded-lg border border-border bg-white px-2 text-sm"
          value={aboutId}
          onChange={(e) => setAboutId(e.target.value)}
          aria-label="Who you appreciate"
        >
          {PEOPLE.filter((p) => p.id !== app.viewer.id).map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What did they do this week?"
          className="min-h-20 w-full rounded-xl border border-border p-3 text-sm outline-none focus:border-dpcp-blue"
        />
        <div className="flex flex-wrap gap-2">
          {(Object.keys(PILLARS) as Pillar[]).map((key) => (
            <button key={key} type="button" onClick={() => setPillar(key)} className={cn("rounded-full", pillar === key && "ring-2 ring-dpcp-blue ring-offset-2")}>
              <PillarTag pillar={key} />
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">{PILLARS[pillar].definition}</p>
        <Button type="submit" variant="outline">
          Post Friday appreciation
        </Button>
      </form>
    </Surface>
  );
}

function CultureIdeaBox() {
  const app = useApp();
  const [text, setText] = useState("");
  return (
    <Surface className="mb-4">
      <p className="text-[11px] tracking-wide text-muted-foreground uppercase">Suggest a culture idea</p>
      <p className="mt-1 text-sm text-muted-foreground">A ritual, a welcome, a way of closing the week. Your lead reads these.</p>
      <form
        className="mt-3 space-y-2"
        onSubmit={(e) => {
          e.preventDefault();
          app.suggestCultureIdea(text);
          setText("");
        }}
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What should we try?"
          className="min-h-20 w-full rounded-xl border border-border p-3 text-sm outline-none focus:border-dpcp-blue"
        />
        <Button type="submit" variant="outline">
          Send the idea
        </Button>
      </form>
      <ul className="mt-3 space-y-2">
        {app.model.cultureIdeas.map((idea) => (
          <li key={idea.id} className="text-sm">
            <span className="font-medium text-dpcp-navy">{nameOf(idea.authorId)}</span> · {idea.text}
          </li>
        ))}
      </ul>
    </Surface>
  );
}

export function CultureChannel() {
  const app = useApp();
  const [aboutId, setAboutId] = useState("nadia");
  const [text, setText] = useState("");
  const [pillar, setPillar] = useState<Pillar>("intelligence");
  const [touched, setTouched] = useState(false);
  const suggested = suggestPillar(text);

  return (
    <div>
      <div className="mb-4 rounded-[18px] bg-dpcp-navy-deep px-4 py-5 text-white">
        <p className="text-[11px] tracking-wide text-dpcp-tint uppercase">Wins & Culture</p>
        <h2 className="font-heading mt-2 text-2xl leading-snug">How we recognize each other</h2>
        <p className="mt-2 max-w-xl text-sm text-dpcp-tint">
          Intelligence, Energy, and Integrity. The AI suggests the pillar. You can change it.
        </p>
      </div>
      <PillarTrio />
      <div className="mt-4">
        <PillarSpotlight />
      </div>
      <Surface className="mb-4">
        <p className="text-sm font-medium text-dpcp-navy">Give a shout-out</p>
        <form
          className="mt-3 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            app.addShoutout(aboutId, text, touched ? pillar : suggested);
            setText("");
            setTouched(false);
          }}
        >
          <select
            className="h-11 w-full rounded-lg border border-border bg-white px-2 text-sm"
            value={aboutId}
            onChange={(e) => setAboutId(e.target.value)}
            aria-label="Who"
          >
            {PEOPLE.filter((p) => p.id !== app.viewer.id).map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What did they do, in one or two sentences?"
            className="min-h-20 w-full rounded-xl border border-border p-3 text-sm outline-none focus:border-dpcp-blue"
          />
          <div>
            <p className="text-xs text-muted-foreground">AI suggests {PILLARS[text.trim() ? suggested : pillar].label}. Change it if that's not the one.</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(Object.keys(PILLARS) as Pillar[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setPillar(key);
                    setTouched(true);
                  }}
                  className={cn("rounded-full", (touched ? pillar : suggested) === key && "ring-2 ring-dpcp-blue ring-offset-2")}
                >
                  <PillarTag pillar={key} />
                </button>
              ))}
            </div>
          </div>
          <Button type="submit">Post the shout-out</Button>
        </form>
      </Surface>
      <FridayAppreciation />
      <CultureIdeaBox />
      {app.model.cultureSuggestions.length > 0 && (
        <div className="mb-4 space-y-2">
          <p className="text-[11px] tracking-wide text-muted-foreground uppercase">The AI noticed</p>
          {app.model.cultureSuggestions.map((suggestion) => (
            <Surface key={suggestion.id}>
              <PillarTag pillar={suggestion.pillar} />
              <p className="mt-2 font-medium text-dpcp-navy">{suggestion.title}</p>
              <p className="mt-1 text-sm">{suggestion.body}</p>
              <p className="mt-1 text-xs text-muted-foreground">{suggestion.reason}</p>
              <Button className="mt-3" variant="outline" onClick={() => app.shareSuggestion(suggestion.id)}>
                Share this win
              </Button>
            </Surface>
          ))}
        </div>
      )}
      <div className="space-y-3">
        {app.model.culture.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
