import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Users, Calendar, ArrowRight, ArrowLeft, Building2, CheckCircle2, Loader2, Plus, Trash2, LibraryBig } from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface TeacherInput {
    id: string;
    name: string;
    email: string;
    yearGroups: string;
    classes: string;
}

const CoordinatorOnboarding: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Dynamic Onboarding Data
    const [onboardingToken, setOnboardingToken] = useState<string | null>(null);
    const [teacherLimit, setTeacherLimit] = useState(0);

    // Step 1: Coordinator Profile
    const [coordinator, setCoordinator] = useState({
        name: '',
        email: '',
        password: '',
        position: ''
    });

    // Step 2: School Details
    const [school, setSchool] = useState({
        id: '',
        name: '',
        region: 'UK',
        locked: false
    });

    // Automatically clear any stale sessions when landing on the onboarding page
    React.useEffect(() => {
        const clearStaleSession = async () => {
            const { data } = await supabase.auth.getSession();
            if (data.session) {
                console.log("Clearing stale session during onboarding...");
                await supabase.auth.signOut();
                localStorage.clear();
            }
        };
        clearStaleSession();
    }, []);

    // Fetch School details if token is present
    React.useEffect(() => {
        const fetchSchoolDetails = async () => {
            const queryParams = new URLSearchParams(location.search);
            const token = queryParams.get('token');
            if (token) {
                setOnboardingToken(token);
                try {
                    const { data, error } = await supabase
                        .from('schools')
                        .select('*')
                        .eq('onboarding_token', token)
                        .single();

                    if (data && !error) {
                        setSchool({
                            id: data.id,
                            name: data.name,
                            region: data.region,
                            locked: true
                        });
                        if (data.teacher_limit) {
                            setTeacherLimit(data.teacher_limit);
                        }
                    }
                } catch (err) {
                    console.error("Invalid onboarding token:", err);
                }
            }
        };
        fetchSchoolDetails();
    }, [location.search]);

    // Step 3: Teachers
    const [teachers, setTeachers] = useState<TeacherInput[]>([
        { id: '1', name: '', email: '', yearGroups: '', classes: '' }
    ]);

    // Step 4: Content Setup
    const [prepopulate, setPrepopulate] = useState(true);
    const [sampleDay, setSampleDay] = useState('Wednesday');

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const addTeacher = () => {
        setTeachers([...teachers, { id: Math.random().toString(), name: '', email: '', yearGroups: '', classes: '' }]);
    };

    const removeTeacher = (id: string) => {
        if (teachers.length > 1) {
            setTeachers(teachers.filter(t => t.id !== id));
        }
    };

    const updateTeacher = (id: string, field: keyof TeacherInput, value: string) => {
        setTeachers(teachers.map(t => t.id === id ? { ...t, [field]: value } : t));
    };
    const handleComplete = async () => {
        setLoading(true);
        setError(null);
        try {
            // 1. Sign up the coordinator via Supabase Auth
            let { data: authData, error: authError } = await supabase.auth.signUp({
                email: coordinator.email,
                password: coordinator.password,
                options: {
                    data: {
                        full_name: coordinator.name,
                        position: coordinator.position,
                        role: 'coordinator'
                    }
                }
            });

            // If user already exists, try to log them in instead
            if (authError && authError.message.includes('User already registered')) {
                const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                    email: coordinator.email,
                    password: coordinator.password
                });
                if (signInError) {
                    throw new Error("User already exists. Please use your existing password, or clear your auth state to start fresh.");
                }
                authData = signInData;
                authError = null;
            } else if (authError) {
                throw authError;
            }

            // Wait temporarily to ensure the Auth trigger has completed inserting the profile
            await new Promise(resolve => setTimeout(resolve, 500));

            let currentSchoolId = school.id;

            // 2. Handle School Data
            if (onboardingToken && currentSchoolId) {
                // School already exists via WooCommerce, just mark token as claimed (nullify it so it can't be reused)
                await supabase
                    .from('schools')
                    .update({ onboarding_token: null })
                    .eq('id', currentSchoolId);
            } else {
                // Manual signup, create a new school
                const { data: newSchool, error: schoolError } = await supabase
                    .from('schools')
                    .insert({
                        name: school.name,
                        region: school.region,
                        teacher_limit: 5 // Default limit for manual signups
                    })
                    .select()
                    .single();

                if (schoolError) throw schoolError;
                if (newSchool) currentSchoolId = newSchool.id;
            }

            // 3. Link Profile to School
            if (authData.user && currentSchoolId) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .update({ school_id: currentSchoolId })
                    .eq('id', authData.user.id);

                if (profileError) console.error("Could not link profile to school:", profileError);
            }

            // 4. Save Pending Teacher Invitations
            if (teachers.length > 0 && currentSchoolId) {
                const validTeachers = teachers.filter(t => t.name.trim() !== '' && t.email.trim() !== '');
                const invites = validTeachers.map(t => ({
                    school_id: currentSchoolId,
                    email: t.email,
                    full_name: t.name,
                    year_groups: t.yearGroups,
                    classes: t.classes,
                    status: 'pending'
                }));

                if (invites.length > 0) {
                    const { error: inviteError } = await supabase
                        .from('pending_invitations')
                        .insert(invites);

                    if (inviteError) {
                        console.error("Error saving invitations:", inviteError);
                        // Store in local storage as a fallback just in case
                        localStorage.setItem('clarity_mock_teachers', JSON.stringify(teachers));
                    }
                }
            }

            if (prepopulate) {
                localStorage.setItem('clarity_import_sample', 'true');
                localStorage.setItem('clarity_sample_day', sampleDay);
            } else {
                localStorage.removeItem('clarity_import_sample');
                localStorage.removeItem('clarity_sample_day');
            }

            // Assuming successful setup, redirect to dashboard
            setTimeout(() => {
                navigate('/dashboard/planner');
            }, 1000);

        } catch (err: any) {
            setError(err.message || 'An error occurred during setup. Please try again.');
            setLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-black text-brand-primary font-display tracking-tight mb-2">Coordinator Profile</h2>
                            <p className="text-brand-secondary font-medium">Let's start by setting up your admin account.</p>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-brand-primary mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={coordinator.name}
                                    onChange={(e) => setCoordinator({ ...coordinator, name: e.target.value })}
                                    className="w-full px-4 py-4 rounded-2xl bg-brand-bg border border-brand-primary/10 font-medium focus:bg-white focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/10 outline-none transition-all"
                                    placeholder="e.g. Jane Smith"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-brand-primary mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={coordinator.email}
                                    onChange={(e) => setCoordinator({ ...coordinator, email: e.target.value })}
                                    className="w-full px-4 py-4 rounded-2xl bg-brand-bg border border-brand-primary/10 font-medium focus:bg-white focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/10 outline-none transition-all"
                                    placeholder="jane.smith@school.sch.uk"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-brand-primary mb-2">Password</label>
                                <input
                                    type="password"
                                    value={coordinator.password}
                                    onChange={(e) => setCoordinator({ ...coordinator, password: e.target.value })}
                                    className="w-full px-4 py-4 rounded-2xl bg-brand-bg border border-brand-primary/10 font-medium focus:bg-white focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/10 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-brand-primary mb-2">Position / Role</label>
                                <input
                                    type="text"
                                    value={coordinator.position}
                                    onChange={(e) => setCoordinator({ ...coordinator, position: e.target.value })}
                                    className="w-full px-4 py-4 rounded-2xl bg-brand-bg border border-brand-primary/10 font-medium focus:bg-white focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/10 outline-none transition-all"
                                    placeholder="e.g. Head of PSHE"
                                />
                            </div>
                        </div>
                        <div className="pt-6">
                            <button
                                onClick={handleNext}
                                disabled={!coordinator.name || !coordinator.email || !coordinator.password}
                                className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-brand-primary/20 hover:bg-brand-primary/90 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                            >
                                Continue to School Details
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="text-center mb-8">
                            <div className="mx-auto w-16 h-16 bg-brand-primary/5 rounded-2xl flex items-center justify-center mb-4 text-brand-primary">
                                <Building2 size={32} />
                            </div>
                            <h2 className="text-3xl font-black text-brand-primary font-display tracking-tight mb-2">School Details</h2>
                            <p className="text-brand-secondary font-medium">Tell us about your institution to tailor your content.</p>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-brand-primary mb-2">School Name</label>
                                <input
                                    type="text"
                                    value={school.name}
                                    onChange={(e) => setSchool({ ...school, name: e.target.value })}
                                    disabled={school.locked}
                                    className={`w-full px-4 py-4 rounded-2xl border border-brand-primary/10 font-medium focus:outline-none focus:ring-4 outline-none transition-all ${school.locked ? 'bg-brand-primary/5 text-brand-secondary cursor-not-allowed' : 'bg-brand-bg focus:bg-white focus:border-brand-accent focus:ring-brand-accent/10'}`}
                                    placeholder="e.g. Clarity Global Academy"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-brand-primary mb-2">Curriculum Region</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {['UK', 'HK', 'FR', 'ES'].map(region => (
                                        <button
                                            key={region}
                                            onClick={() => setSchool({ ...school, region })}
                                            disabled={school.locked}
                                            className={`py-4 rounded-xl font-black tracking-widest text-sm transition-all border-2 ${school.region === region
                                                ? 'bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/20'
                                                : 'bg-white text-brand-secondary border-brand-primary/10 hover:border-brand-primary/30'
                                                } ${school.locked ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {region}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-xs text-brand-secondary/60 mt-2 font-medium">This helps us align the default curriculum to your local statutory requirements.</p>
                            </div>
                        </div>
                        <div className="pt-6 flex gap-4">
                            <button
                                onClick={handleBack}
                                className="px-6 py-4 bg-white border border-brand-primary/10 text-brand-secondary hover:text-brand-primary rounded-2xl font-black tracking-widest text-sm transition-all"
                            >
                                <ArrowLeft size={18} />
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={!school.name}
                                className="flex-1 py-4 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-brand-primary/20 hover:bg-brand-primary/90 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                            >
                                Setup Teachers
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="text-center mb-6">
                            <div className="mx-auto w-16 h-16 bg-brand-primary/5 rounded-2xl flex items-center justify-center mb-4 text-brand-primary">
                                <Users size={32} />
                            </div>
                            <h2 className="text-3xl font-black text-brand-primary font-display tracking-tight mb-2">Teacher Roster</h2>
                            <p className="text-brand-secondary font-medium">Add the teachers who will be delivering the curriculum.</p>

                            {teacherLimit > 0 && (
                                <div className="mt-4 p-4 bg-[#0a6c5b]/10 border border-[#0a6c5b]/20 rounded-2xl flex items-start gap-3 text-left">
                                    <div className="mt-0.5 text-[#0a6c5b]"><CheckCircle2 size={16} /></div>
                                    <p className="text-sm text-brand-primary font-bold">Your plan includes up to <span className="text-[#0a6c5b] font-black">{teacherLimit} teachers</span>. You have added {teachers.length}.</p>
                                </div>
                            )}

                            <div className="mt-4 p-4 bg-brand-accent/10 border border-brand-accent/20 rounded-2xl flex items-start gap-3 text-left">
                                <div className="mt-0.5 text-brand-accent"><CheckCircle2 size={16} /></div>
                                <p className="text-sm text-brand-primary font-bold">When completing setup, an invitation email will be sent to these teachers to log in and set a password, giving them access to their own account.</p>
                            </div>
                        </div>

                        <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                            <AnimatePresence>
                                {teachers.map((t, index) => (
                                    <motion.div
                                        key={t.id}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="bg-brand-bg/50 border border-brand-primary/10 p-4 rounded-2xl relative group"
                                    >
                                        <div className="mb-3 flex justify-between items-center">
                                            <span className="text-xs font-black uppercase tracking-widest text-brand-accent">Teacher {index + 1}</span>
                                            {teachers.length > 1 && (
                                                <button onClick={() => removeTeacher(t.id)} className="text-red-400 hover:text-red-600 transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                placeholder="Full Name"
                                                value={t.name}
                                                onChange={(e) => updateTeacher(t.id, 'name', e.target.value)}
                                                className="px-4 py-3 rounded-xl bg-white border border-brand-primary/5 text-sm font-medium focus:ring-2 focus:ring-brand-accent/20 outline-none"
                                            />
                                            <input
                                                type="email"
                                                placeholder="Email Address"
                                                value={t.email}
                                                onChange={(e) => updateTeacher(t.id, 'email', e.target.value)}
                                                className="px-4 py-3 rounded-xl bg-white border border-brand-primary/5 text-sm font-medium focus:ring-2 focus:ring-brand-accent/20 outline-none"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Year Groups (e.g. 7, 8, 9)"
                                                value={t.yearGroups}
                                                onChange={(e) => updateTeacher(t.id, 'yearGroups', e.target.value)}
                                                className="px-4 py-3 rounded-xl bg-white border border-brand-primary/5 text-sm font-medium focus:ring-2 focus:ring-brand-accent/20 outline-none"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Classes (e.g. 7A, 7B)"
                                                value={t.classes}
                                                onChange={(e) => updateTeacher(t.id, 'classes', e.target.value)}
                                                className="px-4 py-3 rounded-xl bg-white border border-brand-primary/5 text-sm font-medium focus:ring-2 focus:ring-brand-accent/20 outline-none"
                                            />
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {(!teacherLimit || teachers.length < teacherLimit) && (
                            <button
                                onClick={addTeacher}
                                className="w-full py-4 border-2 border-dashed border-brand-primary/20 text-brand-primary font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-brand-primary/5 transition-colors"
                            >
                                <Plus size={18} /> Add Another Teacher
                            </button>
                        )}

                        <div className="pt-4 flex gap-4">
                            <button
                                onClick={handleBack}
                                className="px-6 py-4 bg-white border border-brand-primary/10 text-brand-secondary hover:text-brand-primary rounded-2xl font-black tracking-widest text-sm transition-all"
                            >
                                <ArrowLeft size={18} />
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={teachers.length > 0 && teachers.some(t => !t.name.trim() || !t.email.trim())}
                                className="flex-1 py-4 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-brand-primary/20 hover:bg-brand-primary/90 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:hover:translate-y-0"
                            >
                                Content Setup
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                );
            case 4:
                return (
                    <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="text-center mb-8">
                            <div className="mx-auto w-16 h-16 bg-brand-primary/5 rounded-2xl flex items-center justify-center mb-4 text-brand-primary">
                                <LibraryBig size={32} />
                            </div>
                            <h2 className="text-3xl font-black text-brand-primary font-display tracking-tight mb-2">Curriculum Setup</h2>
                            <p className="text-brand-secondary font-medium">How would you like to start your planner?</p>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={() => setPrepopulate(true)}
                                className={`w-full p-6 text-left transition-all ${prepopulate ? 'border-brand-primary bg-brand-primary/5 shadow-md rounded-t-2xl border-2 border-b-0' : 'border-brand-primary/10 bg-white hover:border-brand-primary/30 rounded-2xl border-2'}`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${prepopulate ? 'border-brand-primary bg-brand-primary text-white' : 'border-brand-primary/20'}`}>
                                        {prepopulate && <CheckCircle2 size={14} />}
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black text-brand-primary mb-1">Import Sample Calendar</h4>
                                        <p className="text-brand-secondary text-sm font-medium">Start with a recommended schedule tailored to statutory requirements.</p>
                                    </div>
                                </div>
                            </button>

                            <AnimatePresence>
                                {prepopulate && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="bg-brand-primary/5 border-2 border-t-0 border-brand-primary border-dashed rounded-b-2xl p-6 pt-2 overflow-hidden"
                                    >
                                        <label className="block text-sm font-bold text-brand-primary mb-2">Select PSHE Delivery Day</label>
                                        <select
                                            value={sampleDay}
                                            onChange={(e) => setSampleDay(e.target.value)}
                                            className="w-full px-4 py-4 rounded-xl bg-white border border-brand-primary/20 font-black text-brand-primary uppercase tracking-widest text-sm focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 outline-none cursor-pointer"
                                        >
                                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                                                <option key={day} value={day}>{day}</option>
                                            ))}
                                        </select>
                                        <p className="text-xs text-brand-secondary/60 mt-3 font-medium">We'll schedule the sample curriculum on this day for your classes.</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button
                                onClick={() => setPrepopulate(false)}
                                className={`w-full p-6 rounded-2xl border-2 text-left transition-all ${!prepopulate ? 'border-brand-primary bg-brand-primary/5 shadow-md' : 'border-brand-primary/10 bg-white hover:border-brand-primary/30'}`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${!prepopulate ? 'border-brand-primary bg-brand-primary text-white' : 'border-brand-primary/20'}`}>
                                        {!prepopulate && <CheckCircle2 size={14} />}
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black text-brand-primary mb-1">Start a Blank Calendar</h4>
                                        <p className="text-brand-secondary text-sm font-medium">Begin with a completely blank schedule and drag-and-drop modules from the library yourself.</p>
                                    </div>
                                </div>
                            </button>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold mt-4 border border-red-100">
                                {error}
                            </div>
                        )}

                        <div className="pt-6 flex gap-4">
                            <button
                                onClick={handleBack}
                                disabled={loading}
                                className="px-6 py-4 bg-white border border-brand-primary/10 text-brand-secondary hover:text-brand-primary rounded-2xl font-black tracking-widest text-sm transition-all disabled:opacity-50"
                            >
                                <ArrowLeft size={18} />
                            </button>
                            <button
                                onClick={handleComplete}
                                disabled={loading}
                                className="flex-1 py-4 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-brand-primary/20 hover:bg-brand-primary/90 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:hover:translate-y-0"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Complete Setup
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-brand-bg flex text-brand-primary font-sans relative overflow-hidden">
            {/* Background elements */}
            <div className="fixed top-[-20%] right-[-10%] w-[80%] h-[80%] rounded-full bg-brand-accent/20 blur-[120px] mix-blend-multiply pointer-events-none" />
            <div className="fixed bottom-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-[#d6efe8] blur-[100px] mix-blend-multiply opacity-50 pointer-events-none" />

            <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row shadow-2xl shadow-brand-primary/5 bg-white md:rounded-[3rem] my-auto min-h-screen md:min-h-[700px] border border-brand-primary/5 overflow-hidden z-10 relative">

                {/* Left side info panel */}
                <div className="hidden md:flex flex-col justify-between w-5/12 bg-brand-primary p-12 text-white relative overflow-hidden shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-primary to-[#0a2034] z-0" />

                    {/* Floating shapes */}
                    <div className="absolute top-20 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl z-0" />
                    <div className="absolute bottom-10 -left-10 w-60 h-60 bg-brand-accent/10 rounded-full blur-3xl z-0" />

                    <div className="relative z-10">
                        <Link to="/" className="inline-flex flex-col mb-16">
                            <span className="text-3xl font-black italic tracking-tighter uppercase font-display leading-none">
                                Cla<span className="text-brand-accent">rity.</span>
                            </span>
                        </Link>

                        <h1 className="text-4xl lg:text-5xl font-black leading-[1.1] tracking-tighter mb-6 font-display">
                            Build your PSHE curriculum in minutes.
                        </h1>
                        <p className="text-white/70 font-medium leading-relaxed max-w-sm">
                            Join hundreds of schools globally planning their contextual pastoral content with zero prep time.
                        </p>
                    </div>

                    <div className="relative z-10">
                        {/* Step Indicators */}
                        <div className="space-y-6">
                            {[
                                { num: 1, label: 'Coordinator Profile' },
                                { num: 2, label: 'School Details' },
                                { num: 3, label: 'Teacher Roster' },
                                { num: 4, label: 'Curriculum Setup' }
                            ].map((s) => (
                                <div key={s.num} className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-full font-black flex items-center justify-center text-sm transition-colors ${step >= s.num
                                        ? 'bg-brand-accent text-brand-primary'
                                        : 'bg-white/10 text-white/40'
                                        }`}>
                                        {step > s.num ? <CheckCircle2 size={16} /> : s.num}
                                    </div>
                                    <span className={`font-bold text-sm tracking-widest uppercase ${step >= s.num ? 'text-white' : 'text-white/40'}`}>
                                        {s.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right side form area */}
                <div className="flex-1 p-6 md:p-12 lg:p-16 flex flex-col justify-center bg-white">
                    <div className="max-w-xl w-full mx-auto">
                        <AnimatePresence mode="wait">
                            {renderStepContent()}
                        </AnimatePresence>

                        <div className="mt-12 text-center border-t border-brand-primary/5 pt-8">
                            <p className="text-brand-secondary text-sm font-medium">
                                Already have an account? <Link to="/login" className="text-brand-primary font-bold hover:text-brand-accent transition-colors">Sign in instead</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoordinatorOnboarding;
