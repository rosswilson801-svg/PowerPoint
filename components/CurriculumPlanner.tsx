import React, { useState, useEffect } from 'react';
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
    Monitor,
    Play,
    Lock,
    Link as LinkIcon,
    Globe,
    Trash2,
    RefreshCw,
    Users,
    Search
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import {
    DndContext,
    DragOverlay,
    useDraggable,
    useDroppable,
    DragStartEvent,
    DragEndEvent,
    PointerSensor,
    useSensor,
    useSensors,
    closestCenter
} from '@dnd-kit/core';

const REGIONS = [
    { id: 'UK', name: 'United Kingdom', flag: '🇬🇧', statutoryTerm: 'UK Statutory', location: 'London/Manchester' },
    { id: 'HK', name: 'Hong Kong', flag: '🇭🇰', statutoryTerm: 'HK Statutory', location: 'Hong Kong' },
    { id: 'FR', name: 'France', flag: '🇫🇷', statutoryTerm: 'Éducation Nationale', location: 'Paris/Lyon' },
    { id: 'ES', name: 'Spain', flag: '🇪🇸', statutoryTerm: 'Ley de Educación', location: 'Madrid/Barcelona' },
];

// Library modules are now fetched from Supabase.

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

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
const WEEKS = Array.from({ length: 52 }, (_, i) => `Week ${i + 1}`);
const YEAR_GROUPS = ['YEAR 7', 'YEAR 8', 'YEAR 9', 'YEAR 10', 'YEAR 11', 'SIXTH FORM'];
const MONTHS = ['SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER', 'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY'];

// TEACHERS is no longer hardcoded — loaded dynamically from Supabase profiles below

const YEAR_CLASSES: Record<string, string[]> = {
    'YEAR 7': ['7A', '7B', '7C', '7D'],
    'YEAR 8': ['8A', '8B', '8C'],
    'YEAR 9': ['9A', '9B'],
    'YEAR 10': ['10A', '10B'],
    'YEAR 11': ['11A', '11B'],
    'SIXTH FORM': ['SF-A', 'SF-B']
};

// PresentationModal — renders lesson slides in an iframe overlay
const PresentationModal = ({ url, title, onClose }: { url: string, title: string, onClose: () => void }) => {
    // Microsoft Office Online Viewer URL
    const viewerUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}`;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-primary/95 backdrop-blur-xl p-4 md:p-8"
        >
            <div className="w-full h-full max-w-7xl bg-white rounded-[2.5rem] overflow-hidden shadow-2xl relative flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-brand-accent/10 rounded-xl text-brand-accent">
                            <Monitor size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-brand-primary font-display uppercase tracking-tight line-clamp-1">{title}</h3>
                            <p className="text-[10px] font-black text-brand-secondary/40 uppercase tracking-widest">DIGITAL LESSON PRESENTATION • 2025/26 EDITION</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-brand-primary rounded-2xl transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Viewer */}
                <div className="flex-1 bg-slate-900 overflow-hidden relative">
                    <iframe
                        src={viewerUrl}
                        className="w-full h-full border-0"
                        title="Presentation Viewer"
                        allowFullScreen
                    />
                </div>

                {/* Footer Controls */}
                <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-center gap-8">
                    <p className="text-[11px] font-black text-brand-secondary/40 uppercase tracking-[0.2em]">PRESS [ESC] TO EXIT PRESENTATION MODE</p>
                </div>
            </div>
        </motion.div>
    );
};

const DraggableModuleCard = ({ module, children }: { module: any, children: React.ReactNode, key?: any }) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `module-source-${module.id}`,
        data: { module }
    });

    return (
        <div ref={setNodeRef} {...listeners} {...attributes} className={`touch-none ${isDragging ? 'opacity-30' : ''}`}>
            {children}
        </div>
    );
};

const DroppableDayCell = ({ id, children, disabled }: { id: string, children: React.ReactNode, disabled?: boolean, key?: any }) => {
    const { isOver, setNodeRef } = useDroppable({
        id: id,
        disabled
    });

    return (
        <div ref={setNodeRef} className={`relative transition-all h-full ${isOver ? 'bg-brand-accent/5 scale-[1.02]' : ''}`}>
            {children}
            {isOver && (
                <div className="absolute inset-0 border-2 border-brand-accent border-dashed rounded-[2.5rem] pointer-events-none z-50 bg-brand-accent/5 backdrop-blur-[1px] flex items-center justify-center">
                    <div className="bg-white px-4 py-2 rounded-full shadow-lg text-[10px] font-black uppercase tracking-widest text-brand-accent flex items-center gap-2">
                        <Plus size={14} />
                        Drop to Schedule
                    </div>
                </div>
            )}
        </div>
    );
};

const DEFAULT_GUEST_ID = '00000000-0000-0000-0000-000000000000';

const CurriculumPlanner: React.FC = () => {
    const { user, profile } = useAuth();
    const isTeacher = profile?.role === 'teacher';

    // Build a display object for the logged-in user, falling back gracefully
    const loggedInTeacher = {
        id: 'me',
        name: profile?.full_name || user?.email?.split('@')[0] || 'You',
        role: profile?.role === 'coordinator' ? 'PSHE Coordinator' : 'Teacher',
        initials: (profile?.full_name || user?.email || 'U')
            .split(' ')
            .map((w: string) => w[0])
            .join('')
            .toUpperCase()
            .slice(0, 2),
        regionId: 'HK',
        allowedYears: YEAR_GROUPS,
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const [scheduledModules, setScheduledModules] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(true);
    const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'saved' | 'error'>('idle');
    const [activeWeek, setActiveWeek] = useState(1);
    const [activeTermStr, setActiveTermStr] = useState('Autumn Term');
    const [activeMonth, setActiveMonth] = useState(0);
    // State for live teacher list (loaded from Supabase profiles)
    const [teachersList, setTeachersList] = useState<any[]>([]);
    // activeTeacher defaults to the logged-in user — never null on first render
    const [activeTeacher, setActiveTeacher] = useState<any>(loggedInTeacher);
    const [activeYear, setActiveYear] = useState('YEAR 7');
    const [activeClass, setActiveClass] = useState('7A');
    const [activeCategoryFilter, setActiveCategoryFilter] = useState('All Topics');
    const [activeRegion, setActiveRegion] = useState(REGIONS.find(r => r.id === activeTeacher.regionId) || REGIONS[0]);
    const [activeContext, setActiveContext] = useState('National Curriculum');
    const [selectedModule, setSelectedModule] = useState<any>(null);
    const [psheDay, setPsheDay] = useState<string>('Wednesday');
    const [selectedExecution, setSelectedExecution] = useState<any>(null);
    const [viewMode, setViewMode] = useState<'daily' | 'week' | 'month' | 'year' | 'pulse'>('daily');
    const [isNordMode, setIsNordMode] = useState(false);
    const [activeDragModule, setActiveDragModule] = useState<any>(null);
    const [activePresentation, setActivePresentation] = useState<{ url: string, title: string } | null>(null);
    const [lastSyncError, setLastSyncError] = useState<string | null>(null);
    const [libraryModules, setLibraryModules] = useState<any[]>([]);

    // Load Data from Supabase
    useEffect(() => {
        const fetchSchedule = async () => {
            // Wait for library modules to be loaded before trying to map the schedule
            if (libraryModules.length === 0) return;

            console.log("Fetching schedule...");
            const { data: { session } } = await supabase.auth.getSession();

            // Fetch by user_id so each user only sees THEIR OWN saved plan.
            // Falls back to the shared guest slot if not logged in.
            const userId = session?.user?.id || DEFAULT_GUEST_ID;

            if (!session) {
                console.log("No session found in fetchSchedule, using guest view");
            }

            const { data, error } = await supabase
                .from('teacher_schedules')
                .select('*')
                .eq('user_id', userId);

            if (error) {
                console.error("Error fetching schedule:", error);
                setLoading(false);
                return;
            }

            const scheduleMap: Record<string, any> = {};

            if (data && data.length > 0) {
                console.log(`Loaded ${data.length} scheduled items`);
                data.forEach(item => {
                    const key = `${item.year_group}-${item.class_id}-${item.month_index}-${item.week_number}-${item.day_of_week}`;
                    // Find the module details from our constant library
                    const baseModule = libraryModules.find(m => m.id === String(item.module_id));
                    if (baseModule) {
                        scheduleMap[key] = { ...baseModule, db_id: item.id };
                    } else {
                        console.warn(`Module ID ${item.module_id} not found in library for key ${key}`);
                    }
                });
            }

            // Sample prepopulation override based on Onboarding selection
            const importSample = localStorage.getItem('clarity_import_sample') === 'true';
            if (importSample) {
                const sampleDay = localStorage.getItem('clarity_sample_day') || 'Wednesday';

                const createMockModule = (title: string, category: string, color: string) => ({
                    id: `mock-${Math.random().toString(36).substr(2, 9)}`,
                    title,
                    category,
                    color
                });

                const sampleLayout = [
                    // Week 1 (28th Jan)
                    { year: 'YEAR 7', week: 1, title: 'The science of happiness', category: 'Self-awareness', color: 'bg-amber-300' },
                    { year: 'YEAR 8', week: 1, title: 'What is peer pressure', category: 'Self-awareness', color: 'bg-amber-300' },
                    { year: 'YEAR 9', week: 1, title: 'Positivity', category: 'Self-awareness', color: 'bg-fuchsia-300' },
                    { year: 'YEAR 10', week: 1, title: 'Body image', category: 'Self-awareness', color: 'bg-fuchsia-300' },
                    // Week 2 (4th Feb)
                    { year: 'YEAR 7', week: 2, title: 'The science of happiness part 2', category: 'Self-management', color: 'bg-amber-400' },
                    { year: 'YEAR 8', week: 2, title: 'What is peer pressure part 2', category: 'Self-management', color: 'bg-amber-400' },
                    { year: 'YEAR 9', week: 2, title: 'Positivity part 2', category: 'Self-management', color: 'bg-fuchsia-400' },
                    { year: 'YEAR 10', week: 2, title: 'Body image part 2', category: 'Self-management', color: 'bg-fuchsia-400' },
                    // Week 3 (11th Feb)
                    { year: 'YEAR 7', week: 3, title: 'Online grooming and spotting the signs part 2', category: 'Self-management', color: 'bg-amber-400' },
                    { year: 'YEAR 8', week: 3, title: 'Cyber safety', category: 'Self-management', color: 'bg-amber-400' },
                    { year: 'YEAR 9', week: 3, title: 'Online trolls and cyber bullying', category: 'Self-management', color: 'bg-amber-400' },
                    { year: 'YEAR 10', week: 3, title: 'Deepfakes and malicious use', category: 'Self-management', color: 'bg-fuchsia-400' },
                    // Week 4 (25th Feb)
                    { year: 'YEAR 7', week: 4, title: 'Who are our influencers?', category: 'Self-management', color: 'bg-amber-400' },
                    { year: 'YEAR 8', week: 4, title: 'Cyber safety part 2', category: 'Self-management', color: 'bg-amber-400' },
                    { year: 'YEAR 9', week: 4, title: 'Online trolls and cyber bullying part 2', category: 'Self-management', color: 'bg-amber-400' },
                    { year: 'YEAR 10', week: 4, title: 'Deepfakes and malicious use part 2', category: 'Self-management', color: 'bg-fuchsia-400' },
                ];

                const monthIndex = 0; // January for this sample mapped from the image

                sampleLayout.forEach(item => {
                    const classStr = YEAR_CLASSES[item.year]?.[0] || 'A';
                    const key = `${item.year}-${classStr}-${monthIndex}-${item.week}-${sampleDay.toUpperCase()}`;
                    scheduleMap[key] = createMockModule(item.title, item.category, item.color);
                });

                setPsheDay(sampleDay);
                setActiveMonth(monthIndex);
                setActiveWeek(1);

                localStorage.removeItem('clarity_import_sample');
            }

            setScheduledModules(scheduleMap);
            setLoading(false);
        };

        fetchSchedule();

        // Also listen for auth changes to re-fetch if needed
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) fetchSchedule();
        });

        return () => subscription.unsubscribe();
    }, [libraryModules]);
    // Term definitions based on user provided schedule (2025/2026)
    const TERMS = [
        { name: 'Autumn Term', start: new Date(new Date().getFullYear(), 8, 1), end: new Date(new Date().getFullYear(), 11, 20) }, // Sep-Dec
        { name: 'Spring Term', start: new Date(new Date().getFullYear(), 0, 1), end: new Date(new Date().getFullYear(), 3, 10) },   // Jan-Apr
        { name: 'Summer Term', start: new Date(new Date().getFullYear(), 3, 15), end: new Date(new Date().getFullYear(), 6, 20) }   // Apr-Jul
    ];



    // Centralized Sync Helper - Uses delete+insert instead of upsert for schema flexibility
    const syncScheduleToSupabase = async (payload: any, maxRetries = 3) => {
        let attempt = 0;
        setLastSyncError(null);

        // For demo/guest mode, we don't show error banners to keep the UI clean
        const isGuest = payload.user_id === DEFAULT_GUEST_ID;

        // Remove the custom 'id' field if present - let Supabase auto-generate
        const { id, ...cleanPayload } = payload;

        while (attempt < maxRetries) {
            try {
                setSyncStatus('syncing');

                // Step 1: Delete any existing record for this slot
                await supabase
                    .from('teacher_schedules')
                    .delete()
                    .eq('user_id', cleanPayload.user_id)
                    .eq('year_group', cleanPayload.year_group)
                    .eq('class_id', cleanPayload.class_id)
                    .eq('month_index', cleanPayload.month_index)
                    .eq('week_number', cleanPayload.week_number)
                    .eq('day_of_week', cleanPayload.day_of_week);

                // Step 2: Insert the new record
                const { error } = await supabase
                    .from('teacher_schedules')
                    .insert(cleanPayload);

                if (!error) {
                    setSyncStatus('saved');
                    setTimeout(() => setSyncStatus(prev => prev === 'saved' ? 'idle' : prev), 3000);
                    return { ok: true };
                }

                console.warn(`[Sync] Attempt ${attempt + 1} failed:`, error.message, error.hint);
                attempt++;

                if (attempt < maxRetries) {
                    const delay = Math.pow(2, attempt) * 600;
                    await new Promise(r => setTimeout(r, delay));
                } else {
                    throw error;
                }
            } catch (err: any) {
                console.error("[Sync] Final Sync Error after retries:", err);
                setSyncStatus('error');
                if (!isGuest) {
                    setLastSyncError(err.message || "Failed to sync with database");
                }
                return { ok: false, error: err };
            }
        }
    };

    const deleteFromSupabase = async (match: any) => {
        const isGuest = match.user_id === DEFAULT_GUEST_ID;
        try {
            setSyncStatus('syncing');
            const { error } = await supabase
                .from('teacher_schedules')
                .delete()
                .match(match);

            if (error) throw error;

            setSyncStatus('saved');
            setTimeout(() => setSyncStatus(prev => prev === 'saved' ? 'idle' : prev), 3000);
            return { ok: true };
        } catch (err: any) {
            console.error("[Sync] Delete Error:", err);
            setSyncStatus('error');
            if (!isGuest) {
                setLastSyncError(err.message || "Failed to remove item from database");
            }
            return { ok: false, error: err };
        }
    };

    const handleDragStart = (event: DragStartEvent) => {
        if (event.active.data.current?.module) {
            setActiveDragModule(event.active.data.current.module);
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveDragModule(null);

        if (over && active.data.current?.module) {
            const targetId = over.id as string;
            const module = active.data.current.module;
            const [year, className, month, week, day] = targetId.split('-');

            const { data: { session } } = await supabase.auth.getSession();
            const userId = session?.user.id || DEFAULT_GUEST_ID;

            // Optimistic Update
            setScheduledModules(prev => ({
                ...prev,
                [targetId]: module
            }));

            // Supabase Sync - generate composite ID for upsert
            const compositeId = `${userId}-${year}-${className}-${month}-${week}-${day}`;
            await syncScheduleToSupabase({
                id: compositeId,
                user_id: userId,
                school_id: profile?.school_id,
                year_group: year,
                class_id: className,
                month_index: parseInt(month),
                week_number: parseInt(week),
                day_of_week: day,
                module_id: module.id
            });
        }
    };

    // Auto-sync date on mount
    useEffect(() => {
        const fetchInitialData = async () => {
            const { data } = await supabase.from('library_modules').select('*');
            if (data) setLibraryModules(data);

            // Resolve the current user once — used in both branches below
            const { data: { session } } = await supabase.auth.getSession();
            const userId = session?.user?.id || DEFAULT_GUEST_ID;

            // Load real teacher profiles from the same school (for coordinator delegation)
            if (profile?.school_id) {
                const { data: schoolTeachers } = await supabase
                    .from('profiles')
                    .select('id, full_name, role, classes')
                    .eq('school_id', profile.school_id)
                    .eq('role', 'teacher');

                if (schoolTeachers && schoolTeachers.length > 0) {
                    const mapped = schoolTeachers.map((t: any) => ({
                        id: t.id,
                        name: t.full_name || t.id.slice(0, 8),
                        role: 'Teacher',
                        initials: (t.full_name || 'T').split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2),
                        allowedYears: t.classes ? t.classes.split(',').map((c: string) => c.trim()) : YEAR_GROUPS,
                    }));
                    setTeachersList(mapped);
                }
            }

            // Handle Onboarding Sample Import
            if (localStorage.getItem('clarity_import_sample') === 'true' && data && data.length > 0) {
                const day = localStorage.getItem('clarity_sample_day') || 'WEDNESDAY';

                // Fetch fresh profile in case context hasn't updated yet after redirect
                const { data: currentProfile } = await supabase
                    .from('profiles')
                    .select('school_id')
                    .eq('id', userId)
                    .single();

                const schoolId = currentProfile?.school_id || profile?.school_id;

                console.log("Processing realistic onboarding sample import...");
                const sampleInserts = [];

                // Define the typical school structure for the demo
                const years = [
                    { id: 'YEAR 7', classes: ['7A', '7B', '7C'] },
                    { id: 'YEAR 8', classes: ['8A', '8B'] },
                    { id: 'YEAR 9', classes: ['9A', '9B', '9C', '9D'] },
                    { id: 'YEAR 10', classes: ['10A', '10B'] },
                    { id: 'YEAR 11', classes: ['11A', '11C'] },
                ];

                // Create a rich 3-month schedule for all classes
                let moduleOffset = 0;
                years.forEach(year => {
                    year.classes.forEach(className => {
                        for (let m = 0; m < 3; m++) { // First 3 months
                            for (let w = 1; w <= 4; w++) { // 4 weeks
                                // Pick a semi-random but deterministic module based on year/class to vary the curriculum
                                const mIndex = (m * 4 + w + moduleOffset) % data.length;
                                const mod = data[mIndex];
                                const compositeId = `${userId}-${year.id}-${className}-${m}-${w}-${day.toUpperCase()}`;
                                sampleInserts.push({
                                    id: compositeId,
                                    user_id: userId,
                                    school_id: schoolId,
                                    year_group: year.id,
                                    class_id: className,
                                    month_index: m,
                                    week_number: w,
                                    day_of_week: day.toUpperCase(),
                                    module_id: mod.id
                                });
                            }
                        }
                        moduleOffset += 3; // Shift the curriculum for the next class
                    });
                });

                const { error } = await supabase.from('teacher_schedules').upsert(sampleInserts);
                if (error) {
                    console.error("Error inserting sample data:", error);
                } else {
                    console.log("Sample data imported successfully!");
                    localStorage.removeItem('clarity_import_sample');
                    localStorage.removeItem('clarity_sample_day');

                    // Trigger a re-fetch of the schedule to show what we just inserted
                    const { data: newSched, error: schedErr } = await supabase
                        .from('teacher_schedules')
                        .select('*')
                        .eq('user_id', userId);

                    if (!schedErr && newSched) {
                        const schedMap: Record<string, any> = {};
                        newSched.forEach((item: any) => {
                            const key = `${item.year_group}-${item.class_id}-${item.month_index}-${item.week_number}-${item.day_of_week}`;
                            const module = data.find(m => m.id === item.module_id);
                            if (module) schedMap[key] = module;
                        });
                        setScheduledModules(schedMap);
                    }
                }
            } else if (userId !== DEFAULT_GUEST_ID) {
                // Regular fetch if not importing sample — keyed to this specific user
                const { data: newSched, error: schedErr } = await supabase
                    .from('teacher_schedules')
                    .select('*')
                    .eq('user_id', userId);

                if (!schedErr && newSched) {
                    const schedMap: Record<string, any> = {};
                    newSched.forEach((item: any) => {
                        const key = `${item.year_group}-${item.class_id}-${item.month_index}-${item.week_number}-${item.day_of_week}`;
                        const module = data.find(m => m.id === item.module_id);
                        if (module) schedMap[key] = module;
                    });
                    setScheduledModules(schedMap);
                }
            }
        };
        fetchInitialData();

        const now = new Date(); // Current system time

        // 1. Sync Month - find which academic month we're in
        const currentMonthName = now.toLocaleString('default', { month: 'long' }).toUpperCase();
        const monthIndex = MONTHS.indexOf(currentMonthName);
        if (monthIndex !== -1) setActiveMonth(monthIndex);

        // 2. Sync Term (for display purposes)
        const currentTerm = TERMS.find(t => now >= t.start && now <= t.end);
        if (currentTerm) {
            setActiveTermStr(currentTerm.name);
        } else {
            setActiveTermStr('Spring Term');
        }

        // 3. Sync Week - use week 1-4 within the month (based on day of month)
        const dayOfMonth = now.getDate();
        const weekOfMonth = Math.min(4, Math.ceil(dayOfMonth / 7)); // 1-4
        setActiveWeek(weekOfMonth);
    }, []);

    const handleSchedule = async (day: string, moduleId: string, weekIndex?: number) => {
        const module = libraryModules.find(m => m.id === moduleId);
        if (!module) return;
        const targetWeek = weekIndex !== undefined ? weekIndex : activeWeek;
        const targetId = `${activeYear}-${activeClass}-${activeMonth}-${targetWeek}-${day}`;

        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user.id || DEFAULT_GUEST_ID;

        // Optimistic Update
        setScheduledModules(prev => ({
            ...prev,
            [targetId]: module
        }));

        // Supabase Sync - generate composite ID for upsert
        const compositeId = `${userId}-${activeYear}-${activeClass}-${activeMonth}-${targetWeek}-${day}`;
        await syncScheduleToSupabase({
            id: compositeId,
            user_id: userId,
            school_id: profile?.school_id,
            year_group: activeYear,
            class_id: activeClass,
            month_index: activeMonth,
            week_number: targetWeek,
            day_of_week: day,
            module_id: module.id
        });
    };

    const applyStatutoryTemplate = () => {
        const newSchedule = { ...scheduledModules };
        // Populate 11 months, 4 weeks each = 44 lessons
        for (let m = 0; m < 11; m++) {
            for (let w = 1; w <= 4; w++) {
                const day = 'Wednesday'; // Standard statutory day
                const module = libraryModules[(m * 4 + w) % Math.max(libraryModules.length, 1)];
                const key = `${activeYear}-${activeClass}-${m}-${w}-${day}`;
                newSchedule[key] = module;
            }
        }
        setScheduledModules(newSchedule);
    };

    const handleExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(scheduledModules));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `clarity_schedule_${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const parsed = JSON.parse(content);
                // Basic validation: check if it looks like an object
                if (typeof parsed === 'object' && parsed !== null) {
                    setScheduledModules(parsed);
                } else {
                    alert('Invalid schedule file format');
                }
            } catch (error) {
                console.error('Error importing schedule:', error);
                alert('Failed to import schedule. Please check the file.');
            }
        };
        reader.readAsText(file);
    };


    return (
        <div className="h-full flex flex-col bg-[#F2F4F8] relative overflow-hidden">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="flex h-full overflow-hidden font-sans relative">
                    {/* ── LIGHT SECONDARY SIDEBAR ── */}
                    <div className="w-[260px] flex-shrink-0 bg-white border-r border-slate-200 flex flex-col z-20 relative pt-8">
                        {/* Teacher Info */}
                        <div className="px-8 pb-8">
                            <h3 className="text-[15px] font-bold text-slate-800 mb-5">Teacher Info</h3>
                            <div className="flex items-center gap-4">
                                <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-medium text-sm overflow-hidden shadow-sm">
                                    {loggedInTeacher.initials}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-slate-900 text-[14px] font-semibold truncate leading-tight mb-0.5">{loggedInTeacher.name}</p>
                                    <p className="text-slate-500 text-[12px]">{loggedInTeacher.role}</p>
                                </div>
                            </div>

                            {/* Coordinator delegation */}
                            {profile?.role === 'coordinator' && teachersList.length > 0 && (
                                <div className="mt-6">
                                    <select
                                        value={activeTeacher?.id || 'self'}
                                        onChange={(e) => {
                                            if (e.target.value === 'self') { setActiveTeacher(loggedInTeacher); return; }
                                            const t = teachersList.find(t => t.id === e.target.value);
                                            if (t) { setActiveTeacher(t); if (!t.allowedYears.includes(activeYear)) setActiveYear(t.allowedYears[0]); }
                                        }}
                                        className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-[13px] text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-300 cursor-pointer"
                                    >
                                        <option value="self">Viewing: Self</option>
                                        {teachersList.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                    </select>
                                </div>
                            )}

                            {/* Class Selector */}
                            <div className="mt-6">
                                <p className="text-slate-500 text-[11px] font-semibold mb-3">Active Class</p>
                                <div className="flex flex-wrap gap-2">
                                    {(YEAR_CLASSES[activeYear] || []).map(cls => (
                                        <button
                                            key={cls}
                                            onClick={() => setActiveClass(cls)}
                                            className={`px-3 py-1 rounded-md text-[12px] font-medium transition-all
                                                    ${activeClass === cls
                                                    ? 'bg-slate-800 text-white'
                                                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                                                }`}
                                        >
                                            {cls}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Topic Library */}
                        {!isTeacher && (
                            <div className="flex-grow overflow-y-auto no-scrollbar flex flex-col px-8 pb-8 pt-2">
                                <h3 className="text-[15px] font-bold text-slate-800 mb-5">Topic Library</h3>

                                {/* Search Bar */}
                                <div className="relative mb-6">
                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 transition-colors"
                                    />
                                </div>

                                <h4 className="text-[13px] font-bold text-slate-800 mb-4">Recent Topics</h4>

                                {/* Draggable List Elements */}
                                <div className="flex flex-col gap-3.5">
                                    {libraryModules.filter(module => {
                                        const isScheduled = Object.values(scheduledModules).some((m: any) => m.id === module.id);
                                        return !isScheduled;
                                    }).map(module => (
                                        <DraggableModuleCard key={module.id} module={module}>
                                            <div className="group bg-white rounded-xl border border-slate-200 p-4 flex gap-4 transition-all hover:border-slate-300 hover:shadow-sm cursor-grab active:cursor-grabbing mb-3">
                                                {/* Left color bar */}
                                                <div className={`w-1.5 h-10 rounded-full flex-shrink-0 ${module.color || 'bg-emerald-500'}`} />

                                                {/* Content */}
                                                <div className="flex flex-col justify-center min-w-0 gap-1.5">
                                                    <p className="text-[14px] font-black text-[#0B132B] uppercase tracking-wide truncate pr-2">
                                                        {module.title}
                                                    </p>
                                                    <div className="flex">
                                                        <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md uppercase tracking-widest leading-none">
                                                            {module.category || module.context || 'CATEGORY'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </DraggableModuleCard>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>{/* end light sidebar */}

                    {/* ── MAIN CONTENT AREA ── */}
                    <div className="flex-grow flex flex-col min-w-0 bg-[#F8FAFC] relative">

                        {/* ── TOP YEAR NAV ── */}
                        <div className="flex px-10 pt-6 bg-white gap-6">
                            {(activeTeacher?.allowedYears || YEAR_GROUPS).map(year => (
                                <button
                                    key={year}
                                    onClick={() => {
                                        setActiveYear(year);
                                        setActiveClass(YEAR_CLASSES[year]?.[0] || 'A');
                                    }}
                                    className={`pb-4 text-[15px] font-semibold transition-all relative
                                            ${activeYear === year
                                            ? 'text-slate-800'
                                            : 'text-slate-500 hover:text-slate-800'
                                        }`}
                                >
                                    {year}
                                    {activeYear === year && (
                                        <motion.div
                                            layoutId="activeYearTab"
                                            className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-brand-accent rounded-t-full z-10"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                        <div className="w-full h-px bg-slate-200"></div>

                        {/* View Content Area */}
                        <div className="flex-grow overflow-y-auto no-scrollbar flex flex-col px-10 pt-6 pb-10">

                            {/* ── DARK ACCENT HEADER ── */}
                            <div className="w-full bg-[#0B132B] rounded-xl px-6 py-4 flex items-center justify-between shadow-sm flex-shrink-0 mb-8">
                                {/* Left: navigation + title */}
                                <div className="flex items-center gap-6">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => viewMode === 'month' || viewMode === 'year' ? setActiveMonth(prev => Math.max(0, prev - 1)) : setActiveWeek(prev => Math.max(1, prev - 1))}
                                            className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#0B132B] hover:bg-slate-100 transition-all shadow-sm"
                                        >
                                            <ChevronLeft size={16} strokeWidth={3} />
                                        </button>
                                        <button
                                            onClick={() => viewMode === 'month' || viewMode === 'year' ? setActiveMonth(prev => Math.min(MONTHS.length - 1, prev + 1)) : setActiveWeek(prev => Math.min(4, prev + 1))}
                                            className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#0B132B] hover:bg-slate-100 transition-all shadow-sm"
                                        >
                                            <ChevronRight size={16} strokeWidth={3} />
                                        </button>
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <div className="flex items-baseline gap-3">
                                            <span className="text-white font-medium text-[22px] tracking-wide uppercase leading-none mt-1">
                                                {MONTHS[activeMonth]}
                                            </span>
                                        </div>
                                        <span className="text-white font-bold text-[13px] tracking-wide mt-1 uppercase">
                                            {activeYear} • WEEK {activeWeek}
                                        </span>
                                    </div>
                                </div>

                                {/* Right: Delivery + Toggles */}
                                <div className="flex items-center gap-8">

                                    {/* Sync status */}
                                    {syncStatus !== 'idle' && (
                                        <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${syncStatus === 'error' ? 'text-rose-400' : syncStatus === 'saved' ? 'text-[#4ECDC4]' : 'text-white/40'}`}>
                                            <RefreshCw size={12} className={syncStatus === 'syncing' ? 'animate-spin' : ''} />
                                            {syncStatus === 'syncing' ? 'SAVING...' : syncStatus === 'error' ? 'FAILED' : 'SYNCED'}
                                        </div>
                                    )}

                                    {/* Delivery day dropdown */}
                                    <div className="bg-white rounded-full px-5 py-2 flex items-center gap-2 shadow-sm">
                                        <span className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">DELIVERY:</span>
                                        <select
                                            value={psheDay}
                                            onChange={(e) => setPsheDay(e.target.value)}
                                            className="bg-transparent border-none text-[12px] font-bold text-slate-900 focus:ring-0 cursor-pointer uppercase tracking-tight p-0 outline-none"
                                        >
                                            <option value="Monday">MON</option>
                                            <option value="Tuesday">TUE</option>
                                            <option value="Wednesday">WED</option>
                                            <option value="Thursday">THU</option>
                                            <option value="Friday">FRI</option>
                                            <option value="All Days">ALL</option>
                                        </select>
                                    </div>

                                    {/* View toggles */}
                                    <div className="flex items-center gap-4 text-[11px] font-bold tracking-widest uppercase text-white/50">
                                        {['daily', 'week', 'month', 'year'].map((mode) => (
                                            <button
                                                key={mode}
                                                onClick={() => setViewMode(mode as any)}
                                                className={`transition-colors ${viewMode === mode ? 'text-brand-accent' : 'hover:text-white'}`}
                                            >
                                                [{mode.toUpperCase()}{viewMode === mode ? ' ✓' : ''}]
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* scheduling grid wrapper */}
                            <div className="flex-grow flex flex-col">

                                {/* The Scheduling Grid */}
                                {
                                    viewMode === 'daily' ? (
                                        <div className="w-full h-full">
                                            {DAYS.filter(day => psheDay === 'All Days' ? true : day === psheDay.toUpperCase()).map((day) => {
                                                const rawModule = scheduledModules[`${activeYear}-${activeClass}-${activeMonth}-${activeWeek}-${day}`];
                                                const scheduledModule = getLocalizedContent(rawModule, activeRegion.id);
                                                return (
                                                    <div key={day} className="h-full flex flex-col gap-3">

                                                        {/* Status bar */}
                                                        <div className="flex items-center justify-between px-1">
                                                            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-brand-primary/40">
                                                                Active Delivery Day: <span className="text-brand-accent">{day}</span>
                                                            </p>
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Ready to Teach</span>
                                                            </div>
                                                        </div>

                                                        <DroppableDayCell id={`${activeYear}-${activeClass}-${activeMonth}-${activeWeek}-${day}`}>
                                                            <div
                                                                className={`w-full rounded-2xl border-2 border-dashed transition-all relative overflow-hidden
                                                                        ${scheduledModule
                                                                        ? 'border-transparent bg-transparent'
                                                                        : 'border-brand-primary/10 hover:border-brand-accent/40 bg-white/50 hover:bg-white min-h-[500px] flex items-center justify-center cursor-pointer group'}
                                                                    `}
                                                                onClick={() => {
                                                                    if (!scheduledModule && !isTeacher) {
                                                                        handleSchedule(day, String(Math.floor(Math.random() * 10) + 1));
                                                                    }
                                                                }}
                                                            >
                                                                <AnimatePresence mode="wait">
                                                                    {scheduledModule ? (
                                                                        <motion.div
                                                                            initial={{ opacity: 0, y: 8 }}
                                                                            animate={{ opacity: 1, y: 0 }}
                                                                            transition={{ duration: 0.3 }}
                                                                            className="w-full"
                                                                        >
                                                                            {/* ── TWO-COLUMN LESSON DASHBOARD ── */}
                                                                            <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-4">

                                                                                {/* LEFT — Lesson Hero */}
                                                                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col relative overflow-hidden">

                                                                                    {/* Left Colour bar */}
                                                                                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${scheduledModule.color || 'bg-[#4ECDC4]'}`} />

                                                                                    <div className="p-6 pl-8 flex flex-col gap-5 flex-grow">
                                                                                        {/* Category + Remove */}
                                                                                        <div className="flex items-start justify-between">
                                                                                            <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                                                                                                {scheduledModule.category || scheduledModule.context || 'PSHE'}
                                                                                            </span>
                                                                                            {!isTeacher && (
                                                                                                <button
                                                                                                    onClick={async (e) => {
                                                                                                        e.stopPropagation();
                                                                                                        const key = `${activeYear}-${activeClass}-${activeMonth}-${activeWeek}-${day}`;
                                                                                                        setScheduledModules(prev => {
                                                                                                            const next = { ...prev };
                                                                                                            delete next[key];
                                                                                                            return next;
                                                                                                        });
                                                                                                        const { data: { session: delSession } } = await supabase.auth.getSession();
                                                                                                        const delUserId = delSession?.user?.id;
                                                                                                        if (!delUserId) return;
                                                                                                        await supabase.from('teacher_schedules').delete().match({
                                                                                                            user_id: delUserId,
                                                                                                            year_group: activeYear,
                                                                                                            class_id: activeClass,
                                                                                                            month_index: activeMonth,
                                                                                                            week_number: activeWeek,
                                                                                                            day_of_week: day
                                                                                                        });
                                                                                                    }}
                                                                                                    className="p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-500 rounded-md transition-colors"
                                                                                                    title="Remove Lesson"
                                                                                                >
                                                                                                    <Trash2 size={16} />
                                                                                                </button>
                                                                                            )}
                                                                                        </div>

                                                                                        {/* Module Title */}
                                                                                        <div>
                                                                                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight leading-snug">
                                                                                                {scheduledModule.title}
                                                                                            </h2>
                                                                                        </div>

                                                                                        {/* Description */}
                                                                                        <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
                                                                                            Full interactive presentation deck including embedded videos and transition activities designed for {activeYear} students.
                                                                                        </p>

                                                                                        {/* Meta row */}
                                                                                        <div className="flex items-center gap-4 pt-2">
                                                                                            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                                                                                <Clock size={14} className="text-[#4ECDC4]" />
                                                                                                45 mins
                                                                                            </div>
                                                                                            <div className="w-1 h-1 rounded-full bg-slate-200" />
                                                                                            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                                                                                <span className="text-base leading-none">{activeRegion.flag}</span>
                                                                                                {activeRegion.name} Localised
                                                                                            </div>
                                                                                            <div className="w-1 h-1 rounded-full bg-slate-200" />
                                                                                            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                                                                                                V2.4 Active
                                                                                            </span>
                                                                                        </div>

                                                                                        {/* Spacer */}
                                                                                        <div className="flex-grow" />

                                                                                        {/* Launch CTA */}
                                                                                        <button
                                                                                            onClick={(e) => {
                                                                                                e.stopPropagation();
                                                                                                if (scheduledModule.presentation_url) {
                                                                                                    setActivePresentation({ url: scheduledModule.presentation_url, title: scheduledModule.title });
                                                                                                }
                                                                                            }}
                                                                                            className={`mt-4 w-full sm:w-auto self-start px-6 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all flex items-center justify-center gap-2
                                                                                                    ${scheduledModule.presentation_url
                                                                                                    ? 'bg-slate-900 hover:bg-slate-800 text-white'
                                                                                                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                                                                                        >
                                                                                            <PlayCircle size={16} />
                                                                                            Launch Presentation
                                                                                        </button>
                                                                                    </div>
                                                                                </div>

                                                                                {/* RIGHT — Resource Panel */}
                                                                                <div className="flex flex-col gap-3">

                                                                                    {/* Teacher Briefing */}
                                                                                    <div
                                                                                        className="bg-white rounded-xl border border-slate-200 p-5 cursor-pointer hover:border-[#4ECDC4]/50 hover:shadow-sm transition-all group"
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            if (scheduledModule.video_url) window.open(scheduledModule.video_url, '_blank');
                                                                                        }}
                                                                                    >
                                                                                        <div className="flex items-center gap-3 mb-2">
                                                                                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-[#4ECDC4] group-hover:scale-105 transition-transform flex-shrink-0 border border-slate-100">
                                                                                                <Video size={16} />
                                                                                            </div>
                                                                                            <p className="text-xs font-bold text-slate-800 uppercase tracking-wide">Teacher Briefing</p>
                                                                                        </div>
                                                                                        <p className="text-sm text-slate-600 leading-relaxed mb-3">
                                                                                            Spend 3 minutes with our subject expert before you teach it.
                                                                                        </p>
                                                                                        <button className="flex items-center gap-1.5 text-xs font-semibold text-[#4ECDC4]">
                                                                                            Watch Video Insights <PlayCircle size={14} />
                                                                                        </button>
                                                                                    </div>

                                                                                    {/* Regional Assets */}
                                                                                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                                                                                        <div className="flex items-center justify-between mb-3">
                                                                                            <div className="flex items-center gap-2">
                                                                                                <span className="text-base">{activeRegion.flag}</span>
                                                                                                <p className="text-xs font-bold text-slate-800 uppercase tracking-wide">{activeRegion.name} Assets</p>
                                                                                            </div>
                                                                                            <div className="flex items-center gap-1.5">
                                                                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                                                                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">Localised</span>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="space-y-2">
                                                                                            {[
                                                                                                `Slides updated with ${activeRegion.location} imagery & cultural context.`,
                                                                                                `Legal: ${activeRegion.statutoryTerm} framework cross-referenced.`
                                                                                            ].map((item, i) => (
                                                                                                <div key={i} className="flex items-start gap-2.5">
                                                                                                    <div className="w-1 h-3 rounded-full bg-[#4ECDC4] mt-1 flex-shrink-0" />
                                                                                                    <p className="text-sm text-slate-600 leading-relaxed">{item}</p>
                                                                                                </div>
                                                                                            ))}
                                                                                        </div>
                                                                                    </div>

                                                                                    {/* Lesson notes if present */}
                                                                                    {(scheduledModule.lesson_notes || scheduledModule.teacher_notes || scheduledModule.in_lesson_material) && (
                                                                                        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
                                                                                            <div className="flex items-center gap-2 mb-2">
                                                                                                <div className="w-7 h-7 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center">
                                                                                                    <FileText size={14} className="text-slate-500" />
                                                                                                </div>
                                                                                                <p className="text-xs font-bold text-slate-800 uppercase tracking-wide">Lesson Materials</p>
                                                                                            </div>
                                                                                            {scheduledModule.in_lesson_material && (
                                                                                                <a href={scheduledModule.in_lesson_material} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors group">
                                                                                                    <div className="flex items-center gap-2 text-slate-700">
                                                                                                        <LinkIcon size={14} /><span className="text-sm font-semibold">In-Lesson Handout</span>
                                                                                                    </div>
                                                                                                    <ExternalLink size={14} className="text-slate-400 group-hover:text-slate-600" />
                                                                                                </a>
                                                                                            )}
                                                                                            {scheduledModule.teacher_notes && (
                                                                                                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200/60">
                                                                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700 mb-1.5 flex items-center gap-1.5"><Lock size={12} /> Confidential Tips</p>
                                                                                                    <p className="text-sm text-amber-900 leading-relaxed">{scheduledModule.teacher_notes}</p>
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                    )}

                                                                                    {/* Teacher Resources */}
                                                                                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                                                                                        <p className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-3">Teacher Resources</p>
                                                                                        <div className="space-y-2">
                                                                                            {[
                                                                                                { label: 'Teacher Script (PDF)', icon: FileText },
                                                                                                { label: 'Student Worksheets', icon: FileText }
                                                                                            ].map(({ label, icon: Icon }) => (
                                                                                                <button key={label} className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-[#4ECDC4]/30 hover:bg-white transition-all group">
                                                                                                    <div className="flex items-center gap-3">
                                                                                                        <Icon size={16} className="text-slate-400 group-hover:text-[#4ECDC4] transition-colors" />
                                                                                                        <span className="text-sm font-semibold text-slate-700">{label}</span>
                                                                                                    </div>
                                                                                                    <Download size={14} className="text-slate-400 group-hover:text-[#4ECDC4] transition-colors" />
                                                                                                </button>
                                                                                            ))}
                                                                                        </div>
                                                                                    </div>

                                                                                    {/* HoD Tip */}
                                                                                    <div className="bg-emerald-50 rounded-xl border border-emerald-100 p-5">
                                                                                        <div className="flex items-center gap-2 mb-2">
                                                                                            <MessageSquare size={16} className="text-emerald-600" />
                                                                                            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide">HoD Tip</p>
                                                                                        </div>
                                                                                        <p className="text-sm text-emerald-900/80 italic leading-relaxed">
                                                                                            "Focus on the 'Online Footprint' section — this cohort has been very active on TikTok this term."
                                                                                        </p>
                                                                                    </div>

                                                                                    {/* Mark as Delivered */}
                                                                                    <button className="w-full py-4 bg-white border-2 border-brand-primary/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-brand-primary hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all flex items-center justify-center gap-2 active:scale-95">
                                                                                        Mark as Delivered <CheckCircle2 size={14} />
                                                                                    </button>
                                                                                </div>

                                                                            </div>{/* end two-col grid */}
                                                                        </motion.div>
                                                                    ) : (
                                                                        <div className="flex flex-col items-center justify-center gap-5 py-24 transition-transform group-hover:scale-105 duration-500 text-brand-secondary/30">
                                                                            {!isTeacher ? (
                                                                                <>
                                                                                    <div className="w-16 h-16 rounded-2xl bg-brand-bg flex items-center justify-center border border-brand-primary/5 transition-all group-hover:bg-brand-accent/10 group-hover:text-brand-accent group-hover:border-brand-accent/20 shadow-sm">
                                                                                        <Plus size={32} strokeWidth={2.5} />
                                                                                    </div>
                                                                                    <p className="text-xs font-bold tracking-wider font-display uppercase">Assign Lesson for {day}</p>
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <div className="w-16 h-16 rounded-2xl bg-brand-bg flex items-center justify-center border border-brand-primary/5 shadow-sm opacity-50">
                                                                                        <BookOpen size={32} strokeWidth={1} />
                                                                                    </div>
                                                                                    <p className="text-[10px] font-black tracking-wider font-display uppercase opacity-50">No Lesson Assigned</p>
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </AnimatePresence>
                                                            </div>
                                                        </DroppableDayCell>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : viewMode === 'week' ? (
                                        <div className="grid grid-cols-5 gap-4 flex-grow mb-4">
                                            {DAYS.map((day) => {
                                                const rawModule = scheduledModules[`${activeYear}-${activeClass}-${activeMonth}-${activeWeek}-${day}`];
                                                const scheduledModule = getLocalizedContent(rawModule, activeRegion.id);
                                                return (
                                                    <div key={day} className="flex flex-col gap-3">
                                                        {/* Day Header Pill (from screenshot) */}
                                                        <div className="bg-white rounded-lg border border-slate-200 shadow-sm py-2.5 flex items-center justify-center">
                                                            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#64748B]">
                                                                {day.slice(0, 3)}
                                                            </p>
                                                        </div>
                                                        <DroppableDayCell id={`${activeYear}-${activeClass}-${activeMonth}-${activeWeek}-${day}`}>
                                                            <div
                                                                className={`w-full transition-all relative overflow-hidden h-[340px] flex flex-col group cursor-pointer
                                                                    ${scheduledModule
                                                                        ? 'bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-200'
                                                                        : 'rounded-xl border-[1.5px] border-dashed border-[#E2E8F0] hover:border-[#4ECDC4]/40 bg-transparent flex items-center justify-center'
                                                                    }
                                                                `}
                                                                onClick={() => {
                                                                    if (scheduledModule) {
                                                                        setSelectedExecution(scheduledModule);
                                                                    } else if (!isTeacher) {
                                                                        handleSchedule(day, String(Math.floor(Math.random() * 10) + 1));
                                                                    }
                                                                }}
                                                            >
                                                                <AnimatePresence mode="wait">
                                                                    {scheduledModule ? (
                                                                        <motion.div
                                                                            initial={{ opacity: 0, scale: 0.95 }}
                                                                            animate={{ opacity: 1, scale: 1 }}
                                                                            className="w-full h-full flex flex-col p-6 relative"
                                                                        >
                                                                            {/* Left Color Indicator Bar (Screenshot style) */}
                                                                            <div className={`absolute left-0 top-0 bottom-0 w-[5px] ${scheduledModule.color || 'bg-amber-400'}`} />

                                                                            <div className="flex w-full justify-end items-start mb-4">
                                                                                <div className="h-1.5 w-6 rounded-full bg-slate-100" />
                                                                                {!isTeacher && (
                                                                                    <button
                                                                                        onClick={async (e) => {
                                                                                            e.stopPropagation();
                                                                                            const key = `${activeYear}-${activeClass}-${activeMonth}-${activeWeek}-${day}`;
                                                                                            setScheduledModules(prev => {
                                                                                                const next = { ...prev };
                                                                                                delete next[key];
                                                                                                return next;
                                                                                            });
                                                                                            const { data: { session: delSession2 } } = await supabase.auth.getSession();
                                                                                            const delUserId2 = delSession2?.user?.id;
                                                                                            if (!delUserId2) return;
                                                                                            await supabase
                                                                                                .from('teacher_schedules')
                                                                                                .delete()
                                                                                                .match({
                                                                                                    user_id: delUserId2,
                                                                                                    year_group: activeYear,
                                                                                                    class_id: activeClass,
                                                                                                    month_index: activeMonth,
                                                                                                    week_number: activeWeek,
                                                                                                    day_of_week: day
                                                                                                });
                                                                                        }}
                                                                                        className="absolute right-3 top-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                                                                                    >
                                                                                        <Trash2 size={14} />
                                                                                    </button>
                                                                                )}
                                                                            </div>
                                                                            <h4 className="text-[17px] font-black text-[#0B132B] leading-snug line-clamp-4">
                                                                                {scheduledModule.title}
                                                                            </h4>

                                                                            <div className="mt-auto w-full pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                                                                                <div className="flex items-center gap-1.5">
                                                                                    <Clock size={12} className="text-[#4ECDC4]" />
                                                                                    <span className="font-semibold text-[13px] text-slate-600">45m</span>
                                                                                </div>
                                                                                <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center border border-emerald-100 text-[#4ECDC4]">
                                                                                    <BookOpen size={12} className="text-emerald-500" />
                                                                                </div>
                                                                            </div>
                                                                        </motion.div>
                                                                    ) : (
                                                                        <div className="flex flex-col items-center gap-4 transition-transform group-hover:scale-105 duration-300">
                                                                            {!isTeacher ? (
                                                                                <>
                                                                                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-[#94A3B8] group-hover:text-[#4ECDC4] transition-colors border border-slate-100">
                                                                                        <Plus size={24} strokeWidth={2} />
                                                                                    </div>
                                                                                    <p className="text-[11px] font-black text-[#64748B] uppercase tracking-widest">
                                                                                        Assign Lesson
                                                                                    </p>
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <div className="w-12 h-12 rounded-full bg-[#F8FAFC] flex items-center justify-center text-[#94A3B8] border border-[#E2E8F0]">
                                                                                        <BookOpen size={24} className="opacity-50" />
                                                                                    </div>
                                                                                    <p className="text-[11px] font-black text-[#64748B] uppercase tracking-widest opacity-50">
                                                                                        No Lesson
                                                                                    </p>
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </AnimatePresence>
                                                            </div>
                                                        </DroppableDayCell>
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
                                                    {DAYS.filter(day => psheDay === 'All Days' || day === psheDay.toUpperCase()).map(day => (
                                                        <p key={day} className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-secondary/60 text-center">
                                                            {day.slice(0, 3)}
                                                        </p>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex-grow flex flex-col gap-4 overflow-y-auto pr-4 custom-scrollbar">
                                                {/* Standard 4-Week Month View */}
                                                {Array.from({ length: 4 }).map((_, i) => {
                                                    const wIndex = i;
                                                    const weekName = `Week ${i + 1}`;
                                                    return (
                                                        <div key={weekName} className="grid grid-cols-[100px_1fr] gap-6 items-stretch min-h-[140px]">
                                                            {/* Week Label Column */}
                                                            <div className="flex flex-col justify-center items-end pr-6 border-r border-brand-primary/10">
                                                                <span className="text-[10px] font-black text-brand-secondary/40 uppercase tracking-[0.2em] rotate-180 [writing-mode:vertical-lr] mb-2">
                                                                    PSHE
                                                                </span>
                                                                <span className="text-2xl font-black text-brand-primary font-display italic leading-none">
                                                                    S{wIndex + 1}
                                                                </span>
                                                            </div>

                                                            {/* Days Grid for this week */}
                                                            <div className={`grid ${psheDay === 'All Days' ? 'grid-cols-5' : 'grid-cols-1'} gap-6`}>
                                                                {DAYS.filter(day => psheDay === 'All Days' || day === psheDay.toUpperCase()).map(day => {
                                                                    let rawModule = scheduledModules[`${activeYear}-${activeClass}-${activeMonth}-${wIndex + 1}-${day}`];

                                                                    // FALLBACK: If no module on this specific day, check if ANY day in this week has a module
                                                                    // This ensures items added in Week view (e.g. on a Thursday) show up in the Month grid
                                                                    if (!rawModule) {
                                                                        const weekModules = DAYS.map(d => scheduledModules[`${activeYear}-${activeClass}-${activeMonth}-${wIndex + 1}-${d}`])
                                                                            .filter(Boolean);

                                                                        // Only fallback to a week's module if we are specifically looking at the active psheDay layout,
                                                                        // and that psheDay doesn't have a module natively. If 'All Days' is enabled, don't duplicate the same module 5 times.
                                                                        if (weekModules.length > 0 && psheDay !== 'All Days') {
                                                                            rawModule = weekModules[0];
                                                                        }
                                                                    }

                                                                    const scheduledModule = getLocalizedContent(rawModule, activeRegion.id);
                                                                    return (
                                                                        <DroppableDayCell id={`${activeYear}-${activeClass}-${activeMonth}-${wIndex + 1}-${day}`}>
                                                                            <motion.div
                                                                                key={`${weekName}-${day}`}
                                                                                whileHover={{ y: -4, scale: 1.02 }}
                                                                                onClick={() => {
                                                                                    if (scheduledModule) {
                                                                                        setSelectedExecution(scheduledModule);
                                                                                    } else if (!isTeacher) {
                                                                                        handleSchedule(day, String(Math.floor(Math.random() * 10) + 1), wIndex + 1);
                                                                                    }
                                                                                }}
                                                                                className={`rounded-xl border p-4 flex flex-col justify-between transition-all cursor-pointer relative overflow-hidden group h-full
                                                        ${scheduledModule
                                                                                        ? 'bg-white border-slate-200 shadow-sm'
                                                                                        : 'bg-[#F8FAFC]/50 border-dashed border-[#E2E8F0] hover:border-[#4ECDC4]/40 hover:bg-white'}
                                                    `}
                                                                            >
                                                                                {scheduledModule ? (
                                                                                    <>
                                                                                        <button
                                                                                            onClick={(e) => {
                                                                                                e.stopPropagation();
                                                                                                if (isTeacher) return;
                                                                                                setScheduledModules(prev => {
                                                                                                    const next = { ...prev };
                                                                                                    delete next[`${activeYear}-${activeClass}-${activeMonth}-${wIndex + 1}-${day}`];
                                                                                                    return next;
                                                                                                });
                                                                                            }}
                                                                                            className={`absolute top-2 right-2 p-1.5 bg-white hover:bg-rose-50 text-slate-300 hover:text-rose-500 rounded-full transition-all opacity-0 group-hover:opacity-100 z-10 border border-slate-100 hover:border-red-100 shadow-sm ${isTeacher ? 'hidden' : ''}`}
                                                                                        >
                                                                                            <Trash2 size={12} />
                                                                                        </button>
                                                                                        <div className="flex items-start justify-between mb-3">
                                                                                            <div className={`w-2 h-2 rounded-full ${scheduledModule.color} shadow-sm group-hover:scale-125 transition-transform`} />
                                                                                            <span className="text-[9px] font-semibold text-slate-500 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                                                                                                {scheduledModule.context}
                                                                                            </span>
                                                                                        </div>
                                                                                        <p className="text-[12px] font-bold text-slate-900 leading-[1.3] line-clamp-3 mb-2">
                                                                                            {scheduledModule.title}
                                                                                        </p>
                                                                                        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between text-slate-500">
                                                                                            <Clock size={10} className="text-[#4ECDC4]" />
                                                                                            <span className="text-[10px] font-medium">45m</span>
                                                                                        </div>
                                                                                    </>
                                                                                ) : (
                                                                                    <div className="flex-grow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                                                        {!isTeacher && <Plus size={16} className="text-[#94A3B8] group-hover:text-[#4ECDC4]" />}
                                                                                    </div>
                                                                                )}
                                                                            </motion.div>
                                                                        </DroppableDayCell>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ) : viewMode === 'year' ? (
                                        /* Year Overview Roadmap */
                                        <div className="flex-grow flex flex-col gap-6 overflow-y-auto pr-4 custom-scrollbar pb-12">
                                            {TERMS.map((term, tIndex) => (
                                                <div key={term.name} className="flex flex-col gap-4">
                                                    <div className="flex items-center gap-4 px-2">
                                                        <h3 className="text-xl font-black text-brand-primary font-display uppercase tracking-tight">{term.name}</h3>
                                                        <div className="h-px flex-grow bg-brand-primary/10" />
                                                    </div>
                                                    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                                                        {Array.from({ length: 4 }).map((_, mOffset) => {
                                                            const month_index = tIndex === 0 ? mOffset : tIndex === 1 ? 4 + mOffset : 7 + mOffset;
                                                            if (month_index > 10) return null; // Only up to 11 months

                                                            return (
                                                                <div key={month_index} className="flex flex-col gap-2">
                                                                    <p className="text-[10px] font-black text-brand-primary/40 uppercase tracking-widest">{MONTHS[month_index]}</p>
                                                                    <div className="grid grid-cols-4 gap-1">
                                                                        {Array.from({ length: 4 }).map((_, wIndex) => {
                                                                            const targetDay = activeRegion.id === 'uk' ? 'Wednesday' : 'Sunday';
                                                                            const targetId = `${activeYear}-${activeClass}-${month_index}-${wIndex + 1}-${targetDay}`;
                                                                            let rawModule = scheduledModules[targetId];

                                                                            // Fallback search
                                                                            if (!rawModule) {
                                                                                for (const d of DAYS) {
                                                                                    const m = scheduledModules[`${activeYear}-${activeClass}-${month_index}-${wIndex + 1}-${d}`];
                                                                                    if (m) { rawModule = m; break; }
                                                                                }
                                                                            }

                                                                            const scheduledModule = getLocalizedContent(rawModule, activeRegion.id);
                                                                            return (
                                                                                <div
                                                                                    key={wIndex}
                                                                                    onClick={() => {
                                                                                        if (scheduledModule) {
                                                                                            setActiveMonth(month_index);
                                                                                            setActiveWeek(wIndex + 1);
                                                                                            setViewMode('week');
                                                                                        }
                                                                                    }}
                                                                                    className={`h-4 rounded-sm transition-all cursor-pointer ${scheduledModule ? scheduledModule.color + ' opacity-100 shadow-sm' : 'bg-brand-primary/5 hover:bg-brand-primary/10'}`}
                                                                                    title={scheduledModule ? `${MONTHS[month_index]} S${wIndex + 1}: ${scheduledModule.title}` : `${MONTHS[month_index]} S${wIndex + 1}: empty`}
                                                                                />
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center text-brand-secondary/40 py-20">View mode not supported</div>
                                    )}
                            </div>{/* end scheduling grid wrapper */}

                            {/* Lesson Delivery Control Center (Side Panel) */}
                            <AnimatePresence>
                                {
                                    selectedExecution && (
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
                                                    <div className="p-8 rounded-[2.5rem] bg-brand-bg border border-brand-primary/5 space-y-6">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <PlayCircle size={24} className="text-brand-accent" />
                                                                <p className="text-xs font-bold tracking-tight text-brand-primary">Lesson Content</p>
                                                            </div>
                                                            <span className="text-[9px] font-bold text-emerald-500 tracking-wider bg-emerald-50 px-2 py-1 rounded">V2.4 Active</span>
                                                        </div>
                                                        <p className="text-[11px] font-medium text-brand-secondary/70 leading-relaxed">
                                                            Full interactive presentation deck including embedded videos and transition activities.
                                                        </p>
                                                        <a
                                                            href={selectedExecution.presentation_url || '#'}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="w-full py-5 bg-brand-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl hover:bg-brand-accent transition-all flex items-center justify-center gap-3 group active:scale-95 no-underline"
                                                        >
                                                            Open Presentation
                                                            <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                                        </a>
                                                        <div className="flex items-center gap-2 justify-center py-2 opacity-50">
                                                            <span className="text-[8px] font-bold uppercase tracking-widest text-brand-secondary">Proprietary Content • Single License Active</span>
                                                        </div>
                                                    </div>
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
                                                    <div className="p-6 rounded-[2rem] border border-brand-primary/10 bg-white shadow-sm space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-lg">{activeRegion.flag}</span>
                                                                <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary">{activeRegion.name} Assets</p>
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                                <span className="text-[8px] font-bold text-emerald-600 tracking-wide bg-emerald-50 px-2 py-1 rounded">Localised</span>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-3">
                                                            <div className="flex items-start gap-3">
                                                                <div className="w-1 h-3 rounded-full bg-brand-accent mt-0.5" />
                                                                <p className="text-[9px] font-bold text-brand-secondary/70 leading-relaxed uppercase tracking-tight">
                                                                    Slides updated with <span className="text-brand-primary">{activeRegion.location}</span> imagery &amp; cultural context.
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
                                                    <div className="space-y-4">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-brand-secondary/40 pl-2">Teacher Resources</p>
                                                        <div className="grid grid-cols-1 gap-3">
                                                            <button className="flex items-center justify-between p-5 bg-white border border-brand-primary/5 rounded-2xl hover:border-brand-accent/30 transition-all group">
                                                                <div className="flex items-center gap-4">
                                                                    <FileText size={18} className="text-brand-secondary" />
                                                                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Teacher Script (PDF)</span>
                                                                </div>
                                                                <Download size={14} className="text-brand-secondary/30 group-hover:text-brand-accent transition-colors" />
                                                            </button>
                                                            <button className="flex items-center justify-between p-5 bg-white border border-brand-primary/5 rounded-2xl hover:border-brand-accent/30 transition-all group">
                                                                <div className="flex items-center gap-4">
                                                                    <FileText size={18} className="text-brand-secondary" />
                                                                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Student Worksheets</span>
                                                                </div>
                                                                <Download size={14} className="text-brand-secondary/30 group-hover:text-brand-accent transition-colors" />
                                                            </button>
                                                        </div>
                                                    </div>
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
                                    )
                                }
                            </AnimatePresence>
                        </div>{/* end view content area */}
                    </div>{/* end main content area */}
                </div>{/* end flex row */}
            </DndContext>
        </div>
    );
};

export default CurriculumPlanner;
