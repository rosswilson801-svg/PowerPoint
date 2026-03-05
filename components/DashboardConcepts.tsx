import React, { useState } from 'react';
import { Users, Mail, Database, Settings, Layout, LogOut, ChevronRight, Menu, Search, Calendar, Briefcase, Building2, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- MOCK DATA FOR VISUALS ---
const MOCK_STATS = [
    { title: "Total Inquiries", value: "142", icon: Users, color: "text-brand-accent", bg: "bg-brand-accent/10" },
    { title: "Sample Requests", value: "89", icon: Mail, color: "text-emerald-500", bg: "bg-emerald-50" },
    { title: "Global Conversion", value: "62%", icon: Database, color: "text-indigo-400", bg: "bg-indigo-400/10" },
];

const MOCK_DATA = [
    { id: 1, name: "Sarah Chen", school: "HK Global Academy", role: "Pastoral Lead", date: "24 Oct 2025" },
    { id: 2, name: "James Aris", school: "British Int. School", role: "Head of Wellbeing", date: "24 Oct 2025" },
    { id: 3, name: "Elena Rodriguez", school: "Madrid Ed Group", role: "Director", date: "23 Oct 2025" },
    { id: 4, name: "David Kim", school: "Seoul Scholars", role: "Principal", date: "22 Oct 2025" },
];

// Reusable Sidebar Nav Content (Dark Theme Base)
const NavContent = () => (
    <div className="flex flex-col h-full justify-between">
        <div>
            <div className="text-3xl font-black italic tracking-tighter text-white uppercase font-display mb-16">
                Cla<span className="text-brand-accent">rity.</span>
            </div>
            <nav className="space-y-4">
                {[
                    { label: 'Admin Insights', icon: <Users size={20} />, active: true },
                    { label: 'Content Library', icon: <Settings size={20} />, active: false },
                    { label: 'Teacher Planner', icon: <Layout size={20} />, active: false },
                ].map((item, idx) => (
                    <button
                        key={idx}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold uppercase tracking-widest text-[11px] transition-all group ${item.active
                            ? 'bg-white/10 text-white shadow-xl shadow-black/20'
                            : 'text-slate-400 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <div className="flex items-center gap-4">
                            {item.icon}
                            <span>{item.label}</span>
                        </div>
                        {item.active && <ChevronRight size={14} className="text-brand-accent" />}
                    </button>
                ))}
            </nav>
        </div>

        <div className="space-y-6">
            <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10">
                <p className="text-[10px] font-black uppercase tracking-widest text-brand-accent mb-2">School ID</p>
                <p className="text-sm font-black text-white font-display uppercase tracking-tight">Clarity Global</p>
            </div>
            <button className="w-full flex items-center gap-4 p-4 text-red-400 font-bold uppercase tracking-widest text-[11px] hover:text-red-300 transition-colors">
                <LogOut size={20} />
                <span>SIGN OUT Admin</span>
            </button>
        </div>
    </div>
);

// Reusable Dashboard Main View
const DashboardContent = ({ titleColor = "text-brand-primary", bgClass = "bg-white", borderClass = "", headerClass = "" }) => (
    <div className={`flex flex-col h-full relative ${bgClass} ${borderClass}`}>
        <div className="flex justify-between items-end mb-12">
            <div>
                <h1 className={`text-5xl md:text-7xl font-black italic tracking-tighter font-display leading-[0.85] uppercase ${titleColor}`}>
                    <span className="block">Admin</span>
                    <span className="text-brand-accent block">Insights.</span>
                </h1>
                <p className={`text-[10px] font-black uppercase mt-4 tracking-[0.2em] ${headerClass ? headerClass : 'text-brand-secondary/40'}`}>
                    REAL-TIME ENGAGEMENT METRICS
                </p>
            </div>
            <button className="flex items-center gap-3 px-8 py-4 bg-brand-primary text-white rounded-full font-bold uppercase tracking-widest text-[12px] hover:bg-brand-accent transition-all shadow-lg shadow-brand-primary/20">
                <Search size={16} />
                Search Network
            </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-6 mb-12">
            {MOCK_STATS.map((stat, idx) => (
                <div key={idx} className={`p-8 rounded-[2rem] border ${titleColor === 'text-white' ? 'border-white/10 bg-white/5' : 'border-brand-primary/5 bg-white'} hover:border-brand-primary/10 transition-all flex items-center gap-6 group`}>
                    <div className={`p-4 rounded-xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-105 duration-300`}>
                        <stat.icon size={24} />
                    </div>
                    <div>
                        <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${titleColor === 'text-white' ? 'text-slate-400' : 'text-brand-secondary/40'}`}>{stat.title}</p>
                        <p className={`text-3xl font-black tracking-tighter ${titleColor}`}>{stat.value}</p>
                    </div>
                </div>
            ))}
        </div>

        {/* Table Area */}
        <div className={`flex-1 rounded-[3rem] p-8 border ${titleColor === 'text-white' ? 'border-white/10 bg-white/5' : 'border-brand-primary/5 bg-[#F8FAFC]'}`}>
            <h3 className={`text-[12px] font-black uppercase tracking-widest mb-8 ${titleColor}`}>Recent Submissions</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className={`border-b ${titleColor === 'text-white' ? 'border-white/10 text-slate-400' : 'border-brand-primary/10 text-brand-secondary/60'}`}>
                            <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em]">Contact</th>
                            <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em]">Institution</th>
                            <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em]">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y ${titleColor === 'text-white' ? 'divide-white/5' : 'divide-brand-primary/5'}`}>
                        {MOCK_DATA.map((row) => (
                            <tr key={row.id} className="group hover:bg-white/5 transition-colors">
                                <td className="py-6">
                                    <div className={`font-black uppercase font-display text-lg ${titleColor}`}>{row.name}</div>
                                    <div className={`text-sm flex items-center gap-2 mt-1 ${titleColor === 'text-white' ? 'text-slate-400' : 'text-brand-secondary/60'}`}>
                                        <Briefcase size={12} /> {row.role}
                                    </div>
                                </td>
                                <td className="py-6">
                                    <div className={`font-bold flex items-center gap-2 ${titleColor}`}>
                                        <Building2 size={16} className="text-brand-accent" />
                                        {row.school}
                                    </div>
                                </td>
                                <td className="py-6">
                                    <div className={`text-sm font-medium flex items-center gap-2 ${titleColor === 'text-white' ? 'text-slate-400' : 'text-brand-secondary/60'}`}>
                                        <Calendar size={14} /> {row.date}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);


const DashboardConcepts: React.FC = () => {
    const [activeLayout, setActiveLayout] = useState(1);

    return (
        <div className="min-h-screen bg-brand-bg font-sans relative overflow-hidden flex flex-col">
            {/* Header / Layout Switcher */}
            <div className="bg-white border-b border-brand-primary/10 p-6 flex items-center justify-between z-50 shadow-sm relative sticky top-0">
                <div>
                    <h2 className="text-xl font-black text-brand-primary uppercase font-display italic tracking-tight">Design Explorer</h2>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-brand-secondary">Reviewing Dashboard Layouts</p>
                </div>
                <div className="flex bg-brand-bg p-1.5 rounded-full border border-brand-primary/5">
                    {[1, 2, 3].map(num => (
                        <button
                            key={num}
                            onClick={() => setActiveLayout(num)}
                            className={`px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${activeLayout === num
                                ? 'bg-brand-primary text-white shadow-lg'
                                : 'text-brand-secondary hover:bg-brand-primary/5'
                                }`}
                        >
                            Layout V{num}
                        </button>
                    ))}
                </div>
                <button onClick={() => window.location.href = '/dashboard/planner'} className="text-[10px] font-black uppercase tracking-widest text-brand-accent hover:opacity-70 transition-all cursor-pointer">
                    Back to Planner &rarr;
                </button>
            </div>

            {/* Layout Viewport */}
            <div className="flex-1 relative bg-[#E2E8F0] overflow-y-auto">

                <AnimatePresence mode="wait">
                    {activeLayout === 1 && (
                        <motion.div
                            key="l1"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="min-h-full py-12 px-6 lg:px-12 flex relative"
                        >
                            {/* The Centered Modal Approach (Direct translation of Onboarding) */}
                            {/* Soft background blobs */}
                            <div className="absolute top-[-20%] right-[-10%] w-[80%] h-[80%] rounded-full bg-brand-accent/20 blur-[120px] mix-blend-multiply pointer-events-none z-0" />
                            <div className="absolute bottom-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-[#d6efe8] blur-[100px] mix-blend-multiply opacity-50 pointer-events-none z-0" />

                            <div className="relative z-10 w-full max-w-[1400px] mx-auto bg-white rounded-[3rem] shadow-2xl overflow-hidden flex min-h-[85vh] border border-white">
                                {/* Dark Left Panel */}
                                <div className="w-80 bg-[#0B132B] p-10 flex-shrink-0">
                                    <NavContent />
                                </div>
                                {/* Light Right Panel */}
                                <div className="flex-1 p-12 bg-white rounded-l-[3rem] -ml-8 border-l border-white/20 shadow-[-10px_0_30px_rgba(0,0,0,0.1)] relative z-20">
                                    <DashboardContent />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeLayout === 2 && (
                        <motion.div
                            key="l2"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="min-h-full flex bg-[#F8FAFC]"
                        >
                            {/* Full-Screen Edge-to-Edge Split */}
                            {/* Left fixed column */}
                            <div className="w-80 bg-[#0B132B] p-10 h-screen sticky top-0 border-r border-brand-primary/10 shadow-2xl z-20">
                                <NavContent />
                            </div>
                            {/* Right content taking rest of screen, slightly rounded inwards */}
                            <div className="flex-1 min-h-screen bg-white p-12 lg:p-16 relative">
                                {/* Subtle pattern/blur in bg just for the white side */}
                                <div className="absolute right-0 top-0 w-1/2 h-1/2 bg-brand-accent/5 rounded-full blur-[100px] pointer-events-none" />
                                <div className="max-w-6xl relative z-10">
                                    <DashboardContent />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeLayout === 3 && (
                        <motion.div
                            key="l3"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="min-h-[calc(100vh-80px)] p-6 bg-[#000516] relative flex overflow-hidden"
                        >
                            {/* Floating Islands on Dark Background (Inverted UI approach) */}
                            {/* Dark background lighting fx */}
                            <div className="absolute top-[-20%] left-[20%] w-[60%] h-[60%] rounded-full bg-brand-primary/40 blur-[150px] pointer-events-none" />
                            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-accent/20 blur-[120px] pointer-events-none" />

                            <div className="flex w-full max-w-[1600px] mx-auto gap-6 relative z-10">
                                {/* Floating Sidebar Panel */}
                                <div className="w-[320px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
                                    <NavContent />
                                </div>
                                {/* Floating Main Panel */}
                                <div className="flex-1 bg-[#0A1128]/80 backdrop-blur-xl border border-white/10 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
                                    <DashboardContent
                                        titleColor="text-white"
                                        bgClass="bg-transparent"
                                        borderClass="border-0"
                                        headerClass="text-brand-accent/80"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default DashboardConcepts;
