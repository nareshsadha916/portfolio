import React from 'react';
import { User, GraduationCap, MapPin, Mail, Phone } from 'lucide-react';

export default function About({ contactInfo }) {
  const bio = contactInfo?.bio || 'I am S. Naresh, a Computer Science and Engineering student...';
  const college = contactInfo?.college || 'Anna University Regional Campus Madurai';
  const dept = contactInfo?.department || 'Computer Science and Engineering (CSE)';

  return (
    <section id="about" className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden text-slate-800 dark:text-slate-200">
      
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-brand-500/5 dark:bg-brand-500/5 rounded-full filter blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-semibold uppercase mb-4 tracking-wider">
            <User size={12} />
            <span>About Me</span>
          </div>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-slate-900 dark:text-white mb-4">
            Get To Know <span className="text-gradient">My Journey</span>
          </h2>
          <div className="h-1 w-20 bg-brand-500 mx-auto rounded-full"></div>
        </div>

        {/* Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left panel - Glass Bio Card */}
          <div className="lg:col-span-7 flex flex-col justify-between p-8 sm:p-10 rounded-3xl glass-panel relative overflow-hidden shadow-xl border-white/30 dark:border-slate-800/40">
            <div className="relative z-10">
              <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white mb-6">
                My Story & Ambitions
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6 whitespace-pre-line text-justify">
                {bio}
              </p>
            </div>
            
            {/* Inner statistics/badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-slate-200/50 dark:border-slate-800/50 pt-6 mt-6">
              <div className="text-left">
                <span className="block font-display font-extrabold text-3xl text-brand-500">2nd</span>
                <span className="text-xs text-slate-400 font-medium uppercase mt-1 block">Academic Year</span>
              </div>
              <div className="text-left">
                <span className="block font-display font-extrabold text-3xl text-indigo-500">15+</span>
                <span className="text-xs text-slate-400 font-medium uppercase mt-1 block">Skills Mastered</span>
              </div>
              <div className="text-left col-span-2 sm:col-span-1">
                <span className="block font-display font-extrabold text-3xl text-purple-500">B.E.</span>
                <span className="text-xs text-slate-400 font-medium uppercase mt-1 block">CSE Degree</span>
              </div>
            </div>
          </div>

          {/* Right panel - Academic Profile Quick-Facts */}
          <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
            
            {/* Fact Card 1 - Institution */}
            <div className="p-6 rounded-2xl glass-card flex gap-5 items-start">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <GraduationCap size={24} />
              </div>
              <div>
                <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-1">Education & College</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">{college}</p>
                <p className="text-xs text-slate-400 mt-1">{dept}</p>
              </div>
            </div>

            {/* Fact Card 2 - Contact Specs */}
            <div className="p-6 rounded-2xl glass-card flex gap-5 items-start">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <Phone size={20} />
              </div>
              <div>
                <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-1">Direct Contacts</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1.5 mt-2">
                  <Phone size={14} className="text-slate-400" />
                  {contactInfo?.phone || '+91 96290 95916'}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1.5 mt-1">
                  <Mail size={14} className="text-slate-400" />
                  {contactInfo?.email || 'nnareshkavithach@gmail.com'}
                </p>
              </div>
            </div>

            {/* Fact Card 3 - Focus Areas */}
            <div className="p-6 rounded-2xl glass-card flex gap-5 items-start">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <MapPin size={22} />
              </div>
              <div>
                <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-1">Primary Focus Areas</h4>
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {['Web Technologies', 'Software Development', 'AI/ML', 'DBMS'].map((focus) => (
                    <span
                      key={focus}
                      className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-800/50 font-medium"
                    >
                      {focus}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
      
    </section>
  );
}
