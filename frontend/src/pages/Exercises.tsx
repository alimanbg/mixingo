import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useDemo } from "@/context/DemoContext";
import {
  Tag,
  BookOpen,
  Music,
  Volume2,
  Lightbulb,
  Rocket,
  Check,
  Loader2,
} from "lucide-react";
import { generateExercises } from "@/api";

// --- types ------------------------------------------------
interface ApiQuestion {
  question: string;
  options: string[];
  correct_answer: string;
  feedback?: string;
}

interface Exercise {
  id: number;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  category: string;
  categoryStyle: string;
  description: string;
  question: string;
  options: string[];
  correctIndex: number;
  hint: string;
  hintLang: string;
  aiMessage: string;
  audio?: boolean;
}

// static fallback outside component so reference stays stable
const staticFallback: Exercise[] = [
  {
    id: 1,
    Icon: Tag,
    title: "Gender Practice",
    category: "Growth Opportunity",
    categoryStyle: "bg-heat-red/10 text-heat-red border-heat-red/20",
    description: "Choose the correct article for the French noun.",
    question: "__ maison",
    options: ["le", "la"],
    correctIndex: 1,
    hint: "In French, most nouns ending in -aison are feminine. Maison (house) follows this pattern — build this as a new mental habit.",
    hintLang: "For Cantonese & Mandarin speakers",
    aiMessage: "AI optimizing difficulty…",
  },
  {
    id: 2,
    Icon: BookOpen,
    title: "Vocabulary Overlap",
    category: "Strong Foundation",
    categoryStyle: "bg-heat-green/10 text-heat-green border-heat-green/20",
    description: "Match the English word to its French equivalent.",
    question: "important →",
    options: ["important", "cheval", "maison"],
    correctIndex: 0,
    hint: "Many English -ant words are identical in French. Your English vocabulary gives you a direct head start — this is your built-in advantage.",
    hintLang: "English transfer advantage",
    aiMessage: "Reinforcing vocabulary connections…",
  },
  {
    id: 3,
    Icon: Music,
    title: "Pronunciation Awareness",
    category: "Growth Opportunity",
    categoryStyle: "bg-heat-red/10 text-heat-red border-heat-red/20",
    description: "How is the 'on' pronounced in the French word bon?",
    question: "\"bon\" — what does 'on' sound like?",
    options: [
      "like 'own'",
      "nasal sound (no English equivalent)",
      "like 'on' in English",
      "silent",
    ],
    correctIndex: 1,
    hint: "French nasal vowels don't exist in Cantonese or English. Air exits through both mouth and nose simultaneously — a new sound to build.",
    hintLang: "New sounds for multilingual speakers",
    audio: true,
    aiMessage: "Optimizing pronunciation focus…",
  },
];

const ICONS = [Tag, BookOpen, Music, Lightbulb, Rocket];
const getIconForIndex = (i: number) => ICONS[i % ICONS.length];

// Helper to map API question format to the UI format
const mapApiQuestion = (
  q: ApiQuestion,
  index: number,
  severity?: number
): Exercise => {
  const isGrowth = severity === 2;
  const isStrong = severity === 0;
  const category = isStrong
    ? "Strong Foundation"
    : isGrowth
      ? "Growth Opportunity"
      : "Refinement Zone";
  const categoryStyle = isStrong
    ? "bg-heat-green/10 text-heat-green border-heat-green/20"
    : isGrowth
      ? "bg-heat-red/10 text-heat-red border-heat-red/20"
      : "bg-heat-yellow/10 text-heat-yellow border-heat-yellow/20";
  return {
    id: index + 1,
    Icon: getIconForIndex(index),
    title: `Exercise ${index + 1}`,
    category,
    categoryStyle,
    description: q.question,
    question: q.question,
    options: q.options || [],
    correctIndex: q.options?.indexOf(q.correct_answer) ?? 0,
    hint: q.feedback || "Good thinking!",
    hintLang: "AI-generated hint",
    aiMessage: "AI optimizing difficulty…",
  };
};

export default function Exercises() {
  const navigate = useNavigate();
  const location = useLocation();
  const { demoMode } = useDemo();

  // Get moduleId and userId from navigation state (passed from results page)
  const state = location.state as { moduleId?: string; userId?: string } | null;
  const moduleId = state?.moduleId || "M03_Pronunciation"; // fallback
  const userId = state?.userId;

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for interactions
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [playingAudio, setPlayingAudio] = useState<number | null>(null);
  const [accelerationScore, setAccelerationScore] = useState(62);
  const [aiMessage, setAiMessage] = useState<number | null>(null);

  // Fetch exercises when component mounts
  useEffect(() => {
    const fetchExercises = async () => {
      if (demoMode) {
        setExercises(staticFallback);
        setLoading(false);
        return;
      }

      try {
        const data = await generateExercises(
          moduleId,
          userId || undefined
        ) as {
          module_id?: string;
          micro_explanation?: string;
          questions?: ApiQuestion[];
        };
        if (data?.questions && Array.isArray(data.questions)) {
          const mapped = data.questions.map((q, i) =>
            mapApiQuestion(q, i)
          );
          setExercises(mapped);
        } else {
          setExercises(staticFallback);
        }
        setError(null);
      } catch {
        setError("Could not load exercises. Showing sample instead.");
        setExercises(staticFallback);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [moduleId, userId, demoMode]);

  // Handlers (unchanged)
  const handleSelect = (exId: number, optIdx: number) => {
    if (revealed[exId]) return;
    setSelected((prev) => ({ ...prev, [exId]: optIdx }));
  };

  const handleCheck = (ex: Exercise) => {
    if (selected[ex.id] === undefined) return;
    setRevealed((prev) => ({ ...prev, [ex.id]: true }));
    setAiMessage(ex.id);
    setAccelerationScore((prev) => Math.min(prev + 7, 98));
    setTimeout(() => setAiMessage(null), 2500);
  };

  const handleAudio = (id: number) => {
    setPlayingAudio(id);
    setTimeout(() => setPlayingAudio(null), 1800);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-fade-in px-6">
          <Loader2
            size={40}
            className="animate-spin mx-auto mb-4 text-primary"
          />
          <h2 className="text-2xl font-bold text-foreground">
            Generating your personalized exercises...
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            AI tailoring questions to your learning profile
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <div className="container mx-auto px-6 py-12 max-w-3xl animate-fade-in">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/8 border border-primary/20 px-4 py-1.5 text-sm font-semibold text-primary mb-5">
              Adaptive Exercise Engine
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground leading-tight">
              Exercises Designed{" "}
              <span className="text-gradient">For Your Brain</span>
            </h1>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              Focused on what accelerates your progress.
            </p>
            {demoMode && (
              <span className="inline-block mt-3 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                Demo Mode Active — Showing Sample Insights
              </span>
            )}
            {error && (
              <div className="mt-4 text-sm text-heat-red bg-heat-red/10 border border-heat-red/20 rounded-xl p-3">
                {error}
              </div>
            )}
          </div>

          {/* Acceleration Score Bar */}
          <div className="glass-card p-6 mb-8">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-sm font-bold text-foreground">
                Acceleration Score Increasing
              </span>
              <span className="text-sm font-bold text-gradient">
                {accelerationScore}%
              </span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-border overflow-hidden">
              <div
                className="h-full gradient-bg rounded-full transition-all duration-700"
                style={{ width: `${accelerationScore}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              AI adapts silently based on your responses.
            </p>
          </div>

          <div className="space-y-6">
            {exercises.map((ex, idx) => {
              const isRevealed = revealed[ex.id];
              const selectedIdx = selected[ex.id];
              const isCorrect = selectedIdx === ex.correctIndex;

              return (
                <div
                  key={ex.id}
                  className="glass-card p-7 animate-slide-up"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="flex items-center gap-3">
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 flex-shrink-0">
                        <ex.Icon
                          size={18}
                          strokeWidth={1.75}
                          className="text-primary"
                        />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-foreground">
                          {ex.title}
                        </h3>
                        <span
                          className={`inline-block mt-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${ex.categoryStyle}`}
                        >
                          {ex.category}
                        </span>
                      </div>
                    </div>
                    {ex.audio && (
                      <button
                        onClick={() => handleAudio(ex.id)}
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all ${
                          playingAudio === ex.id
                            ? "gradient-bg text-white shadow-indigo-custom animate-pulse"
                            : "bg-secondary text-foreground hover:gradient-bg-soft hover:text-primary"
                        }`}
                        title="Play pronunciation"
                      >
                        {playingAudio === ex.id ? (
                          <Volume2 size={16} strokeWidth={2} />
                        ) : (
                          <Music size={16} strokeWidth={2} />
                        )}
                      </button>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    {ex.description}
                  </p>

                  {/* Question block */}
                  <div className="mb-5 rounded-xl bg-muted/50 border border-border px-5 py-3.5">
                    <p className="font-bold text-foreground text-base">
                      {ex.question}
                    </p>
                  </div>

                  {/* Options */}
                  <div className="space-y-2.5 mb-5">
                    {ex.options.map((opt: string, oi: number) => {
                      const isSelected = selectedIdx === oi;
                      const showCorrect = isRevealed && oi === ex.correctIndex;
                      const showWrong =
                        isRevealed &&
                        isSelected &&
                        !isCorrect &&
                        oi !== ex.correctIndex;

                      return (
                        <button
                          key={oi}
                          onClick={() => handleSelect(ex.id, oi)}
                          disabled={isRevealed}
                          className={`w-full text-left rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-200 ${
                            showCorrect
                              ? "border-heat-green/50 bg-heat-green/10 text-heat-green font-bold"
                              : showWrong
                                ? "border-heat-red/20 bg-muted/30 text-muted-foreground opacity-50"
                                : isSelected && !isRevealed
                                  ? "border-primary/40 gradient-bg-soft text-primary font-bold"
                                  : isRevealed
                                    ? "border-border bg-muted/20 text-muted-foreground cursor-default opacity-40"
                                    : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-primary/4 cursor-pointer"
                          }`}
                        >
                          <span className="font-mono font-bold mr-2 text-muted-foreground text-xs">
                            {String.fromCharCode(65 + oi)}.
                          </span>
                          {opt}
                          {showCorrect && (
                            <Check
                              size={13}
                              strokeWidth={3}
                              className="ml-2 inline text-heat-green"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Check button */}
                  {!isRevealed && (
                    <button
                      onClick={() => handleCheck(ex)}
                      disabled={selectedIdx === undefined}
                      className="mb-4 rounded-xl border border-primary/30 bg-primary/6 px-5 py-2.5 text-sm font-bold text-primary hover:bg-primary/12 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Check Answer →
                    </button>
                  )}

                  {/* AI message */}
                  {aiMessage === ex.id && (
                    <div className="mb-4 flex items-center gap-2.5 text-xs font-semibold text-primary animate-fade-in gradient-bg-soft border border-primary/20 rounded-xl px-4 py-2.5">
                      <div className="flex gap-0.5">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce"
                            style={{ animationDelay: `${i * 0.1}s` }}
                          />
                        ))}
                      </div>
                      {ex.aiMessage}
                    </div>
                  )}

                  {/* Hint */}
                  {isRevealed && (
                    <div className="rounded-xl gradient-bg-soft border border-primary/15 px-5 py-4 animate-fade-in">
                      <p className="text-xs font-bold text-primary mb-1.5">
                        {ex.hintLang}
                      </p>
                      <p className="text-sm text-foreground leading-relaxed">
                        {ex.hint}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Completion */}
          {Object.keys(revealed).length === exercises.length &&
            exercises.length > 0 && (
              <div className="mt-8 glass-card p-10 text-center border-2 border-primary/20 animate-slide-up">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 mb-4">
                  <Rocket
                    size={28}
                    strokeWidth={1.75}
                    className="text-primary"
                  />
                </div>
                <h3 className="font-display font-bold text-foreground text-xl mb-2">
                  Session Complete!
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  Mixingo is optimizing your next session. Your acceleration
                  plan is being updated.
                </p>
                <div className="mt-5 font-display text-3xl font-extrabold text-gradient">
                  {accelerationScore}% Acceleration
                </div>
              </div>
            )}
        </div>
      </main>
    </div>
  );
}
