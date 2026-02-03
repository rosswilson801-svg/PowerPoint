import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ContactForm: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  const inputClasses = "w-full px-6 py-4 rounded-2xl border border-slate-700 bg-slate-800/40 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all duration-300 text-sm";
  const labelClasses = "block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1";

  return (
    <div className="max-w-2xl mx-auto w-full">
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.form
            key="form"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            onSubmit={handleSubmit}
            className="space-y-6 text-left"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClasses}>Full Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Alex Rivers"
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>School Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. St. Peters International"
                  className={inputClasses}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClasses}>Email Address</label>
                <input
                  required
                  type="email"
                  placeholder="e.g. alex@school.com"
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Job Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Head of Pastoral"
                  className={inputClasses}
                />
              </div>
            </div>

            <div>
              <label className={labelClasses}>Region of Interest</label>
              <select 
                required
                className={`${inputClasses} appearance-none cursor-pointer`}
              >
                <option value="" disabled selected className="bg-slate-900">Select your region</option>
                <option value="UK" className="bg-slate-900">United Kingdom</option>
                <option value="Spain" className="bg-slate-900">Spain</option>
                <option value="USA" className="bg-slate-900">United States</option>
                <option value="HK" className="bg-slate-900">Hong Kong</option>
                <option value="China" className="bg-slate-900">China</option>
                <option value="Germany" className="bg-slate-900">Germany</option>
                <option value="Other" className="bg-slate-900">Other / International</option>
              </select>
            </div>

            <div>
              <label className={labelClasses}>How can we help?</label>
              <textarea
                placeholder="Tell us about your specific curriculum needs or custom order requirements..."
                rows={4}
                className={`${inputClasses} rounded-3xl resize-none`}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.01, backgroundColor: '#22d3ee', color: '#0f172a' }}
              whileTap={{ scale: 0.99 }}
              disabled={loading}
              className="w-full py-6 bg-white text-slate-900 rounded-full font-bold uppercase tracking-widest text-[13px] shadow-2xl transition-all duration-300 disabled:opacity-50 mt-4"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-slate-900/20 border-t-slate-900 rounded-full animate-spin" />
                  Sending...
                </span>
              ) : 'Start the Conversation'}
            </motion.button>
          </motion.form>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 px-8 rounded-[40px] bg-white/5 border border-white/10 backdrop-blur-sm"
          >
            <div className="w-16 h-16 bg-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">Talk soon.</h3>
            <p className="text-slate-400 text-lg leading-relaxed max-w-sm mx-auto">
              We've received your inquiry. One of our curriculum leads will reach out to schedule a conversation.
            </p>
            <button 
              onClick={() => setSubmitted(false)}
              className="mt-8 text-cyan-400 text-xs font-black uppercase tracking-widest hover:text-white transition-colors"
            >
              Send another message
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactForm;