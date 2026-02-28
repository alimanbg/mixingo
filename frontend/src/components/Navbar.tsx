import { Link } from "react-router-dom";
import DemoToggle from "./DemoToggle";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl" style={{ background: "hsl(46 100% 98% / 0.9)", borderBottom: "2px solid hsl(210 90% 50% / 0.1)" }}>
      <div className="container mx-auto flex h-16 items-center justify-between px-6 max-w-7xl">
        <Link to="/" className="flex items-center gap-2.5 group">
          {/* Logo — languages merging (Mixingo brand: blue + yellow) */}
          <span className="inline-flex h-9 w-9 items-center justify-center shrink-0">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-200 group-hover:scale-105">
              <defs>
                <linearGradient id="mixGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(210,90%,50%)"/>
                  <stop offset="100%" stopColor="hsl(43,90%,44%)"/>
                </linearGradient>
                <filter id="mixGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="1" result="blur"/>
                  <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                </filter>
              </defs>
              <circle cx="14" cy="18" r="10" fill="hsl(210,90%,50%)" fillOpacity="0.9"/>
              <circle cx="22" cy="18" r="10" fill="hsl(43,90%,44%)" fillOpacity="0.9"/>
              <path d="M18 8.4A9.6 9.6 0 0 1 18 27.6A9.6 9.6 0 0 1 18 8.4Z" fill="url(#mixGrad)" filter="url(#mixGlow)" opacity="0.95"/>
              <circle cx="18" cy="18" r="2.5" fill="white"/>
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
