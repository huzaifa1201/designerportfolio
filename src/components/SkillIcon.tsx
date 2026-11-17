import React from 'react';
import {
  Palette,
  Sparkles,
  PenTool,
  Layers,
  Wand2,
  Video,
  Film,
  Scissors,
  Camera,
  FileText,
  Table,
  Presentation,
  Monitor,
  Cpu,
  Globe,
  Award,
} from 'lucide-react';
import { SkillCategory } from '../utils/portfolio-logic';

export const SKILL_ICON_OPTIONS = [
  { key: 'palette', label: 'Palette', Icon: Palette },
  { key: 'sparkles', label: 'Sparkles', Icon: Sparkles },
  { key: 'pen-tool', label: 'Pen Tool', Icon: PenTool },
  { key: 'layers', label: 'Layers', Icon: Layers },
  { key: 'wand', label: 'Magic Wand', Icon: Wand2 },
  { key: 'video', label: 'Video Cam', Icon: Video },
  { key: 'film', label: 'Film Reel', Icon: Film },
  { key: 'scissors', label: 'Cut & Edit', Icon: Scissors },
  { key: 'camera', label: 'Camera', Icon: Camera },
  { key: 'file-text', label: 'Document', Icon: FileText },
  { key: 'table', label: 'Spreadsheet', Icon: Table },
  { key: 'presentation', label: 'Slide Deck', Icon: Presentation },
  { key: 'monitor', label: 'Desktop OS', Icon: Monitor },
  { key: 'cpu', label: 'IT Systems', Icon: Cpu },
  { key: 'globe', label: 'Web & AI', Icon: Globe },
  { key: 'award', label: 'Certified', Icon: Award },
];

export interface AppLogoOption {
  key: string;
  label: string;
  category: SkillCategory;
  description: string;
}

export const APP_LOGO_OPTIONS: AppLogoOption[] = [
  { key: 'canva', label: 'Canva Pro', category: 'design', description: 'Canva graphic design suite' },
  { key: 'photoshop', label: 'Adobe Photoshop', category: 'design', description: 'Raster graphics & photo editing' },
  { key: 'illustrator', label: 'Adobe Illustrator', category: 'design', description: 'Vector graphics & logo branding' },
  { key: 'premiere', label: 'Adobe Premiere Pro', category: 'video', description: 'Timeline video editing & reels' },
  { key: 'aftereffects', label: 'Adobe After Effects', category: 'video', description: 'Motion graphics & VFX' },
  { key: 'capcut', label: 'CapCut Studio', category: 'video', description: 'Viral short-form & captions' },
  { key: 'filmora', label: 'Wondershare Filmora', category: 'video', description: 'Video editing & montages' },
  { key: 'word', label: 'Microsoft Word', category: 'office', description: 'Document processing & reporting' },
  { key: 'excel', label: 'Microsoft Excel', category: 'office', description: 'Spreadsheets, data & formulas' },
  { key: 'powerpoint', label: 'Microsoft PowerPoint', category: 'office', description: 'Pitch decks & slide master' },
  { key: 'windows', label: 'Windows OS & PC', category: 'it', description: 'Operating system & hardware support' },
  { key: 'chatgpt', label: 'ChatGPT / OpenAI', category: 'it', description: 'AI prompt engineering & writing' },
  { key: 'claude', label: 'Claude / Anthropic', category: 'it', description: 'AI research & document analysis' },
  { key: 'google', label: 'Google Workspace', category: 'office', description: 'Docs, Sheets, Drive & Meet' },
  { key: 'zoom', label: 'Zoom Meetings', category: 'office', description: 'Video conferencing & collaboration' },
];

interface SkillIconProps {
  icon?: string;
  name?: string;
  category?: SkillCategory;
  className?: string;
}

export const SkillIcon: React.FC<SkillIconProps> = ({
  icon,
  name = '',
  category = 'design',
  className = 'w-6 h-6',
}) => {
  // If icon is an image URL
  if (icon && (icon.startsWith('http://') || icon.startsWith('https://') || icon.startsWith('/assets/') || icon.startsWith('data:'))) {
    return (
      <img
        src={icon}
        alt={name || 'Skill icon'}
        className={`${className} object-contain rounded-lg`}
      />
    );
  }

  // Normalize key from icon or skill name
  const rawKey = (icon || '').toLowerCase().trim();
  const rawName = (name || '').toLowerCase().trim();

  // 1. CANVA
  if (rawKey === 'canva' || rawName.includes('canva')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="23" fill="url(#canva-gradient)" />
        <path
          d="M26.2 32.8c-4.8 0-8.2-3.6-8.2-8.8 0-5.6 3.8-9.4 8.7-9.4 3.4 0 5.6 1.7 6.4 4.3l-3.3 1.1c-.5-1.5-1.7-2.4-3.2-2.4-3 0-5 2.6-5 6.3 0 3.5 2 6 5.1 6 1.6 0 2.9-.9 3.5-2.5l3.3 1.1c-1 2.8-3.4 4.4-7.3 4.4z"
          fill="#FFFFFF"
        />
        <defs>
          <linearGradient id="canva-gradient" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#00C4CC" />
            <stop offset="0.5" stopColor="#3672F8" />
            <stop offset="1" stopColor="#7D2AE8" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // 2. ADOBE PHOTOSHOP (Ps)
  if (rawKey === 'photoshop' || rawName.includes('photoshop')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="10" fill="#001E36" />
        <path
          d="M13.5 14h6.8c4.2 0 6.7 2.1 6.7 5.6 0 3.7-2.6 5.8-6.8 5.8h-3.2V34h-3.5V14zm3.5 8.4h3.1c2.2 0 3.4-1 3.4-2.8 0-1.7-1.2-2.7-3.4-2.7H17v5.5z"
          fill="#31A8FF"
        />
        <path
          d="M27.2 29.5c1.2.9 2.9 1.6 4.7 1.6 1.8 0 2.8-.7 2.8-1.8 0-1.1-.9-1.6-3.2-2.4-3.5-1.1-5.1-2.6-5.1-5 0-3 2.5-5.2 6.3-5.2 2 0 3.7.6 4.8 1.4l-1.1 2.6c-.9-.7-2.3-1.2-3.8-1.2-1.8 0-2.6.8-2.6 1.7 0 1 .9 1.5 3.3 2.3 3.6 1.2 5.1 2.7 5.1 5.2 0 3.1-2.5 5.3-6.6 5.3-2.3 0-4.3-.7-5.5-1.7l1.2-2.6z"
          fill="#31A8FF"
        />
      </svg>
    );
  }

  // 3. ADOBE PREMIERE PRO (Pr)
  if (rawKey === 'premiere' || rawName.includes('premiere')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="10" fill="#00005B" />
        <path
          d="M13.5 14h6.8c4.2 0 6.7 2.1 6.7 5.6 0 3.7-2.6 5.8-6.8 5.8h-3.2V34h-3.5V14zm3.5 8.4h3.1c2.2 0 3.4-1 3.4-2.8 0-1.7-1.2-2.7-3.4-2.7H17v5.5z"
          fill="#EA77FF"
        />
        <path
          d="M27 21h3.3v2.4c.8-1.7 2.3-2.6 4.3-2.6.4 0 .8 0 1.1.1v3.4c-.4-.1-.9-.1-1.4-.1-2.3 0-3.8 1.6-3.8 4.2V34H27V21z"
          fill="#EA77FF"
        />
      </svg>
    );
  }

  // 4. ADOBE ILLUSTRATOR (Ai)
  if (rawKey === 'illustrator' || rawName.includes('illustrator')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="10" fill="#330000" />
        <path
          d="M22.5 34l-1.9-5.4h-7.2L11.5 34H7.8L15 14h4.1l7.2 20h-3.8zm-2.8-8.2L17 17.5l-2.7 8.3h5.4z"
          fill="#FF9A00"
        />
        <path
          d="M28.5 17.2c0-1.2.9-2.2 2.2-2.2s2.2 1 2.2 2.2c0 1.2-.9 2.2-2.2 2.2s-2.2-1-2.2-2.2zM29 21.5h3.4V34H29V21.5z"
          fill="#FF9A00"
        />
      </svg>
    );
  }

  // 5. ADOBE AFTER EFFECTS (Ae)
  if (rawKey === 'aftereffects' || rawName.includes('after effects')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="10" fill="#00005B" />
        <path
          d="M22.5 34l-1.9-5.4h-7.2L11.5 34H7.8L15 14h4.1l7.2 20h-3.8zm-2.8-8.2L17 17.5l-2.7 8.3h5.4z"
          fill="#D291FF"
        />
        <path
          d="M32.5 34.3c-4.4 0-7.3-3-7.3-7.2 0-4.3 3.1-7.4 7.2-7.4 4.3 0 6.9 3 6.9 7v1.4h-10.6c.2 2.4 1.8 3.8 4 3.8 1.8 0 3-1 3.7-2.3l2.8 1.3c-1.3 2.1-3.6 3.4-6.7 3.4zm-.2-12c-2 0-3.3 1.3-3.6 3.3h7.2c-.1-2-1.4-3.3-3.6-3.3z"
          fill="#D291FF"
        />
      </svg>
    );
  }

  // 6. CAPCUT STUDIO
  if (rawKey === 'capcut' || rawName.includes('capcut')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="10" fill="#0F0F0F" />
        <path
          d="M12 18.5c5.5 0 9.8 2.5 12 5.5-2.2 3-6.5 5.5-12 5.5V33c8 0 14-3.8 17-9-3-5.2-9-9-17-9v3.5z"
          fill="#FFFFFF"
        />
        <path
          d="M36 18.5c-5.5 0-9.8 2.5-12 5.5 2.2 3 6.5 5.5 12 5.5V33c-8 0-14-3.8-17-9 3-5.2 9-9 17-9v3.5z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  // 7. WONDERSHARE FILMORA
  if (rawKey === 'filmora' || rawName.includes('filmora')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="10" fill="#000000" />
        <path d="M14 14l10 10-10 10V14z" fill="#00E5D9" />
        <path d="M24 24l10-10v20L24 24z" fill="#FF5E62" />
      </svg>
    );
  }

  // 8. MICROSOFT WORD (W)
  if (rawKey === 'word' || rawName.includes('word')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="10" fill="#185ABD" />
        <path
          d="M13 14l4.5 20h3.5l3-13.5 3 13.5h3.5l4.5-20h-4l-2.6 13.8L25.3 14h-2.6l-3.1 13.8L17 14H13z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  // 9. MICROSOFT EXCEL (X)
  if (rawKey === 'excel' || rawName.includes('excel')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="10" fill="#107C41" />
        <path
          d="M16 14l5.5 9.8L15.8 34h4.4l3.8-7.5 3.8 7.5h4.4l-5.7-10.2L32 14h-4.4l-3.6 7.2L20.4 14H16z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  // 10. MICROSOFT POWERPOINT (P)
  if (rawKey === 'powerpoint' || rawName.includes('powerpoint')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="10" fill="#C43E1C" />
        <path
          d="M16 14h8.5c4.8 0 7.5 2.5 7.5 6.5s-2.7 6.5-7.5 6.5h-4.5V34H16V14zm4 9.5h4.2c2.4 0 3.8-1.2 3.8-3s-1.4-3-3.8-3H20v6z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  // 11. WINDOWS OS
  if (rawKey === 'windows' || rawName.includes('windows')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="10" fill="#0A0E17" />
        <path d="M12 12h11v11H12V12z" fill="#00ADEF" />
        <path d="M25 12h11v11H25V12z" fill="#00ADEF" />
        <path d="M12 25h11v11H12V25z" fill="#00ADEF" />
        <path d="M25 25h11v11H25V25z" fill="#00ADEF" />
      </svg>
    );
  }

  // 12. CHATGPT / OPENAI
  if (rawKey === 'chatgpt' || rawName.includes('chatgpt') || rawName.includes('openai')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="10" fill="#10A37F" />
        <path
          d="M34.5 22.8a6.3 6.3 0 00-.5-4.8 6.4 6.4 0 00-6.1-3.2 6.3 6.3 0 00-4.3-1.8 6.4 6.4 0 00-5.8 3.8 6.3 6.3 0 00-3.8 2.7 6.4 6.4 0 00.3 6.9 6.3 6.3 0 00.5 4.8 6.4 6.4 0 006.1 3.2 6.3 6.3 0 004.3 1.8 6.4 6.4 0 005.8-3.8 6.3 6.3 0 003.8-2.7 6.4 6.4 0 00-.3-6.9zm-9.5 9.4c-2.4 0-4.4-1.9-4.4-4.3 0-.6.1-1.1.4-1.6l4 2.3v3.6zm-7.6-4.4c-.8-1.4-.7-3.1.2-4.4l3.1 1.8c-.3.5-.4 1-.4 1.6 0 1.9 1.3 3.5 3.1 4l-3.1 1.8c-1.3-1.1-2.3-2.7-2.9-4.8zm-1.3-9.1c.8-1.4 2.2-2.3 3.8-2.5v3.6c-.5.3-1 .7-1.3 1.2-1 1.7-.8 3.8.5 5.3l-3.1 1.8c-.7-1.7-1-3.6-.5-5.5l.6-3.9zm13.1-2c1.3 1.1 2.3 2.7 2.9 4.8.8 1.4.7 3.1-.2 4.4l-3.1-1.8c.3-.5.4-1 .4-1.6 0-1.9-1.3-3.5-3.1-4l3.1-1.8zm2.4 7.2c1 1.7.8 3.8-.5 5.3l3.1-1.8c.7 1.7 1 3.6.5 5.5l-.6 3.9c-.8 1.4-2.2 2.3-3.8 2.5v-3.6c.5-.3 1-.7 1.3-1.2v-10.6zm-7.6-4.1c2.4 0 4.4 1.9 4.4 4.3 0 .6-.1 1.1-.4 1.6l-4-2.3v-3.6z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  // 13. CLAUDE / ANTHROPIC
  if (rawKey === 'claude' || rawName.includes('claude')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="10" fill="#CC785C" />
        <path
          d="M27.2 14h-6.4l-6.8 20h5.8l1.4-4.2h5.6l1.4 4.2h5.8L27.2 14zm-4.9 11.5l1.7-5.5 1.7 5.5h-3.4z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  // 14. GOOGLE DRIVE / WORKSPACE
  if (rawKey === 'google' || rawName.includes('google')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="10" fill="#FFFFFF" stroke="#E8E5DF" />
        <path d="M19 14h10l8.5 14.7H27.5L19 14z" fill="#FFBA00" />
        <path d="M10.5 28.7l5-8.7L24 34.7H14l-3.5-6z" fill="#00AC47" />
        <path d="M24 34.7L19 26h18.5l5 8.7H24z" fill="#0066DA" />
      </svg>
    );
  }

  // 15. ZOOM
  if (rawKey === 'zoom' || rawName.includes('zoom')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="10" fill="#2D8CFF" />
        <path
          d="M13 19a3 3 0 013-3h11a3 3 0 013 3v10a3 3 0 01-3 3H16a3 3 0 01-3-3V19zm19 2.2l4.5-3.2A1 1 0 0138 18.8v10.4a1 1 0 01-1.5.8L32 26.8v-5.6z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  // Default fallback to Lucide icons based on key or category
  const fallbackIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    palette: Palette,
    sparkles: Sparkles,
    'pen-tool': PenTool,
    layers: Layers,
    wand: Wand2,
    video: Video,
    film: Film,
    scissors: Scissors,
    camera: Camera,
    'file-text': FileText,
    table: Table,
    presentation: Presentation,
    monitor: Monitor,
    cpu: Cpu,
    globe: Globe,
    award: Award,
  };

  const IconComponent = fallbackIcons[rawKey] || (category === 'video' ? Film : category === 'office' ? FileText : category === 'it' ? Monitor : Palette);

  return (
    <div className={`flex items-center justify-center rounded-xl bg-[#FFF2E5] text-[#FF6900] ${className}`}>
      <IconComponent className="w-1/2 h-1/2" />
    </div>
  );
};
