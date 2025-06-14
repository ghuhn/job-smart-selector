import { AggressiveTextCleaner } from './textCleaner';
import { SmartExtractor } from './smartExtractor';
import { Candidate } from './multiAgentSystem';
import { SimpleResumeParser, SimpleParsedCandidate } from './simpleResumeParser';

export class SmartCandidateExtractor {
  static async extractCandidate(resume: any): Promise<Candidate> {
    console.log('=== SECTION-AWARE CANDIDATE EXTRACTION ===');
    const content = resume.content || '';
    const allLines = AggressiveTextCleaner.extractLines(content);
    const cleanedText = allLines.join('\n');
    const allSentences = AggressiveTextCleaner.extractSentences(cleanedText);
    const allWords = AggressiveTextCleaner.extractReadableWords(cleanedText);

    // 1. Sectionize the resume
    const sections = this.findSections(allLines);
    
    // Helper to get section content or fallback to all content
    const getSectionLines = (keys: string[]) => {
      for (const key of keys) {
        if (sections[key]) return sections[key];
      }
      return allLines;
    };
    const getSectionText = (keys: string[]) => getSectionLines(keys).join('\n');

    // 2. Extract from sections or whole document
    const contactText = getSectionText(['contact']);
    const contactLines = getSectionLines(['contact']);
    const contactWords = AggressiveTextCleaner.extractReadableWords(contactText);

    const name = SmartExtractor.extractName(allWords, allSentences, allLines, resume.name);
    const email = SmartExtractor.extractEmail(contactWords, [], contactLines);
    const phone = SmartExtractor.extractPhone(contactWords, [], contactLines);
    const location = SmartExtractor.extractLocation(allWords, allSentences, allLines);
    
    const skillsLines = getSectionLines(['skills']);
    const skills = SmartExtractor.extractSkills(allWords, [], skillsLines);
    
    const experienceLines = getSectionLines(['experience']);
    const experienceText = experienceLines.join('\n');
    const experience = SmartExtractor.extractExperience(AggressiveTextCleaner.extractReadableWords(experienceText), [], experienceLines);
    
    const educationLines = getSectionLines(['education']);
    const educationText = educationLines.join('\n');
    const education = SmartExtractor.extractEducation(AggressiveTextCleaner.extractReadableWords(educationText), [], educationLines);
    
    const languagesLines = getSectionLines(['languages']);
    const languages = SmartExtractor.extractLanguages(allWords, [], languagesLines);
    
    const summaryLines = getSectionLines(['summary']);
    const summarySentences = AggressiveTextCleaner.extractSentences(summaryLines.join('\n'));

    const technicalKeywords = [
      'JavaScript',
      'Python',
      'Java',
      'React',
      'Node',
      'SQL',
      'HTML',
      'CSS',
      'AWS',
      'Docker',
      'Git',
      'Angular',
      'Vue',
    ];
    const softKeywords = [
      'Leadership',
      'Communication',
      'Management',
      'Teamwork',
      'Problem',
      'Analysis',
    ];

    const technicalSkills = skills.filter((skill) =>
      technicalKeywords.some((tech) => skill.toLowerCase().includes(tech.toLowerCase()))
    );

    const softSkills = skills.filter((skill) =>
      softKeywords.some((soft) => skill.toLowerCase().includes(soft.toLowerCase()))
    );
    
    const certificationLines = getSectionLines(['certifications']);
    const projectLines = getSectionLines(['projects']);

    const candidate: Candidate = {
      name: name,
      email: email,
      phone: phone,
      location: location,
      skills,
      technicalSkills,
      softSkills,
      experience: experience.text,
      experienceYears: experience.years,
      education: education.text,
      educationLevel: education.level,
      certifications: this.extractCertifications(certificationLines),
      languages,
      previousRoles: this.extractPreviousRoles(experienceLines, technicalSkills),
      projects: this.extractProjects(projectLines, technicalSkills),
      achievements: this.extractAchievements(experienceLines),
      summary: this.extractSummary(summarySentences, summaryLines, allSentences),
      keywords: [...technicalSkills, ...softSkills].slice(0, 10),
      linkedIn: this.extractLinkedIn(contactWords, contactLines),
      github: this.extractGitHub(contactWords, contactLines),
    };

    console.log('=== FINAL SECTION-AWARE CANDIDATE ===');
    console.log(candidate);

    return candidate;
  }

  private static findSections(lines: string[]): Record<string, string[]> {
    const sections: Record<string, string[]> = { _other: [] };
    let currentSection = '_other';

    const sectionKeywords: Record<string, RegExp> = {
      contact: /\b(contact|email|phone|linkedin|github)\b/i,
      summary: /^(summary|objective|profile)$/i,
      skills: /^(skills|technologies|proficiencies)$/i,
      experience: /^(experience|work history|employment)$/i,
      education: /^(education|academic background)$/i,
      projects: /^(projects|portfolio)$/i,
      certifications: /^(certifications|licenses|training)$/i,
      languages: /^(languages)$/i,
    };
    
    const sectionHeaders = Object.keys(sectionKeywords);

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.length < 30 && trimmedLine.length > 0) {
        let matched = false;
        for (const sectionName of sectionHeaders) {
          if (sectionKeywords[sectionName].test(trimmedLine)) {
            currentSection = sectionName;
            if (!sections[currentSection]) sections[currentSection] = [];
            matched = true;
            break;
          }
        }
        if (matched) continue;
      }
      if (!sections[currentSection]) sections[currentSection] = [];
      sections[currentSection].push(line);
    }
    
    // Special case for contact info which is usually at the top
    if (!sections.contact) {
      const contactInfo: string[] = [];
      for(const line of lines.slice(0, 5)) {
        if (sectionKeywords.contact.test(line)) {
          contactInfo.push(line);
        }
      }
      if (contactInfo.length > 0) sections.contact = contactInfo;
    }

    return sections;
  }
  
  private static extractCertifications(lines: string[]): string[] {
    const certKeywords = ['AWS', 'Microsoft', 'Google', 'PMP', 'Scrum', 'CISSP', 'CompTIA', 'Certified', 'Certification'];
    const certs = new Set<string>();
    
    // Look in lines for certification sections
    for (const line of lines) {
      if (line.toLowerCase().includes('certif') || line.toLowerCase().includes('license')) {
        for (const cert of certKeywords) {
          if (line.toLowerCase().includes(cert.toLowerCase())) {
            certs.add(cert);
          }
        }
      }
    }
    
    // Look in words
    // const words = lines.join(' ').split(' ');
    // for (const word of words) {
    //   for (const cert of certKeywords) {
    //     if (word.toLowerCase().includes(cert.toLowerCase())) {
    //       certs.add(cert);
    //     }
    //   }
    // }
    
    return Array.from(certs);
  }

  private static extractPreviousRoles(lines: string[], techSkills: string[]): Array<{title: string, company: string, duration: string, responsibilities: string[]}> {
    const jobTitles = ['Engineer', 'Developer', 'Manager', 'Analyst', 'Designer', 'Consultant', 'Director', 'Specialist', 'Lead', 'Senior', 'Junior'];
    const roles = [];
    
    for (const line of lines.slice(0, 20)) {
      for (const title of jobTitles) {
        if (line.toLowerCase().includes(title.toLowerCase())) {
          roles.push({
            title: line.length > 50 ? line.substring(0, 50) + "..." : line,
            company: "Company mentioned in resume",
            duration: "Duration in resume",
            responsibilities: [`Key responsibilities mentioned in resume`]
          });
          break;
        }
      }
      if (roles.length >= 3) break;
    }
    
    return roles;
  }

  private static extractProjects(lines: string[], techSkills: string[]): Array<{name: string, description: string, technologies: string[]}> {
    const projectIndicators = ['project', 'built', 'developed', 'created', 'implemented'];
    const projects = [];
    
    for (const line of lines.slice(0, 15)) {
      if (projectIndicators.some(indicator => line.toLowerCase().includes(indicator))) {
        projects.push({
          name: "Project from resume",
          description: line.length > 100 ? line.substring(0, 100) + "..." : line,
          technologies: techSkills.slice(0, 3)
        });
        break;
      }
    }
    
    return projects;
  }

  private static extractAchievements(lines: string[]): string[] {
    const achievementWords = ['achieved', 'accomplished', 'award', 'recognition', 'improved', 'increased', 'reduced', 'led'];
    const achievements = [];
    
    for (const line of lines.slice(0, 15)) {
      if (achievementWords.some(word => line.toLowerCase().includes(word))) {
        achievements.push(line.length > 80 ? line.substring(0, 80) + "..." : line);
        if (achievements.length >= 3) break;
      }
    }
    
    return achievements;
  }

  private static extractSummary(sectionSentences: string[], sectionLines: string[], allSentences: string[]): string {
    if (sectionLines.length > 1) {
      const summary = sectionLines.join(' ').trim();
      return summary.length > 250 ? summary.substring(0, 250) + "..." : summary;
    }
    
    // Fallback to first meaningful sentence from all sentences
    const firstMeaningfulSentence = allSentences.find(s => 
      s.length > 30 && 
      !s.toLowerCase().includes('resume') && 
      !s.toLowerCase().includes('cv') &&
      !s.toLowerCase().includes('page')
    );
    
    return firstMeaningfulSentence ? 
      (firstMeaningfulSentence.length > 150 ? firstMeaningfulSentence.substring(0, 150) + "..." : firstMeaningfulSentence) : 
      "Professional summary not found";
  }

  private static extractLinkedIn(words: string[], lines: string[]): string {
    for (const line of lines) {
      if (line.toLowerCase().includes('linkedin')) {
        const match = line.match(/linkedin\.com\/in\/[\w-]+/i);
        if (match) return match[0];
      }
    }
    
    for (const word of words) {
      if (word.toLowerCase().includes('linkedin')) {
        return word;
      }
    }
    
    return "Not provided";
  }

  private static extractGitHub(words: string[], lines: string[]): string {
    for (const line of lines) {
      if (line.toLowerCase().includes('github')) {
        const match = line.match(/github\.com\/[\w-]+/i);
        if (match) return match[0];
      }
    }
    
    for (const word of words) {
      if (word.toLowerCase().includes('github')) {
        return word;
      }
    }
    
    return "Not provided";
  }
}
