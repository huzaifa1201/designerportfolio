import React, { useState } from 'react';
import { Heart, Eye, Search, Play, Info, ArrowDown } from 'lucide-react';
import { Project } from '../types';
import { filterProjects, sortProjects } from '../utils/portfolio-logic';

interface PortfolioGridProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onLikeProject: (id: string | number, e: React.MouseEvent) => void;
  likedIds: Set<string | number>;
}

export const PortfolioGrid: React.FC<PortfolioGridProps> = ({
  projects,
  onSelectProject,
  onLikeProject,
  likedIds,
}) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'likes' | 'views' | 'order'>('featured');
  const [showAll, setShowAll] = useState(false);

  const filtered = filterProjects(projects as any, activeFilter, searchQuery);
  const sorted = sortProjects(filtered, sortBy) as Project[];

  // Prioritize featured works in default view
  const orderedProjects = React.useMemo(() => {
    if (activeFilter === 'all' && sortBy === 'featured' && !searchQuery.trim()) {
      const graphics = sorted.filter((p) => p.media_type === 'image');
      const videos = sorted.filter((p) => p.media_type === 'video');
      return [...graphics, ...videos];
    }
    return sorted;
  }, [sorted, activeFilter, sortBy, searchQuery]);

  const isDefaultAllView = activeFilter === 'all' && !searchQuery.trim();
  const visibleProjects =
    isDefaultAllView && !showAll ? orderedProjects.slice(0, 9) : orderedProjects;

  const filterTabs = [
    { id: 'all', label: `All Works (${projects.length})` },
    {
      id: 'graphics',
      label: `Graphic Design (${projects.filter((p) => p.media_type === 'image').length})`,
    },
    {
      id: 'video',
      label: `Video Reels (${projects.filter((p) => p.media_type === 'video').length})`,
    },
    { id: 'branding', label: 'Logos & Branding' },
    { id: 'print', label: 'Posters & Flyers' },
    { id: 'social', label: 'Social & Banners' },
  ];

  return (
    <section className="relative z-10 w-full py-16 lg:py-24 bg-[#FAF8F5]" id="projects">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-[#FFF2E5] border border-[#FFE0C2]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6900]" />
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#FF6900] font-bold">
                Practical Showcase
              </span>
            </div>
            <h2 className="text-[34px] sm:text-[42px] font-extrabold text-[#111318] tracking-tight">
              Featured Projects
            </h2>
          </div>

          <div className="p-3.5 px-4 rounded-2xl bg-white border border-[#E8E5DF] max-w-md shadow-xs">
            <p className="font-mono text-[11px] text-[#717684] uppercase tracking-wider flex items-center gap-1.5 font-semibold">
              <Info className="w-3.5 h-3.5 text-[#FF6900]" />
              <span>Coursework &amp; Academic Practice Showcase</span>
            </p>
            <p className="text-[13px] text-[#5A606D] mt-0.5">
              Real demonstration assets created during 6-month hands-on computer training.
            </p>
          </div>
        </div>

        {/* Search, Filter Pills & Sort Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8">
          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {filterTabs.map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#111318] text-white shadow-sm'
                      : 'bg-white text-[#5A606D] border border-[#E8E5DF] hover:bg-[#F5F3EF] hover:text-[#111318]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-60">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8F9D]" />
              <input
                type="text"
                placeholder="Search title, brand, tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-[#E8E5DF] bg-white py-2 pl-9 pr-4 text-xs text-[#111318] placeholder-[#8A8F9D] focus:border-[#FF6900] focus:ring-1 focus:ring-[#FF6900] focus:outline-none transition-all shadow-xs"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-full border border-[#E8E5DF] bg-white py-2 px-3.5 text-xs font-semibold text-[#111318] focus:border-[#FF6900] focus:outline-none transition-all cursor-pointer shadow-xs"
            >
              <option value="featured">Featured First</option>
              <option value="likes">Most Liked</option>
              <option value="views">Most Viewed</option>
            </select>
          </div>
        </div>

        {/* Project Cards Grid matching Stitch */}
        {visibleProjects.length === 0 ? (
          <div className="p-12 text-center rounded-[24px] bg-white border border-[#E8E5DF] shadow-xs">
            <p className="text-[16px] font-semibold text-[#111318]">No matching projects found.</p>
            <p className="text-[13px] text-[#5A606D] mt-1">
              Try adjusting your search query or switching categories.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleProjects.map((project, idx) => {
              const isLiked = likedIds.has(project.id);
              const projectNumber = String(idx + 1).padStart(2, '0');

              return (
                <div
                  key={project.id}
                  className="flex flex-col rounded-[24px] bg-white border border-[#E8E5DF] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-lg transition-all duration-300 group cursor-pointer"
                  onClick={() => onSelectProject(project)}
                >
                  {/* Media Frame */}
                  <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#F5F3EF]">
                    {project.media_type === 'video' ? (
                      <div className="relative w-full h-full bg-black flex items-center justify-center">
                        <video
                          src={project.media_url}
                          muted
                          playsInline
                          preload="metadata"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                          <span className="w-11 h-11 rounded-full bg-white/90 text-[#111318] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </span>
                        </div>
                      </div>
                    ) : (
                      <img
                        alt={project.title}
                        src={project.media_url}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
                        }}
                      />
                    )}

                    {/* Top Left Project Number Tag */}
                    <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-[#E8E5DF] shadow-xs">
                      <span className="font-mono text-[11px] font-bold text-[#111318] uppercase">
                        Project {projectNumber}
                      </span>
                    </div>

                    {/* Top Right Like Button */}
                    <button
                      type="button"
                      onClick={(e) => onLikeProject(project.id, e)}
                      aria-label="Like project"
                      className="absolute top-3.5 right-3.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md border border-[#E8E5DF] shadow-xs hover:scale-105 transition-transform"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 transition-colors ${
                          isLiked ? 'fill-[#FF6900] text-[#FF6900]' : 'text-[#717684]'
                        }`}
                      />
                      <span className="font-mono text-[11px] font-bold text-[#111318]">
                        {(project.likes_count || 0) + (isLiked ? 1 : 0)}
                      </span>
                    </button>
                  </div>

                  {/* Project Content */}
                  <div className="p-6 flex flex-col justify-between flex-grow gap-5">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        {project.client_or_brand && (
                          <span className="font-mono text-[11px] font-bold text-[#FF6900] uppercase tracking-wider">
                            {project.client_or_brand}
                          </span>
                        )}
                        {project.client_or_brand && project.category && (
                          <span className="text-[#D1CBC1]">•</span>
                        )}
                        <span className="text-[12px] text-[#717684] capitalize">
                          {project.category}
                        </span>
                      </div>

                      <h3 className="text-[19px] sm:text-[20px] font-bold text-[#111318] group-hover:text-[#FF6900] transition-colors duration-150 leading-snug">
                        {project.title}
                      </h3>

                      <p className="text-[14px] text-[#5A606D] leading-relaxed line-clamp-2">
                        {project.description}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 pt-2">
                      {/* Tags */}
                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {project.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2.5 py-0.5 rounded-full bg-[#FAF8F5] border border-[#EAE6DF] font-mono text-[11px] text-[#717684]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* View Practice Details Button */}
                      <button
                        type="button"
                        onClick={() => onSelectProject(project)}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#111318] text-white hover:bg-[#232730] font-semibold text-[13px] transition-colors shadow-xs"
                      >
                        <Eye className="w-4 h-4 text-[#FF6900]" />
                        <span>View Practice Details</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load More Button if over 9 items */}
        {isDefaultAllView && orderedProjects.length > 9 && !showAll && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-[#E8E5DF] text-xs font-bold text-[#111318] hover:bg-[#F5F3EF] hover:border-[#DDD7CD] transition-all shadow-xs"
            >
              <span>Explore All Archive Works ({orderedProjects.length})</span>
              <ArrowDown className="w-4 h-4 text-[#FF6900]" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
