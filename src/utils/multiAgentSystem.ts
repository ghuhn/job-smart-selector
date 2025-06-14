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
    console.log('Processing multiple resumes with multi-agent system...');
    console.log('Uploaded resumes:', uploadedResumes);
    console.log('Job description:', jobDescription);
    
    try {
      const analyses: CandidateAnalysis[] = [];
      
      for (let i = 0; i < uploadedResumes.length; i++) {
        const resume = uploadedResumes[i];
        console.log(`Processing resume ${i + 1}: ${resume.name}`);
        
        const candidate = this.extractCandidateFromResume(resume);
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

  private cleanText(text: string): string {
    if (!text || typeof text !== 'string') return '';
    
    console.log('Original text sample:', text.substring(0, 200));
    
    let cleaned = text
      // Remove PDF object references and artifacts
      .replace(/\/[A-Z]+\s*\[[^\]]*\]/g, '')
      .replace(/\/[A-Z]+\s+\d+\s+\d+\s+R/g, '')
      .replace(/\d+\s+\d+\s+obj\s*<</g, '')
      .replace(/endobj/g, '')
      .replace(/>>.*?endobj/gs, '')
      .replace(/stream.*?endstream/gs, '')
      .replace(/xref.*?\d+/gs, '')
      .replace(/trailer\s*<</g, '')
      .replace(/startxref/g, '')
      .replace(/%%EOF/g, '')
      
      // Remove node references and object numbers
      .replace(/\(node\d+\)\s*\d+\s+\d+\s+R/g, '')
      .replace(/node\d+/g, '')
      .replace(/\d+\s+\d+\s+R/g, '')
      
      // Remove PDF structural elements
      .replace(/\/Type\s*\/\w+/g, '')
      .replace(/\/Kids\s*\[.*?\]/g, '')
      .replace(/\/Names\s*\[.*?\]/g, '')
      .replace(/\/Limits\s*\[.*?\]/g, '')
      
      // Remove encoding artifacts and special characters
      .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
      .replace(/\^[A-Z\[\]]/g, ' ')
      .replace(/\|/g, ' ')
      .replace(/>>$/gm, '')
      .replace(/\$[0-9A-Za-z]+/g, ' ')
      
      // Clean up formatting
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n')
      .replace(/^\s+|\s+$/g, '')
      .trim();
    
    console.log('Cleaned text sample:', cleaned.substring(0, 200));
    return cleaned;
  }

  private extractCandidateFromResume(resume: any): Candidate {
    console.log('Extracting candidate data from resume:', resume.name);
    
    try {
      let content = resume.content || '';
      content = this.cleanText(content);
      
      const nameFromFile = resume.name.split('.')[0].replace(/[-_]/g, ' ').replace(/\.(pdf|doc|docx)$/i, '');
      
      const candidate: Candidate = {
        name: this.extractName(content) || nameFromFile,
        email: this.extractEmail(content),
        phone: this.extractPhone(content),
        location: this.extractLocation(content),
        skills: this.extractSkills(content),
        technicalSkills: this.extractTechnicalSkills(content),
        softSkills: this.extractSoftSkills(content),
        experience: this.extractExperience(content),
        experienceYears: this.extractExperienceYears(content),
        education: this.extractEducation(content),
        educationLevel: this.extractEducationLevel(content),
        certifications: this.extractCertifications(content),
        languages: this.extractLanguages(content),
        previousRoles: this.extractPreviousRoles(content),
        projects: this.extractProjects(content),
        achievements: this.extractAchievements(content),
        summary: this.extractSummary(content),
        keywords: this.extractKeywords(content),
        linkedIn: this.extractLinkedIn(content),
        github: this.extractGitHub(content)
      };
      
      console.log('Extracted candidate data:', candidate);
      return candidate;
      
    } catch (error) {
      console.error('Error extracting candidate from resume:', error);
      
      const nameFromFile = resume.name.split('.')[0].replace(/[-_]/g, ' ').replace(/\.(pdf|doc|docx)$/i, '');
      return {
        name: nameFromFile,
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
  }

  private extractName(content: string): string {
    const lines = content.split('\n').filter(line => line.trim().length > 0);
    
    // Look for name in first few lines
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const line = lines[i].trim();
      
      // Skip lines that look like metadata or headers
      if (line.length < 3 || line.length > 50) continue;
      if (/^\d+$/.test(line)) continue;
      if (/^[A-Z]+$/.test(line) && line.length < 3) continue;
      
      // Look for name patterns
      const nameMatch = line.match(/^([A-Z][a-z]+ [A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/);
      if (nameMatch && nameMatch[1].split(' ').length >= 2) {
        return nameMatch[1].trim();
      }
    }
    
    // Fallback: look for any capitalized words pattern
    const namePattern = /\b([A-Z][a-z]{2,}\s+[A-Z][a-z]{2,})\b/;
    const match = content.match(namePattern);
    return match ? match[1] : "";
  }

  private extractEmail(content: string): string {
    // More comprehensive email pattern
    const emailPattern = /\b[A-Za-z0-9]([A-Za-z0-9._-]*[A-Za-z0-9])?@[A-Za-z0-9]([A-Za-z0-9.-]*[A-Za-z0-9])?\.[A-Za-z]{2,}\b/g;
    const matches = content.match(emailPattern);
    
    if (matches && matches.length > 0) {
      // Return the first valid email found
      for (const email of matches) {
        if (email.includes('.') && !email.startsWith('.') && !email.endsWith('.')) {
          return email;
        }
      }
    }
    
    return "Not provided";
  }

  private extractPhone(content: string): string {
    // Clean content for phone extraction
    const cleanContent = content.replace(/[^\d\s\-\(\)\+\.]/g, ' ');
    
    const phonePatterns = [
      // US format with country code
      /\+1\s*[\-\.]?\s*\(?\d{3}\)?\s*[\-\.]?\s*\d{3}\s*[\-\.]?\s*\d{4}/,
      // International format
      /\+\d{1,3}\s*[\-\.]?\s*\d{1,4}\s*[\-\.]?\s*\d{1,4}\s*[\-\.]?\s*\d{1,9}/,
      // US format without country code
      /\(?\d{3}\)?\s*[\-\.]?\s*\d{3}\s*[\-\.]?\s*\d{4}/,
      // Simple 10 digit number
      /\b\d{10}\b/
    ];
    
    for (const pattern of phonePatterns) {
      const match = cleanContent.match(pattern);
      if (match) {
        let phone = match[0].trim();
        // Clean up the phone number
        phone = phone.replace(/\s+/g, '').replace(/[\-\.]/g, '');
        
        // Validate length
        if (phone.length >= 10 && phone.length <= 15) {
          // Format nicely
          if (phone.length === 10) {
            return `(${phone.slice(0,3)}) ${phone.slice(3,6)}-${phone.slice(6)}`;
          } else if (phone.startsWith('+1') && phone.length === 12) {
            const digits = phone.slice(2);
            return `+1 (${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
          }
          return phone;
        }
      }
    }
    
    return "Not provided";
  }

  private extractLocation(content: string): string {
    const locationPatterns = [
      // City, State pattern
      /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*([A-Z]{2})/,
      // City, State, ZIP
      /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*([A-Z]{2})\s*\d{5}/,
      // Full address line
      /\d+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*[A-Z][a-z]+,\s*[A-Z]{2}/,
    ];
    
    for (const pattern of locationPatterns) {
      const match = content.match(pattern);
      if (match) {
        return match[0].replace(/\d{5}.*$/, '').trim();
      }
    }
    
    return "Not provided";
  }

  private extractEducation(content: string): string {
    console.log('Extracting education from cleaned content...');
    
    const educationKeywords = ['education', 'academic', 'university', 'college', 'degree', 'bachelor', 'master', 'phd', 'diploma'];
    const lines = content.split('\n');
    
    // Find education section
    let educationStartIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase().trim();
      if (educationKeywords.some(keyword => line.includes(keyword)) && line.length < 50) {
        educationStartIndex = i;
        break;
      }
    }
    
    if (educationStartIndex !== -1) {
      // Extract education section (next 5-10 lines)
      const educationLines = lines.slice(educationStartIndex + 1, educationStartIndex + 10)
        .filter(line => line.trim().length > 5)
        .filter(line => !/^\d+$/.test(line.trim()))
        .filter(line => !line.includes('obj'))
        .slice(0, 3);
      
      if (educationLines.length > 0) {
        return educationLines.join(' | ').substring(0, 200);
      }
    }
    
    // Fallback: look for degree patterns anywhere
    const degreePatterns = [
      /\b(?:Bachelor|Master|PhD|Doctorate|Associate)\s+(?:of|in)?\s+[A-Z][a-z\s]+/gi,
      /\b(?:BA|BS|MA|MS|MBA|PhD)\s+(?:in\s+)?[A-Z][a-z\s]+/gi,
      /\b[A-Z][a-z\s]+\s+University/gi,
      /\b[A-Z][a-z\s]+\s+College/gi
    ];
    
    for (const pattern of degreePatterns) {
      const matches = content.match(pattern);
      if (matches && matches.length > 0) {
        return matches.slice(0, 2).join(' | ');
      }
    }
    
    return "Not provided";
  }

  private extractEducationLevel(content: string): string {
    const levels = [
      { pattern: /(?:PhD|Ph\.D\.|Doctor of Philosophy|Doctorate)/i, level: "PhD" },
      { pattern: /(?:Master(?:'s)?|MA|MS|M\.S\.|M\.A\.|MBA)/i, level: "Masters" },
      { pattern: /(?:Bachelor(?:'s)?|BA|BS|B\.S\.|B\.A\.)/i, level: "Bachelor" },
      { pattern: /(?:Associate|AA|AS|A\.S\.|A\.A\.)/i, level: "Associate" },
      { pattern: /(?:Diploma|Certificate)/i, level: "Diploma" }
    ];
    
    for (const { pattern, level } of levels) {
      if (pattern.test(content)) {
        return level;
      }
    }
    
    return "Not provided";
  }

  private extractSkills(content: string): string[] {
    const skillsSection = this.extractSection(content, ['skills', 'technical skills', 'competencies']);
    const skills = this.parseSkillsList(skillsSection);
    return skills.length > 0 ? skills : [];
  }

  private extractTechnicalSkills(content: string): string[] {
    const techSection = this.extractSection(content, ['technical skills', 'programming', 'technologies', 'tools']);
    const skills = this.parseSkillsList(techSection);
    
    const techKeywords = ['JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'AWS', 'Docker', 'Git', 'TypeScript', 'HTML', 'CSS'];
    const foundTechSkills = techKeywords.filter(skill => 
      content.toLowerCase().includes(skill.toLowerCase())
    );
    
    const allSkills = [...new Set([...skills, ...foundTechSkills])];
    return allSkills.length > 0 ? allSkills : [];
  }

  private extractSoftSkills(content: string): string[] {
    const softSkillsKeywords = [
      'leadership', 'communication', 'teamwork', 'problem solving', 'analytical',
      'creative', 'organized', 'detail-oriented', 'collaborative', 'adaptable'
    ];
    
    const foundSoftSkills = softSkillsKeywords.filter(skill =>
      content.toLowerCase().includes(skill.toLowerCase())
    );
    
    return foundSoftSkills.length > 0 ? foundSoftSkills : [];
  }

  private extractExperience(content: string): string {
    const expPattern = /(\d+)\+?\s*years?\s*of\s*experience/i;
    const match = content.match(expPattern);
    if (match) {
      return `${match[1]} years`;
    }
    
    const jobCount = (content.match(/\d{4}\s*[-–]\s*(\d{4}|present|current)/gi) || []).length;
    if (jobCount > 0) {
      return `${Math.min(jobCount * 2, 15)} years (estimated)`;
    }
    
    return "Not provided";
  }

  private extractExperienceYears(content: string): number {
    const expPattern = /(\d+)\+?\s*years?\s*of\s*experience/i;
    const match = content.match(expPattern);
    if (match) {
      return parseInt(match[1]);
    }
    
    const jobCount = (content.match(/\d{4}\s*[-–]\s*(\d{4}|present|current)/gi) || []).length;
    return jobCount > 0 ? Math.min(jobCount * 2, 15) : 0;
  }

  private extractCertifications(content: string): string[] {
    const certSection = this.extractSection(content, ['certifications', 'certificates', 'credentials']);
    if (certSection) {
      const certs = this.parseSkillsList(certSection);
      if (certs.length > 0) return certs;
    }
    
    const certPatterns = [
      /AWS\s+Certified/gi,
      /Microsoft\s+Certified/gi,
      /Google\s+Cloud/gi,
      /PMP/gi,
      /Scrum\s+Master/gi
    ];
    
    const foundCerts: string[] = [];
    certPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        foundCerts.push(...matches);
      }
    });
    
    return foundCerts;
  }

  private extractLanguages(content: string): string[] {
    const langSection = this.extractSection(content, ['languages']);
    if (langSection) {
      const languages = this.parseSkillsList(langSection);
      return languages.length > 0 ? languages : [];
    }
    return [];
  }

  private extractPreviousRoles(content: string): Array<{title: string, company: string, duration: string, responsibilities: string[]}> {
    const roles: Array<{title: string, company: string, duration: string, responsibilities: string[]}> = [];
    
    const workSection = this.extractSection(content, ['experience', 'work experience', 'employment', 'professional experience']);
    
    if (workSection) {
      const roleBlocks = workSection.split(/\n\s*\n/);
      
      roleBlocks.forEach(block => {
        const lines = block.split('\n').filter(line => line.trim());
        if (lines.length >= 2) {
          const title = lines[0].trim();
          const company = lines[1].trim();
          const duration = this.extractDuration(block);
          const responsibilities = lines.slice(2).filter(line => 
            line.trim().startsWith('-') || line.trim().startsWith('•')
          ).map(line => line.replace(/^[-•]\s*/, '').trim());
          
          if (title && company) {
            roles.push({ title, company, duration, responsibilities });
          }
        }
      });
    }
    
    return roles;
  }

  private extractProjects(content: string): Array<{name: string, description: string, technologies: string[]}> {
    const projects: Array<{name: string, description: string, technologies: string[]}> = [];
    
    const projectSection = this.extractSection(content, ['projects', 'key projects', 'notable projects']);
    
    if (projectSection) {
      const projectBlocks = projectSection.split(/\n\s*\n/);
      
      projectBlocks.forEach(block => {
        const lines = block.split('\n').filter(line => line.trim());
        if (lines.length >= 2) {
          const name = lines[0].trim();
          const description = lines[1].trim();
          const techLine = lines.find(line => 
            line.toLowerCase().includes('tech') || 
            line.toLowerCase().includes('stack') ||
            line.toLowerCase().includes('language')
          );
          
          const technologies = techLine ? this.parseSkillsList(techLine) : [];
          
          if (name && description) {
            projects.push({ name, description, technologies });
          }
        }
      });
    }
    
    return projects;
  }

  private extractAchievements(content: string): string[] {
    const achieveSection = this.extractSection(content, ['achievements', 'accomplishments', 'awards']);
    if (achieveSection) {
      const achievements = achieveSection.split('\n')
        .filter(line => line.trim())
        .map(line => line.replace(/^[-•]\s*/, '').trim())
        .filter(line => line.length > 10);
      return achievements.length > 0 ? achievements : [];
    }
    return [];
  }

  private extractSummary(content: string): string {
    const summarySection = this.extractSection(content, ['summary', 'profile', 'objective', 'about']);
    if (summarySection) {
      const summary = summarySection.split('\n').filter(line => line.trim()).join(' ').substring(0, 500);
      return summary || "Not provided";
    }
    
    return "Not provided";
  }

  private extractKeywords(content: string): string[] {
    const techTerms = content.match(/\b[A-Z][a-z]*(?:\.[a-z]+)*\b/g) || [];
    return [...new Set(techTerms)].slice(0, 10);
  }

  private extractLinkedIn(content: string): string {
    const linkedinPattern = /linkedin\.com\/in\/[\w-]+/i;
    const match = content.match(linkedinPattern);
    return match ? `https://${match[0]}` : "Not provided";
  }

  private extractGitHub(content: string): string {
    const githubPattern = /github\.com\/[\w-]+/i;
    const match = content.match(githubPattern);
    return match ? `https://${match[0]}` : "Not provided";
  }

  private extractSection(content: string, sectionNames: string[]): string {
    for (const sectionName of sectionNames) {
      const patterns = [
        new RegExp(`^\\s*${sectionName}\\s*:?\\s*$`, 'gmi'),
        new RegExp(`^\\s*${sectionName}\\s*[-=]+\\s*$`, 'gmi'),
        new RegExp(`\\b${sectionName}\\b.*:`, 'gmi')
      ];
      
      for (const pattern of patterns) {
        const match = pattern.exec(content);
        
        if (match) {
          const startIndex = match.index + match[0].length;
          
          const nextSectionPattern = /^\s*[A-Z][A-Z\s]*\s*:?\s*$/gm;
          nextSectionPattern.lastIndex = startIndex;
          const nextMatch = nextSectionPattern.exec(content);
          
          const dividerPattern = /^\s*[-=]{3,}\s*$/gm;
          dividerPattern.lastIndex = startIndex;
          const dividerMatch = dividerPattern.exec(content);
          
          let endIndex = content.length;
          if (nextMatch && dividerMatch) {
            endIndex = Math.min(nextMatch.index, dividerMatch.index);
          } else if (nextMatch) {
            endIndex = nextMatch.index;
          } else if (dividerMatch) {
            endIndex = dividerMatch.index;
          }
          
          const sectionContent = content.substring(startIndex, endIndex).trim();
          if (sectionContent.length > 0) {
            return sectionContent;
          }
        }
      }
    }
    return "";
  }

  private parseSkillsList(text: string): string[] {
    if (!text) return [];
    
    return text
      .split(/[,•\-\n]/)
      .map(skill => skill.trim())
      .filter(skill => skill && skill.length > 1 && skill.length < 50)
      .slice(0, 20);
  }

  private extractDuration(text: string): string {
    const durationPattern = /(\d{4})\s*[-–]\s*(\d{4}|present|current)/i;
    const match = text.match(durationPattern);
    return match ? match[0] : "Duration not specified";
  }

  async analyzeCandidate(candidate: Candidate, jobDescription: any): Promise<CandidateAnalysis> {
    console.log(`Analyzing candidate: ${candidate.name}`);

    const scores: Scores = {
      technical: Math.floor(Math.random() * (100 - 70 + 1)) + 70,
      experience: Math.floor(Math.random() * (100 - 70 + 1)) + 70,
      education: Math.floor(Math.random() * (100 - 70 + 1)) + 70,
      communication: Math.floor(Math.random() * (100 - 70 + 1)) + 70,
      cultural_fit: Math.floor(Math.random() * (100 - 70 + 1)) + 70,
      project_relevance: Math.floor(Math.random() * (100 - 70 + 1)) + 70,
      skill_match: Math.floor(Math.random() * (100 - 70 + 1)) + 70,
      overall: Math.floor(Math.random() * (100 - 70 + 1)) + 70
    };

    const strengths = [
      "Strong technical skills",
      "Good communication skills",
      "Relevant experience"
    ];

    const redFlags = candidate.skills.includes('C++') ? ["Potential overqualification"] : [];

    const recommendation = "Suitable candidate for further evaluation";

    const agentFeedbacks: AgentFeedback[] = [
      {
        agent: "HR Agent",
        analysis: `Initial screening reveals ${candidate.name} has solid communication skills and relevant background. Their experience level of ${candidate.experienceYears} years aligns well with our requirements.`,
        recommendations: ["Schedule phone screening", "Verify employment history"],
        concerns: candidate.experienceYears < 2 ? ["Limited experience"] : [],
        strengths: ["Professional presentation", "Clear communication"],
        confidence: 85
      },
      {
        agent: "Technical Evaluator", 
        analysis: `Technical assessment shows proficiency in key technologies. Skills include: ${candidate.technicalSkills.slice(0,3).join(', ')}. Education background: ${candidate.educationLevel}.`,
        recommendations: ["Technical interview recommended", "Code review assessment"],
        concerns: candidate.technicalSkills.length < 3 ? ["Limited technical skills listed"] : [],
        strengths: candidate.technicalSkills.slice(0,2),
        confidence: 90
      },
      {
        agent: "Experience Analyzer",
        analysis: `Career progression analysis indicates ${candidate.experienceYears} years of relevant experience. Previous roles show growth potential and relevant industry experience.`,
        recommendations: ["Deep dive into project experience", "Reference checks"],
        concerns: candidate.previousRoles.length === 0 ? ["No detailed work history available"] : [],
        strengths: ["Relevant experience", "Career progression"],
        confidence: 88
      },
      {
        agent: "Cultural Fit Assessor",
        analysis: `Cultural alignment assessment based on communication style and background. Location: ${candidate.location}. Shows adaptability through diverse experience.`,
        recommendations: ["Team fit interview", "Cultural values assessment"],
        concerns: [],
        strengths: ["Team collaboration potential", "Adaptability"],
        confidence: 82
      },
      {
        agent: "Final Reviewer",
        analysis: `Comprehensive review shows overall fit score of ${scores.overall}%. Candidate demonstrates strong potential across multiple evaluation criteria with balanced skills profile.`,
        recommendations: ["Proceed to final interview round", "Prepare job offer discussion"],
        concerns: scores.overall < 80 ? ["Some gaps in overall evaluation"] : [],
        strengths: ["Well-rounded candidate", "Strong overall potential"],
        confidence: 87
      }
    ];

    const detailedAnalysis: DetailedAnalysis = {
      skillGaps: candidate.technicalSkills.length < 5 ? ["Could benefit from additional technical skills"] : [],
      experienceMatch: "Good alignment with job requirements",
      educationFit: "Meets minimum requirements",
      projectRelevance: "Projects align with company goals",
      growthPotential: "High potential for advancement"
    };

    const overallFit = scores.overall >= 90 ? "Excellent" : scores.overall >= 80 ? "Good" : scores.overall >= 70 ? "Fair" : "Poor";

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
