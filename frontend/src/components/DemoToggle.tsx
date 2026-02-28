import { useDemo } from "@/context/DemoContext";

export default function DemoToggle() {
  const { demoMode, setDemoMode } = useDemo();

  return (
    <div className="flex items-center gap-2.5">
      <span className="text-xs font-semibold text-muted-foreground hidden sm:block">Demo Mode</span>
      <button
        onClick={() => setDemoMode(!demoMode)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
          demoMode ? "gradient-bg shadow-indigo-custom" : "bg-muted"
        }`}
        aria-label="Toggle demo mode"
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${
            demoMode ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
      {demoMode && (
        <span className="rounded-full gradient-bg px-2.5 py-0.5 text-xs font-bold text-white shadow-indigo-custom">
          ON
        </span>
      )}
    </div>
  );
}
