import type { Resume } from '../services';
import type { ResumeFormValues } from '../../pages/dashboard/resume/components/ResumeForm';

/**
 * Safely parses JSON string and returns default value if parsing fails
 */
function safeJsonParse<T>(jsonString: string, defaultValue: T): T {
  if (!jsonString || jsonString.trim() === '') {
    return defaultValue;
  }
  
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn('Failed to parse JSON string:', jsonString, error);
    return defaultValue;
  }
}

/**
 * Converts API Resume response to ResumeFormValues
 * Handles JSON parsing of complex fields and field name conversion
 */
export function convertResumeToFormValues(resume: Resume): ResumeFormValues {
  return {
    id: String(resume.id) || "",
    title: resume.title || '',
    isActive: resume.is_active || false,
    fullName: resume.full_name || '',
    email: resume.email || '',
    phone: resume.phone || '',
    address: resume.address || '',
    website: resume.website || '',
    linkedin: resume.linkedin || '',
    github: resume.github || '',
    summary: resume.summary || '',
    objective: resume.objective || '',
    experience: safeJsonParse(resume.experience, []),
    education: safeJsonParse(resume.education, []),
    skills: safeJsonParse(resume.skills, []),
    languages: safeJsonParse(resume.languages, []),
    certifications: safeJsonParse(resume.certifications, []),
    projects: safeJsonParse(resume.projects, []),
    awards: resume.awards || '',
    interests: resume.interests || '',
    references: resume.references || '',
    template: resume.template || '',
    theme: resume.theme || '',
  };
}

/**
 * Converts ResumeFormValues back to API format for updates
 * Handles JSON stringification of complex fields and field name conversion
 */
export function convertFormValuesToResume(data: ResumeFormValues, userId: number): {
  user_id: number;
  title: string;
  is_active: boolean;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  linkedin: string;
  github: string;
  summary: string;
  objective: string;
  experience: string;
  education: string;
  skills: string;
  languages: string;
  certifications: string;
  projects: string;
  awards: string;
  interests: string;
  references: string;
  template: string;
  theme: string;
} {
  return {
    user_id: userId,
    title: data.title,
    is_active: data.isActive,
    full_name: data.fullName,
    email: data.email,
    phone: data.phone,
    address: data.address,
    website: data.website,
    linkedin: data.linkedin,
    github: data.github,
    summary: data.summary,
    objective: data.objective,
    experience: JSON.stringify(data.experience),
    education: JSON.stringify(data.education),
    skills: JSON.stringify(data.skills),
    languages: JSON.stringify(data.languages),
    certifications: JSON.stringify(data.certifications),
    projects: JSON.stringify(data.projects),
    awards: data.awards,
    interests: data.interests,
    references: data.references,
    template: data.template,
    theme: data.theme,
  };
} 