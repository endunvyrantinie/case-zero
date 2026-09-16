import { NextRequest, NextResponse } from "next/server";
import { getSecretCase } from "@/server/caseSecrets";
import { getAuthenticatedGameSession } from "@/server/auth";

export const runtime = "nodejs";

type Body = { caseId?: string; suspectId?: string; motiveId?: string; evidenceIds?: string[] };

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Body;
    const caseId = body.caseId?.trim();
    if (!caseId) return NextResponse.json({ error: "Missing case." }, { status: 400 });

    const auth = await getAuthenticatedGameSession(request, caseId);
    if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const secretCase = getSecretCase(caseId);
    if (!secretCase) return NextResponse.json({ error: "Unknown case." }, { status: 404 });
    const solution = secretCase.solution;
    const selected = Array.isArray(body.evidenceIds) ? [...new Set(body.evidenceIds)].slice(0, 5) : [];
    const reviewedEvidence = Array.isArray(auth.progress.reviewed_evidence) ? auth.progress.reviewed_evidence : [];
    if (selected.some((id) => !reviewedEvidence.includes(id))) return NextResponse.json({ error: "Only reviewed evidence can support an accusation." }, { status: 403 });

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
    const current = auth.progress;

    const { error: updateError } = await auth.supabase.from("case_progress").update({
      solved: Boolean(current.solved || solved),
      best_score: Math.max(current.best_score || 0, score),
      attempts: (current.attempts || 0) + 1,
      last_played_at: new Date().toISOString(),
      attempt_closed: true,
      updated_at: new Date().toISOString()
    }).eq("user_id", auth.user.id).eq("case_id", caseId);

    if (updateError) console.error("Progress update failed", updateError);

    return NextResponse.json({
      solved,
      score,
      checks: { suspect: suspectCorrect, motive: motiveCorrect, evidence: strongCount >= 3, forensicCore: coreCount >= 1 },
      message: solved ? "CASE CLOSED. Your accusation is supported by motive, opportunity, and evidence." : suspectCorrect ? "You identified the right suspect, but your case is not yet strong enough to close." : "The evidence does not support your accusation.",
      explanation: solved ? solution.explanation : undefined
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not submit accusation." }, { status: 500 });
  }
}
