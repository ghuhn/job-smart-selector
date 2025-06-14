
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

export interface Candidate {
  name: string;
  email: string;
  phone: string;
  location: string;
  skills: string[];
  technicalSkills: string[];
  softSkills: string[];
  experience: ExperienceEntry[];
  experienceYears: number;
  education: EducationEntry[];
  educationLevel: string;
  certifications: string[];
  languages: string[];
  projects: Array<{name: string, description: string, technologies: string[]}>;
  achievements: string[];
  summary: string;
  keywords: string[];
  linkedIn: string;
  github: string;
}

export interface Scores {
  technical: number;
  experience: number;
  education: number;
  communication: number;
  cultural_fit: number;
  project_relevance: number;
  skill_match: number;
  overall: number;
}

export interface AgentFeedback {
  agent: string;
  analysis: string;
  recommendations: string[];
  concerns: string[];
  strengths: string[];
  confidence: number;
}

export interface DetailedAnalysis {
  skillGaps: string[];
  experienceMatch: string;
  educationFit: string;
  projectRelevance: string;
  growthPotential: string;
}

export interface CandidateAnalysis {
  rank: number;
  candidate: Candidate;
  scores: Scores;
  strengths: string[];
  redFlags: string[];
  recommendation: string;
  agentFeedbacks: AgentFeedback[];
  detailedAnalysis: DetailedAnalysis;
  overallFit: string;
}
