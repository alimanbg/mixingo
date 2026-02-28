import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useDemo } from "@/context/DemoContext";
import { ArrowRight, Globe, Target, Briefcase, BookOpen, Check } from "lucide-react";

const LANGUAGES = [
  "Cantonese", "Mandarin", "English", "Spanish", "French", "Japanese",
  "Korean", "Arabic", "Hindi", "Portuguese", "German", "Italian",
];

const LEVELS = ["Native", "Fluent", "Advanced", "Intermediate", "Basic"];

const LEVEL_STYLE: Record<string, { bg: string; text: string; border: string }> = {
  Native:       { bg: "hsl(142 65% 45% / 0.12)", text: "hsl(142 55% 33%)", border: "hsl(142 65% 45% / 0.3)" },
  Fluent:       { bg: "hsl(210 90% 50% / 0.1)",  text: "hsl(210 90% 40%)", border: "hsl(210 90% 50% / 0.25)" },
  Advanced:     { bg: "hsl(192 80% 42% / 0.1)",  text: "hsl(192 80% 36%)", border: "hsl(192 80% 42% / 0.25)" },
  Intermediate: { bg: "hsl(43 90% 44% / 0.1)",   text: "hsl(38 80% 35%)",  border: "hsl(43 90% 44% / 0.28)" },
  Basic:        { bg: "hsl(220 14% 94%)",         text: "hsl(220 14% 50%)", border: "hsl(220 14% 85%)" },
};

const TARGET_LANGUAGES = ["French", "Spanish", "German", "Japanese", "Korean", "Italian", "Portuguese"];

const GOALS = [
  { label: "Speak confidently", Icon: Globe },
  { label: "Travel conversations", Icon: Target },
  { label: "Professional use", Icon: Briefcase },
  { label: "Exam preparation", Icon: BookOpen },
];

const DEMO_LANGS = [
  { lang: "Cantonese", level: "Native" },
  { lang: "Mandarin",  level: "Advanced" },
  { lang: "English",   level: "Fluent" },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { demoMode } = useDemo();

  const [known, setKnown]         = useState<{ lang: string; level: string }[]>(demoMode ? DEMO_LANGS : []);
  const [target, setTarget]       = useState(demoMode ? "French" : "");
  const [goal, setGoal]           = useState(demoMode ? "Speak confidently" : "");
  const [loading, setLoading]     = useState(false);
  const [editingLevel, setEditingLevel] = useState<string | null>(null);

  const toggleLang = (lang: string) => {
    setEditingLevel(null);
    setKnown(prev => {
      if (prev.find(l => l.lang === lang)) return prev.filter(l => l.lang !== lang);
      return [...prev, { lang, level: "Fluent" }];
    });
  };

  const setLevel = (lang: string, level: string) => {
    setKnown(prev => prev.map(l => l.lang === lang ? { ...l, level } : l));
    setEditingLevel(null);
  };

  const handleStart = () => {
    setLoading(true);
    setTimeout(() => navigate("/warmup"), 1800);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-fade-in px-6">
          <div className="h-16 w-16 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{ background: "hsl(210 90% 50% / 0.1)", border: "2px solid hsl(210 90% 50% / 0.2)" }}>
            <Globe size={28} strokeWidth={1.75} style={{ color: "hsl(210 90% 44%)" }} />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Analysing your language profile…</h2>
          <p className="mt-3 text-base" style={{ color: "hsl(220 14% 52%)" }}>Mapping your built-in strengths.</p>
          <div className="mt-8 flex justify-center gap-2">
            {[0,1,2,3].map(i => (
              <div key={i} className="h-2 w-2 rounded-full animate-bounce" style={{ background: "hsl(210 90% 50%)", animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const canStart = known.length > 0 && !!target && !!goal;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <div className="container mx-auto px-6 py-16 max-w-xl animate-fade-in" onClick={() => setEditingLevel(null)}>

          {/* Header */}
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: "hsl(210 90% 50%)" }}>
              Step 1 of 3
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
              Tell us who you are.
            </h1>
            <p className="mt-3 text-base" style={{ color: "hsl(220 14% 50%)" }}>
              3 quick picks — and we'll build your personal learning plan.
            </p>
          </div>

          {/* ── Section 1: Languages ── */}
          <div className="mb-4 rounded-3xl p-7" style={{ background: "white", border: "1.5px solid hsl(210 30% 88%)", boxShadow: "0 4px 20px hsl(210 60% 20% / 0.05)" }}>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="h-7 w-7 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: "hsl(210 90% 50%)" }}>1</div>
              <p className="font-bold text-foreground">Which languages do you speak?</p>
            </div>

            <div className="flex flex-wrap gap-2" onClick={e => e.stopPropagation()}>
              {LANGUAGES.map(lang => {
                const entry = known.find(l => l.lang === lang);
                const isSelected = !!entry;
                const ls = entry ? LEVEL_STYLE[entry.level] : null;
                return (
                  <div key={lang} className="relative">
                    {isSelected ? (
                      <div className="flex items-stretch rounded-xl overflow-hidden" style={{ border: `1.5px solid ${ls!.border}` }}>
                        <button onClick={() => toggleLang(lang)}
                          className="px-3.5 py-2 text-sm font-bold text-white"
                          style={{ background: "hsl(210 90% 50%)" }}>
                          {lang}
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); setEditingLevel(editingLevel === lang ? null : lang); }}
                          className="px-2.5 py-2 text-xs font-bold border-l"
                          style={{ background: ls!.bg, color: ls!.text, borderColor: ls!.border }}>
                          {entry!.level} ▾
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => toggleLang(lang)}
                        className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                        style={{ background: "hsl(210 30% 96%)", color: "hsl(220 14% 35%)", border: "1.5px solid hsl(210 30% 89%)" }}>
                        {lang}
                      </button>
                    )}

                    {editingLevel === lang && (
                      <div className="absolute top-full mt-1.5 left-0 z-30 rounded-2xl p-2 min-w-[145px]" style={{ background: "white", border: "1.5px solid hsl(210 30% 88%)", boxShadow: "0 8px 28px hsl(210 60% 20% / 0.12)" }} onClick={e => e.stopPropagation()}>
                        {LEVELS.map(lvl => {
                          const ls2 = LEVEL_STYLE[lvl];
                          return (
                            <button key={lvl} onClick={() => setLevel(lang, lvl)}
                              className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                              style={ entry?.level === lvl
                                ? { background: ls2.bg, color: ls2.text, border: `1px solid ${ls2.border}` }
                                : { color: "hsl(220 14% 40%)" }
                              }>
                              {lvl}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {known.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2 pt-4" style={{ borderTop: "1.5px solid hsl(210 30% 93%)" }}>
                {known.map(l => {
                  const ls = LEVEL_STYLE[l.level];
                  return (
                    <span key={l.lang} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                      style={{ background: ls.bg, color: ls.text, border: `1.5px solid ${ls.border}` }}>
                      <Check size={9} strokeWidth={3} />
                      {l.lang} · {l.level}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Section 2: Target ── */}
          <div className="mb-4 rounded-3xl p-7" style={{ background: "white", border: "1.5px solid hsl(210 30% 88%)", boxShadow: "0 4px 20px hsl(210 60% 20% / 0.05)" }}>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="h-7 w-7 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: "hsl(43 90% 44%)" }}>2</div>
              <p className="font-bold text-foreground">Which language do you want to learn?</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TARGET_LANGUAGES.map(l => {
                const sel = target === l;
                return (
                  <button key={l} onClick={() => setTarget(l)}
                    className="rounded-2xl px-3 py-3 text-sm font-semibold text-center transition-all"
                    style={sel
                      ? { background: "hsl(43 90% 44%)", color: "white", border: "1.5px solid transparent", boxShadow: "0 4px 14px hsl(43 90% 44% / 0.3)" }
                      : { background: "hsl(210 30% 96%)", color: "hsl(220 14% 35%)", border: "1.5px solid hsl(210 30% 89%)" }
                    }>
                    {l}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Section 3: Goal ── */}
          <div className="mb-8 rounded-3xl p-7" style={{ background: "white", border: "1.5px solid hsl(210 30% 88%)", boxShadow: "0 4px 20px hsl(210 60% 20% / 0.05)" }}>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="h-7 w-7 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: "hsl(142 65% 44%)" }}>3</div>
              <p className="font-bold text-foreground">What's your main goal?</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {GOALS.map(g => {
                const sel = goal === g.label;
                return (
                  <button key={g.label} onClick={() => setGoal(g.label)}
                    className="rounded-2xl px-4 py-4 text-sm font-semibold text-left transition-all flex items-center gap-3"
                    style={sel
                      ? { background: "hsl(210 90% 50%)", color: "white", border: "1.5px solid transparent", boxShadow: "0 4px 14px hsl(210 90% 50% / 0.25)" }
                      : { background: "hsl(210 30% 96%)", color: "hsl(220 14% 35%)", border: "1.5px solid hsl(210 30% 89%)" }
                    }>
                    <g.Icon size={16} strokeWidth={2} style={{ flexShrink: 0, opacity: 0.8 }} />
                    {g.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleStart}
            disabled={!canStart}
            className="w-full rounded-2xl px-6 py-4 text-base font-bold text-white transition-all hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-35 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2.5"
            style={{ background: "hsl(210 90% 50%)", boxShadow: canStart ? "0 6px 20px hsl(210 90% 50% / 0.28)" : "none" }}
          >
            Start Smart Warm-Up
            <ArrowRight size={17} strokeWidth={2.5} />
          </button>

          <p className="mt-4 text-center text-sm" style={{ color: "hsl(220 14% 58%)" }}>
            Mixingo adapts as you answer — no two plans are the same.
          </p>

          {demoMode && (
            <p className="mt-2 text-center text-xs" style={{ color: "hsl(220 14% 65%)" }}>
              Demo mode active — sample profile loaded
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
