import React, { useState } from 'react';
import { Award, Terminal, Globe, Database, Brain, Users } from 'lucide-react';

export default function Skills({ skills }) {
  const [activeCategory, setActiveCategory] = useState('All');

  // Hardcoded categories mapping
  const categories = [
    { id: 'All', label: 'All Skills', icon: Award },
    { id: 'Programming', label: 'Programming', icon: Terminal },
    { id: 'Web Development', label: 'Web Development', icon: Globe },
    { id: 'Database', label: 'Database', icon: Database },
    { id: 'AI/ML', label: 'AI & ML', icon: Brain },
    { id: 'Soft Skills', label: 'Soft Skills', icon: Users },
  ];

  // Helper to filter skills
  const filteredSkills = activeCategory === 'All'
    ? skills
    : skills.filter(skill => skill.category === activeCategory);

  // Helper to render category icon
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Programming': return <Terminal className="text-amber-500" size={18} />;
      case 'Web Development': return <Globe className="text-emerald-500" size={18} />;
      case 'Database': return <Database className="text-blue-500" size={18} />;
      case 'AI/ML': return <Brain className="text-purple-500" size={18} />;
      case 'Soft Skills': return <Users className="text-pink-500" size={18} />;
      default: return <Award className="text-brand-500" size={18} />;
    }
  };

  return (
    <section id="skills" className="py-24 bg-slate-50 dark:bg-darkBg relative overflow-hidden text-slate-800 dark:text-slate-200">
      
      {/* Decorative Glows */}
      <div className="absolute top-1/4 left-0 w-[300px] h-[300px] bg-indigo-500/5 rounded-full filter blur-[80px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-semibold uppercase mb-4 tracking-wider">
            <Award size={12} />
            <span>Technical Inventory</span>
          </div>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-slate-900 dark:text-white mb-4">
            Skills & <span className="text-gradient">Core Competencies</span>
          </h2>
          <div className="h-1 w-20 bg-brand-500 mx-auto rounded-full"></div>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12 max-w-4xl mx-auto">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200 outline-none ${
                  isActive
                    ? 'bg-brand-500 border-brand-500 text-white shadow-lg shadow-brand-500/10 scale-[1.03]'
                    : 'bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800/40 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon size={16} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Skills Grid */}
        {filteredSkills.length === 0 ? (
          <div className="text-center p-12 glass-panel rounded-3xl max-w-md mx-auto">
            <p className="text-slate-400 dark:text-slate-500 font-medium">No skills found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filteredSkills.map((skill) => (
              <div
                key={skill.id}
                className="p-6 rounded-2xl glass-card-interactive flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
                      {getCategoryIcon(skill.category)}
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-slate-800 dark:text-white leading-tight">
                        {skill.name}
                      </h4>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        {skill.category}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-brand-500 dark:text-brand-400">
                    {skill.proficiency || 100}%
                  </span>
                </div>

                {/* Meter progress bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-850 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-500 to-indigo-500 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${skill.proficiency || 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
      
    </section>
  );
}
