export interface ProjectItem {
  id: string | number;
  slug: string;
  title: string;
  category: 'video' | 'branding' | 'flyer' | 'poster' | 'social' | 'banner';
  media_type: 'video' | 'image';
  media_url: string;
  client_or_brand: string;
  description: string;
  tags: string[];
  aspect_ratio: '16:9' | '9:16' | '1:1' | '4:3' | '3:4';
  likes_count: number;
  views_count: number;
  featured: boolean;
  sort_order: number;
  created_at?: string;
}

export interface InquiryInput {
  name: string;
  email: string;
  phone?: string;
  service: string;
  budget?: string;
  timeline?: string;
  message: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Filter projects by category filter and search query
 */
export function filterProjects(
  projects: ProjectItem[],
  filter: string,
  searchQuery: string = ''
): ProjectItem[] {
  const query = searchQuery.trim().toLowerCase();

  return projects.filter((project) => {
    // Category matching
    let matchesCategory = true;
    if (filter === 'all') {
      matchesCategory = true;
    } else if (filter === 'video') {
      matchesCategory = project.media_type === 'video';
    } else if (filter === 'graphics') {
      matchesCategory = project.media_type === 'image';
    } else if (filter === 'branding') {
      matchesCategory = project.category === 'branding';
    } else if (filter === 'print') {
      matchesCategory = project.category === 'flyer' || project.category === 'poster';
    } else if (filter === 'social') {
      matchesCategory = project.category === 'social' || project.category === 'banner';
    } else {
      matchesCategory = project.category === filter;
    }

    // Search query matching
    const matchesSearch =
      query === '' ||
      project.title.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      project.client_or_brand.toLowerCase().includes(query) ||
      project.tags.some((tag) => tag.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });
}

/**
 * Sort projects according to sort criterion
 */
export function sortProjects(
  projects: ProjectItem[],
  sortBy: 'featured' | 'likes' | 'views' | 'order'
): ProjectItem[] {
  const cloned = [...projects];
  switch (sortBy) {
    case 'featured':
      return cloned.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || a.sort_order - b.sort_order);
    case 'likes':
      return cloned.sort((a, b) => b.likes_count - a.likes_count);
    case 'views':
      return cloned.sort((a, b) => b.views_count - a.views_count);
    case 'order':
    default:
      return cloned.sort((a, b) => a.sort_order - b.sort_order);
  }
}

/**
 * Validates inquiry form inputs
 */
export function validateInquiryForm(input: InquiryInput): { valid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  if (!input.name || input.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters long' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!input.email || !emailRegex.test(input.email.trim())) {
    errors.push({ field: 'email', message: 'Please provide a valid email address' });
  }

  if (!input.service || input.service.trim().length === 0) {
    errors.push({ field: 'service', message: 'Please select a service or job inquiry type' });
  }

  if (!input.message || input.message.trim().length < 10) {
    errors.push({ field: 'message', message: 'Message must contain at least 10 characters' });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export type SkillCategory = 'design' | 'video' | 'office' | 'it';

export const SKILL_ICON_KEYS = [
  'canva',
  'photoshop',
  'illustrator',
  'premiere',
  'aftereffects',
  'capcut',
  'filmora',
  'word',
  'excel',
  'powerpoint',
  'windows',
  'chatgpt',
  'claude',
  'google',
  'zoom',
  'palette',
  'sparkles',
  'pen-tool',
  'layers',
  'wand',
  'video',
  'film',
  'scissors',
  'camera',
  'file-text',
  'table',
  'presentation',
  'monitor',
  'cpu',
  'globe',
  'award',
] as const;

export type SkillIconKey = (typeof SKILL_ICON_KEYS)[number];

export interface SkillPayloadInput {
  name: string;
  category: SkillCategory;
  proficiency: number;
  focus?: string;
  icon?: string;
  details?: string;
}

export function getDefaultSkillIcon(category: SkillCategory): SkillIconKey {
  switch (category) {
    case 'design':
      return 'palette';
    case 'video':
      return 'film';
    case 'office':
      return 'file-text';
    case 'it':
      return 'monitor';
    default:
      return 'sparkles';
  }
}

export function normalizeSkillInput(input: SkillPayloadInput): {
  valid: boolean;
  errors: ValidationError[];
  data: {
    name: string;
    category: SkillCategory;
    proficiency: number;
    focus: string;
    icon: SkillIconKey;
    details: string;
  };
} {
  const errors: ValidationError[] = [];
  const name = (input.name || '').trim().slice(0, 100);
  const focus = (input.focus || '').trim().slice(0, 150);
  const details = (input.details || '').trim().slice(0, 1000);
  const proficiency = Math.max(10, Math.min(100, Math.round(Number(input.proficiency) || 0)));

  if (name.length < 2) {
    errors.push({ field: 'name', message: 'Skill name must be at least 2 characters long' });
  }

  const validCategories: SkillCategory[] = ['design', 'video', 'office', 'it'];
  const category: SkillCategory = validCategories.includes(input.category) ? input.category : 'design';

  const icon: SkillIconKey = SKILL_ICON_KEYS.includes(input.icon as SkillIconKey)
    ? (input.icon as SkillIconKey)
    : getDefaultSkillIcon(category);

  return {
    valid: errors.length === 0,
    errors,
    data: {
      name,
      category,
      proficiency,
      focus,
      icon,
      details,
    },
  };
}

/**
 * Compute portfolio metrics and aggregate statistics
 */
export function calculatePortfolioStats(projects: ProjectItem[]) {
  const total = projects.length;
  const videos = projects.filter((p) => p.media_type === 'video').length;
  const graphics = projects.filter((p) => p.media_type === 'image').length;
  const totalLikes = projects.reduce((acc, p) => acc + p.likes_count, 0);
  const totalViews = projects.reduce((acc, p) => acc + p.views_count, 0);

  const categoryBreakdown: Record<string, number> = {};
  for (const p of projects) {
    categoryBreakdown[p.category] = (categoryBreakdown[p.category] || 0) + 1;
  }

  return {
    total,
    videos,
    graphics,
    totalLikes,
    totalViews,
    categoryBreakdown,
  };
}
