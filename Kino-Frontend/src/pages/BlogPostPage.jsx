import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BLOG_POSTS } from './BlogPage';
import { ArrowLeft, Calendar, Clock, Share2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../utils/api';

export const BlogPostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api.get(`/posts/${slug}`)
      .then(res => {
        if (active && res) {
          setPost({
            ...res,
            date: res.published_at ? new Date(res.published_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) : new Date(res.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            readTime: res.read_time || '5 min read',
            image: res.image_url || 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=600&q=80'
          });
          setLoading(false);
        }
      })
      .catch(err => {
        console.error("Failed to load blog post:", err);
        // Local fallback
        const local = BLOG_POSTS.find((p) => p.slug === slug);
        if (local) setPost(local);
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [slug]);

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Article link copied to clipboard.');
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 text-center container">
        <p className="text-text-muted text-xs">Loading lookbook details...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-32 pb-20 text-center container">
        <h2 className="font-editorial text-3xl font-bold">Log Entry Not Found</h2>
        <p className="text-text-muted mt-2">The requested journal article could not be found.</p>
        <button onClick={() => navigate('/blog')} className="btn-gold mt-6">
          Return to Journal
        </button>
      </div>
    );
  }

  // Parse paragraphs dynamically
  const paragraphs = post.body ? post.body.split('\n\n') : [];
  const leadParagraph = paragraphs[0] || '';
  const restParagraphs = paragraphs.slice(1);

  return (
    <div className="pt-28 pb-20 bg-white min-h-screen select-none">
      <div className="container max-w-3xl">
        
        {/* Back Link */}
        <Link
          to="/blog"
          className="text-xs uppercase tracking-wider font-semibold text-text-muted hover:text-text-dark flex items-center gap-1.5 mb-8"
        >
          <ArrowLeft size={12} /> Back to Journal
        </Link>

        {/* Post Meta */}
        <div className="flex items-center gap-6 text-[0.65rem] text-text-muted uppercase tracking-widest font-bold mb-4 font-price-label">
          <span className="flex items-center gap-1.5"><Calendar size={12} /> {post.date}</span>
          <span className="flex items-center gap-1.5"><Clock size={12} /> {post.readTime}</span>
        </div>

        {/* Title */}
        <h1 className="font-editorial text-4xl md:text-5xl font-medium text-text-dark leading-tight tracking-wide mb-6">
          {post.title}
        </h1>

        {/* Sharing Row */}
        <div className="flex items-center justify-between border-t border-b border-black/5 py-4 mb-8">
          <span className="text-xs text-text-muted">By Kino Studio Directors</span>
          <button 
            onClick={handleShareClick}
            className="text-xs text-text-muted hover:text-accent-gold flex items-center gap-1.5 font-bold uppercase tracking-wider"
          >
            <Share2 size={12} /> Share Log
          </button>
        </div>

        {/* Cover Image */}
        <div className="w-full aspect-video rounded-sm overflow-hidden bg-bg-light mb-8">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>

        {/* Paragraphs content */}
        <div className="flex flex-col gap-6 text-sm text-text-muted leading-relaxed font-light mt-8">
          {leadParagraph.startsWith('"') ? (
            <p className="font-editorial text-lg italic text-text-dark leading-relaxed font-normal">
              {leadParagraph}
            </p>
          ) : (
            <p>{leadParagraph}</p>
          )}
          {restParagraphs.map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>

      </div>
    </div>
  );
};
export default BlogPostPage;
