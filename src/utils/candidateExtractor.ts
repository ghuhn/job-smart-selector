import { AggressiveTextCleaner } from './textCleaner';
import { Candidate } from './multiAgentSystem';

export class SmartCandidateExtractor {
  static async extractCandidate(resume: any): Promise<Candidate> {
    console.log('=== SMART CANDIDATE EXTRACTION ===');
    console.log('Resume file:', resume.name);
    
    const content = resume.content || '';
    const cleanedText = AggressiveTextCleaner.clean(content);
    const words = AggressiveTextCleaner.extractReadableWords(content);
    
    console.log('Extracted words:', words.slice(0, 20));
    
    // Get fallback name from filename
    const fallbackName = this.extractNameFromFilename(resume.name);
    
    return {
      name: await this.extractName(words, cleanedText, fallbackName),
      email: await this.extractEmail(words, cleanedText),
      phone: await this.extractPhone(words, cleanedText),
      location: await this.extractLocation(words, cleanedText),
      skills: await this.extractSkills(words, cleanedText),
      technicalSkills: await this.extractTechnicalSkills(words, cleanedText),
      softSkills: await this.extractSoftSkills(words, cleanedText),
      experience: await this.extractExperience(words, cleanedText),
      experienceYears: await this.extractExperienceYears(words, cleanedText),
      education: await this.extractEducation(words, cleanedText),
      educationLevel: await this.extractEducationLevel(words, cleanedText),
      certifications: await this.extractCertifications(words, cleanedText),
      languages: await this.extractLanguages(words, cleanedText),
      previousRoles: await this.extractPreviousRoles(words, cleanedText),
      projects: await this.extractProjects(words, cleanedText),
      achievements: await this.extractAchievements(words, cleanedText),
      summary: await this.extractSummary(words, cleanedText),
      keywords: await this.extractKeywords(words, cleanedText),
      linkedIn: await this.extractLinkedIn(words, cleanedText),
      github: await this.extractGitHub(words, cleanedText)
    };
  }

  private static extractNameFromFilename(filename: string): string {
    return filename
      .replace(/\.(pdf|doc|docx)$/i, '')
      .replace(/[-_]/g, ' ')
      .replace(/\bresume\b/gi, '')
      .replace(/\bcv\b/gi, '')
      .trim()
      .split(' ')
      .filter(word => word.length > 1)
      .slice(0, 3)
      .join(' ') || 'Unknown Candidate';
  }

  private static async extractName(words: string[], cleanedText: string, fallbackName: string): Promise<string> {
    console.log('=== NAME EXTRACTION ===');
    
    // Look for proper name patterns in the first part of the text
    const firstWords = words.slice(0, 50);
    
    for (let i = 0; i < firstWords.length - 1; i++) {
      const word1 = firstWords[i];
      const word2 = firstWords[i + 1];
      
      // Check if both words look like names
      if (this.isNameWord(word1) && this.isNameWord(word2)) {
        const potentialName = `${word1} ${word2}`;
        console.log('Found potential name:', potentialName);
        
        // Additional validation
        if (potentialName.length >= 4 && potentialName.length <= 50) {
          return potentialName;
        }
      }
    }
    
    // Fallback to filename-based name
    console.log('Using fallback name:', fallbackName);
    return fallbackName;
  }

  private static isNameWord(word: string): boolean {
    return word.length >= 2 && 
           word.length <= 20 && 
           /^[A-Z][a-z]+$/.test(word) &&
           !['Resume', 'CV', 'Profile', 'Document', 'Page', 'Name', 'Email', 'Phone', 'Address'].includes(word);
  }

  private static async extractEmail(words: string[], cleanedText: string): Promise<string> {
    console.log('=== EMAIL EXTRACTION ===');
    
    // Look for email patterns
    for (const word of words) {
      if (word.includes('@') && word.includes('.')) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (emailPattern.test(word)) {
          console.log('Found email:', word);
          return word;
        }
      }
    }
    
    // Try to reconstruct email from parts
    const atIndex = words.findIndex(w => w === '@' || w.includes('@'));
    if (atIndex > 0 && atIndex < words.length - 1) {
      const before = words[atIndex - 1];
      const after = words[atIndex + 1];
      if (before && after && after.includes('.')) {
        const reconstructed = `${before}@${after}`;
        console.log('Reconstructed email:', reconstructed);
        return reconstructed;
      }
    }
    
    return "Not provided";
  }

  private static async extractPhone(words: string[], cleanedText: string): Promise<string> {
    console.log('=== PHONE EXTRACTION ===');
    
    // Look for phone patterns
    for (const word of words) {
      if (/^\+?\d{10,15}$/.test(word.replace(/[-\s()]/g, ''))) {
        console.log('Found phone:', word);
        return word;
      }
    }
    
    // Look for phone patterns in cleaned text
    const phonePatterns = [
      /(?:\+1\s?)?(?:\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}/,
      /\+?\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/,
      /\d{10,11}/
    ];
    
    for (const pattern of phonePatterns) {
      const match = cleanedText.match(pattern);
      if (match) {
        console.log('Found phone via pattern:', match[0]);
        return match[0];
      }
    }
    
    return "Not provided";
  }

  private static async extractLocation(words: string[], cleanedText: string): Promise<string> {
    console.log('=== LOCATION EXTRACTION ===');
    
    const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'Charlotte', 'San Francisco', 'Indianapolis', 'Seattle', 'Denver', 'Boston', 'Nashville', 'Baltimore', 'Oklahoma City', 'Louisville', 'Portland', 'Las Vegas', 'Milwaukee', 'Albuquerque', 'Tucson', 'Fresno', 'Sacramento', 'Mesa', 'Kansas City', 'Atlanta', 'Long Beach', 'Colorado Springs', 'Raleigh', 'Miami', 'Virginia Beach', 'Omaha', 'Oakland', 'Minneapolis', 'Tulsa', 'Arlington', 'Tampa', 'New Orleans'];
    
    const states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
    
    const stateAbbrevs = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
    
    // Check for cities
    for (const city of cities) {
      if (words.some(word => word.toLowerCase() === city.toLowerCase().replace(' ', ''))) {
        console.log('Found city:', city);
        return city;
      }
    }
    
    // Check for states
    for (const state of states) {
      if (words.some(word => word.toLowerCase() === state.toLowerCase())) {
        console.log('Found state:', state);
        return state;
      }
    }
    
    // Check for state abbreviations
    for (const abbrev of stateAbbrevs) {
      if (words.some(word => word.toUpperCase() === abbrev)) {
        console.log('Found state abbrev:', abbrev);
        return abbrev;
      }
    }
    
    return "Not provided";
  }

  private static async extractLanguages(words: string[], cleanedText: string): Promise<string[]> {
    console.log('=== LANGUAGES EXTRACTION ===');
    
    const languages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Chinese', 'Mandarin', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Dutch', 'Swedish', 'Norwegian', 'Danish', 'Polish', 'Turkish', 'Hebrew', 'Vietnamese', 'Thai', 'Greek', 'Czech', 'Hungarian', 'Romanian', 'Finnish', 'Slovak', 'Bulgarian', 'Croatian', 'Serbian', 'Slovenian', 'Lithuanian', 'Latvian', 'Estonian', 'Maltese'];
    
    const foundLanguages = new Set<string>();
    
    // Check each word against language list
    for (const word of words) {
      const matchedLang = languages.find(lang => 
        lang.toLowerCase() === word.toLowerCase()
      );
      if (matchedLang) {
        foundLanguages.add(matchedLang);
        console.log('Found language:', matchedLang);
      }
    }
    
    // If no languages found, assume English if content seems English
    if (foundLanguages.size === 0) {
      const englishWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'experience', 'education', 'skills'];
      const hasEnglish = englishWords.some(ew => words.some(w => w.toLowerCase() === ew));
      if (hasEnglish) {
        foundLanguages.add('English');
        console.log('Inferred English language');
      }
    }
    
    return Array.from(foundLanguages);
  }

  private static async extractEducation(words: string[], cleanedText: string): Promise<string> {
    console.log('=== EDUCATION EXTRACTION ===');
    
    const degrees = ['Bachelor', 'Master', 'PhD', 'Doctorate', 'Associate', 'MBA', 'BS', 'MS', 'BA', 'MA', 'BBA', 'BFA', 'MFA', 'JD', 'MD', 'DDS', 'PharmD'];
    const fields = ['Engineering', 'Science', 'Arts', 'Business', 'Computer', 'Information', 'Technology', 'Management', 'Marketing', 'Finance', 'Economics', 'Psychology', 'Biology', 'Chemistry', 'Physics', 'Mathematics', 'History', 'English', 'Literature'];
    const institutions = ['University', 'College', 'Institute', 'School', 'Academy'];
    
    const foundDegrees = [];
    const foundFields = [];
    const foundInstitutions = [];
    
    // Find degree-related words
    for (const word of words) {
      const degree = degrees.find(d => d.toLowerCase() === word.toLowerCase());
      if (degree) foundDegrees.push(degree);
      
      const field = fields.find(f => f.toLowerCase() === word.toLowerCase());
      if (field) foundFields.push(field);
      
      const institution = institutions.find(i => word.toLowerCase().includes(i.toLowerCase()));
      if (institution) foundInstitutions.push(word);
    }
    
    // Construct education string
    let education = '';
    if (foundDegrees.length > 0) {
      education += foundDegrees[0];
      if (foundFields.length > 0) {
        education += ` in ${foundFields[0]}`;
      }
      if (foundInstitutions.length > 0) {
        education += ` from ${foundInstitutions[0]}`;
      }
    } else if (foundInstitutions.length > 0) {
      education = `Education from ${foundInstitutions[0]}`;
    }
    
    console.log('Extracted education:', education);
    return education || "Not provided";
  }

  
  private static async extractSkills(words: string[], cleanedText: string): Promise<string[]> {
    const allSkills = ['JavaScript', 'Python', 'Java', 'React', 'Node', 'SQL', 'HTML', 'CSS', 'TypeScript', 'Angular', 'Vue', 'PHP', 'C++', 'C#', 'Ruby', 'Go', 'Swift', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'Git', 'Linux', 'MongoDB', 'PostgreSQL', 'MySQL', 'Leadership', 'Communication', 'Management', 'Analysis', 'Design'];
    
    return allSkills.filter(skill => 
      words.some(word => word.toLowerCase() === skill.toLowerCase())
    );
  }

  private static async extractTechnicalSkills(words: string[], cleanedText: string): Promise<string[]> {
    const techSkills = ['JavaScript', 'Python', 'Java', 'React', 'Node', 'SQL', 'HTML', 'CSS', 'TypeScript', 'Angular', 'Vue', 'PHP', 'C++', 'C#', 'Ruby', 'Go', 'Swift', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'Git', 'Linux', 'MongoDB', 'PostgreSQL', 'MySQL'];
    
    return techSkills.filter(skill => 
      words.some(word => word.toLowerCase() === skill.toLowerCase())
    );
  }

  private static async extractSoftSkills(words: string[], cleanedText: string): Promise<string[]> {
    const softSkills = ['Leadership', 'Communication', 'Management', 'Analysis', 'Design', 'Teamwork', 'Problem', 'Solving', 'Creative', 'Analytical'];
    
    return softSkills.filter(skill => 
      words.some(word => word.toLowerCase().includes(skill.toLowerCase()))
    );
  }

  private static async extractExperience(words: string[], cleanedText: string): Promise<string> {
    // Look for "X years" pattern
    for (let i = 0; i < words.length - 1; i++) {
      if (/^\d+$/.test(words[i]) && words[i + 1].toLowerCase().includes('year')) {
        return `${words[i]} years of experience`;
      }
    }
    return "Not provided";
  }

  private static async extractExperienceYears(words: string[], cleanedText: string): Promise<number> {
    for (let i = 0; i < words.length - 1; i++) {
      if (/^\d+$/.test(words[i]) && words[i + 1].toLowerCase().includes('year')) {
        return parseInt(words[i]);
      }
    }
    return 0;
  }

  private static async extractEducationLevel(words: string[], cleanedText: string): Promise<string> {
    const levels = [
      { words: ['PhD', 'Doctorate', 'Doctor'], level: 'PhD' },
      { words: ['Master', 'MBA', 'MS', 'MA'], level: 'Masters' },
      { words: ['Bachelor', 'BS', 'BA', 'BBA'], level: 'Bachelor' },
      { words: ['Associate'], level: 'Associate' }
    ];
    
    for (const { words: levelWords, level } of levels) {
      if (levelWords.some(lw => words.some(w => w.toLowerCase() === lw.toLowerCase()))) {
        return level;
      }
    }
    return "Not provided";
  }

  private static async extractCertifications(words: string[], cleanedText: string): Promise<string[]> {
    const certs = ['AWS', 'Microsoft', 'Google', 'PMP', 'Scrum', 'CISSP', 'CompTIA'];
    return certs.filter(cert => words.some(w => w.toLowerCase().includes(cert.toLowerCase())));
  }

  private static async extractPreviousRoles(words: string[], cleanedText: string): Promise<Array<{title: string, company: string, duration: string, responsibilities: string[]}>> {
    const jobTitles = ['Engineer', 'Developer', 'Manager', 'Analyst', 'Designer', 'Consultant', 'Director', 'Specialist'];
    const roles = [];
    
    for (const title of jobTitles) {
      if (words.some(w => w.toLowerCase().includes(title.toLowerCase()))) {
        roles.push({
          title: `${title} Role`,
          company: "Company details not extracted",
          duration: "Duration not specified",
          responsibilities: []
        });
      }
    }
    
    return roles.slice(0, 3);
  }

  private static async extractProjects(words: string[], cleanedText: string): Promise<Array<{name: string, description: string, technologies: string[]}>> {
    if (words.some(w => w.toLowerCase().includes('project'))) {
      return [{
        name: "Project details not fully extracted",
        description: "Project information available in resume",
        technologies: await this.extractTechnicalSkills(words, cleanedText)
      }];
    }
    return [];
  }

  private static async extractAchievements(words: string[], cleanedText: string): Promise<string[]> {
    const achievements = [];
    if (words.some(w => w.toLowerCase().includes('award'))) {
      achievements.push("Awards mentioned in resume");
    }
    if (words.some(w => w.toLowerCase().includes('achievement'))) {
      achievements.push("Achievements listed in resume");
    }
    return achievements;
  }

  private static async extractSummary(words: string[], cleanedText: string): Promise<string> {
    const firstWords = words.slice(0, 30).join(' ');
    if (firstWords.length > 20) {
      return firstWords.substring(0, 200);
    }
    return "Professional summary not clearly extracted";
  }

  private static async extractKeywords(words: string[], cleanedText: string): Promise<string[]> {
    const skills = await this.extractTechnicalSkills(words, cleanedText);
    const softSkills = await this.extractSoftSkills(words, cleanedText);
    return [...skills, ...softSkills].slice(0, 10);
  }

  private static async extractLinkedIn(words: string[], cleanedText: string): Promise<string> {
    const linkedinWord = words.find(w => w.toLowerCase().includes('linkedin'));
    return linkedinWord ? `https://linkedin.com/in/${linkedinWord}` : "Not provided";
  }

  private static async extractGitHub(words: string[], cleanedText: string): Promise<string> {
    const githubWord = words.find(w => w.toLowerCase().includes('github'));
    return githubWord ? `https://github.com/${githubWord}` : "Not provided";
  }
}
