import React, { useState, useEffect } from 'react';
import { FileDown, Send, ArrowRight, Loader2 } from 'lucide-react';
import { BACKEND_URL } from '../utils/api';
import { usePDF } from '@react-pdf/renderer';
import ResumePDF from './ResumePDF';

export default function Hero({ contactInfo, fullData }) {
  const name = contactInfo?.name || 'S. Naresh';
  const headline = contactInfo?.headline || 'Aspiring Cyber Security Professional | Problem Solver | Future Ethical Hacker';
  const college = contactInfo?.college || 'Anna University Regional Campus Madurai';
  const dept = contactInfo?.department || 'Computer Science and Engineering (CSE)';
  
  const [client, setClient] = useState(false);
  const [instance, update] = usePDF({ document: <ResumePDF data={fullData} /> });

  useEffect(() => {
    setClient(true);
  }, []);

  useEffect(() => {
    if (fullData) {
      update(<ResumePDF data={fullData} />);
    }
  }, [fullData, update]);

  useEffect(() => {
    if (instance.error) {
      console.error('PDF Generation Error:', instance.error);
    }
  }, [instance.error]);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden bg-slate-50 dark:bg-darkBg text-slate-800 dark:text-slate-200">
      
      {/* Dynamic Background Glows */}
      <div className="glow-spot glow-spot-primary top-1/4 left-1/4"></div>
      <div className="glow-spot glow-spot-secondary bottom-1/4 right-1/4"></div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 w-full py-12">
        
        {/* Left column - Text details */}
        <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left">
          
          <div className="inline-flex items-center self-center lg:self-start gap-2 px-3 py-1.5 rounded-full glass-panel text-brand-600 dark:text-brand-400 text-xs font-semibold tracking-wide uppercase mb-6 shadow-sm">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
            </span>
            <span>Available for Internships</span>
          </div>

          <h1 className="font-display font-extrabold text-5xl sm:text-6xl md:text-7xl leading-[1.1] mb-6">
            Hi, I'm <span className="text-gradient">{name}</span>
          </h1>

          <p className="font-display font-medium text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-4 max-w-2xl leading-relaxed">
            {headline}
          </p>

          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mb-8 max-w-xl">
            Computer Science and Engineering student at <span className="font-semibold text-slate-700 dark:text-slate-200">{college}</span>. Passionate about software development, databases, and AI/ML.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            {client && fullData && (
              <a
                href={instance.url || '#'}
                download={instance.url ? `${name.replace(/\s+/g, '_')}_Resume.pdf` : undefined}
                onClick={(e) => {
                  if (instance.error) {
                    e.preventDefault();
                    alert(`PDF Generation Error: ${instance.error.message || instance.error}`);
                  } else if (!instance.url) {
                    e.preventDefault();
                    alert('PDF is still generating. Please wait a moment.');
                  }
                }}
                className="glass-button-primary flex items-center justify-center gap-2.5 w-full sm:w-auto cursor-pointer"
                style={{ opacity: instance.loading ? 0.7 : 1 }}
              >
                {instance.loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Generating PDF...</span>
                  </>
                ) : (
                  <>
                    <FileDown size={18} />
                    <span>Download Resume</span>
                  </>
                )}
              </a>
            )}
            
            <a
              href="#contact"
              className="glass-button-secondary flex items-center justify-center gap-2.5 w-full sm:w-auto group hover:border-brand-500/40"
            >
              <span>Contact Me</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

        </div>

        {/* Right column - Avatar illustration */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <div className="relative group">
            {/* Visual Glass Frame behind the image */}
            <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-600 opacity-20 blur-xl group-hover:opacity-35 transition-all duration-500"></div>
            
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full overflow-hidden p-2 glass-panel border-white/40 dark:border-slate-800/40 shadow-2xl animate-float">
              <img
                src={contactInfo?.profile_image_url ? `${BACKEND_URL}${contactInfo.profile_image_url}` : "/avatar.png"}
                alt={name}
                className="w-full h-full object-cover rounded-full bg-slate-200 dark:bg-slate-800"
              />
            </div>
            
            {/* Small floating badge */}
            <div className="absolute -bottom-4 -left-4 glass-panel border-white/40 dark:border-slate-800/40 px-4 py-3 rounded-2xl flex items-center gap-3 shadow-lg hover:scale-105 transition-transform duration-300">
              <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center text-white">
                <Send size={16} />
              </div>
              <div className="text-left">
                <p className="text-[10px] text-slate-400 font-medium leading-none uppercase">Location</p>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-1">Madurai, TN, India</p>
              </div>
            </div>
          </div>
        </div>

      </div>
      
    </section>
  );
}
