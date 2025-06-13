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
      
      // Process each uploaded resume
      for (let i = 0; i < uploadedResumes.length; i++) {
        const resume = uploadedResumes[i];
        console.log(`Processing resume ${i + 1}: ${resume.name}`);
        
        // Extract candidate information from the resume content
        const candidate = this.extractCandidateFromResume(resume);
        console.log('Extracted candidate:', candidate);
        
        // Run multi-agent analysis on this candidate
        const analysis = await this.analyzeCandidate(candidate, jobDescription);
        analysis.rank = i + 1; // Temporary rank, will be sorted later
        
        analyses.push(analysis);
      }
      
      // Sort by overall score and assign final ranks
      const sortedAnalyses = analyses.sort((a, b) => b.scores.overall - a.scores.overall);
      
      // Apply final rankings
      sortedAnalyses.forEach((analysis, index) => {
        analysis.rank = index + 1;
      });
      
      // Return top N candidates as specified in job description
      const topN = parseInt(jobDescription.topNCandidates) || 3;
      const topCandidates = sortedAnalyses.slice(0, topN);
      
      console.log('Final analysis results:', topCandidates);
      return topCandidates;
      
    } catch (error) {
      console.error('Error in multi-agent processing:', error);
      // If processing fails, return empty array so Results page handles it properly
      return [];
    }
  }

  private extractCandidateFromResume(resume: any): Candidate {
    console.log('Extracting candidate data from resume:', resume.name);
    
    try {
      const content = resume.content || '';
      
      // Extract name from filename if not found in content
      const nameFromFile = resume.name.split('.')[0].replace(/[-_]/g, ' ');
      
      // Parse the resume content to extract information
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
      
      // Fallback to basic extraction from filename
      const nameFromFile = resume.name.split('.')[0].replace(/[-_]/g, ' ');
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
    // Look for name patterns at the beginning of the resume
    const namePatterns = [
      /^([A-Z][a-z]+ [A-Z][a-z]+)/m,
      /Name:\s*([A-Za-z\s]+)/i,
      /^([A-Z][A-Z\s]+)$/m
    ];
    
    for (const pattern of namePatterns) {
      const match = content.match(pattern);
      if (match && match[1] && match[1].length < 50) {
        return match[1].trim();
      }
    }
    
    return "";
  }

  private extractEmail(content: string): string {
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const match = content.match(emailPattern);
    return match ? match[0] : "Not provided";
  }

  private extractPhone(content: string): string {
    const phonePatterns = [
      /\+?1?\s*\(?([0-9]{3})\)?[-.\s]*([0-9]{3})[-.\s]*([0-9]{4})/,
      /\(?\d{3}\)?[-.\s]*\d{3}[-.\s]*\d{4}/
    ];
    
    for (const pattern of phonePatterns) {
      const match = content.match(pattern);
      if (match) {
        return match[0];
      }
    }
    
    return "Not provided";
  }

  private extractLocation(content: string): string {
    const locationPatterns = [
      /(?:Location|Address|City):\s*([^,\n]+(?:,\s*[A-Z]{2})?)/i,
      /([A-Za-z\s]+,\s*[A-Z]{2})/,
      /([A-Za-z\s]+,\s*[A-Za-z\s]+)/
    ];
    
    for (const pattern of locationPatterns) {
      const match = content.match(pattern);
      if (match && match[1] && match[1].length < 100) {
        return match[1].trim();
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
    
    // Common technical skills to look for
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
    // Look for years of experience
    const expPattern = /(\d+)\+?\s*years?\s*of\s*experience/i;
    const match = content.match(expPattern);
    if (match) {
      return `${match[1]} years`;
    }
    
    // Count job entries to estimate experience
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
    
    // Estimate from job entries
    const jobCount = (content.match(/\d{4}\s*[-–]\s*(\d{4}|present|current)/gi) || []).length;
    return jobCount > 0 ? Math.min(jobCount * 2, 15) : 0;
  }

  private extractEducation(content: string): string {
    const eduSection = this.extractSection(content, ['education', 'academic', 'university', 'college']);
    if (eduSection) {
      const lines = eduSection.split('\n').filter(line => line.trim());
      const education = lines.slice(0, 2).join(', ');
      return education || "Not provided";
    }
    return "Not provided";
  }

  private extractEducationLevel(content: string): string {
    const degrees = ['PhD', 'Masters', 'Bachelor', 'Associate', 'Diploma'];
    for (const degree of degrees) {
      if (content.toLowerCase().includes(degree.toLowerCase())) {
        return degree;
      }
    }
    return "Not provided";
  }

  private extractCertifications(content: string): string[] {
    const certSection = this.extractSection(content, ['certifications', 'certificates', 'credentials']);
    if (certSection) {
      const certs = this.parseSkillsList(certSection);
      if (certs.length > 0) return certs;
    }
    
    // Look for common certification patterns
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
    
    // Look for work experience section
    const workSection = this.extractSection(content, ['experience', 'work experience', 'employment', 'professional experience']);
    
    if (workSection) {
      // Split by common delimiters and parse each role
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
    // Extract frequently mentioned technical terms
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
      const pattern = new RegExp(`^\\s*${sectionName}\\s*:?\\s*$`, 'gmi');
      const match = pattern.exec(content);
      
      if (match) {
        const startIndex = match.index + match[0].length;
        const nextSectionPattern = /^\s*[A-Z][A-Z\s]*\s*:?\s*$/gm;
        nextSectionPattern.lastIndex = startIndex;
        const nextMatch = nextSectionPattern.exec(content);
        
        const endIndex = nextMatch ? nextMatch.index : content.length;
        return content.substring(startIndex, endIndex).trim();
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
      .slice(0, 20); // Limit to reasonable number
  }

  private extractDuration(text: string): string {
    const durationPattern = /(\d{4})\s*[-–]\s*(\d{4}|present|current)/i;
    const match = text.match(durationPattern);
    return match ? match[0] : "Duration not specified";
  }

  async analyzeCandidate(candidate: Candidate, jobDescription: any): Promise<CandidateAnalysis> {
    console.log(`Analyzing candidate: ${candidate.name}`);
    console.log('Job description:', jobDescription);

    // Mock scores and feedback for demonstration
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
        analysis: "Positive initial impression",
        recommendations: ["Schedule interview"],
        concerns: [],
        strengths: ["Enthusiastic", "Good communicator"],
        confidence: 85
      },
      {
        agent: "Technical Evaluator",
        analysis: "Solid technical background",
        recommendations: ["Technical interview"],
        concerns: [],
        strengths: ["Proficient in JavaScript", "Experience with React"],
        confidence: 90
      }
    ];

    const detailedAnalysis: DetailedAnalysis = {
      skillGaps: [],
      experienceMatch: "Good alignment with job requirements",
      educationFit: "Meets minimum requirements",
      projectRelevance: "Projects align with company goals",
      growthPotential: "High potential for advancement"
    };

    const overallFit = "Good";

    const analysis: CandidateAnalysis = {
      rank: 0, // Rank will be assigned later
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
