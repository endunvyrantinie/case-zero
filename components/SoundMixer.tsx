"use client";

export default function SoundMixer({ open, soundOn, musicVolume, sfxVolume, onToggle, onMusic, onSfx, onClose }: {
  open: boolean; soundOn: boolean; musicVolume: number; sfxVolume: number;
  onToggle: () => void; onMusic: (value: number) => void; onSfx: (value: number) => void; onClose: () => void;
}) {
  if (!open) return null;
  return <div className="sound-mixer panel">
    <div className="sound-mixer-head"><div><div className="eyebrow">SOUND & ATMOSPHERE</div><strong>{soundOn ? "ACTIVE" : "MUTED"}</strong></div><button onClick={onClose}>×</button></div>
    <label><span>MUSIC / AMBIENCE</span><input type="range" min="0" max="100" value={Math.round(musicVolume * 100)} onChange={(e) => onMusic(Number(e.target.value) / 100)} /></label>
    <label><span>SOUND EFFECTS</span><input type="range" min="0" max="100" value={Math.round(sfxVolume * 100)} onChange={(e) => onSfx(Number(e.target.value) / 100)} /></label>
    <button className="ghost-button sound-toggle-full" onClick={onToggle}>{soundOn ? "MUTE ALL" : "START SOUND"}</button>
  </div>;
}
