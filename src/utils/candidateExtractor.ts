import { AggressiveTextCleaner } from './textCleaner';
import { SmartExtractor } from './smartExtractor';
import { Candidate } from './multiAgentSystem';
import { SimpleResumeParser, SimpleParsedCandidate } from './simpleResumeParser';

export class SmartCandidateExtractor {
  static async extractCandidate(resume: any): Promise<Candidate> {
    console.log('=== ENHANCED CANDIDATE EXTRACTION WITH DOUBLE PARSING ===');
    console.log('Resume file:', resume.name);

    // 1. Original clean/extraction logic (existing)
    const content = resume.content || '';
    const cleanedText = AggressiveTextCleaner.clean(content);
    const words = AggressiveTextCleaner.extractReadableWords(content);
    const sentences = AggressiveTextCleaner.extractSentences(content);
    const lines = AggressiveTextCleaner.extractLines(content);

    // LLM logic
    const llmName = SmartExtractor.extractName(words, sentences, lines, resume.name);
    const llmEmail = SmartExtractor.extractEmail(words, sentences, lines);
    const llmPhone = SmartExtractor.extractPhone(words, sentences, lines);
    const llmLocation = SmartExtractor.extractLocation(words, sentences, lines);
    const llmSkills = SmartExtractor.extractSkills(words, sentences, lines);
    const llmExperience = SmartExtractor.extractExperience(words, sentences, lines);
    const llmEducation = SmartExtractor.extractEducation(words, sentences, lines);
    const llmLanguages = SmartExtractor.extractLanguages(words, sentences, lines);

    // 2. NEW: Classic parser logic
    const classicParsed: SimpleParsedCandidate = SimpleResumeParser.parse(content);

    function selectField(llmVal: string, classicVal: string, fieldName: string) {
      // Prefer value that is nonempty and NOT 'Not provided'/'Name Not Found'
      if (
        classicVal &&
        classicVal !== 'Not provided' &&
        classicVal !== 'Name Not Found'
      ) {
        // If both exist and disagree significantly, log it
        if (
          llmVal &&
          llmVal !== 'Not provided' &&
          llmVal !== classicVal &&
          Math.abs((classicVal.length ?? 0) - (llmVal.length ?? 0)) > 5
        ) {
          console.log(
            `Cross-check mismatch on ${fieldName}: [LLM] ${llmVal} vs [Classic] ${classicVal}`
          );
          return `${classicVal} (${llmVal})`;
        }
        return classicVal;
      }
      return llmVal && llmVal !== 'Not provided' ? llmVal : '';
    }

    function selectList(llmArr: string[], classicArr: string[]): string[] {
      // Merge results and deduplicate
      if (classicArr.length === 0) return llmArr;
      if (llmArr.length === 0) return classicArr;
      return Array.from(new Set([...classicArr, ...llmArr])).slice(0, 10);
    }

    // --- Cross-check/merge results ---
    const name = selectField(llmName, classicParsed.name, 'name');
    const email = selectField(llmEmail, classicParsed.email, 'email');
    const phone = selectField(llmPhone, classicParsed.phone, 'phone');
    const location = llmLocation; // Classic version doesn't extract location robustly
    const skills = selectList(llmSkills, classicParsed.skills);
    const experience = {
      text: selectField(llmExperience.text, classicParsed.experience, 'experience'),
      years: llmExperience.years,
    };
    const education = {
      text: selectField(llmEducation.text, classicParsed.education, 'education'),
      level: llmEducation.level,
    };
    const languages = selectList(llmLanguages, classicParsed.languages);

    // --- Rest of the candidate fields (keep as before) ---
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

    console.log('=== EXTRACTION RESULTS ===');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Phone:', phone);
    console.log('Location:', location);
    console.log('Experience:', experience);
    console.log('Education:', education);
    console.log('Languages:', languages);
    console.log('Technical Skills:', technicalSkills);
    console.log('Soft Skills:', softSkills);

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
      certifications: this.extractCertifications(words, lines),
      languages,
      previousRoles: this.extractPreviousRoles(lines, technicalSkills),
      projects: this.extractProjects(lines, technicalSkills),
      achievements: this.extractAchievements(lines),
      summary: this.extractSummary(sentences, lines),
      keywords: [...technicalSkills, ...softSkills].slice(0, 10),
      linkedIn: this.extractLinkedIn(words, lines),
      github: this.extractGitHub(words, lines)
    };

    console.log('=== FINAL CROSS-CHECKED CANDIDATE ===');
    console.log(candidate);

    return candidate;
  }

  private static extractCertifications(words: string[], lines: string[]): string[] {
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
    for (const word of words) {
      for (const cert of certKeywords) {
        if (word.toLowerCase().includes(cert.toLowerCase())) {
          certs.add(cert);
        }
      }
    }
    
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

  private static extractSummary(sentences: string[], lines: string[]): string {
    // Look for summary/objective sections
    for (const line of lines.slice(0, 10)) {
      if (line.toLowerCase().includes('summary') || line.toLowerCase().includes('objective') || line.toLowerCase().includes('profile')) {
        const nextLines = lines.slice(lines.indexOf(line) + 1, lines.indexOf(line) + 4);
        const summary = nextLines.join(' ').trim();
        if (summary.length > 20) {
          return summary.length > 150 ? summary.substring(0, 150) + "..." : summary;
        }
      }
    }
    
    // Fallback to first meaningful sentence
    const firstMeaningfulSentence = sentences.find(s => 
      s.length > 30 && 
      !s.toLowerCase().includes('resume') && 
      !s.toLowerCase().includes('cv') &&
      !s.toLowerCase().includes('page')
    );
    
    return firstMeaningfulSentence ? 
      (firstMeaningfulSentence.length > 150 ? firstMeaningfulSentence.substring(0, 150) + "..." : firstMeaningfulSentence) : 
      "Professional summary available in resume";
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
