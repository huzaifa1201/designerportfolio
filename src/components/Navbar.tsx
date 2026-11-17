import React, { useState, useEffect, useRef } from 'react';
import { Download } from 'lucide-react';

interface NavbarProps {
  onOpenAdmin?: () => void;
  inquiryCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin, inquiryCount = 0 }) => {
  const [activeSection, setActiveSection] = useState('home');

  // Secret 10-second hold state for Logo
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0); // 0 to 100%
  const holdStartRef = useRef<number | null>(null);
  const holdTimerRef = useRef<any>(null);
  const animFrameRef = useRef<any>(null);
  const triggeredRef = useRef(false);

  const startHold = (e: React.SyntheticEvent) => {
    // Only primary button or touch
    if ('button' in e && (e as React.MouseEvent).button !== 0) return;

    triggeredRef.current = false;
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
      triggeredRef.current = true;
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

  const handleLogoClick = (e: React.MouseEvent) => {
    if (triggeredRef.current) {
      e.preventDefault();
      e.stopPropagation();
      triggeredRef.current = false;
      return;
    }
    setActiveSection('home');
  };

  const navLinks = [
    { id: 'home', label: 'Home', href: '#home' },
    { id: 'about', label: 'About', href: '#about' },
    { id: 'skills', label: 'Skills', href: '#skills' },
    { id: 'projects', label: 'Projects', href: '#projects' },
    { id: 'education', label: 'Education', href: '#education' },
    { id: 'contact', label: 'Contact', href: '#contact' },
  ];

  // Track active section on desktop
  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = ['contact', 'education', 'projects', 'skills', 'about', 'home'];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#EAE6DF] transition-all">
      <div className="h-16 lg:h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between gap-3 sm:gap-4">
        
        {/* Top App Bar Left: MI Logo & Profile Identity (Hold 10s for Secret Admin Access) */}
        <a
          href="#home"
          onClick={handleLogoClick}
          onPointerDown={startHold}
          onPointerUp={cancelHold}
          onPointerLeave={cancelHold}
          onPointerCancel={cancelHold}
          onContextMenu={(e) => {
            if (isHolding) e.preventDefault();
          }}
          className="flex items-center gap-2.5 sm:gap-3 group focus-visible:outline-none min-w-0 select-none cursor-pointer"
          title="Munazza Irfan"
        >
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#111318] text-white flex items-center justify-center font-bold text-sm sm:text-base shadow-xs group-hover:bg-[#FF6900] transition-colors duration-200 shrink-0">
            {/* Smooth 10-second Circular Progress Ring on Hold */}
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
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[15px] sm:text-[17px] text-[#111318] tracking-tight truncate">
                Munazza Irfan
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse shrink-0" />
            </div>
            {/* Desktop Full Subtitle */}
            <span className="hidden sm:inline font-mono text-[11px] text-[#717684] tracking-wider uppercase truncate">
              IT &amp; Office Skills Professional
            </span>
            {/* Mobile Compact Subtitle */}
            <span className="sm:hidden text-[10px] text-[#717684] font-medium truncate">
              IT &amp; Office Specialist
            </span>
          </div>
        </a>

        {/* Desktop Center: Floating Pill Navigation Menu */}
        <nav className="hidden lg:flex items-center gap-1.5 p-1.5 rounded-full bg-white border border-[#E8E5DF] shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setActiveSection(link.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#111318] text-white shadow-xs'
                    : 'text-[#5A606D] hover:text-[#111318] hover:bg-[#F5F3EF]'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Top App Bar Right: CTAs */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Download CV Button */}
          <a
            href="#contact"
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-full bg-[#111318] text-white text-xs sm:text-sm font-semibold hover:bg-[#232730] hover:shadow-md transition-all duration-200 shadow-xs whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white shrink-0" />
            <span>Download CV</span>
          </a>
        </div>
      </div>
    </header>
  );
};
