
import { AggressiveTextCleaner } from './textCleaner';
import { SmartExtractor } from './smartExtractor';
import { Candidate } from './multiAgentSystem';

export class SmartCandidateExtractor {
  static async extractCandidate(resume: any): Promise<Candidate> {
    console.log('=== SMART CANDIDATE EXTRACTION ===');
    console.log('Resume file:', resume.name);
    
    const content = resume.content || '';
    console.log('Raw content sample:', content.substring(0, 300));
    
    const cleanedText = AggressiveTextCleaner.clean(content);
    const words = AggressiveTextCleaner.extractReadableWords(content);
    const sentences = AggressiveTextCleaner.extractSentences(content);
    
    console.log('Extracted words count:', words.length);
    console.log('Sample words:', words.slice(0, 30));
    console.log('Extracted sentences count:', sentences.length);
    console.log('Sample sentences:', sentences.slice(0, 3));
    
    // Extract basic information
    const name = SmartExtractor.extractName(words, sentences, resume.name);
    const email = SmartExtractor.extractEmail(words, sentences);
    const phone = SmartExtractor.extractPhone(words, sentences);
    const location = SmartExtractor.extractLocation(words, sentences);
    const skills = SmartExtractor.extractSkills(words, sentences);
    const experience = SmartExtractor.extractExperience(words, sentences);
    const education = SmartExtractor.extractEducation(words, sentences);
    const languages = SmartExtractor.extractLanguages(words, sentences);
    
    // Separate technical and soft skills
    const technicalKeywords = ['JavaScript', 'Python', 'Java', 'React', 'Node', 'SQL', 'HTML', 'CSS', 'AWS', 'Docker', 'Git'];
    const softKeywords = ['Leadership', 'Communication', 'Management', 'Teamwork', 'Problem', 'Analysis'];
    
    const technicalSkills = skills.filter(skill => 
      technicalKeywords.some(tech => skill.toLowerCase().includes(tech.toLowerCase()))
    );
    
    const softSkills = skills.filter(skill => 
      softKeywords.some(soft => skill.toLowerCase().includes(soft.toLowerCase()))
    );
    
    const candidate: Candidate = {
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
      certifications: this.extractCertifications(words, sentences),
      languages,
      previousRoles: this.extractPreviousRoles(words, sentences),
      projects: this.extractProjects(words, sentences, technicalSkills),
      achievements: this.extractAchievements(words, sentences),
      summary: this.extractSummary(sentences),
      keywords: [...technicalSkills, ...softSkills].slice(0, 10),
      linkedIn: this.extractLinkedIn(words, sentences),
      github: this.extractGitHub(words, sentences)
    };
    
    console.log('=== EXTRACTION COMPLETE ===');
    console.log('Final candidate:', candidate);
    
    return candidate;
  }

  private static extractCertifications(words: string[], sentences: string[]): string[] {
    const certKeywords = ['AWS', 'Microsoft', 'Google', 'PMP', 'Scrum', 'CISSP', 'CompTIA', 'Certified', 'Certification'];
    const certs = [];
    
    for (const word of words) {
      for (const cert of certKeywords) {
        if (word.toLowerCase().includes(cert.toLowerCase())) {
          certs.push(cert);
          break;
        }
      }
    }
    
    return [...new Set(certs)];
  }

  private static extractPreviousRoles(words: string[], sentences: string[]): Array<{title: string, company: string, duration: string, responsibilities: string[]}> {
    const jobTitles = ['Engineer', 'Developer', 'Manager', 'Analyst', 'Designer', 'Consultant', 'Director', 'Specialist', 'Lead', 'Senior', 'Junior'];
    const roles = [];
    
    for (const sentence of sentences.slice(0, 10)) {
      for (const title of jobTitles) {
        if (sentence.toLowerCase().includes(title.toLowerCase())) {
          roles.push({
            title: `${title} (from resume)`,
            company: "Company details in resume",
            duration: "Duration mentioned in resume",
            responsibilities: ["Responsibilities listed in resume"]
          });
          break;
        }
      }
      if (roles.length >= 2) break;
    }
    
    return roles;
  }

  private static extractProjects(words: string[], sentences: string[], techSkills: string[]): Array<{name: string, description: string, technologies: string[]}> {
    const projectIndicators = ['project', 'built', 'developed', 'created', 'implemented'];
    const projects = [];
    
    for (const sentence of sentences.slice(0, 10)) {
      if (projectIndicators.some(indicator => sentence.toLowerCase().includes(indicator))) {
        projects.push({
          name: "Project mentioned in resume",
          description: sentence.substring(0, 100) + "...",
          technologies: techSkills.slice(0, 3)
        });
        break;
      }
    }
    
    return projects;
  }

  private static extractAchievements(words: string[], sentences: string[]): string[] {
    const achievementWords = ['achieved', 'accomplished', 'award', 'recognition', 'improved', 'increased', 'reduced'];
    const achievements = [];
    
    for (const sentence of sentences.slice(0, 10)) {
      if (achievementWords.some(word => sentence.toLowerCase().includes(word))) {
        achievements.push(sentence.substring(0, 80) + "...");
        if (achievements.length >= 2) break;
      }
    }
    
    return achievements;
  }

  private static extractSummary(sentences: string[]): string {
    const firstMeaningfulSentence = sentences.find(s => 
      s.length > 20 && 
      !s.toLowerCase().includes('resume') && 
      !s.toLowerCase().includes('cv')
    );
    
    return firstMeaningfulSentence ? 
      firstMeaningfulSentence.substring(0, 150) + "..." : 
      "Professional summary available in resume";
  }

  private static extractLinkedIn(words: string[], sentences: string[]): string {
    for (const word of words) {
      if (word.toLowerCase().includes('linkedin')) {
        return `LinkedIn profile mentioned: ${word}`;
      }
    }
    
    for (const sentence of sentences) {
      if (sentence.toLowerCase().includes('linkedin')) {
        const match = sentence.match(/linkedin\.com\/in\/[\w-]+/i);
        if (match) return match[0];
      }
    }
    
    return "Not provided";
  }

  private static extractGitHub(words: string[], sentences: string[]): string {
    for (const word of words) {
      if (word.toLowerCase().includes('github')) {
        return `GitHub profile mentioned: ${word}`;
      }
    }
    
    for (const sentence of sentences) {
      if (sentence.toLowerCase().includes('github')) {
        const match = sentence.match(/github\.com\/[\w-]+/i);
        if (match) return match[0];
      }
    }
    
    return "Not provided";
  }
}
