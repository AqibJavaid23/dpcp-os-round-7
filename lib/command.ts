import type { GeorgeThread } from "@/lib/types";

/** George's three mailboxes, plus the channels he no longer opens himself. */
export function createGeorgeInbox(): GeorgeThread[] {
  return [
    {
      id: "g-laura",
      channel: "email",
      inbox: "clients@dpcp.example",
      from: "Laura Chen",
      org: "Mesa Ridge Dental",
      subject: "September collections",
      summary: "Client asked why collections moved. Draft answers with the batch timing.",
      draft:
        "Hi Laura, two payer batches posted on Oct 2, so they land in October. September is in line with August once that timing is included. The batch list is attached.\n\nGeorge\nDental Practice Copilot",
      why: "A client is waiting. This is the one to send first.",
      waiting: "Since 8:14 AM",
      state: "needs_you",
    },
    {
      id: "g-patel",
      channel: "email",
      inbox: "georgehariri@gmail.com",
      from: "Dr. Patel",
      org: "Saguaro Family Dental",
      subject: "New associate billing",
      summary: "Personal inbox. Same question Nadia can answer. Draft points him to her reply.",
      draft:
        "Dr. Patel, the associate can bill starting Wednesday. Nadia is sending the payer list today.\n\nGeorge\nDental Practice Copilot",
      why: "It landed in your personal inbox. Answer it here so you don't open Gmail.",
      waiting: "Since yesterday",
      state: "needs_you",
    },
    {
      id: "g-vendor",
      channel: "email",
      inbox: "george@dpcp.example",
      from: "BrightDent Supply",
      org: "BrightDent Supply",
      subject: "Deposit timing",
      summary: "Vendor asking if the $2,400 deposit is approved.",
      draft:
        "Approved today. Jonas will send the cleared SKUs only. Three SKUs stay off this shipment.\n\nGeorge\nDental Practice Copilot",
      why: "Ties to the decision below. Send it after you approve the deposit.",
      waiting: "Since 9:05 AM",
      state: "needs_you",
    },
    {
      id: "g-slack",
      channel: "slack",
      inbox: "Slack · #owners",
      from: "Rowan Blake",
      org: "Operations",
      subject: "Friday pillar report",
      summary: "Rowan posted the outline. Draft confirms you'll read it here, not in Slack.",
      draft: "Got it, Rowan. I'll read the report in DPCP OS. No need to paste it in Slack.",
      why: "Internal. A one-line confirm is enough.",
      waiting: "Since 9:30 AM",
      state: "needs_you",
    },
    {
      id: "g-whatsapp",
      channel: "whatsapp",
      inbox: "WhatsApp",
      from: "BrightDent dispatch",
      org: "BrightDent Supply",
      subject: "Container 4 dock time",
      summary: "Vendor WhatsApp. Draft keeps the answer in the thread they already use.",
      draft: "Dock window is Thursday 10:00. Jonas has the FDA blanks. We'll confirm when those three SKUs are cleared.",
      why: "They wrote on WhatsApp. You reply from here.",
      waiting: "Since 10:05 AM",
      state: "needs_you",
    },
    {
      id: "g-text",
      channel: "text",
      inbox: "Texts",
      from: "Office manager",
      org: "Canyon View Smiles",
      subject: "Running 10 minutes late",
      summary: "Text about the 1:00. Draft tells Nadia to start without them.",
      draft: "Thanks for the note. Nadia will start at 1:00 and cover the aging first. Join when you can.",
      why: "The meeting is today. One tap sends the text.",
      waiting: "Since 10:28 AM",
      state: "needs_you",
    },
  ];
}

export const CHANNEL_LABEL: Record<GeorgeThread["channel"], string> = {
  email: "Email",
  slack: "Slack",
  whatsapp: "WhatsApp",
  text: "Text",
};
