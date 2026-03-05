import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const ResetPassword: React.FC = () => {
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [done, setDone] = useState(false);
    const [sessionReady, setSessionReady] = useState(false);

    // Supabase sends the recovery token in the URL hash.
    // onAuthStateChange picks it up automatically and creates a session.
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'PASSWORD_RECOVERY') {
                setSessionReady(true);
            }
        });
        return () => subscription.unsubscribe();
    }, []);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirm) {
            setError("Passwords don't match");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }
        setLoading(true);
        setError(null);
        const { error: updateError } = await supabase.auth.updateUser({ password });
        setLoading(false);
        if (updateError) {
            setError(updateError.message);
        } else {
            setDone(true);
            setTimeout(() => { window.location.href = '/dashboard/planner'; }, 2500);
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
                        {done ? <CheckCircle2 size={32} /> : <Lock size={32} />}
                    </div>
                    <h1 className="text-4xl font-black text-brand-primary tracking-tighter font-display uppercase">
                        {done ? 'Password Updated.' : 'New Password.'}
                    </h1>
                    <p className="text-brand-secondary font-medium mt-3">
                        {done
                            ? 'Redirecting you to the planner...'
                            : sessionReady
                                ? 'Choose a new password for your account.'
                                : 'Verifying your reset link...'}
                    </p>
                </div>

                {!done && sessionReady && (
                    <form onSubmit={handleReset} className="bg-white p-10 rounded-[3rem] border border-brand-primary/5 shadow-2xl space-y-8">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-brand-secondary mb-3 ml-1">New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        required
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="min. 6 characters"
                                        className="w-full pl-16 pr-14 py-5 rounded-2xl border border-brand-primary/5 bg-brand-bg text-brand-primary font-bold placeholder:text-slate-400 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-all"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-accent transition-colors">
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-brand-secondary mb-3 ml-1">Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        required
                                        type={showPassword ? 'text' : 'password'}
                                        value={confirm}
                                        onChange={(e) => setConfirm(e.target.value)}
                                        placeholder="repeat password"
                                        className="w-full pl-16 pr-6 py-5 rounded-2xl border border-brand-primary/5 bg-brand-bg text-brand-primary font-bold placeholder:text-slate-400 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold text-center border border-red-100">
                                {error}
                            </div>
                        )}

                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full py-6 bg-brand-primary text-white rounded-full font-black uppercase tracking-widest text-[13px] shadow-xl hover:bg-brand-accent transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Set New Password'}
                        </button>
                    </form>
                )}

                {!sessionReady && !done && (
                    <div className="flex items-center justify-center gap-3 text-brand-secondary">
                        <Loader2 className="animate-spin" size={20} />
                        <span className="text-sm font-bold">Verifying link...</span>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default ResetPassword;
