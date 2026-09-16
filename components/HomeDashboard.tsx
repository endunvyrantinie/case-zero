"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { cases } from "@/lib/cases";

type Progress = { solved: boolean; bestScore: number; attempts: number; lastPlayedAt: string };
type ProgressMap = Record<string, Progress>;
const PROGRESS_KEY = "casezero.progress.v1";

export default function HomeDashboard() {
  const [progress, setProgress] = useState<ProgressMap>({});
  useEffect(() => { try { setProgress(JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}")); } catch {} }, []);

  const stats = useMemo(() => {
    const items = Object.values(progress);
    const solved = cases.filter((item) => progress[item.id]?.solved).length;
    const scores = cases.map((item) => progress[item.id]?.bestScore || 0).filter(Boolean);
    return { solved, attempts: items.reduce((sum, item) => sum + (item.attempts || 0), 0), average: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0, totalScore: scores.reduce((a, b) => a + b, 0) };
  }, [progress]);

  return (
    <main className="home-shell">
      <header className="home-header"><div className="brand-mark">C//Z</div><div><div className="eyebrow">INTERACTIVE CRIME FILES</div><h1>CASE//ZERO</h1><p>Read the evidence. Interrogate everyone. Trust nobody's first statement.</p></div><div className="live-badge"><i /> SYSTEM ONLINE</div></header>

      <section className="dashboard-grid">
        <div className="welcome panel"><div className="eyebrow">DETECTIVE DESK</div><h2>Your case board</h2><p>Each case is fictional, set in Malaysia, and built around a fixed solution. Suspects may lie about unrelated secrets. Catching a lie does not automatically catch the killer.</p><div className="desk-rule">AI performs the suspects. Evidence decides the case.</div></div>
        <div className="stats-panel panel"><div className="stat"><strong>{stats.solved}<small>/{cases.length}</small></strong><span>CASES SOLVED</span></div><div className="stat"><strong>{stats.average}</strong><span>AVG. SCORE</span></div><div className="stat"><strong>{stats.attempts}</strong><span>ACCUSATIONS</span></div><div className="stat"><strong>{stats.totalScore}</strong><span>TOTAL SCORE</span></div></div>
      </section>

      <div className="library-heading"><div><div className="eyebrow">ACTIVE FILES</div><h2>Case Library</h2></div><span>{cases.length} FILES AVAILABLE</span></div>

      <section className="case-library">
        {cases.map((item, index) => {
          const p = progress[item.id];
          return <Link href={`/case/${item.id}`} className="case-card" key={item.id}>
            <div className="case-card-top"><span>{item.id}</span><span className={`difficulty ${item.difficulty.toLowerCase()}`}>{item.difficulty}</span></div>
            <div className="case-number">0{index + 1}</div><div className="case-kicker">{item.kicker}</div><h3>{item.title}</h3><p>{item.location}</p><div className="case-victim">VICTIM <b>{item.victim}</b></div><div className="case-card-bottom"><span>~{item.estimatedMinutes} MIN</span>{p ? <span className={p.solved ? "solved-tag" : "attempted-tag"}>{p.solved ? `CLOSED · ${p.bestScore}` : `OPEN · ${p.bestScore}`}</span> : <span>UNOPENED</span>}</div>
          </Link>;
        })}
      </section>

      <section className="how panel"><div><div className="eyebrow">FIELD PROTOCOL</div><h2>How to investigate</h2></div><div className="protocol"><span><b>01</b> Read every evidence item.</span><span><b>02</b> Interrogate suspects naturally.</span><span><b>03</b> Attach evidence when confronting a lie.</span><span><b>04</b> Name the suspect, motive and strongest proof.</span></div></section>
      <footer>CASE//ZERO · FICTIONAL CASES · MALAYSIAN NOIR</footer>
    </main>
  );
}
