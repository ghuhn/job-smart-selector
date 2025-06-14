
export interface EducationEntry {
  degree: string;
  institution: string;
  years: string;
}

export interface ExperienceEntry {
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface ProjectEntry {
  name: string;
  description: string;
  technologies: string[];
}

export interface ParsedCandidate {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedIn?: string;
  github?: string;
  experienceYears?: number;
  education?: EducationEntry[];
  experience?: ExperienceEntry[];
  skills?: string[];
  technicalSkills?: string[];
  softSkills?: string[];
  certifications?: string[];
  languages?: string[];
  projects?: ProjectEntry[];
  achievements?: string[];
}
