import type { FamilyId } from "@/lib/types";

/** Official files from public/brand. HDG practice logos are intentionally unused. */

export const logos = {
  wordmarkLight: "/brand/logos/dpcp_horizontal_color_cropped.png",
  wordmarkDark: "/brand/logos/dpcp_horizontal_color-reversed_cropped.png",
  wordmarkWhite: "/brand/logos/dpcp_horizontal_white_cropped.png",
  markColor: "/brand/logos/copilot-mark_icon_color.png",
  markWhite: "/brand/logos/copilot-mark_icon_white.png",
  markSquareNavy: "/brand/logos/copilot-mark_square_color-on-navy.png",
  hbsLockup: "/brand/logos/hbs_lockup-horizontal_color.svg",
  hbsLockupPng: "/brand/logos/hbs_lockup_color.png",
} as const;

export const familyLogos: Record<
  FamilyId,
  { src: string; alt: string; short: string } | null
> = {
  insurance: {
    src: "/brand/logos/dental-insurance-copilot_horizontal_color.png",
    alt: "Dental Insurance Copilot",
    short: "DICP",
  },
  marketing: {
    src: "/brand/logos/dental-marketing-copilot_horizontal_color.png",
    alt: "Dental Marketing Copilot",
    short: "DMCP",
  },
  staffing: {
    src: "/brand/logos/dental-staffing-copilot_horizontal_color.png",
    alt: "Dental Staffing Copilot",
    short: "DSCP",
  },
  finance: {
    src: "/brand/logos/dental-finance-copilot_horizontal_color.png",
    alt: "Dental Finance Copilot",
    short: "Finance",
  },
  equipment: {
    src: "/brand/logos/dental-equipment-copilot_horizontal_color.png",
    alt: "Dental Equipment Copilot",
    short: "Equipment",
  },
  supplies: {
    src: "/brand/logos/dental-supplies-copilot_horizontal_color.png",
    alt: "Dental Supplies Copilot",
    short: "Supplies",
  },
  dpcp: null,
};

export const CLOCK = {
  dateLine: "Tue, Oct 20",
  time: "10:42 AM",
  greeting: "Good morning",
};
