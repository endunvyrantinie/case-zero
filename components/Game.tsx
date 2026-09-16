"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import type { CasePublic, Evidence } from "@/lib/cases";
import { evidenceUnlocked, unlockRequirement } from "@/lib/investigation";
import { getSupabase, type CloudProgress } from "@/lib/supabase";
import { useEntitlement } from "@/lib/entitlement";
import AdBanner from "@/components/AdBanner";
import SoundMixer from "@/components/SoundMixer";

type ChatMessage = { role: "player" | "suspect"; text: string };
type Verdict = { solved: boolean; score: number; checks: { suspect: boolean; motive: boolean; evidence: boolean; forensicCore: boolean }; message: string; explanation?: string };
type WorkspaceTab = "briefing" | "evidence" | "suspects" | "notes" | "accuse";

const ATTEMPT_SECONDS = 600;

function portraitPath(caseId: string, personId: string) {
  return `/portraits/${caseId.toLowerCase()}-${personId}.webp`;
}

function evidencePath(caseId: string, evidenceId: string) {
  return `/evidence/${caseId.toLowerCase()}-${evidenceId}.webp`;
}

function typeGlyph(type: string) {
  const t = type.toLowerCase();
  if (t.includes("video") || t.includes("image")) return "▣";
  if (t.includes("audio")) return "≈";
  if (t.includes("digital") || t.includes("log")) return "⌁";
  if (t.includes("financial") || t.includes("document")) return "≡";
  if (t.includes("forensic")) return "✦";
  if (t.includes("physical") || t.includes("scene")) return "◆";
  return "•";
}

export default function Game({ caseData }: { caseData: CasePublic }) {
  const router = useRouter();
  const { suspects, evidence, motiveOptions } = caseData;
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<WorkspaceTab>("briefing");
  const [activeSuspect, setActiveSuspect] = useState(suspects[0].id);
  const [question, setQuestion] = useState("");
  const [attached, setAttached] = useState<string[]>([]);
  const [chats, setChats] = useState<Record<string, ChatMessage[]>>({});
  const [reviewed, setReviewed] = useState<string[]>([]);
  const [inspecting, setInspecting] = useState<Evidence | null>(null);
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
  const [soundOn, setSoundOn] = useState(false);
  const [soundPanel, setSoundPanel] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.55);
  const [sfxVolume, setSfxVolume] = useState(0.75);
  const notesHydrated = useRef(false);
  const ambientAudio = useRef<HTMLAudioElement | null>(null);
  const warned60 = useRef(false);
  const warned30 = useRef(false);
  const { adFree } = useEntitlement(session);

  const suspect = useMemo(() => suspects.find((s) => s.id === activeSuspect)!, [activeSuspect, suspects]);
  const history = chats[activeSuspect] || [];
  const timedOut = ready && secondsLeft <= 0 && !attemptClosed;
  const questionedSuspects = suspects.filter((s) => (chats[s.id] || []).some((m) => m.role === "player")).length;
  const progressPct = Math.round(((reviewed.length / evidence.length) * 0.7 + (questionedSuspects / suspects.length) * 0.3) * 100);
  const availableEvidence = evidence.filter((e) => evidenceUnlocked(caseData.id, e.id, reviewed));
  const reviewedEvidence = evidence.filter((e) => reviewed.includes(e.id));

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
        setReviewed(Array.isArray(row.reviewed_evidence) ? row.reviewed_evidence : []);
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
          last_played_at: start.toISOString(),
          notes: "",
          chats: {},
          reviewed_evidence: [],
          attempt_started_at: start.toISOString(),
          attempt_deadline_at: deadline.toISOString(),
          attempt_closed: false,
          updated_at: start.toISOString()
        };
        const { error: saveError } = await supabase.from("case_progress").upsert(payload, { onConflict: "user_id,case_id" });
        if (saveError) setApiError("Could not start the investigation. Run the V5 Supabase migration first.");
        setChats({});
        setNotes("");
        setReviewed([]);
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

  useEffect(() => {
    try {
      const savedMusic = Number(localStorage.getItem("cz_music_volume"));
      const savedSfx = Number(localStorage.getItem("cz_sfx_volume"));
      if (Number.isFinite(savedMusic) && savedMusic >= 0 && savedMusic <= 1) setMusicVolume(savedMusic);
      if (Number.isFinite(savedSfx) && savedSfx >= 0 && savedSfx <= 1) setSfxVolume(savedSfx);
    } catch {}
    return () => stopAudio();
  }, []);

  useEffect(() => {
    if (ambientAudio.current) ambientAudio.current.volume = musicVolume * 0.55;
    try { localStorage.setItem("cz_music_volume", String(musicVolume)); } catch {}
  }, [musicVolume]);

  useEffect(() => { try { localStorage.setItem("cz_sfx_volume", String(sfxVolume)); } catch {} }, [sfxVolume]);

  useEffect(() => {
    if (!soundOn || attemptClosed) return;
    if (secondsLeft <= 60 && secondsLeft > 30 && !warned60.current) { warned60.current = true; playSfx("warning"); }
    if (secondsLeft <= 30 && secondsLeft > 0 && !warned30.current) { warned30.current = true; playSfx("warning"); }
  }, [secondsLeft, soundOn, attemptClosed]);

  async function saveCloud(update: Record<string, unknown>) {
    if (!session) return;
    await getSupabase().from("case_progress").update({ ...update, last_played_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("user_id", session.user.id).eq("case_id", caseData.id);
  }

  function stopAudio() {
    if (ambientAudio.current) {
      ambientAudio.current.pause();
      ambientAudio.current.currentTime = 0;
      ambientAudio.current = null;
    }
  }

  function playSfx(name: "evidence" | "click" | "warning" | "solved" | "failed") {
    if (!soundOn) return;
    try {
      const audio = new Audio(`/audio/${name}.mp3`);
      audio.volume = Math.max(0, Math.min(1, sfxVolume));
      audio.play().catch(() => undefined);
    } catch {}
  }

  async function toggleSound() {
    if (soundOn) { stopAudio(); setSoundOn(false); return; }
    try {
      const audio = new Audio(`/audio/${caseData.id.toLowerCase()}-ambience.mp3`);
      audio.loop = true;
      audio.volume = musicVolume * 0.55;
      await audio.play();
      ambientAudio.current = audio;
      setSoundOn(true);
    } catch { setApiError("Your browser blocked audio. Click SOUND ON again after interacting with the page."); }
  }

  function toggleAttached(id: string) {
    if (timedOut || attemptClosed || !reviewed.includes(id)) return;
    setAttached((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev);
  }

  function toggleProof(id: string) {
    if (timedOut || attemptClosed || !reviewed.includes(id)) return;
    setProof((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 5 ? [...prev, id] : prev);
  }

  async function inspectEvidence(item: Evidence) {
    if (!evidenceUnlocked(caseData.id, item.id, reviewed)) return;
    setInspecting(item);
    if (!reviewed.includes(item.id) && !timedOut && !attemptClosed) {
      const next = [...reviewed, item.id];
      setReviewed(next);
      playSfx("evidence");
      await saveCloud({ reviewed_evidence: next, notes, chats });
    }
  }

  async function askSuspect() {
    const clean = question.trim();
    if (!clean || loading || timedOut || attemptClosed || !session) return;
    setLoading(true); setApiError("");
    const playerMessage: ChatMessage = { role: "player", text: clean };
    const nextHistory = [...history, playerMessage];
    const optimisticChats = { ...chats, [activeSuspect]: nextHistory };
    setChats(optimisticChats); setQuestion("");

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
      playSfx("click");
      await saveCloud({ chats: finalChats, notes, reviewed_evidence: reviewed });
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Interrogation failed.");
      await saveCloud({ chats: optimisticChats, notes, reviewed_evidence: reviewed });
    } finally { setLoading(false); }
  }

  async function submitAccusation() {
    if (!session || timedOut || attemptClosed) return;
    setVerdict(null); setApiError("");
    try {
      await saveCloud({ chats, notes, reviewed_evidence: reviewed });
      const res = await fetch("/api/accuse", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ caseId: caseData.id, suspectId: accused, motiveId: motive, evidenceIds: proof })
      });
      const result = await res.json() as Verdict & { error?: string };
      if (!res.ok) throw new Error(result.error || "Could not submit accusation.");
      setVerdict(result); setAttemptClosed(true); setBestScore((old) => Math.max(old, result.score)); setAttempts((old) => old + 1);
      playSfx(result.solved ? "solved" : "failed");
      if (result.solved) setSolvedBefore(true);
    } catch (err) { setApiError(err instanceof Error ? err.message : "Could not submit accusation."); }
  }

  async function restartAttempt() {
    if (!session) return;
    const start = new Date(); const deadline = new Date(start.getTime() + ATTEMPT_SECONDS * 1000);
    const { error } = await getSupabase().from("case_progress").update({
      notes: "", chats: {}, reviewed_evidence: [], attempt_started_at: start.toISOString(), attempt_deadline_at: deadline.toISOString(), attempt_closed: false, last_played_at: start.toISOString(), updated_at: start.toISOString()
    }).eq("user_id", session.user.id).eq("case_id", caseData.id);
    if (error) { setApiError("Could not restart the investigation."); return; }
    setNotes(""); setChats({}); setReviewed([]); setVerdict(null); setAttached([]); setProof([]); setQuestion(""); setApiError(""); setTab("briefing"); setInspecting(null);
    setDeadlineMs(deadline.getTime()); setSecondsLeft(ATTEMPT_SECONDS); setAttemptClosed(false); warned60.current = false; warned30.current = false; notesHydrated.current = true;
  }

  const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");

  if (!ready) return <main className="loading-screen"><div className="brand-mark">C//Z</div><div className="eyebrow">OPENING SECURE CASE FILE...</div></main>;

  return (
    <main className={`workspace-shell case-${caseData.id.toLowerCase()}`}>
      <header className="workspace-topbar">
        <div className="workspace-brand"><span className="mini-brand">C//Z</span><div><div className="eyebrow">ACTIVE INVESTIGATION · {caseData.id}</div><strong>{caseData.title}</strong></div></div>
        <div className="workspace-actions">
          <div className="timer-block"><span>TIME REMAINING</span><b className={secondsLeft <= 60 ? "danger" : ""}>{minutes}:{seconds}</b></div>
          <button className={soundOn ? "sound-button active" : "sound-button"} onClick={toggleSound}>{soundOn ? "SOUND ON" : "SOUND OFF"}</button>
          <button className="mix-button" onClick={() => setSoundPanel((v) => !v)}>MIX</button>
          {adFree && <span className="adfree-badge workspace-adfree">AD-FREE</span>}
          <Link className="exit-button" href="/">EXIT</Link>
        </div>
      </header>
      <SoundMixer open={soundPanel} soundOn={soundOn} musicVolume={musicVolume} sfxVolume={sfxVolume} onToggle={toggleSound} onMusic={setMusicVolume} onSfx={setSfxVolume} onClose={() => setSoundPanel(false)} />

      {(timedOut || attemptClosed) && <div className={`lock-banner ${timedOut ? "expired" : "closed"}`}><div><div className="eyebrow">{timedOut ? "TIME EXPIRED" : verdict?.solved ? "CASE CLOSED" : "ATTEMPT CLOSED"}</div><h2>{timedOut ? "The 10-minute investigation window has ended." : verdict?.message || "This attempt is closed."}</h2><p>Review the result or start a fresh 10-minute attempt.</p></div><button className="primary restart" onClick={restartAttempt}>NEW ATTEMPT</button></div>}
      {apiError && <div className="error workspace-error">{apiError}</div>}

      <div className="workspace-body">
        <aside className="workspace-sidebar">
          <div className="case-mini-card">
            <img src={`/case-art/${caseData.id.toLowerCase()}.webp`} alt="Case location artwork" />
            <div><span>{caseData.kicker}</span><strong>{caseData.location}</strong><small>{caseData.scene}</small></div>
          </div>

          <div className="progress-box">
            <div className="progress-head"><span>INVESTIGATION</span><b>{progressPct}%</b></div>
            <div className="progress-track"><i style={{ width: `${progressPct}%` }} /></div>
            <div className="progress-stats"><span>{reviewed.length}/{evidence.length}<small>EVIDENCE</small></span><span>{questionedSuspects}/{suspects.length}<small>QUESTIONED</small></span><span>{bestScore}<small>BEST SCORE</small></span></div>
          </div>

          <nav className="workspace-nav">
            {([
              ["briefing", "01", "Briefing"], ["evidence", "02", "Evidence Locker"], ["suspects", "03", "Suspects"], ["notes", "04", "Detective Notes"], ["accuse", "05", "Accuse"]
            ] as [WorkspaceTab,string,string][]).map(([id,no,label]) => <button key={id} className={tab === id ? "active" : ""} onClick={() => setTab(id)}><b>{no}</b><span>{label}</span>{id === "evidence" && <em>{reviewed.length}</em>}{id === "suspects" && <em>{questionedSuspects}</em>}</button>)}
          </nav>

          <div className="attempt-meta"><span>{caseData.difficulty}</span><span>ATTEMPT {attempts + (attemptClosed ? 0 : 1)}</span>{solvedBefore && <span className="closed-label">PREVIOUSLY SOLVED</span>}</div>
          <AdBanner adFree={adFree} compact label="SPONSOR" />
        </aside>

        <section className="workspace-content">
          {tab === "briefing" && <div className="workspace-page briefing-page">
            <div className="page-heading"><div><div className="eyebrow">CASE BRIEFING</div><h1>{caseData.title}</h1></div><span>10-MINUTE FILE</span></div>
            <div className="briefing-grid">
              <div className="victim-dossier panel"><img src={portraitPath(caseData.id, "victim")} alt={caseData.victim} /><div><span className="dossier-label">VICTIM</span><h2>{caseData.victim}</h2><p>{caseData.victimAge} · {caseData.victimRole}</p></div></div>
              <div className="brief-copy panel"><div className="eyebrow">INCIDENT SUMMARY</div><p>{caseData.briefing}</p><div className="objective-box"><span>OBJECTIVE</span>{caseData.objective}</div><button className="primary begin-button" onClick={() => setTab("evidence")}>OPEN EVIDENCE LOCKER →</button></div>
            </div>
            <div className="protocol-strip"><span><b>01</b> Inspect</span><span><b>02</b> Interrogate</span><span><b>03</b> Connect</span><span><b>04</b> Accuse</span></div>
          </div>}

          {tab === "evidence" && <div className="workspace-page">
            <div className="page-heading"><div><div className="eyebrow">EVIDENCE LOCKER</div><h1>Physical & digital evidence</h1></div><span>{reviewed.length}/{evidence.length} REVIEWED</span></div>
            <p className="page-intro">Inspect items. Some evidence becomes available only after related material has been examined.</p>
            <div className="locker-grid">
              {evidence.map((item) => {
                const unlocked = evidenceUnlocked(caseData.id, item.id, reviewed);
                const done = reviewed.includes(item.id);
                const needs = unlockRequirement(caseData.id, item.id);
                return <button key={item.id} className={`locker-card ${done ? "reviewed" : ""} ${!unlocked ? "locked" : ""}`} disabled={!unlocked} onClick={() => inspectEvidence(item)}>
                  <div className="locker-card-top"><span className={done ? "reviewed-badge" : unlocked ? "unreviewed-badge" : "locked-badge"}>{done ? "REVIEWED" : unlocked ? "UNREVIEWED" : "LOCKED"}</span><span>{item.type.toUpperCase()}</span></div>
                  <div className="evidence-thumb"><img src={evidencePath(caseData.id, item.id)} alt={item.title} /></div><h3>{item.title}</h3>
                  <p>{unlocked ? (done ? item.description : "Evidence recovered. Open file to inspect the full finding.") : "Related evidence must be reviewed first."}</p>
                  {item.time && unlocked && <small>{item.time}</small>}
                  <b className="inspect-action">{!unlocked ? `REQUIRES ${needs.length} LINK${needs.length === 1 ? "" : "S"}` : done ? "✓ FINDING RECORDED" : "CLICK TO INSPECT"}</b>
                </button>;
              })}
            </div>
          </div>}

          {tab === "suspects" && <div className="workspace-page">
            <div className="page-heading"><div><div className="eyebrow">PERSONS OF INTEREST</div><h1>Interrogate suspects</h1></div><span>{questionedSuspects}/{suspects.length} QUESTIONED</span></div>
            <p className="page-intro">Select a suspect. Ask direct questions, then attach reviewed evidence to challenge contradictions.</p>
            <div className="suspect-workspace">
              <div className="dossier-grid">
                {suspects.map((s) => {
                  const count = (chats[s.id] || []).filter((m) => m.role === "player").length;
                  return <button key={s.id} className={`dossier-card ${activeSuspect === s.id ? "active" : ""}`} onClick={() => { setActiveSuspect(s.id); setAttached([]); }}>
                    <img src={portraitPath(caseData.id, s.id)} alt={s.name} />
                    <div><span className="dossier-status">{count ? `${count} Q` : "NEW"}</span><h3>{s.name}</h3><strong>{s.role} · {s.age}</strong><p>{s.relation}</p><small>“{s.statement}”</small></div>
                  </button>;
                })}
              </div>

              <div className="interrogation-room panel">
                <div className="interrogation-profile"><img src={portraitPath(caseData.id, suspect.id)} alt={suspect.name} /><div><div className="eyebrow">LIVE INTERROGATION</div><h2>{suspect.name}</h2><p>{suspect.role} · {suspect.relation}</p></div></div>
                <div className="chat">
                  {history.length === 0 && <div className="empty-chat">No questions yet. Start with timeline, relationship to the victim, or a specific piece of reviewed evidence.</div>}
                  {history.map((m, i) => <div key={i} className={`bubble ${m.role}`}><span>{m.role === "player" ? "YOU" : suspect.name.toUpperCase()}</span>{m.text}</div>)}
                  {loading && <div className="bubble suspect"><span>{suspect.name.toUpperCase()}</span>...</div>}
                </div>
                <div className="attach-box"><div className="field-label">ATTACH REVIEWED EVIDENCE · MAX 3</div><div className="chips">{reviewedEvidence.length ? reviewedEvidence.map((e) => <button key={e.id} disabled={timedOut || attemptClosed} className={attached.includes(e.id) ? "chip selected" : "chip"} onClick={() => toggleAttached(e.id)}>{e.title}</button>) : <span className="no-attachment">Review evidence in the locker first.</span>}</div></div>
                <div className="ask-row"><textarea disabled={timedOut || attemptClosed} value={question} onChange={(e) => setQuestion(e.target.value)} placeholder={`Question ${suspect.name.split(" ")[0]}...`} maxLength={500} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); askSuspect(); } }} /><button className="primary" onClick={askSuspect} disabled={loading || timedOut || attemptClosed}>ASK</button></div>
              </div>
            </div>
          </div>}

          {tab === "notes" && <div className="workspace-page notes-page">
            <div className="page-heading"><div><div className="eyebrow">DETECTIVE NOTES</div><h1>Build your theory</h1></div><span>AUTO-SAVED</span></div>
            <div className="notes-layout"><div className="notes-panel panel"><textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Timeline... contradictions... who knew what... motive..." /><small>AUTO-SAVED TO YOUR DETECTIVE ACCOUNT</small></div><div className="case-facts panel"><div className="eyebrow">FIELD SUMMARY</div><h3>{reviewed.length} evidence reviewed</h3><p>{questionedSuspects} suspects questioned</p><div className="mini-evidence-list">{reviewedEvidence.map((e) => <button key={e.id} onClick={() => { setInspecting(e); }}>{e.title}</button>)}</div></div></div>
          </div>}

          {tab === "accuse" && <div className="workspace-page accusation-page">
            <div className="page-heading"><div><div className="eyebrow">FINAL ACCUSATION</div><h1>Build the case</h1></div><span>ONE ATTEMPT</span></div>
            <p className="page-intro">Choosing the correct suspect is not enough. Establish motive and submit evidence strong enough to support the accusation.</p>
            <div className="accusation panel"><div className="accuse-grid"><label><span>WHO?</span><select disabled={timedOut || attemptClosed} value={accused} onChange={(e) => setAccused(e.target.value)}>{suspects.map((s) => <option value={s.id} key={s.id}>{s.name}</option>)}</select></label><label><span>WHY?</span><select disabled={timedOut || attemptClosed} value={motive} onChange={(e) => setMotive(e.target.value)}>{motiveOptions.map((m) => <option value={m.id} key={m.id}>{m.label}</option>)}</select></label></div>
              <div className="field-label">SELECT UP TO 5 REVIEWED PIECES OF PROOF</div><div className="proof-grid">{reviewedEvidence.map((e) => <button disabled={timedOut || attemptClosed} key={e.id} className={proof.includes(e.id) ? "proof-card selected" : "proof-card"} onClick={() => toggleProof(e.id)}><span>{typeGlyph(e.type)}</span><b>{e.title}</b><small>{e.type}</small></button>)}</div>
              {!reviewedEvidence.length && <p className="no-proof">Review evidence before submitting an accusation.</p>}
              <button className="primary submit" onClick={submitAccusation} disabled={timedOut || attemptClosed || reviewedEvidence.length < 3}>SUBMIT CASE</button>
              {verdict && <><div className={`verdict ${verdict.solved ? "closed" : "open"}`}><div className="score">{verdict.score}<small>/100</small></div><div><h2>{verdict.solved ? "CASE CLOSED" : "CASE REMAINS OPEN"}</h2><p>{verdict.message}</p><div className="checks"><span>{verdict.checks.suspect ? "✓" : "×"} Suspect</span><span>{verdict.checks.motive ? "✓" : "×"} Motive</span><span>{verdict.checks.evidence ? "✓" : "×"} Evidence</span><span>{verdict.checks.forensicCore ? "✓" : "×"} Core link</span></div>{verdict.explanation && <p className="explanation">{verdict.explanation}</p>}</div></div><AdBanner adFree={adFree} label="POST-CASE ADVERTISEMENT" /></>}
            </div>
          </div>}
        </section>
      </div>

      {inspecting && <div className="evidence-modal" onClick={() => setInspecting(null)}><article className="evidence-modal-card" onClick={(e) => e.stopPropagation()}><button className="modal-close" onClick={() => setInspecting(null)}>×</button><div className="evidence-modal-visual"><img src={evidencePath(caseData.id, inspecting.id)} alt={inspecting.title} /><small>{inspecting.type}</small></div><div className="evidence-modal-copy"><div className="eyebrow">EVIDENCE FILE · {caseData.id}</div><h2>{inspecting.title}</h2>{inspecting.time && <b className="evidence-time">{inspecting.time}</b>}<p>{inspecting.description}</p><div className="finding-stamp">✓ FINDING RECORDED</div></div></article></div>}
    </main>
  );
}
