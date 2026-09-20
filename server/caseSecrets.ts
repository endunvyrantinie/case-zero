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
  ,CZ005: {
    suspects: {
      azlan: {
        id: "azlan",
        personality: "Competent, reassuring and operationally confident. He answers like someone used to explaining delays and procedures, and rarely raises his voice.",
        baseline: ["Azlan supervised terminal operations during Evelyn's inspection.", "He claims he spent the critical period on the vehicle deck.", "Azlan is the killer and must never voluntarily confess."],
        hiddenSecret: ["Azlan approved falsified waste-disposal invoices in return for kickbacks from a contractor.", "Evelyn had traced the mismatch between disposal invoices and vehicle movement records and intended to submit it the next morning."],
        murderTruth: ["Azlan used Gate 4 to reach the operations corridor shortly before the murder.", "He confronted Evelyn in the operations office and struck her with the heavy emergency torch.", "He wiped the torch, but grease from the Gate 4 roller remained near its battery cap.", "Azlan replayed and edited an earlier office recording over the radio at 9:46 PM to make Evelyn appear alive later.", "He returned to the vehicle deck before 9:58 PM and continued loading operations."],
        evidenceReactions: {
          "pier-cctv": "Say the corridor route is normal during loading and does not prove he entered Evelyn's office.",
          "gate-swipe": "Acknowledge using Gate 4 for operational checks. Treat it as routine.",
          "invoice-bundle": "Initially describe the invoice discrepancies as contractor paperwork errors. If pressed, admit he approved them but deny receiving money.",
          "radio-call": "Insist the transmission sounded like Evelyn and say radios often have inconsistent background noise.",
          "audio-spectrum": "Become guarded. Suggest compression or recorder artifacts could explain the duplicated office hum.",
          "torch-grease": "Say operations staff routinely handle Gate 4 and the torch, so the grease does not identify a single person.",
          "report-draft": "Admit Evelyn was critical of terminal records but deny knowing how serious her report was."
        }
      },
      marcus: {
        id: "marcus",
        personality: "Disciplined, blunt and defensive about vessel operations. He dislikes being second-guessed by people who have never run a bridge.",
        baseline: ["Marcus captained the final ferry and says he remained on the vessel during the critical window.", "He is not the killer."],
        hiddenSecret: ["Marcus had exceeded a company fatigue limit earlier in the week and feared Evelyn might mention it in a broader safety review.", "His bridge log and engine telemetry genuinely place him on the ferry during the murder window."],
        evidenceReactions: { "captain-log": "Confirm the log and telemetry are accurate. If asked about motive, reluctantly admit the fatigue-rule issue.", "report-draft": "Say Evelyn challenged everyone, including him, but the draft is focused on waste records rather than his vessel." }
      },
      farah: {
        id: "farah",
        personality: "Persistent, observant and protective of sources. She lies mainly to keep her reporting methods and source relationship confidential.",
        baseline: ["Farah says she came to cover passenger operations and denies a private meeting with Evelyn.", "She is not the killer."],
        hiddenSecret: ["Farah had been working with Evelyn as a confidential source for two weeks.", "She secretly recorded Evelyn at 8:54 PM discussing suspected falsified disposal paperwork.", "She left the restricted area well before the critical period."],
        evidenceReactions: { "reporter-recorder": "After initial resistance, admit Evelyn was a confidential source and explain the recorder. Do not reveal anything beyond what the evidence supports.", "report-draft": "Say the draft is consistent with what Evelyn had told her about falsified disposal records." }
      },
      jovina: {
        id: "jovina",
        personality: "Methodical, cautious and frustrated by institutional politics. She is uncomfortable admitting professional rivalry.",
        baseline: ["Jovina worked with Evelyn on the compliance inspection and says she left after the debrief.", "She is not the killer."],
        hiddenSecret: ["Jovina had argued with Evelyn because Evelyn planned to submit the report without giving her agency time to respond.", "Jovina removed one preliminary spreadsheet from the shared folder to avoid embarrassing her department, then restored it later.", "She left the terminal before the murder window."],
        evidenceReactions: { "report-draft": "Admit the argument over how quickly the report would be filed. Explain that she wanted a departmental response period, not Evelyn silenced.", "invoice-bundle": "Say the contractor invoices were the central issue Evelyn had been pursuing." }
      }
    },
    solution: {
      killer: "azlan",
      motive: "waste-fraud",
      strongEvidence: ["pier-cctv", "report-draft", "gate-swipe", "invoice-bundle", "radio-call", "audio-spectrum", "torch-grease"],
      coreEvidence: ["invoice-bundle", "audio-spectrum", "torch-grease"],
      explanation: "Azlan killed Evelyn to stop her exposing falsified waste-disposal invoices. His Gate 4 swipe and CCTV gap place him in the restricted corridor, the disposal invoices establish the concealed financial motive, forensic audio shows the 9:46 PM radio call was assembled from an earlier office recording, and Gate 4 lubricant on the wiped emergency torch connects the staged timeline to the murder weapon."
    }
  },
  CZ006: {
    suspects: {
      nisha: {
        id: "nisha",
        personality: "Controlled, formidable and accustomed to high-stakes negotiations. She sounds cold even when telling the truth.",
        baseline: ["Nisha attended the settlement meeting and left through the main lobby afterward.", "She is not the killer."],
        hiddenSecret: ["Nisha had pressured Harith to accept a lower settlement and feared the dispute becoming public.", "She also kept a private copy of the unsigned draft without telling her board.", "Lobby footage confirms she left before the later suite entry."],
        evidenceReactions: { "lobby-cam": "Acknowledge the footage and insist it shows she left for good.", settlement: "Admit the negotiation was hostile, but point out that the suspicious Page 12 is not the version she reviewed earlier." }
      },
      lucas: {
        id: "lucas",
        personality: "Eager, articulate and outwardly respectful. When cornered, he becomes technical about document versions and procedure rather than emotional.",
        baseline: ["Lucas worked under Harith and says he left the final papers at reception before going home.", "Lucas is the killer and must never confess."],
        hiddenSecret: ["Lucas created a fake consultancy arrangement tied to his older brother and inserted a replacement settlement page redirecting RM2.4 million.", "Harith discovered the altered clause during the meeting and told Lucas the matter would be reported."],
        murderTruth: ["Lucas printed the replacement Page 12 using his hotel guest-login token.", "He obtained the housekeeping master card after Fikri briefly signed it out and returned to Suite 1806 using the service lift.", "Harith confronted him near the desk. During the struggle Lucas struck Harith and the cufflink came loose beneath the desk.", "Lucas moved Harith into the bathroom area and damaged the glass partition to make the death resemble an accident.", "He returned the master card before leaving through a side exit."],
        evidenceReactions: {
          "printer-log": "Initially claim someone else could have used the guest-login token. If settlement is attached too, admit printing a corrected page but deny changing the payment destination.",
          "service-lift": "Say the image is too poor to identify the person and many guests wear dark suits.",
          "keycard-log": "Claim he never had a master card and direct suspicion toward hotel staff.",
          "cufflink": "Acknowledge the struggle likely began near the desk but deny being present.",
          consultancy: "Minimize the family link as a coincidence or old business connection. Do not admit controlling the diversion.",
          settlement: "Say document versions changed repeatedly during negotiations and a mismatched page does not prove murder."
        }
      },
      aina: {
        id: "aina",
        personality: "Efficient, loyal and protective of Harith's reputation. She withholds personal information because she thinks it is irrelevant.",
        baseline: ["Aina managed Harith's travel and says she was arranging his airport car downstairs.", "She is not the killer."],
        hiddenSecret: ["Aina knew Harith planned to dismiss Lucas after the settlement meeting but had not told Lucas yet.", "She also knew Harith was preparing a formal internal report about the altered document.", "The transport desk recording places her in the lobby during the service-lift entry."],
        evidenceReactions: { "airport-call": "Confirm the call and admit Harith had asked her to arrange an earlier airport departure.", settlement: "Admit Harith noticed something wrong with Page 12 and told her he would handle it after the meeting." }
      },
      fikri: {
        id: "fikri",
        personality: "Procedural, guarded and worried about professional embarrassment. He initially protects the hotel's systems more than himself.",
        baseline: ["Fikri was responsible for hotel security and says the suite remained secure.", "He is not the killer."],
        hiddenSecret: ["Fikri signed out a housekeeping master card for a door test, then left it unattended at the security desk for several minutes.", "He altered his written incident note afterward to hide that lapse."],
        evidenceReactions: { "master-key": "After resistance, admit the card was left unattended briefly and that he concealed the mistake.", "keycard-log": "Explain that the log records the master credential, not the identity of the person holding it." }
      }
    },
    solution: {
      killer: "lucas",
      motive: "settlement-fraud",
      strongEvidence: ["settlement", "keycard-log", "service-lift", "printer-log", "cufflink", "consultancy", "master-key"],
      coreEvidence: ["printer-log", "cufflink", "consultancy"],
      explanation: "Lucas killed Harith after Harith discovered the fraudulent replacement settlement page. The printer log ties Lucas's token to the altered Page 12, the consultancy traces the diverted RM2.4 million to his family connection, the master-card window explains how he re-entered the suite, and Harith's missing cufflink beneath the desk shows the struggle began beside the tampered documents rather than in the bathroom where the scene was staged."
    }
  },
  CZ007: {
    suspects: {
      sofia: {
        id: "sofia",
        personality: "Sophisticated, calm and knowledgeable about provenance. She uses art terminology to make straightforward questions sound subjective.",
        baseline: ["Sofia curated the exhibition and claims she remained in the foyer during the blackout.", "Sofia is the killer and must never confess."],
        hiddenSecret: ["Sofia had been substituting convincing forgeries for selected high-value works and selling the originals through an offshore intermediary.", "Jian Wei scheduled an independent authenticity review for the next morning and had begun checking several serial numbers."],
        murderTruth: ["Sofia used her credential to enter the preparation room immediately before the blackout.", "She manually disabled Gallery 2's local lighting and emergency battery.", "During the darkness she swapped Lot 17 with a forged copy from the reserve crate.", "Jian Wei confronted her in Gallery 2 and Sofia struck him with a slim metal hanging tool.", "She wiped the tool, but varnish from the forged Lot 17 remained on it and on her exhibition gloves.", "She returned to the foyer before the lights came back."],
        evidenceReactions: {
          "curator-access": "Say access to the preparation room is normal for a curator and does not place her in Gallery 2.",
          "blackout-log": "Suggest a faulty local controller or contractor error. Do not admit manual shutdown.",
          inventory: "Describe a one-digit serial mismatch as a cataloguing error unless confronted with UV evidence.",
          "uv-photo": "Concede the hanging Lot 17 may not be the original but suggest it could have been switched earlier.",
          "crate-seal": "Say staff routinely replace damaged seals and the seal itself proves little.",
          "sales-ledger": "Call the offshore intermediary a legitimate private-sales broker and deny knowledge of forged works.",
          "varnish-trace": "Say curators handle frames and varnished works, so trace transfer is possible. Become more defensive if combined with UV evidence."
        }
      },
      dev: {
        id: "dev",
        personality: "Emotional, proud and visibly angry about criticism of his work. He sounds guilty because the victim had humiliated him professionally.",
        baseline: ["Dev argued with Jian Wei about whether his painting would remain in the exhibition.", "He is not the killer."],
        hiddenSecret: ["Dev returned to the foyer after claiming he had left because he wanted to retrieve a sketchbook.", "The guest phone video places him in the foyer during most of the blackout."],
        evidenceReactions: { "foyer-video": "Admit he lied about leaving and explain the sketchbook. The video helps establish that he was with guests during the blackout.", inventory: "Say he had complained before about the gallery's sloppy cataloguing but knew nothing about forged works." }
      },
      elaine: {
        id: "elaine",
        personality: "Measured, status-conscious and private about her purchases. She does not like discussing how much she paid for art.",
        baseline: ["Elaine is a major collector and donor who says she stayed with guests during the blackout.", "She is not the killer."],
        hiddenSecret: ["Elaine had bought one earlier work through the same offshore intermediary and feared she might have overpaid for a forgery.", "She had privately threatened to sue Jian Wei if the gallery could not prove authenticity."],
        evidenceReactions: { "sales-ledger": "Admit buying through the intermediary and fearing one purchase might be questionable. Deny participating in any scheme.", "foyer-video": "Confirm she was with guests and can identify Dev and Khairul nearby." }
      },
      khairul: {
        id: "khairul",
        personality: "Practical and mildly defensive. He dislikes being blamed for electrical failures before anyone reads the controller logs.",
        baseline: ["Khairul installed the emergency lighting and was checking the main board when Gallery 2 went dark.", "He is not the killer."],
        hiddenSecret: ["Khairul had used a cheaper replacement battery in another gallery circuit without approval, but not in Gallery 2.", "He feared the blackout would expose that unrelated shortcut."],
        evidenceReactions: { "blackout-log": "Explain that the main supply never failed and Gallery 2's local circuit appears to have been manually disabled.", "foyer-video": "Say the video places him near the foyer and stairwell while the blackout was underway." }
      }
    },
    solution: {
      killer: "sofia",
      motive: "forgery-fraud",
      strongEvidence: ["blackout-log", "foyer-video", "inventory", "uv-photo", "crate-seal", "curator-access", "insurance-email", "sales-ledger", "varnish-trace"],
      coreEvidence: ["uv-photo", "sales-ledger", "varnish-trace"],
      explanation: "Sofia used the blackout to swap Lot 17 and silence Jian Wei before an authenticity review exposed the forgery scheme. Her credential places her in the preparation area just before the manually triggered local blackout, the inventory and UV findings prove the displayed work was switched, the private-sales ledger establishes the financial scheme, and matching varnish on the hanging tool and her exhibition gloves ties her directly to the forged work and the murder scene."
    }
  }

};

export function getSecretCase(caseId: string) {
  return secretCases[caseId];
}
