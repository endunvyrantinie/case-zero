"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CasePublic } from "@/lib/cases";

type ChatMessage = { role: "player" | "suspect"; text: string };
type Verdict = { solved: boolean; score: number; checks: { suspect: boolean; motive: boolean; evidence: boolean; forensicCore: boolean }; message: string; explanation?: string };
type ProgressMap = Record<string, { solved: boolean; bestScore: number; attempts: number; lastPlayedAt: string }>;

const PROGRESS_KEY = "casezero.progress.v1";

export default function Game({ caseData }: { caseData: CasePublic }) {
  const { suspects, evidence, motiveOptions } = caseData;
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

  const suspect = useMemo(() => suspects.find((s) => s.id === activeSuspect)!, [activeSuspect, suspects]);
  const history = chats[activeSuspect] || [];
  const totalQuestions = Object.values(chats).flat().filter((m) => m.role === "player").length;

  useEffect(() => {
    const savedNotes = localStorage.getItem(`casezero.notes.${caseData.id}`);
    if (savedNotes) setNotes(savedNotes);
    try {
      const progress = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}") as ProgressMap;
      setBestScore(progress[caseData.id]?.bestScore || 0);
    } catch {}
  }, [caseData.id]);

  useEffect(() => {
    const timer = window.setTimeout(() => localStorage.setItem(`casezero.notes.${caseData.id}`, notes), 250);
    return () => window.clearTimeout(timer);
  }, [notes, caseData.id]);

  function toggleAttached(id: string) { setAttached((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev); }
  function toggleProof(id: string) { setProof((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 5 ? [...prev, id] : prev); }

  async function askSuspect() {
    const clean = question.trim();
    if (!clean || loading) return;
    setLoading(true); setApiError("");
    const playerMessage: ChatMessage = { role: "player", text: clean };
    const nextHistory = [...history, playerMessage];
    setChats((prev) => ({ ...prev, [activeSuspect]: nextHistory }));
    setQuestion("");
    try {
      const res = await fetch("/api/interrogate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ caseId: caseData.id, suspectId: activeSuspect, question: clean, evidenceIds: attached, history }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Interrogation failed.");
      setChats((prev) => ({ ...prev, [activeSuspect]: [...(prev[activeSuspect] || nextHistory), { role: "suspect", text: data.reply }] }));
    } catch (err) { setApiError(err instanceof Error ? err.message : "Interrogation failed."); }
    finally { setLoading(false); }
  }

  async function submitAccusation() {
    setVerdict(null);
    const res = await fetch("/api/accuse", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ caseId: caseData.id, suspectId: accused, motiveId: motive, evidenceIds: proof }) });
    const result = await res.json() as Verdict;
    setVerdict(result);
    if (typeof result.score === "number") {
      try {
        const progress = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}") as ProgressMap;
        const previous = progress[caseData.id];
        progress[caseData.id] = {
          solved: Boolean(previous?.solved || result.solved),
          bestScore: Math.max(previous?.bestScore || 0, result.score),
          attempts: (previous?.attempts || 0) + 1,
          lastPlayedAt: new Date().toISOString()
        };
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
        setBestScore(progress[caseData.id].bestScore);
      } catch {}
    }
  }

  return (
    <main className="game-shell">
      <nav className="game-nav"><Link href="/">← CASE LIBRARY</Link><div><span>{caseData.difficulty}</span><span>{caseData.estimatedMinutes} MIN</span>{bestScore > 0 && <span>BEST {bestScore}</span>}</div></nav>
      <header className="topbar"><div><div className="eyebrow">CASE//ZERO · {caseData.id} · {caseData.kicker}</div><h1>{caseData.title}</h1></div><div className="case-meta"><span>{caseData.location}</span><span>{caseData.scene}</span></div></header>

      <section className="hero panel"><div><div className="eyebrow">VICTIM</div><h2>{caseData.victim}</h2><p>{caseData.victimAge} · {caseData.victimRole}</p></div><div className="hero-copy"><p>{caseData.briefing}</p><p className="objective">OBJECTIVE: {caseData.objective}</p></div></section>

      <div className="case-status"><span>{suspects.length} SUSPECTS</span><span>{evidence.length} EVIDENCE ITEMS</span><span>{totalQuestions} QUESTIONS ASKED</span></div>

      <div className="layout">
        <section className="left-column">
          <div className="section-title"><span>01</span> SUSPECTS</div>
          <div className="suspect-grid">
            {suspects.map((s) => <button key={s.id} className={`suspect-card ${activeSuspect === s.id ? "active" : ""}`} onClick={() => { setActiveSuspect(s.id); setAttached([]); }}><div className="portrait">{s.initials}</div><div><strong>{s.name}</strong><small>{s.role}</small><small>{s.relation}</small></div><div className="question-count">{(chats[s.id] || []).filter((m) => m.role === "player").length}</div></button>)}
          </div>

          <div className="section-title"><span>02</span> EVIDENCE BOARD</div>
          <div className="evidence-grid">
            {evidence.map((e) => <article className={`evidence-card ${attached.includes(e.id) ? "evidence-selected" : ""}`} key={e.id} onClick={() => toggleAttached(e.id)}><div className="evidence-top"><span>{e.type}</span>{e.time && <b>{e.time}</b>}</div><h3>{e.title}</h3><p>{e.description}</p><div className="evidence-action">{attached.includes(e.id) ? "ATTACHED TO INTERROGATION" : "+ ATTACH"}</div></article>)}
          </div>
        </section>

        <aside className="right-column">
          <div className="interrogation panel">
            <div className="interrogation-head"><div className="portrait large">{suspect.initials}</div><div><div className="eyebrow">INTERROGATION</div><h2>{suspect.name}</h2><p>Initial statement: “{suspect.statement}”</p></div></div>
            <div className="chat">{history.length === 0 && <div className="empty-chat">Ask about timeline, motive, relationships, or select evidence from the board and confront the suspect.</div>}{history.map((m, i) => <div key={i} className={`bubble ${m.role}`}><span>{m.role === "player" ? "YOU" : suspect.name.toUpperCase()}</span>{m.text}</div>)}{loading && <div className="bubble suspect"><span>{suspect.name.toUpperCase()}</span>...</div>}</div>
            <div className="attach-box"><div className="field-label">ATTACHED EVIDENCE · MAX 3</div><div className="chips">{attached.length === 0 && <span className="no-attachment">None selected</span>}{attached.map((id) => { const item = evidence.find((e) => e.id === id)!; return <button key={id} className="chip selected" onClick={() => toggleAttached(id)}>× {item.title}</button>; })}</div></div>
            <div className="ask-row"><textarea value={question} onChange={(e) => setQuestion(e.target.value)} placeholder={`Question ${suspect.name.split(" ")[0]}...`} maxLength={500} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); askSuspect(); } }} /><button className="primary" onClick={askSuspect} disabled={loading}>ASK</button></div>
            {apiError && <div className="error">{apiError}</div>}
          </div>

          <div className="panel notes"><div className="section-title compact"><span>03</span> DETECTIVE NOTES</div><textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Write contradictions, timelines, theories... Auto-saved on this device." /><small className="autosave">AUTO-SAVED LOCALLY</small></div>
        </aside>
      </div>

      <section className="accusation panel"><div className="section-title"><span>04</span> FINAL ACCUSATION</div><p className="accuse-warning">A correct name is not enough. Establish motive and choose evidence that would survive scrutiny.</p><div className="accuse-grid"><label><span>WHO?</span><select value={accused} onChange={(e) => setAccused(e.target.value)}>{suspects.map((s) => <option value={s.id} key={s.id}>{s.name}</option>)}</select></label><label><span>WHY?</span><select value={motive} onChange={(e) => setMotive(e.target.value)}>{motiveOptions.map((m) => <option value={m.id} key={m.id}>{m.label}</option>)}</select></label></div><div className="field-label">SELECT UP TO 5 PIECES OF PROOF</div><div className="chips proof">{evidence.map((e) => <button key={e.id} className={proof.includes(e.id) ? "chip selected" : "chip"} onClick={() => toggleProof(e.id)}>{e.title}</button>)}</div><button className="primary submit" onClick={submitAccusation}>SUBMIT CASE</button>
        {verdict && <div className={`verdict ${verdict.solved ? "closed" : "open"}`}><div className="score">{verdict.score}<small>/100</small></div><div><h2>{verdict.solved ? "CASE CLOSED" : "CASE REMAINS OPEN"}</h2><p>{verdict.message}</p><div className="checks"><span>{verdict.checks.suspect ? "✓" : "×"} Suspect</span><span>{verdict.checks.motive ? "✓" : "×"} Motive</span><span>{verdict.checks.evidence ? "✓" : "×"} Evidence</span><span>{verdict.checks.forensicCore ? "✓" : "×"} Core link</span></div>{verdict.explanation && <><p className="explanation">{verdict.explanation}</p><Link href="/" className="return-home">RETURN TO CASE LIBRARY →</Link></>}</div></div>}
      </section>
      <footer>CASE//ZERO · FICTIONAL CASES · MALAYSIAN NOIR</footer>
    </main>
  );
}
