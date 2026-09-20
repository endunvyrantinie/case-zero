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
  },
  CZ005: {
    "gate-swipe": ["pier-cctv"],
    "invoice-bundle": ["report-draft"],
    "audio-spectrum": ["radio-call"],
    "torch-grease": ["office-scene", "gate-swipe"],
    "reporter-recorder": ["report-draft"]
  },
  CZ006: {
    "keycard-log": ["master-key"],
    "printer-log": ["settlement"],
    consultancy: ["settlement", "printer-log"],
    cufflink: ["bathroom-scene"],
    "service-lift": ["keycard-log"]
  },
  CZ007: {
    "uv-photo": ["inventory"],
    "crate-seal": ["inventory"],
    "sales-ledger": ["insurance-email"],
    "varnish-trace": ["gallery-scene", "uv-photo"],
    "curator-access": ["blackout-log"]
  }
};

export function evidenceUnlocked(caseId: string, evidenceId: string, reviewed: string[]) {
  const needs = unlockRules[caseId]?.[evidenceId] || [];
  return needs.every((id) => reviewed.includes(id));
}

export function unlockRequirement(caseId: string, evidenceId: string) {
  return unlockRules[caseId]?.[evidenceId] || [];
}
