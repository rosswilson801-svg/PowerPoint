import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Monitor, Download, Lock } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set up the worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface SecureViewerModalProps {
    url: string;
    title: string;
    teacherEmail?: string;
    onClose: () => void;
}

export default function SecureViewerModal({ url, title, teacherEmail = 'teacher@clarity-hub.com', onClose }: SecureViewerModalProps) {
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);
    const [isLoading, setIsLoading] = useState(true);

    // Prevent right click on the entire modal
    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => e.preventDefault();
        document.addEventListener('contextmenu', handleContextMenu);
        return () => document.removeEventListener('contextmenu', handleContextMenu);
    }, []);

    // Handle Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                setPageNumber(prev => Math.min(prev + 1, numPages));
            } else if (e.key === 'ArrowLeft') {
                setPageNumber(prev => Math.max(prev - 1, 1));
            } else if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [numPages, onClose]);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setIsLoading(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-primary/95 backdrop-blur-xl p-4 md:p-8"
            style={{ userSelect: 'none' }} // Prevent text selection
        >
            <div className="w-full h-full max-w-7xl bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl relative flex flex-col border border-slate-800">
                {/* Header */}
                <div className="p-4 md:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900 absolute top-0 left-0 right-0 z-10 transition-transform">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-brand-accent/20 rounded-xl text-brand-accent">
                            <Lock size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-white font-display uppercase tracking-tight line-clamp-1">{title}</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                SECURE PRESENTATION MODE • PROTECTED IP
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg mr-4">
                            <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))} className="text-slate-400 hover:text-white"><ZoomOut size={16} /></button>
                            <span className="text-xs font-bold text-slate-300 w-12 text-center">{Math.round(scale * 100)}%</span>
                            <button onClick={() => setScale(s => Math.min(3, s + 0.1))} className="text-slate-400 hover:text-white"><ZoomIn size={16} /></button>
                        </div>

                        <button
                            onClick={onClose}
                            className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-2xl transition-all"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Secure PDF Viewer */}
                <div className="flex-1 overflow-auto relative bg-[#1c2128] mt-[88px] mb-[64px] flex justify-center items-center py-8">

                    {/* Watermark Overlay (Repeated across screen to prevent screenshotting) */}
                    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden opacity-[0.03] rotate-[-20deg] flex flex-wrap justify-center items-center gap-20">
                        {Array.from({ length: 50 }).map((_, i) => (
                            <span key={i} className="text-2xl font-black text-white whitespace-nowrap">
                                {teacherEmail}
                            </span>
                        ))}
                    </div>

                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-8 h-8 border-4 border-brand-accent/20 border-t-brand-accent rounded-full animate-spin mx-auto mb-4" />
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Decrypting Presentation...</p>
                            </div>
                        </div>
                    )}

                    <div className="shadow-2xl transition-transform duration-200" style={{ transform: `scale(${scale})` }}>
                        <Document
                            file={url}
                            onLoadSuccess={onDocumentLoadSuccess}
                            loading={null}
                            className="flex flex-col items-center"
                        >
                            <Page
                                pageNumber={pageNumber}
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                                className="border border-slate-800"
                            />
                        </Document>
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="h-16 bg-slate-900 border-t border-slate-800 flex items-center justify-between px-6 absolute bottom-0 left-0 right-0 z-10">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hidden md:block">
                        PROPERTY OF CLARITY • DO NOT DISTRIBUTE
                    </p>

                    <div className="flex items-center gap-4 mx-auto md:mx-0">
                        <button
                            onClick={() => setPageNumber(p => Math.max(1, p - 1))}
                            disabled={pageNumber <= 1}
                            className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white rounded-lg transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <span className="text-xs font-bold text-slate-400 m-w-[80px] text-center">
                            PAGE {pageNumber} OF {numPages || '-'}
                        </span>
                        <button
                            onClick={() => setPageNumber(p => Math.min(numPages, p + 1))}
                            disabled={pageNumber >= numPages}
                            className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white rounded-lg transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
