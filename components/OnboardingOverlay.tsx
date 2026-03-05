import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, GripVertical, CheckCircle2 } from 'lucide-react';

const TUTORIAL_STEPS = [
    {
        id: 'welcome',
        title: 'Welcome to the Clarity Curriculum Planner',
        description: 'This interactive planner lets you drag and drop content into your daily schedule in seconds. Let\'s learn how!',
        targetSelector: 'body',
        position: 'center',
    },
    {
        id: 'library',
        title: 'The Topic Library',
        description: 'Here you will find all your curriculum modules. Use the top filters to search by year or category.',
        targetSelector: '.sidebar-library',
        position: 'right',
    },
    {
        id: 'drag-drop',
        title: 'Drag & Drop to Schedule',
        description: 'Grab a topic card and drop it onto any day in the Weekly or Monthly planner. It automatically saves to the cloud!',
        targetSelector: '.day-cell-target',
        position: 'top',
    },
    {
        id: 'views',
        title: 'Switch Your View',
        description: 'Toggle between Daily, Weekly, Monthly, and Yearly views up here to plan ahead easily.',
        targetSelector: '.view-toggle-buttons',
        position: 'bottom',
    },
    {
        id: 'finish',
        title: 'You\'re All Set!',
        description: 'Go ahead and start planning! If you need help, the support team is always available.',
        targetSelector: 'body',
        position: 'center',
    }
];

export const OnboardingOverlay: React.FC = () => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already seen onboarding
        const hasCompleted = localStorage.getItem('clarity_onboarding_completed');
        if (!hasCompleted) {
            // Delay slightly to ensure UI is mounted before measuring target selectors
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const completeOnboarding = () => {
        setIsVisible(false);
        localStorage.setItem('clarity_onboarding_completed', 'true');
    };

    const nextStep = () => {
        if (currentStepIndex === TUTORIAL_STEPS.length - 1) {
            completeOnboarding();
        } else {
            setCurrentStepIndex(prev => prev + 1);
        }
    };

    const skipOnboarding = () => {
        completeOnboarding();
    };

    if (!isVisible) return null;

    const currentStep = TUTORIAL_STEPS[currentStepIndex];

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-[9999] pointer-events-none">
                    {/* Dark Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm pointer-events-auto"
                        onClick={skipOnboarding}
                    />

                    {/* Tutorial Dialogs */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4">
                        <motion.div
                            key={currentStep.id}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl pointer-events-auto relative border border-brand-primary/10"
                        >
                            {/* Accent Bar */}
                            <div className="absolute top-0 left-8 right-8 h-1.5 bg-brand-accent rounded-b-lg opacity-50" />

                            <div className="flex flex-col gap-6 mt-2">
                                <div className="text-center">
                                    <h3 className="text-xl font-black text-brand-primary font-display uppercase tracking-tight mb-3">
                                        {currentStep.title}
                                    </h3>
                                    <p className="text-sm font-medium text-brand-secondary/80 leading-relaxed">
                                        {currentStep.description}
                                    </p>
                                </div>

                                {/* Interactive Visuals based on Step */}
                                {currentStep.id === 'drag-drop' && (
                                    <div className="h-24 bg-brand-bg rounded-xl flex items-center justify-center relative overflow-hidden border border-brand-primary/5">
                                        <motion.div
                                            animate={{ x: [0, 100, 0] }}
                                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                            className="w-12 h-12 bg-white rounded-lg shadow-md flex items-center justify-center"
                                        >
                                            <GripVertical size={20} className="text-brand-secondary/40" />
                                        </motion.div>
                                    </div>
                                )}

                                {currentStep.id === 'finish' && (
                                    <div className="flex justify-center my-2">
                                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                            <CheckCircle2 size={32} />
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-4 border-t border-brand-primary/5 mt-2">
                                    <div className="flex gap-2">
                                        {TUTORIAL_STEPS.map((step, idx) => (
                                            <div
                                                key={step.id}
                                                className={`h-2 rounded-full transition-all duration-300 ${idx === currentStepIndex ? 'w-6 bg-brand-accent' : 'w-2 bg-brand-primary/10'
                                                    }`}
                                            />
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-4">
                                        {currentStepIndex !== TUTORIAL_STEPS.length - 1 && (
                                            <button
                                                onClick={skipOnboarding}
                                                className="text-[10px] font-black text-brand-secondary/40 uppercase tracking-widest hover:text-brand-primary transition-colors"
                                            >
                                                Skip
                                            </button>
                                        )}
                                        <button
                                            onClick={nextStep}
                                            className="bg-brand-primary text-white px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-brand-primary/90 transition-all flex items-center gap-2 group shadow-xl shadow-brand-primary/10"
                                        >
                                            {currentStepIndex === TUTORIAL_STEPS.length - 1 ? 'Start Planning' : 'Next Step'}
                                            {currentStepIndex !== TUTORIAL_STEPS.length - 1 && (
                                                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default OnboardingOverlay;
