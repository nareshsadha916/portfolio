export const BACKEND_URL = import.meta.env.PROD ? '' : 'http://localhost:5000';
export const API_BASE_URL = `${BACKEND_URL}/api`;

/**
 * Helper to get authorization headers
 */
const getAuthHeaders = (isMultipart = false) => {
  const token = localStorage.getItem('adminToken');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

// ==========================================
// PUBLIC ENDPOINTS
// ==========================================

export const getPortfolioData = async () => {
  const response = await fetch(`${API_BASE_URL}/public/portfolio`);
  if (!response.ok) throw new Error('Failed to fetch portfolio data');
  return response.json();
};

export const submitContact = async (data) => {
  const response = await fetch(`${API_BASE_URL}/public/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.message || 'Failed to submit message');
  }
  return response.json();
};

// ==========================================
// AUTH ENDPOINTS
// ==========================================

export const loginAdmin = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Login failed');
  return data;
};

export const verifyAdminToken = async () => {
  const token = localStorage.getItem('adminToken');
  if (!token) return { valid: false };
  
  const response = await fetch(`${API_BASE_URL}/auth/verify`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    localStorage.removeItem('adminToken');
    return { valid: false };
  }
  return response.json();
};

// ==========================================
// ADMIN CRUD ENDPOINTS
// ==========================================

const makeRequest = async (url, method, body = null, isMultipart = false) => {
  const headers = getAuthHeaders(isMultipart);
  const options = {
    method,
    headers,
  };
  if (body) {
    options.body = isMultipart ? body : JSON.stringify(body);
  }
  
  const response = await fetch(`${API_BASE_URL}${url}`, options);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'API request failed');
  return data;
};

// Skills
export const createSkill = (data) => makeRequest('/admin/skills', 'POST', data);
export const updateSkill = (id, data) => makeRequest(`/admin/skills/${id}`, 'PUT', data);
export const deleteSkill = (id) => makeRequest(`/admin/skills/${id}`, 'DELETE');

// Projects
export const createProject = (formData) => makeRequest('/admin/projects', 'POST', formData, true);
export const updateProject = (id, formData) => makeRequest(`/admin/projects/${id}`, 'PUT', formData, true);
export const deleteProject = (id) => makeRequest(`/admin/projects/${id}`, 'DELETE');

// Certifications
export const createCertification = (formData) => makeRequest('/admin/certifications', 'POST', formData, true);
export const updateCertification = (id, formData) => makeRequest(`/admin/certifications/${id}`, 'PUT', formData, true);
export const deleteCertification = (id) => makeRequest(`/admin/certifications/${id}`, 'DELETE');

// Internships
export const createInternship = (formData) => makeRequest('/admin/internships', 'POST', formData, true);
export const updateInternship = (id, formData) => makeRequest(`/admin/internships/${id}`, 'PUT', formData, true);
export const deleteInternship = (id) => makeRequest(`/admin/internships/${id}`, 'DELETE');

// Achievements
export const createAchievement = (data) => makeRequest('/admin/achievements', 'POST', data);
export const updateAchievement = (id, data) => makeRequest(`/admin/achievements/${id}`, 'PUT', data);
export const deleteAchievement = (id) => makeRequest(`/admin/achievements/${id}`, 'DELETE');

// Education
export const createEducation = (data) => makeRequest('/admin/education', 'POST', data);
export const updateEducation = (id, data) => makeRequest(`/admin/education/${id}`, 'PUT', data);
export const deleteEducation = (id) => makeRequest(`/admin/education/${id}`, 'DELETE');

// Contact Info / Profile
export const updateContactInfo = (data) => makeRequest('/admin/contact-info', 'PUT', data);
export const uploadProfileImage = (formData) => makeRequest('/admin/profile-image', 'POST', formData, true);

// Resume
export const uploadResume = (formData) => makeRequest('/admin/resume', 'POST', formData, true);
export const deleteResume = () => makeRequest('/admin/resume', 'DELETE');

// Messages
export const getMessages = () => makeRequest('/admin/messages', 'GET');
export const deleteMessage = (id) => makeRequest(`/admin/messages/${id}`, 'DELETE');
