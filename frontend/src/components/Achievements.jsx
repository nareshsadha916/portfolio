import React from 'react';
import { Trophy, Calendar, CheckCircle } from 'lucide-react';

export default function Achievements({ achievements }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <section id="achievements" className="py-24 bg-slate-50 dark:bg-darkBg relative overflow-hidden text-slate-800 dark:text-slate-200">
      
      {/* Decorative Glows */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-brand-500/5 rounded-full filter blur-[80px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-semibold uppercase mb-4 tracking-wider">
            <Trophy size={12} />
            <span>Honors & Milestones</span>
          </div>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-slate-900 dark:text-white mb-4">
            Key <span className="text-gradient">Achievements</span>
          </h2>
          <div className="h-1 w-20 bg-brand-500 mx-auto rounded-full"></div>
        </div>

        {/* Achievements list */}
        {achievements.length === 0 ? (
          <div className="p-10 text-center glass-panel rounded-3xl max-w-md mx-auto text-slate-400">
            <Trophy size={32} className="stroke-[1.5] mx-auto mb-2 text-slate-450" />
            <p className="font-semibold text-sm">No achievements logged yet</p>
            <p className="text-[10px] text-slate-405 mt-1">
              Awards, hackathon wins, or key accomplishments added via Admin Dashboard will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className="p-6 rounded-2xl glass-card flex gap-5 items-start relative overflow-hidden group hover:scale-[1.01] transition-transform duration-200"
              >
                {/* Visual Icon */}
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Trophy size={22} />
                </div>

                <div className="flex-grow">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white leading-tight">
                      {ach.title}
                    </h3>
                    {ach.date && (
                      <span className="flex items-center gap-1 shrink-0 text-[10px] uppercase font-bold text-slate-400">
                        <Calendar size={12} />
                        <span>{formatDate(ach.date)}</span>
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-650 dark:text-slate-350 leading-relaxed text-justify">
                    {ach.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
      
    </section>
  );
}
