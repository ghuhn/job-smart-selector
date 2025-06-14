
import { SmartExtractor } from './smartExtractor';

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

function customCleanText(text: string): string {
    let cleaned = text;

    // Remove PDF specific artifacts that can interfere with parsing
    cleaned = cleaned.replace(/%PDF-[\d.]+/g, '');
    cleaned = cleaned.replace(/%%EOF/g, '');
    cleaned = cleaned.replace(/\d+\s+\d+\s+obj.*?endobj/gs, '');
    cleaned = cleaned.replace(/<</g, '').replace(/>>/g, '');
    cleaned = cleaned.replace(/\/([A-Z][a-zA-Z]+)/g, '');

    // General cleaning
    cleaned = cleaned.replace(/[^\w\s@.+-]/g, ' ');
    cleaned = cleaned.replace(/\s+/g, ' ').trim();

    return cleaned;
}

export class EnhancedResumeParser {
  static parseResume(resume: any): ExtractedCandidate {
    console.log('=== NEW RESUME PARSING LOGIC INITIATED ===');
    const content = resume.content || '';
    const cleanedText = customCleanText(content);
    
    console.log('Processing resume:', resume.name);
    
    const lines = cleanedText.split(/[\n\r]+/).map(l => l.trim()).filter(Boolean);
    const sentences = cleanedText.split(/[.?!]/g).map(s => s.trim()).filter(Boolean);
    const words = cleanedText.toLowerCase().match(/\b(\w+)\b/g) || [];

    const name = SmartExtractor.extractName(words, sentences, lines, resume.name);
    const email = SmartExtractor.extractEmail(words, sentences, lines);
    const phone = SmartExtractor.extractPhone(words, sentences, lines);
    const location = SmartExtractor.extractLocation(words, sentences, lines);
    const skills = SmartExtractor.extractSkills(words, sentences, lines);
    const experience = SmartExtractor.extractExperience(words, sentences, lines);
    const education = SmartExtractor.extractEducation(words, sentences, lines);
    const languages = SmartExtractor.extractLanguages(words, sentences, lines);

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

    console.log('=== NEW EXTRACTION RESULTS ===');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Phone:', phone);
    console.log('Location:', location);
    console.log('Skills:', skills.length);
    console.log('Experience years:', experience.years);

    return candidate;
  }
}
