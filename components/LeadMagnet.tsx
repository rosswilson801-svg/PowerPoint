import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, CheckCircle, Mail, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

const LeadMagnet: React.FC = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const { error } = await supabase
                .from('lead_magnet_submissions')
                .insert([{ full_name: name, email }]);

            if (error) throw error;

            setStatus('success');
        } catch (error) {
            console.error('Error saving lead:', error);
            setStatus('error');
        }
    };

    return (
        <div className="bg-brand-primary rounded-[3rem] p-8 md:p-16 text-white overflow-hidden relative group">
            {/* Decorative background pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/20 blur-[100px] rounded-full -mr-32 -mt-32 transition-all duration-700 group-hover:bg-brand-accent/40" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-accent/10 blur-[80px] rounded-full -ml-24 -mb-24" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
                <div className="flex-1 text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-brand-accent mb-8">
                        <Download size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Free Resource</span>
                    </div>
                    <h3 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter font-display leading-[0.9]">
                        Get a Sample <br />
                        <span className="text-brand-accent text-glow">PSHE Lesson.</span>
                    </h3>
                    <p className="text-xl text-slate-400 font-medium mb-0 leading-relaxed max-w-lg">
                        Experience our premium regional content firsthand. We'll send a complete sample presentation directly to your inbox.
                    </p>
                </div>

                <div className="w-full lg:w-[450px]">
                    <AnimatePresence mode="wait">
                        {status !== 'success' ? (
                            <motion.form
                                key="lead-form"
                                initial={{ opacity: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                onSubmit={handleSubmit}
                                className="bg-white/5 backdrop-blur-md p-8 md:p-10 rounded-[2.5rem] border border-white/10 shadow-2xl space-y-6"
                            >
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 ml-1 text-left">Full Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Alex Rivers"
                                        className="w-full px-6 py-4 rounded-2xl border border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-all duration-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 ml-1 text-left">Email Address</label>
                                    <input
                                        required
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="alex@school.com"
                                        className="w-full px-6 py-4 rounded-2xl border border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-all duration-300"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full py-6 bg-brand-accent text-white rounded-full font-black uppercase tracking-widest text-[13px] shadow-xl hover:bg-brand-accent/90 transition-all duration-300 flex items-center justify-center gap-3 group/btn disabled:opacity-50"
                                >
                                    {status === 'loading' ? (
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Send My Sample
                                            <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
                                        </>
                                    )}
                                </button>

                                {status === 'error' && (
                                    <p className="text-red-400 text-xs font-bold text-center animate-shake">Something went wrong. Please try again.</p>
                                )}
                            </motion.form>
                        ) : (
                            <motion.div
                                key="lead-success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white/5 backdrop-blur-md p-12 rounded-[2.5rem] border border-white/10 shadow-2xl text-center"
                            >
                                <div className="w-20 h-20 bg-brand-accent rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-brand-accent/40">
                                    <Mail size={32} className="text-white" />
                                </div>
                                <h4 className="text-3xl font-black mb-4 font-display">Inbound!</h4>
                                <p className="text-slate-400 font-medium leading-relaxed">
                                    Thanks {name.split(' ')[0]}! Check your inbox. We've just sent your sample PSHE presentation.
                                </p>
                                <button
                                    onClick={() => setStatus('idle')}
                                    className="mt-8 text-brand-accent text-xs font-black uppercase tracking-widest hover:text-white transition-colors"
                                >
                                    Request another link
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default LeadMagnet;
