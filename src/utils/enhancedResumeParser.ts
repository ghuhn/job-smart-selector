
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
  private static cleanText(text: string): string {
    return text
      .replace(/[^\w\s@.-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private static extractLines(text: string): string[] {
    return text
      .split(/[\n\r]+/)
      .map(line => line.trim())
      .filter(line => line.length > 0);
  }

  private static extractName(text: string, fileName?: string): string {
    const lines = this.extractLines(text);
    
    // Try filename first (often contains name)
    if (fileName) {
      const cleanFileName = fileName.replace(/\.(pdf|doc|docx)$/i, '').replace(/[_-]/g, ' ');
      if (cleanFileName.length > 2 && cleanFileName.length < 50 && /^[A-Za-z\s]+$/.test(cleanFileName)) {
        return cleanFileName.trim();
      }
    }

    // Look for name patterns in first few lines
    const namePatterns = [
      /^([A-Z][a-z]+ [A-Z][a-z]+)$/,
      /^([A-Z][a-z]+ [A-Z]\. [A-Z][a-z]+)$/,
      /^([A-Z][a-z]+ [A-Z][a-z]+ [A-Z][a-z]+)$/
    ];

    for (const line of lines.slice(0, 5)) {
      for (const pattern of namePatterns) {
        const match = line.match(pattern);
        if (match) {
          return match[1];
        }
      }
    }

    // Look for "Name:" labels
    for (const line of lines.slice(0, 10)) {
      const nameMatch = line.match(/(?:name|candidate):\s*([A-Z][a-z]+ [A-Z][a-z]+)/i);
      if (nameMatch) {
        return nameMatch[1];
      }
    }

    return "Name not found";
  }

  private static extractEmail(text: string): string {
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const matches = text.match(emailPattern);
    return matches ? matches[0] : "Email not provided";
  }

  private static extractPhone(text: string): string {
    const phonePatterns = [
      /\b(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/,
      /\b\d{3}-\d{3}-\d{4}\b/,
      /\b\(\d{3}\)\s?\d{3}-\d{4}\b/
    ];

    for (const pattern of phonePatterns) {
      const match = text.match(pattern);
      if (match) {
        return match[0].trim();
      }
    }

    return "Phone not provided";
  }

  private static extractLocation(text: string): string {
    const lines = this.extractLines(text);
    
    // Look for city, state patterns
    const locationPatterns = [
      /([A-Z][a-z]+,\s*[A-Z]{2})/,
      /([A-Z][a-z]+,\s*[A-Z][a-z]+)/,
      /([A-Z][a-z]+\s+[A-Z][a-z]+,\s*[A-Z]{2})/
    ];

    for (const line of lines.slice(0, 10)) {
      for (const pattern of locationPatterns) {
        const match = line.match(pattern);
        if (match) {
          return match[1];
        }
      }
    }

    // Look for address-like patterns
    const addressPattern = /\b\d+\s+[A-Z][a-z]+\s+(St|Ave|Rd|Dr|Blvd|Lane|Way)/i;
    for (const line of lines.slice(0, 15)) {
      if (addressPattern.test(line)) {
        return line.length > 50 ? line.substring(0, 50) + "..." : line;
      }
    }

    return "Location not provided";
  }

  private static extractSkills(text: string): string[] {
    const skillsSection = this.findSection(text, ['skills', 'technical skills', 'technologies', 'proficiencies']);
    const searchText = skillsSection || text;

    const commonSkills = [
      'JavaScript', 'Python', 'Java', 'React', 'Angular', 'Vue', 'Node.js', 'Express',
      'HTML', 'CSS', 'TypeScript', 'SQL', 'MongoDB', 'PostgreSQL', 'MySQL',
      'AWS', 'Azure', 'Docker', 'Kubernetes', 'Git', 'REST', 'GraphQL',
      'Machine Learning', 'Data Science', 'AI', 'TensorFlow', 'PyTorch',
      'Leadership', 'Communication', 'Project Management', 'Agile', 'Scrum'
    ];

    const foundSkills = new Set<string>();
    
    for (const skill of commonSkills) {
      if (searchText.toLowerCase().includes(skill.toLowerCase())) {
        foundSkills.add(skill);
      }
    }

    // Look for skill-like patterns (capitalized words in skills section)
    if (skillsSection) {
      const skillWords = skillsSection.match(/\b[A-Z][a-z]+(?:\.[a-z]+)*\b/g) || [];
      for (const word of skillWords) {
        if (word.length > 2 && word.length < 20) {
          foundSkills.add(word);
        }
      }
    }

    return Array.from(foundSkills).slice(0, 15);
  }

  private static extractExperience(text: string): { text: string; years: number } {
    const experienceSection = this.findSection(text, ['experience', 'work history', 'employment', 'work experience']);
    const searchText = experienceSection || text;

    // Look for years of experience mentions
    const yearPatterns = [
      /(\d+)\+?\s*years?\s*(?:of\s*)?experience/i,
      /(\d+)\+?\s*years?\s*in/i,
      /experience\s*:\s*(\d+)\+?\s*years?/i
    ];

    let years = 0;
    for (const pattern of yearPatterns) {
      const match = searchText.match(pattern);
      if (match) {
        years = parseInt(match[1]);
        break;
      }
    }

    // If no explicit years, estimate from job entries
    if (years === 0) {
      const jobEntries = searchText.match(/\d{4}\s*-\s*(?:\d{4}|present|current)/gi) || [];
      years = Math.min(jobEntries.length * 2, 15); // Estimate 2 years per job, cap at 15
    }

    const experienceText = experienceSection 
      ? (experienceSection.length > 200 ? experienceSection.substring(0, 200) + "..." : experienceSection)
      : `${years} years of professional experience`;

    return { text: experienceText, years };
  }

  private static extractEducation(text: string): { text: string; level: string } {
    const educationSection = this.findSection(text, ['education', 'academic background', 'qualifications']);
    const searchText = educationSection || text;

    const degreePatterns = [
      { pattern: /\b(?:PhD|Ph\.D|Doctorate)/i, level: 'Doctorate' },
      { pattern: /\b(?:Master|M\.S|M\.A|MBA|MS|MA)\b/i, level: 'Masters' },
      { pattern: /\b(?:Bachelor|B\.S|B\.A|BS|BA)\b/i, level: 'Bachelors' },
      { pattern: /\b(?:Associate|A\.S|A\.A|AS|AA)\b/i, level: 'Associates' },
      { pattern: /\b(?:High School|Diploma|GED)\b/i, level: 'High School' }
    ];

    let level = "Not specified";
    let educationText = "Education details not found";

    for (const { pattern, level: degreeLevel } of degreePatterns) {
      if (pattern.test(searchText)) {
        level = degreeLevel;
        break;
      }
    }

    if (educationSection) {
      educationText = educationSection.length > 150 
        ? educationSection.substring(0, 150) + "..." 
        : educationSection;
    }

    return { text: educationText, level };
  }

  private static extractLanguages(text: string): string[] {
    const languagesSection = this.findSection(text, ['languages', 'language skills']);
    const searchText = languagesSection || text;

    const commonLanguages = [
      'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian',
      'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Dutch', 'Swedish'
    ];

    const foundLanguages = new Set<string>();
    
    for (const lang of commonLanguages) {
      if (searchText.toLowerCase().includes(lang.toLowerCase())) {
        foundLanguages.add(lang);
      }
    }

    return Array.from(foundLanguages).slice(0, 5);
  }

  private static findSection(text: string, sectionNames: string[]): string | null {
    const lines = this.extractLines(text);
    let sectionStart = -1;
    let sectionEnd = lines.length;

    // Find section start
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      if (sectionNames.some(name => line.includes(name.toLowerCase()) && line.length < 50)) {
        sectionStart = i + 1;
        break;
      }
    }

    if (sectionStart === -1) return null;

    // Find section end (next section header)
    const sectionHeaders = ['experience', 'education', 'skills', 'projects', 'certifications', 'languages', 'summary'];
    for (let i = sectionStart; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      if (line.length < 50 && sectionHeaders.some(header => line.includes(header) && !sectionNames.includes(header))) {
        sectionEnd = i;
        break;
      }
    }

    return lines.slice(sectionStart, sectionEnd).join('\n');
  }

  static parseResume(resume: any): ExtractedCandidate {
    console.log('=== ENHANCED RESUME PARSING ===');
    const content = resume.content || '';
    const cleanedText = this.cleanText(content);
    
    console.log('Processing resume:', resume.name);
    console.log('Content length:', content.length);

    const name = this.extractName(cleanedText, resume.name);
    const email = this.extractEmail(cleanedText);
    const phone = this.extractPhone(cleanedText);
    const location = this.extractLocation(cleanedText);
    const skills = this.extractSkills(cleanedText);
    const experience = this.extractExperience(cleanedText);
    const education = this.extractEducation(cleanedText);
    const languages = this.extractLanguages(cleanedText);

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

    console.log('=== EXTRACTION RESULTS ===');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Phone:', phone);
    console.log('Skills:', skills.length);
    console.log('Experience years:', experience.years);

    return candidate;
  }
}
