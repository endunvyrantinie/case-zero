"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [nextPath, setNextPath] = useState("/");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const next = params.get("next");
    if (next?.startsWith("/")) setNextPath(next);
    if (params.get("mode") === "signup") setMode("signup");

    const supabase = getSupabase();
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace(next?.startsWith("/") ? next : "/");
    });
  }, [router]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    const supabase = getSupabase();

    try {
      if (mode === "signin") {
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) throw authError;
        router.replace(nextPath);
        router.refresh();
      } else {
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName.trim() || "Detective" },
            emailRedirectTo: window.location.origin
          }
        });
        if (authError) throw authError;
        if (data.session) {
          router.replace(nextPath);
          router.refresh();
        } else {
          setMessage("Account created. Check your email to confirm your account, then sign in.");
          setMode("signin");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-shell">
      <Link href="/" className="auth-back">← CASE//ZERO</Link>
      <section className="auth-card panel">
        <div className="auth-brand"><div className="brand-mark">C//Z</div><div><div className="eyebrow">SECURE DETECTIVE ACCESS</div><h1>{mode === "signin" ? "Sign in" : "Create account"}</h1></div></div>
        <p className="auth-intro">Your case scores, notes, interrogation history and active investigation timer are saved to your account.</p>

        <div className="auth-tabs">
          <button className={mode === "signin" ? "active" : ""} onClick={() => setMode("signin")}>SIGN IN</button>
          <button className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")}>SIGN UP</button>
        </div>

        <form onSubmit={submit} className="auth-form">
          {mode === "signup" && <label><span>DETECTIVE NAME</span><input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="e.g. EV" maxLength={40} /></label>}
          <label><span>EMAIL</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required /></label>
          <label><span>PASSWORD</span><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} placeholder="Minimum 6 characters" required /></label>
          {error && <div className="error auth-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}
          <button className="primary auth-submit" disabled={busy}>{busy ? "PLEASE WAIT..." : mode === "signin" ? "ENTER CASE//ZERO" : "CREATE DETECTIVE ACCOUNT"}</button>
        </form>
      </section>
    </main>
  );
}
