"use client";

import Link from "next/link";
import { PageFrame } from "@/components/app-shell";
import { Surface } from "@/components/bits";
import { Button } from "@/components/ui/button";
import { IDEA_FLOW, IDEA_LABEL, THEMES } from "@/lib/evolve";
import { PEOPLE } from "@/lib/seed";
import { useApp } from "@/lib/store";
import type { IdeaStatus, ProductIdea } from "@/lib/types";
import { cn } from "@/lib/utils";

function nameOf(id: string) {
  return PEOPLE.find((p) => p.id === id)?.name ?? id;
}

function IdeaCard({ idea }: { idea: ProductIdea }) {
  const app = useApp();
  const voted = idea.votes.includes(app.viewer.id);
  const canMove = app.ui.role === "george" || app.ui.role === "administrator";
  return (
    <Surface>
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-dpcp-navy px-2 py-0.5 text-[11px] text-white">{IDEA_LABEL[idea.status]}</span>
        {idea.mode === "voice" && <span className="text-[11px] text-muted-foreground">Voice note</span>}
        {idea.authorId === app.viewer.id && <span className="text-[11px] text-dpcp-blue">Yours</span>}
      </div>
      <h2 className="font-heading mt-2 text-lg text-dpcp-navy">{idea.title}</h2>
      <p className="mt-1 text-sm leading-relaxed">{idea.body}</p>
      <p className="mt-2 text-xs text-muted-foreground">
        {nameOf(idea.authorId)} · {idea.screenTitle} · {idea.at}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button type="button" variant={voted ? "default" : "outline"} onClick={() => app.voteIdea(idea.id)}>
          {voted ? "Voted" : "Vote"} · {idea.votes.length}
        </Button>
        {canMove && idea.status !== "shipped" && (
          <Button type="button" variant="outline" onClick={() => app.advanceIdea(idea.id)}>
            Move to {IDEA_LABEL[IDEA_FLOW[IDEA_FLOW.indexOf(idea.status) + 1] as IdeaStatus]}
          </Button>
        )}
        {idea.status === "shipped" && (
          <Link href="/communication" className="text-sm text-dpcp-blue">
            Credited in Wins & Culture
          </Link>
        )}
      </div>
    </Surface>
  );
}

export function IdeasScreen() {
  const app = useApp();
  const ideas = app.model.ideas;
  const architect = app.ui.role === "george" || app.ui.role === "administrator";
  const themes = Object.keys(THEMES)
    .map((id) => ({ id, ...THEMES[id], ideas: ideas.filter((idea) => idea.themeId === id) }))
    .filter((theme) => theme.ideas.length > 0);

  return (
    <PageFrame
      title="Ideas & Roadmap"
      lede="You can see what people asked for, vote, and watch it move from Received to Shipped."
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {IDEA_FLOW.map((status, index) => (
          <span key={status} className="rounded-full bg-white px-3 py-1 text-sm text-dpcp-navy">
            {index > 0 ? "→ " : ""}
            {IDEA_LABEL[status]} · {ideas.filter((idea) => idea.status === status).length}
          </span>
        ))}
      </div>
      <div className="mb-4">
        <Button type="button" onClick={() => app.setFeedbackOpen(true)}>
          Feedback on DPCP OS
        </Button>
      </div>
      {ideas.length === 0 ? (
        <Surface>
          <p className="text-sm">No ideas yet. The button on every screen is where one starts.</p>
        </Surface>
      ) : (
        <div className="grid gap-3">
          {IDEA_FLOW.flatMap((status) => ideas.filter((idea) => idea.status === status)).map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      )}
      {architect && (
        <div className="mt-6">
          <p className="text-[11px] tracking-wide text-muted-foreground uppercase">For the Architect</p>
          <p className="mt-1 mb-3 max-w-2xl text-sm text-muted-foreground">
            The AI grouped the notes into themes. George and administrators see this. Everyone else sees the board.
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {themes.map((theme) => (
              <Surface key={theme.id} className={cn(theme.id === "other" && "opacity-80")}>
                <p className="font-medium text-dpcp-navy">{theme.title}</p>
                <p className="mt-1 text-sm">{theme.summary}</p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {theme.ideas.map((idea) => (
                    <li key={idea.id}>
                      {idea.title} · {IDEA_LABEL[idea.status]} · {idea.votes.length} votes
                    </li>
                  ))}
                </ul>
              </Surface>
            ))}
          </div>
        </div>
      )}
    </PageFrame>
  );
}
