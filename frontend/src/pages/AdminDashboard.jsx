import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  verifyAdminToken, getPortfolioData,
  createSkill, updateSkill, deleteSkill,
  createProject, updateProject, deleteProject,
  createCertification, updateCertification, deleteCertification,
  createInternship, updateInternship, deleteInternship,
  createAchievement, updateAchievement, deleteAchievement,
  createEducation, updateEducation, deleteEducation,
  updateContactInfo, uploadProfileImage, uploadResume, deleteResume,
  getMessages, deleteMessage, BACKEND_URL
} from '../utils/api';
import {
  Code2, LogOut, Award, Briefcase, GraduationCap, Trophy, Mail, FileText, Settings,
  Plus, Edit, Trash2, LayoutDashboard, ArrowRight, ShieldCheck, X, FileUp, User, Camera
} from 'lucide-react';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [portfolio, setPortfolio] = useState(null);
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  // Dialog State
  const [modalType, setModalType] = useState(null); // 'skill' | 'project' | 'cert' | 'intern' | 'ach' | 'edu'
  const [editingItem, setEditingItem] = useState(null); // Item being edited or null for add

  // Form State
  const [skillForm, setSkillForm] = useState({ name: '', category: 'Programming', proficiency: 100 });
  const [projectForm, setProjectForm] = useState({
    title: '', description: '', tech_stack: '', github_url: '', live_url: '',
    completion_date: '', status: 'Completed', category: 'Web Development'
  });
  const [projectFile, setProjectFile] = useState(null);

  const [certForm, setCertForm] = useState({ name: '', issuing_organization: '', issue_date: '' });
  const [certImageFile, setCertImageFile] = useState(null);
  const [certPdfFile, setCertPdfFile] = useState(null);

  const [internForm, setInternForm] = useState({
    company_name: '', role: '', description: '', start_date: '', end_date: ''
  });
  const [internFile, setInternFile] = useState(null);

  const [achForm, setAchForm] = useState({ title: '', description: '', date: '' });
  const [eduForm, setEduForm] = useState({
    institution: '', degree: '', department: '', start_year: '', end_year: '', status: 'Second Year Student'
  });
  const [contactForm, setContactForm] = useState({
    name: '', phone: '', email: '', college: '', department: '',
    github_url: '', linkedin_url: '', twitter_url: '', bio: '', headline: '',
    address: '', designation: '', profile_image_url: ''
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);

  // Check login and fetch data
  const loadData = async () => {
    try {
      const auth = await verifyAdminToken();
      if (!auth.valid) {
        navigate('/admin/login');
        return;
      }
      const pData = await getPortfolioData();
      setPortfolio(pData);
      
      if (pData.contactInfo) {
        const cleanedContact = {};
        Object.keys(pData.contactInfo).forEach(key => {
          cleanedContact[key] = pData.contactInfo[key] ?? '';
        });
        setContactForm(cleanedContact);
      }

      const mData = await getMessages();
      setMessages(mData);
    } catch (err) {
      console.error(err);
      navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);

    if (type === 'skill') {
      setSkillForm(item ? { ...item } : { name: '', category: 'Programming', proficiency: 100 });
    } else if (type === 'project') {
      setProjectForm(item ? {
        title: item.title,
        description: item.description,
        tech_stack: item.tech_stack,
        github_url: item.github_url || '',
        live_url: item.live_url || '',
        completion_date: item.completion_date ? item.completion_date.split('T')[0] : '',
        status: item.status || 'Completed',
        category: item.category || 'Web Development'
      } : {
        title: '', description: '', tech_stack: '', github_url: '', live_url: '',
        completion_date: '', status: 'Completed', category: 'Web Development'
      });
      setProjectFile(null);
    } else if (type === 'cert') {
      setCertForm(item ? {
        name: item.name,
        issuing_organization: item.issuing_organization,
        issue_date: item.issue_date ? item.issue_date.split('T')[0] : ''
      } : { name: '', issuing_organization: '', issue_date: '' });
      setCertImageFile(null);
      setCertPdfFile(null);
    } else if (type === 'intern') {
      setInternForm(item ? {
        company_name: item.company_name,
        role: item.role,
        description: item.description,
        start_date: item.start_date ? item.start_date.split('T')[0] : '',
        end_date: item.end_date ? item.end_date.split('T')[0] : ''
      } : { company_name: '', role: '', description: '', start_date: '', end_date: '' });
      setInternFile(null);
    } else if (type === 'ach') {
      setAchForm(item ? {
        title: item.title,
        description: item.description,
        date: item.date ? item.date.split('T')[0] : ''
      } : { title: '', description: '', date: '' });
    } else if (type === 'edu') {
      setEduForm(item ? {
        institution: item.institution,
        degree: item.degree,
        department: item.department,
        start_year: item.start_year || '',
        end_year: item.end_year || '',
        status: item.status || 'Second Year Student'
      } : { institution: '', degree: '', department: '', start_year: '', end_year: '', status: 'Second Year Student' });
    }
  };

  const closeModal = () => {
    setModalType(null);
    setEditingItem(null);
  };

  // CRUD Actions
  const handleSaveSkill = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateSkill(editingItem.id, skillForm);
      } else {
        await createSkill(skillForm);
      }
      closeModal();
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteSkill = async (id) => {
    if (!window.confirm('Delete this skill?')) return;
    try {
      await deleteSkill(id);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append('title', projectForm.title);
      fd.append('description', projectForm.description);
      fd.append('tech_stack', projectForm.tech_stack);
      fd.append('github_url', projectForm.github_url);
      fd.append('live_url', projectForm.live_url);
      fd.append('completion_date', projectForm.completion_date);
      fd.append('status', projectForm.status);
      fd.append('category', projectForm.category);
      if (projectFile) {
        fd.append('image', projectFile);
      } else if (editingItem && editingItem.image_url) {
        fd.append('image_url', editingItem.image_url);
      }

      if (editingItem) {
        await updateProject(editingItem.id, fd);
      } else {
        await createProject(fd);
      }
      closeModal();
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await deleteProject(id);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSaveCert = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append('name', certForm.name);
      fd.append('issuing_organization', certForm.issuing_organization);
      fd.append('issue_date', certForm.issue_date);
      if (certImageFile) fd.append('image', certImageFile);
      if (certPdfFile) fd.append('pdf', certPdfFile);
      
      if (editingItem) {
        if (!certImageFile && editingItem.image_url) fd.append('image_url', editingItem.image_url);
        if (!certPdfFile && editingItem.pdf_url) fd.append('pdf_url', editingItem.pdf_url);
        await updateCertification(editingItem.id, fd);
      } else {
        await createCertification(fd);
      }
      closeModal();
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteCert = async (id) => {
    if (!window.confirm('Delete this certification?')) return;
    try {
      await deleteCertification(id);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSaveIntern = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append('company_name', internForm.company_name);
      fd.append('role', internForm.role);
      fd.append('description', internForm.description);
      fd.append('start_date', internForm.start_date);
      fd.append('end_date', internForm.end_date);
      if (internFile) fd.append('certificate', internFile);
      
      if (editingItem) {
        if (!internFile && editingItem.certificate_url) fd.append('certificate_url', editingItem.certificate_url);
        await updateInternship(editingItem.id, fd);
      } else {
        await createInternship(fd);
      }
      closeModal();
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteIntern = async (id) => {
    if (!window.confirm('Delete this internship?')) return;
    try {
      await deleteInternship(id);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSaveAch = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateAchievement(editingItem.id, achForm);
      } else {
        await createAchievement(achForm);
      }
      closeModal();
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteAch = async (id) => {
    if (!window.confirm('Delete this achievement?')) return;
    try {
      await deleteAchievement(id);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSaveEdu = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateEducation(editingItem.id, eduForm);
      } else {
        await createEducation(eduForm);
      }
      closeModal();
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteEdu = async (id) => {
    if (!window.confirm('Delete this education record?')) return;
    try {
      await deleteEducation(id);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateContact = async (e) => {
    e.preventDefault();
    try {
      await updateContactInfo(contactForm);
      alert('Profile information updated successfully!');
      setIsEditingProfile(false);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append('profile_image', file);
      const res = await uploadProfileImage(fd);
      setContactForm(prev => ({ ...prev, profile_image_url: res.profile_image_url }));
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Delete this inquiry message?')) return;
    try {
      await deleteMessage(id);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-200">
        <ShieldCheck size={40} className="text-brand-500 animate-pulse mb-3" />
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Validating Authentication...</p>
      </div>
    );
  }

  if (!portfolio) {
    return null;
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'skills', label: 'Skills', icon: Award },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'internships', label: 'Internships', icon: Briefcase },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'contact', label: 'Profile', icon: User },
    { id: 'messages', label: `Messages (${messages.length})`, icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col md:flex-row relative">
      
      {/* Sidebar navigation */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 p-6 z-20">
        <div>
          {/* Brand header */}
          <div className="flex items-center gap-2.5 mb-8 pb-6 border-b border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-500 to-indigo-600 flex items-center justify-center text-white">
              <Code2 size={16} />
            </div>
            <span className="font-display font-extrabold text-lg text-white">Admin CMS</span>
          </div>

          {/* Nav List */}
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors outline-none text-left ${
                    isActive
                      ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/10'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="mt-8 border-t border-slate-850 pt-6">
          <a
            href="/"
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:bg-slate-800 hover:text-slate-200 mb-2"
          >
            <ArrowRight size={16} className="rotate-180" />
            <span>View Site</span>
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 outline-none"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-8 md:p-10 max-h-screen overflow-y-auto z-10 relative">
        <div className="glow-spot glow-spot-primary top-10 left-10 opacity-[0.05]"></div>

        {/* Dynamic tab contents */}

        {/* Tab 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="font-display font-extrabold text-3xl text-white">System Dashboard</h2>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1.5">Overview & Statistics</p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Projects', val: portfolio?.projects.length || 0, icon: Briefcase, color: 'text-brand-500' },
                { label: 'Skills', val: portfolio?.skills.length || 0, icon: Award, color: 'text-amber-500' },
                { label: 'Certificates', val: portfolio?.certifications.length || 0, icon: Award, color: 'text-emerald-500' },
                { label: 'Unread Messages', val: messages.length, icon: Mail, color: 'text-pink-500' },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-sm font-semibold text-slate-400 uppercase tracking-wide">{stat.label}</span>
                      <Icon className={stat.color} size={20} />
                    </div>
                    <span className="font-display font-extrabold text-4xl text-white">{stat.val}</span>
                  </div>
                );
              })}
            </div>

            {/* Quick Profile Summary */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <h3 className="font-display font-bold text-lg mb-3">Active Profile</h3>
              <p className="text-sm text-slate-300 font-bold mb-1">{portfolio?.contactInfo?.name || 'S. Naresh'}</p>
              <p className="text-xs text-slate-500">{portfolio?.contactInfo?.headline || 'Aspiring Cyber Security Professional'}</p>
              <div className="mt-4 text-xs text-brand-400 font-medium border-t border-slate-800 pt-4 flex gap-4">
                <span>Phone: {portfolio?.contactInfo?.phone}</span>
                <span>Email: {portfolio?.contactInfo?.email}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: PROJECTS */}
        {activeTab === 'projects' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-extrabold text-3xl text-white">Projects Management</h2>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1.5">Add, Edit or Remove Projects</p>
              </div>
              <button
                onClick={() => openModal('project')}
                className="glass-button-primary flex items-center gap-2 py-2 px-4 text-xs font-bold"
              >
                <Plus size={14} />
                <span>Add Project</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {portfolio?.projects.map(proj => (
                <div key={proj.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                      {proj.image_url ? (
                        <img src={`${BACKEND_URL}${proj.image_url}`} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Briefcase size={20} className="text-slate-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-white text-base leading-tight">{proj.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 uppercase font-bold">{proj.category} &bull; {proj.status}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal('project', proj)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(proj.id)}
                      className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/40 text-red-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: SKILLS */}
        {activeTab === 'skills' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-extrabold text-3xl text-white">Skills Inventory</h2>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1.5">Manage Categorized Capabilities</p>
              </div>
              <button
                onClick={() => openModal('skill')}
                className="glass-button-primary flex items-center gap-2 py-2 px-4 text-xs font-bold"
              >
                <Plus size={14} />
                <span>Add Skill</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {portfolio?.skills.map(sk => (
                <div key={sk.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <div>
                    <h4 className="font-display font-bold text-white leading-tight">{sk.name}</h4>
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{sk.category} ({sk.proficiency}%)</span>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => openModal('skill', sk)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                      <Edit size={12} />
                    </button>
                    <button
                      onClick={() => handleDeleteSkill(sk.id)}
                      className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/40 text-red-400"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: CERTIFICATES */}
        {activeTab === 'certificates' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-extrabold text-3xl text-white">Certification Records</h2>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1.5">Add or remove qualifications</p>
              </div>
              <button
                onClick={() => openModal('cert')}
                className="glass-button-primary flex items-center gap-2 py-2 px-4 text-xs font-bold"
              >
                <Plus size={14} />
                <span>Add Certification</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {portfolio?.certifications.map(c => (
                <div key={c.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-display font-bold text-white text-base leading-tight">{c.name}</h4>
                    <p className="text-xs text-slate-400 mt-1">{c.issuing_organization}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => openModal('cert', c)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteCert(c.id)}
                      className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/40 text-red-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: INTERNSHIPS */}
        {activeTab === 'internships' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-extrabold text-3xl text-white">Internships Log</h2>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1.5">Manage Company Positions</p>
              </div>
              <button
                onClick={() => openModal('intern')}
                className="glass-button-primary flex items-center gap-2 py-2 px-4 text-xs font-bold"
              >
                <Plus size={14} />
                <span>Add Internship</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {portfolio?.internships.map(intern => (
                <div key={intern.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-display font-bold text-white text-base leading-tight">{intern.role}</h4>
                    <p className="text-xs text-brand-500 mt-1 font-semibold">{intern.company_name}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal('intern', intern)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteIntern(intern.id)}
                      className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/40 text-red-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: ACHIEVEMENTS */}
        {activeTab === 'achievements' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-extrabold text-3xl text-white">Achievements & Awards</h2>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1.5">Log key academic milestones</p>
              </div>
              <button
                onClick={() => openModal('ach')}
                className="glass-button-primary flex items-center gap-2 py-2 px-4 text-xs font-bold"
              >
                <Plus size={14} />
                <span>Add Achievement</span>
              </button>
            </div>

            <div className="space-y-4 max-w-4xl">
              {portfolio?.achievements.map(ach => (
                <div key={ach.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
                  <div className="flex-grow">
                    <h4 className="font-display font-bold text-white text-base leading-tight mb-1">{ach.title}</h4>
                    <p className="text-xs text-slate-405 leading-relaxed line-clamp-2">{ach.description}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => openModal('ach', ach)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteAch(ach.id)}
                      className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/40 text-red-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 7: EDUCATION */}
        {activeTab === 'education' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-extrabold text-3xl text-white">Education History</h2>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1.5">Manage Academic Timeline</p>
              </div>
              <button
                onClick={() => openModal('edu')}
                className="glass-button-primary flex items-center gap-2 py-2 px-4 text-xs font-bold"
              >
                <Plus size={14} />
                <span>Add Record</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {portfolio?.education.map(edu => (
                <div key={edu.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-display font-bold text-white text-base leading-tight">{edu.degree}</h4>
                    <p className="text-xs text-slate-400 mt-1">{edu.institution}</p>
                    <p className="text-[10px] text-slate-550 mt-0.5">{edu.department}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal('edu', edu)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteEdu(edu.id)}
                      className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/40 text-red-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 8: PROFILE */}
        {activeTab === 'contact' && (
          <div className="space-y-8 animate-fade-in max-w-4xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-extrabold text-3xl text-white">Profile Management</h2>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1.5">Manage Your Identity & Contact Details</p>
              </div>
              {!isEditingProfile && (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="glass-button-primary flex items-center gap-2 py-2 px-4 text-xs font-bold"
                >
                  <Edit size={14} />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>

            {!isEditingProfile ? (
              // PROFILE CARD VIEW
              <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-brand-500/20 to-indigo-500/20 border-b border-slate-800"></div>
                
                <div className="relative z-10 flex flex-col sm:flex-row gap-8 items-center sm:items-start pt-12">
                  {/* Profile Image with Upload Trigger */}
                  <div className="relative group shrink-0">
                    <div className="w-40 h-40 rounded-full border-4 border-slate-900 overflow-hidden bg-slate-950 flex items-center justify-center relative shadow-xl">
                      {contactForm.profile_image_url ? (
                        <img src={`${BACKEND_URL}${contactForm.profile_image_url}`} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User size={64} className="text-slate-700" />
                      )}
                      
                      {/* Hover Overlay for Upload */}
                      <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Camera size={28} className="text-white" />
                        <input type="file" accept="image/jpeg, image/png, image/jpg" onChange={handleProfileImageChange} className="hidden" />
                      </label>
                    </div>
                  </div>

                  {/* Profile Details */}
                  <div className="flex-grow text-center sm:text-left mt-2 sm:mt-8">
                    <h3 className="font-display font-extrabold text-3xl text-white tracking-tight">{contactForm.name || 'Not Set'}</h3>
                    <p className="text-brand-400 font-semibold text-lg mt-1">{contactForm.designation || contactForm.headline || 'Designation Not Set'}</p>
                    <p className="text-slate-500 text-sm mt-1">{contactForm.department || 'Department Not Set'}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-6 border-t border-slate-800/60 text-sm">
                      <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Email</p>
                        <p className="text-slate-300 font-medium">{contactForm.email || 'Not Set'}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Phone</p>
                        <p className="text-slate-300 font-medium">{contactForm.phone || 'Not Set'}</p>
                      </div>
                      <div className="sm:col-span-2 mt-2">
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Address</p>
                        <p className="text-slate-300 font-medium leading-relaxed">{contactForm.address || 'Address Not Set'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // EDIT PROFILE FORM
              <form onSubmit={handleUpdateContact} className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-display font-bold text-lg">Update Profile Information</h3>
                  <button type="button" onClick={() => setIsEditingProfile(false)} className="text-slate-500 hover:text-slate-300 transition-colors">Cancel</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Full Name</label>
                    <input type="text" value={contactForm.name} onChange={e => setContactForm(prev => ({ ...prev, name: e.target.value }))} className="glass-input" required />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Designation</label>
                    <input type="text" value={contactForm.designation} onChange={e => setContactForm(prev => ({ ...prev, designation: e.target.value }))} className="glass-input" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Department</label>
                    <input type="text" value={contactForm.department} onChange={e => setContactForm(prev => ({ ...prev, department: e.target.value }))} className="glass-input" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">College Name</label>
                    <input type="text" value={contactForm.college} onChange={e => setContactForm(prev => ({ ...prev, college: e.target.value }))} className="glass-input" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Phone Number</label>
                    <input type="text" value={contactForm.phone} onChange={e => setContactForm(prev => ({ ...prev, phone: e.target.value }))} className="glass-input" required />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Email Address</label>
                    <input type="email" value={contactForm.email} onChange={e => setContactForm(prev => ({ ...prev, email: e.target.value }))} className="glass-input" required />
                  </div>
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Address</label>
                    <textarea rows={2} value={contactForm.address} onChange={e => setContactForm(prev => ({ ...prev, address: e.target.value }))} className="glass-input resize-none" />
                  </div>
                  <div className="flex flex-col gap-1.5 sm:col-span-2 mt-4 pt-4 border-t border-slate-800">
                    <h4 className="font-bold text-sm text-slate-300 mb-2">Social Links & Biography</h4>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">GitHub Link</label>
                    <input type="url" value={contactForm.github_url} onChange={e => setContactForm(prev => ({ ...prev, github_url: e.target.value }))} className="glass-input" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">LinkedIn Link</label>
                    <input type="url" value={contactForm.linkedin_url} onChange={e => setContactForm(prev => ({ ...prev, linkedin_url: e.target.value }))} className="glass-input" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Twitter Link</label>
                    <input type="url" value={contactForm.twitter_url} onChange={e => setContactForm(prev => ({ ...prev, twitter_url: e.target.value }))} className="glass-input" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Professional Headline</label>
                    <input type="text" value={contactForm.headline} onChange={e => setContactForm(prev => ({ ...prev, headline: e.target.value }))} className="glass-input" />
                  </div>
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Biography (About Me)</label>
                    <textarea rows={4} value={contactForm.bio} onChange={e => setContactForm(prev => ({ ...prev, bio: e.target.value }))} className="glass-input resize-none" />
                  </div>
                </div>

                <button type="submit" className="glass-button-primary w-full py-3 mt-6 cursor-pointer text-sm">
                  Save Profile Updates
                </button>
              </form>
            )}
          </div>
        )}

        {/* Tab 9: MESSAGES INBOX */}
        {activeTab === 'messages' && (
          <div className="space-y-8 animate-fade-in max-w-4xl">
            <div>
              <h2 className="font-display font-extrabold text-3xl text-white">Recruiter Inbox</h2>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1.5">Submitted Contact Inquiries</p>
            </div>

            <div className="space-y-4">
              {messages.length === 0 ? (
                <p className="text-slate-500 italic p-8 rounded-2xl bg-slate-900 border border-slate-800">No contact messages received.</p>
              ) : (
                messages.map(msg => (
                  <div key={msg.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 relative">
                    <button
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="absolute top-6 right-6 p-2 rounded-lg bg-red-950/20 hover:bg-red-900/30 text-red-400 outline-none"
                    >
                      <Trash2 size={14} />
                    </button>

                    <div>
                      <h4 className="font-display font-bold text-base text-white">{msg.subject || '(No Subject)'}</h4>
                      <p className="text-xs text-brand-400 mt-0.5">From: {msg.name} ({msg.email})</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Received: {new Date(msg.created_at).toLocaleString()}</p>
                    </div>

                    <p className="text-sm text-slate-300 bg-slate-950/60 p-4 rounded-xl whitespace-pre-wrap leading-relaxed select-all">
                      {msg.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </main>

      {/* CRUD MODAL SHEET */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-xl p-8 rounded-3xl glass-panel shadow-2xl border-white/20 dark:border-slate-800/60 overflow-hidden relative max-h-[90vh] flex flex-col">
            
            {/* Modal header */}
            <div className="flex justify-between items-center mb-6 shrink-0">
              <h3 className="font-display font-bold text-xl text-white">
                {editingItem ? 'Edit' : 'Add'} {modalType.toUpperCase()}
              </h3>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal scroll area */}
            <div className="overflow-y-auto pr-2 flex-grow">
              
              {/* Form 1: SKILL */}
              {modalType === 'skill' && (
                <form onSubmit={handleSaveSkill} className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Skill Name</label>
                    <input
                      type="text"
                      value={skillForm.name}
                      onChange={e => setSkillForm(prev => ({ ...prev, name: e.target.value }))}
                      className="glass-input"
                      placeholder="e.g. Node.js"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Category</label>
                    <select
                      value={skillForm.category}
                      onChange={e => setSkillForm(prev => ({ ...prev, category: e.target.value }))}
                      className="glass-input bg-slate-900"
                    >
                      <option value="Programming">Programming</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Database">Database</option>
                      <option value="AI/ML">AI/ML</option>
                      <option value="Soft Skills">Soft Skills</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Proficiency (%)</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={skillForm.proficiency}
                      onChange={e => setSkillForm(prev => ({ ...prev, proficiency: parseInt(e.target.value) }))}
                      className="glass-input"
                      required
                    />
                  </div>
                  <button type="submit" className="glass-button-primary w-full py-2.5 mt-4 cursor-pointer">
                    Save Skill
                  </button>
                </form>
              )}

              {/* Form 2: PROJECT */}
              {modalType === 'project' && (
                <form onSubmit={handleSaveProject} className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Project Title</label>
                    <input
                      type="text"
                      value={projectForm.title}
                      onChange={e => setProjectForm(prev => ({ ...prev, title: e.target.value }))}
                      className="glass-input"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Description</label>
                    <textarea
                      rows={3}
                      value={projectForm.description}
                      onChange={e => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                      className="glass-input resize-none"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Technology Used (comma separated)</label>
                    <input
                      type="text"
                      value={projectForm.tech_stack}
                      onChange={e => setProjectForm(prev => ({ ...prev, tech_stack: e.target.value }))}
                      className="glass-input"
                      placeholder="React.js, Node.js, Tailwind CSS"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">GitHub URL</label>
                      <input
                        type="url"
                        value={projectForm.github_url}
                        onChange={e => setProjectForm(prev => ({ ...prev, github_url: e.target.value }))}
                        className="glass-input"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Live Demo URL</label>
                      <input
                        type="url"
                        value={projectForm.live_url}
                        onChange={e => setProjectForm(prev => ({ ...prev, live_url: e.target.value }))}
                        className="glass-input"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Category</label>
                      <input
                        type="text"
                        value={projectForm.category}
                        onChange={e => setProjectForm(prev => ({ ...prev, category: e.target.value }))}
                        className="glass-input"
                        placeholder="e.g. Web Development, CLI Tool"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Status</label>
                      <select
                        value={projectForm.status}
                        onChange={e => setProjectForm(prev => ({ ...prev, status: e.target.value }))}
                        className="glass-input bg-slate-900"
                      >
                        <option value="Completed">Completed</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Planned">Planned</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5 col-span-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Completion Date</label>
                      <input
                        type="date"
                        value={projectForm.completion_date}
                        onChange={e => setProjectForm(prev => ({ ...prev, completion_date: e.target.value }))}
                        className="glass-input"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Project Screenshot File</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => setProjectFile(e.target.files[0])}
                      className="text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-500/10 file:text-brand-400 file:cursor-pointer hover:file:bg-brand-500/20"
                    />
                  </div>
                  <button type="submit" className="glass-button-primary w-full py-2.5 mt-4 cursor-pointer">
                    Save Project
                  </button>
                </form>
              )}

              {/* Form 3: CERTIFICATION */}
              {modalType === 'cert' && (
                <form onSubmit={handleSaveCert} className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Certificate Name</label>
                    <input
                      type="text"
                      value={certForm.name}
                      onChange={e => setCertForm(prev => ({ ...prev, name: e.target.value }))}
                      className="glass-input"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Issuing Organization</label>
                    <input
                      type="text"
                      value={certForm.issuing_organization}
                      onChange={e => setCertForm(prev => ({ ...prev, issuing_organization: e.target.value }))}
                      className="glass-input"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Issue Date</label>
                    <input
                      type="date"
                      value={certForm.issue_date}
                      onChange={e => setCertForm(prev => ({ ...prev, issue_date: e.target.value }))}
                      className="glass-input"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Certificate Image File</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => setCertImageFile(e.target.files[0])}
                        className="text-xs text-slate-400 file:py-1 file:px-2 file:rounded-lg file:border-0 file:bg-brand-500/10 file:text-brand-400"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Certificate PDF File</label>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={e => setCertPdfFile(e.target.files[0])}
                        className="text-xs text-slate-400 file:py-1 file:px-2 file:rounded-lg file:border-0 file:bg-brand-500/10 file:text-brand-400"
                      />
                    </div>
                  </div>
                  <button type="submit" className="glass-button-primary w-full py-2.5 mt-4 cursor-pointer">
                    Save Certification
                  </button>
                </form>
              )}

              {/* Form 4: INTERNSHIP */}
              {modalType === 'intern' && (
                <form onSubmit={handleSaveIntern} className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Company Name</label>
                    <input
                      type="text"
                      value={internForm.company_name}
                      onChange={e => setInternForm(prev => ({ ...prev, company_name: e.target.value }))}
                      className="glass-input"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Role / Position</label>
                    <input
                      type="text"
                      value={internForm.role}
                      onChange={e => setInternForm(prev => ({ ...prev, role: e.target.value }))}
                      className="glass-input"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Description</label>
                    <textarea
                      rows={3}
                      value={internForm.description}
                      onChange={e => setInternForm(prev => ({ ...prev, description: e.target.value }))}
                      className="glass-input resize-none"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Start Date</label>
                      <input
                        type="date"
                        value={internForm.start_date}
                        onChange={e => setInternForm(prev => ({ ...prev, start_date: e.target.value }))}
                        className="glass-input"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">End Date</label>
                      <input
                        type="date"
                        value={internForm.end_date}
                        onChange={e => setInternForm(prev => ({ ...prev, end_date: e.target.value }))}
                        className="glass-input"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Completion Certificate File</label>
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={e => setInternFile(e.target.files[0])}
                      className="text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-500/10 file:text-brand-400"
                    />
                  </div>
                  <button type="submit" className="glass-button-primary w-full py-2.5 mt-4 cursor-pointer">
                    Save Internship
                  </button>
                </form>
              )}

              {/* Form 5: ACHIEVEMENT */}
              {modalType === 'ach' && (
                <form onSubmit={handleSaveAch} className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Achievement Title</label>
                    <input
                      type="text"
                      value={achForm.title}
                      onChange={e => setAchForm(prev => ({ ...prev, title: e.target.value }))}
                      className="glass-input"
                      placeholder="e.g. Won Hackathon 2026"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Description</label>
                    <textarea
                      rows={3}
                      value={achForm.description}
                      onChange={e => setAchForm(prev => ({ ...prev, description: e.target.value }))}
                      className="glass-input resize-none"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Date Accomplished</label>
                    <input
                      type="date"
                      value={achForm.date}
                      onChange={e => setAchForm(prev => ({ ...prev, date: e.target.value }))}
                      className="glass-input"
                    />
                  </div>
                  <button type="submit" className="glass-button-primary w-full py-2.5 mt-4 cursor-pointer">
                    Save Achievement
                  </button>
                </form>
              )}

              {/* Form 6: EDUCATION */}
              {modalType === 'edu' && (
                <form onSubmit={handleSaveEdu} className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Institution Name</label>
                    <input
                      type="text"
                      value={eduForm.institution}
                      onChange={e => setEduForm(prev => ({ ...prev, institution: e.target.value }))}
                      className="glass-input"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Degree</label>
                      <input
                        type="text"
                        value={eduForm.degree}
                        onChange={e => setEduForm(prev => ({ ...prev, degree: e.target.value }))}
                        className="glass-input"
                        placeholder="e.g. B.E."
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Department</label>
                      <input
                        type="text"
                        value={eduForm.department}
                        onChange={e => setEduForm(prev => ({ ...prev, department: e.target.value }))}
                        className="glass-input"
                        placeholder="e.g. CSE"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Start Year</label>
                      <input
                        type="text"
                        value={eduForm.start_year}
                        onChange={e => setEduForm(prev => ({ ...prev, start_year: e.target.value }))}
                        className="glass-input"
                        placeholder="e.g. 2024"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">End Year (or Present)</label>
                      <input
                        type="text"
                        value={eduForm.end_year}
                        onChange={e => setEduForm(prev => ({ ...prev, end_year: e.target.value }))}
                        className="glass-input"
                        placeholder="e.g. 2028"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Current Status / Grade</label>
                    <input
                      type="text"
                      value={eduForm.status}
                      onChange={e => setEduForm(prev => ({ ...prev, status: e.target.value }))}
                      className="glass-input"
                      placeholder="e.g. Second Year Student"
                      required
                    />
                  </div>
                  <button type="submit" className="glass-button-primary w-full py-2.5 mt-4 cursor-pointer">
                    Save Education Record
                  </button>
                </form>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
