import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react';

const Blog: React.FC = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            const { data, error } = await supabase
                .from('blog_posts')
                .select('*')
                .eq('is_published', true)
                .order('created_at', { ascending: false });

            if (data) setPosts(data);
            setLoading(false);
        };
        fetchPosts();
    }, []);

    return (
        <div className="min-h-screen bg-brand-bg pt-40 pb-24 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-24">
                    <span className="text-[12px] font-bold tracking-[0.3em] text-brand-accent uppercase mb-6 block">Insights & Updates</span>
                    <h1 className="text-6xl md:text-8xl font-black text-brand-primary tracking-tighter font-display mb-8">
                        The Clarity <span className="text-brand-accent">Journal.</span>
                    </h1>
                    <p className="text-2xl text-brand-secondary max-w-2xl mx-auto font-medium leading-relaxed">
                        Exploring the intersection of regional culture, mental health, and modern pastoral care.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-32">
                        <div className="w-12 h-12 border-4 border-brand-accent/20 border-t-brand-accent rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {posts.map((post) => (
                            <motion.article
                                key={post.id}
                                whileHover={{ y: -8 }}
                                className="bg-white rounded-[3rem] border border-brand-primary/5 shadow-xl shadow-brand-primary/5 overflow-hidden flex flex-col group"
                            >
                                {post.image_url && (
                                    <div className="aspect-[16/10] overflow-hidden">
                                        <img
                                            src={post.image_url}
                                            alt={post.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    </div>
                                )}
                                <div className="p-10 flex flex-col flex-1">
                                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-brand-accent mb-6">
                                        <span className="px-3 py-1 bg-brand-accent/10 rounded-full">{post.category || 'General'}</span>
                                        <span className="flex items-center gap-1 text-slate-400">
                                            <Calendar size={12} />
                                            {new Date(post.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-black text-brand-primary mb-4 font-display leading-tight group-hover:text-brand-accent transition-colors">
                                        {post.title}
                                    </h3>
                                    <p className="text-brand-secondary line-clamp-3 mb-8 flex-1 font-medium leading-relaxed">
                                        {post.excerpt}
                                    </p>
                                    <Link
                                        to={`/blog/${post.slug}`}
                                        className="flex items-center gap-2 text-[12px] font-black uppercase tracking-widest text-brand-primary group-hover:gap-4 transition-all"
                                    >
                                        Read Article
                                        <ArrowRight size={16} className="text-brand-accent" />
                                    </Link>
                                </div>
                            </motion.article>
                        ))}
                        {posts.length === 0 && (
                            <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border border-brand-primary/5">
                                <BookOpen size={48} className="mx-auto text-brand-primary/10 mb-6" />
                                <p className="text-brand-secondary font-bold uppercase tracking-widest text-sm italic">Journal entries arriving soon.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Blog;
