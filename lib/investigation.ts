export const unlockRules: Record<string, Record<string, string[]>> = {
  CZ002: {
    stairwell: ["lobby-cctv"],
    "phone-log": ["watch"],
    "event-video": ["phone-log"],
    fibre: ["scene", "maya-camera"],
    payments: ["legal-draft"]
  },
  CZ003: {
    "office-key": ["prescription"],
    "amber-bottle": ["cup", "review-photo"],
    "supplier-invoices": ["voice-note"],
    "rear-alley": ["bar-log"]
  },
  CZ004: {
    waveform: ["voice-memo"],
    "water-test": ["booth"],
    "session-history": ["waveform"],
    "admin-login": ["session-history"],
    "royalty-email": ["door-log"]
  }
};

export function evidenceUnlocked(caseId: string, evidenceId: string, reviewed: string[]) {
  const needs = unlockRules[caseId]?.[evidenceId] || [];
  return needs.every((id) => reviewed.includes(id));
}

export function unlockRequirement(caseId: string, evidenceId: string) {
  return unlockRules[caseId]?.[evidenceId] || [];
}
