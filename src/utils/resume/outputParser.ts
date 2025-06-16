
import type { ParsedCandidate, EducationEntry, ExperienceEntry, ProjectEntry } from './types';
import { NameUtils } from './nameUtils';
import { EmailUtils } from './emailUtils';
import { LanguageUtils } from './languageUtils';

export class OutputParser {
    static parseLlmOutput(llmOutput: string): ParsedCandidate {
        console.log('=== ENHANCED PARSING LLM OUTPUT ===');
        console.log('Raw LLM Output:', llmOutput);
        
        const candidate: ParsedCandidate = {
            education: [],
            experience: [],
            skills: [],
            technicalSkills: [],
            softSkills: [],
            languages: [],
            projects: [],
            achievements: [],
            certifications: []
        };
        
        const lines = llmOutput.split('\n').filter(line => line.trim() !== '');
        let currentSection = '';
        let sectionKey = '';
        let accumulator: string[] = [];

        for (const line of lines) {
            if (line.startsWith('**') && line.endsWith('**')) {
                // Process accumulated data before switching sections
                this.processAccumulatedData(sectionKey, accumulator, candidate);
                accumulator = [];
                
                currentSection = line.replace(/\*\*/g, '').trim();
                sectionKey = currentSection.toLowerCase().replace(/\s+/g, '_');
                console.log('Processing section:', currentSection, 'Key:', sectionKey);
                continue;
            }

            const content = line.trim();
            if (!content) continue;

            console.log(`Processing line in section "${sectionKey}":`, content);

            switch (sectionKey) {
                case 'name':
                    candidate.name = NameUtils.cleanName(content);
                    console.log('Extracted name:', candidate.name);
                    break;
                case 'email':
                    candidate.email = EmailUtils.validateEmail(content);
                    console.log('Extracted email:', candidate.email);
                    break;
                case 'phone':
                    candidate.phone = this.cleanBasicField(content);
                    console.log('Extracted phone:', candidate.phone);
                    break;
                case 'location':
                    candidate.location = this.cleanBasicField(content);
                    console.log('Extracted location:', candidate.location);
                    break;
                case 'linkedin':
                    candidate.linkedIn = this.cleanBasicField(content);
                    console.log('Extracted LinkedIn:', candidate.linkedIn);
                    break;
                case 'github':
                    candidate.github = this.cleanBasicField(content);
                    console.log('Extracted GitHub:', candidate.github);
                    break;
                case 'experience_years':
                    candidate.experienceYears = this.parseNumber(content);
                    console.log('Extracted experience years:', candidate.experienceYears);
                    break;
                case 'education':
                case 'experience':
                case 'technical_skills':
                case 'soft_skills':
                case 'certifications':
                case 'languages':
                case 'projects':
                case 'achievements':
                    accumulator.push(content);
                    break;
            }
        }

        // Process any remaining accumulated data
        this.processAccumulatedData(sectionKey, accumulator, candidate);

        console.log('=== ENHANCED PARSING COMPLETE ===');
        console.log('Final candidate data:', candidate);
        return candidate;
    }

    private static cleanBasicField(content: string): string {
        const cleaned = content.trim();
        if (cleaned.toLowerCase() === "not provided" || 
            cleaned.toLowerCase() === "not specified" ||
            cleaned.toLowerCase() === "n/a" ||
            cleaned === "") {
            return "Not provided";
        }
        return cleaned;
    }

    private static parseNumber(content: string): number {
        const match = content.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
    }

    private static processAccumulatedData(sectionKey: string, accumulator: string[], candidate: ParsedCandidate) {
        if (accumulator.length === 0) return;

        console.log(`Processing accumulated data for section: ${sectionKey}`, accumulator);

        switch (sectionKey) {
            case 'education':
                this.processEducationData(accumulator, candidate);
                break;
            case 'experience':
                this.processExperienceData(accumulator, candidate);
                break;
            case 'technical_skills':
                candidate.technicalSkills = this.parseSkillsList(accumulator.join(' '));
                candidate.skills = [...(candidate.skills || []), ...(candidate.technicalSkills || [])];
                console.log('Processed technical skills:', candidate.technicalSkills);
                break;
            case 'soft_skills':
                candidate.softSkills = this.parseSkillsList(accumulator.join(' '));
                console.log('Processed soft skills:', candidate.softSkills);
                break;
            case 'certifications':
                candidate.certifications = this.parseSkillsList(accumulator.join(' '));
                console.log('Processed certifications:', candidate.certifications);
                break;
            case 'languages':
                candidate.languages = LanguageUtils.parseLanguages(accumulator.join(' '));
                console.log('Processed languages:', candidate.languages);
                break;
            case 'projects':
                this.processProjectsData(accumulator, candidate);
                break;
            case 'achievements':
                this.processAchievementsData(accumulator, candidate);
                break;
        }
    }

    private static parseSkillsList(content: string): string[] {
        return content
            .split(/[,;|&\n]/)
            .map(s => s.trim())
            .filter(s => s.length > 0 && 
                         !s.toLowerCase().includes('not provided') &&
                         !s.toLowerCase().includes('not specified') &&
                         s.toLowerCase() !== 'n/a');
    }

    private static processEducationData(accumulator: string[], candidate: ParsedCandidate) {
        console.log('Processing education data:', accumulator);
        
        for (const line of accumulator) {
            if (this.isEmptyOrNotProvided(line)) continue;
            
            // Enhanced education parsing patterns
            const patterns = [
                // Pattern: Degree, Institution (Year) GPA
                /^-?\s*([^,]+),\s*([^(]+)\s*\(([^)]+)\)\s*([\d.]+|GPA:\s*[\d.]+|CGPA:\s*[\d.]+)/i,
                // Pattern: Degree, Institution (Year)
                /^-?\s*([^,]+),\s*([^(]+)\s*\(([^)]+)\)/,
                // Pattern: Institution: Degree (Year)
                /^-?\s*([^:]+):\s*([^(]+)\s*\(([^)]+)\)/,
                // Pattern: Degree from Institution (Year)
                /^-?\s*(.+?)\s+from\s+(.+?)\s*\(([^)]+)\)/i,
                // Pattern: Institution - Degree - Year
                /^-?\s*([^-]+)\s*-\s*([^-]+)\s*-\s*(.+)/,
                // Pattern: Degree | Institution | Year
                /^-?\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*(.+)/,
                // Pattern: Simple format - Degree, Institution
                /^-?\s*([^,]+),\s*(.+)/
            ];
            
            let matched = false;
            for (const pattern of patterns) {
                const match = line.match(pattern);
                if (match) {
                    let degree = match[1].trim();
                    let institution = match[2].trim();
                    let years = match[3] ? match[3].trim() : 'Not specified';
                    let gpa = match[4] ? match[4].trim() : '';
                    
                    // Handle Institution: Degree format by swapping
                    if (pattern.source.includes(':')) {
                        [degree, institution] = [institution, degree];
                    }
                    
                    const eduEntry: EducationEntry = {
                        degree,
                        institution,
                        years: years + (gpa ? ` (${gpa})` : ''),
                    };
                    
                    candidate.education?.push(eduEntry);
                    console.log('Added education entry:', eduEntry);
                    matched = true;
                    break;
                }
            }
            
            // Enhanced fallback parsing
            if (!matched && line.length > 5) {
                const cleanLine = line.replace(/^-\s*/, '');
                const degreeKeywords = ['bachelor', 'master', 'phd', 'diploma', 'certificate', 'btech', 'mtech', 'mba', 'bca', 'mca', 'bsc', 'msc', 'engineering', 'science', 'arts', 'commerce'];
                
                const foundDegree = degreeKeywords.find(keyword => 
                    cleanLine.toLowerCase().includes(keyword)
                );
                
                if (foundDegree) {
                    const parts = cleanLine.split(/[,\(\)\-|]/);
                    const eduEntry: EducationEntry = {
                        degree: parts.find(p => p.toLowerCase().includes(foundDegree))?.trim() || parts[0].trim(),
                        institution: parts.find(p => !p.toLowerCase().includes(foundDegree) && p.length > 3)?.trim() || 'Institution not specified',
                        years: parts.find(p => /\d{4}/.test(p))?.trim() || 'Year not specified',
                    };
                    candidate.education?.push(eduEntry);
                    console.log('Added education entry (fallback):', eduEntry);
                }
            }
        }
    }

    private static processExperienceData(accumulator: string[], candidate: ParsedCandidate) {
        console.log('Processing experience data:', accumulator);
        
        for (const line of accumulator) {
            if (this.isEmptyOrNotProvided(line)) continue;
            
            // Enhanced experience parsing patterns
            const patterns = [
                // Pattern: Title at Company (Duration)
                /^-?\s*(.*?)\s*at\s*(.*?)\s*\(([^)]+)\)/,
                // Pattern: Company: Title (Duration)
                /^-?\s*(.*?):\s*(.*?)\s*\(([^)]+)\)/,
                // Pattern: Title | Company | Duration
                /^-?\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(.*)/,
                // Pattern: Company - Title - Duration
                /^-?\s*(.*?)\s*-\s*(.*?)\s*-\s*(.*)/
            ];

            let matched = false;
            for (const pattern of patterns) {
                const match = line.match(pattern);
                if (match) {
                    let role = match[1].trim();
                    let company = match[2].trim();
                    let duration = match[3].trim();
                    
                    // Handle Company: Title format
                    if (pattern.source.includes('Company:')) {
                        [company, role] = [role, company];
                    }
                    
                    const expEntry: ExperienceEntry = {
                        role,
                        company,
                        duration,
                        description: '',
                    };
                    
                    candidate.experience?.push(expEntry);
                    console.log('Added experience entry:', expEntry);
                    matched = true;
                    break;
                }
            }
            
            // If no pattern matched and it's not starting with -, assume it's a description
            if (!matched && !line.startsWith('-') && candidate.experience && candidate.experience.length > 0) {
                const lastExp = candidate.experience[candidate.experience.length - 1];
                lastExp.description = (lastExp.description + ' ' + line).trim();
                console.log('Updated experience description');
            }
        }
    }

    private static processProjectsData(accumulator: string[], candidate: ParsedCandidate) {
        console.log('Processing projects data:', accumulator);
        
        for (const line of accumulator) {
            if (this.isEmptyOrNotProvided(line)) continue;
            
            const patterns = [
                // Pattern: Project Name: Description (Technologies)
                /^-?\s*(.*?):\s*(.*?)\s*\(([^)]+)\)/,
                // Pattern: Project Name - Description (Technologies)
                /^-?\s*(.*?)\s*-\s*(.*?)\s*\(([^)]+)\)/,
                // Pattern: Project Name: Description
                /^-?\s*(.*?):\s*(.*)/
            ];

            let matched = false;
            for (const pattern of patterns) {
                const match = line.match(pattern);
                if (match) {
                    const projectEntry: ProjectEntry = {
                        name: match[1].trim(),
                        description: match[2].trim(),
                        technologies: match[3] ? match[3].split(',').map(t => t.trim()) : []
                    };
                    candidate.projects?.push(projectEntry);
                    console.log('Added project entry:', projectEntry);
                    matched = true;
                    break;
                }
            }

            // Fallback for simple project entries
            if (!matched && (line.startsWith('-') || line.startsWith('•'))) {
                const cleanContent = line.replace(/^[-•]\s*/, '').trim();
                const projectEntry: ProjectEntry = {
                    name: cleanContent.split(':')[0] || cleanContent,
                    description: cleanContent.split(':')[1] || cleanContent,
                    technologies: []
                };
                candidate.projects?.push(projectEntry);
                console.log('Added project entry (fallback):', projectEntry);
            }
        }
    }

    private static processAchievementsData(accumulator: string[], candidate: ParsedCandidate) {
        console.log('Processing achievements data:', accumulator);
        
        for (const line of accumulator) {
            if (this.isEmptyOrNotProvided(line)) continue;
            
            const cleanedAchievement = line.replace(/^[-•]\s*/, '').trim();
            if (cleanedAchievement) {
                candidate.achievements?.push(cleanedAchievement);
                console.log('Added achievement:', cleanedAchievement);
            }
        }
    }

    private static isEmptyOrNotProvided(content: string): boolean {
        const cleaned = content.trim().toLowerCase();
        return cleaned === '' || 
               cleaned === 'not provided' || 
               cleaned === 'not specified' || 
               cleaned === 'n/a' ||
               cleaned === 'none' ||
               cleaned === 'none listed';
    }
}
