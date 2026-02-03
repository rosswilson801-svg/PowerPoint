import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Calendar, User, Clock } from 'lucide-react';

const BlogPost: React.FC = () => {
    const { slug } = useParams();
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            const { data, error } = await supabase
                .from('blog_posts')
                .select('*')
                .eq('slug', slug)
                .single();

            if (data) setPost(data);
            setLoading(false);
        };
        fetchPost();
        window.scrollTo(0, 0);
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-brand-bg flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-brand-accent/20 border-t-brand-accent rounded-full animate-spin" />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-4xl font-black text-brand-primary mb-6 font-display">Post not found.</h1>
                <Link to="/blog" className="text-brand-accent font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                    <ArrowLeft size={16} /> Back to Journal
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-bg pb-24">
            {/* Article Header */}
            <div className="pt-40 pb-24 px-6 bg-white border-b border-brand-primary/5">
                <div className="max-w-4xl mx-auto">
                    <Link to="/blog" className="inline-flex items-center gap-2 text-brand-accent font-bold uppercase tracking-widest text-[10px] mb-12 hover:gap-3 transition-all">
                        <ArrowLeft size={16} /> Back to Journal
                    </Link>
                    <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest text-slate-400 mb-8">
                        <span className="px-4 py-1.5 bg-brand-accent/10 text-brand-accent rounded-full">{post.category}</span>
                        <span className="flex items-center gap-1.5 border-l border-slate-200 pl-4">
                            <Calendar size={14} />
                            {new Date(post.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-brand-primary tracking-tighter font-display leading-[1.1] mb-10">
                        {post.title}
                    </h1>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center text-white font-black text-lg">
                                {post.author[0]}
                            </div>
                            <div className="text-left">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Author</p>
                                <p className="font-bold text-brand-primary">{post.author}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero Image */}
            {post.image_url && (
                <div className="max-w-6xl mx-auto -mt-12 px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-[3rem] overflow-hidden shadow-2xl h-[400px] md:h-[600px]"
                    >
                        <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
                    </motion.div>
                </div>
            )}

            {/* Article Content */}
            <div className="max-w-4xl mx-auto px-6 mt-20">
                <div className="prose prose-xl prose-slate max-w-none">
                    {post.content.split('\n').map((paragraph: string, i: number) => (
                        paragraph.trim() && (
                            <p key={i} className="text-xl text-brand-secondary leading-relaxed font-medium mb-8">
                                {paragraph}
                            </p>
                        )
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogPost;
