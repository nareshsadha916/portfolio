import React, { useState, useMemo } from 'react';
import { Briefcase, Search, ExternalLink, Calendar, CheckCircle, Clock, X } from 'lucide-react';

const Github = ({ size = 18, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function Projects({ projects }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeModalProject, setActiveModalProject] = useState(null);

  // Extract unique categories for filtering
  const categories = useMemo(() => {
    const list = new Set(['All']);
    projects.forEach(p => {
      if (p.category) list.add(p.category);
    });
    return Array.from(list);
  }, [projects]);

  // Filter and search computation
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            p.tech_stack.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [projects, searchTerm, selectedCategory]);

  // Helper to format date
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <section id="projects" className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden text-slate-800 dark:text-slate-200">
      
      {/* Decorative Glow */}
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-brand-500/5 rounded-full filter blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-semibold uppercase mb-4 tracking-wider">
            <Briefcase size={12} />
            <span>Showcase Portfolio</span>
          </div>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-slate-900 dark:text-white mb-4">
            Projects <span className="text-gradient">& Creations</span>
          </h2>
          <div className="h-1 w-20 bg-brand-500 mx-auto rounded-full"></div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 max-w-6xl mx-auto">
          
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-200 outline-none ${
                  selectedCategory === cat
                    ? 'bg-brand-500 border-brand-500 text-white shadow-lg shadow-brand-500/10'
                    : 'bg-slate-100 dark:bg-slate-900 border-slate-200/50 dark:border-slate-800/40 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search by title, stack..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full glass-input pl-10 text-sm py-2 rounded-xl"
            />
          </div>

        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center p-16 glass-panel rounded-3xl max-w-lg mx-auto">
            <p className="text-slate-400 dark:text-slate-500 font-semibold text-lg mb-2">No projects found</p>
            <p className="text-xs text-slate-400">Try adjusting your filters or search keywords.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {filteredProjects.map((project) => {
              const techTags = project.tech_stack.split(',').map(s => s.trim());
              return (
                <div
                  key={project.id}
                  className="flex flex-col h-full rounded-2xl overflow-hidden glass-card hover:-translate-y-1.5 transition-all duration-300 relative group cursor-pointer"
                  onClick={() => setActiveModalProject(project)}
                >
                  {/* Card Media Header */}
                  <div className="h-48 relative overflow-hidden bg-slate-100 dark:bg-slate-900 flex items-center justify-center border-b border-slate-200/40 dark:border-slate-800/20">
                    {project.image_url ? (
                      <img
                        src={`http://localhost:5000${project.image_url}`}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2.5 text-slate-400 p-6">
                        <Briefcase size={32} className="stroke-[1.5]" />
                        <span className="text-xs font-semibold uppercase tracking-wider">Project Snapshot</span>
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm border ${
                        project.status === 'Completed'
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20'
                      }`}>
                        {project.status === 'Completed' ? <CheckCircle size={10} /> : <Clock size={10} />}
                        <span>{project.status || 'Completed'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex flex-col justify-between flex-grow">
                    <div>
                      {/* Meta */}
                      <div className="flex items-center gap-3 text-xs text-slate-400 mb-3 font-semibold uppercase tracking-wider">
                        <span>{project.category}</span>
                        {project.completion_date && (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                            <span>{formatDate(project.completion_date)}</span>
                          </>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-2.5 group-hover:text-brand-500 transition-colors">
                        {project.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-slate-650 dark:text-slate-300 line-clamp-3 mb-6 leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    {/* Tech Tags */}
                    <div>
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {techTags.slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-800/40"
                          >
                            {tag}
                          </span>
                        ))}
                        {techTags.length > 3 && (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-500">
                            +{techTags.length - 3} more
                          </span>
                        )}
                      </div>

                      {/* Card Links Footer */}
                      <div className="flex items-center justify-between border-t border-slate-150 dark:border-slate-850 pt-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-4">
                          {project.github_url && (
                            <a
                              href={project.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-500 hover:text-brand-500 dark:hover:text-brand-400 flex items-center gap-1.5 text-xs font-semibold transition-colors"
                            >
                              <Github size={14} />
                              <span>Code</span>
                            </a>
                          )}
                          {project.live_url && (
                            <a
                              href={project.live_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-500 hover:text-brand-500 dark:hover:text-brand-400 flex items-center gap-1.5 text-xs font-semibold transition-colors"
                            >
                              <ExternalLink size={14} />
                              <span>Live</span>
                            </a>
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-brand-500 dark:text-brand-400 group-hover:translate-x-1.5 transition-transform">
                          Details &rarr;
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Dynamic Project Modal */}
      {activeModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/70 backdrop-blur-md animate-fade-in">
          <div
            className="w-full max-w-2xl rounded-3xl glass-panel shadow-2xl border-white/20 dark:border-slate-800/60 overflow-hidden relative max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="h-64 relative overflow-hidden bg-slate-100 dark:bg-slate-900 shrink-0">
              {activeModalProject.image_url ? (
                <img
                  src={`http://localhost:5000${activeModalProject.image_url}`}
                  alt={activeModalProject.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-slate-400">
                  <Briefcase size={48} className="stroke-[1.5]" />
                  <span className="text-sm font-semibold uppercase tracking-wider">Project Presentation</span>
                </div>
              )}
              {/* Close button */}
              <button
                onClick={() => setActiveModalProject(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900/80 text-white backdrop-blur-md transition-colors border border-white/10"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-8 overflow-y-auto flex-grow">
              
              {/* Meta details */}
              <div className="flex flex-wrap items-center gap-4 mb-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/40 text-slate-600 dark:text-slate-400">
                  {activeModalProject.category}
                </span>
                
                {activeModalProject.completion_date && (
                  <span className="flex items-center gap-1.5">
                    <Calendar size={12} />
                    <span>{formatDate(activeModalProject.completion_date)}</span>
                  </span>
                )}
                
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border ${
                  activeModalProject.status === 'Completed'
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                }`}>
                  {activeModalProject.status === 'Completed' ? <CheckCircle size={10} /> : <Clock size={10} />}
                  <span>{activeModalProject.status}</span>
                </span>
              </div>

              {/* Title */}
              <h3 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white mb-4">
                {activeModalProject.title}
              </h3>

              {/* Description */}
              <p className="text-slate-650 dark:text-slate-350 leading-relaxed text-justify whitespace-pre-wrap text-sm mb-6">
                {activeModalProject.description}
              </p>

              {/* Tech Stack */}
              <div className="mb-6">
                <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-400 mb-2.5">
                  Tech Stack & Tools
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeModalProject.tech_stack.split(',').map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 text-slate-600 dark:text-slate-300 font-semibold"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
                {activeModalProject.github_url && (
                  <a
                    href={activeModalProject.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-button-primary flex items-center justify-center gap-2 py-2 px-5 text-sm"
                  >
                    <Github size={16} />
                    <span>View GitHub Repository</span>
                  </a>
                )}
                {activeModalProject.live_url && (
                  <a
                    href={activeModalProject.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-button-secondary flex items-center justify-center gap-2 py-2 px-5 text-sm border-slate-250 dark:border-slate-750"
                  >
                    <ExternalLink size={16} />
                    <span>Visit Live Application</span>
                  </a>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

    </section>
  );
}
