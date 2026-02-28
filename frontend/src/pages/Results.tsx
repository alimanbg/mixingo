import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useDemo } from "@/context/DemoContext";
import {
  CheckCircle,
  Rocket,
  Zap,
  TrendingUp,
  Check,
  Loader2,
} from "lucide-react";
import { analyzeCTM } from "@/api";

// Hardcoded module names for display (match your backend modules)
const MODULE_NAMES: Record<string, string> = {
  M01_FamiliarPhrases: "Familiar Phrases",
  M02_Cognates: "Cognates",
  M03_Pronunciation: "Pronunciation",
  M04_WordOrder: "Word Order",
  M05_Gender: "Noun Gender",
  M06_VerbConjugation: "Verb Conjugation",
  M07_CommonExpressions: "Common Expressions",
  M08_Reading: "Reading",
};

// Helper to get module name
const getModuleName = (id: string) => MODULE_NAMES[id] || id;

export default function Results() {
  const navigate = useNavigate();
  const location = useLocation();
  const { demoMode } = useDemo();

  // Get userId passed from warmup page
  const userId = (location.state as any)?.userId;

  const [ctmData, setCtmData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCTM = async () => {
      if (!userId && !demoMode) {
        setError("No user ID found. Please restart the warm-up.");
        setLoading(false);
        return;
      }

      if (demoMode) {
        setCtmData({
          redundancy_removed_percent: 32,
          explainability: fallbackInsights,
          heatmap: fallbackHeatmap,
          recommended_order: fallbackRecommendedOrder,
        });
        setLoading(false);
        return;
      }

      try {
        const data = await analyzeCTM(userId);
        setCtmData(data);
      } catch {
        setError("Could not load your learning plan. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCTM();
  }, [userId, demoMode]);

  // Derive strengths and growth areas from heatmap
  const strengths =
    ctmData?.heatmap
      ?.filter((item: any) => item.severity === 0)
      .map((item: any) => getModuleName(item.module_id)) || [];

  const growthAreas =
    ctmData?.heatmap
      ?.filter((item: any) => item.severity === 2)
      .map((item: any) => getModuleName(item.module_id)) || [];

  const refinementAreas =
    ctmData?.heatmap
      ?.filter((item: any) => item.severity === 1)
      .map((item: any) => getModuleName(item.module_id)) || [];

  // Static fallback data (used when demoMode is true or no CTM data)
  const fallbackStrengths = [
    "Familiar sentence structure",
    "Shared vocabulary roots",
    "Recognizable question patterns",
  ];
  const fallbackGrowthAreas = [
    "Gendered nouns",
    "Nasal pronunciation",
    "Article precision",
  ];
  const fallbackInsights = [
    "Strong transfer from English vocabulary roots into French",
    "High structural familiarity from Mandarin pattern recognition",
    "Pronunciation adaptability advantage from Cantonese tonal training",
  ];

  const fallbackHeatmap = [
    { module_id: "M01_FamiliarPhrases", area: "vocabulary", severity: 0 },
    { module_id: "M02_Cognates", area: "vocabulary", severity: 0 },
    { module_id: "M03_Pronunciation", area: "phonology", severity: 2 },
    { module_id: "M04_WordOrder", area: "syntax", severity: 1 },
    { module_id: "M05_Gender", area: "grammar", severity: 2 },
    { module_id: "M06_VerbConjugation", area: "grammar", severity: 2 },
  ];
  const fallbackRecommendedOrder = [
    "M05_Gender",
    "M03_Pronunciation",
    "M06_VerbConjugation",
    "M04_WordOrder",
  ];

  // Show loading
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-fade-in px-6">
          <Loader2
            size={40}
            className="animate-spin mx-auto mb-4 text-primary"
          />
          <h2 className="text-2xl font-bold text-foreground">
            Loading your personalized plan...
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Crunching your language data
          </p>
        </div>
      </div>
    );
  }

  // Show error
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-6">
          <div className="text-red-500 mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-foreground">
            Something went wrong
          </h2>
          <p className="mt-3 text-base text-muted-foreground">{error}</p>
          <button
            onClick={() => navigate("/warmup")}
            className="mt-6 rounded-xl px-6 py-3 text-white bg-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <div className="container mx-auto px-6 py-12 max-w-5xl animate-fade-in">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/8 border border-primary/20 px-4 py-1.5 text-sm font-semibold text-primary mb-5">
              <CheckCircle size={13} strokeWidth={2.5} />
              Analysis Complete
            </div>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              Your Personalized{" "}
              <span className="text-gradient">Language Acceleration Plan</span>
            </h1>
            <p className="text-muted-foreground mt-3 text-base">
              Cantonese · Mandarin · English → French
            </p>
          </div>

          {/* Big Stat */}
          <div className="glass-card p-12 text-center mb-8 relative overflow-hidden">
            <div className="absolute inset-0 dot-texture opacity-20" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full bg-primary/5 blur-[80px] pointer-events-none" />
            <div className="relative">
              <div className="font-display text-8xl md:text-9xl font-extrabold text-gradient leading-none tracking-tight">
                +{ctmData?.redundancy_removed_percent || 32}%
              </div>
              <div className="mt-3 text-xl md:text-2xl font-bold text-foreground">
                Faster Progress From Day One
              </div>
              <p className="text-sm text-muted-foreground mt-3 max-w-md mx-auto leading-relaxed">
                Based on patterns Mixingo identified between your languages and
                French.
              </p>
              {demoMode && (
                <span className="inline-block mt-4 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                  Demo Mode Active — Showing Sample Insights
                </span>
              )}
            </div>
          </div>

          {/* ─── Advantage Map ─── */}
          <div className="glass-card p-7 mb-8">
            {/* Header row */}
            <div className="flex items-start justify-between flex-wrap gap-3 mb-7">
              <div>
                <h2 className="font-display text-xl font-bold text-foreground">
                  Your Advantage Map
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  AI-detected strengths across your language profile
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                {[
                  {
                    color: "bg-heat-green",
                    label: "Strong Foundation (severity 0)",
                  },
                  {
                    color: "bg-heat-yellow",
                    label: "Refinement Zone (severity 1)",
                  },
                  {
                    color: "bg-heat-red",
                    label: "Growth Opportunity (severity 2)",
                  },
                ].map((l) => (
                  <div
                    key={l.label}
                    className="flex items-center gap-2 text-xs text-muted-foreground font-semibold"
                  >
                    <div className={`h-3 w-3 rounded-sm ${l.color}`} />
                    {l.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Heatmap grid - clickable to navigate to module exercises */}
            {((ctmData?.heatmap ?? fallbackHeatmap) as any[]).length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {(ctmData?.heatmap || fallbackHeatmap).map((item: any) => {
                  let bgColor = "bg-heat-green/20 border-heat-green/40";
                  if (item.severity === 1)
                    bgColor = "bg-heat-yellow/20 border-heat-yellow/40";
                  if (item.severity === 2)
                    bgColor = "bg-heat-red/20 border-heat-red/40";
                  return (
                    <button
                      key={item.module_id}
                      type="button"
                      onClick={() =>
                        navigate("/exercises", {
                          state: {
                            moduleId: item.module_id,
                            userId: userId ?? "demo",
                          },
                        })
                      }
                      className={`rounded-xl p-3 border text-left transition-all hover:scale-[1.02] hover:shadow-md ${bgColor}`}
                    >
                      <div className="font-bold text-xs text-foreground">
                        {getModuleName(item.module_id)}
                      </div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {item.area}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-border mb-6" />

            {/* Insight summary */}
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Your multilingual background creates{" "}
              <span className="font-semibold text-foreground">
                measurable acceleration
              </span>{" "}
              in vocabulary and structure recognition — advantages most learners
              don't have.
            </p>

            {/* Insight bullets from explainability */}
            <div className="grid sm:grid-cols-3 gap-3">
              {(ctmData?.explainability || fallbackInsights).map(
                (text: string) => (
                  <div
                    key={text}
                    className="flex items-start gap-3 rounded-xl bg-primary/5 border border-primary/10 p-4"
                  >
                    <Check
                      size={13}
                      strokeWidth={3}
                      className="mt-0.5 text-primary shrink-0"
                    />
                    <p className="text-xs text-foreground leading-relaxed font-medium">
                      {text}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Three insight columns: Strengths, Growth Areas, Strategy */}
          <div className="grid md:grid-cols-3 gap-5 mb-8">
            {/* Built-In Strengths */}
            <div className="glass-card p-6 border-t-4 border-heat-green">
              <div className="flex items-center gap-2.5 mb-4">
                <Rocket
                  size={18}
                  strokeWidth={1.75}
                  className="text-heat-green flex-shrink-0"
                />
                <h3 className="font-display font-bold text-foreground">
                  Built-In Strengths
                </h3>
              </div>
              <ul className="space-y-3">
                {(strengths.length > 0 ? strengths : fallbackStrengths).map(
                  (item: string) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm text-muted-foreground"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-heat-green" />
                      {item}
                    </li>
                  ),
                )}
              </ul>
            </div>

            {/* Focus Areas For Growth */}
            <div className="glass-card p-6 border-t-4 border-heat-red">
              <div className="flex items-center gap-2.5 mb-4">
                <Zap
                  size={18}
                  strokeWidth={1.75}
                  className="text-heat-red flex-shrink-0"
                />
                <h3 className="font-display font-bold text-foreground">
                  Focus Areas For Growth
                </h3>
              </div>
              <ul className="space-y-3">
                {(growthAreas.length > 0
                  ? growthAreas
                  : fallbackGrowthAreas
                ).map((item: string) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-muted-foreground"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-heat-red" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* 4-Week Strategy (static for now) */}
            <div className="glass-card p-6 border-t-4 border-primary">
              <div className="flex items-center gap-2.5 mb-4">
                <TrendingUp
                  size={18}
                  strokeWidth={1.75}
                  className="text-primary flex-shrink-0"
                />
                <h3 className="font-display font-bold text-foreground">
                  4-Week Strategy
                </h3>
              </div>
              <ul className="space-y-3.5">
                {[
                  {
                    week: "Week 1",
                    title: "Gender Mastery",
                    pct: 40,
                    color: "bg-heat-red",
                  },
                  {
                    week: "Week 2",
                    title: "Pronunciation Refinement",
                    pct: 30,
                    color: "bg-heat-yellow",
                  },
                  {
                    week: "Week 3",
                    title: "Vocabulary Expansion",
                    pct: 20,
                    color: "bg-heat-green",
                  },
                  {
                    week: "Week 4",
                    title: "Conversation Integration",
                    pct: 10,
                    color: "bg-heat-green",
                  },
                ].map((item) => (
                  <li key={item.week} className="text-sm">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-foreground">
                        {item.week} – {item.title}
                      </span>
                      <span className="font-bold text-primary text-xs">
                        {item.pct}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.color} transition-all duration-500`}
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button
            onClick={() =>
              navigate("/exercises", {
                state: {
                  moduleId: ctmData?.recommended_order?.[0] || "M05_Gender",
                  userId: userId ?? "demo",
                },
              })
            }
            className="w-full rounded-2xl gradient-bg px-6 py-4 text-base font-bold text-white shadow-indigo-custom transition-all hover:opacity-90 hover:scale-[1.02] active:scale-100"
          >
            Start My Optimized Exercises →
          </button>
        </div>
      </main>
    </div>
  );
}
