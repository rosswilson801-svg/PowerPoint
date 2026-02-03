import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const AdminLogin: React.FC<{ onLogin: () => void; onBack: () => void }> = ({ onLogin, onBack }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;
            onLogin();
        } catch (err: any) {
            setError(err.message || 'Invalid login credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-accent/5 via-transparent to-transparent">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-primary rounded-[2rem] text-white shadow-2xl mb-8">
                        <Lock size={32} />
                    </div>
                    <h1 className="text-4xl font-black text-brand-primary tracking-tighter font-display uppercase">Admin <span className="text-brand-accent">Access.</span></h1>
                    <p className="text-brand-secondary font-medium mt-4">Security portal for Clarity Curriculum Insights.</p>
                </div>

                <form onSubmit={handleLogin} className="bg-white p-10 md:p-12 rounded-[3rem] border border-brand-primary/5 shadow-2xl space-y-8">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-brand-secondary mb-3 ml-1">Admin Email</label>
                            <div className="relative">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@clarity.icu"
                                    className="w-full pl-16 pr-6 py-5 rounded-2xl border border-brand-primary/5 bg-brand-bg text-brand-primary font-bold placeholder:text-slate-400 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-brand-secondary mb-3 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    required
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    className="w-full pl-16 pr-14 py-5 rounded-2xl border border-brand-primary/5 bg-brand-bg text-brand-primary font-bold placeholder:text-slate-400 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-accent transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold text-center border border-red-100 animate-shake">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4 pt-2">
                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full py-6 bg-brand-primary text-white rounded-full font-black uppercase tracking-widest text-[13px] shadow-xl hover:bg-brand-accent transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Authorize Access'}
                        </button>

                        <button
                            type="button"
                            onClick={onBack}
                            className="w-full py-4 text-brand-secondary/60 hover:text-brand-primary text-[10px] font-black uppercase tracking-widest transition-colors"
                        >
                            Return Home
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
