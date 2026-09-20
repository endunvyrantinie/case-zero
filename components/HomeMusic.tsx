"use client";

import { useEffect, useRef, useState } from "react";

export default function HomeMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  async function toggleMusic() {
    if (playing && audioRef.current) {
      audioRef.current.pause();
      setPlaying(false);
      return;
    }

    try {
      let audio = audioRef.current;
      if (!audio) {
        audio = new Audio("/audio/general-theme.mp3");
        audio.loop = true;
        audio.volume = 0.28;
        audioRef.current = audio;
      }
      await audio.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggleMusic}
      aria-pressed={playing}
      title="Play or pause CASE//ZERO theme music"
      style={{
        position: "fixed",
        right: 18,
        bottom: 18,
        zIndex: 80,
        border: "1px solid rgba(255,255,255,.18)",
        background: "rgba(8,12,18,.88)",
        color: "#f3f0e8",
        padding: "10px 14px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: ".08em",
        cursor: "pointer",
        backdropFilter: "blur(10px)",
        boxShadow: "0 10px 30px rgba(0,0,0,.28)"
      }}
    >
      {playing ? "♫ THEME ON" : "♪ PLAY THEME"}
    </button>
  );
}
