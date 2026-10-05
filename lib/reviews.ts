import type { ReviewItem } from "@/lib/types";

const emailV1 = [
  { id: "e1", text: "Hi Laura," },
  {
    id: "e2",
    text: "Pursuant to our agreement, September collections are not in fact down. Two payer batches totaling $14,210 posted on Oct 2 and will appear in October.",
  },
  {
    id: "e3",
    text: "Please remit any outstanding deposit immediately to avoid further follow-up.",
  },
  { id: "e4", text: "Nadia" },
];

const emailV2 = [
  { id: "e1", text: "Hi Laura," },
  {
    id: "e2",
    text: "Good question. September isn't actually behind August. Two payer batches ($14,210) posted on Oct 2, so they land in October. I've attached the batch list.",
  },
  {
    id: "e3",
    text: "Can you send the date the deposit went out? Happy to walk through it on a short call.",
  },
  { id: "e4", text: "Nadia" },
];

const emailV3 = [
  { id: "e1", text: "Hi Laura," },
  {
    id: "e2",
    text: "September matches August once timing is included. Two batches ($14,210) posted Oct 2 and show in October. Batch list attached.",
  },
  {
    id: "e3",
    text: "What date did the deposit leave your account?",
  },
  { id: "e4", text: "Nadia" },
];

export function createReviews(): ReviewItem[] {
  return [
    {
      id: "rev-mesa-email",
      ownerId: "nadia",
      departmentId: "insurance",
      kind: "email",
      title: "Reply to Laura about September collections",
      forWhom: "Laura Chen · Mesa Ridge Dental",
      whyNow: "Laura is waiting, and you already asked for a warmer note. This is the one that should go out.",
      state: "ready_again",
      current: 2,
      versions: [
        {
          number: 1,
          at: "9:40 AM AZ",
          summary: "First draft. Accurate, but it sounded like a demand.",
          blocks: emailV1,
          changes: [],
        },
        {
          number: 2,
          at: "10:16 AM AZ",
          summary: "Softer wording, and it asks for the deposit date instead of lecturing.",
          blocks: emailV2,
          changes: [
            {
              note: "Softer. Laura knows us. Don't say “pursuant.”",
              before: emailV1[1].text,
              after: emailV2[1].text,
            },
            {
              note: "Ask for the deposit date. Don't lecture.",
              before: emailV1[2].text,
              after: emailV2[2].text,
            },
          ],
        },
      ],
      queued: {
        number: 3,
        at: "10:43 AM AZ",
        summary: "Shorter, and the ask is only the deposit date.",
        blocks: emailV3,
        changes: [
          {
            note: "Shorter. One clear ask.",
            before: emailV2[1].text,
            after: emailV3[1].text,
          },
          {
            note: "Shorter. One clear ask.",
            before: emailV2[2].text,
            after: emailV3[2].text,
          },
        ],
      },
      notes: [
        {
          id: "n1",
          version: 1,
          author: "Nadia Reyes",
          at: "10:02 AM AZ",
          blockId: "e2",
          text: "Softer. Laura knows us. Don't say “pursuant.”",
        },
        {
          id: "n2",
          version: 1,
          author: "Nadia Reyes",
          at: "10:03 AM AZ",
          blockId: null,
          text: "Ask for the deposit date. Don't lecture.",
        },
      ],
    },
    {
      id: "rev-canyon-plan",
      ownerId: "omar",
      departmentId: "insurance",
      kind: "document",
      title: "Canyon View action plan",
      forWhom: "Canyon View Smiles · ready before the 1:00 meeting",
      whyNow: "The meeting is at 1:00. The plan should not go to the client until you say it's fair.",
      state: "needs_review",
      current: 1,
      versions: [
        {
          number: 1,
          at: "8:20 AM AZ",
          summary: "Built from the last recap and the open promises.",
          blocks: [
            { id: "p1", label: "This week", text: "Close the missing deposit date with the office manager before Friday." },
            { id: "p2", label: "Appeals", text: "Batch 14 stays with Imran. If the EOB is still missing tomorrow, move the appeal to Oct 21. The deadline is Oct 27." },
            { id: "p3", label: "You", text: "You confirm the plan in the meeting. Nothing here is sent to the client until you approve it." },
          ],
          changes: [],
        },
      ],
      queued: {
        number: 2,
        at: "10:43 AM AZ",
        summary: "Your note is in the plan, in plain words.",
        blocks: [
          { id: "p1", label: "This week", text: "Close the missing deposit date with the office manager before Friday." },
          { id: "p2", label: "Appeals", text: "Batch 14 stays with Imran. Call the front desk today before moving the date." },
          { id: "p3", label: "You", text: "You confirm the plan in the meeting. Nothing here is sent to the client until you approve it." },
        ],
        changes: [
          {
            note: "Have someone call before we move the appeal.",
            before: "Batch 14 stays with Imran. If the EOB is still missing tomorrow, move the appeal to Oct 21. The deadline is Oct 27.",
            after: "Batch 14 stays with Imran. Call the front desk today before moving the date.",
          },
        ],
      },
      notes: [],
    },
    {
      id: "rev-collections-sheet",
      ownerId: "nadia",
      departmentId: "insurance",
      kind: "spreadsheet",
      title: "October collections snapshot",
      forWhom: "You · Mesa Ridge numbers only, no patient rows",
      whyNow: "Useful after Laura's reply. It does not have to go out today.",
      state: "needs_review",
      current: 1,
      versions: [
        {
          number: 1,
          at: "7:55 AM AZ",
          summary: "Counts only. No patient information.",
          blocks: [
            { id: "s1", label: "Posted", text: "October to date · $48,200 posted · 2 batches still in transit" },
            { id: "s2", label: "Compared", text: "September, adjusted · in line with August once the Oct 2 batches are counted there" },
            { id: "s3", label: "Needs you", text: "One deposit date is still missing. That's the only open question." },
          ],
          changes: [],
        },
      ],
      notes: [],
    },
    {
      id: "rev-bloom-post",
      ownerId: "priya",
      departmentId: "marketing",
      kind: "social",
      title: "Fall visit post for Desert Bloom",
      forWhom: "Desert Bloom Dental · would post as the practice",
      whyNow: "The practice asked for a draft this week. It should not post until you approve the words.",
      state: "needs_review",
      current: 1,
      versions: [
        {
          number: 1,
          at: "9:10 AM AZ",
          summary: "A short post. No prices, no patient stories.",
          blocks: [
            { id: "b1", text: "Fall is a good time for the visit you've been putting off. Desert Bloom is saving a few afternoon openings this month." },
            { id: "b2", text: "Call the office to pick a time. We'll see you there." },
          ],
          changes: [],
        },
      ],
      queued: {
        number: 2,
        at: "10:43 AM AZ",
        summary: "Quieter, and it doesn't sound like a sale.",
        blocks: [
          { id: "b1", text: "If a checkup has been sitting on the list, we have a few afternoon openings this month." },
          { id: "b2", text: "Call the office when you're ready. We'll see you there." },
        ],
        changes: [
          {
            note: "Less salesy.",
            before: "Fall is a good time for the visit you've been putting off. Desert Bloom is saving a few afternoon openings this month.",
            after: "If a checkup has been sitting on the list, we have a few afternoon openings this month.",
          },
        ],
      },
      notes: [],
    },
  ];
}

export function reviewStateLabel(state: ReviewItem["state"]) {
  switch (state) {
    case "needs_review":
      return "Needs your review";
    case "revising":
      return "Revising from your notes";
    case "ready_again":
      return "Ready for you again";
    case "approved":
      return "You approved it";
    case "sent":
      return "Sent";
    case "rejected":
      return "Set aside";
  }
}
