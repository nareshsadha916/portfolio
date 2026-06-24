import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Timeline from '../components/Timeline';
import Certifications from '../components/Certifications';
import Achievements from '../components/Achievements';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import { getPortfolioData } from '../utils/api';
import { Code2 } from 'lucide-react';

export default function Portfolio() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    skills: [],
    projects: [],
    certifications: [],
    internships: [],
    achievements: [],
    education: [],
    resume: null,
    contactInfo: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getPortfolioData();
        setData(result);
      } catch (err) {
        console.error('Error fetching portfolio:', err);
        setError('Unable to load portfolio data. Please check if the backend server is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-200">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-brand-500/20 animate-bounce mb-4">
          <Code2 size={32} />
        </div>
        <div className="h-1.5 w-48 bg-slate-800 rounded-full overflow-hidden relative">
          <div className="h-full bg-brand-500 rounded-full w-24 absolute left-0 top-0 animate-[shimmer_1.5s_infinite]"></div>
        </div>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-4">Loading Naresh's Portfolio...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-6 text-center text-slate-200">
        <div className="p-4 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 mb-6">
          <Code2 size={40} className="rotate-45" />
        </div>
        <h2 className="font-display font-bold text-2xl mb-2">Failed to Load Portfolio</h2>
        <p className="text-sm text-slate-400 max-w-md mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="glass-button-primary px-5 py-2 text-sm"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-darkBg transition-colors duration-300">
      <Navbar />
      <Hero contactInfo={data.contactInfo} fullData={data} />
      <About contactInfo={data.contactInfo} />
      <Skills skills={data.skills} />
      <Projects projects={data.projects} />
      <Timeline education={data.education} internships={data.internships} />
      <Certifications certifications={data.certifications} />
      <Achievements achievements={data.achievements} />
      <Contact contactInfo={data.contactInfo} />
      <Footer contactInfo={data.contactInfo} />
    </div>
  );
}
