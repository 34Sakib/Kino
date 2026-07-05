import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BLOG_POSTS } from './BlogPage';
import { ArrowLeft, Calendar, Clock, Share2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const BlogPostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Find matching blog post
  const post = BLOG_POSTS.find((p) => p.slug === slug);

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

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Article link copied to clipboard.');
  };

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
          <p className="font-editorial text-lg italic text-text-dark leading-relaxed font-normal">
            "When we select materials, we prioritize silence. Visual weight doesn’t require complex shapes; it requires honest, raw structures that stand unburdened in the center of modern living rooms."
          </p>
          <p>
            Travertine stone and raw white oak timber are characterized by textures that cannot be engineered. The pits and organic irregularities in volcanic stones, or the dark concentric rings representing centuries of slow tree growth inside oak fibers, cannot be replicated. 
          </p>
          <p>
            When styling these items, visual directors suggest grouping contrasting surfaces together. Position a highly textured, hand-carved travertine vessel directly adjacent to a clean, smooth steel table or alongside soft linen drapery. The immediate contrast heightens the physical warmth of the room, creating an atmospheric focal point.
          </p>
          <p>
            We strive to retain raw material integrity by applying only thin coatings of natural oils and organic mineral glazes. This allows the stone and timber to age naturally, developing a subtle patina unique to the air, moisture, and daily operations of your residential sanctuary.
          </p>
        </div>

      </div>
    </div>
  );
};
export default BlogPostPage;
