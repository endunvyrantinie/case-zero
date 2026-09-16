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

export type MotiveOption = { id: string; label: string };

export type CasePublic = {
  id: string;
  title: string;
  kicker: string;
  location: string;
  scene: string;
  victim: string;
  victimAge: number;
  victimRole: string;
  briefing: string;
  objective: string;
  difficulty: "ROOKIE" | "DETECTIVE" | "INSPECTOR";
  estimatedMinutes: number;
  suspects: Suspect[];
  evidence: Evidence[];
  motiveOptions: MotiveOption[];
};

export const cases: CasePublic[] = [
  {
    id: "CZ002",
    title: "11:47",
    kicker: "ROOM 307",
    location: "Seroja House, Kuching",
    scene: "Room 307",
    victim: "Adrian Lau Wei Jian",
    victimAge: 35,
    victimRole: "Founder, Northbank Studio",
    briefing:
      "Adrian Lau is found dead beside the writing desk in Room 307. There is no forced entry. A brass hornbill paperweight has been wiped unusually clean. Four people had reasons to lie about that night. Only one killed him.",
    objective:
      "Interrogate all four suspects, confront them with evidence, identify the killer, establish the motive, and submit the evidence that proves your case.",
    difficulty: "DETECTIVE",
    estimatedMinutes: 25,
    suspects: [
      { id: "alya", name: "Alya Zainal", age: 32, role: "Brand Consultant", relation: "Adrian's former fiancée", initials: "AZ", statement: "We argued downstairs. I never went to his room." },
      { id: "kelvin", name: "Kelvin Ting Jia Hao", age: 37, role: "Business Partner", relation: "Co-founder of Northbank Studio", initials: "KT", statement: "I was at the rooftop lounge most of the night. Adrian and I had disagreements, nothing more." },
      { id: "maya", name: "Maya anak Jalong", age: 28, role: "Freelance Videographer", relation: "Contracted for the event", initials: "MJ", statement: "I packed up after the event and left. I didn't see Adrian again." },
      { id: "farid", name: "Farid Hakim", age: 34, role: "Brand Manager", relation: "Adrian's longtime friend", initials: "FH", statement: "I was downstairs. I helped the staff after the event and stepped outside for a while." }
    ],
    evidence: [
      { id: "scene", title: "Crime Scene", type: "Scene", description: "No forced entry. Adrian is beside the desk. A broken glass is nearby. A decorative brass hornbill paperweight is cleaner than the surrounding objects." },
      { id: "earring", title: "Silver Earring", type: "Physical", description: "A single silver earring is found under the desk chair." },
      { id: "legal-draft", title: "Legal Draft", type: "Document", description: "An unsent email draft threatens legal action over copied client information and names Kelvin." },
      { id: "watch", title: "Smartwatch Data", time: "11:17 PM", type: "Digital", description: "Adrian's heart rate spikes sharply at 11:17 PM. Movement stops moments later." },
      { id: "maya-camera", title: "Maya's Camera", time: "11:08 PM", type: "Image", description: "A timestamped corridor photo proves Maya was still on Floor 3. A dark-clothed figure appears indistinctly in a reflective panel." },
      { id: "lobby-cctv", title: "Lobby CCTV", type: "Video", description: "Farid is visible in the lobby at 10:53 PM and again at 11:35 PM. The footage does not show him during the 42-minute gap." },
      { id: "stairwell", title: "Stairwell Sensor", type: "Access Log", description: "The Floor 3 stairwell door opens shortly after 11:00 PM and again around 11:29 PM. The sensor records no identity." },
      { id: "phone-log", title: "Phone Forensics", time: "11:26 PM", type: "Digital", description: "Adrian's phone was unlocked by passcode before a message was sent to Kelvin at 11:26 PM, after Adrian's movement had stopped." },
      { id: "event-video", title: "Event Video", type: "Video", description: "Earlier event footage appears to show Farid unlocking Adrian's phone without Adrian giving him the code." },
      { id: "fibre", title: "Copper-Black Fibre", type: "Forensic", description: "A tiny black textile fibre with a copper thread is recovered from a seam on the wiped paperweight." },
      { id: "payments", title: "Sponsorship Reconciliation", type: "Financial", description: "Approximately RM120,000 in sponsorship payments were routed through questionable supplier invoices." }
    ],
    motiveOptions: [
      { id: "romantic", label: "Romantic jealousy / breakup" },
      { id: "client-list", label: "Client-list theft and business dispute" },
      { id: "unpaid-work", label: "Unpaid freelance fees" },
      { id: "financial-fraud", label: "Exposure of diverted sponsorship funds" }
    ]
  },
  {
    id: "CZ003",
    title: "AFTER CLOSING",
    kicker: "TABLE SEVEN",
    location: "Kopi Arang, Miri",
    scene: "Back dining room",
    victim: "Rafiq Ismail",
    victimAge: 41,
    victimRole: "Chef-owner, Kopi Arang",
    briefing:
      "Chef Rafiq collapses after a private late-night tasting. The dining room was locked from inside the café, but four people had access before closing. The cup beside him contains traces of a medication that becomes dangerous at high concentration.",
    objective:
      "Work out who tampered with Rafiq's drink, when it happened, and which apparently harmless lie hides the murder.",
    difficulty: "ROOKIE",
    estimatedMinutes: 20,
    suspects: [
      { id: "nadia", name: "Nadia Rahman", age: 30, role: "Pastry Chef", relation: "Rafiq's younger sister", initials: "NR", statement: "I left after the kitchen closed. We argued, but I wasn't there for the tasting." },
      { id: "jonathan", name: "Jonathan Liew", age: 33, role: "Food Reviewer", relation: "Invited guest", initials: "JL", statement: "Rafiq poured everything himself. I only tasted the desserts." },
      { id: "amirul", name: "Amirul Bujang", age: 26, role: "Barista", relation: "Closing-shift employee", initials: "AB", statement: "I cleaned the bar, locked the front and went home. Nothing unusual happened." },
      { id: "celine", name: "Celine Wong", age: 38, role: "Restaurant Investor", relation: "Silent partner", initials: "CW", statement: "I stopped by for ten minutes to discuss next month's expansion. I never touched the drinks." }
    ],
    evidence: [
      { id: "cup", title: "Ceramic Cup", time: "12:06 AM", type: "Forensic", description: "Rafiq's cup contains a concentrated dose of a prescribed heart medication. No meaningful trace is found in the shared coffee pot." },
      { id: "kitchen-cam", title: "Kitchen Camera", time: "11:21 PM", type: "Video", description: "Nadia leaves through the kitchen door at 11:21 PM carrying a cake box. She does not re-enter." },
      { id: "review-photo", title: "Reviewer's Photo", time: "11:42 PM", type: "Image", description: "Jonathan photographs Table Seven. Rafiq's cup is visible beside a sealed amber syrup bottle." },
      { id: "bar-log", title: "POS Terminal Log", time: "11:49 PM", type: "Digital", description: "Amirul reopens a completed staff transaction from the bar terminal after he says he had finished cleaning." },
      { id: "prescription", title: "Prescription Record", type: "Document", description: "Rafiq was prescribed a low-dose heart medication. He normally kept one blister strip in a locked office drawer." },
      { id: "office-key", title: "Office Key Log", time: "11:33 PM", type: "Access Log", description: "The spare office key is removed from the key cabinet and returned eight minutes later." },
      { id: "amber-bottle", title: "Amber Syrup Bottle", type: "Physical", description: "The bottle cap bears a faint sticky fingerprint smear. Its contents are normal; residue on the outer neck contains powdered medication." },
      { id: "voice-note", title: "Rafiq's Voice Note", time: "10:58 PM", type: "Audio", description: "Rafiq tells a friend he plans to terminate a supplier arrangement the next morning because invoices have been inflated for months." },
      { id: "supplier-invoices", title: "Supplier Invoices", type: "Financial", description: "Several inflated coffee-bean invoices trace back to a side business controlled by Amirul's uncle. Amirul approved the receiving records." },
      { id: "rear-alley", title: "Rear Alley Camera", time: "11:57 PM", type: "Video", description: "Amirul leaves by the rear door at 11:57 PM, twelve minutes later than he initially claimed." }
    ],
    motiveOptions: [
      { id: "family-control", label: "Family dispute over the restaurant" },
      { id: "bad-review", label: "Fear of a damaging food review" },
      { id: "supplier-fraud", label: "Exposure of inflated supplier invoices" },
      { id: "investment", label: "Dispute over expansion funding" }
    ]
  },
  {
    id: "CZ004",
    title: "DEAD AIR",
    kicker: "STUDIO B",
    location: "Signal House Studios, Petaling Jaya",
    scene: "Recording Studio B",
    victim: "Alicia Tan Mei Xin",
    victimAge: 29,
    victimRole: "Singer-songwriter",
    briefing:
      "Alicia is found unconscious in a locked recording booth and later dies in hospital. A voice memo apparently places her alive at 1:14 AM. The studio's access logs tell a different story, and someone edited more than music that night.",
    objective:
      "Reconstruct the studio timeline, determine whether the late voice memo is genuine, and identify who used the recording session to manufacture an alibi.",
    difficulty: "INSPECTOR",
    estimatedMinutes: 30,
    suspects: [
      { id: "danial", name: "Danial Syed", age: 31, role: "Producer", relation: "Alicia's producer and ex-partner", initials: "DS", statement: "We fought about the album, then I left Studio B before midnight." },
      { id: "mei-ling", name: "Chong Mei Ling", age: 27, role: "Session Vocalist", relation: "Alicia's collaborator", initials: "CM", statement: "I recorded harmonies and went home. I never entered the booth after Alicia took over." },
      { id: "raj", name: "Raj Kumar", age: 36, role: "Studio Engineer", relation: "Night engineer", initials: "RK", statement: "I stayed at the control desk. The system logs everything; there is nothing to hide." },
      { id: "hannah", name: "Hannah Lee", age: 34, role: "Artist Manager", relation: "Alicia's manager", initials: "HL", statement: "I was on a video call in the lounge when Alicia sent her final voice memo." }
    ],
    evidence: [
      { id: "booth", title: "Studio B Booth", type: "Scene", description: "The booth door was latched. Alicia's water bottle is on the music stand. There are no signs of a struggle." },
      { id: "voice-memo", title: "Final Voice Memo", time: "1:14 AM", type: "Audio", description: "Alicia appears to say, 'I'm finishing the bridge, then I'm done.' Metadata shows the file was exported at 1:14 AM." },
      { id: "waveform", title: "Waveform Analysis", type: "Forensic Audio", description: "The final voice memo contains the same low electrical click found in a take recorded at 11:38 PM, at exactly the same interval." },
      { id: "door-log", title: "Studio Door Log", time: "12:31 AM", type: "Access Log", description: "Raj's engineer card opens Studio B at 12:31 AM. No other card entry is recorded before 1:20 AM." },
      { id: "danial-ride", title: "E-hailing Receipt", time: "12:04 AM", type: "Digital", description: "Danial's ride departs the studio at 12:04 AM and reaches Subang Jaya at 12:23 AM." },
      { id: "vocal-backup", title: "Backup Vocal Folder", type: "Digital", description: "Mei Ling secretly copied unreleased stems to a portable drive before leaving. The copy log ends at 11:56 PM." },
      { id: "call-record", title: "Manager's Call Record", time: "12:48–1:19 AM", type: "Digital", description: "Hannah was on a continuous video call. The other participant confirms she remained visible in the lounge for most of it." },
      { id: "water-test", title: "Water Bottle Test", type: "Forensic", description: "Alicia's bottle contains a sedative not prescribed to her. Trace residue is also found on a reusable measuring pipette in the engineer's drawer." },
      { id: "session-history", title: "Session Edit History", time: "1:09 AM", type: "Digital", description: "The studio workstation creates a new audio export at 1:09 AM using segments from Alicia's earlier vocal takes." },
      { id: "royalty-email", title: "Royalty Email", type: "Document", description: "Alicia had discovered that several session fees were billed twice and planned to request a formal audit of the studio account." },
      { id: "admin-login", title: "Workstation Login", time: "1:07 AM", type: "Digital", description: "The audio workstation was unlocked with Raj's administrator credential two minutes before the suspicious export." }
    ],
    motiveOptions: [
      { id: "relationship", label: "Personal conflict with an ex-partner" },
      { id: "music-theft", label: "Theft of unreleased recordings" },
      { id: "billing-fraud", label: "Exposure of duplicate studio billing" },
      { id: "career-control", label: "Dispute over management and career direction" }
    ]
  }
];

export function getCase(caseId: string) {
  return cases.find((item) => item.id === caseId);
}
