import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { api } from '../api/client';
import { Blog } from '../types';
import { Button } from '../components/ui/Button';
import { ArrowLeft, Clock, Calendar, Share2, Tag, ArrowRight, Sparkles } from 'lucide-react';

export const BlogPostDetailPage: React.FC = () => {
  const { selectedBlogSlug, navigate, openBookingModal, addToast } = useAppStore();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!selectedBlogSlug) {
      navigate('blog');
      return;
    }

    setIsLoading(true);
    api.blogs
      .getBySlug(selectedBlogSlug)
      .then((res) => {
        if (res.success) {
          setBlog(res.blog);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));

    api.blogs.getAll().then((res) => {
      if (res.success) {
        setRelatedBlogs(res.blogs.filter((b) => b.slug !== selectedBlogSlug).slice(0, 2));
      }
    });
  }, [selectedBlogSlug]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast({ type: 'info', title: 'Essay link copied to clipboard' });
    }
  };

  if (isLoading || !blog) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <span className="font-serif text-xl animate-pulse text-stone-500">
          Loading architectural essay...
        </span>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('blog')}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-stone-600 hover:text-stone-900 font-medium cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Journal
        </button>

        <button
          onClick={handleShare}
          className="p-2 text-stone-600 hover:text-stone-900 rounded-full hover:bg-stone-100 cursor-pointer"
          title="Share essay"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Article Header */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          {blog.tags.map((tag, i) => (
            <span
              key={i}
              className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 font-semibold"
            >
              {tag}
            </span>
          ))}
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-stone-900 font-light tracking-tight leading-[1.15]">
          {blog.title}
        </h1>

        <p className="text-lg text-stone-600 font-light leading-relaxed">
          {blog.excerpt}
        </p>

        {/* Author Card */}
        <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={blog.author.avatar}
              alt={blog.author.name}
              className="w-11 h-11 rounded-full object-cover border border-amber-900/30"
            />
            <div>
              <h4 className="text-sm font-semibold text-stone-900">{blog.author.name}</h4>
              <p className="text-xs text-stone-500 font-mono">{blog.author.role}</p>
            </div>
          </div>

          <div className="text-xs text-stone-400 font-mono text-right">
            <p>{blog.publishedDate}</p>
            <p>{blog.readTimeMinutes} min reading time</p>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      <div className="aspect-[16/9] overflow-hidden rounded-2xl bg-stone-100 border border-stone-200 shadow-md">
        <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
      </div>

      {/* Formatted Content */}
      <div className="prose prose-stone max-w-none space-y-6 text-stone-700 text-base leading-relaxed font-light">
        {blog.content.split('\n\n').map((paragraph, index) => {
          if (paragraph.startsWith('## ')) {
            return (
              <h2 key={index} className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal mt-10 mb-4">
                {paragraph.replace('## ', '')}
              </h2>
            );
          }
          if (paragraph.startsWith('> ')) {
            return (
              <blockquote
                key={index}
                className="font-serif text-xl italic text-stone-900 border-l-2 border-amber-800/80 pl-6 my-8"
              >
                {paragraph.replace('> ', '')}
              </blockquote>
            );
          }
          return <p key={index}>{paragraph}</p>;
        })}
      </div>

      {/* Studio Banner */}
      <div className="p-8 rounded-2xl bg-stone-900 text-stone-100 flex flex-col sm:flex-row items-center justify-between gap-6 border border-stone-800">
        <div className="space-y-2">
          <h3 className="font-serif text-2xl font-light text-white">Apply These Spatial Principles</h3>
          <p className="text-xs text-stone-300 font-light">
            Book an architectural consultation with Eleanor Vance and our senior studio team.
          </p>
        </div>
        <Button
          variant="luxury"
          size="md"
          onClick={() => openBookingModal()}
          className="uppercase text-xs tracking-wider shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" /> Book Consultation
        </Button>
      </div>

      {/* Related Reading */}
      {relatedBlogs.length > 0 && (
        <div className="border-t border-stone-200 pt-12 space-y-6">
          <h3 className="font-serif text-2xl text-stone-900 font-light">Related Essays</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedBlogs.map((b) => (
              <div
                key={b.id}
                onClick={() => navigate('blog-detail', { blogSlug: b.slug })}
                className="group cursor-pointer p-6 rounded-xl border border-stone-200 bg-white hover:border-stone-400 transition-all space-y-2"
              >
                <span className="text-[10px] font-mono text-stone-400 uppercase">{b.publishedDate}</span>
                <h4 className="font-serif text-lg text-stone-900 group-hover:text-amber-900 transition-colors font-medium">
                  {b.title}
                </h4>
                <p className="text-xs text-stone-600 line-clamp-2 font-light">{b.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};
