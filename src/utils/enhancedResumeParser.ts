
import { cleanText } from './parsers/common';
import { extractName } from './parsers/nameExtractor';
import { extractEmail } from './parsers/emailExtractor';
import { extractPhone } from './parsers/phoneExtractor';
import { extractLocation } from './parsers/locationExtractor';
import { extractSkills } from './parsers/skillsExtractor';
import { extractExperience } from './parsers/experienceExtractor';
import { extractEducation } from './parsers/educationExtractor';
import { extractLanguages } from './parsers/languageExtractor';

interface ExtractedCandidate {
  name: string;
  email: string;
  phone: string;
  location: string;
  skills: string[];
  technicalSkills: string[];
  softSkills: string[];
  experience: string;
  experienceYears: number;
  education: string;
  educationLevel: string;
  certifications: string[];
  languages: string[];
  previousRoles: Array<{title: string, company: string, duration: string, responsibilities: string[]}>;
  projects: Array<{name: string, description: string, technologies: string[]}>;
  achievements: string[];
  summary: string;
  keywords: string[];
  linkedIn: string;
  github: string;
}

export class EnhancedResumeParser {
  static parseResume(resume: any): ExtractedCandidate {
    console.log('=== ENHANCED RESUME PARSING (Refactored) ===');
    const content = resume.content || '';
    const cleanedText = cleanText(content);
    
    console.log('Processing resume:', resume.name);
    console.log('Content length:', content.length);

    const name = extractName(cleanedText, resume.name);
    const email = extractEmail(cleanedText);
    const phone = extractPhone(cleanedText);
    const location = extractLocation(cleanedText);
    const skills = extractSkills(cleanedText);
    const experience = extractExperience(cleanedText);
    const education = extractEducation(cleanedText);
    const languages = extractLanguages(cleanedText);

    // Categorize skills
    const technicalKeywords = ['javascript', 'python', 'java', 'react', 'angular', 'vue', 'node', 'html', 'css', 'sql', 'aws', 'docker', 'git'];
    const softKeywords = ['leadership', 'communication', 'management', 'teamwork', 'problem', 'analysis', 'project'];

    const technicalSkills = skills.filter(skill => 
      technicalKeywords.some(tech => skill.toLowerCase().includes(tech))
    );

    const softSkills = skills.filter(skill => 
      softKeywords.some(soft => skill.toLowerCase().includes(soft))
    );

    const candidate: ExtractedCandidate = {
      name,
      email,
      phone,
      location,
      skills,
      technicalSkills,
      softSkills,
      experience: experience.text,
      experienceYears: experience.years,
      education: education.text,
      educationLevel: education.level,
      certifications: [], // Will be enhanced later
      languages,
      previousRoles: [], // Will be enhanced later
      projects: [], // Will be enhanced later
      achievements: [], // Will be enhanced later
      summary: "Professional summary extracted from resume",
      keywords: [...technicalSkills, ...softSkills].slice(0, 10),
      linkedIn: "Not provided",
      github: "Not provided"
    };

    console.log('=== REFACTORED EXTRACTION RESULTS ===');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Phone:', phone);
    console.log('Skills:', skills.length);
    console.log('Experience years:', experience.years);

    return candidate;
  }
}
