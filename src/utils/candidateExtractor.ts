
import { ResumeParser } from './resumeParser';
import { Candidate } from './multiAgentSystem';

export class SmartCandidateExtractor {
  static async extractCandidate(resume: any): Promise<Candidate> {
    console.log('=== NEW RESUME PARSING INITIATED ===');
    
    // Use the new parser
    const extractedData = ResumeParser.parse(resume.content || '', resume.name);
    
    // Convert to the expected Candidate interface, filling defaults
    const candidate: Candidate = {
      name: "Unknown",
      email: "Not provided",
      phone: "Not provided",
      location: "Not provided",
      skills: [],
      technicalSkills: [],
      softSkills: [],
      experience: [],
      experienceYears: 0,
      education: [],
      educationLevel: "Not provided",
      certifications: [],
      languages: [],
      projects: [],
      achievements: [],
      summary: "",
      keywords: [],
      linkedIn: "Not provided",
      github: "Not provided",
      ...extractedData,
    };
    
    if (candidate.education.length > 0) {
        const highestEdu = candidate.education[0].degree.toLowerCase();
        if (highestEdu.includes('phd') || highestEdu.includes('doctor')) candidate.educationLevel = 'PhD';
        else if (highestEdu.includes('master') || highestEdu.includes('msc') || highestEdu.includes('mba')) candidate.educationLevel = 'Masters';
        else if (highestEdu.includes('bachelor') || highestEdu.includes('bsc') || highestEdu.includes('btech')) candidate.educationLevel = 'Bachelor';
        else candidate.educationLevel = "Other";
    }

    console.log('=== FINAL PARSED CANDIDATE ===');
    console.log(candidate);

    return candidate;
  }
}
