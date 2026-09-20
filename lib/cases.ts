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
    estimatedMinutes: 10,
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
    estimatedMinutes: 10,
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
    estimatedMinutes: 10,
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
  ,{
    id: "CZ005",
    title: "LAST FERRY",
    kicker: "GATE 4",
    location: "North Bay Ferry Terminal, Kota Kinabalu",
    scene: "Operations Office",
    victim: "Evelyn Goh Siew May",
    victimAge: 39,
    victimRole: "Marine Compliance Consultant",
    briefing:
      "Evelyn Goh is found dead in the terminal operations office minutes before the final ferry departs. A radio call appears to place her alive at 9:46 PM, but the recording sounds strangely clean. Four people had access to the restricted pier that night.",
    objective:
      "Reconstruct Evelyn's final hour, determine whether the radio call was genuine, and identify who needed her compliance report to disappear.",
    difficulty: "DETECTIVE",
    estimatedMinutes: 10,
    suspects: [
      { id: "azlan", name: "Azlan Karim", age: 42, role: "Terminal Operations Supervisor", relation: "Oversaw Evelyn's inspection", initials: "AK", statement: "I was on the vehicle deck during the final loading. Evelyn was still working when I left her." },
      { id: "marcus", name: "Marcus Lee", age: 45, role: "Ferry Captain", relation: "Captain of the final departure", initials: "ML", statement: "I never entered the office. I was preparing the vessel from nine-thirty onward." },
      { id: "farah", name: "Farah Nordin", age: 31, role: "Investigative Reporter", relation: "Had been contacting Evelyn", initials: "FN", statement: "I came for a passenger story. I did not meet Evelyn privately." },
      { id: "jovina", name: "Jovina Lajim", age: 36, role: "Environmental Officer", relation: "Worked with Evelyn on compliance", initials: "JL", statement: "I left the terminal after our inspection debrief. Evelyn wanted to finish her report alone." }
    ],
    evidence: [
      { id: "office-scene", title: "Operations Office", type: "Scene", description: "Evelyn is found beside a filing cabinet. A heavy emergency torch lies under the desk, wiped clean except for grease near the battery cap." },
      { id: "radio-call", title: "Final Radio Call", time: "9:46 PM", type: "Audio", description: "A recorded transmission appears to contain Evelyn saying the inspection is complete. The background is unusually silent for an active ferry terminal." },
      { id: "pier-cctv", title: "Pier CCTV", time: "9:31 PM", type: "Video", description: "Azlan walks toward the restricted operations corridor. He does not reappear on the camera covering the vehicle deck until 9:58 PM." },
      { id: "captain-log", title: "Captain's Bridge Log", time: "9:36 PM", type: "Document", description: "Marcus signs the pre-departure checklist on the bridge. Engine telemetry places the vessel in active preparation throughout the critical window." },
      { id: "report-draft", title: "Compliance Report Draft", type: "Document", description: "Evelyn's draft flags repeated discrepancies between waste-disposal declarations and actual terminal records." },
      { id: "reporter-recorder", title: "Farah's Recorder", time: "8:54 PM", type: "Audio", description: "Farah secretly recorded Evelyn describing a possible cover-up involving falsified disposal paperwork." },
      { id: "gate-swipe", title: "Gate 4 Swipe Log", time: "9:28 PM", type: "Access Log", description: "Azlan's staff card opens Gate 4 shortly before the restricted corridor camera captures him." },
      { id: "invoice-bundle", title: "Waste Contractor Invoices", type: "Financial", description: "Several disposal invoices were approved by Azlan despite vehicle logs showing no matching collection trips." },
      { id: "audio-spectrum", title: "Radio Spectrum Analysis", type: "Forensic Audio", description: "The 9:46 PM radio clip contains the same low compressor hum as an earlier office recording and lacks the terminal horn audible in every live transmission that hour." },
      { id: "torch-grease", title: "Torch Grease Trace", type: "Forensic", description: "Grease on the emergency torch is chemically consistent with lubricant used only on the Gate 4 roller mechanism maintained by operations staff." }
    ],
    motiveOptions: [
      { id: "press-leak", label: "Stop a confidential story from reaching the press" },
      { id: "safety-negligence", label: "Hide a vessel safety violation" },
      { id: "waste-fraud", label: "Conceal falsified waste-disposal invoices" },
      { id: "professional-rivalry", label: "Professional rivalry over the compliance audit" }
    ]
  },
  {
    id: "CZ006",
    title: "DO NOT DISTURB",
    kicker: "SUITE 1806",
    location: "Meridian Crown Hotel, Kuala Lumpur",
    scene: "Suite 1806",
    victim: "Harith Roslan",
    victimAge: 44,
    victimRole: "Corporate Lawyer",
    briefing:
      "Harith Roslan is found dead in the bathroom of Suite 1806 after a private settlement meeting. The room appears locked, a glass panel is shattered, and a signed agreement on the desk contains a page that does not match the rest of the document.",
    objective:
      "Work out who returned to the suite after the meeting, what was altered in the settlement papers, and which lie was built around the hotel access logs.",
    difficulty: "INSPECTOR",
    estimatedMinutes: 10,
    suspects: [
      { id: "nisha", name: "Nisha Menon", age: 40, role: "Chief Financial Officer", relation: "Harith's corporate client", initials: "NM", statement: "I signed the settlement and left with everyone else. I had no reason to return." },
      { id: "lucas", name: "Lucas Tan", age: 29, role: "Junior Lawyer", relation: "Harith's associate", initials: "LT", statement: "I dropped the final papers at reception and went straight home." },
      { id: "aina", name: "Nur Aina Salleh", age: 35, role: "Executive Assistant", relation: "Managed Harith's schedule", initials: "NA", statement: "I was downstairs arranging his airport car. I never went back upstairs." },
      { id: "fikri", name: "Fikri Hamzah", age: 38, role: "Hotel Security Manager", relation: "Handled the floor access review", initials: "FH", statement: "The access system shows no unauthorised entry. The suite was secure." }
    ],
    evidence: [
      { id: "bathroom-scene", title: "Bathroom Scene", type: "Scene", description: "Harith lies beside a cracked glass partition. The injury is inconsistent with a simple slip, and one cufflink is missing." },
      { id: "settlement", title: "Settlement Agreement", type: "Document", description: "Page 12 uses a different printer profile and contains a clause redirecting RM2.4 million to an unfamiliar consultancy." },
      { id: "keycard-log", title: "Suite Keycard Log", time: "11:18 PM", type: "Access Log", description: "A master housekeeping credential opens Suite 1806 after the meeting has ended." },
      { id: "service-lift", title: "Service Lift Camera", time: "11:15 PM", type: "Video", description: "A person in a dark suit enters the service lift carrying a document envelope. The face is hidden by the camera angle." },
      { id: "lobby-cam", title: "Lobby Camera", time: "11:12 PM", type: "Video", description: "Nisha leaves through the main lobby and enters a waiting car. She does not return before police arrive." },
      { id: "printer-log", title: "Business Centre Printer Log", time: "10:51 PM", type: "Digital", description: "A replacement Page 12 is printed using Lucas's hotel guest-login token shortly before the meeting ends." },
      { id: "airport-call", title: "Airport Car Call", time: "11:16 PM", type: "Audio", description: "A recorded hotel call confirms Aina was speaking with the transport desk from the lobby during the service-lift entry." },
      { id: "master-key", title: "Master Key Checkout", time: "11:09 PM", type: "Access Log", description: "Fikri temporarily signs out a housekeeping master card for what he later describes as a routine door test." },
      { id: "cufflink", title: "Silver Cufflink", type: "Physical", description: "Harith's missing cufflink is recovered beneath the desk, not in the bathroom, suggesting the struggle began near the documents." },
      { id: "consultancy", title: "Consultancy Registry", type: "Financial", description: "The consultancy named on the altered page is controlled through a nominee linked to Lucas's older brother." }
    ],
    motiveOptions: [
      { id: "client-pressure", label: "Pressure from a client to bury the settlement" },
      { id: "career-conflict", label: "Career resentment inside the legal team" },
      { id: "settlement-fraud", label: "Conceal a fraudulent RM2.4 million diversion" },
      { id: "security-cover", label: "Hide a hotel security failure" }
    ]
  },
  {
    id: "CZ007",
    title: "BLACKOUT",
    kicker: "GALLERY 2",
    location: "Lorong Cahaya Gallery, George Town",
    scene: "Gallery 2",
    victim: "Lim Jian Wei",
    victimAge: 52,
    victimRole: "Gallery Owner",
    briefing:
      "During a seven-minute blackout at a private exhibition, gallery owner Lim Jian Wei is found dead beside a damaged painting. The emergency lights failed only in Gallery 2, and one artwork appears to have been switched before the power returned.",
    objective:
      "Use the blackout timeline, artwork records, and staff movements to identify who used the darkness to protect a forgery scheme.",
    difficulty: "DETECTIVE",
    estimatedMinutes: 10,
    suspects: [
      { id: "sofia", name: "Sofia Rahman", age: 37, role: "Gallery Curator", relation: "Managed the exhibition inventory", initials: "SR", statement: "I was in the foyer calming guests when the lights failed. I never entered Gallery 2." },
      { id: "dev", name: "Dev Anand Krishnan", age: 34, role: "Artist", relation: "Had a disputed work in the exhibition", initials: "DK", statement: "Jian Wei threatened to pull my painting. I left the gallery before the blackout." },
      { id: "elaine", name: "Elaine Teoh", age: 46, role: "Collector", relation: "Major buyer and donor", initials: "ET", statement: "I stayed with the guests in the courtyard. I did not touch any artwork." },
      { id: "khairul", name: "Khairul Anwar", age: 32, role: "Electrical Contractor", relation: "Installed the emergency lighting", initials: "KA", statement: "The failure was not caused by my work. I was checking the main board downstairs." }
    ],
    evidence: [
      { id: "gallery-scene", title: "Gallery 2 Scene", type: "Scene", description: "Jian Wei is found near a damaged frame. A slim metal hanging tool lies behind the plinth, wiped except for a trace of varnish." },
      { id: "blackout-log", title: "Power Controller Log", time: "9:14–9:21 PM", type: "Digital", description: "Main power remained stable. Only Gallery 2's local lighting circuit and emergency battery were manually disabled." },
      { id: "foyer-video", title: "Foyer Phone Video", time: "9:16 PM", type: "Video", description: "A guest's phone video shows Elaine, Dev and Khairul in the foyer area during most of the blackout. Sofia is not visible." },
      { id: "inventory", title: "Inventory Sheet", type: "Document", description: "The painting listed as Lot 17 has a serial number that differs by one digit from the work hanging after the blackout." },
      { id: "uv-photo", title: "UV Examination", type: "Forensic Image", description: "The post-blackout Lot 17 shows modern fluorescent underpainting inconsistent with the artist's documented materials." },
      { id: "crate-seal", title: "Storage Crate Seal", type: "Physical", description: "A supposedly unopened reserve-art crate has a fresh replacement security seal from the curator's inventory desk." },
      { id: "curator-access", title: "Curator Door Access", time: "9:13 PM", type: "Access Log", description: "Sofia's staff credential opens the back preparation room one minute before the local blackout begins." },
      { id: "insurance-email", title: "Insurance Email", type: "Document", description: "Jian Wei had arranged an independent authenticity review for several high-value works the next morning." },
      { id: "sales-ledger", title: "Private Sales Ledger", type: "Financial", description: "Three prior works catalogued by Sofia were sold through an offshore intermediary at unusually high margins." },
      { id: "varnish-trace", title: "Varnish Trace", type: "Forensic", description: "Varnish on the hanging tool matches the replacement Lot 17 and a residue stain on Sofia's exhibition gloves." }
    ],
    motiveOptions: [
      { id: "artist-dispute", label: "Retaliation over a disputed artwork" },
      { id: "collector-pressure", label: "Protect a major collector from scandal" },
      { id: "forgery-fraud", label: "Conceal a profitable art-forgery scheme" },
      { id: "electrical-negligence", label: "Hide defective emergency lighting work" }
    ]
  }

];

export function getCase(caseId: string) {
  return cases.find((item) => item.id === caseId);
}
