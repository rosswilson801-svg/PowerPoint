import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

const AdminLogin: React.FC<{ onLogin: () => void; onBack: () => void; onGuest?: () => void }> = ({ onLogin, onBack, onGuest }) => {
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
            const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
            if (authError) throw authError;
            onLogin();
        } catch (err: any) {
            setError(err.message || 'Invalid login credentials');
        } finally {
            setLoading(false);
        }
    };

    const handleGuest = () => {
        if (onGuest) onGuest();
        else window.location.href = '/dashboard/planner';
    };

    return (
        <div className="min-h-screen flex font-sans">
            {/* LEFT — Dark Navy Brand Panel (matches app sidebar) */}
            <div className="hidden md:flex md:w-5/12 lg:w-1/2 bg-[#0B132B] flex-col justify-between p-12 relative overflow-hidden">
                {/* Subtle decorative glow */}
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#4ECDC4]/5 blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#4ECDC4]/5 blur-[100px] pointer-events-none" />

                {/* Logo */}
                <div className="relative z-10">
                    <div className="flex items-center gap-2">
                        <span className="text-white font-black text-2xl tracking-tight">CLA</span>
                        <span className="text-[#4ECDC4] font-black text-2xl tracking-tight">RITY.</span>
                    </div>
                </div>

                {/* Hero text */}
                <div className="relative z-10 flex flex-col gap-6">
                    <div className="w-12 h-1 bg-[#4ECDC4] rounded-full" />
                    <h2 className="text-4xl lg:text-5xl font-black text-white leading-[1.1] tracking-tight">
                        Plan smarter.<br />
                        <span className="text-[#4ECDC4]">Teach better.</span>
                    </h2>
                    <p className="text-white/50 text-base font-medium leading-relaxed max-w-sm">
                        The complete curriculum planning platform for PSHE leads and pastoral teams.
                    </p>

                    {/* Feature pills */}
                    <div className="flex flex-col gap-3 mt-4">
                        {[
                            'Drag-and-drop curriculum scheduling',
                            'Regional content localisation',
                            'Live delivery monitoring',
                        ].map((feat) => (
                            <div key={feat} className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#4ECDC4] flex-shrink-0" />
                                <span className="text-white/60 text-sm font-medium">{feat}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom credit */}
                <div className="relative z-10">
                    <p className="text-white/20 text-xs font-bold uppercase tracking-widest">
                        Clarity PSHE Platform © 2026
                    </p>
                </div>
            </div>

            {/* RIGHT — Login Form */}
            <div className="w-full md:w-7/12 lg:w-1/2 bg-white flex items-center justify-center p-8 md:p-12 lg:p-16">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full max-w-md"
                >
                    {/* Mobile logo */}
                    <div className="md:hidden flex items-center gap-1 mb-8">
                        <span className="text-[#0B132B] font-black text-xl tracking-tight">CLA</span>
                        <span className="text-[#4ECDC4] font-black text-xl tracking-tight">RITY.</span>
                    </div>

                    <div className="mb-10">
                        <h1 className="text-3xl font-black text-[#0B132B] tracking-tight mb-2">
                            Welcome back
                        </h1>
                        <p className="text-[#0B132B]/50 font-medium text-sm">
                            Sign in to your account to continue planning.
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-xs font-black text-[#0B132B] uppercase tracking-widest mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0B132B]/30" size={18} />
                                <input
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="teacher@school.sch.uk"
                                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#F8FAFC] border border-[#0B132B]/10 text-[#0B132B] font-medium text-sm placeholder:text-[#0B132B]/30 focus:bg-white focus:border-[#4ECDC4] focus:ring-4 focus:ring-[#4ECDC4]/10 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-black text-[#0B132B] uppercase tracking-widest mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0B132B]/30" size={18} />
                                <input
                                    required
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-[#F8FAFC] border border-[#0B132B]/10 text-[#0B132B] font-medium text-sm placeholder:text-[#0B132B]/30 focus:bg-white focus:border-[#4ECDC4] focus:ring-4 focus:ring-[#4ECDC4]/10 outline-none transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0B132B]/30 hover:text-[#0B132B] transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-rose-50 text-rose-600 px-4 py-3 rounded-xl text-sm font-bold border border-rose-100"
                                >
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Sign In button */}
                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full py-4 bg-[#0B132B] hover:bg-[#1a2744] text-white rounded-xl font-black text-sm uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-[#0B132B]/20"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : (
                                <>Sign In <ArrowRight size={16} /></>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-8">
                        <div className="flex-1 h-px bg-[#0B132B]/10" />
                        <span className="text-[9px] font-black text-[#0B132B]/30 uppercase tracking-widest">or</span>
                        <div className="flex-1 h-px bg-[#0B132B]/10" />
                    </div>

                    {/* Secondary actions */}
                    <div className="flex flex-col gap-3">
                        <Link
                            to="/onboarding"
                            className="w-full py-3.5 bg-[#F8FAFC] border border-[#0B132B]/10 hover:border-[#4ECDC4] hover:bg-[#4ECDC4]/5 text-[#0B132B] rounded-xl font-bold text-sm text-center transition-all duration-200 flex items-center justify-center gap-2 group"
                        >
                            Set up a new school account
                            <ArrowRight size={16} className="text-[#0B132B]/40 group-hover:text-[#4ECDC4] group-hover:translate-x-0.5 transition-all" />
                        </Link>

                        <button
                            onClick={handleGuest}
                            className="w-full py-3.5 bg-transparent border border-[#0B132B]/10 hover:border-[#0B132B]/30 text-[#0B132B]/50 hover:text-[#0B132B] rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 group"
                        >
                            Continue as Guest
                            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-all" />
                        </button>
                    </div>

                    <div className="mt-10">
                        <button
                            onClick={onBack}
                            className="text-xs font-bold text-[#0B132B]/30 hover:text-[#0B132B] transition-colors uppercase tracking-widest"
                        >
                            ← Return to Website
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminLogin;
