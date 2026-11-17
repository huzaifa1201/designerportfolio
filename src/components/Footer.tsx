import React, { useState, useRef } from 'react';
import { Mail, Phone, MapPin, ArrowUp } from 'lucide-react';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdStartRef = useRef<number | null>(null);
  const holdTimerRef = useRef<any>(null);
  const animFrameRef = useRef<any>(null);

  const startHold = (e: React.SyntheticEvent) => {
    if ('button' in e && (e as React.MouseEvent).button !== 0) return;
    const startTime = Date.now();
    holdStartRef.current = startTime;
    setIsHolding(true);
    setHoldProgress(0);

    const updateLoop = () => {
      if (!holdStartRef.current) return;
      const elapsed = Date.now() - holdStartRef.current;
      const pct = Math.min(100, (elapsed / 10000) * 100);
      setHoldProgress(pct);
      if (pct < 100) {
        animFrameRef.current = requestAnimationFrame(updateLoop);
      }
    };
    animFrameRef.current = requestAnimationFrame(updateLoop);

    holdTimerRef.current = setTimeout(() => {
      setIsHolding(false);
      setHoldProgress(0);
      holdStartRef.current = null;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

      try {
        if ('vibrate' in navigator) {
          navigator.vibrate?.([150, 50, 150]);
        }
      } catch {}

      if (onOpenAdmin) {
        onOpenAdmin();
      }
    }, 10000);
  };

  const cancelHold = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    holdStartRef.current = null;
    setIsHolding(false);
    setHoldProgress(0);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-white border-t border-[#EAE6DF] text-xs text-[#5A606D]">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 pt-12 pb-24 lg:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Column 1: Brand & Bio */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div
              onPointerDown={startHold}
              onPointerUp={cancelHold}
              onPointerLeave={cancelHold}
              onPointerCancel={cancelHold}
              onContextMenu={(e) => {
                if (isHolding) e.preventDefault();
              }}
              className="flex items-center gap-3 cursor-pointer select-none group"
              title="Munazza Irfan"
            >
              <div className="relative w-10 h-10 rounded-full bg-[#111318] text-white flex items-center justify-center font-bold text-sm shadow-xs group-hover:bg-[#FF6900] transition-colors">
                {isHolding && (
                  <svg
                    className="absolute -inset-1 w-[calc(100%+8px)] h-[calc(100%+8px)] -rotate-90 pointer-events-none"
                    viewBox="0 0 48 48"
                  >
                    <circle
                      cx="24"
                      cy="24"
                      r="21"
                      stroke="#E8E5DF"
                      strokeWidth="3"
                      fill="none"
                      className="opacity-40"
                    />
                    <circle
                      cx="24"
                      cy="24"
                      r="21"
                      stroke="#FF6900"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      fill="none"
                      strokeDasharray={2 * Math.PI * 21}
                      strokeDashoffset={2 * Math.PI * 21 * (1 - holdProgress / 100)}
                    />
                  </svg>
                )}
                <span className="relative z-10">MI</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[17px] text-[#111318] tracking-tight leading-none">
                  Munazza Irfan
                </span>
                <span className="font-mono text-[11px] text-[#717684] tracking-wider uppercase mt-1">
                  IT &amp; Office Skills Professional
                </span>
              </div>
            </div>

            <p className="text-[15px] text-[#FF6900] font-semibold italic">
              Turning Skills into Success.
            </p>

            <p className="text-[13px] text-[#5A606D] leading-relaxed max-w-sm">
              Architecting dependable IT office solutions, workflow automation, and visual design assets with meticulous precision.
            </p>
          </div>

          {/* Column 2: Quick Navigation */}
          <div className="lg:col-span-3 flex flex-col gap-2">
            <h3 className="font-mono text-[11px] uppercase tracking-widest text-[#111318] font-bold mb-1">
              Quick Navigation
            </h3>
            <ul className="flex flex-col gap-2 font-medium">
              <li>
                <a href="#home" className="hover:text-[#FF6900] transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#FF6900] transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#skills" className="hover:text-[#FF6900] transition-colors">
                  Skills
                </a>
              </li>
              <li>
                <a href="#projects" className="hover:text-[#FF6900] transition-colors">
                  Projects
                </a>
              </li>
              <li>
                <a href="#education" className="hover:text-[#FF6900] transition-colors">
                  Education
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#FF6900] transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Direct Contacts */}
          <div className="lg:col-span-4 flex flex-col gap-2">
            <h3 className="font-mono text-[11px] uppercase tracking-widest text-[#111318] font-bold mb-1">
              Direct Contacts
            </h3>
            <div className="flex flex-col gap-2.5">
              <a
                className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE6DF] hover:border-[#FF6900]/40 text-[#111318] transition-colors"
                href="mailto:munazza.00077@gmail.com"
              >
                <Mail className="w-4 h-4 text-[#FF6900] shrink-0" />
                <span className="font-mono text-[13px]">munazza.00077@gmail.com</span>
              </a>

              <a
                className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE6DF] hover:border-[#FF6900]/40 text-[#111318] transition-colors"
                href="tel:03129547572"
              >
                <Phone className="w-4 h-4 text-[#FF6900] shrink-0" />
                <span className="font-mono text-[13px]">03129547572</span>
              </a>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE6DF] text-[#5A606D]">
                <MapPin className="w-4 h-4 text-[#111318] shrink-0" />
                <span className="text-[13px]">Rawalpindi, Pakistan</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[#EAE6DF] flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-mono text-[11px] text-[#717684]">
            © {new Date().getFullYear()} Munazza Irfan. All Rights Reserved.
          </span>

          <div className="flex items-center gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#EAE6DF]">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
              <span className="font-mono text-[11px] font-semibold text-[#111318] uppercase tracking-wider">
                Available for work
              </span>
            </div>

            <button
              type="button"
              onClick={scrollToTop}
              className="p-2 rounded-full bg-[#FAF8F5] border border-[#EAE6DF] text-[#717684] hover:text-[#111318] hover:bg-[#F5F3EF] transition-all"
              title="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
