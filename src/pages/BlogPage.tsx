import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { api } from '../api/client';
import { Blog } from '../types';
import { Search, ArrowRight, Clock, Tag } from 'lucide-react';

export const BlogPage: React.FC = () => {
  const { navigate } = useAppStore();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [activeTag, setActiveTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchBlogs = () => {
    setIsLoading(true);
    api.blogs
      .getAll({
        tag: activeTag !== 'all' ? activeTag : undefined,
        search: searchQuery.trim() || undefined,
      })
      .then((res) => {
        if (res.success) setBlogs(res.blogs);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchBlogs();
  }, [activeTag]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBlogs();
  };

  const tags = [
    { id: 'all', label: 'All Essays' },
    { id: 'Quiet Luxury', label: 'Quiet Luxury' },
    { id: 'Japandi', label: 'Japandi & Minimalist' },
    { id: 'Lighting', label: 'Lighting & Circadian' },
    { id: 'Kitchen Design', label: 'Culinary Architecture' },
    { id: 'Sustainability', label: 'Sustainable Sourcing' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="max-w-2xl space-y-4">
        <span className="text-xs uppercase tracking-[0.25em] text-stone-500 font-semibold">
          Studio Journal
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-stone-900 font-light tracking-tight">
          Essays on Light, Form & Living
        </h1>
        <p className="text-sm text-stone-600 font-light leading-relaxed">
          Critical explorations into material honesty, architectural wellbeing, and the craft of enduring spaces.
        </p>
      </div>

      {/* Filter Bar & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => setActiveTag(tag.id)}
              className={`text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer ${
                activeTag === tag.id
                  ? 'bg-stone-900 text-stone-100 font-semibold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearch} className="relative sm:w-64">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search journal..."
            className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-800"
          />
        </form>
      </div>

      {/* Blog Cards Grid */}
      {isLoading ? (
        <div className="h-64 flex items-center justify-center text-stone-400">
          <span className="animate-pulse font-serif text-lg">Gathering studio essays...</span>
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-16 bg-stone-50 rounded-2xl border border-stone-200">
          <p className="font-serif text-xl text-stone-700">No essays found for this topic</p>
          <button
            onClick={() => {
              setActiveTag('all');
              setSearchQuery('');
            }}
            className="mt-3 text-xs uppercase tracking-wider text-amber-900 underline font-semibold"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogs.map((blog) => (
            <article
              key={blog.id}
              onClick={() => navigate('blog-detail', { blogSlug: blog.slug })}
              className="group cursor-pointer flex flex-col justify-between space-y-4 bg-white rounded-xl overflow-hidden border border-stone-200/90 shadow-2xs hover:shadow-lg transition-all duration-300"
            >
              <div className="aspect-[16/10] overflow-hidden bg-stone-100 relative">
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-stone-400 font-mono">
                    <span>{blog.publishedDate}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {blog.readTimeMinutes} min read
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl font-light text-stone-900 group-hover:text-amber-900 transition-colors leading-snug">
                    {blog.title}
                  </h3>

                  <p className="text-xs text-stone-600 font-light line-clamp-3 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={blog.author.avatar}
                      alt={blog.author.name}
                      className="w-7 h-7 rounded-full object-cover border border-stone-200"
                    />
                    <span className="text-xs font-medium text-stone-800">{blog.author.name}</span>
                  </div>

                  <span className="text-xs uppercase tracking-wider font-semibold text-stone-900 group-hover:text-amber-900 flex items-center gap-1">
                    Read Essay <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
