import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useDemo } from "@/context/DemoContext";
import { ArrowRight, Zap, Link2, Target, Cpu, Play } from "lucide-react";

// ─── Merge Visual data ────────────────────────────────────────────────────────

const SOURCE_LANGS = [
  { code: "粵", label: "Cantonese", arcColor: "hsl(142,65%,45%)", insight: "Nasal + French R", tooltip: "Cantonese 人 mirrors French nasal vowels; 二 (yi) ≈ French 'r'." },
  { code: "中", label: "Mandarin",  arcColor: "hsl(43,90%,44%)",  insight: "Pattern Recognition", tooltip: "Mandarin → French: SVO + logical approach." },
  { code: "EN", label: "English",   arcColor: "hsl(210,90%,55%)", insight: "Cognate Goldmine", tooltip: "English → French: ~45% vocabulary shared." },
];

const TARGET = { code: "FR", label: "French", color: "hsl(43,90%,44%)" };

const OUTPUT_INSIGHTS = [
  "Cognate Goldmine Mapped",
  "Nasal Bridge: 人 → enfant",
  "SVO + Pattern Recognition",
  "45% Vocab Overlap Detected",
];

function qBez(p0: number, p1: number, p2: number, t: number) {
  return (1 - t) ** 2 * p0 + 2 * (1 - t) * t * p1 + t ** 2 * p2;
}

function LanguageMergeVisual() {
  const [tick,       setTick]       = useState(0);
  const [hovered,    setHovered]    = useState<string | null>(null);
  const [outIdx,     setOutIdx]     = useState(0);
  const [outVisible, setOutVisible] = useState(true);
  const [srcFlash,   setSrcFlash]   = useState([false, false, false]);

  useEffect(() => { const id = setInterval(() => setTick(n => n + 1), 16); return () => clearInterval(id); }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setOutVisible(false);
      setTimeout(() => { setOutIdx(i => (i + 1) % OUTPUT_INSIGHTS.length); setOutVisible(true); }, 350);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    SOURCE_LANGS.forEach((_, i) => {
      const loop = () => {
        setSrcFlash(f => { const n = [...f]; n[i] = true; return n; });
        timers.push(setTimeout(() => {
          setSrcFlash(f => { const n = [...f]; n[i] = false; return n; });
          timers.push(setTimeout(loop, 3200 + i * 400));
        }, 1800));
      };
      timers.push(setTimeout(loop, i * 1100));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  const t = tick / 60;
  // Layout: Left (3 langs) → Center (Mixingo) → Right (French)
  const LEFT_X = 75;
  const CENTER_X = 210; const CENTER_Y = 130;
  const RIGHT_X = 345; const RIGHT_Y = 130;
  const NODE_R = 20;
  const CORE_R = 32;

  // 3 circles stacked vertically on the left, all feeding into center
  const srcY = [60, 130, 200];
  const nodes = SOURCE_LANGS.map((lang, i) => ({
    ...lang,
    x: LEFT_X + Math.sin(t * 0.4 + i * 0.8) * 4,
    y: srcY[i] + Math.cos(t * 0.35 + i) * 3,
  }));

  // Control points for arcs: left nodes → center (curve toward center)
  const srcCtrl = nodes.map((n, i) => ({
    mx: (n.x + CENTER_X) / 2 + 20,
    my: (n.y + CENTER_Y) / 2 + (i - 1) * 8,
  }));
  const outCtrlX = (CENTER_X + RIGHT_X) / 2;
  const outCtrlY = CENTER_Y - 25;

  return (
    <div className="relative flex flex-col items-center select-none w-full" style={{ userSelect: "none" }}>
      {/* Insight pill */}
      <div className="absolute z-10 pointer-events-none" style={{ top: -2, left: "50%", transform: "translateX(-50%)", transition: "opacity 0.35s ease", opacity: outVisible ? 1 : 0, whiteSpace: "nowrap" }}>
        <span className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-bold" style={{ background: "hsl(43 90% 44%)", color: "white", boxShadow: "0 3px 12px hsl(43 90% 44% / 0.28)" }}>
          <Zap size={9} strokeWidth={3} />
          {OUTPUT_INSIGHTS[outIdx]}
        </span>
      </div>

      <svg viewBox="0 0 420 260" width="420" height="260" className="overflow-visible w-full max-w-[460px]">
        <defs>
          <radialGradient id="vAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(210,90%,60%)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          <filter id="vGlowCore" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="b" /><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="vGlowNode" x="-35%" y="-35%" width="170%" height="170%">
            <feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="vGlowDot" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="2" result="b" /><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Arcs: 3 left nodes → center (all feeding into Mixingo) */}
        {nodes.map((n, i) => {
          const { mx, my } = srcCtrl[i];
          const dl = 7; const dg = 9;
          const off = -(t * 28 + i * 14) % (dl + dg);
          const isActive = hovered === n.label;
          const dots = [0, 0.5].map(ph => { const f = (t * 0.36 + i * 0.28 + ph) % 1; return { x: qBez(n.x, mx, CENTER_X, f), y: qBez(n.y, my, CENTER_Y, f), o: Math.sin(f * Math.PI) * 0.9 }; });
          return (
            <g key={`s${i}`}>
              <path d={`M${n.x} ${n.y} Q${mx} ${my} ${CENTER_X} ${CENTER_Y}`} stroke={n.arcColor} strokeWidth="4" fill="none" strokeOpacity={isActive ? 0.2 : 0.08} />
              <path d={`M${n.x} ${n.y} Q${mx} ${my} ${CENTER_X} ${CENTER_Y}`} stroke={n.arcColor} strokeWidth={isActive ? 2.4 : 1.4} fill="none" strokeDasharray={`${dl} ${dg}`} strokeDashoffset={off} style={{ opacity: isActive ? 1 : 0.6 + Math.sin(t * 0.7 + i) * 0.1 }} />
              {dots.map((d, di) => <circle key={di} cx={d.x} cy={d.y} r={2.5} fill={n.arcColor} style={{ opacity: d.o * (isActive ? 1 : 0.7) }} filter="url(#vGlowDot)" />)}
              {srcFlash[i] && (
                <g>
                  <rect x={mx - 44} y={my - 11} width="88" height="18" rx="9" fill="white" stroke={n.arcColor} strokeWidth="1.2" strokeOpacity="0.45" style={{ filter: "drop-shadow(0 2px 6px hsl(210 90% 50% / 0.12))" }} />
                  <text x={mx} y={my} textAnchor="middle" dominantBaseline="middle" fontSize="6.5" fontWeight="700" fill={n.arcColor} style={{ fontFamily: "Inter,sans-serif" }}>{n.insight}</text>
                </g>
              )}
            </g>
          );
        })}

        {/* Arc: center → French (right) */}
        {(() => {
          const dl = 9; const dg = 7; const off = -(t * 34) % (dl + dg);
          const dots = [0, 0.4, 0.75].map(ph => { const f = (t * 0.44 + ph) % 1; return { x: qBez(CENTER_X, outCtrlX, RIGHT_X, f), y: qBez(CENTER_Y, outCtrlY, RIGHT_Y, f), o: Math.sin(f * Math.PI) }; });
          return (
            <g>
              <path d={`M${CENTER_X} ${CENTER_Y} Q${outCtrlX} ${outCtrlY} ${RIGHT_X} ${RIGHT_Y}`} stroke="hsl(43,90%,44%)" strokeWidth="5" fill="none" strokeOpacity="0.12" />
              <path d={`M${CENTER_X} ${CENTER_Y} Q${outCtrlX} ${outCtrlY} ${RIGHT_X} ${RIGHT_Y}`} stroke="hsl(43,90%,44%)" strokeWidth="2.4" fill="none" strokeDasharray={`${dl} ${dg}`} strokeDashoffset={off} style={{ opacity: 0.8 + Math.sin(t * 1.1) * 0.1 }} />
              {dots.map((d, di) => <circle key={di} cx={d.x} cy={d.y} r={3} fill="hsl(43,90%,44%)" style={{ opacity: d.o * 0.9 }} filter="url(#vGlowDot)" />)}
            </g>
          );
        })()}

        {/* Source nodes — 3 circles on the LEFT */}
        {nodes.map((n, i) => {
          const isActive = hovered === n.label;
          const tipX = n.x - 80;
          const tipY = n.y;
          return (
            <g key={n.code} onMouseEnter={() => setHovered(n.label)} onMouseLeave={() => setHovered(null)} style={{ cursor: "pointer" }} filter="url(#vGlowNode)">
              <circle cx={n.x} cy={n.y} r={isActive ? 26 : 22} fill={n.arcColor} fillOpacity={isActive ? 0.2 : 0.1} stroke={n.arcColor} strokeWidth={isActive ? 2 : 0.8} strokeOpacity={0.4} />
              <circle cx={n.x} cy={n.y} r={NODE_R} fill={n.arcColor} stroke="white" strokeWidth="2" strokeOpacity="0.9" />
              <text x={n.x} y={n.y + 1} textAnchor="middle" dominantBaseline="middle" fontSize="11" fontWeight="900" fill="white" style={{ fontFamily: "Inter,sans-serif" }}>{n.code}</text>
              <text x={n.x} y={n.y + 32} textAnchor="middle" fontSize="9" fontWeight="600" fill="hsl(220,14%,35%)" style={{ fontFamily: "Inter,sans-serif" }}>{n.label}</text>
              {isActive && (
                <g>
                  <rect x={tipX} y={tipY - 14} width="70" height="28" rx="8" fill="white" stroke={n.arcColor} strokeWidth="1.2" strokeOpacity="0.4" style={{ filter: "drop-shadow(0 2px 8px hsl(210 90% 50% / 0.12))" }} />
                  <text x={tipX + 35} y={tipY} textAnchor="middle" dominantBaseline="middle" fontSize="7" fontWeight="600" fill={n.arcColor} style={{ fontFamily: "Inter,sans-serif" }}>{n.tooltip}</text>
                </g>
              )}
            </g>
          );
        })}

        {/* Center — MIXinGO */}
        <g filter="url(#vGlowCore)">
          <circle cx={CENTER_X} cy={CENTER_Y} r={58} fill="url(#vAura)" style={{ opacity: 0.4 + Math.sin(t * 0.5) * 0.08 }} />
          <circle cx={CENTER_X} cy={CENTER_Y} r={CORE_R + 8} fill="none" stroke="hsl(43,90%,44%)" strokeWidth="0.8" strokeOpacity={0.1 + Math.sin(t * 0.9) * 0.04} strokeDasharray="3 10" />
          <circle cx={CENTER_X} cy={CENTER_Y} r={CORE_R + 4} fill="none" stroke="hsl(210,90%,58%)" strokeWidth="1" strokeOpacity={0.15 + Math.sin(t * 1.8) * 0.08} />
          <circle cx={CENTER_X} cy={CENTER_Y} r={CORE_R} fill="white" stroke="hsl(210,90%,50%)" strokeWidth="2" style={{ filter: "drop-shadow(0 4px 14px hsl(210 90% 50% / 0.22))" }} />
          <text x={CENTER_X} y={CENTER_Y - 6} textAnchor="middle" dominantBaseline="middle" fontSize="9" fontWeight="900" fill="hsl(210,90%,44%)" style={{ fontFamily: "Sora,sans-serif", letterSpacing: "0.06em" }}>
            MIX<tspan fill="hsl(220,14%,55%)" fontWeight="500" fontSize="7.5">in</tspan>GO
          </text>
          <text x={CENTER_X} y={CENTER_Y + 8} textAnchor="middle" dominantBaseline="middle" fontSize="5.5" fontWeight="700" fill="hsl(43,80%,40%)" style={{ fontFamily: "Inter,sans-serif", letterSpacing: "0.1em" }}>AI ENGINE</text>
          <circle cx={CENTER_X + 21} cy={CENTER_Y + 8} r={2.2} fill="hsl(142,65%,48%)" style={{ opacity: 0.7 + Math.sin(t * 3) * 0.3 }} />
        </g>

        {/* French — RIGHT */}
        {(() => {
          const isActive = hovered === "French";
          return (
            <g onMouseEnter={() => setHovered("French")} onMouseLeave={() => setHovered(null)} style={{ cursor: "pointer" }} filter="url(#vGlowNode)">
              <circle cx={RIGHT_X} cy={RIGHT_Y} r={isActive ? 36 : 30} fill={TARGET.color} fillOpacity={isActive ? 0.15 : 0.08} stroke={TARGET.color} strokeWidth={isActive ? 2 : 1.2} strokeOpacity={0.35} />
              <circle cx={RIGHT_X} cy={RIGHT_Y} r={24} fill="hsl(43,90%,44%)" stroke="white" strokeWidth="2.5" strokeOpacity="0.9" style={{ filter: "drop-shadow(0 4px 14px hsl(43 90% 44% / 0.28))" }} />
              <text x={RIGHT_X} y={RIGHT_Y + 1} textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="900" fill="white" style={{ fontFamily: "Inter,sans-serif" }}>FR</text>
              <text x={RIGHT_X} y={RIGHT_Y + 36} textAnchor="middle" fontSize="9" fontWeight="600" fill="hsl(220,14%,35%)" style={{ fontFamily: "Inter,sans-serif" }}>French</text>
              <rect x={RIGHT_X - 28} y={RIGHT_Y + 42} width="56" height="12" rx="6" fill="hsl(43,90%,44%)" fillOpacity="0.14" stroke="hsl(43,90%,44%)" strokeWidth="1" strokeOpacity="0.45" />
              <text x={RIGHT_X} y={RIGHT_Y + 50} textAnchor="middle" dominantBaseline="middle" fontSize="6.5" fontWeight="800" fill="hsl(38,80%,35%)" style={{ fontFamily: "Sora,sans-serif", letterSpacing: "0.05em" }}>+32%</text>
              {isActive && (
                <g>
                  <rect x={RIGHT_X - 70} y={RIGHT_Y - 48} width="140" height="26" rx="8" fill="white" stroke={TARGET.color} strokeWidth="1.2" strokeOpacity="0.35" style={{ filter: "drop-shadow(0 4px 10px hsl(43 90% 44% / 0.22))" }} />
                  <text x={RIGHT_X} y={RIGHT_Y - 35} textAnchor="middle" dominantBaseline="middle" fontSize="7" fontWeight="600" fill="hsl(38,80%,35%)" style={{ fontFamily: "Inter,sans-serif" }}>Target: +32% faster</text>
                </g>
              )}
            </g>
          );
        })()}
      </svg>
    </div>
  );
}

// ─── Landing ──────────────────────────────────────────────────────────────────

export default function Landing() {
  const navigate = useNavigate();
  const { demoMode } = useDemo();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">

        {/* ── HERO ── spacious, demo-forward */}
        <section className="relative overflow-hidden">
          {/* Subtle ambient blobs */}
          <div className="absolute top-0 right-0 w-[560px] h-[560px] rounded-full pointer-events-none" style={{ background: "hsl(43 90% 54% / 0.08)", transform: "translate(25%,-35%)", filter: "blur(90px)" }} />
          <div className="absolute bottom-0 left-0 w-[460px] h-[460px] rounded-full pointer-events-none" style={{ background: "hsl(210 90% 50% / 0.07)", transform: "translate(-25%,30%)", filter: "blur(90px)" }} />

          <div className="relative container mx-auto px-6 pt-24 pb-32 max-w-7xl">
            <div className="grid lg:grid-cols-[1fr_1.1fr] gap-20 items-center">

              {/* Copy — stripped back, breathing room */}
              <div className="animate-fade-in">
                <p className="text-sm font-semibold tracking-widest uppercase mb-6" style={{ color: "hsl(210 90% 50%)" }}>
                  Your languages are an asset
                </p>

                <h1 className="text-5xl md:text-6xl font-bold leading-[1.05] text-foreground tracking-tight">
                  Learn faster<br />
                  <span style={{ color: "hsl(210 90% 50%)" }}>because</span> of<br />
                  who you are.
                </h1>

                <p className="mt-8 text-lg leading-relaxed max-w-md" style={{ color: "hsl(220 14% 48%)" }}>
                  Mixingo maps your existing languages to your new one — and accelerates learning by up to 32%.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => navigate("/onboarding")}
                    className="group inline-flex items-center gap-2.5 rounded-2xl px-8 py-4 text-base font-bold text-white transition-all hover:opacity-90 hover:shadow-lg active:scale-[0.98]"
                    style={{ background: "hsl(210 90% 50%)", boxShadow: "0 6px 20px hsl(210 90% 50% / 0.28)" }}
                  >
                    Start Your Journey
                    <ArrowRight size={17} strokeWidth={2.5} className="transition-transform group-hover:translate-x-1" />
                  </button>
                  <button
                    onClick={() => navigate("/onboarding")}
                    className="inline-flex items-center gap-2.5 rounded-2xl px-7 py-4 text-base font-semibold transition-all hover:shadow-sm"
                    style={{ background: "white", border: "1.5px solid hsl(210 30% 88%)", color: "hsl(220 14% 30%)" }}
                  >
                    <Play size={14} fill="currentColor" strokeWidth={0} />
                    See How It Works
                  </button>
                </div>

                <p className="mt-6 text-xs" style={{ color: "hsl(220 14% 62%)" }}>
                  Free to try · No credit card · Works with 12+ languages
                </p>
              </div>

              {/* Demo card — the HERO */}
              <div className="animate-slide-up" style={{ animationDelay: "0.12s" }}>
                <div className="relative rounded-3xl p-8 overflow-hidden"
                  style={{ background: "white", border: "1.5px solid hsl(210 30% 88%)", boxShadow: "0 24px 64px hsl(210 60% 20% / 0.09), 0 4px 20px hsl(210 60% 20% / 0.05)" }}>
                  {/* Top accent — solid blue */}
                  <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl" style={{ background: "hsl(210 90% 50%)" }} />

                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-xl flex items-center justify-center" style={{ background: "hsl(210 90% 50% / 0.1)", border: "1.5px solid hsl(210 90% 50% / 0.2)" }}>
                        <Cpu size={15} strokeWidth={2} style={{ color: "hsl(210 90% 44%)" }} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{demoMode ? "Live Match Preview" : "AI Match Engine"}</p>
                        <p className="text-xs" style={{ color: "hsl(220 14% 55%)" }}>{demoMode ? "Cantonese · Mandarin · English → French" : "Analyzing connections…"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-full px-3 py-1" style={{ background: "hsl(142 65% 45% / 0.1)", border: "1.5px solid hsl(142 65% 45% / 0.25)" }}>
                      <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: "hsl(142 65% 45%)" }} />
                      <span className="text-xs font-bold" style={{ color: "hsl(142 55% 33%)" }}>LIVE</span>
                    </div>
                  </div>

                  <LanguageMergeVisual />

                  {/* Stat row */}
                  <div className="mt-6 grid grid-cols-3 gap-3">
                    {[
                      { Icon: Link2,  label: "Connections", value: "3 Active",  color: "hsl(210 90% 50%)" },
                      { Icon: Zap,    label: "Acceleration", value: "+32%",      color: "hsl(43 90% 44%)"  },
                      { Icon: Target, label: "Match Score",  value: "94%",       color: "hsl(142 65% 44%)" },
                    ].map(s => (
                      <div key={s.label} className="rounded-2xl p-3 text-center" style={{ background: "hsl(210 30% 97%)", border: "1.5px solid hsl(210 30% 91%)" }}>
                        <div className="flex justify-center mb-1"><s.Icon size={14} strokeWidth={2} style={{ color: s.color }} /></div>
                        <div className="text-xs font-bold text-foreground">{s.value}</div>
                        <div className="text-xs" style={{ color: "hsl(220 14% 55%)" }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── OUR STORY ── brief, human, breathing room */}
        <section style={{ background: "hsl(210 30% 97%)", borderTop: "1.5px solid hsl(210 30% 91%)", borderBottom: "1.5px solid hsl(210 30% 91%)" }}>
          <div className="container mx-auto px-6 py-24 max-w-3xl text-center">
            <p className="text-sm font-semibold tracking-widest uppercase mb-6" style={{ color: "hsl(43 90% 44%)" }}>Our Story</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
              Languages are closer than you think.<br />The apps just don't connect them.
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: "hsl(220 14% 48%)" }}>
              Coming from a multilingual background, with friends from all over the globe, languages have always been part of my life. I’m motivated by the communication and cultural depth they open up. Knowing around seven languages and constantly learning more, I’ve realized that languages are inherently close to each other in surprising ways — and the skills you already have actively help you learn new ones.
            </p>
            <p className="mt-5 text-lg leading-relaxed" style={{ color: "hsl(220 14% 48%)" }}>
              To support my learning, I turned to tutors who speak similar languages to mine, so I could connect multiple languages with my target. But as a student working at the same time, tutors demand time I simply don’t have. Current online tools don’t support multiple language knowledge bases or make connections between them. That’s where Mixingo comes in.
            </p>
          </div>
        </section>

        {/* ── THREE PROOF POINTS — show, don't explain ── */}
        <section className="container mx-auto px-6 py-28 max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">

            {/* Point 1 — Language map visual */}
            <div className="rounded-3xl p-8 text-center" style={{ background: "white", border: "1.5px solid hsl(210 30% 90%)" }}>
              {/* Mini visual: language tags connecting */}
              <div className="flex items-center justify-center gap-2 mb-8">
                {["粵", "中", "EN"].map((c, i) => (
                  <div key={c} className="flex items-center gap-2">
                    <span className="h-12 w-12 rounded-2xl flex items-center justify-center text-base font-black text-white" style={{ background: i === 2 ? "hsl(192 80% 42%)" : "hsl(210 90% 50%)" }}>{c}</span>
                    {i < 2 && <span style={{ color: "hsl(210 90% 70%)", fontSize: 10, fontWeight: 700 }}>+</span>}
                  </div>
                ))}
                <ArrowRight size={14} style={{ color: "hsl(220 14% 60%)" }} />
                <span className="h-12 w-12 rounded-2xl flex items-center justify-center text-base font-black text-white" style={{ background: "hsl(43 90% 44%)" }}>FR</span>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Your languages do the work</h3>
              <p className="text-sm leading-relaxed" style={{ color: "hsl(220 14% 52%)" }}>English cognates (~45%), Cantonese nasal 人 → French vowels, Mandarin pattern recognition — we map what transfers so you never start from zero.</p>
            </div>

            {/* Point 2 — Progress bar visual */}
            <div className="rounded-3xl p-8" style={{ background: "white", border: "1.5px solid hsl(43 90% 44% / 0.3)", boxShadow: "0 6px 28px hsl(43 90% 44% / 0.08)" }}>
              <div className="mb-8 space-y-3">
                {[
                  { label: "Vocabulary", pct: 78, color: "hsl(210 90% 50%)" },
                  { label: "Grammar",    pct: 62, color: "hsl(43 90% 44%)"  },
                  { label: "Phonology",  pct: 84, color: "hsl(142 65% 44%)" },
                ].map(b => (
                  <div key={b.label}>
                    <div className="flex justify-between text-xs font-semibold mb-1.5" style={{ color: "hsl(220 14% 40%)" }}>
                      <span>{b.label}</span><span style={{ color: b.color }}>{b.pct}%</span>
                    </div>
                    <div className="h-2 rounded-full" style={{ background: "hsl(210 30% 93%)" }}>
                      <div className="h-full rounded-full" style={{ width: `${b.pct}%`, background: b.color }} />
                    </div>
                  </div>
                ))}
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Real-time acceleration map</h3>
              <p className="text-sm leading-relaxed" style={{ color: "hsl(220 14% 52%)" }}>See exactly where you're ahead — and go there first.</p>
            </div>

            {/* Point 3 — vs comparison */}
            <div className="rounded-3xl p-8" style={{ background: "white", border: "1.5px solid hsl(210 30% 90%)" }}>
              <div className="mb-8 space-y-2">
                {[
                  { text: "Treats you as a complete beginner", bad: true },
                  { text: "Ignores your existing languages", bad: true },
                  { text: "Learns from your language profile", bad: false },
                  { text: "Skips what you already know", bad: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium"
                    style={{ background: item.bad ? "hsl(0 70% 60% / 0.06)" : "hsl(142 65% 45% / 0.08)", color: item.bad ? "hsl(220 14% 50%)" : "hsl(220 14% 25%)" }}>
                    <div className="h-5 w-5 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: item.bad ? "hsl(0 70% 60% / 0.15)" : "hsl(142 65% 45% / 0.15)" }}>
                      {item.bad
                        ? <span style={{ color: "hsl(0 65% 55%)", fontSize: 10, fontWeight: 900, lineHeight: 1 }}>✕</span>
                        : <span style={{ color: "hsl(142 55% 38%)", fontSize: 10, fontWeight: 900, lineHeight: 1 }}>✓</span>
                      }
                    </div>
                    {item.text}
                  </div>
                ))}
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Built differently</h3>
              <p className="text-sm leading-relaxed" style={{ color: "hsl(220 14% 52%)" }}>Not another generic app — a personalised engine.</p>
            </div>

          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ background: "hsl(210 30% 97%)", borderTop: "1.5px solid hsl(210 30% 91%)" }}>
          <div className="container mx-auto px-6 py-28 max-w-2xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-5 leading-tight">
              Ready to use your<br />
              <span style={{ color: "hsl(210 90% 50%)" }}>languages as a superpower?</span>
            </h2>
            <p className="text-lg mb-10" style={{ color: "hsl(220 14% 50%)" }}>
              It takes 2 minutes to build your personalised acceleration plan.
            </p>
            <button
              onClick={() => navigate("/onboarding")}
              className="inline-flex items-center gap-2.5 rounded-2xl px-10 py-4 text-base font-bold text-white transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.99]"
              style={{ background: "hsl(210 90% 50%)", boxShadow: "0 6px 24px hsl(210 90% 50% / 0.28)" }}
            >
              Start for Free
              <ArrowRight size={17} strokeWidth={2.5} />
            </button>
            <p className="mt-5 text-xs" style={{ color: "hsl(220 14% 62%)" }}>Free · No card · 12+ languages</p>
          </div>
        </section>

      </main>
    </div>
  );
}
