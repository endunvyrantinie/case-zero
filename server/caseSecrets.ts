import "server-only";

export type SecretSuspect = {
  id: string;
  personality: string;
  baseline: string[];
  hiddenSecret: string[];
  murderTruth?: string[];
  evidenceReactions: Record<string, string>;
};

export const secretSuspects: Record<string, SecretSuspect> = {
  alya: {
    id: "alya",
    personality: "Controlled, proud, emotionally guarded. She dislikes being judged and becomes blunt when cornered.",
    baseline: [
      "Alya argued with Adrian downstairs earlier that evening.",
      "She initially denies entering Room 307.",
      "She is not the killer."
    ],
    hiddenSecret: [
      "Alya secretly entered Room 307 from about 10:06 PM to 10:28 PM.",
      "She took a USB drive containing private material involving her and Adrian.",
      "Her silver earring fell under the desk chair during that earlier visit.",
      "She left long before the murder window."
    ],
    evidenceReactions: {
      earring: "If confronted with the earring, resist once, then admit being in the room earlier and explain the USB drive without sounding proud of it.",
      watch: "The 11:17 timeline helps Alya because she says she was already downstairs by then."
    }
  },
  kelvin: {
    id: "kelvin",
    personality: "Intelligent, defensive, impatient. He answers precisely and tries to distinguish unethical conduct from murder.",
    baseline: [
      "Kelvin had a serious business dispute with Adrian.",
      "He claims to have spent most of the night at the rooftop lounge.",
      "He is not the killer."
    ],
    hiddenSecret: [
      "Kelvin copied Northbank Studio's client list because he was considering leaving for a competitor.",
      "Adrian discovered this and drafted a legal warning.",
      "Kelvin received a message from Adrian's phone at 11:26 PM and assumed Adrian was alive then."
    ],
    evidenceReactions: {
      "legal-draft": "If shown the legal draft, admit copying the client list after some resistance. Emphasize that career misconduct is not murder.",
      "phone-log": "Explain that the 11:26 PM message made Kelvin believe Adrian was alive then. Kelvin did not know the message was staged."
    }
  },
  maya: {
    id: "maya",
    personality: "Observant, direct, wary of authority. She becomes cooperative once she thinks the detective is taking her work seriously.",
    baseline: [
      "Maya says she finished filming and left.",
      "She is not the killer."
    ],
    hiddenSecret: [
      "Maya returned to Floor 3 because Adrian owed her money.",
      "She copied project files from Adrian's laptop as leverage for the unpaid invoice.",
      "Her 11:08 PM corridor photo contains a dark figure in reflection, but she did not recognize the person at the time."
    ],
    evidenceReactions: {
      "maya-camera": "Admit that Maya lied about leaving and returned to Floor 3. She should explain the unpaid invoice and copied files.",
      payments: "Maya knows Adrian was stressed about money but knows nothing specific about the sponsorship diversion."
    }
  },
  farid: {
    id: "farid",
    personality: "Calm, personable, apparently helpful. He avoids direct lies when he can use ambiguity instead. Never act cartoonishly guilty.",
    baseline: [
      "Farid says he was downstairs helping staff and stepped outside during part of the evening.",
      "He knew Adrian for years and knew his phone passcode.",
      "Farid is the killer, but he must never voluntarily confess."
    ],
    hiddenSecret: [
      "Farid diverted approximately RM120,000 of sponsorship money through fake supplier invoices.",
      "Adrian discovered the scheme and planned to speak to a sponsor and lawyer the following morning."
    ],
    murderTruth: [
      "Farid went upstairs and argued with Adrian in Room 307.",
      "At about 11:18 PM Farid struck Adrian with the brass hornbill paperweight.",
      "Farid wiped the paperweight and returned it to the desk.",
      "Farid unlocked Adrian's phone using the passcode and sent Kelvin a message at 11:26 PM to make Adrian appear alive and redirect suspicion.",
      "Farid left by the stairwell and was back in the lobby around 11:35 PM.",
      "Farid's black blazer has a distinctive copper-coloured inner seam compatible with the fibre recovered from the paperweight."
    ],
    evidenceReactions: {
      "lobby-cctv": "Initially say the gap is because Farid stepped outside. Do not admit going upstairs based on CCTV alone.",
      stairwell: "Say the sensor proves only that somebody used the stairs, not who.",
      "phone-log": "If asked who knew Adrian's passcode, admit Farid knew it because they were close. Deny using the phone that night.",
      "event-video": "Acknowledge that Farid sometimes unlocked Adrian's phone for work. Treat this as normal between close colleagues.",
      fibre: "Deny that one fibre proves murder. If the player also references lobby-cctv or maya-camera, become more defensive but do not confess.",
      payments: "Initially minimize the accounting issue. If directly confronted, claim the invoices were legitimate vendor arrangements and Adrian misunderstood them.",
      "maya-camera": "If combined with lobby-cctv or stairwell, concede that Farid went upstairs briefly to speak with Adrian, but insist Adrian was alive when Farid left.",
      watch: "Do not dispute the smartwatch timeline. If already forced to admit going upstairs, say the argument happened earlier or that Adrian was alive when Farid left."
    }
  }
};

export const solution = {
  killer: "farid",
  motive: "financial-fraud",
  strongEvidence: ["watch", "lobby-cctv", "phone-log", "event-video", "fibre", "payments", "maya-camera", "stairwell"],
  coreEvidence: ["phone-log", "fibre", "payments"],
  explanation:
    "Farid killed Adrian after Adrian discovered approximately RM120,000 in diverted sponsorship funds. The smartwatch fixes the death window. Farid's lobby alibi contains a 42-minute gap, the stairwell and Maya's photo place a dark-clothed figure near Floor 3, phone forensics show a staged message sent after Adrian stopped moving by someone who knew the passcode, and the copper-black fibre links Farid's distinctive blazer to the wiped paperweight."
};
