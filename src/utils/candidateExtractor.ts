import { ResumeParser } from './resumeParser';
import { Candidate, ExperienceEntry } from './multiAgentSystem';

function calculateExperienceYears(experience: ExperienceEntry[] | undefined): number {
    if (!experience) return 0;
    
    let totalMonths = 0;
    const currentYear = new Date().getFullYear();

    for (const job of experience) {
        const duration = job.duration.toLowerCase();
        const yearMatches = duration.match(/\b\d{4}\b/g);

        if (yearMatches) {
            const startYear = parseInt(yearMatches[0], 10);
            let endYear = startYear;

            if (yearMatches.length > 1) {
                endYear = parseInt(yearMatches[1], 10);
            } else if (duration.includes('present') || duration.includes('current')) {
                endYear = currentYear;
            }
            
            totalMonths += (endYear - startYear) * 12;
        }
    }
    return Math.round(totalMonths / 12);
}


export class SmartCandidateExtractor {
  static async extractCandidate(resume: any): Promise<Candidate> {
    console.log('=== NEW RESUME PARSING INITIATED ===');
    
    // Use the new async parser
    const extractedData = await ResumeParser.parse(resume.content || '');
    
    const experienceYears = calculateExperienceYears(extractedData.experience);

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
      experienceYears,
    };
    
    if (candidate.education && candidate.education.length > 0) {
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
