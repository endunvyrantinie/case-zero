"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import type { CasePublic } from "@/lib/cases";
import { getSupabase, type CloudProgress } from "@/lib/supabase";

type ChatMessage = { role: "player" | "suspect"; text: string };
type Verdict = { solved: boolean; score: number; checks: { suspect: boolean; motive: boolean; evidence: boolean; forensicCore: boolean }; message: string; explanation?: string };

const ATTEMPT_SECONDS = 600;

export default function Game({ caseData }: { caseData: CasePublic }) {
  const router = useRouter();
  const { suspects, evidence, motiveOptions } = caseData;
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [activeSuspect, setActiveSuspect] = useState(suspects[0].id);
  const [question, setQuestion] = useState("");
  const [attached, setAttached] = useState<string[]>([]);
  const [chats, setChats] = useState<Record<string, ChatMessage[]>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [notes, setNotes] = useState("");
  const [accused, setAccused] = useState(suspects[0].id);
  const [motive, setMotive] = useState(motiveOptions[0].id);
  const [proof, setProof] = useState<string[]>([]);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [bestScore, setBestScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [solvedBefore, setSolvedBefore] = useState(false);
  const [deadlineMs, setDeadlineMs] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(ATTEMPT_SECONDS);
  const [attemptClosed, setAttemptClosed] = useState(false);
  const notesHydrated = useRef(false);

  const suspect = useMemo(() => suspects.find((s) => s.id === activeSuspect)!, [activeSuspect, suspects]);
  const history = chats[activeSuspect] || [];
  const totalQuestions = Object.values(chats).flat().filter((m) => m.role === "player").length;
  const timedOut = ready && secondsLeft <= 0 && !attemptClosed;

  useEffect(() => {
    const supabase = getSupabase();
    let mounted = true;

    async function boot() {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!mounted) return;
      if (!sessionData.session) {
        router.replace(`/login?next=/case/${caseData.id}`);
        return;
      }
      setSession(sessionData.session);

      const userId = sessionData.session.user.id;
      const { data, error } = await supabase.from("case_progress").select("*").eq("user_id", userId).eq("case_id", caseData.id).maybeSingle();
      if (error) {
        setApiError("Could not load your saved investigation. Check the Supabase database setup.");
        setReady(true);
        return;
      }

      const row = data as CloudProgress | null;
      setBestScore(row?.best_score || 0);
      setAttempts(row?.attempts || 0);
      setSolvedBefore(Boolean(row?.solved));

      const existingDeadline = row?.attempt_deadline_at ? new Date(row.attempt_deadline_at).getTime() : 0;
      const canResume = Boolean(row && !row.attempt_closed && existingDeadline > Date.now());

      if (canResume && row) {
        setChats((row.chats || {}) as Record<string, ChatMessage[]>);
        setNotes(row.notes || "");
        setDeadlineMs(existingDeadline);
        setAttemptClosed(false);
      } else {
        const start = new Date();
        const deadline = new Date(start.getTime() + ATTEMPT_SECONDS * 1000);
        const payload = {
          user_id: userId,
          case_id: caseData.id,
          solved: row?.solved || false,
          best_score: row?.best_score || 0,
          attempts: row?.attempts || 0,
          last_played_at: new Date().toISOString(),
          notes: "",
          chats: {},
          attempt_started_at: start.toISOString(),
          attempt_deadline_at: deadline.toISOString(),
          attempt_closed: false,
          updated_at: new Date().toISOString()
        };
        const { error: saveError } = await supabase.from("case_progress").upsert(payload, { onConflict: "user_id,case_id" });
        if (saveError) setApiError("Could not start the investigation. Check the Supabase database setup.");
        setChats({});
        setNotes("");
        setDeadlineMs(deadline.getTime());
        setAttemptClosed(false);
      }
      notesHydrated.current = true;
      setReady(true);
    }

    boot();
    return () => { mounted = false; };
  }, [caseData.id, router]);

  useEffect(() => {
    if (!deadlineMs || attemptClosed) return;
    function tick() { setSecondsLeft(Math.max(0, Math.ceil((deadlineMs - Date.now()) / 1000))); }
    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [deadlineMs, attemptClosed]);

  useEffect(() => {
    if (!ready || !session || !notesHydrated.current) return;
    const id = window.setTimeout(() => {
      getSupabase().from("case_progress").update({ notes, updated_at: new Date().toISOString() }).eq("user_id", session.user.id).eq("case_id", caseData.id).then(() => undefined);
    }, 500);
    return () => window.clearTimeout(id);
  }, [notes, ready, session, caseData.id]);

  async function saveChats(nextChats: Record<string, ChatMessage[]>) {
    if (!session) return;
    await getSupabase().from("case_progress").update({ chats: nextChats, notes, last_played_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("user_id", session.user.id).eq("case_id", caseData.id);
  }

  function toggleAttached(id: string) { if (!timedOut && !attemptClosed) setAttached((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev); }
  function toggleProof(id: string) { if (!timedOut && !attemptClosed) setProof((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 5 ? [...prev, id] : prev); }

  async function askSuspect() {
    const clean = question.trim();
    if (!clean || loading || timedOut || attemptClosed || !session) return;
    setLoading(true); setApiError("");
    const playerMessage: ChatMessage = { role: "player", text: clean };
    const nextHistory = [...history, playerMessage];
    const optimisticChats = { ...chats, [activeSuspect]: nextHistory };
    setChats(optimisticChats);
    setQuestion("");

    try {
      const res = await fetch("/api/interrogate", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ caseId: caseData.id, suspectId: activeSuspect, question: clean, evidenceIds: attached, history })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Interrogation failed.");
      const finalChats = { ...optimisticChats, [activeSuspect]: [...nextHistory, { role: "suspect" as const, text: data.reply }] };
      setChats(finalChats);
      await saveChats(finalChats);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Interrogation failed.");
      await saveChats(optimisticChats);
    } finally { setLoading(false); }
  }

  async function submitAccusation() {
    if (!session || timedOut || attemptClosed) return;
    setVerdict(null); setApiError("");
    try {
      await saveChats(chats);
      const res = await fetch("/api/accuse", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ caseId: caseData.id, suspectId: accused, motiveId: motive, evidenceIds: proof })
      });
      const result = await res.json() as Verdict & { error?: string };
      if (!res.ok) throw new Error(result.error || "Could not submit accusation.");
      setVerdict(result);
      setAttemptClosed(true);
      setBestScore((old) => Math.max(old, result.score));
      setAttempts((old) => old + 1);
      if (result.solved) setSolvedBefore(true);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Could not submit accusation.");
    }
  }

  async function restartAttempt() {
    if (!session) return;
    const start = new Date();
    const deadline = new Date(start.getTime() + ATTEMPT_SECONDS * 1000);
    const { error } = await getSupabase().from("case_progress").update({
      notes: "",
      chats: {},
      attempt_started_at: start.toISOString(),
      attempt_deadline_at: deadline.toISOString(),
      attempt_closed: false,
      last_played_at: start.toISOString(),
      updated_at: start.toISOString()
    }).eq("user_id", session.user.id).eq("case_id", caseData.id);
    if (error) { setApiError("Could not restart the investigation."); return; }
    setNotes(""); setChats({}); setVerdict(null); setAttached([]); setProof([]); setQuestion(""); setApiError("");
    setDeadlineMs(deadline.getTime()); setSecondsLeft(ATTEMPT_SECONDS); setAttemptClosed(false); notesHydrated.current = true;
  }

  const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");

  if (!ready) return <main className="loading-screen"><div className="brand-mark">C//Z</div><div className="eyebrow">OPENING SECURE CASE FILE...</div></main>;

  return (
    <main className="game-shell">
      <nav className="game-nav"><Link href="/">← CASE LIBRARY</Link><div><span>{caseData.difficulty}</span><span>ATTEMPTS {attempts}</span>{bestScore > 0 && <span>BEST {bestScore}</span>}<strong className={`case-timer ${secondsLeft <= 60 ? "danger" : ""}`}>{minutes}:{seconds}</strong></div></nav>
      <header className="topbar"><div><div className="eyebrow">CASE//ZERO · {caseData.id} · {caseData.kicker}</div><h1>{caseData.title}</h1></div><div className="case-meta"><span>{caseData.location}</span><span>{caseData.scene}</span></div></header>

      {(timedOut || attemptClosed) && <section className={`lock-banner ${timedOut ? "expired" : "closed"}`}><div><div className="eyebrow">{timedOut ? "TIME EXPIRED" : verdict?.solved ? "CASE CLOSED" : "ATTEMPT CLOSED"}</div><h2>{timedOut ? "The investigation file is locked." : verdict?.solved ? "Your evidence has been filed." : "You only get one accusation per attempt."}</h2><p>{timedOut ? "Interrogation and accusation are disabled after 10:00. Start a fresh attempt to investigate again." : solvedBefore ? `Best score: ${bestScore}` : "Reopen the case for a fresh 10-minute investigation."}</p></div><button className="primary restart" onClick={restartAttempt}>START NEW 10:00 ATTEMPT</button></section>}

      <section className="hero panel"><div><div className="eyebrow">VICTIM</div><h2>{caseData.victim}</h2><p>{caseData.victimAge} · {caseData.victimRole}</p></div><div className="hero-copy"><p>{caseData.briefing}</p><p className="objective">OBJECTIVE: {caseData.objective}</p></div></section>

      <div className="case-status"><span>{suspects.length} SUSPECTS</span><span>{evidence.length} EVIDENCE ITEMS</span><span>{totalQuestions} QUESTIONS ASKED</span><span>CLOUD SAVE ON</span></div>

      <div className="layout">
        <section className="left-column">
          <div className="section-title"><span>01</span> SUSPECTS</div>
          <div className="suspect-grid">{suspects.map((s) => <button key={s.id} disabled={timedOut || attemptClosed} className={`suspect-card ${activeSuspect === s.id ? "active" : ""}`} onClick={() => { setActiveSuspect(s.id); setAttached([]); }}><div className="portrait">{s.initials}</div><div><strong>{s.name}</strong><small>{s.role}</small><small>{s.relation}</small></div><div className="question-count">{(chats[s.id] || []).filter((m) => m.role === "player").length}</div></button>)}</div>

          <div className="section-title"><span>02</span> EVIDENCE BOARD</div>
          <div className="evidence-grid">{evidence.map((e) => <article className={`evidence-card ${attached.includes(e.id) ? "attached" : ""}`} key={e.id} onClick={() => toggleAttached(e.id)}><div className="evidence-top"><span>{e.type}</span>{e.time && <b>{e.time}</b>}</div><h3>{e.title}</h3><p>{e.description}</p><div className="evidence-action">{attached.includes(e.id) ? "ATTACHED" : "CLICK TO CONFRONT"}</div></article>)}</div>
        </section>

        <aside className="right-column">
          <div className="interrogation panel">
            <div className="interrogation-head"><div className="portrait large">{suspect.initials}</div><div><div className="eyebrow">INTERROGATION</div><h2>{suspect.name}</h2><p>Initial statement: “{suspect.statement}”</p></div></div>
            <div className="chat">{history.length === 0 && <div className="empty-chat">Ask about timeline, motive, relationships, or confront the suspect with evidence.</div>}{history.map((m, i) => <div key={i} className={`bubble ${m.role}`}><span>{m.role === "player" ? "YOU" : suspect.name.toUpperCase()}</span>{m.text}</div>)}{loading && <div className="bubble suspect"><span>{suspect.name.toUpperCase()}</span>...</div>}</div>
            <div className="attach-box"><div className="field-label">ATTACH EVIDENCE · MAX 3</div><div className="chips">{evidence.map((e) => <button disabled={timedOut || attemptClosed} key={e.id} className={attached.includes(e.id) ? "chip selected" : "chip"} onClick={() => toggleAttached(e.id)}>{e.title}</button>)}</div></div>
            <div className="ask-row"><textarea disabled={timedOut || attemptClosed} value={question} onChange={(e) => setQuestion(e.target.value)} placeholder={timedOut ? "TIME EXPIRED" : `Question ${suspect.name.split(" ")[0]}...`} maxLength={500} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); askSuspect(); } }} /><button className="primary" onClick={askSuspect} disabled={loading || timedOut || attemptClosed}>ASK</button></div>
            {apiError && <div className="error">{apiError}</div>}
          </div>

          <div className="panel notes"><div className="section-title compact"><span>03</span> DETECTIVE NOTES <em>CLOUD SAVED</em></div><textarea disabled={timedOut || attemptClosed} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Write contradictions, timelines, theories..." /></div>
        </aside>
      </div>

      <section className="accusation panel">
        <div className="section-title"><span>04</span> FINAL ACCUSATION <em>ONE SHOT</em></div>
        <div className="accuse-grid"><label><span>WHO?</span><select disabled={timedOut || attemptClosed} value={accused} onChange={(e) => setAccused(e.target.value)}>{suspects.map((s) => <option value={s.id} key={s.id}>{s.name}</option>)}</select></label><label><span>WHY?</span><select disabled={timedOut || attemptClosed} value={motive} onChange={(e) => setMotive(e.target.value)}>{motiveOptions.map((m) => <option value={m.id} key={m.id}>{m.label}</option>)}</select></label></div>
        <div className="field-label">SELECT UP TO 5 PIECES OF PROOF</div><div className="chips proof">{evidence.map((e) => <button disabled={timedOut || attemptClosed} key={e.id} className={proof.includes(e.id) ? "chip selected" : "chip"} onClick={() => toggleProof(e.id)}>{e.title}</button>)}</div>
        <button className="primary submit" onClick={submitAccusation} disabled={timedOut || attemptClosed}>SUBMIT CASE</button>

        {verdict && <div className={`verdict ${verdict.solved ? "closed" : "open"}`}><div className="score">{verdict.score}<small>/100</small></div><div><h2>{verdict.solved ? "CASE CLOSED" : "CASE REMAINS OPEN"}</h2><p>{verdict.message}</p><div className="checks"><span>{verdict.checks.suspect ? "✓" : "×"} Suspect</span><span>{verdict.checks.motive ? "✓" : "×"} Motive</span><span>{verdict.checks.evidence ? "✓" : "×"} Evidence</span><span>{verdict.checks.forensicCore ? "✓" : "×"} Core link</span></div>{verdict.explanation && <p className="explanation">{verdict.explanation}</p>}</div></div>}
      </section>

      <footer>CASE//ZERO · {caseData.id} · FICTIONAL CASE</footer>
    </main>
  );
}
