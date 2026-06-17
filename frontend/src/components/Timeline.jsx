import React from 'react';
import { Calendar, GraduationCap, Briefcase, FileCheck, ArrowUpRight } from 'lucide-react';

export default function Timeline({ education, internships }) {
  // Helper to format dates
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Present';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <section id="timeline" className="py-24 bg-slate-50 dark:bg-darkBg relative overflow-hidden text-slate-800 dark:text-slate-200">
      
      {/* Decorative Glows */}
      <div className="absolute top-1/3 left-0 w-[300px] h-[300px] bg-brand-500/5 rounded-full filter blur-[80px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-semibold uppercase mb-4 tracking-wider">
            <Calendar size={12} />
            <span>Academic & Career Path</span>
          </div>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-slate-900 dark:text-white mb-4">
            Education & <span className="text-gradient">Experience</span>
          </h2>
          <div className="h-1 w-20 bg-brand-500 mx-auto rounded-full"></div>
        </div>

        {/* Dual Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          
          {/* Column 1 - Education Timeline */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                <GraduationCap size={20} />
              </div>
              <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white">
                Education
              </h3>
            </div>

            {education.length === 0 ? (
              <p className="text-slate-400 p-6 glass-panel rounded-2xl">No education history details provided.</p>
            ) : (
              <div className="space-y-6">
                {education.map((edu) => (
                  <div
                    key={edu.id}
                    className="p-6 rounded-2xl glass-card relative overflow-hidden group hover:scale-[1.01] transition-transform duration-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                        {edu.start_year} - {edu.end_year || 'Present'}
                      </span>
                      <span className="text-xs font-bold text-slate-400">{edu.status}</span>
                    </div>

                    <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-1.5">
                      {edu.degree}
                    </h4>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      {edu.department}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {edu.institution}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Column 2 - Internship Experience Timeline */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Briefcase size={20} />
              </div>
              <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white">
                Internships
              </h3>
            </div>

            {internships.length === 0 ? (
              <div className="p-8 text-center glass-panel rounded-2xl flex flex-col items-center justify-center text-slate-400 min-h-[200px]">
                <Briefcase size={32} className="stroke-[1.5] mb-2" />
                <p className="text-sm font-semibold">No internship records found</p>
                <p className="text-[10px] text-slate-400 mt-1 max-w-[250px]">
                  When S. Naresh completes an internship, it will be added here via the Admin Panel.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {internships.map((intern) => (
                  <div
                    key={intern.id}
                    className="p-6 rounded-2xl glass-card relative overflow-hidden group hover:scale-[1.01] transition-transform duration-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                        {formatDate(intern.start_date)} - {formatDate(intern.end_date)}
                      </span>
                    </div>

                    <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-1">
                      {intern.role}
                    </h4>
                    <p className="text-sm font-semibold text-brand-500 dark:text-brand-400 mb-3">
                      {intern.company_name}
                    </p>
                    <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed mb-4 text-justify">
                      {intern.description}
                    </p>

                    {/* Certificate link */}
                    {intern.certificate_url && (
                      <div className="pt-3 border-t border-slate-200/50 dark:border-slate-800/40">
                        <a
                          href={`http://localhost:5000${intern.certificate_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400"
                        >
                          <FileCheck size={14} />
                          <span>View Internship Certificate</span>
                          <ArrowUpRight size={12} />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
      
    </section>
  );
}
