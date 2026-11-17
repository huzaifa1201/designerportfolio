export interface Project {
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
  comments?: ProjectComment[];
}

export interface SkillItem {
  id: string | number;
  name: string;
  category: 'design' | 'video' | 'office' | 'it';
  proficiency: number;
  focus: string;
  icon?: string;
  details?: string;
  sort_order?: number;
  created_at?: string;
}

export interface ExpertiseItem {
  id: string | number;
  num?: string;
  title: string;
  category: 'office' | 'design' | 'video' | 'it' | 'research' | 'collaboration' | 'ai';
  icon?: string;
  summary: string;
  details?: string;
  tags: string[];
  tools?: string[];
  coursework?: string;
  deliverables?: string[];
  sort_order?: number;
  created_at?: string;
}


export interface ProjectComment {
  id: string | number;
  project_id?: string | number;
  projectId?: string | number;
  author_name?: string;
  authorName?: string;
  comment: string;
  rating: number;
  created_at?: string;
}

export interface Inquiry {
  id: string | number;
  name: string;
  email: string;
  phone?: string;
  service: string;
  budget?: string;
  timeline?: string;
  message: string;
  status: 'new' | 'contacted' | 'hired' | 'archived';
  created_at?: string;
}

export interface Testimonial {
  id: string | number;
  author: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  created_at?: string;
}

export interface PortfolioStats {
  totalProjects: number;
  videoReels: number;
  graphicDesigns: number;
  totalLikes: number;
  totalViews: number;
  totalInquiries: number;
}
