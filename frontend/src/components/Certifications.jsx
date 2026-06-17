import React, { useState } from 'react';
import { Award, Calendar, Eye, Download, FileText, Image as ImageIcon, X } from 'lucide-react';

export default function Certifications({ certifications }) {
  const [activeImagePreview, setActiveImagePreview] = useState(null);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <section id="certifications" className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden text-slate-800 dark:text-slate-200">
      
      {/* Decorative Glow */}
      <div className="absolute top-1/4 right-0 w-[300px] h-[300px] bg-brand-500/5 rounded-full filter blur-[80px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-semibold uppercase mb-4 tracking-wider">
            <Award size={12} />
            <span>Credentials Log</span>
          </div>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-slate-900 dark:text-white mb-4">
            Certifications & <span className="text-gradient">Licenses</span>
          </h2>
          <div className="h-1 w-20 bg-brand-500 mx-auto rounded-full"></div>
        </div>

        {/* Certifications Grid */}
        {certifications.length === 0 ? (
          <div className="p-10 text-center glass-panel rounded-3xl max-w-md mx-auto text-slate-400">
            <Award size={32} className="stroke-[1.5] mx-auto mb-2 text-slate-400" />
            <p className="font-semibold text-sm">No certifications uploaded</p>
            <p className="text-[10px] text-slate-400 mt-1">
              Certifications uploaded via the Admin Panel will immediately display here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="p-6 rounded-2xl glass-card-interactive flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                      <Award size={20} />
                    </div>
                    {cert.issue_date && (
                      <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-400">
                        <Calendar size={12} />
                        <span>{formatDate(cert.issue_date)}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-1 leading-snug">
                    {cert.name}
                  </h3>
                  <p className="text-sm font-semibold text-brand-500 dark:text-brand-400 mb-6">
                    {cert.issuing_organization}
                  </p>
                </div>

                {/* Attachments */}
                <div className="flex items-center gap-3 border-t border-slate-200/50 dark:border-slate-800/40 pt-4">
                  {cert.image_url && (
                    <button
                      onClick={() => setActiveImagePreview(cert.image_url)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-105 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 text-xs font-bold text-slate-600 dark:text-slate-400 transition-colors outline-none cursor-pointer"
                    >
                      <Eye size={12} />
                      <span>Preview</span>
                    </button>
                  )}
                  
                  {cert.pdf_url && (
                    <a
                      href={`http://localhost:5000${cert.pdf_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-500/10 hover:bg-brand-500/20 text-xs font-bold text-brand-600 dark:text-brand-400 border border-brand-500/20 transition-colors"
                    >
                      <Download size={12} />
                      <span>Download PDF</span>
                    </a>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Visual Image Preview Modal */}
      {activeImagePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/70 backdrop-blur-md animate-fade-in" onClick={() => setActiveImagePreview(null)}>
          <div className="relative max-w-3xl glass-panel p-2 rounded-2xl shadow-2xl border-white/20 dark:border-slate-800/50 max-h-[85vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setActiveImagePreview(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900/80 text-white backdrop-blur-md border border-white/10 transition-colors"
            >
              <X size={18} />
            </button>
            <img
              src={`http://localhost:5000${activeImagePreview}`}
              alt="Certification Certificate"
              className="max-h-[80vh] w-auto object-contain rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}

    </section>
  );
}
