import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useDemo } from "@/context/DemoContext";
import { ArrowRight, Zap, Check, Brain } from "lucide-react";
import { submitWarmup } from "@/api";

const QUESTIONS = [
  {
    id: 1,
    tag: "Vocabulary",
    tagColor: "hsl(210 90% 50%)",
    tagBg: "hsl(210 90% 50% / 0.1)",
    question: "Which French word feels most familiar?",
    insight: "Analysing vocabulary connections…",
    options: [
      { id: "a", text: "important", correct: true },
      { id: "b", text: "toujours" },
      { id: "c", text: "cheval" },
      { id: "d", text: "fenêtre" },
    ],
  },
  {
    id: 2,
    tag: "Grammar",
    tagColor: "hsl(43 90% 40%)",
    tagBg: "hsl(43 90% 44% / 0.1)",
    question: "Nouns in French have gender. Which sounds right?",
    insight: "Mapping grammar patterns…",
    options: [
      { id: "a", text: "la table", correct: true },
      { id: "b", text: "le table" },
      { id: "c", text: "la maison", correct: true },
      { id: "d", text: "le maison" },
    ],
  },
  {
    id: 3,
    tag: "Meaning",
    tagColor: "hsl(142 65% 38%)",
    tagBg: "hsl(142 65% 45% / 0.1)",
    question: '"I\'m looking for a hotel." Which French sentence matches?',
    insight: "Detecting transfer patterns…",
    options: [
      { id: "a", text: "Je cherche un hôtel", correct: true },
      { id: "b", text: "Je mange un hôtel" },
      { id: "c", text: "Je suis un hôtel" },
      { id: "d", text: "Je parle hôtel" },
    ],
  },
];

// Helper to map Lovable tags to backend categories
const tagToCategory = (tag: string): string => {
  switch (tag) {
    case "Vocabulary":
      return "vocabulary";
    case "Grammar":
      return "grammar";
    case "Meaning":
      return "pragmatics"; // or "vocabulary" – adjust if needed
    default:
      return "vocabulary";
  }
};

export default function Warmup() {
  const navigate = useNavigate();
  const { demoMode } = useDemo();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [analyzing, setAnalyzing] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnswer = (qId: number, optId: string) => {
    if (answers[qId]) return;
    setAnswers((prev) => ({ ...prev, [qId]: optId }));
    setAnalyzing(qId);
    setTimeout(() => setAnalyzing(null), 1600);
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (demoMode) {
      navigate("/results", { state: { demoMode: true } });
      setLoading(false);
      return;
    }

    const answersPayload = QUESTIONS.map((q) => {
      const selectedOptId = answers[q.id];
      if (!selectedOptId) return null;

      const selectedOption = q.options.find((opt) => opt.id === selectedOptId)!;
      const isCorrect = selectedOption.correct || false;

      return {
        question_id: `q${q.id}`,
        answer: selectedOption.text,
        time_taken: 2.5,
        correct: isCorrect,
        category: tagToCategory(q.tag),
      };
    }).filter(Boolean) as Array<{
      question_id: string;
      answer: string;
      time_taken: number;
      correct: boolean;
      category: string;
    }>;

    try {
      const result = await submitWarmup("", answersPayload);
      navigate("/results", { state: { userId: result.user_id } });
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const allAnswered = Object.keys(answers).length === QUESTIONS.length;
  const progress = (Object.keys(answers).length / QUESTIONS.length) * 100;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-fade-in px-6">
          <div
            className="h-16 w-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
            style={{
              background: "hsl(43 90% 44% / 0.1)",
              border: "2px solid hsl(43 90% 44% / 0.25)",
            }}
          >
            <Brain
              size={28}
              strokeWidth={1.75}
              style={{ color: "hsl(43 80% 38%)" }}
            />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            Building your acceleration plan…
          </h2>
          <p className="mt-3 text-base" style={{ color: "hsl(220 14% 52%)" }}>
            Mapping language patterns across your profile
          </p>
          <div className="mt-8 flex justify-center gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-2 w-2 rounded-full animate-bounce"
                style={{
                  background: "hsl(43 90% 44%)",
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <div className="container mx-auto px-6 py-16 max-w-xl animate-fade-in">
          {/* Header */}
          <div className="mb-10 text-center">
            <p
              className="text-sm font-semibold tracking-widest uppercase mb-4"
              style={{ color: "hsl(43 90% 44%)" }}
            >
              Smart Warm-Up
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
              Let's see what clicks.
            </h1>
            <p className="mt-3 text-base" style={{ color: "hsl(220 14% 50%)" }}>
              3 quick questions — we'll figure out your starting edge.
            </p>
          </div>

          {/* Progress bar */}
          <div className="mb-9">
            <div
              className="flex items-center justify-between text-xs font-semibold mb-2"
              style={{ color: "hsl(220 14% 55%)" }}
            >
              <span>
                {Object.keys(answers).length} of {QUESTIONS.length} done
              </span>
              <span style={{ color: "hsl(210 90% 50%)" }}>
                {Math.round(progress)}%
              </span>
            </div>
            <div
              className="h-2 w-full rounded-full overflow-hidden"
              style={{ background: "hsl(210 30% 91%)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  background: "hsl(210 90% 50%)",
                }}
              />
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-5">
            {QUESTIONS.map((q, qi) => (
              <div
                key={q.id}
                className="rounded-3xl p-7 animate-slide-up"
                style={{
                  background: "white",
                  border: "1.5px solid hsl(210 30% 88%)",
                  boxShadow: "0 4px 18px hsl(210 60% 20% / 0.05)",
                  animationDelay: `${qi * 0.08}s`,
                }}
              >
                {/* Tag + number */}
                <div className="flex items-center gap-2.5 mb-4">
                  <div
                    className="h-8 w-8 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{ background: q.tagColor }}
                  >
                    {q.id}
                  </div>
                  <span
                    className="rounded-full px-3 py-1 text-xs font-bold"
                    style={{ background: q.tagBg, color: q.tagColor }}
                  >
                    {q.tag}
                  </span>
                </div>

                <p className="font-semibold text-foreground text-base leading-snug mb-5 pl-11">
                  {q.question}
                </p>

                <div className="space-y-2.5 pl-11">
                  {q.options.map((opt) => {
                    const selected = answers[q.id] === opt.id;
                    const disabled = !!answers[q.id];
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleAnswer(q.id, opt.id)}
                        disabled={disabled}
                        className="w-full text-left rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-150"
                        style={
                          selected
                            ? {
                                background: "hsl(210 90% 50% / 0.08)",
                                border: "1.5px solid hsl(210 90% 50% / 0.35)",
                                color: "hsl(210 90% 38%)",
                                fontWeight: 700,
                              }
                            : disabled
                              ? {
                                  background: "hsl(220 14% 97%)",
                                  border: "1.5px solid hsl(220 14% 91%)",
                                  color: "hsl(220 14% 65%)",
                                  cursor: "default",
                                  opacity: 0.55,
                                }
                              : {
                                  background: "hsl(210 30% 97%)",
                                  border: "1.5px solid hsl(210 30% 90%)",
                                  color: "hsl(220 14% 30%)",
                                  cursor: "pointer",
                                }
                        }
                      >
                        <span
                          className="font-bold mr-2.5 text-xs"
                          style={{
                            color: selected
                              ? "hsl(210 90% 50%)"
                              : "hsl(220 14% 55%)",
                          }}
                        >
                          {opt.id.toUpperCase()}.
                        </span>
                        {opt.text}
                      </button>
                    );
                  })}
                </div>

                {/* Analysing */}
                {analyzing === q.id && (
                  <div
                    className="mt-4 pl-11 flex items-center gap-2 text-xs font-semibold animate-fade-in"
                    style={{ color: "hsl(210 90% 50%)" }}
                  >
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="h-1.5 w-1.5 rounded-full animate-bounce"
                          style={{
                            background: "hsl(210 90% 50%)",
                            animationDelay: `${i * 0.1}s`,
                          }}
                        />
                      ))}
                    </div>
                    {q.insight}
                  </div>
                )}

                {/* Recorded */}
                {answers[q.id] && analyzing !== q.id && (
                  <div className="mt-4 pl-11 animate-fade-in">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold"
                      style={{
                        background: "hsl(142 65% 45% / 0.1)",
                        color: "hsl(142 55% 33%)",
                        border: "1.5px solid hsl(142 65% 45% / 0.25)",
                      }}
                    >
                      <Check size={11} strokeWidth={3} />
                      Pattern recorded
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!allAnswered || loading}
            className="mt-10 w-full rounded-2xl px-6 py-4 text-base font-bold text-white transition-all hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-35 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2.5"
            style={{
              background: "hsl(210 90% 50%)",
              boxShadow: allAnswered
                ? "0 6px 20px hsl(210 90% 50% / 0.28)"
                : "none",
            }}
          >
            <Zap size={16} strokeWidth={2.5} />
            Build My Acceleration Plan
            <ArrowRight size={17} strokeWidth={2.5} />
          </button>

          {demoMode && (
            <p
              className="mt-4 text-center text-xs"
              style={{ color: "hsl(220 14% 65%)" }}
            >
              Demo mode — sample insights shown
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
