"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { cases } from "@/lib/cases";
import { getSupabase, type CloudProgress } from "@/lib/supabase";

type ProgressMap = Record<string, CloudProgress>;

export default function HomeDashboard() {
  const [session, setSession] = useState<Session | null>(null);
  const [progress, setProgress] = useState<ProgressMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = getSupabase();
    let mounted = true;

    async function load(current: Session | null) {
      if (!mounted) return;
      setSession(current);
      setError("");
      if (!current) {
        setProgress({});
        setLoading(false);
        return;
      }

      const { data, error: queryError } = await supabase
        .from("case_progress")
        .select("*")
        .eq("user_id", current.user.id);

      if (!mounted) return;
      if (queryError) setError("Could not load your detective record. Check the Supabase setup.");
      const map: ProgressMap = {};
      (data || []).forEach((row) => { map[row.case_id] = row as CloudProgress; });
      setProgress(map);
      setLoading(false);
    }

    supabase.auth.getSession().then(({ data }) => load(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => load(nextSession));
    return () => { mounted = false; listener.subscription.unsubscribe(); };
  }, []);

  const stats = useMemo(() => {
    const items = Object.values(progress);
    const solved = cases.filter((item) => progress[item.id]?.solved).length;
    const scores = cases.map((item) => progress[item.id]?.best_score || 0).filter(Boolean);
    return {
      solved,
      attempts: items.reduce((sum, item) => sum + (item.attempts || 0), 0),
      average: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
      totalScore: scores.reduce((a, b) => a + b, 0)
    };
  }, [progress]);

  async function signOut() {
    await getSupabase().auth.signOut();
    window.location.href = "/";
  }

  const detectiveName = session?.user.user_metadata?.display_name || session?.user.email?.split("@")[0] || "Detective";

  return (
    <main className="home-shell">
      <header className="home-header">
        <div className="brand-mark">C//Z</div>
        <div><div className="eyebrow">INTERACTIVE CRIME FILES</div><h1>CASE//ZERO</h1><p>Read the evidence. Interrogate everyone. Trust nobody&apos;s first statement.</p></div>
        {session ? <div className="account-block"><span className="live-badge"><i /> {detectiveName.toUpperCase()}</span><button onClick={signOut}>SIGN OUT</button></div> : <Link href="/login" className="header-login">SIGN IN / SIGN UP</Link>}
      </header>

      {!session && !loading ? (
        <>
          <section className="public-hero panel">
            <div><div className="eyebrow">YOUR DETECTIVE RECORD</div><h2>One account. Every case saved.</h2><p>Sign in before investigating. Your scores, notes, interrogation history and case status follow you across devices.</p></div>
            <div className="public-actions"><Link href="/login?mode=signup" className="primary link-button">CREATE ACCOUNT</Link><Link href="/login" className="ghost-button">SIGN IN</Link></div>
          </section>
          <div className="library-heading"><div><div className="eyebrow">CASE ARCHIVE</div><h2>Available investigations</h2></div><span>10 MINUTES EACH</span></div>
          <section className="case-library">
            {cases.map((item, index) => <Link href={`/login?next=/case/${item.id}`} className="case-card" key={item.id}><img className="case-card-art" src={`/case-art/${item.id.toLowerCase()}.webp`} alt="" /><div className="case-card-overlay" /><div className="case-card-top"><span>{item.id}</span><span className={`difficulty ${item.difficulty.toLowerCase()}`}>{item.difficulty}</span></div><div className="case-number">0{index + 1}</div><div className="case-kicker">{item.kicker}</div><h3>{item.title}</h3><p>{item.location}</p><div className="case-victim">VICTIM <b>{item.victim}</b></div><div className="case-card-bottom"><span>10 MIN</span><span>LOGIN TO OPEN</span></div></Link>)}
          </section>
        </>
      ) : (
        <>
          <section className="dashboard-grid">
            <div className="welcome panel"><div className="eyebrow">DETECTIVE DESK</div><h2>{loading ? "Loading record..." : `Welcome, ${detectiveName}`}</h2><p>Your investigation record is cloud-saved. Every attempt has a hard 10-minute limit, and interrogation access closes when the timer reaches zero.</p><div className="desk-rule">AI performs the suspects. Evidence decides the case.</div>{error && <div className="error dashboard-error">{error}</div>}</div>
            <div className="stats-panel panel"><div className="stat"><strong>{stats.solved}<small>/{cases.length}</small></strong><span>CASES SOLVED</span></div><div className="stat"><strong>{stats.average}</strong><span>AVG. SCORE</span></div><div className="stat"><strong>{stats.attempts}</strong><span>ACCUSATIONS</span></div><div className="stat"><strong>{stats.totalScore}</strong><span>TOTAL SCORE</span></div></div>
          </section>

          <div className="library-heading"><div><div className="eyebrow">ACTIVE FILES</div><h2>Case Library</h2></div><span>{cases.length} FILES · 10 MIN EACH</span></div>

          <section className="case-library">
            {cases.map((item, index) => {
              const p = progress[item.id];
              const active = p && !p.attempt_closed && p.attempt_deadline_at && new Date(p.attempt_deadline_at).getTime() > Date.now();
              return <Link href={`/case/${item.id}`} className="case-card" key={item.id}>
                <img className="case-card-art" src={`/case-art/${item.id.toLowerCase()}.webp`} alt="" /><div className="case-card-overlay" />
                <div className="case-card-top"><span>{item.id}</span><span className={`difficulty ${item.difficulty.toLowerCase()}`}>{item.difficulty}</span></div>
                <div className="case-number">0{index + 1}</div><div className="case-kicker">{item.kicker}</div><h3>{item.title}</h3><p>{item.location}</p><div className="case-victim">VICTIM <b>{item.victim}</b></div>
                <div className="case-card-bottom"><span>10 MIN</span>{active ? <span className="attempted-tag">CONTINUE</span> : p ? <span className={p.solved ? "solved-tag" : "attempted-tag"}>{p.solved ? `CLOSED · ${p.best_score}` : `OPEN · ${p.best_score}`}</span> : <span>UNOPENED</span>}</div>
              </Link>;
            })}
          </section>
        </>
      )}

      <section className="how panel"><div><div className="eyebrow">FIELD PROTOCOL</div><h2>How to investigate</h2></div><div className="protocol"><span><b>01</b> Start the 10-minute clock.</span><span><b>02</b> Interrogate suspects naturally.</span><span><b>03</b> Attach evidence to challenge lies.</span><span><b>04</b> Accuse once: suspect, motive, proof.</span></div></section>
      <footer>CASE//ZERO · FICTIONAL CASES · MALAYSIAN NOIR</footer>
    </main>
  );
}
