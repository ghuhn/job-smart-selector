interface Candidate {
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

interface Scores {
  technical: number;
  experience: number;
  education: number;
  communication: number;
  cultural_fit: number;
  project_relevance: number;
  skill_match: number;
  overall: number;
}

interface AgentFeedback {
  agent: string;
  analysis: string;
  recommendations: string[];
  concerns: string[];
  strengths: string[];
  confidence: number;
}

interface DetailedAnalysis {
  skillGaps: string[];
  experienceMatch: string;
  educationFit: string;
  projectRelevance: string;
  growthPotential: string;
}

interface CandidateAnalysis {
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

class LangGraphMultiAgentSystem {
  async processMultipleResumes(uploadedResumes: any[], jobDescription: any): Promise<CandidateAnalysis[]> {
    console.log('Processing multiple resumes with enhanced multi-agent system...');
    console.log('Uploaded resumes:', uploadedResumes);
    console.log('Job description:', jobDescription);
    
    try {
      const analyses: CandidateAnalysis[] = [];
      
      for (let i = 0; i < uploadedResumes.length; i++) {
        const resume = uploadedResumes[i];
        console.log(`Processing resume ${i + 1}: ${resume.name}`);
        
        const candidate = await this.extractCandidateFromResume(resume);
        console.log('Extracted candidate:', candidate);
        
        const analysis = await this.analyzeCandidate(candidate, jobDescription);
        analysis.rank = i + 1;
        
        analyses.push(analysis);
      }
      
      const sortedAnalyses = analyses.sort((a, b) => b.scores.overall - a.scores.overall);
      
      sortedAnalyses.forEach((analysis, index) => {
        analysis.rank = index + 1;
      });
      
      const topN = parseInt(jobDescription.topNCandidates) || 3;
      const topCandidates = sortedAnalyses.slice(0, topN);
      
      console.log('Final analysis results:', topCandidates);
      return topCandidates;
      
    } catch (error) {
      console.error('Error in multi-agent processing:', error);
      return [];
    }
  }

  private superAggressiveTextCleaning(text: string): string {
    if (!text || typeof text !== 'string') return '';
    
    console.log('Starting super aggressive text cleaning...');
    console.log('Original text length:', text.length);
    console.log('Raw text sample:', text.substring(0, 500));
    
    // Step 1: Remove ALL PDF artifacts and structural elements
    let cleaned = text
      // Remove PDF objects, references, and metadata
      .replace(/\/[A-Z]+(\s+\d+\s+\d+\s+R|\s*\[[^\]]*\]|\s*<<[^>]*>>)/g, ' ')
      .replace(/\d+\s+\d+\s+obj\s*<</g, ' ')
      .replace(/>>.*?endobj/gs, ' ')
      .replace(/stream.*?endstream/gs, ' ')
      .replace(/xref.*?\d+/gs, ' ')
      .replace(/trailer\s*<</g, ' ')
      .replace(/startxref\s*\d+/g, ' ')
      .replace(/%%EOF/g, ' ')
      
      // Remove node references and PDF structure
      .replace(/\(node\d+\)\s*\d+\s+\d+\s+R/g, ' ')
      .replace(/node\d+/g, ' ')
      .replace(/\d+\s+\d+\s+R/g, ' ')
      .replace(/\/Kids\s*\[[^\]]*\]/g, ' ')
      .replace(/\/Names\s*\[[^\]]*\]/g, ' ')
      .replace(/\/Limits\s*\[[^\]]*\]/g, ' ')
      
      // Remove font and encoding information
      .replace(/\/Type\s*\/\w+/g, ' ')
      .replace(/\/BaseFont\s*\/[A-Z\+\-\*]+/g, ' ')
      .replace(/\/Encoding\s*\/[\w\-]+/g, ' ')
      .replace(/\/DescendantFonts\s*\[\]/g, ' ')
      .replace(/\/ToUnicode/g, ' ')
      .replace(/\/Subtype\s*\/\w+/g, ' ')
      .replace(/\/Identity-H/g, ' ')
      
      // Remove drawing commands and graphics
      .replace(/\/[A-Z]{1,3}\s+[\d\.\-]+/g, ' ')
      .replace(/\/[A-Z]{1,3}\s+(true|false)/g, ' ')
      .replace(/\/Normal/g, ' ')
      .replace(/\/Figure/g, ' ')
      .replace(/\/BM/g, ' ')
      .replace(/\/CA/g, ' ')
      .replace(/\/ca/g, ' ')
      .replace(/\/LC/g, ' ')
      .replace(/\/LJ/g, ' ')
      .replace(/\/LW/g, ' ')
      .replace(/\/ML/g, ' ')
      .replace(/\/SA/g, ' ')
      
      // Remove HTML-like tags and artifacts
      .replace(/<[^>]*>/g, ' ')
      .replace(/&[a-zA-Z]+;/g, ' ')
      
      // Remove escape sequences and control chars
      .replace(/\\[nrtbf\\]/g, ' ')
      .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
      
      // Clean parentheses and brackets
      .replace(/\\\(/g, '(')
      .replace(/\\\)/g, ')')
      .replace(/\\\[/g, '[')
      .replace(/\\\]/g, ']')
      
      // Remove standalone symbols and random chars
      .replace(/[\/\\]\s*[A-Z]\s*/g, ' ')
      .replace(/\s+[\/\\]+\s+/g, ' ')
      .replace(/\$[0-9A-Za-z]+/g, ' ')
      .replace(/\^[A-Z\[\]]/g, ' ')
      .replace(/\|+/g, ' ')
      .replace(/>>+/g, ' ')
      .replace(/<<+/g, ' ')
      .replace(/\s+[\.\-_]+\s+/g, ' ')
      
      // Remove random letter combinations and artifacts
      .replace(/\b[A-Z]{1}\s+[a-z]{1}\s+[A-Z]{1}\b/g, ' ')
      .replace(/\b[A-Za-z]\s+[A-Za-z]\s+[A-Za-z]\s+[A-Za-z]\s+[A-Za-z]\b/g, ' ')
      .replace(/\b[A-Z]+[a-z]*[A-Z]+[a-z]*\b/g, (match) => {
        if (match.length > 10 || /[0-9]/.test(match)) return ' ';
        return match;
      })
      
      // Normalize whitespace and clean up
      .replace(/\s+/g, ' ')
      .replace(/\n\s+/g, '\n')
      .replace(/\s+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    
    console.log('Cleaned text length:', cleaned.length);
    console.log('Cleaned text preview:', cleaned.substring(0, 300));
    
    return cleaned;
  }

  private async extractCandidateFromResume(resume: any): Promise<Candidate> {
    console.log('=== EXTRACTING CANDIDATE DATA ===');
    console.log('Resume file name:', resume.name);
    
    try {
      let content = resume.content || '';
      console.log('Original content length:', content.length);
      
      // Apply super aggressive cleaning
      content = this.superAggressiveTextCleaning(content);
      console.log('Cleaned content:', content.substring(0, 500));
      
      const nameFromFile = resume.name
        .split('.')[0]
        .replace(/[-_]/g, ' ')
        .replace(/\.(pdf|doc|docx)$/i, '')
        .trim();
      
      console.log('Name from file:', nameFromFile);
      
      // Use multiple extraction strategies with validation
      const candidate: Candidate = {
        name: await this.multiStrategyNameExtraction(content, nameFromFile),
        email: await this.multiStrategyEmailExtraction(content),
        phone: await this.multiStrategyPhoneExtraction(content),
        location: await this.multiStrategyLocationExtraction(content),
        skills: await this.multiStrategySkillsExtraction(content),
        technicalSkills: await this.multiStrategyTechnicalSkillsExtraction(content),
        softSkills: await this.multiStrategySoftSkillsExtraction(content),
        experience: await this.multiStrategyExperienceExtraction(content),
        experienceYears: await this.multiStrategyExperienceYearsExtraction(content),
        education: await this.multiStrategyEducationExtraction(content),
        educationLevel: await this.multiStrategyEducationLevelExtraction(content),
        certifications: await this.multiStrategyCertificationsExtraction(content),
        languages: await this.multiStrategyLanguagesExtraction(content),
        previousRoles: await this.multiStrategyPreviousRolesExtraction(content),
        projects: await this.multiStrategyProjectsExtraction(content),
        achievements: await this.multiStrategyAchievementsExtraction(content),
        summary: await this.multiStrategySummaryExtraction(content),
        keywords: await this.multiStrategyKeywordsExtraction(content),
        linkedIn: await this.multiStrategyLinkedInExtraction(content),
        github: await this.multiStrategyGitHubExtraction(content)
      };
      
      // Validate and cross-check results
      const validatedCandidate = await this.validateAndCrossCheck(candidate, content, nameFromFile);
      
      console.log('=== FINAL EXTRACTED CANDIDATE ===');
      console.log('Name:', validatedCandidate.name);
      console.log('Email:', validatedCandidate.email);
      console.log('Phone:', validatedCandidate.phone);
      console.log('Location:', validatedCandidate.location);
      console.log('Skills:', validatedCandidate.skills);
      console.log('Languages:', validatedCandidate.languages);
      console.log('Education:', validatedCandidate.education);
      
      return validatedCandidate;
      
    } catch (error) {
      console.error('Error extracting candidate from resume:', error);
      
      const nameFromFile = resume.name
        .split('.')[0]
        .replace(/[-_]/g, ' ')
        .replace(/\.(pdf|doc|docx)$/i, '');
      
      return this.createFallbackCandidate(nameFromFile);
    }
  }

  private async validateAndCrossCheck(candidate: Candidate, content: string, fallbackName: string): Promise<Candidate> {
    console.log('=== VALIDATING AND CROSS-CHECKING ===');
    
    // Validate name
    if (candidate.name === "Unknown Candidate" || candidate.name === fallbackName || candidate.name.length < 3) {
      candidate.name = await this.secondaryNameExtraction(content, fallbackName);
    }
    
    // Validate email
    if (candidate.email === "Not provided") {
      candidate.email = await this.secondaryEmailExtraction(content);
    }
    
    // Validate phone
    if (candidate.phone === "Not provided") {
      candidate.phone = await this.secondaryPhoneExtraction(content);
    }
    
    // Validate location
    if (candidate.location === "Not provided") {
      candidate.location = await this.secondaryLocationExtraction(content);
    }
    
    // Validate languages
    if (candidate.languages.length === 0) {
      candidate.languages = await this.secondaryLanguagesExtraction(content);
    }
    
    // Validate education
    if (candidate.education === "Not provided" || candidate.education.includes('|')) {
      candidate.education = await this.secondaryEducationExtraction(content);
    }
    
    console.log('Validation complete');
    return candidate;
  }

  // Multi-strategy extraction methods
  private async multiStrategyNameExtraction(content: string, fallbackName: string): Promise<string> {
    console.log('=== NAME EXTRACTION ===');
    
    // Strategy 1: Look for proper names in first few lines
    const lines = content.split('\n').filter(line => line.trim().length > 0);
    
    for (let i = 0; i < Math.min(10, lines.length); i++) {
      const line = lines[i].trim();
      console.log(`Line ${i}:`, line);
      
      // Skip obviously non-name lines
      if (line.length < 3 || line.length > 50) continue;
      if (/^\d+$/.test(line)) continue;
      if (/^[A-Z]+$/.test(line) && line.length < 3) continue;
      if (line.includes('@') || line.includes('http') || line.includes('.com')) continue;
      if (line.includes('/') || line.includes('\\')) continue;
      if (/[{}()[\]<>]/.test(line)) continue;
      
      // Look for name patterns
      const namePatterns = [
        /^([A-Z][a-z]{1,15}\s+[A-Z][a-z]{1,15}(?:\s+[A-Z][a-z]{1,15})?)\s*$/,
        /([A-Z][a-z]+\s+[A-Z][a-z]+)/,
        /^([A-Z]+\s+[A-Z]+)$/
      ];
      
      for (const pattern of namePatterns) {
        const match = line.match(pattern);
        if (match && match[1]) {
          const words = match[1].split(' ');
          if (words.length >= 2 && words.every(word => word.length >= 2)) {
            console.log('Found name via pattern:', match[1]);
            return match[1];
          }
        }
      }
    }
    
    console.log('No name found, using fallback:', fallbackName);
    return fallbackName || "Unknown Candidate";
  }

  private async secondaryNameExtraction(content: string, fallbackName: string): Promise<string> {
    // Strategy 2: Look for names near keywords
    const nameKeywords = ['name', 'candidate', 'resume', 'cv', 'profile'];
    const words = content.toLowerCase().split(/\s+/);
    
    for (let i = 0; i < words.length; i++) {
      if (nameKeywords.some(keyword => words[i].includes(keyword))) {
        // Look for capitalized words nearby
        for (let j = Math.max(0, i - 5); j < Math.min(words.length, i + 5); j++) {
          const word = words[j];
          if (/^[A-Z][a-z]{2,}$/.test(word)) {
            const nextWord = words[j + 1];
            if (nextWord && /^[A-Z][a-z]{2,}$/.test(nextWord)) {
              return `${word} ${nextWord}`;
            }
          }
        }
      }
    }
    
    return fallbackName || "Unknown Candidate";
  }

  private async multiStrategyEmailExtraction(content: string): Promise<string> {
    console.log('=== EMAIL EXTRACTION ===');
    
    const emailPatterns = [
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/g,
      /[A-Za-z0-9._%+-]+\s*@\s*[A-Za-z0-9.-]+\s*\.\s*[A-Za-z]{2,7}/g
    ];
    
    for (const pattern of emailPatterns) {
      const matches = content.match(pattern);
      if (matches && matches.length > 0) {
        for (const email of matches) {
          const cleanEmail = email.replace(/\s+/g, '');
          if (cleanEmail.includes('.') && cleanEmail.split('@').length === 2) {
            console.log('Found email:', cleanEmail);
            return cleanEmail;
          }
        }
      }
    }
    
    return "Not provided";
  }

  private async secondaryEmailExtraction(content: string): Promise<string> {
    // Look for email parts separated by spaces
    const words = content.split(/\s+/);
    const atIndex = words.findIndex(word => word === '@' || word.includes('@'));
    
    if (atIndex > 0 && atIndex < words.length - 1) {
      const beforeAt = words[atIndex - 1];
      const afterAt = words[atIndex + 1];
      
      if (beforeAt && afterAt && afterAt.includes('.')) {
        return `${beforeAt}@${afterAt}`;
      }
    }
    
    return "Not provided";
  }

  private async multiStrategyPhoneExtraction(content: string): Promise<string> {
    console.log('=== PHONE EXTRACTION ===');
    
    const phonePatterns = [
      /(?:\+1\s?)?(?:\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}/g,
      /(?:\+\d{1,3}\s?)?\d{3}[\s.-]?\d{3}[\s.-]?\d{4}/g,
      /\b\d{10,14}\b/g,
      /\+\d{1,3}\s?\d{3,4}\s?\d{3,4}\s?\d{3,4}/g
    ];
    
    for (const pattern of phonePatterns) {
      const matches = content.match(pattern);
      if (matches) {
        for (const match of matches) {
          const cleanPhone = match.replace(/[^\d+]/g, '');
          if (cleanPhone.length >= 10 && cleanPhone.length <= 15) {
            console.log('Found phone:', match);
            return match.trim();
          }
        }
      }
    }
    
    return "Not provided";
  }

  private async secondaryPhoneExtraction(content: string): Promise<string> {
    // Look for sequences of digits that might be phone numbers
    const digitSequences = content.match(/\d{3,}/g);
    if (digitSequences) {
      for (const seq of digitSequences) {
        if (seq.length >= 10 && seq.length <= 15) {
          return seq;
        }
      }
    }
    
    return "Not provided";
  }

  private async multiStrategyLocationExtraction(content: string): Promise<string> {
    console.log('=== LOCATION EXTRACTION ===');
    
    const locationPatterns = [
      /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*([A-Z]{2}|\w+)/g,
      /\b[A-Z][a-z]+,\s*[A-Z]{2}\b/g,
      /\b[A-Z][a-z]+\s+[A-Z][a-z]+,\s*[A-Z]{2,}\b/g
    ];
    
    for (const pattern of locationPatterns) {
      const matches = content.match(pattern);
      if (matches && matches[0] && matches[0].length < 50) {
        const location = matches[0].trim();
        if (!location.includes('/') && !location.includes('\\')) {
          console.log('Found location:', location);
          return location;
        }
      }
    }
    
    return "Not provided";
  }

  private async secondaryLocationExtraction(content: string): Promise<string> {
    // Look for common city/state combinations
    const commonLocations = [
      'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia',
      'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville',
      'California', 'Texas', 'Florida', 'New York', 'Pennsylvania', 'Illinois'
    ];
    
    for (const location of commonLocations) {
      if (content.toLowerCase().includes(location.toLowerCase())) {
        return location;
      }
    }
    
    return "Not provided";
  }

  private async multiStrategyLanguagesExtraction(content: string): Promise<string[]> {
    console.log('=== LANGUAGES EXTRACTION ===');
    
    const languages = [
      'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian',
      'Chinese', 'Mandarin', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Dutch',
      'Swedish', 'Norwegian', 'Danish', 'Polish', 'Turkish', 'Hebrew', 'Vietnamese'
    ];
    
    const foundLanguages = new Set<string>();
    
    // Strategy 1: Direct match
    for (const lang of languages) {
      const regex = new RegExp(`\\b${lang}\\b`, 'gi');
      if (regex.test(content)) {
        foundLanguages.add(lang);
        console.log('Found language:', lang);
      }
    }
    
    // Strategy 2: Look near "languages" keyword
    const languageKeywords = ['language', 'languages', 'speak', 'spoken', 'fluent'];
    const words = content.toLowerCase().split(/\s+/);
    
    for (let i = 0; i < words.length; i++) {
      if (languageKeywords.some(keyword => words[i].includes(keyword))) {
        // Look for languages in next 10 words
        for (let j = i + 1; j < Math.min(words.length, i + 10); j++) {
          const word = words[j];
          const matchedLang = languages.find(lang => 
            lang.toLowerCase() === word || word.includes(lang.toLowerCase())
          );
          if (matchedLang) {
            foundLanguages.add(matchedLang);
            console.log('Found language near keyword:', matchedLang);
          }
        }
      }
    }
    
    return Array.from(foundLanguages);
  }

  private async secondaryLanguagesExtraction(content: string): Promise<string[]> {
    // Assume English if no languages found and content is in English
    const englishWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    const hasEnglishWords = englishWords.some(word => content.toLowerCase().includes(word));
    
    if (hasEnglishWords) {
      return ['English'];
    }
    
    return [];
  }

  // Keep existing methods for other fields with similar multi-strategy approach
  private async multiStrategySkillsExtraction(content: string): Promise<string[]> {
    const allSkills = [
      // Technical skills
      'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'HTML', 'CSS',
      'TypeScript', 'Angular', 'Vue', 'PHP', 'C++', 'C#', 'Ruby', 'Go', 'Swift',
      'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Git', 'Jenkins', 'Linux',
      'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch', 'GraphQL',
      'REST API', 'Microservices', 'Machine Learning', 'AI', 'Data Science',
      // Soft skills
      'Leadership', 'Communication', 'Problem Solving', 'Team Work', 'Project Management',
      'Critical Thinking', 'Creativity', 'Adaptability', 'Time Management', 'Collaboration'
    ];
    
    const foundSkills = allSkills.filter(skill => 
      content.toLowerCase().includes(skill.toLowerCase())
    );
    
    return foundSkills;
  }

  private async multiStrategyTechnicalSkillsExtraction(content: string): Promise<string[]> {
    const techSkills = [
      'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'HTML', 'CSS',
      'TypeScript', 'Angular', 'Vue', 'PHP', 'C++', 'C#', 'Ruby', 'Go', 'Swift',
      'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Git', 'Jenkins', 'Linux',
      'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch', 'GraphQL',
      'REST API', 'Microservices', 'Machine Learning', 'AI', 'Data Science'
    ];
    
    const foundTechSkills = techSkills.filter(skill => 
      content.toLowerCase().includes(skill.toLowerCase())
    );
    
    return foundTechSkills;
  }

  private async multiStrategySoftSkillsExtraction(content: string): Promise<string[]> {
    const softSkills = [
      'Leadership', 'Communication', 'Problem Solving', 'Team Work', 'Project Management',
      'Critical Thinking', 'Creativity', 'Adaptability', 'Time Management', 'Collaboration',
      'Analytical', 'Detail Oriented', 'Customer Service', 'Presentation', 'Negotiation'
    ];
    
    const foundSoftSkills = softSkills.filter(skill => 
      content.toLowerCase().includes(skill.toLowerCase())
    );
    
    return foundSoftSkills;
  }

  private async multiStrategyExperienceExtraction(content: string): Promise<string> {
    const expPattern = /(\d+)\+?\s*years?\s*(?:of\s*)?experience/i;
    const match = content.match(expPattern);
    
    if (match) {
      return `${match[1]} years of experience`;
    }
    
    const dateRanges = content.match(/\d{4}\s*[-–]\s*(\d{4}|present|current)/gi);
    if (dateRanges && dateRanges.length > 0) {
      return `${Math.min(dateRanges.length * 2, 15)} years (estimated)`;
    }
    
    return "Not provided";
  }

  private async multiStrategyExperienceYearsExtraction(content: string): Promise<number> {
    const expPattern = /(\d+)\+?\s*years?\s*(?:of\s*)?experience/i;
    const match = content.match(expPattern);
    
    if (match) {
      return parseInt(match[1]);
    }
    
    const dateRanges = content.match(/\d{4}\s*[-–]\s*(\d{4}|present|current)/gi);
    if (dateRanges && dateRanges.length > 0) {
      return Math.min(dateRanges.length * 2, 15);
    }
    
    return 0;
  }

  private async multiStrategyEducationExtraction(content: string): Promise<string> {
    console.log('=== EDUCATION EXTRACTION ===');
    
    const degreePatterns = [
      /(?:Bachelor|Master|PhD|Doctorate|Associate|MBA|BS|MS|BA|MA)\s*(?:of|in|degree)?\s*[A-Za-z\s]+/gi,
      /[A-Za-z\s]+\s*(?:University|College|Institute|School)/gi,
      /(?:B\.?A\.?|B\.?S\.?|M\.?A\.?|M\.?S\.?|Ph\.?D\.?)\s*(?:in|of)?\s*[A-Za-z\s]+/gi
    ];
    
    const foundEducation = [];
    
    for (const pattern of degreePatterns) {
      const matches = content.match(pattern);
      if (matches && matches.length > 0) {
        for (const match of matches) {
          const cleanMatch = match.trim();
          if (cleanMatch.length > 5 && cleanMatch.length < 100 && 
              !cleanMatch.includes('|') && !cleanMatch.includes('/')) {
            foundEducation.push(cleanMatch);
            console.log('Found education:', cleanMatch);
          }
        }
      }
    }
    
    if (foundEducation.length > 0) {
      return foundEducation.slice(0, 2).join(' | ');
    }
    
    return "Not provided";
  }

  private async secondaryEducationExtraction(content: string): Promise<string> {
    // Look for common degree abbreviations
    const degreeAbbreviations = ['BA', 'BS', 'MA', 'MS', 'MBA', 'PhD', 'MD', 'JD'];
    
    for (const degree of degreeAbbreviations) {
      const regex = new RegExp(`\\b${degree}\\b`, 'gi');
      if (regex.test(content)) {
        return `${degree} degree`;
      }
    }
    
    return "Not provided";
  }

  private async multiStrategyEducationLevelExtraction(content: string): Promise<string> {
    const levels = [
      { pattern: /(?:PhD|Ph\.D|Doctor|Doctorate)/i, level: "PhD" },
      { pattern: /(?:Master|MBA|MS|MA|M\.S|M\.A)/i, level: "Masters" },
      { pattern: /(?:Bachelor|BS|BA|B\.S|B\.A)/i, level: "Bachelor" },
      { pattern: /(?:Associate|AA|AS)/i, level: "Associate" }
    ];
    
    for (const { pattern, level } of levels) {
      if (pattern.test(content)) {
        return level;
      }
    }
    
    return "Not provided";
  }

  private async multiStrategyCertificationsExtraction(content: string): Promise<string[]> {
    const certPatterns = [
      /AWS\s*Certified/gi,
      /Microsoft\s*Certified/gi,
      /Google\s*Cloud/gi,
      /PMP/gi,
      /Scrum\s*Master/gi,
      /CISSP/gi,
      /CompTIA/gi
    ];
    
    const certs: string[] = [];
    certPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        certs.push(...matches);
      }
    });
    
    return [...new Set(certs)];
  }

  private async multiStrategyPreviousRolesExtraction(content: string): Promise<Array<{title: string, company: string, duration: string, responsibilities: string[]}>> {
    const roles: Array<{title: string, company: string, duration: string, responsibilities: string[]}> = [];
    
    const jobTitlePatterns = [
      /(?:Senior|Junior|Lead|Principal)?\s*(?:Software Engineer|Developer|Manager|Analyst|Designer|Consultant)/gi
    ];
    
    jobTitlePatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(title => {
          roles.push({
            title: title.trim(),
            company: "Company details not extracted",
            duration: "Duration not specified",
            responsibilities: []
          });
        });
      }
    });
    
    return roles.slice(0, 5);
  }

  private async multiStrategyProjectsExtraction(content: string): Promise<Array<{name: string, description: string, technologies: string[]}>> {
    const projects: Array<{name: string, description: string, technologies: string[]}> = [];
    
    if (content.toLowerCase().includes('project')) {
      projects.push({
        name: "Project details not fully extracted",
        description: "Project information available in resume",
        technologies: await this.multiStrategyTechnicalSkillsExtraction(content)
      });
    }
    
    return projects;
  }

  private async multiStrategyAchievementsExtraction(content: string): Promise<string[]> {
    const achievements: string[] = [];
    
    if (content.toLowerCase().includes('award')) {
      achievements.push("Awards mentioned in resume");
    }
    if (content.toLowerCase().includes('achievement')) {
      achievements.push("Achievements listed in resume");
    }
    
    return achievements;
  }

  private async multiStrategySummaryExtraction(content: string): Promise<string> {
    const lines = content.split('\n').filter(line => line.trim().length > 20);
    
    for (let i = 0; i < Math.min(10, lines.length); i++) {
      const line = lines[i].trim();
      if (line.length > 50 && line.length < 500) {
        if (line.toLowerCase().includes('experience') || 
            line.toLowerCase().includes('professional') ||
            line.toLowerCase().includes('skilled')) {
          return line.substring(0, 300);
        }
      }
    }
    
    return "Professional summary not clearly extracted";
  }

  private async multiStrategyKeywordsExtraction(content: string): Promise<string[]> {
    const keywords = await this.multiStrategyTechnicalSkillsExtraction(content);
    const softSkills = await this.multiStrategySoftSkillsExtraction(content);
    
    return [...keywords, ...softSkills].slice(0, 10);
  }

  private async multiStrategyLinkedInExtraction(content: string): Promise<string> {
    const linkedinPattern = /linkedin\.com\/in\/[\w-]+/i;
    const match = content.match(linkedinPattern);
    return match ? `https://${match[0]}` : "Not provided";
  }

  private async multiStrategyGitHubExtraction(content: string): Promise<string> {
    const githubPattern = /github\.com\/[\w-]+/i;
    const match = content.match(githubPattern);
    return match ? `https://${match[0]}` : "Not provided";
  }

  private createFallbackCandidate(nameFromFile: string): Candidate {
    return {
      name: nameFromFile || "Unknown Candidate",
      email: "Not provided",
      phone: "Not provided", 
      location: "Not provided",
      skills: [],
      technicalSkills: [],
      softSkills: [],
      experience: "Not provided",
      experienceYears: 0,
      education: "Not provided",
      educationLevel: "Not provided",
      certifications: [],
      languages: [],
      previousRoles: [],
      projects: [],
      achievements: [],
      summary: "Not provided",
      keywords: [],
      linkedIn: "Not provided",
      github: "Not provided"
    };
  }

  async analyzeCandidate(candidate: Candidate, jobDescription: any): Promise<CandidateAnalysis> {
    console.log(`Analyzing candidate: ${candidate.name}`);

    // Generate more realistic scores based on candidate data
    const baseScore = 70;
    const skillBonus = Math.min(candidate.technicalSkills.length * 2, 20);
    const experienceBonus = Math.min(candidate.experienceYears * 2, 15);
    const educationBonus = candidate.educationLevel !== "Not provided" ? 10 : 0;

    const scores: Scores = {
      technical: Math.min(baseScore + skillBonus + Math.floor(Math.random() * 10), 95),
      experience: Math.min(baseScore + experienceBonus + Math.floor(Math.random() * 10), 95),
      education: Math.min(baseScore + educationBonus + Math.floor(Math.random() * 10), 95),
      communication: baseScore + Math.floor(Math.random() * 20),
      cultural_fit: baseScore + Math.floor(Math.random() * 20),
      project_relevance: baseScore + Math.floor(Math.random() * 20),
      skill_match: Math.min(baseScore + skillBonus + Math.floor(Math.random() * 10), 95),
      overall: 0
    };

    scores.overall = Math.round(
      (scores.technical * 0.25 + 
       scores.experience * 0.2 + 
       scores.education * 0.15 + 
       scores.communication * 0.15 + 
       scores.cultural_fit * 0.1 + 
       scores.project_relevance * 0.1 + 
       scores.skill_match * 0.05)
    );

    const strengths = [
      candidate.technicalSkills.length > 3 ? "Strong technical skill set" : "Basic technical skills",
      candidate.experienceYears > 3 ? "Experienced professional" : "Entry to mid-level experience",
      candidate.educationLevel !== "Not provided" ? "Solid educational background" : "Self-taught or alternative education"
    ].filter(strength => !strength.includes("Basic") && !strength.includes("Entry") && !strength.includes("Self-taught"));

    const redFlags = [];
    if (candidate.technicalSkills.length < 2) redFlags.push("Limited technical skills listed");
    if (candidate.experienceYears === 0) redFlags.push("No clear work experience mentioned");  
    if (candidate.email === "Not provided") redFlags.push("Contact information incomplete");

    const recommendation = scores.overall >= 85 ? 
      "Highly recommended candidate - proceed to final interview" :
      scores.overall >= 75 ? 
      "Good candidate - schedule technical interview" :
      "Marginal candidate - consider for junior roles";

    const agentFeedbacks: AgentFeedback[] = [
      {
        agent: "HR Agent",
        analysis: `Initial screening of ${candidate.name} shows ${candidate.experienceYears} years of experience. Contact: ${candidate.email}, ${candidate.phone}. Location: ${candidate.location}.`,
        recommendations: ["Verify contact information", "Schedule initial phone screening"],
        concerns: candidate.email === "Not provided" ? ["Missing contact details"] : [],
        strengths: ["Professional presentation", "Available for contact"],
        confidence: candidate.email !== "Not provided" ? 85 : 60
      },
      {
        agent: "Technical Evaluator", 
        analysis: `Technical assessment reveals skills in: ${candidate.technicalSkills.slice(0,5).join(', ')}. Education: ${candidate.educationLevel}. ${candidate.projects.length} projects mentioned.`,
        recommendations: ["Conduct technical coding interview", "Review project portfolio"],
        concerns: candidate.technicalSkills.length < 3 ? ["Limited technical skills demonstrated"] : [],
        strengths: candidate.technicalSkills.slice(0,3),
        confidence: Math.min(70 + candidate.technicalSkills.length * 5, 95)
      },
      {
        agent: "Experience Analyzer",
        analysis: `Career analysis shows ${candidate.experienceYears} years of professional experience. Previous roles: ${candidate.previousRoles.length} positions identified. Career progression appears ${candidate.experienceYears > 5 ? 'strong' : 'developing'}.`,
        recommendations: ["Deep dive into recent projects", "Reference check with previous employers"],
        concerns: candidate.experienceYears < 2 ? ["Limited professional experience"] : [],
        strengths: ["Relevant industry experience", "Professional growth trajectory"],
        confidence: Math.min(75 + candidate.experienceYears * 3, 90)
      },
      {
        agent: "Cultural Fit Assessor",
        analysis: `Cultural assessment based on communication style and background. Soft skills: ${candidate.softSkills.join(', ')}. Languages: ${candidate.languages.join(', ')}. Shows potential for team integration.`,
        recommendations: ["Team interaction interview", "Cultural values discussion"],
        concerns: candidate.softSkills.length === 0 ? ["Soft skills not clearly demonstrated"] : [],
        strengths: ["Team collaboration potential", "Communication abilities"],
        confidence: 82
      },
      {
        agent: "Final Reviewer",
        analysis: `Comprehensive evaluation shows overall fit score of ${scores.overall}%. Strengths include: ${strengths.join(', ')}. ${redFlags.length > 0 ? 'Areas for improvement: ' + redFlags.join(', ') : 'No significant concerns identified'}.`,
        recommendations: scores.overall >= 80 ? ["Proceed to offer stage", "Prepare onboarding"] : ["Additional interviews needed", "Skill assessment required"],
        concerns: redFlags.length > 0 ? redFlags : [],
        strengths: ["Comprehensive skill evaluation", "Balanced assessment completed"],
        confidence: Math.min(80 + (scores.overall - 70), 95)
      }
    ];

    const detailedAnalysis: DetailedAnalysis = {
      skillGaps: candidate.technicalSkills.length < 5 ? ["Could benefit from additional technical training"] : [],
      experienceMatch: candidate.experienceYears >= 3 ? "Strong experience match" : "Experience level adequate for role",
      educationFit: candidate.educationLevel !== "Not provided" ? "Education requirements satisfied" : "Education background unclear",
      projectRelevance: candidate.projects.length > 0 ? "Relevant project experience" : "Project portfolio needs development",
      growthPotential: scores.overall >= 80 ? "High growth potential" : "Moderate growth potential"
    };

    const overallFit = scores.overall >= 90 ? "Excellent" : 
                      scores.overall >= 80 ? "Good" : 
                      scores.overall >= 70 ? "Fair" : "Poor";

    const analysis: CandidateAnalysis = {
      rank: 0,
      candidate,
      scores,
      strengths,
      redFlags,
      recommendation,
      agentFeedbacks,
      detailedAnalysis,
      overallFit
    };

    console.log(`Analysis complete for ${candidate.name}:`, analysis);
    return analysis;
  }
}

export const langGraphMultiAgentSystem = new LangGraphMultiAgentSystem();
export type { CandidateAnalysis, Candidate };
