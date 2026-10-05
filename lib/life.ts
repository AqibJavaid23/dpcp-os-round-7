import type { CultureIdea, MondayThree, OffboardCase, Person, PulseCheck, TrainingTrack } from "@/lib/types";

export interface PersonProfile {
  about: string;
  place: string;
  started: string;
  enjoys: string;
  birthday?: string;
  newHire?: boolean;
}

const PROFILES: Record<string, PersonProfile> = {
  nadia: {
    about: "Nadia writes the client note the practice can trust. She is learning to say the hard part herself.",
    place: "Arizona",
    started: "Mar 2024",
    enjoys: "A walk before the first check-in",
    birthday: "May 2",
  },
  omar: {
    about: "Omar leads Insurance without turning it into a ranking. People bring him blocked work.",
    place: "Arizona",
    started: "Jan 2023",
    enjoys: "Cooking for a crowd",
  },
  jamie: {
    about: "Jamie is new on the collections queue. Training is still open, so client email waits for Omar's sign-off.",
    place: "Arizona",
    started: "Oct 13, 2026",
    enjoys: "Learning the queue beside Nadia",
    newHire: true,
  },
  faisal: {
    about: "Faisal posts payments and covers the queue when someone is out. Clients notice the clarity.",
    place: "Pakistan",
    started: "Jun 2023",
    enjoys: "Cricket on the weekend",
  },
  sana: {
    about: "Sana runs eligibility. The team is glad she is here.",
    place: "Pakistan",
    started: "Aug 2024",
    enjoys: "Early tea and a quiet inbox",
    birthday: "Oct 20",
  },
  imran: {
    about: "Imran works appeals and says so when a copy is missing. That honesty is the point.",
    place: "Pakistan",
    started: "Nov 2024",
    enjoys: "Long runs",
  },
  george: {
    about: "George owns the company and leads it from DPCP OS.",
    place: "Arizona",
    started: "Founder",
    enjoys: "A short list and a finished day",
  },
};

export function profileFor(person: Person): PersonProfile {
  const place = person.tz === "AZ" ? "Arizona" : person.tz === "SAST" ? "South Africa" : "Pakistan";
  return (
    PROFILES[person.id] ?? {
      about: `${person.firstName} is ${person.title}. Teammates know what to bring them.`,
      place,
      started: "2025",
      enjoys: "A clear next task",
    }
  );
}

export function createMonday(): MondayThree[] {
  return [
    {
      personId: "nadia",
      setOn: "Monday, Oct 13",
      items: [
        { text: "Reply to Mesa Ridge about September collections", taskId: "nadia-mesa" },
        { text: "Prep the Canyon View call", taskId: "nadia-prep" },
        { text: "Log Desert Bloom verification exceptions", taskId: "nadia-verify" },
      ],
    },
    {
      personId: "omar",
      setOn: "Monday, Oct 13",
      items: [
        { text: "Unblock Imran's Canyon View appeal" },
        { text: "Sign off Jamie's training if the week is solid" },
        { text: "Read Friday's appreciations before the spotlight" },
      ],
    },
    {
      personId: "george",
      setOn: "Monday, Oct 13",
      items: [
        { text: "Approve the BrightDent deposit" },
        { text: "Read negative client feedback that reached me" },
        { text: "Look at what the team asked us to build" },
      ],
    },
    {
      personId: "jamie",
      setOn: "Monday, Oct 13",
      items: [
        { text: "Finish the SOP walkthrough with Omar" },
        { text: "Send the practice reply that stays inside the company" },
        { text: "Day 7 pulse with Omar" },
      ],
    },
  ];
}

export function mondayFor(rows: MondayThree[], personId: string): MondayThree {
  return (
    rows.find((row) => row.personId === personId) ?? {
      personId,
      setOn: "Monday, Oct 13",
      items: [
        { text: "The client promise that is due first" },
        { text: "One thing a teammate is waiting on" },
        { text: "Close the loop on yesterday" },
      ],
    }
  );
}

const PULSE_QUESTIONS = [
  "What feels clear?",
  "What still feels confusing?",
  "Who has helped you, and what do you need next?",
];

export function createTraining(): TrainingTrack[] {
  return [
    {
      personId: "jamie",
      started: "Oct 13",
      window: "3 days to 1 week",
      signedOff: false,
      steps: [
        { id: "tr1", day: "Day 1", title: "Orientation and the mission", detail: "People + AI, the pillars, and how a day works.", done: true },
        { id: "tr2", day: "Day 1", title: "Work-systems notice", detail: "What the company stores, and why.", done: true },
        { id: "tr3", day: "Day 2", title: "Shadow a collections reply", detail: "Watch Nadia. Do not send.", done: true },
        { id: "tr4", day: "Day 3", title: "Practice reply", detail: "This one cannot leave the company.", done: true },
        { id: "tr5", day: "Day 4", title: "SOP walkthrough with Omar", detail: "Client report questions, step by step.", done: false },
        { id: "tr6", day: "Day 5–7", title: "Supervisor sign-off", detail: "Until Omar signs, no client task and no client email.", done: false },
      ],
    },
  ];
}

export function clientReady(personId: string, tracks: TrainingTrack[]) {
  const track = tracks.find((row) => row.personId === personId);
  return !track || track.signedOff;
}

export function createPulses(): PulseCheck[] {
  return [
    { id: "pulse-7", personId: "jamie", day: 7, due: "Oct 20", status: "due", questions: PULSE_QUESTIONS, answers: [] },
    { id: "pulse-30", personId: "jamie", day: 30, due: "Nov 12", status: "upcoming", questions: PULSE_QUESTIONS, answers: [] },
    { id: "pulse-90", personId: "jamie", day: 90, due: "Jan 11", status: "upcoming", questions: PULSE_QUESTIONS, answers: [] },
  ];
}

export function createOffboard(): OffboardCase {
  return {
    personName: "Noah Pike",
    role: "Supplies coordinator",
    department: "Supplies",
    lastDay: "Friday, Oct 24",
    leadId: "jonas",
    sendoff:
      "Noah Pike's last day is Friday. He kept the vendor board honest and taught two people the reorder sheet. Thank you, Noah.",
    sendoffPosted: false,
    feedback: "",
    handover: [
      { id: "h1", label: "Reorder sheet owner named", owner: "Jonas", done: true },
      { id: "h2", label: "Open vendor threads handed to Jonas", owner: "Noah", done: false },
      { id: "h3", label: "Friday close notes written", owner: "Noah", done: false },
    ],
    access: [
      { id: "a1", label: "Gmail and Drive access ends Friday 5 PM", owner: "IT", done: false },
      { id: "a2", label: "Slack account scheduled to deactivate", owner: "IT", done: true },
      { id: "a3", label: "Time Doctor user removed after the last day", owner: "IT", done: false },
      { id: "a4", label: "DPCP OS login removed", owner: "Amina", done: false },
    ],
  };
}

export function createCultureIdeas(): CultureIdea[] {
  return [
    {
      id: "ci1",
      authorId: "sana",
      text: "A two-minute playlist at the end of Friday's appreciation, so the week actually closes.",
      at: "Oct 17",
    },
  ];
}
