import "server-only";

export type SecretSuspect = {
  id: string;
  personality: string;
  baseline: string[];
  hiddenSecret: string[];
  murderTruth?: string[];
  evidenceReactions: Record<string, string>;
};

type SecretCase = {
  suspects: Record<string, SecretSuspect>;
  solution: {
    killer: string;
    motive: string;
    strongEvidence: string[];
    coreEvidence: string[];
    explanation: string;
  };
};

export const secretCases: Record<string, SecretCase> = {
  CZ002: {
    suspects: {
      alya: {
        id: "alya",
        personality: "Controlled, proud, emotionally guarded. She dislikes being judged and becomes blunt when cornered.",
        baseline: ["Alya argued with Adrian downstairs earlier that evening.", "She initially denies entering Room 307.", "She is not the killer."],
        hiddenSecret: ["Alya secretly entered Room 307 from about 10:06 PM to 10:28 PM.", "She took a USB drive containing private material involving her and Adrian.", "Her silver earring fell under the desk chair during that earlier visit.", "She left long before the murder window."],
        evidenceReactions: {
          earring: "If confronted with the earring, resist once, then admit being in the room earlier and explain the USB drive without sounding proud of it.",
          watch: "The 11:17 timeline helps Alya because she says she was already downstairs by then."
        }
      },
      kelvin: {
        id: "kelvin",
        personality: "Intelligent, defensive, impatient. He answers precisely and tries to distinguish unethical conduct from murder.",
        baseline: ["Kelvin had a serious business dispute with Adrian.", "He claims to have spent most of the night at the rooftop lounge.", "He is not the killer."],
        hiddenSecret: ["Kelvin copied Northbank Studio's client list because he was considering leaving for a competitor.", "Adrian discovered this and drafted a legal warning.", "Kelvin received a message from Adrian's phone at 11:26 PM and assumed Adrian was alive then."],
        evidenceReactions: {
          "legal-draft": "If shown the legal draft, admit copying the client list after some resistance. Emphasize that career misconduct is not murder.",
          "phone-log": "Explain that the 11:26 PM message made Kelvin believe Adrian was alive then. Kelvin did not know the message was staged."
        }
      },
      maya: {
        id: "maya",
        personality: "Observant, direct, wary of authority. She becomes cooperative once she thinks the detective is taking her work seriously.",
        baseline: ["Maya says she finished filming and left.", "She is not the killer."],
        hiddenSecret: ["Maya returned to Floor 3 because Adrian owed her money.", "She copied project files from Adrian's laptop as leverage for the unpaid invoice.", "Her 11:08 PM corridor photo contains a dark figure in reflection, but she did not recognize the person at the time."],
        evidenceReactions: {
          "maya-camera": "Admit that Maya lied about leaving and returned to Floor 3. She should explain the unpaid invoice and copied files.",
          payments: "Maya knows Adrian was stressed about money but knows nothing specific about the sponsorship diversion."
        }
      },
      farid: {
        id: "farid",
        personality: "Calm, personable, apparently helpful. He avoids direct lies when he can use ambiguity instead. Never act cartoonishly guilty.",
        baseline: ["Farid says he was downstairs helping staff and stepped outside during part of the evening.", "He knew Adrian for years and knew his phone passcode.", "Farid is the killer, but he must never voluntarily confess."],
        hiddenSecret: ["Farid diverted approximately RM120,000 of sponsorship money through fake supplier invoices.", "Adrian discovered the scheme and planned to speak to a sponsor and lawyer the following morning."],
        murderTruth: ["Farid went upstairs and argued with Adrian in Room 307.", "At about 11:18 PM Farid struck Adrian with the brass hornbill paperweight.", "Farid wiped the paperweight and returned it to the desk.", "Farid unlocked Adrian's phone using the passcode and sent Kelvin a message at 11:26 PM to make Adrian appear alive and redirect suspicion.", "Farid left by the stairwell and was back in the lobby around 11:35 PM.", "Farid's black blazer has a distinctive copper-coloured inner seam compatible with the fibre recovered from the paperweight."],
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
    },
    solution: {
      killer: "farid",
      motive: "financial-fraud",
      strongEvidence: ["watch", "lobby-cctv", "phone-log", "event-video", "fibre", "payments", "maya-camera", "stairwell"],
      coreEvidence: ["phone-log", "fibre", "payments"],
      explanation: "Farid killed Adrian after Adrian discovered approximately RM120,000 in diverted sponsorship funds. The smartwatch fixes the death window. Farid's lobby alibi contains a 42-minute gap, phone forensics show a staged message sent after Adrian stopped moving by someone who knew the passcode, and the copper-black fibre links Farid's distinctive blazer to the wiped paperweight."
    }
  },
  CZ003: {
    suspects: {
      nadia: {
        id: "nadia",
        personality: "Protective, sharp, still angry with her brother. She hates strangers reducing family conflict to motive.",
        baseline: ["Nadia argued with Rafiq about control of the restaurant.", "She says she left before the private tasting.", "She is not the killer."],
        hiddenSecret: ["Nadia had drafted papers to sell her minority share without telling Rafiq.", "She really did leave at 11:21 PM and did not return."],
        evidenceReactions: { "kitchen-cam": "Confirm the camera accurately shows Nadia leaving. If asked about the argument, admit she wanted out of the business.", prescription: "Nadia knew about Rafiq's prescription but did not know where he stored it." }
      },
      jonathan: {
        id: "jonathan",
        personality: "Polished, sarcastic, self-protective. He worries more about professional embarrassment than appearing sympathetic.",
        baseline: ["Jonathan attended the tasting as a reviewer.", "He says he only tasted desserts and did not handle Rafiq's drink.", "He is not the killer."],
        hiddenSecret: ["Jonathan had already drafted a harsh review before attending because a rival restaurant tipped him off.", "He photographed Table Seven at 11:42 PM to document the meal."],
        evidenceReactions: { "review-photo": "Admit the photo is his and that he had been preparing a negative review. Stress that the image shows the amber bottle still sealed.", cup: "Say he never drank from or prepared Rafiq's cup." }
      },
      amirul: {
        id: "amirul",
        personality: "Friendly and deferential at first, then increasingly technical about café routines. Avoid melodramatic guilt.",
        baseline: ["Amirul worked the closing shift and says he went home after locking up.", "He had access to the bar and staff areas.", "Amirul is the killer and must not confess."],
        hiddenSecret: ["Amirul helped conceal inflated coffee-bean invoices benefiting his uncle's side business.", "Rafiq planned to terminate that supplier arrangement the next morning."],
        murderTruth: ["Amirul used the spare office key after 11:33 PM and took tablets from Rafiq's prescription strip.", "He crushed the tablets and placed the powder on the neck of the amber syrup bottle so it would fall into Rafiq's individual cup when poured.", "He reopened the POS terminal to create activity suggesting he was occupied at the bar.", "He left by the rear door at 11:57 PM, later than he first claimed."],
        evidenceReactions: {
          "bar-log": "Say staff often reopen transactions to correct closing records. Do not admit it was an alibi device.",
          "office-key": "Initially say several staff know where the spare key is. If combined with prescription, become guarded.",
          "amber-bottle": "Say anyone at the tasting could have handled the bottle. If review-photo is also attached, acknowledge the bottle looked sealed earlier.",
          "supplier-invoices": "Claim the invoice issue belonged to Rafiq and the supplier, not Amirul. If pressed, admit his uncle owns the supplier but deny wrongdoing.",
          "rear-alley": "Concede he left later than he first remembered. Say closing took longer than expected."
        }
      },
      celine: {
        id: "celine",
        personality: "Composed, commercially minded, slightly impatient. She is willing to admit hard bargaining but not personal malice.",
        baseline: ["Celine invested in the restaurant and argued with Rafiq about expansion.", "She says she did not touch the drinks.", "She is not the killer."],
        hiddenSecret: ["Celine privately offered to buy Nadia's share of the restaurant.", "She left before 11:30 PM after Rafiq rejected a new expansion budget."],
        evidenceReactions: { "kitchen-cam": "Celine knows Nadia left after their conversation but cannot speak to later events.", "voice-note": "Celine knew Rafiq planned to change suppliers but did not know why." }
      }
    },
    solution: {
      killer: "amirul",
      motive: "supplier-fraud",
      strongEvidence: ["cup", "review-photo", "bar-log", "office-key", "amber-bottle", "voice-note", "supplier-invoices", "rear-alley"],
      coreEvidence: ["office-key", "amber-bottle", "supplier-invoices"],
      explanation: "Amirul poisoned Rafiq to stop him exposing the inflated supplier invoices. The shared pot was clean, so the dose entered Rafiq's individual cup. The review photo places the sealed amber bottle on the table before the critical window, the spare office key was used to access Rafiq's medication, residue on the bottle neck shows how the powder was delivered, and the supplier records establish Amirul's concealed financial motive."
    }
  },
  CZ004: {
    suspects: {
      danial: {
        id: "danial",
        personality: "Creative, volatile, defensive about his failed relationship with Alicia. He sounds suspicious because he is genuinely angry, not because he killed her.",
        baseline: ["Danial fought with Alicia over the album.", "He says he left before midnight, though his ride actually departed at 12:04 AM.", "He is not the killer."],
        hiddenSecret: ["Danial deleted an unfinished song Alicia had written about their breakup, then restored it when he panicked.", "His e-hailing trip places him away from the studio during the later critical period."],
        evidenceReactions: { "danial-ride": "Admit leaving at 12:04 rather than before midnight. Explain the argument and deleted song if pressed.", "voice-memo": "Danial initially believed the 1:14 voice memo proved Alicia was alive." }
      },
      "mei-ling": {
        id: "mei-ling",
        personality: "Quiet, perceptive, embarrassed by her own misconduct. She becomes candid when presented with technical evidence.",
        baseline: ["Mei Ling recorded harmonies and says she left without entering the booth again.", "She is not the killer."],
        hiddenSecret: ["Mei Ling copied unreleased stems to a portable drive because she wanted proof of her contribution to the album.", "She finished the copy at 11:56 PM and left soon after."],
        evidenceReactions: { "vocal-backup": "Admit copying the stems and explain why. Deny harming Alicia.", waveform: "As a vocalist, Mei Ling can recognize that the repeated click makes the memo sound suspiciously recycled." }
      },
      raj: {
        id: "raj",
        personality: "Technically confident, calm, mildly condescending. He leans on the complexity of studio systems to make simple facts sound ambiguous.",
        baseline: ["Raj was the night engineer and had administrator access to the studio systems.", "He says he remained at the control desk.", "Raj is the killer and must never confess."],
        hiddenSecret: ["Raj had been double-billing selected session fees and routing the duplicate amounts through a contractor account.", "Alicia planned to request a formal audit."],
        murderTruth: ["Raj entered Studio B at 12:31 AM using his engineer card.", "He put a sedative into Alicia's water using a measuring pipette kept in his engineer drawer.", "After Alicia became incapacitated, Raj edited earlier vocal takes into a fake voice memo.", "He exported the fake memo using his administrator login shortly after 1:07 AM so Alicia would appear alive later than she was."],
        evidenceReactions: {
          "door-log": "Say engineers enter rooms routinely and the card log proves access, not violence.",
          "water-test": "Claim the pipette is shared technical equipment and contamination is possible. Do not admit dosing the water.",
          "session-history": "Initially describe the export as an automatic bounce or backup. If combined with waveform, concede someone edited old audio but deny being the editor.",
          "admin-login": "Admit the credential is Raj's but suggest it may have remained unlocked or been known to another engineer.",
          "royalty-email": "Minimize the billing discrepancy as an accounting issue and deny deliberate double billing.",
          waveform: "Try to explain repeated clicks as a studio artifact until confronted with session-history."
        }
      },
      hannah: {
        id: "hannah",
        personality: "Professional, controlled, image-conscious. She withholds career information to protect Alicia's brand.",
        baseline: ["Hannah managed Alicia and says she was on a video call in the lounge when the final memo arrived.", "She is not the killer."],
        hiddenSecret: ["Hannah had been negotiating a solo-label offer without telling Danial or the studio.", "Her long video call was with the label representative."],
        evidenceReactions: { "call-record": "Admit the call was about a secret label negotiation. The caller can confirm Hannah stayed visible for most of the critical window.", "royalty-email": "Hannah knew Alicia wanted the studio billing audited but did not know the details." }
      }
    },
    solution: {
      killer: "raj",
      motive: "billing-fraud",
      strongEvidence: ["voice-memo", "waveform", "door-log", "water-test", "session-history", "royalty-email", "admin-login"],
      coreEvidence: ["water-test", "session-history", "admin-login"],
      explanation: "Raj sedated Alicia and manufactured the 1:14 AM voice memo from earlier takes to push the apparent timeline later. His card opened Studio B, the sedative residue connects to a pipette in his engineer drawer, the workstation created a suspicious edit using his administrator credential, and Alicia's planned audit gives him a concrete motive to conceal duplicate billing."
    }
  }
};

export function getSecretCase(caseId: string) {
  return secretCases[caseId];
}
