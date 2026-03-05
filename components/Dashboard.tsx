import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Mail, Database, RefreshCw, Calendar, MapPin, Building2, Briefcase, CheckCircle, XCircle, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
    const { profile } = useAuth();
    const [activeTab, setActiveTab] = useState<'contacts' | 'leads' | 'teachers'>('contacts');
    const [contacts, setContacts] = useState<any[]>([]);
    const [leads, setLeads] = useState<any[]>([]);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            // First get the user's school ID if available
            const currentSchoolId = profile?.school_id;

            let teachersQuery = supabase.from('pending_invitations').select('*').order('created_at', { ascending: false });

            // If they are associated with a school, only show their school's invites
            if (currentSchoolId) {
                teachersQuery = teachersQuery.eq('school_id', currentSchoolId);
            }

            const [contactsRes, leadsRes, teachersRes] = await Promise.all([
                supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }),
                supabase.from('lead_magnet_submissions').select('*').order('created_at', { ascending: false }),
                teachersQuery
            ]);

            if (contactsRes.data) setContacts(contactsRes.data);
            if (leadsRes.data) setLeads(leadsRes.data);
            if (teachersRes.data) setTeachers(teachersRes.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (profile !== undefined) {
            fetchData();
        }
    }, [profile]);

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const StatCard = ({ title, value, icon: Icon, color }: any) => (
        <div className="bg-white p-8 rounded-[2rem] border border-brand-primary/5 transition-all duration-300 hover:border-brand-primary/15 flex items-center gap-6 group">
            <div className={`p - 5 rounded - 2xl ${color} transition - transform group - hover: scale - 105 duration - 300`}>
                <Icon size={28} />
            </div>
            <div>
                <p className="text-[10px] font-black text-brand-secondary/40 uppercase tracking-widest mb-1">{title}</p>
                <p className="text-3xl font-black text-brand-primary tracking-tighter">{value}</p>
            </div>
        </div>
    );

    return (
        <>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                <div>
                    <h1 className="text-5xl md:text-7xl font-black italic text-brand-primary tracking-tighter font-display leading-[0.85] uppercase">
                        <span className="block">{profile?.full_name?.split(' ')[0] || 'Dashboard'}</span>
                        <span className="text-brand-accent block">Insights.</span>
                    </h1>
                    <p className="text-[10px] font-black uppercase text-brand-secondary/40 mt-3 tracking-[0.2em]">REAL-TIME ENGAGEMENT METRICS</p>
                </div>

                <button
                    onClick={fetchData}
                    disabled={loading}
                    className="flex items-center gap-3 px-8 py-4 bg-brand-primary text-white rounded-full font-bold uppercase tracking-widest text-[12px] hover:bg-brand-accent transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-brand-primary/20"
                >
                    <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    {loading ? 'REFRESHING...' : 'REFRESH DATA'}
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <StatCard
                    title="Total Inquiries"
                    value={contacts.length}
                    icon={Users}
                    color="bg-brand-accent/10 text-brand-accent"
                />
                <StatCard
                    title="Sample Requests"
                    value={leads.length}
                    icon={Mail}
                    color="bg-emerald-50 text-emerald-600"
                />
                <StatCard
                    title="Global Conversion"
                    value={`${Math.round(((contacts.length + leads.length) / (contacts.length + leads.length || 1)) * 100)}% `}
                    icon={Database}
                    color="bg-brand-primary/10 text-brand-primary"
                />
            </div>

            {/* Content Tabs */}
            <div className="bg-white rounded-[3.5rem] border border-brand-primary/5 shadow-2xl overflow-hidden min-h-[600px]">
                <div className="flex border-b border-brand-primary/5 p-4 bg-brand-primary/5">
                    <button
                        onClick={() => setActiveTab('contacts')}
                        className={`flex - 1 flex items - center justify - center gap - 3 py - 6 rounded - 3xl font - black uppercase tracking - widest text - [12px] transition - all font - display cursor - pointer ${activeTab === 'contacts' ? 'bg-white text-brand-primary shadow-lg' : 'text-brand-secondary hover:text-brand-primary'
                            } `}
                    >
                        <Users size={18} />
                        Contact Submissions
                    </button>
                    <button
                        onClick={() => setActiveTab('teachers')}
                        className={`flex - 1 flex items - center justify - center gap - 3 py - 6 rounded - 3xl font - black uppercase tracking - widest text - [12px] transition - all font - display cursor - pointer ${activeTab === 'teachers' ? 'bg-white text-brand-primary shadow-lg' : 'text-brand-secondary hover:text-brand-primary'
                            } `}
                    >
                        <Briefcase size={18} />
                        Teacher Roster
                    </button>
                    <button
                        onClick={() => setActiveTab('leads')}
                        className={`flex - 1 flex items - center justify - center gap - 3 py - 6 rounded - 3xl font - black uppercase tracking - widest text - [12px] transition - all font - display cursor - pointer ${activeTab === 'leads' ? 'bg-white text-brand-primary shadow-lg' : 'text-brand-secondary hover:text-brand-primary'
                            } `}
                    >
                        <Mail size={18} />
                        Lead Magnet Exports
                    </button>
                </div>

                <div className="p-8">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 space-y-6">
                            <div className="w-12 h-12 border-4 border-brand-accent/20 border-t-brand-accent rounded-full animate-spin" />
                            <p className="text-brand-secondary font-bold uppercase tracking-widest text-[10px]">Accessing Supabase...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left font-sans">
                                <thead>
                                    <tr className="border-b border-brand-primary/5">
                                        <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-brand-secondary">Timestamp</th>
                                        <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-brand-secondary">Full Name</th>
                                        {activeTab === 'contacts' ? (
                                            <>
                                                <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-brand-secondary">School / Email</th>
                                                <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-brand-secondary">Region / Role</th>
                                                <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-brand-secondary">Inquiry Details</th>
                                            </>
                                        ) : activeTab === 'teachers' ? (
                                            <>
                                                <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-brand-secondary">Email Address</th>
                                                <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-brand-secondary">Classes Assigned</th>
                                                <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-brand-secondary text-right">Status</th>
                                            </>
                                        ) : (
                                            <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-brand-secondary">Email Address</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand-primary/5">
                                    {(activeTab === 'contacts' ? contacts : activeTab === 'leads' ? leads : teachers).map((item) => (
                                        <tr key={item.id} className="group hover:bg-brand-primary/5 transition-colors">
                                            <td className="py-8">
                                                <div className="flex items-center gap-2 text-brand-secondary font-medium whitespace-nowrap">
                                                    <Calendar size={14} />
                                                    {formatDate(item.created_at)}
                                                </div>
                                            </td>
                                            <td className="py-8">
                                                <div className="font-black text-brand-primary font-display uppercase tracking-tight text-lg whitespace-nowrap">{item.full_name || 'Pending Invite'}</div>
                                            </td>

                                            {activeTab === 'contacts' ? (
                                                <>
                                                    <td className="py-8">
                                                        <div className="flex flex-col gap-1">
                                                            <div className="flex items-center gap-2 font-bold text-brand-primary whitespace-nowrap">
                                                                <Building2 size={14} className="text-brand-accent" />
                                                                {item.school_name}
                                                            </div>
                                                            <div className="text-brand-secondary text-sm blur-sm hover:blur-none transition-all">{item.email}</div>
                                                        </div>
                                                    </td>
                                                    <td className="py-8">
                                                        <div className="flex flex-col gap-1">
                                                            <div className="flex items-center gap-2 font-bold text-brand-primary whitespace-nowrap">
                                                                <MapPin size={14} className="text-brand-accent" />
                                                                {item.region}
                                                            </div>
                                                            <div className="flex items-center gap-2 text-brand-secondary text-sm">
                                                                <Briefcase size={14} />
                                                                {item.job_title}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-8 max-w-sm">
                                                        <p className="text-sm text-brand-secondary italic leading-relaxed">
                                                            "{item.message || 'No message provided'}"
                                                        </p>
                                                    </td>
                                                </>
                                            ) : activeTab === 'teachers' ? (
                                                <>
                                                    <td className="py-8">
                                                        <div className="flex items-center gap-2 text-brand-secondary text-sm">
                                                            <Mail size={14} />
                                                            {item.email}
                                                        </div>
                                                    </td>
                                                    <td className="py-8">
                                                        <div className="flex flex-wrap gap-2">
                                                            {item.classes ? (
                                                                item.classes.split(',').map((cls: string, i: number) => (
                                                                    <span key={i} className="px-2 py-1 bg-brand-primary/5 text-brand-primary font-bold text-[10px] rounded-md uppercase tracking-widest border border-brand-primary/10">
                                                                        {cls.trim()}
                                                                    </span>
                                                                ))
                                                            ) : (
                                                                <span className="text-brand-secondary/50 text-sm italic">Not assigned yet</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="py-8 text-right">
                                                        {item.status === 'accepted' ? (
                                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full font-bold text-[10px] uppercase tracking-widest border border-emerald-100">
                                                                <CheckCircle size={14} /> Active
                                                            </div>
                                                        ) : item.status === 'expired' ? (
                                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-600 rounded-full font-bold text-[10px] uppercase tracking-widest border border-rose-100">
                                                                <XCircle size={14} /> Expired
                                                            </div>
                                                        ) : (
                                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 rounded-full font-bold text-[10px] uppercase tracking-widest border border-amber-100">
                                                                <Clock size={14} /> Pending
                                                            </div>
                                                        )}
                                                    </td>
                                                </>
                                            ) : (
                                                <td className="py-8">
                                                    <div className="text-brand-primary font-bold">{item.email}</div>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                    {(activeTab === 'contacts' ? contacts : activeTab === 'leads' ? leads : teachers).length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="py-32 text-center text-brand-secondary font-medium italic">
                                                No submissions found yet. Time to launch!
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Dashboard;
