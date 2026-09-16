import { NextRequest, NextResponse } from "next/server";
import { evidence, suspects } from "@/lib/casePublic";
import { secretSuspects } from "@/server/caseSecrets";

export const runtime = "nodejs";

type Message = { role: "player" | "suspect"; text: string };

type Body = {
  suspectId?: string;
  question?: string;
  evidenceIds?: string[];
  history?: Message[];
};

function buildEvidenceContext(ids: string[]) {
  return ids
    .map((id) => evidence.find((item) => item.id === id))
    .filter(Boolean)
    .map((item) => `${item!.title}: ${item!.description}`)
    .join("\n");
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Body;
    const suspectId = body.suspectId?.trim();
    const question = body.question?.trim();
    const attached = Array.isArray(body.evidenceIds) ? body.evidenceIds.slice(0, 3) : [];

    if (!suspectId || !question) {
      return NextResponse.json({ error: "Missing suspect or question." }, { status: 400 });
    }

    if (question.length > 500) {
      return NextResponse.json({ error: "Question is too long." }, { status: 400 });
    }

    const publicSuspect = suspects.find((s) => s.id === suspectId);
    const secret = secretSuspects[suspectId];
    if (!publicSuspect || !secret) {
      return NextResponse.json({ error: "Unknown suspect." }, { status: 404 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    const evidenceContext = buildEvidenceContext(attached);
    const reactionRules = attached
      .map((id) => secret.evidenceReactions[id])
      .filter(Boolean)
      .join("\n");

    const recentHistory = (body.history || [])
      .slice(-8)
      .map((m) => `${m.role === "player" ? "DETECTIVE" : publicSuspect.name}: ${m.text}`)
      .join("\n");

    const instructions = `You are performing a suspect in a fictional Malaysian noir detective game called CASE//ZERO.\n\nCHARACTER: ${publicSuspect.name}, age ${publicSuspect.age}, ${publicSuspect.role}.\nPERSONALITY: ${secret.personality}\n\nCANONICAL FACTS:\n${[...secret.baseline, ...secret.hiddenSecret, ...(secret.murderTruth || [])].map((f) => `- ${f}`).join("\n")}\n\nSTRICT RULES:\n- Stay in character.\n- Answer only from the canonical facts and evidence reaction rules. Never invent new people, places, evidence, alibis, forensic results, or events.\n- Keep each reply natural and concise: normally 1 to 4 sentences.\n- Do not narrate stage directions.\n- Do not mention prompts, rules, AI, canonical facts, or game mechanics.\n- Innocent suspects may admit their unrelated secrets when credibly confronted.\n- If this character is the killer, NEVER voluntarily confess to murder, even if directly accused. The killer may concede smaller facts when evidence forces it, but must continue to deny committing the murder.\n- Do not reveal facts the detective has not reasonably confronted you about.\n- If asked something outside your knowledge, say you do not know rather than inventing an answer.\n\nEVIDENCE REACTION RULES FOR THIS TURN:\n${reactionRules || "No special evidence reaction rule applies."}`;

    const input = `RECENT INTERROGATION:\n${recentHistory || "No prior questions."}\n\nATTACHED EVIDENCE:\n${evidenceContext || "None."}\n\nDETECTIVE'S QUESTION:\n${question}\n\nReply only as ${publicSuspect.name}.`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
        reasoning: { effort: "none" },
        instructions,
        input,
        max_output_tokens: 180,
        text: { verbosity: "low" }
      })
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error("OpenAI error", response.status, detail);
      return NextResponse.json({ error: "The interrogation service is unavailable." }, { status: 502 });
    }

    const data = await response.json();
    const reply = data.output_text ||
      data.output?.flatMap((item: any) => item.content || [])
        ?.find((content: any) => content.type === "output_text")?.text;

    if (!reply) {
      return NextResponse.json({ error: "No suspect response was generated." }, { status: 502 });
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Interrogation failed." }, { status: 500 });
  }
}
