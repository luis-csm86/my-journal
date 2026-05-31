/* eslint-disable react-hooks/static-components */
import { useState, useMemo, useEffect } from "react";
import { supabase } from "./supabase";
import Auth from "./Auth";
import Editor from "./Editor";
import SongSearch from "./SongSearch";
import MusicPlayer from "./MusicPlayer";
import { BookOpenText, BookUser, Sparkles, Settings, LogOut } from 'lucide-react';

const MOODS = [
  { label: "Happy",     bg: "radial-gradient(ellipse at 15% 50%, #fbd07c 0%, #f7f779 100%)", darkBg: "#3d3000", glow: "#FACA16cc", text: "#713f12", dark: "#b45309" },
  { label: "Content",   bg: "radial-gradient(135deg, #43e97b 0%, #38f9d7 100%)", darkBg: "#003d1f", glow: "#228B22cc", text: "#14532d", dark: "#16a34a" },
  { label: "Neutral",   bg: "radial-gradient(135deg, #8399a2 0%, #eef2f3 100%)", darkBg: "#2c2c2a", glow: "#555555cc", text: "#44403c", dark: "#78716c" },
  { label: "Sad",       bg: "radial-gradient(135deg, #96c6ea 0%, #0974f1 100%)", darkBg: "#0f2347", glow: "#0974f1cc", text: "#1e3a8a", dark: "#3b82f6" },
  { label: "Anxious",   bg: "radial-gradient(135deg, #f1e1c2 0%, #fcbc98 100%)", darkBg: "#3d1f00", glow: "#FFBF00cc", text: "#7c2d12", dark: "#ea580c" },
  { label: "Angry",     bg: "radial-gradient(135deg, #ff0844 0%, #ffb199 100%)", darkBg: "#3d1010", glow: "#E60026cc", text: "#7f1d1d", dark: "#dc2626" },
  { label: "Emotional", bg: "radial-gradient(135deg, #9d80cb 0%, #f7c2e6 100%)", darkBg: "#1e1040", glow: "#BF00FFcc", text: "#3b0764", dark: "#7c3aed" },
  { label: "In Love",   bg: "radial-gradient(135deg, #f093fb 0%, #f5576c 100%)", darkBg: "#3d1028", glow: "#FF0080cc", text: "#831843", dark: "#dc2777" },
  { label: "Excited",   bg: "radial-gradient(135deg, #fa709a 0%, #fee140 100%)", darkBg: "#3d2200", glow: "#FE5A1Dcc", text: "#78350f", dark: "#d97706" },
  { label: "Tired",     bg: "radial-gradient(135deg, #a8edea 0%, #fed6e3 100%)", darkBg: "#252422", glow: "#536878cc", text: "#44403c", dark: "#78716c" },
];

function stripHtml(html) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  const text = tmp.textContent || tmp.innerText || "";
  return text.length > 120 ? text.slice(0, 120) + "..." : text;
}

function useParticles(count = 70) {
  return useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: ((i * 37 + 11) % 97) + 1.5,
      y: ((i * 53 + 7) % 95) + 2,
      size: (i % 5) * 2 + 6,
      duration: (i % 4) + 4,
      delay: (i % 7) * 0.7,
      opacity: 0.6 + (i % 4) * 0.1,
    })), [count]);
}

const CSS = `
html, body, #root {
  background: transparent !important;
  min-height: 100vh;
  margin: 0;
  padding: 0;
}
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'DM Sans',sans-serif;overflow-x:hidden}
@keyframes float{0%,100%{transform:translateY(0) scale(1);opacity:var(--op,0.5)}50%{transform:translateY(-18px) scale(1.15);opacity:calc(var(--op,0.5)*1.6)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideIn{from{opacity:0;transform:translateY(24px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes overlayIn{from{opacity:0}to{opacity:1}}
.particle{position:absolute;pointer-events:none; clip-path: polygon(50% 0%, 61% 39%, 100% 50%, 61% 61%, 50% 100%, 39% 61%, 0% 50%, 39% 39%);}
.fade-up{animation:fadeUp 0.45s ease both}
.slide-in{animation:slideIn 0.38s ease both}
.overlay-in{animation:overlayIn 0.25s ease both}
.nav-btn{padding:7px 16px;border-radius:999px;border:1.5px solid;background:transparent;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:12.5px;font-weight:500;letter-spacing:0.04em;transition:all 0.2s ease}
.nav-btn:hover{transform:translateY(-1px)}
.mood-pill{padding:6px 14px;border-radius:999px;border:1.5px solid;background:transparent;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:400;transition:all 0.18s ease}
.mood-pill:hover{transform:scale(1.04)}
.plus-btn{width:52px;height:52px;border-radius:50%;border:none;cursor:pointer;font-size:22px;display:flex;align-items:center;justify-content:center;color:white;transition:all 0.22s ease;flex-shrink:0}
.plus-btn:hover{transform:scale(1.1) rotate(90deg)}
.entry-card{border-radius:18px;padding:28px 32px;transition:transform 0.22s ease}
.entry-card:hover{transform:translateY(-2px)}
.toolbar-btn{width:30px;height:30px;border-radius:7px;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;transition:background 0.15s;background:transparent;font-family:'DM Sans',sans-serif}
.toggle{width:42px;height:23px;border-radius:12px;border:none;cursor:pointer;position:relative;transition:background 0.28s}
.toggle::after{content:'';position:absolute;top:3px;width:17px;height:17px;border-radius:50%;background:white;transition:left 0.28s ease;box-shadow:0 1px 3px rgba(0,0,0,0.2)}
.toggle.on::after{left:22px}.toggle.off::after{left:3px}
input,textarea{border:none;outline:none;background:transparent;font-family:'DM Sans',sans-serif;width:100%}
textarea{resize:vertical}
::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-thumb{border-radius:8px;background:rgba(0,0,0,0.12)}
.section-label{font-size:10.5px;letter-spacing:0.12em;text-transform:uppercase;font-weight:600;margin-bottom:18px}
.entry-content img{max-width:100%;max-height:400px;width:auto;border-radius:10px;margin:10px 0;display:block;object-fit:cover;}
`;

export default function App() {
  const [session, setSession] = useState(null);
  const [page, setPage] = useState("journal");
  const [entries, setEntries] = useState([]);
  const [editingEntry, setEditingEntry] = useState(null);
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [userName, setUserName] = useState("Alex");
  const [bgMood, setBgMood] = useState("Neutral");
  const particles = useParticles(70);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    
    const fetchEntries = async () => {
      const { data, error } = await supabase
        .from("entries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) console.error(error);
      else setEntries(data.map(e => ({
        id: e.id,
        date: e.date,
        time: e.time,
        year: e.year,
        location: e.location,
        mood: e.mood,
        text: e.text,
        song: e.song,
        reflectionQ: e.reflection_q,
        reflectionA: e.reflection_a,
        published: e.published,
      })));

      setLoadingEntries(false);
    };

    fetchEntries();
  }, [session]);

  const mood = MOODS.find(m => m.label === bgMood) || MOODS[2];

  if (!session) return <Auth />;

  const dk = {
    pageBg: darkMode ? `linear-gradient(135deg, ${mood.darkBg} 0%, #0d0d0d 100%)` : mood.bg,
    particleColor: darkMode ? mood.glow.replace("cc", "40") : mood.glow,
    navBg: darkMode ? "rgba(0,0,0,0.3)" : "transparent",
    navBorder: darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
    appName: darkMode ? "#ede9fe" : mood.text,
    navBtnColor: darkMode ? "rgba(255,255,255,0.65)" : mood.dark,
    navBtnBorder: darkMode ? "rgba(255,255,255,0.18)" : `${mood.text}`,
    navActiveBg: darkMode ? mood.dark : mood.text,
    cardBg: darkMode ? "rgba(255,255,255,0.055)" : "rgba(255,255,255,0.58)",
    cardBorder: darkMode ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.07)",
    text: darkMode ? "#ede9fe" : "#1a1816",
    sub: darkMode ? "#9ca3af" : "#3D3937",
    inputBg: darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.04)",
    divider: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)",
    toolbarBg: darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)",
    accentColor: darkMode ? mood.dark : mood.text,
  };

  return (
    <>
      <style>{CSS}</style>

      {/* Animated background */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        background: darkMode
        ? `
          radial-gradient(ellipse at 15% 50%, ${mood.darkBg} 0%, #111111 55%),
          radial-gradient(ellipse at 85% 15%, ${mood.darkBg} 0%, #111111 50%),
          radial-gradient(ellipse at 55% 85%, ${mood.darkBg} 0%, #111111 45%),
          #111111` : 
          `
          ${mood.bg}`,
      }}>
        {particles.map(p => (
          <div key={p.id} className="particle" style={{
            left: p.x + "%", top: p.y + "%",
            width: p.size + "px", height: p.size + "px",
            background: darkMode
              ? mood.glow.replace("cc", "60")
              : mood.glow,
            "--op": p.opacity,
            animation: `float ${p.duration}s ${p.delay}s ease-in-out infinite`,
          }} />
        ))}
      </div>

      {/* App shell */}
      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", flexDirection: "column" }}>

        {/* Nav */}
        <nav style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px 32px",
          background: dk.navBg,
          borderBottom: `1px solid ${dk.navBorder}`,
          backdropFilter: "blur(16px)",
          position: "sticky", top: 0, zIndex: 50,
        }}>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "21px", fontWeight: "700",
            color: dk.appName, letterSpacing: "-0.02em",
          }}>
            {userName || "My"}&rsquo;s Journal
          </span>

          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {[
              { id: "journal", label: "Journal", icon: <BookOpenText size={14} strokeWidth={2.2} /> },
              { id: "memories", label: "Memories", icon: <Sparkles size={14} strokeWidth={2.2} /> },
              { id: "settings", label: "Settings", icon: <Settings size={14} strokeWidth={2.2} /> },
            ].map(tab => (
              <button key={tab.id} className="nav-btn"
                onClick={() => setPage(tab.id)}
                style={{
                  color: page === tab.id ? "white" : dk.navBtnColor,
                  borderColor: page === tab.id ? (darkMode ? "#7c3aed" : mood.text) : dk.navBtnBorder,
                  background: page === tab.id ? dk.navActiveBg : "transparent",
                  boxShadow: page === tab.id ? `0 2px 12px ${mood.text}30` : "none",
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
            <button 
              className="nav-btn"
              onClick={() => supabase.auth.signOut()}
              style={{
                color: dk.navBtnColor,
                borderColor: dk.navBtnBorder,
              }}
            >
              <LogOut size={14} strokeWidth={2.2} /> Sign out
            </button>
          </div>
        </nav>

        {/* Main content */}
        <main style={{ flex: 1, padding: "48px 24px 100px", maxWidth: "760px", margin: "0 auto", width: "100%" }}>
          {page === "journal" && (
            <JournalPage
              entries={entries} setEntries={setEntries}
              darkMode={darkMode} dk={dk} mood={mood}
              setBgMood={setBgMood}
              onDelete={async (id) => {
                if (!window.confirm("Delete this entry? This can't be undone.")) return;
                const { error } = await supabase
                  .from("entries")
                  .delete()
                  .eq("id", id);
                if (error) { console.error(error); return; }
                setEntries(prev => prev.filter(e => e.id !== id));
              }}
              onEdit={(entry) => {
                setEditingEntry(entry);
                setShowForm(true);
              }}
            />
          )}
          {page === "memories" && (
            <MemoriesPage entries={entries} darkMode={darkMode} dk={dk} />
          )}
          {page === "settings" && (
            <SettingsPage
              darkMode={darkMode} setDarkMode={setDarkMode}
              musicEnabled={musicEnabled} setMusicEnabled={setMusicEnabled}
              userName={userName} setUserName={setUserName}
              dk={dk} mood={mood}
            />
          )}
        </main>

        {/* Floating + button */}
        {page === "journal" && (
          <div style={{ position: "fixed", bottom: "32px", right: "32px", zIndex: 40 }}>
            <button className="plus-btn"
              style={{ background: dk.navActiveBg, boxShadow: `0 4px 20px ${mood.text}40` }}
              onClick={() => { setEditingEntry(null); setShowForm(true); }}
            >
              +
            </button>
          </div>
        )}
      </div>

      {/* Entry form modal */}
      {showForm && (
        <EntryForm
          entry={editingEntry}
          onClose={() => { setShowForm(false); setEditingEntry(null); }}
          onMoodChange={(mood) => setBgMood(mood)} 
          onPublish={(updatedEntry) => {
            setEntries(prev => {
              const exists = prev.find(e => e.id === updatedEntry.id);
              if (exists) return prev.map(e => e.id === updatedEntry.id ? updatedEntry : e);
              return [updatedEntry, ...prev];
            });
            setBgMood(updatedEntry.mood);
            setShowForm(false);
            setEditingEntry(null);
          }}
          darkMode={darkMode} dk={dk}
        />
      )}
    </>
  );
}

/* ── Journal Page ─────────────────────────────────────────── */
function JournalPage({ entries, setEntries, darkMode, dk, mood, setBgMood, onDelete, onEdit }) {
  const latest = entries[0];

  if (!latest) return (
    <div className="fade-up" style={{ textAlign: "center", paddingTop: "80px" }}>
      <div style={{
        display: "flex",
        justifyContent: "center",
        color: dk.accentColor,
        opacity: 0.65,
        marginBottom: "20px"
      }}>
        <BookUser size={64} strokeWidth={1.5} />
      </div>
      <p style={{ fontFamily: "'Playfair Display',serif", fontSize: "24px", color: dk.text, marginBottom: "8px" }}>
        Your journal is empty
      </p>
      <p style={{ fontSize: "14px", color: dk.sub }}>Tap + to write your first entry</p>
    </div>
  );

  return (
    <div className="fade-up">
      {/* Date header */}
      <div style={{ textAlign: "center", marginBottom: "36px" }}>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(30px,5vw,46px)",
          fontWeight: "700", letterSpacing: "-0.025em", lineHeight: 1.1,
          color: dk.text,
        }}>
          {latest.date}
        </h1>
        <p style={{ marginTop: "10px", fontSize: "13px", color: dk.sub, letterSpacing: "0.02em" }}>
          {latest.year} · {latest.time} · {latest.location}
        </p>
        <p style={{
          marginTop: "7px", fontSize: "10.5px",
          letterSpacing: "0.14em", textTransform: "uppercase",
          color: dk.accentColor, fontWeight: "600",
        }}>
          {latest.mood}
        </p>
      </div>

      {/* Latest entry card */}
      <div className="entry-card" style={{
        background: dk.cardBg,
        border: `1px solid ${dk.cardBorder}`,
        backdropFilter: "blur(14px)",
      }}>
        {latest.song && (
          <MusicPlayer 
            song={typeof latest.song === "string" ? JSON.parse(latest.song) : latest.song}
            enabled={true}
          />
        )}

        <div 
          className="entry-content"
          dangerouslySetInnerHTML={{ __html: latest.text }}
          style={{ fontSize: "15.5px", lineHeight: "1.85", color: dk.text }}
        />
        
        <div style={{
          display: "flex", gap: "8px", justifyContent: "flex-end",
          marginTop: "20px", paddingTop: "16px",
          borderTop: `1px solid ${dk.divider}`,
        }}>
          <button
            onClick={() => onEdit(latest)}
            style={{
              padding: "7px 16px",
              background: "transparent",
              border: `1px solid ${dk.cardBorder}`,
              borderRadius: "8px", cursor: "pointer",
              fontSize: "12.5px", color: dk.sub,
              fontFamily: "'DM Sans',sans-serif",
              fontWeight: "500",
            }}
          >
            ✏️ Edit
          </button>
          <button
            onClick={() => onDelete(latest.id)}
            style={{
              padding: "7px 16px",
              background: "transparent",
              border: "1px solid #fca5a5",
              borderRadius: "8px", cursor: "pointer",
              fontSize: "12.5px", color: "#b91c1c",
              fontFamily: "'DM Sans',sans-serif",
              fontWeight: "500",
            }}
          >
            🗑 Delete
          </button>
        </div>
      </div>

      <ReflectionSection
        entry={latest}
        onUpdate={async (upd) => {
          const { error } = await supabase
            .from("entries")
            .update({ 
              reflection_a: upd.reflectionA,
              reflection_q: upd.reflectionQ,
            })
            .eq("id", latest.id);

          if (error) { console.error(error); return; }
          setEntries(prev => prev.map(e => e.id === latest.id ? { ...e, ...upd } : e));
        }}
        dk={dk} mood={mood}
      />

      {/* Older entries preview */}
      {entries.length > 1 && (
        <div style={{ marginTop: "32px" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: dk.sub, marginBottom: "16px", fontWeight: "600" }}>
            Recent Entries
          </p>
          {entries.slice(1, 3).map((e) => {
            const m = MOODS.find(x => x.label === e.mood) || MOODS[2];
            return (
              <div key={e.id} style={{
                display: "flex", gap: "16px", alignItems: "flex-start",
                padding: "16px 20px",
                background: dk.cardBg,
                border: `1px solid ${dk.cardBorder}`,
                borderLeft: `3px solid ${m.glow}`,
                backdropFilter: "blur(10px)",
                borderRadius: "12px", marginBottom: "10px",
                cursor: "pointer", transition: "transform 0.2s",
              }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "13.5px", fontWeight: "500", color: dk.text }}>{e.date}</p>
                  <p style={{ fontSize: "13px", color: dk.sub, marginTop: "4px", lineHeight: "1.5" }}>
                    {stripHtml(e.text)}
                  </p>
                  
                  <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
                    <button
                      onClick={(evt) => { evt.stopPropagation(); onEdit(e); }}
                      style={{
                        padding: "5px 12px", background: "transparent",
                        border: `1px solid ${dk.cardBorder}`,
                        borderRadius: "6px", cursor: "pointer",
                        fontSize: "11.5px", color: dk.sub,
                        fontFamily: "'DM Sans',sans-serif",
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={(evt) => { evt.stopPropagation(); onDelete(e.id); }}
                      style={{
                        padding: "5px 12px", background: "transparent",
                        border: "1px solid #fca5a5",
                        borderRadius: "6px", cursor: "pointer",
                        fontSize: "11.5px", color: "#b91c1c",
                        fontFamily: "'DM Sans',sans-serif",
                      }}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
                <span style={{
                  fontSize: "10px", padding: "3px 9px", borderRadius: "999px",
                  background: m.bg, color: m.text,
                  fontWeight: "600", letterSpacing: "0.07em", textTransform: "uppercase",
                  flexShrink: 0, marginTop: "2px",
                }}>
                  {e.mood}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Reflection Section ───────────────────────────────────── */
function ReflectionSection({ entry, onUpdate, dk, mood }) {
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState(entry.reflectionA || "");
  const [question, setQuestion] = useState(entry.reflectionQ || "");
  const [loading, setLoading] = useState(false);

  const generateQuestion = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          max_tokens: 100,
          messages: [
            {
              role: "system",
              content: `You are a warm, friendly journaling coach. 
              Read the journal entry and generate ONE simple,
              short reflection question - maximum 12 words.
              Use plain everyday language, nothing academic or complex.
              Make it feel like a friend asking, not a therapist.
              Only return the question, nothing else. 
              No preamble, no quotes, just the question.`,
            },
            {
              role: "user",
              content: `Journal entry: ${entry.text.replace(/<[^>]*>/g, "")}`,
            },
          ],
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("Groq error:", data);
        throw new Error(data.error?.message || "API error");
      }
      const q = data.choices[0].message.content.trim();
      setQuestion(q);
      onUpdate({ reflectionQ: q });
    } catch (err) {
      console.error(err);
      setQuestion("What was the most meaningful part of today?");
    }
    setLoading(false);
    setOpen(true);
  };

  return (
    <div style={{
      marginTop: "28px", paddingTop: "22px",
      borderTop: `1px solid ${dk.divider}`,
    }}>
      {!open ? (
        <button
          onClick={generateQuestion}
          disabled={loading}
          style={{
            width: "100%", padding: "13px",
            border: `1.5px dashed ${dk.accentColor}50`,
            borderRadius: "12px", background: "transparent",
            cursor: loading ? "wait" : "pointer",
            display: "flex", alignItems: "center",
            justifyContent: "center", gap: "8px",
            color: dk.accentColor, fontSize: "13.5px",
            fontFamily: "'DM Sans',sans-serif", fontWeight: "500",
            transition: "all 0.2s",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "✦  Thinking..." : "✦  Generate Reflection Question"}
        </button>
      ) : (
        <div className="fade-up">
          <p style={{
            fontSize: "13.5px", fontWeight: "500",
            color: dk.accentColor, marginBottom: "14px",
          }}>
            ✦  {question}
          </p>
          <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <span style={{ fontSize: "15px", marginTop: "11px", flexShrink: 0 }}>💬</span>
            <div style={{ flex: 1 }}>
              <textarea
                placeholder="Your thoughts..."
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                rows={3}
                style={{
                  padding: "12px 14px",
                  background: dk.inputBg,
                  borderRadius: "10px",
                  color: dk.text,
                  fontSize: "14px",
                  lineHeight: "1.65",
                  minHeight: "80px",
                  width: "100%",
                  border: "none",
                  outline: "none",
                  fontFamily: "'DM Sans',sans-serif",
                  resize: "vertical",
                }}
              />
              <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                <button
                  onClick={() => onUpdate({ reflectionA: answer, reflectionQ: question })}
                  style={{
                    padding: "8px 18px",
                    background: dk.accentColor,
                    color: "white", border: "none",
                    borderRadius: "8px", cursor: "pointer",
                    fontSize: "13px",
                    fontFamily: "'DM Sans',sans-serif",
                    fontWeight: "600",
                  }}
                >
                  Save
                </button>
                <button
                  onClick={() => setOpen(false)}
                  style={{
                    padding: "8px 14px", background: "transparent",
                    border: `1px solid ${dk.divider}`,
                    borderRadius: "8px", cursor: "pointer",
                    fontSize: "13px",
                    fontFamily: "'DM Sans',sans-serif",
                    color: dk.sub,
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Song Bar ─────────────────────────────────────────────── */
function SongBar({ song, dk }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "12px",
      padding: "10px 14px",
      background: dk.inputBg, borderRadius: "10px",
      marginBottom: "22px",
    }}>
      <div style={{
        width: "34px", height: "34px", borderRadius: "6px",
        background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "white", fontSize: "13px", flexShrink: 0,
      }}>♪</div>
      <div>
        <p style={{ fontSize: "13px", color: dk.text, fontWeight: "500" }}>{song}</p>
        <p style={{ fontSize: "11px", color: dk.sub, marginTop: "1px" }}>Now playing</p>
      </div>
    </div>
  );
}

/* ── Memories Page ────────────────────────────────────────── */
function MemoriesPage({ entries, darkMode, dk }) {
  const sorted = [...entries].sort((a, b) => a.id - b.id);

  return (
    <div className="fade-up">
      <h2 style={{
        fontFamily: "'Playfair Display',serif", fontSize: "34px",
        fontWeight: "700", color: dk.text, marginBottom: "6px",
      }}>
        Memories
      </h2>
      <p style={{ fontSize: "13px", color: dk.sub, marginBottom: "36px" }}>
        {entries.length} {entries.length === 1 ? "entry" : "entries"} · oldest to newest
      </p>

      {sorted.map((entry, i) => {
        const m = MOODS.find(x => x.label === entry.mood) || MOODS[2];
        return (
          <div key={entry.id} className="entry-card fade-up" style={{
            background: dk.cardBg,
            border: `1px solid ${dk.cardBorder}`,
            backdropFilter: "blur(14px)",
            borderLeft: `4px solid ${m.glow}`,
            animationDelay: `${i * 0.08}s`,
            marginBottom: "16px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
              <div>
                <p style={{ fontFamily: "'Playfair Display',serif", fontSize: "19px", fontWeight: "600", color: dk.text }}>
                  {entry.date}
                </p>
                <p style={{ fontSize: "12px", color: dk.sub, marginTop: "3px" }}>
                  {entry.year} · {entry.time} · {entry.location}
                </p>
              </div>
              <span style={{
                fontSize: "10.5px", padding: "4px 11px", borderRadius: "999px",
                background: m.bg, color: m.text,
                fontWeight: "600", letterSpacing: "0.07em", textTransform: "uppercase",
                flexShrink: 0,
              }}>
                {entry.mood}
              </span>
            </div>

            {entry.song && (
              <MusicPlayer
                song={typeof entry.song === "string" ? JSON.parse(entry.song) : entry.song}
                enabled={true}
              />
            )}

            <div
              className="entry-content"
              dangerouslySetInnerHTML={{ __html: entry.text }}
              style={{ fontSize: "14.5px", lineHeight: "1.8", color: dk.text }}
            />

            {entry.reflectionQ && (
              <div style={{
                marginTop: "18px", padding: "14px 16px",
                background: dk.inputBg, borderRadius: "10px",
              }}>
                <p style={{ fontSize: "12.5px", fontWeight: "600", color: m.text, marginBottom: "5px" }}>
                  ✦ &nbsp;{entry.reflectionQ}
                </p>
                {entry.reflectionA && (
                  <p style={{ fontSize: "13px", color: dk.sub, fontStyle: "italic", lineHeight: "1.6" }}>
                    &ldquo;{entry.reflectionA}&rdquo;
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Settings Page ────────────────────────────────────────── */
function SettingsCard({ title, children, dk }) {
    return (
      <div style={{
      background: dk.cardBg,
      border: `1px solid ${dk.cardBrder}`,
      backdropFilter: "blur(14px)",
      borderRadius: "18px", padding: "26px 28px", 
      marginBottom: "16px",
    }}>
      <p style={{
        fontSize: "10.5px", letterSpacing: "0.12em",
        textTransform: "uppercase", fontWeight: "600",
        color: dk.accentColor, marginBottom: "18px",
      }}>
        {title}
      </p>
      {children}
    </div>
    );
  }

function SettingsField({ label, value, onChange, type = "text", dk }) {
  return (
    <div style={{ marginBottom: "15px" }}>
      <label style={{ fontSize: "12px", color: dk.sub, display: "block", marginBottom: "6px" }}>
        {label}
        </label>
        <div style={{ padding: "10px 14px", background: dk.inputBg, borderRadius: "10px" }}>
          <input
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            style={{ color: dk.text, fontSize: "14px", width: "100%", border: "none", outline: "none", background: "transparent", fontFamily: "'DM Sans', sans-serif" }}
            />
        </div>
    </div>
  );
}

function SettingsToggle({ label, desc, value, onChange, dk, darkMode }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "14px 0",
      borderBottom: `1px solid ${dk.divider}`,
    }}>
      <div style={{ flex: 1, paddingRight: "24px" }}>
        <p style={{ fontSize: "14px", color: dk.text, fontWeight: "500" }}>{label}</p>
        {desc && <p style={{ fontSize: "12px", color: dk.sub, marginTop: "2px" , lineHeight: "1.5" }}>{desc}</p>}
      </div>
      <button
        className={`toggle ${value ? "on" : "off"}`}
        onClick={() => onChange(!value)}
        style={{
          background: value ? dk.accentColor : (darkMode ? "rgba(255,255,255,0.15)" : "#d6d3d1"),
          flexShrink: 0,
        }}
        />
    </div>
  );
}

function SettingsPage({ darkMode, setDarkMode, musicEnabled, setMusicEnabled, userName, setUserName, dk, mood }) {
  const [email, setEmail] = useState("alex@example.com");
  const [lastName, setLastName] = useState("Rivera");
  const [activityLog, setActivityLog] = useState(true);

  return (
    <div classname="fade-up">
      <h2 style={{
        fontFamily: "'Playfair Display', sans-serif", fontSize: "34px",
        fontWeight: "700", color: dk.text, marginBottom: "36px",
      }}>
        Settings
      </h2>

      <SettingsCard title="Profile" dk={dk}>
        <SettingsField label="First name" value={userName} onChange={setUserName} dk={dk} />
        <SettingsField label="Last name" value={lastName} onChange={setLastName} dk={dk} />
        <SettingsField label= "Email address" value={email} onChange={setEmail} type="email" dk={dk} />
      </SettingsCard>

      <SettingsCard title="Preferences" dk={dk}>
        <SettingsToggle
          label="Dark mode" desc="Easier on the eyes at night"
          value={darkMode} onChange={setDarkMode} dk={dk} darkMode={darkMode}
          />
          <SettingsToggle
          label="Background music" desc="Songs play while you read your entries"
          value={musicEnabled} onChange={setMusicEnabled} dk={dk} darkMode={darkMode}
          />
          <SettingsToggle
          label="Activity log" desc="Track your journaling streak and history"
          value={activityLog} onChange={setActivityLog} dk={dk} darkMode={darkMode}
          />
      </SettingsCard>

      <SettingsCard title="Danger zone" dk={dk}>
        <p style={{ fontSize: "13px", color: dk.sub, marginBottom: "14px", lineHeight: "1.5" }}>
          Deleting all entries is permanent and cannot be undone.
        </p>
        <button style={{
          padding: "10px 20px", 
          background: darkMode ? "rgba(239,68,68,0.12)" : "#fee2e2",
          color: "#b91c1c", border: "1px solid #fca5a5",
          borderRadius: "10px", cursor: "pointer",
          fontSize: "13px", fontFamily: "'DM Sans', sans-serif", fontWeight: "600",
        }}>
          Delete all entries
        </button>
      </SettingsCard>
    </div>
  );
}


/* ── Entry Form Modal ─────────────────────────────────────── */
function EntryForm({ entry, onClose, onPublish, onMoodChange, darkMode, dk }) {
  const [mood, setMood] = useState(entry?.mood || "Neutral");
  const [html, setHtml] = useState(entry?.text || "");
  const [song, setSong] = useState(
    entry?.song
      ? (typeof entry.song === "string" ? JSON.parse(entry.song) : entry.song)
      : null
  );

  const selectedMood = MOODS.find(m => m.label === mood) || MOODS[2];
  const now = new Date();
  const dateStr = entry?.date || now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const timeStr = entry?.time || now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  const isEditing = !!entry?.id;

  const modalBg = darkMode ? "#1c1c1e" : "#ffffff";
  const modalBorder = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";

  const handlePublish = async () => {
    const payload = {
      mood,
      text: html || "<p>A new entry...</p>",
      song: song ? JSON.stringify(song) : null,
    };

    if (isEditing) {
      const { error } = await supabase
        .from("entries")
        .update(payload)
        .eq("id", entry.id);
      if (error) { console.error(error); return; }
      onPublish({ ...entry, ...payload, song });
    } else {
      const { data: userData } = await supabase.auth.getUser();
      const newEntry = {
        user_id: userData.user.id,
        date: dateStr,
        time: timeStr,
        year: now.getFullYear().toString(),
        location: "Barcelona, Spain",
        reflection_q: "",
        reflection_a: "",
        published: true,
        ...payload,
      };
      const { data, error } = await supabase
        .from("entries")
        .insert(newEntry)
        .select()
        .single();
      if (error) { console.error(error); return; }
      onPublish({
        id: data.id,
        date: dateStr,
        time: timeStr,
        year: now.getFullYear().toString(),
        location: "Barcelona, Spain",
        mood,
        text: payload.text,
        song,
        reflectionQ: "",
        reflectionA: "",
        published: true,
      });
    }
  };

  return (
    <div className="overlay-in" onClick={e => e.target === e.currentTarget && onClose()} style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)",
      zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px",
    }}>
      <div className="slide-in" style={{
        width: "100%", maxWidth: "600px", maxHeight: "90vh",
        background: modalBg, borderRadius: "22px",
        border: `1px solid ${modalBorder}`,
        boxShadow: "0 30px 70px rgba(0,0,0,0.22)",
        overflowY: "auto", padding: "36px",
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "26px" }}>
          <h2 style={{
            fontFamily: "'Playfair Display',serif", fontSize: "26px",
            fontWeight: "700", color: dk.text,
          }}>
            {isEditing ? "Edit Entry" : dateStr}
          </h2>
          <p style={{ fontSize: "12.5px", color: dk.sub, marginTop: "7px" }}>
            {entry?.year || now.getFullYear()} · {timeStr} · Barcelona, Spain
          </p>
        </div>

        {/* Song search */}
        <SongSearch
          onSelect={setSong}
          selectedSong={song}
          dk={{ ...dk, accentColor: selectedMood.text }}
        />

        {/* Mood picker */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
            <p style={{ fontSize: "13px", color: dk.sub, paddingTop: "8px", minWidth: "120px", lineHeight: "1.4" }}>
              How are you feeling?
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
              {MOODS.map(m => (
                <button key={m.label} className={`mood-pill ${mood === m.label ? "selected" : ""}`}
                  onClick={() => { setMood(m.label); onMoodChange(m.label); }}
                  style={{
                    color: mood === m.label ? "white" : m.text,
                    borderColor: m.glow.replace("cc", "99"),
                    background: mood === m.label ? m.text : "transparent",
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Rich text editor */}
        <Editor
          onChange={setHtml}
          darkMode={darkMode}
          dk={dk}
          initialContent={entry?.text || ""}
        />

        {/* Actions */}
        <div style={{ display: "flex", gap: "8px", marginTop: "16px", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{
            padding: "10px 16px", border: `1px solid ${dk.cardBorder}`,
            borderRadius: "10px", background: "transparent",
            color: "#b91c1c", cursor: "pointer", fontSize: "13px",
            fontFamily: "'DM Sans',sans-serif", fontWeight: "500",
          }}>
            🗑 Delete
          </button>
          <button onClick={onClose} style={{
            padding: "10px 16px", border: `1px solid ${dk.cardBorder}`,
            borderRadius: "10px", background: "transparent",
            color: dk.text, cursor: "pointer", fontSize: "13px",
            fontFamily: "'DM Sans',sans-serif", fontWeight: "500",
          }}>
            Cancel
          </button>
          <button onClick={handlePublish} style={{
            padding: "10px 22px", background: selectedMood.text,
            color: "white", border: "none", borderRadius: "10px",
            cursor: "pointer", fontSize: "13px",
            fontFamily: "'DM Sans',sans-serif", fontWeight: "700",
            letterSpacing: "0.02em",
            boxShadow: `0 4px 16px ${selectedMood.text}40`,
          }}>
            {isEditing ? "Save Changes ✓" : "Publish ✓"}
          </button>
        </div>
      </div>
    </div>
  );
}