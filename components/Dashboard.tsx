import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Users, Mail, Database, ArrowLeft, RefreshCw, Calendar, MapPin, Building2, Briefcase, LogOut } from 'lucide-react';

const Dashboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState<'contacts' | 'leads'>('contacts');
    const [contacts, setContacts] = useState<any[]>([]);
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [contactsRes, leadsRes] = await Promise.all([
                supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }),
                supabase.from('lead_magnet_submissions').select('*').order('created_at', { ascending: false })
            ]);

            if (contactsRes.data) setContacts(contactsRes.data);
            if (leadsRes.data) setLeads(leadsRes.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.reload(); // Simple way to reset state
    };

    useEffect(() => {
        fetchData();
    }, []);

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
        <div className="bg-white p-8 rounded-[2.5rem] border border-brand-primary/5 shadow-xl shadow-brand-primary/5 flex items-center gap-6">
            <div className={`p-5 rounded-2xl ${color}`}>
                <Icon size={28} />
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-brand-secondary mb-1">{title}</p>
                <p className="text-3xl font-black text-brand-primary font-display">{value}</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-brand-bg p-6 md:p-12 font-sans overflow-x-hidden">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                    <div>
                        <div className="flex items-center gap-6 mb-4">
                            <button
                                onClick={onBack}
                                className="group flex items-center gap-2 text-brand-accent font-bold uppercase tracking-widest text-[10px] hover:gap-3 transition-all cursor-pointer"
                            >
                                <ArrowLeft size={16} />
                                Website
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-red-400 font-bold uppercase tracking-widest text-[10px] hover:text-red-600 transition-colors cursor-pointer"
                            >
                                <LogOut size={14} />
                                Logout
                            </button>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-brand-primary tracking-tighter font-display leading-tight">
                            Admin <span className="text-brand-accent">Insights.</span>
                        </h1>
                    </div>

                    <button
                        onClick={fetchData}
                        disabled={loading}
                        className="flex items-center gap-3 px-8 py-4 bg-brand-primary text-white rounded-full font-bold uppercase tracking-widest text-[12px] hover:bg-brand-accent transition-all disabled:opacity-50 cursor-pointer"
                    >
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                        {loading ? 'Refreshing...' : 'Refresh Data'}
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
                        value={`${Math.round(((contacts.length + leads.length) / (contacts.length + leads.length || 1)) * 100)}%`}
                        icon={Database}
                        color="bg-brand-primary/10 text-brand-primary"
                    />
                </div>

                {/* Content Tabs */}
                <div className="bg-white rounded-[3.5rem] border border-brand-primary/5 shadow-2xl overflow-hidden min-h-[600px]">
                    <div className="flex border-b border-brand-primary/5 p-4 bg-brand-primary/5">
                        <button
                            onClick={() => setActiveTab('contacts')}
                            className={`flex-1 flex items-center justify-center gap-3 py-6 rounded-3xl font-black uppercase tracking-widest text-[12px] transition-all font-display cursor-pointer ${activeTab === 'contacts' ? 'bg-white text-brand-primary shadow-lg' : 'text-brand-secondary hover:text-brand-primary'
                                }`}
                        >
                            <Users size={18} />
                            Contact Submissions
                        </button>
                        <button
                            onClick={() => setActiveTab('leads')}
                            className={`flex-1 flex items-center justify-center gap-3 py-6 rounded-3xl font-black uppercase tracking-widest text-[12px] transition-all font-display cursor-pointer ${activeTab === 'leads' ? 'bg-white text-brand-primary shadow-lg' : 'text-brand-secondary hover:text-brand-primary'
                                }`}
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
                                <table className="w-full text-left">
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
                                            ) : (
                                                <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-brand-secondary">Email Address</th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-brand-primary/5">
                                        {(activeTab === 'contacts' ? contacts : leads).map((item) => (
                                            <tr key={item.id} className="group hover:bg-brand-primary/5 transition-colors">
                                                <td className="py-8">
                                                    <div className="flex items-center gap-2 text-brand-secondary font-medium whitespace-nowrap">
                                                        <Calendar size={14} />
                                                        {formatDate(item.created_at)}
                                                    </div>
                                                </td>
                                                <td className="py-8">
                                                    <div className="font-black text-brand-primary font-display uppercase tracking-tight text-lg whitespace-nowrap">{item.full_name}</div>
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
                                                ) : (
                                                    <td className="py-8">
                                                        <div className="text-brand-primary font-bold">{item.email}</div>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                        {(activeTab === 'contacts' ? contacts : leads).length === 0 && (
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
            </div>
        </div>
    );
};

export default Dashboard;
