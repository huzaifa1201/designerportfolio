import React, { useState, useEffect } from 'react';
import { X, Heart, Eye, MessageSquare, Send, Star, Film, Image as ImageIcon, Check } from 'lucide-react';
import { collection, doc, getDocs, increment, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Project, ProjectComment } from '../types';

interface ProjectLightboxProps {
  project: Project | null;
  onClose: () => void;
  onLike: (id: string | number) => void;
  isLiked: boolean;
  onAddComment: (
    projectId: string | number,
    author: string,
    comment: string,
    rating: number
  ) => Promise<void>;
}

export const ProjectLightbox: React.FC<ProjectLightboxProps> = ({
  project,
  onClose,
  onLike,
  isLiked,
  onAddComment,
}) => {
  const [authorName, setAuthorName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [comments, setComments] = useState<ProjectComment[]>([]);
  const [commentSuccess, setCommentSuccess] = useState(false);

  const loadComments = async (projectId: string | number) => {
    try {
      const snap = await getDocs(collection(db, 'projects', String(projectId), 'comments'));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as ProjectComment[];
      list.sort(
        (a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
      );
      setComments(list);
      return;
    } catch (e) {
      console.warn('Firestore comments read fallback:', e);
    }

    if (typeof projectId === 'number' || /^\d+$/.test(String(projectId))) {
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.comments) setComments(data.comments);
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    if (project) {
      setComments(project.comments || []);
      loadComments(project.id);

      updateDoc(doc(db, 'projects', String(project.id)), { views_count: increment(1) }).catch(
        () => {
          if (typeof project.id === 'number' || /^\d+$/.test(String(project.id))) {
            fetch(`/api/projects/${project.id}/views`, { method: 'POST' }).catch(console.error);
          }
        }
      );
    }
  }, [project]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !commentText.trim()) return;

    setSubmitting(true);
    try {
      await onAddComment(project.id, authorName.trim(), commentText.trim(), rating);
      setCommentSuccess(true);
      await loadComments(project.id);
      setCommentText('');
      setAuthorName('');
      setTimeout(() => setCommentSuccess(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const isVideo = project.media_type === 'video';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#111318]/60 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-[28px] border border-[#E8E5DF] bg-white text-[#111318] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#EAE6DF] px-6 py-4 bg-[#FAF8F5]">
          <div className="flex items-center gap-2.5 text-xs text-[#5A606D]">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white border border-[#E8E5DF] text-[#FF6900] shadow-xs">
              {isVideo ? <Film className="h-3.5 w-3.5" /> : <ImageIcon className="h-3.5 w-3.5" />}
            </span>
            <span className="font-bold text-[#111318] text-sm">{project.client_or_brand}</span>
            <span aria-hidden="true" className="text-[#D1CBC1]">
              /
            </span>
            <span className="capitalize text-[#717684]">{project.category}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => onLike(project.id)}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                isLiked
                  ? 'bg-[#FF6900] text-white shadow-xs'
                  : 'bg-white border border-[#E8E5DF] text-[#111318] hover:bg-[#F5F3EF]'
              }`}
            >
              <Heart className={`h-3.5 w-3.5 ${isLiked ? 'fill-white text-white' : 'text-[#FF6900]'}`} />
              <span className="tabular-nums font-mono font-bold">{project.likes_count}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="rounded-full p-2 text-[#717684] hover:bg-[#F5F3EF] hover:text-[#111318] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Media Presentation Pane */}
            <div className="lg:col-span-7 bg-[#FAF8F5] flex items-center justify-center p-6 min-h-[340px] max-h-[620px] overflow-hidden border-b lg:border-b-0 lg:border-r border-[#EAE6DF]">
              {isVideo ? (
                <video
                  src={project.media_url}
                  controls
                  autoPlay
                  playsInline
                  className="max-h-[560px] w-auto max-w-full rounded-2xl object-contain shadow-md"
                />
              ) : (
                <img
                  src={project.media_url}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="max-h-[560px] w-auto max-w-full rounded-2xl object-contain shadow-md"
                />
              )}
            </div>

            {/* Project Details Column */}
            <div className="lg:col-span-5 p-6 flex flex-col justify-between bg-white">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#111318] leading-snug">
                  {project.title}
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-[#5A606D] leading-relaxed">
                  {project.description}
                </p>

                <div className="mt-5 pt-4 border-t border-[#F0ECE5]">
                  <span className="text-[11px] font-bold text-[#FF6900] uppercase tracking-wider block mb-2 font-mono">
                    Tools &amp; Scope
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#111318]">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-[#FAF8F5] border border-[#E8E5DF] px-2.5 py-1 text-[11px] font-medium font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-4 text-xs border-t border-[#F0ECE5] pt-3 text-[#5A606D]">
                  <span className="flex items-center gap-1 tabular-nums font-semibold text-[#111318]">
                    <Heart className="h-3.5 w-3.5 fill-[#FF6900] text-[#FF6900]" />{' '}
                    {project.likes_count} Likes
                  </span>
                  <span className="flex items-center gap-1 tabular-nums font-medium">
                    <Eye className="h-3.5 w-3.5 text-[#FF6900]" /> {project.views_count} Views
                  </span>
                  <span className="flex items-center gap-1 tabular-nums font-medium">
                    <MessageSquare className="h-3.5 w-3.5 text-[#FF6900]" /> {comments.length} Notes
                  </span>
                </div>
              </div>

              {/* Comments & Interactive Feedback */}
              <div className="mt-6 pt-5 border-t border-[#F0ECE5]">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#FF6900] mb-3 font-mono">
                  Client &amp; Peer Notes
                </h4>

                <div className="max-h-40 overflow-y-auto space-y-2 pr-1 mb-4">
                  {comments.length === 0 ? (
                    <p className="text-xs text-[#717684] italic py-2">
                      No notes posted yet. Leave an endorsement below.
                    </p>
                  ) : (
                    comments.map((c) => (
                      <div
                        key={c.id}
                        className="rounded-xl bg-[#FAF8F5] p-3 border border-[#EAE6DF] text-xs"
                      >
                        <div className="flex items-center justify-between text-[#717684] mb-1">
                          <span className="font-bold text-[#111318]">
                            {c.authorName || c.author_name || 'Visitor'}
                          </span>
                          <div className="flex items-center text-[#FF6900]">
                            {Array.from({ length: c.rating }).map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-[#5A606D]">{c.comment}</p>
                      </div>
                    ))
                  )}
                </div>

                {commentSuccess ? (
                  <div className="rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] p-2.5 text-center text-xs text-[#065F46] font-semibold flex items-center justify-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-[#10B981]" /> Note saved successfully!
                  </div>
                ) : (
                  <form onSubmit={handleSubmitComment} className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Your Name / Organization"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        required
                        className="flex-1 rounded-xl border border-[#DDD7CD] bg-[#FAF8F5] px-3 py-2 text-xs text-[#111318] placeholder-[#8A8F9D] focus:border-[#FF6900] focus:bg-white focus:outline-none"
                      />
                      <select
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        aria-label="Rating"
                        className="rounded-xl border border-[#DDD7CD] bg-[#FAF8F5] px-2.5 py-2 text-xs text-[#111318] font-semibold focus:outline-none cursor-pointer"
                      >
                        <option value="5">5 ★</option>
                        <option value="4">4 ★</option>
                        <option value="3">3 ★</option>
                      </select>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Share your thoughts on this design..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        required
                        className="flex-1 rounded-xl border border-[#DDD7CD] bg-[#FAF8F5] px-3 py-2 text-xs text-[#111318] placeholder-[#8A8F9D] focus:border-[#FF6900] focus:bg-white focus:outline-none"
                      />
                      <button
                        type="submit"
                        disabled={submitting}
                        className="rounded-xl bg-[#111318] text-white px-4 py-2 text-xs font-bold hover:bg-[#232730] disabled:opacity-50 transition-all shrink-0 flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <Send className="h-3 w-3 text-[#FF6900]" />
                        <span>Post</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
