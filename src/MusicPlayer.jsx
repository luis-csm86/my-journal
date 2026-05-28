import { useEffect, useRef, useState } from "react";

export default function MusicPlayer({ song, enabled }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!song?.preview || !enabled) return;
    const audio = audioRef.current;
    audio.src = song.preview;
    audio.play().then(() => setPlaying(true)).catch(() => {});

    const tick = setInterval(() => {
      setProgress((audio.currentTime / 30) * 100);
    }, 300);

    audio.onended = () => { setPlaying(false); setProgress(0); };

    return () => {
      clearInterval(tick);
      audio.pause();
      setPlaying(false);
      setProgress(0);
    };
  }, [song, enabled]);

  const toggle = () => {
    const audio = audioRef.current;
    if (playing) { audio.pause(); setPlaying(false); }
    else { audio.play(); setPlaying(true); }
  };

  if (!song?.preview) return null;

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "12px",
      padding: "10px 14px",
      background: "rgba(0,0,0,0.05)",
      borderRadius: "10px", marginBottom: "22px",
    }}>
      <audio ref={audioRef} />

      {song.artwork && (
        <img src={song.artwork} alt="" style={{
          width: "36px", height: "36px",
          borderRadius: "6px", objectFit: "cover", flexShrink: 0,
        }} />
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: "13px", fontWeight: "600", color: "#1a1816",
          overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
          {song.name}
        </p>
        <p style={{ fontSize: "11px", color: "#78716c", marginTop: "1px" }}>
          {song.artist} · 30s preview
        </p>
        {/* Progress bar */}
        <div style={{
          marginTop: "6px", height: "3px",
          background: "rgba(0,0,0,0.1)", borderRadius: "2px",
        }}>
          <div style={{
            height: "100%", borderRadius: "2px",
            background: "#44403c",
            width: progress + "%",
            transition: "width 0.3s linear",
          }} />
        </div>
      </div>

      <button onClick={toggle} style={{
        width: "32px", height: "32px", borderRadius: "50%",
        background: "#44403c", color: "white",
        border: "none", cursor: "pointer",
        fontSize: "13px", display: "flex",
        alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        {playing ? "⏸" : "▶"}
      </button>
    </div>
  );
}