import React, { useEffect } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { ExpertiseItem } from '../types';
import { SkillIcon } from './SkillIcon';

interface ExpertiseDetailModalProps {
  expertise: ExpertiseItem | null;
  onClose: () => void;
  onInquireService?: (serviceName: string) => void;
}

export const ExpertiseDetailModal: React.FC<ExpertiseDetailModalProps> = ({
  expertise,
  onClose,
  onInquireService,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (expertise) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [expertise, onClose]);

  if (!expertise) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="expertise-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8 bg-[#111318]/75 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl max-h-[85vh] my-auto bg-white rounded-3xl border border-[#E8E5DF] shadow-2xl flex flex-col overflow-hidden text-[#111318]">
        {/* Modal Header: Clean Typography, No Clutter Icons */}
        <div className="px-6 py-5 sm:px-8 sm:py-6 border-b border-[#E8E5DF] bg-[#FAF8F5] flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 font-mono text-[11px] font-semibold text-[#717684]">
              {expertise.num && (
                <span className="text-[#FF6900] font-bold">{expertise.num}</span>
              )}
              <span>•</span>
              <span className="uppercase tracking-wider text-[#FF6900]">
                {expertise.category}
              </span>
              <span>•</span>
              <span>Verified Discipline</span>
            </div>
            <h2
              id="expertise-modal-title"
              className="text-xl sm:text-2xl font-extrabold text-[#111318] tracking-tight leading-snug"
            >
              {expertise.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            aria-label="Close details"
            className="w-9 h-9 rounded-full bg-white border border-[#E8E5DF] hover:bg-[#F5F3EF] flex items-center justify-center text-[#5A606D] hover:text-[#111318] transition-colors shrink-0 shadow-xs cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          {/* Executive Overview: Pure clean text */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#717684] mb-2">
              Executive Overview
            </h3>
            <p className="text-[15px] sm:text-[16px] text-[#111318] font-medium leading-relaxed bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8E5DF]">
              {expertise.summary}
            </p>
          </div>

          {/* Scope & Methodology */}
          {expertise.details && (
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#717684] mb-2">
                Scope &amp; Practical Methodology
              </h3>
              <p className="text-[14px] sm:text-[15px] text-[#5A606D] leading-relaxed">
                {expertise.details}
              </p>
            </div>
          )}

          {/* Tangible Deliverables: Clean typographic em-dashes */}
          {expertise.deliverables && expertise.deliverables.length > 0 && (
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#717684] mb-3">
                Tangible Deliverables &amp; Client Output
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {expertise.deliverables.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3.5 rounded-xl bg-white border border-[#E8E5DF] shadow-2xs hover:border-[#FF6900]/40 transition-colors"
                  >
                    <span className="text-[#FF6900] font-bold text-base select-none leading-none mt-0.5">
                      —
                    </span>
                    <span className="text-[13px] text-[#111318] font-medium leading-snug">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Software & Toolset Applied */}
          {expertise.tools && expertise.tools.length > 0 && (
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#717684] mb-3">
                Software &amp; Toolset Applied
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {expertise.tools.map((tool) => (
                  <div
                    key={tool}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#E8E5DF] shadow-2xs"
                  >
                    <SkillIcon icon={tool} name={tool} className="w-5 h-5" />
                    <span className="text-xs font-semibold text-[#111318] capitalize">
                      {tool.replace(/-/g, ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Academic & Training Foundation: Clean warm card without toy icons */}
          {expertise.coursework && (
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-900 mb-1">
                Practical Coursework &amp; Academic Training
              </h4>
              <p className="text-[13px] text-amber-950/80 leading-relaxed">
                {expertise.coursework}
              </p>
            </div>
          )}

          {/* Core Competency Keywords */}
          {expertise.tags && expertise.tags.length > 0 && (
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#717684] mb-2">
                Core Competency Keywords
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {expertise.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] font-mono text-[11px] font-medium text-[#111318]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Clean Action Buttons */}
        <div className="px-6 py-4 sm:px-8 sm:py-5 border-t border-[#E8E5DF] bg-[#FAF8F5] flex flex-col sm:flex-row items-center justify-between gap-3">
          <a
            href="#projects"
            onClick={onClose}
            className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-white hover:bg-[#F5F3EF] text-[#111318] text-xs font-semibold border border-[#E8E5DF] transition-colors shadow-2xs"
          >
            <span>Browse Related Works ↗</span>
          </a>

          <a
            href="#contact"
            onClick={() => {
              if (onInquireService) onInquireService(expertise.title);
              onClose();
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-full bg-[#111318] hover:bg-[#232730] text-white text-xs font-semibold shadow-md transition-all duration-200 group"
          >
            <span>Hire Munazza for this Discipline</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
};
