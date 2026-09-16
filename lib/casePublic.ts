export type Suspect = {
  id: string;
  name: string;
  age: number;
  role: string;
  relation: string;
  initials: string;
  statement: string;
};

export type Evidence = {
  id: string;
  title: string;
  time?: string;
  type: string;
  description: string;
};

export const caseInfo = {
  id: "CZ002",
  title: "11:47",
  location: "Seroja House, Kuching",
  room: "Room 307",
  victim: "Adrian Lau Wei Jian",
  victimAge: 35,
  victimRole: "Founder, Northbank Studio",
  briefing:
    "Adrian Lau is found dead beside the writing desk in Room 307. There is no forced entry. A brass hornbill paperweight has been wiped unusually clean. Four people had reasons to lie about that night. Only one killed him.",
  objective:
    "Interrogate all four suspects, confront them with evidence, identify the killer, establish the motive, and submit the evidence that proves your case."
};

export const suspects: Suspect[] = [
  {
    id: "alya",
    name: "Alya Zainal",
    age: 32,
    role: "Brand Consultant",
    relation: "Adrian's former fiancée",
    initials: "AZ",
    statement: "We argued downstairs. I never went to his room."
  },
  {
    id: "kelvin",
    name: "Kelvin Ting Jia Hao",
    age: 37,
    role: "Business Partner",
    relation: "Co-founder of Northbank Studio",
    initials: "KT",
    statement: "I was at the rooftop lounge most of the night. Adrian and I had disagreements, nothing more."
  },
  {
    id: "maya",
    name: "Maya anak Jalong",
    age: 28,
    role: "Freelance Videographer",
    relation: "Contracted for the event",
    initials: "MJ",
    statement: "I packed up after the event and left. I didn't see Adrian again."
  },
  {
    id: "farid",
    name: "Farid Hakim",
    age: 34,
    role: "Brand Manager",
    relation: "Adrian's longtime friend",
    initials: "FH",
    statement: "I was downstairs. I helped the staff after the event and stepped outside for a while."
  }
];

export const evidence: Evidence[] = [
  {
    id: "scene",
    title: "Crime Scene",
    type: "Scene",
    description:
      "No forced entry. Adrian is beside the desk. A broken glass is nearby. A decorative brass hornbill paperweight is cleaner than the surrounding objects."
  },
  {
    id: "earring",
    title: "Silver Earring",
    type: "Physical",
    description: "A single silver earring is found under the desk chair."
  },
  {
    id: "legal-draft",
    title: "Legal Draft",
    type: "Document",
    description:
      "An unsent email draft threatens legal action over copied client information and names Kelvin."
  },
  {
    id: "watch",
    title: "Smartwatch Data",
    time: "11:17 PM",
    type: "Digital",
    description:
      "Adrian's heart rate spikes sharply at 11:17 PM. Movement stops moments later."
  },
  {
    id: "maya-camera",
    title: "Maya's Camera",
    time: "11:08 PM",
    type: "Image",
    description:
      "A timestamped corridor photo proves Maya was still on Floor 3. A dark-clothed figure appears indistinctly in a reflective panel."
  },
  {
    id: "lobby-cctv",
    title: "Lobby CCTV",
    type: "Video",
    description:
      "Farid is visible in the lobby at 10:53 PM and again at 11:35 PM. The footage does not show him during the 42-minute gap."
  },
  {
    id: "stairwell",
    title: "Stairwell Sensor",
    type: "Access Log",
    description:
      "The Floor 3 stairwell door opens shortly after 11:00 PM and again around 11:29 PM. The sensor records no identity."
  },
  {
    id: "phone-log",
    title: "Phone Forensics",
    time: "11:26 PM",
    type: "Digital",
    description:
      "Adrian's phone was unlocked by passcode before a message was sent to Kelvin at 11:26 PM, after Adrian's movement had stopped."
  },
  {
    id: "event-video",
    title: "Event Video",
    type: "Video",
    description:
      "Earlier event footage appears to show Farid unlocking Adrian's phone without Adrian giving him the code."
  },
  {
    id: "fibre",
    title: "Copper-Black Fibre",
    type: "Forensic",
    description:
      "A tiny black textile fibre with a copper thread is recovered from a seam on the wiped paperweight."
  },
  {
    id: "payments",
    title: "Sponsorship Reconciliation",
    type: "Financial",
    description:
      "Approximately RM120,000 in sponsorship payments were routed through questionable supplier invoices."
  }
];

export const motiveOptions = [
  { id: "romantic", label: "Romantic jealousy / breakup" },
  { id: "client-list", label: "Client-list theft and business dispute" },
  { id: "unpaid-work", label: "Unpaid freelance fees" },
  { id: "financial-fraud", label: "Exposure of diverted sponsorship funds" }
];
