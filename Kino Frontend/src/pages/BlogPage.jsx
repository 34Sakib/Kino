import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export const BLOG_POSTS = [
  {
    slug: 'wabi-sabi-sanctuary',
    title: 'The Wabi-Sabi Sanctuary: Styling Raw Travertine',
    excerpt: 'Exploring the natural cracks, visual depth, and raw weight of Italian volcanic stone within modern, glass-paneled architectural configurations.',
    date: 'June 20, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=600&q=80'
  },
  {
    slug: 'sustainable-oak-joinery',
    title: 'Sustainable Oak Joinery: From Tree to Atelier',
    excerpt: 'Trace the lineage of our FSC-certified white oak furniture pieces, hand-machined and finished in Danish family workshops.',
    date: 'May 15, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=600&q=80'
  },
  {
    slug: 'art-of-ambient-lighting',
    title: 'The Art of Ambient Lighting: Fluted Terracotta Drops',
    excerpt: 'How directional downward light alters the textures of raw surfaces. A guide to designing evening sanctuaries using wheel-thrown pendants.',
    date: 'April 28, 2026',
    readTime: '3 min read',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80'
  }
];

export const BlogPage = () => {
  return (
    <div className="pt-28 pb-20 bg-white min-h-screen select-none">
      <div className="container">
        
        {/* Title */}
        <div className="mb-12 text-center max-w-xl mx-auto flex flex-col gap-2">
          <span className="text-[0.65rem] uppercase tracking-[0.25em] font-bold text-accent-gold font-price-label">
            Lookbook Journal
          </span>
          <h1 className="font-editorial text-4xl md:text-5xl font-medium text-text-dark">
            Studio Diaries & Logs
          </h1>
          <div className="w-12 h-[1px] bg-accent-gold mt-4 mx-auto" />
        </div>

        {/* Blog Post List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {BLOG_POSTS.map((post) => (
            <article 
              key={post.slug} 
              className="flex flex-col border border-solid border-black/5 rounded-sm p-4 hover:shadow-lg transition-all duration-300 bg-white"
            >
              {/* Visual cover */}
              <Link to={`/blog/${post.slug}`} className="block aspect-video overflow-hidden rounded-sm bg-bg-light mb-4">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-103 transition-transform duration-500"
                />
              </Link>

              {/* Meta */}
              <div className="flex items-center justify-between text-[0.65rem] text-text-muted uppercase tracking-wider font-semibold mb-2">
                <span>{post.date}</span>
                <span>• {post.readTime}</span>
              </div>

              {/* Title */}
              <h3 className="font-editorial text-xl font-bold text-text-dark hover:text-accent-gold transition-colors line-clamp-2 leading-snug">
                <Link to={`/blog/${post.slug}`}>{post.title}</Link>
              </h3>

              {/* Excerpt */}
              <p className="text-xs text-text-muted leading-relaxed mt-2 line-clamp-3">
                {post.excerpt}
              </p>

              {/* Read Link */}
              <Link
                to={`/blog/${post.slug}`}
                className="text-[0.7rem] uppercase tracking-wider font-bold text-accent-gold hover:text-accent-gold-hover transition-colors flex items-center gap-1 mt-4"
              >
                Read Log <ArrowUpRight size={12} />
              </Link>
            </article>
          ))}
        </div>

      </div>
    </div>
  );
};
export default BlogPage;
