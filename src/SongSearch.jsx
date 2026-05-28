import { useState } from "react";

export default function SongSearch({ onSelect, selectedSong, dk }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const search = async () => {
    if (!query.trim()) return;
    setSearching(true);
    const res = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=6`
    );
    const data = await res.json();
    setResults(data.results);
    setSearching(false);
  };

  return (
    <div style={{ marginBottom: "22px" }}>
      {/* Search bar */}
      <div style={{
        display: "flex", gap: "8px", alignItems: "center",
        padding: "11px 14px",
        background: dk.inputBg, borderRadius: "12px",
      }}>
        <span style={{ fontSize: "16px" }}>♪</span>
        <input
          placeholder="Search for a song (optional)..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && search()}
          style={{ flex: 1, fontSize: "14px", color: dk.text }}
        />
        {query && (
          <button onClick={search} style={{
            padding: "5px 12px",
            background: dk.accentColor,
            color: "white", border: "none",
            borderRadius: "8px", cursor: "pointer",
            fontSize: "12px", fontFamily: "'DM Sans', sans-serif",
            fontWeight: "600",
          }}>
            {searching ? "..." : "Search"}
          </button>
        )}
      </div>

      {/* Selected song display */}
      {selectedSong && (
        <div style={{
          display: "flex", alignItems: "center", gap: "10px",
          marginTop: "10px", padding: "10px 14px",
          background: dk.inputBg, borderRadius: "10px",
          border: `1px solid ${dk.accentColor}40`,
        }}>
          <img src={selectedSong.artwork} alt="" style={{
            width: "38px", height: "38px",
            borderRadius: "6px", objectFit: "cover", flexShrink: 0,
          }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: "13px", fontWeight: "600", color: dk.text,
              overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
              {selectedSong.name}
            </p>
            <p style={{ fontSize: "11px", color: dk.sub, marginTop: "1px" }}>
              {selectedSong.artist}
            </p>
          </div>
          <button onClick={() => onSelect(null)} style={{
            background: "transparent", border: "none",
            cursor: "pointer", color: dk.sub, fontSize: "16px",
          }}>✕</button>
        </div>
      )}

      {/* Search results */}
      {results.length > 0 && !selectedSong && (
        <div style={{
          marginTop: "8px",
          border: `1px solid ${dk.cardBorder}`,
          borderRadius: "12px", overflow: "hidden",
        }}>
          {results.map((track, i) => (
            <div key={track.trackId}
              onClick={() => { onSelect({
                name: track.trackName,
                artist: track.artistName,
                artwork: track.artworkUrl100,
                preview: track.previewUrl,
              }); setResults([]); setQuery(""); }}
              style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "10px 14px", cursor: "pointer",
                background: dk.inputBg,
                borderBottom: i < results.length - 1 ? `1px solid ${dk.cardBorder}` : "none",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.75"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              <img src={track.artworkUrl100} alt="" style={{
                width: "40px", height: "40px",
                borderRadius: "6px", objectFit: "cover", flexShrink: 0,
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "13.5px", fontWeight: "500", color: dk.text,
                  overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                  {track.trackName}
                </p>
                <p style={{ fontSize: "12px", color: dk.sub, marginTop: "1px" }}>
                  {track.artistName} · {track.collectionName}
                </p>
              </div>
              <span style={{ fontSize: "11px", color: dk.sub, flexShrink: 0 }}>30s</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}