import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';

// Styles
const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', fontSize: 10, color: '#1f2937', backgroundColor: '#ffffff', lineHeight: 1.5 },
  header: { marginBottom: 20, textAlign: 'center' },
  name: { fontSize: 24, fontWeight: 700, color: '#111827', marginBottom: 4 },
  headline: { fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8 },
  contact: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 12, fontSize: 9, color: '#4b5563' },
  link: { color: '#2563eb', textDecoration: 'none' },
  
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 12, fontWeight: 700, color: '#111827', borderBottomWidth: 1, borderBottomColor: '#d1d5db', paddingBottom: 4, marginBottom: 8, textTransform: 'uppercase' },
  
  item: { marginBottom: 8 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  itemTitle: { fontSize: 10, fontWeight: 600, color: '#111827' },
  itemSubtitle: { fontSize: 9, color: '#374151', fontStyle: 'italic' },
  itemDate: { fontSize: 9, color: '#6b7280' },
  
  desc: { fontSize: 9, color: '#4b5563', marginTop: 2, textAlign: 'justify' },
  
  skillCategory: { flexDirection: 'row', marginBottom: 4 },
  skillName: { fontWeight: 600, width: 80 },
  skillList: { flex: 1, color: '#374151' }
});

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  } catch (err) {
    return '';
  }
};

const ResumePDF = ({ data }) => {
  const { contactInfo, education, internships, projects, skills, certifications } = data;

  // Group skills by category
  const skillsByCategory = skills?.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill.name);
    return acc;
  }, {}) || {};

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.name}>{contactInfo?.name?.toUpperCase() || 'S. NARESH'}</Text>
          <Text style={styles.headline}>{contactInfo?.headline || 'Aspiring Software Developer'}</Text>
          <View style={styles.contact}>
            {contactInfo?.email && <Text>{contactInfo.email}</Text>}
            {contactInfo?.phone && <Text>{contactInfo.phone}</Text>}
            {contactInfo?.linkedin_url && <Link src={contactInfo.linkedin_url} style={styles.link}>LinkedIn</Link>}
            {contactInfo?.github_url && <Link src={contactInfo.github_url} style={styles.link}>GitHub</Link>}
            {contactInfo?.address && <Text>{contactInfo.address}</Text>}
          </View>
        </View>

        {/* EDUCATION */}
        {education?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map(edu => (
              <View key={edu.id} style={styles.item}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{edu.degree} in {edu.department}</Text>
                  <Text style={styles.itemDate}>{edu.start_year} - {edu.end_year || 'Present'}</Text>
                </View>
                <Text style={styles.itemSubtitle}>{edu.institution}</Text>
              </View>
            ))}
          </View>
        )}

        {/* SKILLS */}
        {Object.keys(skillsByCategory).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Technical Skills</Text>
            {Object.entries(skillsByCategory).map(([category, items]) => (
              <View key={category} style={styles.skillCategory}>
                <Text style={styles.skillName}>{category}:</Text>
                <Text style={styles.skillList}>{items.join(', ')}</Text>
              </View>
            ))}
          </View>
        )}

        {/* EXPERIENCE / INTERNSHIPS */}
        {internships?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {internships.map(intern => (
              <View key={intern.id} style={styles.item}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{intern.role}</Text>
                  <Text style={styles.itemDate}>
                    {formatDate(intern.start_date)} - {intern.end_date ? formatDate(intern.end_date) : ' Present'}
                  </Text>
                </View>
                <Text style={styles.itemSubtitle}>{intern.company_name}</Text>
                {intern.description && <Text style={styles.desc}>• {intern.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* PROJECTS */}
        {projects?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {projects.map(proj => (
              <View key={proj.id} style={styles.item}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{proj.title} {proj.tech_stack && `| ${proj.tech_stack}`}</Text>
                  <Text style={styles.itemDate}>{formatDate(proj.completion_date)}</Text>
                </View>
                {proj.description && <Text style={styles.desc}>• {proj.description}</Text>}
                {proj.github_url && <Link src={proj.github_url} style={[styles.desc, styles.link]}>GitHub Repository</Link>}
              </View>
            ))}
          </View>
        )}

        {/* CERTIFICATIONS */}
        {certifications?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications & Achievements</Text>
            {certifications.map(cert => (
              <View key={cert.id} style={styles.item}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{cert.name}</Text>
                  <Text style={styles.itemDate}>{formatDate(cert.issue_date)}</Text>
                </View>
                <Text style={styles.itemSubtitle}>{cert.issuing_organization}</Text>
              </View>
            ))}
          </View>
        )}

      </Page>
    </Document>
  );
};

export default ResumePDF;
