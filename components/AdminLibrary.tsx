import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Save, Trash2, Video, FileText, CheckCircle2, FileUp, Edit2 } from 'lucide-react';
import Papa from 'papaparse';

const COLORS = [
    { name: 'Emerald', class: 'bg-emerald-500' },
    { name: 'Blue', class: 'bg-blue-500' },
    { name: 'Indigo', class: 'bg-indigo-500' },
    { name: 'Rose', class: 'bg-rose-500' },
    { name: 'Cyan', class: 'bg-cyan-500' },
    { name: 'Violet', class: 'bg-violet-500' },
    { name: 'Amber', class: 'bg-amber-500' },
    { name: 'Orange', class: 'bg-orange-500' },
    { name: 'Red', class: 'bg-red-500' },
    { name: 'Slate', class: 'bg-slate-500' },
];

export default function AdminLibrary() {
    const [modules, setModules] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Self-awareness');
    const [color, setColor] = useState(COLORS[0].class);
    const [videoUrl, setVideoUrl] = useState('');
    const [presentationUrl, setPresentationUrl] = useState('');
    const [lessonNotes, setLessonNotes] = useState('');
    const [teacherNotes, setTeacherNotes] = useState('');
    const [inLessonMaterial, setInLessonMaterial] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchModules();
    }, []);

    const fetchModules = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('library_modules')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching modules:', error);
        } else {
            setModules(data || []);
        }
        setLoading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Convert presentation url to a simple JSON structure for source_files
        const sourceFiles = presentationUrl ? [{ title: 'Presentation', url: presentationUrl }] : null;

        const payload = {
            id: editingId || crypto.randomUUID(),
            title,
            category,
            color,
            video_url: videoUrl,
            source_files: sourceFiles,
            lesson_notes: lessonNotes,
            teacher_notes: teacherNotes,
            in_lesson_material: inLessonMaterial
        };

        const { error } = await supabase
            .from('library_modules')
            .upsert(payload);

        if (error) {
            alert('Failed to save module: ' + error.message);
        } else {
            resetForm();
            fetchModules();
        }
        setIsSubmitting(false);
    };

    const handleEdit = (mod: any) => {
        setEditingId(mod.id);
        setTitle(mod.title);
        setCategory(mod.category);
        setColor(mod.color);
        setVideoUrl(mod.video_url || '');
        // Extract presentation URL if it exists
        if (mod.source_files && mod.source_files.length > 0) {
            setPresentationUrl(mod.source_files[0].url || '');
        } else {
            setPresentationUrl('');
        }
        setLessonNotes(mod.lesson_notes || '');
        setTeacherNotes(mod.teacher_notes || '');
        setInLessonMaterial(mod.in_lesson_material || '');

        // Scroll back to the top to see the form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this module? It will be removed from all teacher libraries.')) return;

        const { error } = await supabase.from('library_modules').delete().eq('id', id);
        if (error) {
            alert('Failed to delete: ' + error.message);
        } else {
            fetchModules();
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setTitle('');
        setCategory('Self-awareness');
        setColor(COLORS[0].class);
        setVideoUrl('');
        setPresentationUrl('');
        setLessonNotes('');
        setTeacherNotes('');
        setInLessonMaterial('');
    };

    const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsSubmitting(true);
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                const rows = results.data as any[];

                // Map CSV fields to payload format
                const payloads = rows.map(row => {
                    const sourceFiles = row.Presentation ? [{ title: 'Presentation', url: row.Presentation }] : null;
                    return {
                        id: crypto.randomUUID(),
                        title: row.Title || 'Untitled',
                        category: row.Category || 'Self-awareness',
                        // Find a valid colour class or default to first
                        color: typeof row.Color === 'string' && row.Color.startsWith('bg-')
                            ? row.Color
                            : COLORS[Math.floor(Math.random() * COLORS.length)].class,
                        video_url: row.Video || null,
                        source_files: sourceFiles,
                        lesson_notes: row.Notes || null,
                        teacher_notes: row.TeacherNotes || null,
                        in_lesson_material: row.Material || null
                    };
                });

                const { error } = await supabase.from('library_modules').insert(payloads);

                if (error) {
                    alert('Bulk upload failed: ' + error.message);
                } else {
                    alert(`Successfully imported ${payloads.length} modules!`);
                    fetchModules();
                }

                setIsSubmitting(false);
                // Reset file input
                if (fileInputRef.current) fileInputRef.current.value = '';
            },
            error: (error) => {
                alert('Error parsing CSV: ' + error.message);
                setIsSubmitting(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        });
    };

    return (
        <>
            <div className="mb-8">
                <h1 className="text-3xl font-black text-brand-primary uppercase tracking-tight font-display">Content Library Admin</h1>
                <p className="text-brand-secondary/60">Manage your global curriculum topics, video links, and presentations.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* FORM SECTION */}
                <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-brand-primary/10 shadow-xl flex flex-col gap-6">
                    <div className="flex flex-col gap-2 border-b border-brand-primary/5 pb-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-black uppercase text-brand-primary flex items-center gap-2">
                                {editingId ? <><Save size={20} /> Edit Module</> : <><Plus size={20} /> Add New Module</>}
                            </h2>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-brand-accent/10 text-brand-accent hover:bg-brand-accent/20 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors"
                                title="Upload multiple modules via CSV"
                            >
                                <FileUp size={14} /> Bulk CSV
                            </button>
                            <input
                                type="file"
                                accept=".csv"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleBulkUpload}
                            />
                        </div>
                        <div className="text-[10px] text-brand-secondary/40 text-right pr-1">
                            Need the format? <a href="/library_import_template.csv" download className="text-brand-accent hover:underline font-bold">Download Template</a>
                        </div>
                    </div>

                    <form onSubmit={handleSave} className="flex flex-col gap-5">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-brand-secondary/60 mb-2 block">Topic Title</label>
                            <input
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all"
                                placeholder="e.g. Understanding Anxiety"
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-brand-secondary/60 mb-2 block">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none"
                            >
                                <option value="Self-awareness">Self-awareness</option>
                                <option value="Self-management">Self-management</option>
                                <option value="Social awareness">Social awareness</option>
                                <option value="Relationship skills">Relationship skills</option>
                                <option value="Responsible decision-making">Responsible decision-making</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-brand-secondary/60 mb-2 block">Card Color</label>
                            <div className="flex flex-wrap gap-2">
                                {COLORS.map(c => (
                                    <button
                                        key={c.name}
                                        type="button"
                                        onClick={() => setColor(c.class)}
                                        className={`w-8 h-8 rounded-full ${c.class} flex items-center justify-center transition-transform hover:scale-110 ${color === c.class ? 'ring-2 ring-offset-2 ring-brand-primary' : ''}`}
                                        title={c.name}
                                    >
                                        {color === c.class && <CheckCircle2 size={16} className="text-white" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100">
                            <label className="text-[10px] font-black uppercase tracking-widest text-brand-secondary/60 mb-2 flex items-center gap-2"><Video size={14} /> Video Link (YouTube/Vimeo)</label>
                            <input
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm focus:ring-2 focus:ring-brand-accent outline-none"
                                placeholder="https://youtu.be/..."
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-brand-secondary/60 mb-2 flex items-center gap-2"><FileText size={14} /> Presentation Link</label>
                            <input
                                value={presentationUrl}
                                onChange={(e) => setPresentationUrl(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm focus:ring-2 focus:ring-brand-accent outline-none"
                                placeholder="https://..."
                            />
                            <p className="text-xs text-brand-secondary/40 mt-1 mb-4">Paste a URL to a Powerpoint or PDF.</p>
                        </div>

                        <div className="pt-4 border-t border-slate-100">
                            <label className="text-[10px] font-black uppercase tracking-widest text-brand-secondary/60 mb-2 block">Lesson Notes</label>
                            <textarea
                                value={lessonNotes}
                                onChange={(e) => setLessonNotes(e.target.value)}
                                rows={3}
                                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all resize-y"
                                placeholder="General notes for the lesson..."
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-brand-secondary/60 mb-2 block">Teacher Notes</label>
                            <textarea
                                value={teacherNotes}
                                onChange={(e) => setTeacherNotes(e.target.value)}
                                rows={3}
                                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all resize-y"
                                placeholder="Private guidance and tips for the teacher..."
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-brand-secondary/60 mb-2 block">In-Lesson Material (Link)</label>
                            <input
                                value={inLessonMaterial}
                                onChange={(e) => setInLessonMaterial(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all"
                                placeholder="https://... (e.g. worksheet or activity link)"
                            />
                        </div>

                        <div className="flex gap-3 mt-4 pt-4 border-t border-slate-100">
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="flex-1 py-3 px-4 bg-slate-100 font-bold text-sm text-brand-secondary rounded-xl hover:bg-slate-200 transition-colors"
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 py-3 px-4 bg-brand-primary text-white font-black uppercase tracking-widest text-sm rounded-xl hover:bg-brand-primary/90 transition-colors"
                            >
                                {isSubmitting ? 'Saving...' : (editingId ? 'Update Module' : 'Add Module')}
                            </button>
                        </div>
                    </form>
                </div>

                {/* LIST SECTION */}
                <div className="lg:col-span-2 bg-white/50 p-6 rounded-3xl border border-brand-primary/5">
                    <h2 className="text-lg font-black uppercase text-brand-primary mb-6 flex items-center justify-between">
                        <span>Existing Library</span>
                        <span className="text-xs font-bold bg-brand-accent/10 px-3 py-1 rounded-full text-brand-accent">{modules.length} Topics</span>
                    </h2>

                    {loading ? (
                        <div className="text-center p-12 text-brand-secondary/40 font-bold">Loading library...</div>
                    ) : (
                        <div className="grid gap-3">
                            {modules.length === 0 && (
                                <div className="text-center p-12 bg-white rounded-2xl border border-dashed border-brand-primary/20 text-brand-secondary/50">
                                    No modules added yet. Create one to the left!
                                </div>
                            )}
                            {modules.map(mod => (
                                <div
                                    key={mod.id}
                                    onClick={() => handleEdit(mod)}
                                    className={`bg-white p-4 rounded-2xl border ${editingId === mod.id ? 'border-brand-accent ring-1 ring-brand-accent' : 'border-brand-primary/10 shadow-sm'} flex items-center justify-between group hover:border-brand-accent transition-all cursor-pointer`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-2 h-10 rounded-full ${mod.color}`} />
                                        <div>
                                            <h3 className="font-black text-brand-primary uppercase text-sm group-hover:text-brand-accent transition-colors">{mod.title}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[9px] font-bold text-brand-secondary/60 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded">{mod.category}</span>
                                                {mod.video_url && <span className="text-brand-accent" title="Has Video"><Video size={14} /></span>}
                                                {mod.source_files && mod.source_files.length > 0 && <span className="text-emerald-500" title="Has Presentation"><FileText size={14} /></span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent card edit click
                                                handleDelete(mod.id);
                                            }}
                                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete Topic"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
