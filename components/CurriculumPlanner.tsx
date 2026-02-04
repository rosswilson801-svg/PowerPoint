import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    GripVertical,
    Plus,
    BookOpen,
    Clock,
    CheckCircle2,
    Download,
    LayoutGrid,
    Settings,
    Sparkles,
    ExternalLink,
    FileText,
    PlayCircle,
    Video,
    X,
    MessageSquare,
    Activity,
    AlertCircle,
    Globe
} from 'lucide-react';

const REGIONS = [
    { id: 'UK', name: 'United Kingdom', flag: '🇬🇧', statutoryTerm: 'UK Statutory', location: 'London/Manchester' },
    { id: 'HK', name: 'Hong Kong', flag: '🇭🇰', statutoryTerm: 'HK Statutory', location: 'Hong Kong' },
    { id: 'FR', name: 'France', flag: '🇫🇷', statutoryTerm: 'Éducation Nationale', location: 'Paris/Lyon' },
    { id: 'ES', name: 'Spain', flag: '🇪🇸', statutoryTerm: 'Ley de Educación', location: 'Madrid/Barcelona' },
];

const CLARITY_MODULES = [
    {
        id: '1',
        title: 'Understanding and coping with anxiety',
        category: 'Mental Health',
        color: 'bg-emerald-500',
        context: 'UK Statutory',
        variants: {
            'HK': { title: 'Managing Academic Pressure & Exam Stress', context: 'HK Statutory' },
            'FR': { title: 'Gérer l\'Anxiété et la Pression Scolaire', context: 'Éducation Nationale' },
            'ES': { title: 'Gestión de la Ansiedad y Exámenes', context: 'Ley de Educación' }
        }
    },
    { id: '2', title: 'Stress and relaxation', category: 'Mental Health', color: 'bg-blue-500', context: 'General' },
    {
        id: '3',
        title: 'Mental health and depression',
        category: 'Mental Health',
        color: 'bg-indigo-500',
        context: 'UK Statutory',
        variants: {
            'HK': { title: 'Youth Mental Health: Signs & Support', context: 'HK Statutory' },
            'FR': { title: 'Santé Mentale des Jeunes', context: 'Éducation Nationale' }
        }
    },
    { id: '4', title: 'Building resilience', category: 'Foundation', color: 'bg-rose-500', context: 'Global' },
    { id: '5', title: 'The science of happiness', category: 'Foundation', color: 'bg-cyan-500', context: 'Foundation' },
    {
        id: '6',
        title: 'What is peer pressure',
        category: 'Relationships',
        color: 'bg-violet-500',
        context: 'UK Statutory',
        variants: {
            'HK': { title: 'Navigating Social Hierarchies', context: 'HK Statutory' }
        }
    },
    { id: '7', title: 'Positivity', category: 'Foundation', color: 'bg-amber-500', context: 'Foundation' },
    { id: '8', title: 'Male body-image', category: 'Self-Image', color: 'bg-orange-500', context: 'Regional' },
    {
        id: '9',
        title: 'Online grooming and spotting the signs',
        category: 'Safety',
        color: 'bg-red-500',
        context: 'UK Statutory',
        variants: {
            'HK': { title: 'Digital Safety & Grooming Prevention', context: 'HK Statutory' }
        }
    },
    {
        id: '10',
        title: 'Cyber safety',
        category: 'Safety',
        color: 'bg-slate-500',
        context: 'Global',
        variants: {
            'HK': { title: 'Cyber Resilience & Data Privacy', context: 'HK Statutory' }
        }
    },
];

const getLocalizedContent = (module: any, regionId: string) => {
    if (!module) return null;
    if (module.variants && module.variants[regionId]) {
        return { ...module, ...module.variants[regionId] };
    }
    // Deep fallback for statutory content even if no variant exists
    if (module.context === 'UK Statutory') {
        const region = REGIONS.find(r => r.id === regionId);
        return {
            ...module,
            context: region ? region.statutoryTerm : module.context
        };
    }
    return module;
};

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const WEEKS = ['Term 1: Week 1', 'Term 1: Week 2', 'Term 1: Week 3', 'Term 1: Week 4'];
const YEAR_GROUPS = ['Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Sixth Form'];
const MONTHS = ['September', 'October', 'November', 'December'];

const TEACHERS = [
    { id: '1', name: 'Shirley Gibson', role: 'PSHE Coordinator', initials: 'SG', regionId: 'HK', allowedYears: ['Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Sixth Form'] },
    { id: '2', name: 'Sarah Miller', role: 'Year 7 Teacher', initials: 'SM', regionId: 'UK', allowedYears: ['Year 7'] },
    { id: '3', name: 'Mark Thompson', role: 'Year 8 Teacher', initials: 'MT', regionId: 'UK', allowedYears: ['Year 8'] },
];

const CurriculumPlanner: React.FC = () => {
    const [scheduledModules, setScheduledModules] = useState<Record<string, any>>({});
    const [activeWeek, setActiveWeek] = useState(0);
    const [activeMonth, setActiveMonth] = useState(0);
    const [activeTeacher, setActiveTeacher] = useState(TEACHERS[0]);
    const [activeYear, setActiveYear] = useState('Year 7');
    const [activeClass, setActiveClass] = useState('7A');
    const [activeRegion, setActiveRegion] = useState(REGIONS.find(r => r.id === activeTeacher.regionId) || REGIONS[0]);
    const [activeContext, setActiveContext] = useState('National Curriculum');
    const [psheDay, setPsheDay] = useState<string>('Wednesday');
    const [selectedExecution, setSelectedExecution] = useState<any>(null);
    const [viewMode, setViewMode] = useState<'daily' | 'week' | 'month' | 'pulse'>('daily');

    const handleSchedule = (day: string, moduleId: string, weekIndex?: number) => {
        const module = CLARITY_MODULES.find(m => m.id === moduleId);
        if (!module) return;
        const targetWeek = weekIndex !== undefined ? weekIndex : activeWeek;
        setScheduledModules(prev => ({
            ...prev,
            [`${activeYear}-${activeClass}-${activeMonth}-${targetWeek}-${day}`]: module
        }));
    };

    const applyStatutoryTemplate = () => {
        const newSchedule = { ...scheduledModules };
        WEEKS.forEach((_, wIndex) => {
            const module = CLARITY_MODULES[wIndex % CLARITY_MODULES.length];
            newSchedule[`${activeYear}-${activeClass}-${wIndex}-Monday`] = module;
        });
        setScheduledModules(newSchedule);
    };

    return (
        <div className="flex bg-[#F8FAFC] min-h-[85vh] rounded-[3rem] border border-brand-primary/5 shadow-2xl overflow-hidden font-sans border-t-8 border-t-brand-accent relative">
            {/* Sidebar: Content Library */}
            <div className="w-72 flex-shrink-0 bg-white border-r border-brand-primary/10 p-6 flex flex-col gap-6 shadow-sm">
                {/* Teacher Identity Dropdown */}
                <div className="relative group/teacher">
                    <div className="flex items-center gap-4 mb-2 p-5 bg-brand-bg rounded-[2rem] border border-brand-primary/10 shadow-sm hover:border-brand-accent/40 transition-all cursor-pointer">
                        <div className="w-12 h-12 rounded-2xl bg-brand-primary text-white flex items-center justify-center font-black text-xs shadow-lg flex-shrink-0">
                            {activeTeacher.initials}
                        </div>
                        <div className="flex-grow min-w-0">
                            <p className="text-[11px] font-black uppercase tracking-widest text-brand-primary truncate">{activeTeacher.name}</p>
                            <p className="text-[9px] font-bold text-brand-secondary/60 uppercase tracking-widest truncate">{activeTeacher.role}</p>
                        </div>
                    </div>

                    {/* Hover Dropdown Menu */}
                    <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-3xl shadow-2xl border border-brand-primary/5 p-3 opacity-0 group-hover/teacher:opacity-100 pointer-events-none group-hover/teacher:pointer-events-auto transition-all z-[60] transform translate-y-2 group-hover/teacher:translate-y-0">
                        <p className="text-[9px] font-black uppercase tracking-widest text-brand-secondary/40 px-4 py-2">Switch Profile</p>
                        {TEACHERS.map(teacher => (
                            <button
                                key={teacher.id}
                                onClick={() => {
                                    setActiveTeacher(teacher);
                                    setActiveRegion(REGIONS.find(r => r.id === teacher.regionId) || REGIONS[0]);
                                    if (!teacher.allowedYears.includes(activeYear)) {
                                        setActiveYear(teacher.allowedYears[0]);
                                    }
                                }}
                                className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all hover:bg-brand-bg text-left mb-1 last:mb-0
                                    ${activeTeacher.id === teacher.id ? 'bg-brand-bg border border-brand-primary/5' : ''}
                                `}
                            >
                                <div className="w-8 h-8 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center font-black text-[10px]">
                                    {teacher.initials}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary truncate">{teacher.name}</p>
                                    <p className="text-[8px] font-bold text-brand-secondary/40 uppercase tracking-widest truncate">{teacher.role}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Regional Control System */}
                <div className="flex flex-col gap-3">
                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-brand-secondary/40 px-2 flex items-center gap-2">
                        <Globe size={10} className="text-brand-accent" />
                        Global Context
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                        {REGIONS.map(region => (
                            <button
                                key={region.id}
                                onClick={() => setActiveRegion(region)}
                                className={`p-3 rounded-2xl border transition-all flex items-center gap-2 group ${activeRegion.id === region.id ? 'bg-brand-accent border-brand-accent shadow-lg shadow-brand-accent/20' : 'bg-brand-bg border-brand-primary/5 hover:border-brand-accent/30'}`}
                            >
                                <span className="text-sm">{region.flag}</span>
                                <span className={`text-[9px] font-black uppercase tracking-widest ${activeRegion.id === region.id ? 'text-white' : 'text-brand-primary'}`}>{region.id}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Scheduling Configuration */}
                <div className="flex flex-col gap-3">
                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-brand-secondary/40 px-2 flex items-center gap-2">
                        <Calendar size={10} className="text-brand-accent" />
                        Scheduling Logic
                    </span>
                    <div className="flex flex-col gap-2">
                        <div className="bg-brand-bg border border-brand-primary/5 p-4 rounded-3xl relative overflow-hidden group hover:border-brand-accent/30 transition-all">
                            <label className="text-[8px] font-bold text-brand-secondary/40 uppercase tracking-widest block mb-1">PSHE Lesson Day</label>
                            <select
                                value={psheDay}
                                onChange={(e) => setPsheDay(e.target.value)}
                                className="w-full bg-white border border-brand-primary/5 rounded-xl px-4 py-2 text-[10px] font-black text-brand-primary uppercase tracking-widest outline-none cursor-pointer focus:border-brand-accent transition-colors shadow-sm"
                            >
                                <option value="All Days">Full Week View</option>
                                {DAYS.map(day => <option key={day} value={day}>{day}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-brand-secondary">
                            Library
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className="text-[8px] font-bold text-brand-secondary/40 uppercase tracking-widest">Focus:</span>
                            <select
                                className="text-[9px] font-bold text-brand-accent bg-brand-accent/5 border border-brand-accent/10 px-3 py-1.5 rounded-full outline-none cursor-pointer"
                                value={activeClass}
                                onChange={(e) => setActiveClass(e.target.value)}
                            >
                                <option value="7A">Class 7A</option>
                                <option value="7B">Class 7B</option>
                                <option value="7C">Class 7C</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-4 max-h-[450px] overflow-y-auto pr-3 custom-scrollbar">
                        {CLARITY_MODULES.map((baseModule) => {
                            const module = getLocalizedContent(baseModule, activeRegion.id);
                            return (
                                <motion.div
                                    key={module.id}
                                    whileHover={{ x: 6, scale: 1.02 }}
                                    className="p-5 rounded-2xl bg-brand-bg border border-brand-primary/5 cursor-pointer group hover:border-brand-accent/30 transition-all shadow-sm active:scale-95"
                                    onClick={() => handleSchedule(psheDay === 'All Days' ? 'Monday' : psheDay, module.id)}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`w-1.5 h-12 rounded-full ${module.color} mt-1`} />
                                        <div className="flex-grow">
                                            <p className="text-[13px] font-black text-brand-primary leading-tight font-display uppercase tracking-tight mb-2">
                                                {module.title}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] font-bold text-brand-secondary/60 uppercase tracking-widest bg-white/50 px-2 py-0.5 rounded border border-brand-primary/5">
                                                    {module.category}
                                                </span>
                                                <span className="text-[8px] font-bold text-brand-accent uppercase bg-brand-accent/10 px-2 py-0.5 rounded-full">
                                                    {module.context}
                                                </span>
                                            </div>
                                        </div>
                                        <GripVertical size={16} className="text-brand-secondary opacity-5 group-hover:opacity-100 transition-opacity mt-1" />
                                    </div>
                                </motion.div>
                            ))}
                    </div>
                </div>

                <div className="mt-auto p-8 rounded-[2.5rem] bg-brand-primary text-white space-y-6 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-brand-accent/20 transition-all duration-700" />
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-brand-accent/20 rounded-2xl text-brand-accent">
                            <LayoutGrid size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Year Progress</p>
                            <p className="text-xl font-black font-display italic">62<span className="text-brand-accent">%</span> Complete</p>
                        </div>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "62%" }}
                            className="h-full bg-brand-accent shadow-[0_0_15px_rgba(3,105,161,0.5)]"
                        />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                        Statutory mapping for <span className="text-white font-black">{activeYear}</span> is on track.
                    </p>
                </div>
            </div>

            {/* Main View: Calendar/Grid */}
            <div className="flex-grow p-8 flex flex-col bg-[#FDFDFF] min-w-0">
                {/* Planner Header */}
                <div className="flex flex-col gap-10 mb-16">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-wrap items-center gap-2">
                            {YEAR_GROUPS.filter(year => activeTeacher.allowedYears.includes(year)).map(year => (
                                <button
                                    key={year}
                                    onClick={() => setActiveYear(year)}
                                    className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300
                    ${activeYear === year
                                            ? 'bg-brand-primary text-white shadow-xl translate-y-[-2px]'
                                            : 'bg-white text-brand-secondary hover:bg-brand-primary/5 hover:text-brand-primary border border-brand-primary/10 shadow-sm'}
                  `}
                                >
                                    {year}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="bg-white border border-brand-primary/5 p-1 rounded-2xl flex gap-1 shadow-sm">
                                <button
                                    onClick={() => setViewMode('daily')}
                                    className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === 'daily' ? 'bg-brand-primary text-white shadow-md' : 'text-brand-secondary hover:bg-brand-bg'}`}
                                >
                                    Daily
                                </button>
                                <button
                                    onClick={() => setViewMode('week')}
                                    className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === 'week' ? 'bg-brand-primary text-white shadow-md' : 'text-brand-secondary hover:bg-brand-bg'}`}
                                >
                                    Week
                                </button>
                                <button
                                    onClick={() => setViewMode('month')}
                                    className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === 'month' ? 'bg-brand-primary text-white shadow-md' : 'text-brand-secondary hover:bg-brand-bg'}`}
                                >
                                    Month
                                </button>
                                {activeTeacher.role === 'PSHE Coordinator' && (
                                    <button
                                        onClick={() => setViewMode('pulse')}
                                        className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === 'pulse' ? 'bg-brand-accent text-white shadow-md' : 'text-brand-secondary hover:bg-brand-bg'}`}
                                    >
                                        Pulse
                                    </button>
                                )}
                            </div>

                            <button
                                onClick={applyStatutoryTemplate}
                                className="flex items-center gap-3 px-8 py-3.5 bg-brand-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-accent transition-all group border border-brand-primary/10 active:scale-95 shadow-[0_0_20px_rgba(15,23,42,0.1)] hover:shadow-brand-accent/30"
                            >
                                <Sparkles size={16} className="text-brand-accent group-hover:rotate-12 transition-transform" />
                                Auto-Map Statutory
                            </button>

                            <button className="flex items-center gap-3 px-10 py-4 bg-brand-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-brand-accent transition-all duration-300 cursor-pointer active:scale-95">
                                <Download size={16} />
                                Export Map
                            </button>
                        </div>
                    </div>

                    <div className="flex items-end justify-between">
                        <div>
                            <h2 className="text-6xl md:text-8xl font-black text-brand-primary tracking-[-0.04em] font-display leading-[0.75] uppercase italic whitespace-nowrap">
                                {viewMode === 'pulse' ? 'Department' : viewMode === 'daily' ? 'The' : viewMode === 'week' ? 'The' : 'Academic'} <span className="text-brand-accent italic opacity-90">{viewMode === 'pulse' ? 'Pulse.' : viewMode === 'daily' ? 'Brief.' : viewMode === 'week' ? 'Journal.' : 'Roadmap.'}</span>
                            </h2>
                            {viewMode === 'daily' || viewMode === 'week' ? (
                                <div className="flex items-center gap-6 mt-8">
                                    <button
                                        onClick={() => setActiveWeek(prev => Math.max(0, prev - 1))}
                                        className="p-3 bg-white hover:bg-brand-bg rounded-2xl transition-all border border-brand-primary/10 cursor-pointer shadow-md hover:shadow-lg group"
                                    >
                                        <ChevronLeft size={24} className="text-brand-secondary group-hover:text-brand-primary" />
                                    </button>
                                    <div className="flex flex-col px-4 border-l-4 border-brand-accent">
                                        <span className="text-[12px] font-black uppercase tracking-[0.4em] text-brand-primary">
                                            {WEEKS[activeWeek]}
                                        </span>
                                        <span className="text-[9px] font-bold text-brand-secondary/40 uppercase tracking-[0.2em] mt-1">
                                            {viewMode === 'daily' ? `Focused ${psheDay} Brief` : 'Weekly Academic Journal'}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setActiveWeek(prev => Math.min(WEEKS.length - 1, prev + 1))}
                                        className="p-3 bg-white hover:bg-brand-bg rounded-2xl transition-all border border-brand-primary/5 cursor-pointer shadow-md hover:shadow-lg group"
                                    >
                                        <ChevronRight size={24} className="text-brand-secondary group-hover:text-brand-primary" />
                                    </button>
                                </div>
                            ) : viewMode === 'month' ? (
                                <div className="flex items-center gap-6 mt-8">
                                    <button
                                        onClick={() => setActiveMonth(prev => Math.max(0, prev - 1))}
                                        className="p-3 bg-white hover:bg-brand-bg rounded-2xl transition-all border border-brand-primary/5 cursor-pointer shadow-md hover:shadow-lg group"
                                    >
                                        <ChevronLeft size={24} className="text-brand-secondary group-hover:text-brand-primary" />
                                    </button>
                                    <div className="flex flex-col mt-0 border-l-4 border-brand-accent px-4">
                                        <span className="text-[12px] font-black uppercase tracking-[0.4em] text-brand-primary">
                                            {MONTHS[activeMonth]} 2026
                                        </span>
                                        <span className="text-[9px] font-bold text-brand-secondary/40 uppercase tracking-[0.2em] mt-1">
                                            Academic Roadmap Plan
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setActiveMonth(prev => Math.min(MONTHS.length - 1, prev + 1))}
                                        className="p-3 bg-white hover:bg-brand-bg rounded-2xl transition-all border border-brand-primary/5 cursor-pointer shadow-md hover:shadow-lg group"
                                    >
                                        <ChevronRight size={24} className="text-brand-secondary group-hover:text-brand-primary" />
                                    </button>
                                </div>
                            ) : (
                                <div className="mt-8 flex items-center gap-3">
                                    <span className="px-5 py-2 bg-brand-accent/10 text-brand-accent rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Live Monitoring</span>
                                    <span className="text-[9px] font-bold text-brand-secondary/40 uppercase tracking-widest">Real-time Delivery Metrics</span>
                                </div>
                            )}
                        </div>

                        <div className="text-right pb-2">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-secondary/40 mb-2">Live Insights</p>
                            <div className="flex items-center gap-2 justify-end">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary uppercase">Cloud Sync Active</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* The Scheduling Grid */}
                {viewMode === 'daily' ? (
                    <div className="flex-grow flex items-center justify-center mb-4">
                        <div className="w-full max-w-[1400px]">
                            {DAYS.filter(day => day === psheDay).map((day) => {
                                const rawModule = scheduledModules[`${activeYear}-${activeClass}-${activeMonth}-${activeWeek}-${day}`];
                                const scheduledModule = getLocalizedContent(rawModule, activeRegion.id);
                                return (
                                    <div key={day} className="flex flex-col gap-8">
                                        <div className="flex items-center justify-between px-6">
                                            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-brand-primary opacity-40">
                                                Active Delivery Day: <span className="text-brand-accent opacity-100">{day}</span>
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="text-[10px] font-black text-brand-primary uppercase">Ready to Teach</span>
                                            </div>
                                        </div>
                                        <div
                                            className={`aspect-[21/9] rounded-[3rem] border-2 border-dashed transition-all p-0 flex flex-col items-center justify-center text-center gap-8 group cursor-pointer relative overflow-hidden active:scale-[0.99]
                                            ${scheduledModule
                                                    ? 'border-brand-primary/5 bg-white shadow-2xl shadow-brand-primary/10 ring-1 ring-brand-primary/5'
                                                    : 'border-brand-primary/10 hover:border-brand-accent/40 bg-white/30 hover:bg-white'}
                                            `}
                                            onClick={() => {
                                                if (!scheduledModule) {
                                                    handleSchedule(day, String(Math.floor(Math.random() * 10) + 1));
                                                }
                                            }}
                                        >
                                            <AnimatePresence mode="wait">
                                                {scheduledModule ? (
                                                    <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        className="w-full h-full flex divide-x divide-brand-primary/5 text-left"
                                                    >
                                                        {/* Col 1: Identity */}
                                                        <div className="w-[30%] p-10 flex flex-col relative overflow-hidden">
                                                            <div className={`absolute top-0 left-0 w-full h-2 ${scheduledModule.color}`} />
                                                            <div className="flex items-start justify-between mb-8">
                                                                <div className="p-3 bg-brand-bg rounded-2xl border border-brand-primary/5">
                                                                    <BookOpen size={24} className="text-brand-primary" />
                                                                </div>
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-brand-secondary/60 bg-brand-secondary/5 px-3 py-1 rounded-full">{scheduledModule.category}</span>
                                                            </div>
                                                            <h3 className="text-3xl font-black text-brand-primary uppercase tracking-tight leading-[0.9] font-display italic mb-6">
                                                                {scheduledModule.title}
                                                            </h3>
                                                            <div className="mt-auto space-y-4">
                                                                <div className="flex items-center gap-3 text-[11px] font-bold text-brand-secondary">
                                                                    <Clock size={14} className="text-brand-accent" />
                                                                    <span>45 Minutes</span>
                                                                </div>
                                                                <div className="flex items-center gap-3 text-[11px] font-bold text-brand-secondary">
                                                                    <Globe size={14} className="text-brand-accent" />
                                                                    <span>{activeRegion.flag} {activeRegion.name} Context</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Col 2: Assets (Previously Hidden) */}
                                                        <div className="w-[40%] p-10 bg-brand-bg/30 flex flex-col">
                                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-secondary/40 mb-6 flex items-center gap-2">
                                                                <PlayCircle size={12} />
                                                                Lesson Assets
                                                            </p>
                                                            <div className="grid grid-cols-2 gap-4 h-full">
                                                                <div className="col-span-2 bg-white rounded-2xl border border-brand-primary/5 p-4 flex items-center justify-between group/asset hover:border-brand-accent/50 cursor-pointer transition-all shadow-sm">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="p-2 bg-rose-50 rounded-lg text-rose-500">
                                                                            <Video size={16} />
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Classroom Slides</p>
                                                                            <p className="text-[9px] font-bold text-brand-secondary/60">Interactive Presentation</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="w-6 h-6 rounded-full border border-brand-primary/10 flex items-center justify-center group-hover/asset:bg-brand-primary group-hover/asset:text-white transition-colors">
                                                                        <Plus size={12} />
                                                                    </div>
                                                                </div>
                                                                <div className="bg-white rounded-2xl border border-brand-primary/5 p-4 flex flex-col justify-between group/asset hover:border-brand-accent/50 cursor-pointer transition-all shadow-sm">
                                                                    <FileText size={16} className="text-blue-500 mb-2" />
                                                                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Worksheet</p>
                                                                </div>
                                                                <div className="bg-white rounded-2xl border border-brand-primary/5 p-4 flex flex-col justify-between group/asset hover:border-brand-accent/50 cursor-pointer transition-all shadow-sm">
                                                                    <MessageSquare size={16} className="text-amber-500 mb-2" />
                                                                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Teacher Guide</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Col 3: Compliance (Previously Hidden) */}
                                                        <div className="w-[30%] p-10 flex flex-col bg-white">
                                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-secondary/40 mb-6 flex items-center gap-2">
                                                                <CheckCircle2 size={12} />
                                                                Statutory Check
                                                            </p>
                                                            <div className="space-y-4">
                                                                <div className="p-4 rounded-2xl bg-brand-bg border border-brand-primary/5">
                                                                    <span className="text-[9px] font-black text-brand-accent uppercase bg-brand-accent/10 px-2 py-0.5 rounded-full mb-2 inline-block">
                                                                        {scheduledModule.context}
                                                                    </span>
                                                                    <p className="text-[10px] font-medium text-brand-secondary leading-relaxed">
                                                                        This lesson maps directly to <span className="text-brand-primary font-bold">{activeRegion.id === 'UK' ? 'RSE 2020' : activeRegion.statutoryTerm}</span> framework requirements for Year 7.
                                                                    </p>
                                                                </div>
                                                                <button className="w-full py-3 rounded-xl border border-brand-primary/10 text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all">
                                                                    View Full Mapping
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ) : (
                                                    <div className="flex flex-col items-center gap-6 transition-transform group-hover:scale-110 duration-500 text-brand-secondary/30">
                                                        <div className="w-20 h-20 rounded-[2.5rem] bg-brand-bg flex items-center justify-center border border-brand-primary/5 transition-all group-hover:bg-brand-accent/10 group-hover:text-brand-accent group-hover:rotate-90 group-hover:border-brand-accent/20 shadow-sm">
                                                            <Plus size={40} strokeWidth={3} />
                                                        </div>
                                                        <p className="text-xs font-black uppercase tracking-[0.3em] font-display">
                                                            Assign Lesson for {day}
                                                        </p>
                                                    </div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : viewMode === 'week' ? (
                    <div className={`grid ${psheDay === 'All Days' ? 'grid-cols-5' : 'grid-cols-1 max-w-2xl mx-auto w-full'} gap-4 flex-grow mb-4`}>
                        {DAYS.filter(day => psheDay === 'All Days' || day === psheDay).map((day) => {
                            const rawModule = scheduledModules[`${activeYear}-${activeClass}-${activeMonth}-${activeWeek}-${day}`];
                            const scheduledModule = getLocalizedContent(rawModule, activeRegion.id);
                            return (
                                <div key={day} className="flex flex-col gap-6">
                                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-brand-primary text-center opacity-40">
                                        {day}
                                    </p>
                                    <div
                                        className={`flex-grow rounded-[2.5rem] border-2 border-dashed transition-all p-6 flex flex-col items-center justify-center text-center gap-4 group cursor-pointer relative overflow-hidden active:scale-98
                        ${scheduledModule
                                                ? 'border-brand-primary/5 bg-white shadow-2xl shadow-brand-primary/10 ring-1 ring-brand-primary/5'
                                                : 'border-brand-primary/10 hover:border-brand-accent/40 bg-white/30 hover:bg-white'}
                    `}
                                        onClick={() => {
                                            if (scheduledModule) {
                                                setSelectedExecution(scheduledModule);
                                            } else {
                                                handleSchedule(day, String(Math.floor(Math.random() * 10) + 1));
                                            }
                                        }}
                                    >
                                        <AnimatePresence mode="wait">
                                            {scheduledModule ? (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="w-full h-full flex flex-col items-center"
                                                >
                                                    <div className={`w-full h-2 rounded-full ${scheduledModule.color} mb-8 opacity-60 shadow-lg`} />
                                                    <div className="w-14 h-14 rounded-[1.5rem] bg-brand-bg flex items-center justify-center mb-5 border-2 border-brand-primary/5 shadow-inner">
                                                        <BookOpen size={24} className="text-brand-primary opacity-60" />
                                                    </div>
                                                    <p className="text-[13px] font-black text-brand-primary uppercase tracking-tight leading-tight mb-3 font-display italic">
                                                        {scheduledModule.title}
                                                    </p>
                                                    <span className="text-[9px] font-bold text-brand-accent uppercase bg-brand-accent/5 px-3 py-1.5 rounded-full mb-6 inline-block tracking-widest border border-brand-accent/10">
                                                        {scheduledModule.context}
                                                    </span>
                                                    <div className="mt-auto flex items-center justify-center gap-3 text-[10px] font-black text-brand-secondary uppercase tracking-[0.25em] pt-8 border-t border-brand-primary/5 w-full">
                                                        <Clock size={16} className="text-brand-accent" />
                                                        45 Mins
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setScheduledModules(prev => {
                                                                const next = { ...prev };
                                                                delete next[`${activeYear}-${activeClass}-${activeWeek}-${day}`];
                                                                return next;
                                                            });
                                                        }}
                                                        className="absolute top-6 right-6 p-2.5 bg-rose-50 rounded-2xl text-rose-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white shadow-lg active:scale-90"
                                                    >
                                                        <Plus className="rotate-45" size={18} />
                                                    </button>
                                                </motion.div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-5 transition-transform group-hover:scale-110 duration-500 text-brand-secondary/30">
                                                    <div className="w-14 h-14 rounded-[2rem] bg-brand-bg flex items-center justify-center border border-brand-primary/5 transition-all group-hover:bg-brand-accent/10 group-hover:text-brand-accent group-hover:rotate-90 group-hover:border-brand-accent/20 shadow-sm">
                                                        <Plus size={28} strokeWidth={3} />
                                                    </div>
                                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] font-display">
                                                        Assign Lesson
                                                    </p>
                                                </div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : viewMode === 'month' ? (
                    /* Month Overview Roadmap - Redesigned for Legibility */
                    <div className="flex-grow flex flex-col gap-6">
                        {/* Day Headers for Month View */}
                        <div className="grid grid-cols-[100px_1fr] gap-6 px-10">
                            <div /> {/* Spacer for Week Label column */}
                            <div className={`grid ${psheDay === 'All Days' ? 'grid-cols-5' : 'grid-cols-1'} gap-6`}>
                                {DAYS.filter(day => psheDay === 'All Days' || day === psheDay).map(day => (
                                    <p key={day} className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-secondary/60 text-center">
                                        {day.slice(0, 3)}
                                    </p>
                                ))}
                            </div>
                        </div>

                        <div className="flex-grow flex flex-col gap-4 overflow-y-auto pr-4 custom-scrollbar">
                            {WEEKS.map((weekName, wIndex) => (
                                <div key={weekName} className="grid grid-cols-[100px_1fr] gap-6 items-stretch min-h-[140px]">
                                    {/* Week Label Column */}
                                    <div className="flex flex-col justify-center items-end pr-6 border-r border-brand-primary/10">
                                        <span className="text-[10px] font-black text-brand-secondary/40 uppercase tracking-[0.2em] rotate-180 [writing-mode:vertical-lr] mb-2">
                                            Academic
                                        </span>
                                        <span className="text-2xl font-black text-brand-primary font-display italic leading-none">
                                            W{wIndex + 1}
                                        </span>
                                    </div>

                                    {/* Days Grid for this week */}
                                    <div className={`grid ${psheDay === 'All Days' ? 'grid-cols-5' : 'grid-cols-1'} gap-6`}>
                                        {DAYS.filter(day => psheDay === 'All Days' || day === psheDay).map(day => {
                                            const rawModule = scheduledModules[`${activeYear}-${activeClass}-${activeMonth}-${wIndex}-${day}`];
                                            const scheduledModule = getLocalizedContent(rawModule, activeRegion.id);
                                            return (
                                                <motion.div
                                                    key={`${weekName}-${day}`}
                                                    whileHover={{ y: -4, scale: 1.02 }}
                                                    onClick={() => {
                                                        if (scheduledModule) {
                                                            setSelectedExecution(scheduledModule);
                                                        } else {
                                                            handleSchedule(day, String(Math.floor(Math.random() * 10) + 1), wIndex);
                                                        }
                                                    }}
                                                    className={`rounded-[2.5rem] border p-6 flex flex-col justify-between transition-all cursor-pointer relative overflow-hidden group
                                                        ${scheduledModule
                                                            ? 'bg-white border-brand-primary/5 shadow-xl shadow-brand-primary/5 ring-1 ring-brand-primary/5'
                                                            : 'bg-white/40 border-dashed border-brand-primary/10 hover:border-brand-accent/20 hover:bg-white'}
                                                    `}
                                                >
                                                    {scheduledModule ? (
                                                        <>
                                                            <div className="flex items-start justify-between mb-4">
                                                                <div className={`w-3 h-3 rounded-full ${scheduledModule.color} shadow-sm group-hover:scale-125 transition-transform`} />
                                                                <span className="text-[8px] font-black text-brand-accent uppercase tracking-widest bg-brand-accent/5 px-2 py-0.5 rounded-full border border-brand-accent/10">
                                                                    {scheduledModule.context}
                                                                </span>
                                                            </div>
                                                            <p className="text-[11px] font-black text-brand-primary uppercase tracking-tight leading-[1.3] font-display line-clamp-3 italic">
                                                                {scheduledModule.title}
                                                            </p>
                                                            <div className="mt-4 pt-4 border-t border-brand-primary/15 flex items-center justify-between opacity-60">
                                                                <Clock size={10} />
                                                                <span className="text-[8px] font-black uppercase tracking-widest">45m</span>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="flex-grow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Plus size={20} className="text-brand-accent" />
                                                        </div>
                                                    )}
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* Department Pulse View */
                    <div className="flex-grow flex flex-col gap-8">
                        <div className="grid grid-cols-3 gap-6">
                            {/* Summary Cards */}
                            <div className="bg-white p-8 rounded-[2.5rem] border border-brand-primary/10 shadow-sm border-b-4 border-b-emerald-500">
                                <p className="text-[10px] font-black uppercase tracking-widest text-brand-secondary/40 mb-2">Total Compliance</p>
                                <p className="text-4xl font-black text-brand-primary font-display">94<span className="text-emerald-500">%</span></p>
                                <div className="mt-4 flex items-center gap-2 text-emerald-500 text-[10px] font-bold">
                                    <CheckCircle2 size={12} />
                                    <span>+4% from last week</span>
                                </div>
                            </div>
                            <div className="bg-white p-8 rounded-[2.5rem] border border-brand-primary/10 shadow-sm border-b-4 border-b-brand-accent">
                                <p className="text-[10px] font-black uppercase tracking-widest text-brand-secondary/40 mb-2">Lessons Taught</p>
                                <p className="text-4xl font-black text-brand-primary font-display">142</p>
                                <p className="mt-4 text-[10px] font-bold text-brand-secondary/40">Across all Year Groups</p>
                            </div>
                            <div className="bg-white p-8 rounded-[2.5rem] border border-brand-primary/10 shadow-sm border-b-4 border-b-rose-500">
                                <p className="text-[10px] font-black uppercase tracking-widest text-brand-secondary/40 mb-2">Pending Feedback</p>
                                <p className="text-4xl font-black text-brand-primary font-display">12</p>
                                <div className="mt-4 flex items-center gap-2 text-rose-500 text-[10px] font-bold">
                                    <AlertCircle size={12} />
                                    <span>3 urgent reviews</span>
                                </div>
                            </div>
                        </div>

                        {/* Staff List Table */}
                        <div className="bg-white rounded-[3rem] border border-brand-primary/10 shadow-sm overflow-hidden">
                            <div className="p-8 border-b border-brand-primary/5 flex items-center justify-between bg-brand-bg/50">
                                <h4 className="text-[12px] font-black uppercase tracking-widest text-brand-primary flex items-center gap-3">
                                    <Activity size={16} className="text-brand-accent" />
                                    Staff Delivery Status
                                </h4>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                        <span className="text-[9px] font-black uppercase text-brand-secondary/60">On Track</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                                        <span className="text-[9px] font-black uppercase text-brand-secondary/60">Delayed</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-rose-500" />
                                        <span className="text-[9px] font-black uppercase text-brand-secondary/60">Critical</span>
                                    </div>
                                </div>
                            </div>
                            <div className="divide-y divide-brand-primary/5">
                                {[
                                    { name: 'Sarah Miller', year: 'Year 7', progress: 92, status: 'emerald', lessons: '12/13' },
                                    { name: 'Mark Thompson', year: 'Year 8', progress: 85, status: 'amber', lessons: '11/13' },
                                    { name: 'Jessica Wilde', year: 'Year 9', progress: 100, status: 'emerald', lessons: '13/13' },
                                    { name: 'David Smith', year: 'Year 10', progress: 42, status: 'rose', lessons: '5/12' },
                                ].map((staff, idx) => (
                                    <div key={idx} className="p-6 flex items-center justify-between hover:bg-brand-bg transition-colors group cursor-pointer">
                                        <div className="flex items-center gap-4 w-1/4">
                                            <div className="w-10 h-10 rounded-2xl bg-brand-primary/5 text-brand-primary flex items-center justify-center font-black text-xs group-hover:bg-brand-primary group-hover:text-white transition-all">
                                                {staff.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-black text-brand-primary uppercase tracking-tight">{staff.name}</p>
                                                <p className="text-[9px] font-bold text-brand-secondary/40 uppercase tracking-widest">{staff.year}</p>
                                            </div>
                                        </div>
                                        <div className="flex-grow max-w-md">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-brand-secondary/60">{staff.progress}% Compliance</p>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-brand-secondary/60">{staff.lessons} Lessons</p>
                                            </div>
                                            <div className="h-1.5 w-full bg-brand-primary/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${staff.progress}%` }}
                                                    className={`h-full bg-${staff.status}-500 shadow-[0_0_10px_rgba(0,0,0,0.1)]`}
                                                />
                                            </div>
                                        </div>
                                        <div className="w-32 flex justify-end">
                                            <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] bg-${staff.status}-500/10 text-${staff.status}-600 border border-${staff.status}-500/20`}>
                                                {staff.status === 'emerald' ? 'On Track' : staff.status === 'amber' ? 'Attention' : 'Urgent'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Lesson Delivery Control Center (Side Panel) */}
            <AnimatePresence>
                {selectedExecution && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedExecution(null)}
                            className="absolute inset-0 bg-brand-primary/20 backdrop-blur-sm z-40"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="absolute top-0 right-0 w-[450px] h-full bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.1)] z-50 p-12 flex flex-col border-l border-brand-primary/5"
                        >
                            <button
                                onClick={() => setSelectedExecution(null)}
                                className="absolute top-8 right-8 p-3 hover:bg-brand-bg rounded-2xl transition-colors text-brand-secondary"
                            >
                                <X size={20} />
                            </button>

                            <div className="mb-10">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-accent mb-4 block">
                                    Delivery Mode
                                </span>
                                <h2 className="text-4xl font-black text-brand-primary tracking-tight font-display uppercase italic leading-none">
                                    {selectedExecution.title}
                                </h2>
                            </div>

                            <div className="space-y-8 flex-grow overflow-y-auto pr-2 custom-scrollbar">
                                {/* Main Action: Launch Content */}
                                <div className="p-8 rounded-[2.5rem] bg-brand-bg border border-brand-primary/5 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <PlayCircle size={24} className="text-brand-accent" />
                                            <p className="text-xs font-black uppercase tracking-widest text-brand-primary">Lesson Content</p>
                                        </div>
                                        <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded">V2.4 Active</span>
                                    </div>
                                    <p className="text-[11px] font-medium text-brand-secondary/70 leading-relaxed">
                                        Full interactive presentation deck including embedded videos and transition activities.
                                    </p>
                                    <a
                                        href="#"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-5 bg-brand-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl hover:bg-brand-accent transition-all flex items-center justify-center gap-3 group active:scale-95 no-underline"
                                    >
                                        Open Presentation (Cloud Link)
                                        <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </a>
                                    <div className="flex items-center gap-2 justify-center py-2 opacity-50">
                                        <span className="text-[8px] font-bold uppercase tracking-widest text-brand-secondary">Proprietary Content • Single License Active</span>
                                    </div>
                                </div>

                                {/* Teacher Briefing Video */}
                                <div className="p-6 rounded-[2rem] bg-brand-primary/5 border border-brand-primary/10 group hover:border-brand-accent/30 transition-all cursor-pointer">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-brand-accent/20 rounded-xl text-brand-accent group-hover:scale-110 transition-transform">
                                            <Video size={18} />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Teacher Briefing</p>
                                    </div>
                                    <p className="text-[10px] font-bold text-brand-secondary/70 leading-relaxed mb-4">
                                        Spend 3 minutes with our subject expert to master the nuances of this module before you teach it.
                                    </p>
                                    <button className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-brand-accent hover:gap-3 transition-all">
                                        Watch Video Insights
                                        <PlayCircle size={14} />
                                    </button>
                                </div>

                                {/* Regional Localization */}
                                <div className="p-6 rounded-[2rem] border border-brand-primary/10 bg-white shadow-sm space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">{activeRegion.flag}</span>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary">{activeRegion.name} Assets</p>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded">Localised</span>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <div className="w-1 h-3 rounded-full bg-brand-accent mt-0.5" />
                                            <p className="text-[9px] font-bold text-brand-secondary/70 leading-relaxed uppercase tracking-tight">
                                                Slides updated with <span className="text-brand-primary">{activeRegion.location}</span> imagery & cultural context.
                                            </p>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="w-1 h-3 rounded-full bg-brand-accent mt-0.5" />
                                            <p className="text-[9px] font-bold text-brand-secondary/70 leading-relaxed uppercase tracking-tight">
                                                Legal: <span className="text-brand-primary">{activeRegion.statutoryTerm}</span> framework cross-referenced.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Teacher Assets */}
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-secondary/40 pl-2">Teacher Resources</p>
                                    <div className="grid grid-cols-1 gap-3">
                                        <button className="flex items-center justify-between p-5 bg-white border border-brand-primary/5 rounded-2xl hover:border-brand-accent/30 transition-all group active:scale-98">
                                            <div className="flex items-center gap-4">
                                                <FileText size={18} className="text-brand-secondary" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Teacher Script (PDF)</span>
                                            </div>
                                            <Download size={14} className="text-brand-secondary/30 group-hover:text-brand-accent transition-colors" />
                                        </button>
                                        <button className="flex items-center justify-between p-5 bg-white border border-brand-primary/5 rounded-2xl hover:border-brand-accent/30 transition-all group active:scale-98">
                                            <div className="flex items-center gap-4">
                                                <FileText size={18} className="text-brand-secondary" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Student Worksheets</span>
                                            </div>
                                            <Download size={14} className="text-brand-secondary/30 group-hover:text-brand-accent transition-colors" />
                                        </button>
                                    </div>
                                </div>

                                {/* Delivery Notes */}
                                <div className="p-6 bg-brand-accent/5 rounded-[2rem] border border-brand-accent/10">
                                    <div className="flex items-center gap-3 mb-3">
                                        <MessageSquare size={18} className="text-brand-accent" />
                                        <p className="text-[10px] font-black uppercase tracking-widest text-brand-accent">HoD Tip</p>
                                    </div>
                                    <p className="text-[10px] font-bold text-brand-primary/70 italic leading-relaxed">
                                        "Focus heavily on the 'Online Footprint' section for this cohort - they've been using TikTok extensively this term."
                                    </p>
                                </div>
                            </div>

                            <button className="mt-8 w-full py-5 border-2 border-brand-primary/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-brand-primary hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all flex items-center justify-center gap-3 active:scale-95">
                                Mark as Delivered
                                <CheckCircle2 size={16} />
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CurriculumPlanner;
