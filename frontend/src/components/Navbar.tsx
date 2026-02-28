import { Link } from "react-router-dom";
import DemoToggle from "./DemoToggle";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl" style={{ background: "hsl(46 100% 98% / 0.9)", borderBottom: "2px solid hsl(210 90% 50% / 0.1)" }}>
      <div className="container mx-auto flex h-16 items-center justify-between px-6 max-w-7xl">
        <Link to="/" className="flex items-center gap-2.5 group">
          {/* Logo mark — two overlapping rounded shapes merging into a gradient core */}
          <span className="inline-flex h-9 w-9 items-center justify-center">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4338CA"/>
                  <stop offset="100%" stopColor="#06B6D4"/>
                </linearGradient>
                <linearGradient id="leftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4338CA" stopOpacity="0.85"/>
                  <stop offset="100%" stopColor="#4338CA" stopOpacity="0.6"/>
                </linearGradient>
                <linearGradient id="rightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.6"/>
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.85"/>
                </linearGradient>
                <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="1.5" result="blur"/>
                  <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                </filter>
              </defs>
              {/* Left circle — Indigo */}
              <circle cx="14" cy="18" r="9" fill="url(#leftGrad)"/>
              {/* Right circle — Teal */}
              <circle cx="22" cy="18" r="9" fill="url(#rightGrad)"/>
              {/* Intersection glow — gradient blend */}
              <path
                d="M18 10.06A9 9 0 0 1 18 25.94A9 9 0 0 1 18 10.06Z"
                fill="url(#logoGrad)"
                filter="url(#glow)"
                opacity="0.95"
              />
              {/* Center dot — acceleration point */}
              <circle cx="18" cy="18" r="2.2" fill="white" opacity="0.95"/>
            </svg>
          </span>
          <span className="font-display font-bold text-xl tracking-wide leading-none select-none">
            <span style={{ color: "hsl(210 90% 50%)" }} className="font-black">MIX</span>
            <span className="text-foreground opacity-50 font-semibold">in</span>
            <span style={{ color: "hsl(43 90% 40%)" }} className="font-black">GO</span>
          </span>
        </Link>
        <DemoToggle />
      </div>
    </header>
  );
}
