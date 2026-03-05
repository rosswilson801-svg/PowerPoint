import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, Users, Settings, LogOut, ChevronRight, ChevronLeft, Menu } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const DashboardSidebar: React.FC = () => {
    const location = useLocation();
    const { profile } = useAuth();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        localStorage.clear();
        window.location.href = '/';
    };

    const allNavItems = [
        { label: 'Admin Insights', icon: <Users size={20} />, path: '/dashboard', coordinatorOnly: true },
        { label: 'Content Library', icon: <Settings size={20} />, path: '/dashboard/library', coordinatorOnly: true },
        { label: 'Teacher Planner', icon: <Layout size={20} />, path: '/dashboard/planner', coordinatorOnly: false },
    ];

    const navItems = allNavItems.filter(item => {
        if (item.coordinatorOnly && profile?.role === 'teacher') return false;
        return true;
    });

    return (
        <aside className="w-80 bg-[#0B132B] p-10 h-screen sticky top-0 border-r border-[#0B132B]/10 shadow-2xl z-20 flex-col justify-between hidden md:flex shrink-0">
            <div>
                <div className="text-3xl font-black italic tracking-tighter text-white uppercase font-display mb-16">
                    Cla<span className="text-brand-accent">rity.</span>
                </div>
                <nav className="space-y-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center justify-between p-4 rounded-2xl font-bold uppercase tracking-widest text-[11px] transition-all group ${location.pathname === item.path || (location.pathname === '/' && item.path === '/dashboard')
                                ? 'bg-white/10 text-white shadow-xl shadow-black/20'
                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                {item.icon}
                                <span>{item.label}</span>
                            </div>
                            {(location.pathname === item.path || (location.pathname === '/' && item.path === '/dashboard')) && (
                                <ChevronRight size={14} className="text-brand-accent" />
                            )}
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="space-y-6">
                <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-accent mb-2">Signed in as</p>
                    <p className="text-sm font-black text-white font-display uppercase tracking-tight">
                        {profile?.full_name || 'Teacher'}
                    </p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        {profile?.role === 'coordinator' ? 'Coordinator' : 'Teacher'}
                    </p>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 p-4 text-red-400 font-bold uppercase tracking-widest text-[11px] hover:text-red-300 transition-colors"
                >
                    <LogOut size={20} />
                    <span>SIGN OUT</span>
                </button>
            </div>
        </aside>
    );
};

export default DashboardSidebar;
