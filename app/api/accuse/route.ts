import { NextRequest, NextResponse } from "next/server";
import { solution } from "@/server/caseSecrets";

export const runtime = "nodejs";

type Body = {
  suspectId?: string;
  motiveId?: string;
  evidenceIds?: string[];
};

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Body;
  const selected = Array.isArray(body.evidenceIds) ? [...new Set(body.evidenceIds)].slice(0, 5) : [];

  const suspectCorrect = body.suspectId === solution.killer;
  const motiveCorrect = body.motiveId === solution.motive;
  const strongCount = selected.filter((id) => solution.strongEvidence.includes(id)).length;
  const coreCount = selected.filter((id) => solution.coreEvidence.includes(id)).length;

  let score = 0;
  if (suspectCorrect) score += 45;
  if (motiveCorrect) score += 20;
  score += Math.min(25, strongCount * 7);
  if (coreCount >= 2) score += 10;
  score = Math.min(100, score);

  const solved = suspectCorrect && motiveCorrect && strongCount >= 3 && coreCount >= 1;

  return NextResponse.json({
    solved,
    score,
    checks: {
      suspect: suspectCorrect,
      motive: motiveCorrect,
      evidence: strongCount >= 3,
      forensicCore: coreCount >= 1
    },
    message: solved
      ? "CASE CLOSED. Your accusation is supported by motive, opportunity, and evidence."
      : suspectCorrect
        ? "You identified the right suspect, but your case is not yet strong enough to close."
        : "The evidence does not support your accusation.",
    explanation: solved ? solution.explanation : undefined
  });
}
