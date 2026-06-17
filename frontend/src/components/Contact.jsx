import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Copy, Check, ArrowRight } from 'lucide-react';
import { submitContact } from '../utils/api';

export default function Contact({ contactInfo }) {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const [copiedType, setCopiedType] = useState(''); // 'email' or 'phone'

  const phone = contactInfo?.phone || '+91 96290 95916';
  const email = contactInfo?.email || 'nnareshkavithach@gmail.com';
  const college = contactInfo?.college || 'Anna University Regional Campus Madurai';
  const dept = contactInfo?.department || 'Computer Science and Engineering';

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(''), 2000);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus({ type: 'error', message: 'Please fill out all required fields.' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });
    try {
      await submitContact(formData);
      setSubmitStatus({ type: 'success', message: 'Thank you! Your message has been sent successfully.' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus({ type: 'error', message: error.message || 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden text-slate-800 dark:text-slate-200">
      
      {/* Decorative Glows */}
      <div className="absolute bottom-1/3 left-0 w-[400px] h-[400px] bg-brand-500/5 rounded-full filter blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-semibold uppercase mb-4 tracking-wider">
            <Mail size={12} />
            <span>Get In Touch</span>
          </div>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-slate-900 dark:text-white mb-4">
            Connect <span className="text-gradient">With Me</span>
          </h2>
          <div className="h-1 w-20 bg-brand-500 mx-auto rounded-full"></div>
        </div>

        {/* Contact Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto items-stretch">
          
          {/* Left panel - Info Details */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            
            <div className="space-y-6">
              <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white mb-4">
                Recruitment & General Inquiries
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-md">
                I am actively seeking software engineering and full-stack development internship opportunities. Feel free to copy my credentials or send a direct query!
              </p>
            </div>

            {/* Email Spec Card */}
            <div className="p-6 rounded-2xl glass-card flex gap-4 items-start relative group">
              <div className="w-11 h-11 rounded-xl bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
                <Mail size={18} />
              </div>
              <div className="flex-grow">
                <h4 className="font-display font-bold text-sm text-slate-400 uppercase tracking-wide">Email Address</h4>
                <p className="text-sm font-bold text-slate-800 dark:text-white mt-1 select-all">{email}</p>
                <div className="flex items-center gap-3 mt-3">
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    <span>Send Mail</span>
                    <ArrowRight size={12} />
                  </a>
                  <button
                    onClick={() => handleCopy(email, 'email')}
                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-550 dark:text-slate-400 hover:text-brand-500 outline-none"
                  >
                    {copiedType === 'email' ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                    <span>{copiedType === 'email' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Phone Spec Card */}
            <div className="p-6 rounded-2xl glass-card flex gap-4 items-start relative group">
              <div className="w-11 h-11 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-650 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Phone size={18} />
              </div>
              <div className="flex-grow">
                <h4 className="font-display font-bold text-sm text-slate-400 uppercase tracking-wide">Mobile Number</h4>
                <p className="text-sm font-bold text-slate-800 dark:text-white mt-1 select-all">{phone}</p>
                <div className="flex items-center gap-3 mt-3">
                  <a
                    href={`tel:${phone}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-500 hover:text-indigo-600 dark:text-indigo-400"
                  >
                    <span>Place Call</span>
                    <ArrowRight size={12} />
                  </a>
                  <button
                    onClick={() => handleCopy(phone, 'phone')}
                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-550 dark:text-slate-400 hover:text-indigo-500 outline-none"
                  >
                    {copiedType === 'phone' ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                    <span>{copiedType === 'phone' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Location Info Card */}
            <div className="p-6 rounded-2xl glass-card flex gap-4 items-start">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <MapPin size={18} />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-slate-400 uppercase tracking-wide">College Campus</h4>
                <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-semibold mt-1">
                  {college}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">{dept}</p>
              </div>
            </div>

          </div>

          {/* Right panel - Dynamic Contact Form */}
          <div className="lg:col-span-7 p-8 rounded-3xl glass-panel border-white/30 dark:border-slate-800/40 shadow-xl flex flex-col justify-between">
            <form onSubmit={handleSubmit} className="space-y-5">
              <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white mb-6">
                Send Direct Message
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className="glass-input"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className="glass-input"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="subject" className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject of inquiry"
                  className="glass-input"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message details here..."
                  className="glass-input resize-none"
                />
              </div>

              {submitStatus.message && (
                <div className={`p-4 rounded-xl text-sm border font-semibold ${
                  submitStatus.type === 'success'
                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/25 dark:text-emerald-400'
                    : 'bg-red-500/10 text-red-600 border-red-500/25 dark:text-red-400'
                }`}>
                  {submitStatus.message}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="glass-button-primary w-full flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Submitting Message...</span>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

      </div>
      
    </section>
  );
}
