"use client";

import { useMemo, useState } from "react";
import { caseInfo, evidence, motiveOptions, suspects } from "@/lib/casePublic";

type ChatMessage = { role: "player" | "suspect"; text: string };

type Verdict = {
  solved: boolean;
  score: number;
  checks: { suspect: boolean; motive: boolean; evidence: boolean; forensicCore: boolean };
  message: string;
  explanation?: string;
};

export default function Game() {
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

  const suspect = useMemo(() => suspects.find((s) => s.id === activeSuspect)!, [activeSuspect]);
  const history = chats[activeSuspect] || [];

  function toggleAttached(id: string) {
    setAttached((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev);
  }

  function toggleProof(id: string) {
    setProof((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 5 ? [...prev, id] : prev);
  }

  async function askSuspect() {
    const clean = question.trim();
    if (!clean || loading) return;
    setLoading(true);
    setApiError("");

    const playerMessage: ChatMessage = { role: "player", text: clean };
    const nextHistory = [...history, playerMessage];
    setChats((prev) => ({ ...prev, [activeSuspect]: nextHistory }));
    setQuestion("");

    try {
      const res = await fetch("/api/interrogate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          suspectId: activeSuspect,
          question: clean,
          evidenceIds: attached,
          history
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Interrogation failed.");
      setChats((prev) => ({
        ...prev,
        [activeSuspect]: [...(prev[activeSuspect] || nextHistory), { role: "suspect", text: data.reply }]
      }));
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Interrogation failed.");
    } finally {
      setLoading(false);
    }
  }

  async function submitAccusation() {
    setVerdict(null);
    const res = await fetch("/api/accuse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ suspectId: accused, motiveId: motive, evidenceIds: proof })
    });
    setVerdict(await res.json());
  }

  return (
    <main>
      <header className="topbar">
        <div>
          <div className="eyebrow">CASE//ZERO · CASE CZ002</div>
          <h1>{caseInfo.title}</h1>
        </div>
        <div className="case-meta"><span>{caseInfo.location}</span><span>{caseInfo.room}</span></div>
      </header>

      <section className="hero panel">
        <div>
          <div className="eyebrow">VICTIM</div>
          <h2>{caseInfo.victim}</h2>
          <p>{caseInfo.victimAge} · {caseInfo.victimRole}</p>
        </div>
        <div className="hero-copy">
          <p>{caseInfo.briefing}</p>
          <p className="objective">OBJECTIVE: {caseInfo.objective}</p>
        </div>
      </section>

      <div className="layout">
        <section className="left-column">
          <div className="section-title"><span>01</span> SUSPECTS</div>
          <div className="suspect-grid">
            {suspects.map((s) => (
              <button key={s.id} className={`suspect-card ${activeSuspect === s.id ? "active" : ""}`} onClick={() => { setActiveSuspect(s.id); setAttached([]); }}>
                <div className="portrait">{s.initials}</div>
                <div><strong>{s.name}</strong><small>{s.role}</small><small>{s.relation}</small></div>
              </button>
            ))}
          </div>

          <div className="section-title"><span>02</span> EVIDENCE BOARD</div>
          <div className="evidence-grid">
            {evidence.map((e) => (
              <article className="evidence-card" key={e.id}>
                <div className="evidence-top"><span>{e.type}</span>{e.time && <b>{e.time}</b>}</div>
                <h3>{e.title}</h3>
                <p>{e.description}</p>
              </article>
            ))}
          </div>
        </section>

        <aside className="right-column">
          <div className="interrogation panel">
            <div className="interrogation-head">
              <div className="portrait large">{suspect.initials}</div>
              <div><div className="eyebrow">INTERROGATION</div><h2>{suspect.name}</h2><p>Initial statement: “{suspect.statement}”</p></div>
            </div>

            <div className="chat">
              {history.length === 0 && <div className="empty-chat">Ask about timeline, motive, relationships, or confront the suspect with evidence.</div>}
              {history.map((m, i) => <div key={i} className={`bubble ${m.role}`}><span>{m.role === "player" ? "YOU" : suspect.name.toUpperCase()}</span>{m.text}</div>)}
              {loading && <div className="bubble suspect"><span>{suspect.name.toUpperCase()}</span>...</div>}
            </div>

            <div className="attach-box">
              <div className="field-label">ATTACH EVIDENCE · MAX 3</div>
              <div className="chips">
                {evidence.map((e) => <button key={e.id} className={attached.includes(e.id) ? "chip selected" : "chip"} onClick={() => toggleAttached(e.id)}>{e.title}</button>)}
              </div>
            </div>

            <div className="ask-row">
              <textarea value={question} onChange={(e) => setQuestion(e.target.value)} placeholder={`Question ${suspect.name.split(" ")[0]}...`} maxLength={500} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); askSuspect(); } }} />
              <button className="primary" onClick={askSuspect} disabled={loading}>ASK</button>
            </div>
            {apiError && <div className="error">{apiError}</div>}
          </div>

          <div className="panel notes">
            <div className="section-title compact"><span>03</span> DETECTIVE NOTES</div>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Write contradictions, timelines, theories..." />
          </div>
        </aside>
      </div>

      <section className="accusation panel">
        <div className="section-title"><span>04</span> FINAL ACCUSATION</div>
        <div className="accuse-grid">
          <label><span>WHO?</span><select value={accused} onChange={(e) => setAccused(e.target.value)}>{suspects.map((s) => <option value={s.id} key={s.id}>{s.name}</option>)}</select></label>
          <label><span>WHY?</span><select value={motive} onChange={(e) => setMotive(e.target.value)}>{motiveOptions.map((m) => <option value={m.id} key={m.id}>{m.label}</option>)}</select></label>
        </div>
        <div className="field-label">SELECT UP TO 5 PIECES OF PROOF</div>
        <div className="chips proof">{evidence.map((e) => <button key={e.id} className={proof.includes(e.id) ? "chip selected" : "chip"} onClick={() => toggleProof(e.id)}>{e.title}</button>)}</div>
        <button className="primary submit" onClick={submitAccusation}>SUBMIT CASE</button>

        {verdict && <div className={`verdict ${verdict.solved ? "closed" : "open"}`}>
          <div className="score">{verdict.score}<small>/100</small></div>
          <div><h2>{verdict.solved ? "CASE CLOSED" : "CASE REMAINS OPEN"}</h2><p>{verdict.message}</p>
          <div className="checks"><span>{verdict.checks.suspect ? "✓" : "×"} Suspect</span><span>{verdict.checks.motive ? "✓" : "×"} Motive</span><span>{verdict.checks.evidence ? "✓" : "×"} Evidence</span><span>{verdict.checks.forensicCore ? "✓" : "×"} Core link</span></div>
          {verdict.explanation && <p className="explanation">{verdict.explanation}</p>}</div>
        </div>}
      </section>

      <footer>CASE//ZERO · FICTIONAL CASE · MALAYSIAN NOIR PROTOTYPE</footer>
    </main>
  );
}
