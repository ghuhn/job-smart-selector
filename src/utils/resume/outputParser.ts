
import type { ParsedCandidate, EducationEntry, ExperienceEntry, ProjectEntry } from './types';
import { NameUtils } from './nameUtils';
import { EmailUtils } from './emailUtils';
import { LanguageUtils } from './languageUtils';

export class OutputParser {
    static parseLlmOutput(llmOutput: string): ParsedCandidate {
        console.log('=== PARSING LLM OUTPUT ===');
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
        let educationBuffer: string[] = [];
        let languageBuffer: string[] = [];

        for (const line of lines) {
            if (line.startsWith('**') && line.endsWith('**')) {
                // Process accumulated education lines before switching sections
                if (sectionKey === 'education' && educationBuffer.length > 0) {
                    this.processEducationBuffer(educationBuffer, candidate);
                    educationBuffer = [];
                }
                
                // Process accumulated language lines before switching sections
                if (sectionKey === 'languages' && languageBuffer.length > 0) {
                    this.processLanguageBuffer(languageBuffer, candidate);
                    languageBuffer = [];
                }
                
                currentSection = line.replace(/\*\*/g, '').trim();
                sectionKey = currentSection.toLowerCase().replace(/\s+/g, '_');
                console.log('Found section:', currentSection, 'Key:', sectionKey);
                continue;
            }

            const content = line.trim();
            if (!content) continue;

            console.log(`Processing line in section "${sectionKey}":`, content);

            switch (sectionKey) {
                case 'name':
                    candidate.name = NameUtils.cleanName(content);
                    console.log('Parsed name:', candidate.name);
                    break;
                case 'email':
                    candidate.email = EmailUtils.validateEmail(content);
                    console.log('Parsed email:', candidate.email);
                    break;
                case 'phone':
                    candidate.phone = content !== "Not provided" ? content : "Not provided";
                    console.log('Parsed phone:', candidate.phone);
                    break;
                case 'location':
                    candidate.location = content !== "Not provided" ? content : "Not provided";
                    console.log('Parsed location:', candidate.location);
                    break;
                case 'linkedin':
                    candidate.linkedIn = content !== "Not provided" ? content : "Not provided";
                    console.log('Parsed LinkedIn:', candidate.linkedIn);
                    break;
                case 'github':
                    candidate.github = content !== "Not provided" ? content : "Not provided";
                    console.log('Parsed GitHub:', candidate.github);
                    break;
                case 'experience_years':
                    candidate.experienceYears = parseInt(content) || 0;
                    console.log('Parsed experience years:', candidate.experienceYears);
                    break;
                case 'education':
                    console.log('Adding to education buffer:', content);
                    educationBuffer.push(content);
                    break;
                case 'experience':
                    this.parseExperienceEntry(content, candidate);
                    break;
                case 'technical_skills':
                    if (candidate.technicalSkills) {
                        candidate.technicalSkills = this.parseSkillsList(content);
                        // Also add to general skills array
                        candidate.skills = [...(candidate.skills || []), ...candidate.technicalSkills];
                        console.log('Parsed technical skills:', candidate.technicalSkills);
                    }
                    break;
                case 'soft_skills':
                    if (candidate.softSkills) {
                        candidate.softSkills = this.parseSkillsList(content);
                        console.log('Parsed soft skills:', candidate.softSkills);
                    }
                    break;
                case 'certifications':
                    if (candidate.certifications) {
                        candidate.certifications = this.parseSkillsList(content);
                        console.log('Parsed certifications:', candidate.certifications);
                    }
                    break;
                case 'languages':
                    console.log('Adding to language buffer:', content);
                    languageBuffer.push(content);
                    break;
                case 'projects':
                    this.parseProjectEntry(content, candidate);
                    break;
                case 'achievements':
                    this.parseAchievementEntry(content, candidate);
                    break;
            }
        }

        // Process any remaining buffers
        if (educationBuffer.length > 0) {
            this.processEducationBuffer(educationBuffer, candidate);
        }
        if (languageBuffer.length > 0) {
            this.processLanguageBuffer(languageBuffer, candidate);
        }

        console.log('=== FINAL PARSED CANDIDATE ===');
        console.log(candidate);
        return candidate;
    }

    private static parseSkillsList(content: string): string[] {
        return content.split(/[,;|&\n]/).map(s => s.trim()).filter(s => s.length > 0 && !s.toLowerCase().includes('not provided'));
    }

    private static parseExperienceEntry(content: string, candidate: ParsedCandidate) {
        // Handle multiple experience entry formats
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

        for (const pattern of patterns) {
            const match = content.match(pattern);
            if (match) {
                const expEntry = {
                    role: match[1].trim(),
                    company: match[2].trim(),
                    duration: match[3].trim(),
                    description: '',
                };
                
                // Handle different pattern interpretations
                if (pattern.source.includes('Company:')) {
                    // Swap role and company for Company: Title format
                    expEntry.company = match[1].trim();
                    expEntry.role = match[2].trim();
                }
                
                candidate.experience?.push(expEntry);
                console.log('Added experience entry:', expEntry);
                return;
            }
        }

        // If no pattern matched, check if it's a description for the last experience
        if (candidate.experience && candidate.experience.length > 0 && !content.startsWith('-')) {
            const lastExperience = candidate.experience[candidate.experience.length - 1];
            lastExperience.description = (lastExperience.description + ' ' + content).trim();
            console.log('Updated last experience description');
        }
    }

    private static parseProjectEntry(content: string, candidate: ParsedCandidate) {
        const patterns = [
            // Pattern: Project Name: Description (Technologies)
            /^-?\s*(.*?):\s*(.*?)\s*\(([^)]+)\)/,
            // Pattern: Project Name - Description (Technologies)
            /^-?\s*(.*?)\s*-\s*(.*?)\s*\(([^)]+)\)/,
            // Pattern: Project Name: Description
            /^-?\s*(.*?):\s*(.*)/
        ];

        for (const pattern of patterns) {
            const match = content.match(pattern);
            if (match) {
                const projectEntry = {
                    name: match[1].trim(),
                    description: match[2].trim(),
                    technologies: match[3] ? match[3].split(',').map(t => t.trim()) : []
                };
                candidate.projects?.push(projectEntry);
                console.log('Added project entry:', projectEntry);
                return;
            }
        }

        // Simple fallback for project entries without specific format
        if (content.startsWith('-') || content.startsWith('•')) {
            const cleanContent = content.replace(/^[-•]\s*/, '').trim();
            const projectEntry = {
                name: cleanContent.split(':')[0] || cleanContent,
                description: cleanContent.split(':')[1] || cleanContent,
                technologies: []
            };
            candidate.projects?.push(projectEntry);
            console.log('Added project entry (fallback):', projectEntry);
        }
    }

    private static parseAchievementEntry(content: string, candidate: ParsedCandidate) {
        if (content.startsWith('-') || content.startsWith('•')) {
            candidate.achievements?.push(content.replace(/^[-•]\s*/, '').trim());
        } else {
            candidate.achievements?.push(content);
        }
        console.log('Added achievement:', content);
    }

    private static processEducationBuffer(buffer: string[], candidate: ParsedCandidate) {
        console.log('Processing education buffer:', buffer);
        
        for (const line of buffer) {
            if (line.trim() === '' || line.toLowerCase().includes('not provided')) continue;
            
            // Enhanced education parsing patterns
            const patterns = [
                // Pattern: Degree, Institution (Year) CGPA
                /^-?\s*([^,]+),\s*([^(]+)\s*\(([^)]+)\)\s*([\d.]+)/,
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
                // Pattern: Just degree and institution without parentheses
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
                    
                    // Handle Institution: Degree format
                    if (pattern.source.includes(':')) {
                        const temp = degree;
                        degree = institution;
                        institution = temp;
                    }
                    
                    const eduEntry = {
                        degree: degree,
                        institution: institution,
                        years: years + (gpa ? ` (CGPA: ${gpa})` : ''),
                    };
                    candidate.education?.push(eduEntry);
                    console.log('Added education entry:', eduEntry);
                    matched = true;
                    break;
                }
            }
            
            // Enhanced fallback parsing
            if (!matched && line.length > 10) {
                const cleanLine = line.replace(/^-\s*/, '');
                
                // Try to identify common degree keywords
                const degreeKeywords = ['bachelor', 'master', 'phd', 'diploma', 'certificate', 'btech', 'mtech', 'mba', 'bca', 'mca', 'bsc', 'msc'];
                const foundDegree = degreeKeywords.find(keyword => cleanLine.toLowerCase().includes(keyword));
                
                if (foundDegree) {
                    // Extract parts more intelligently
                    const parts = cleanLine.split(/[,\(\)\-|]/);
                    const eduEntry = {
                        degree: parts.find(p => p.toLowerCase().includes(foundDegree))?.trim() || parts[0].trim(),
                        institution: parts.find(p => !p.toLowerCase().includes(foundDegree) && p.length > 3)?.trim() || 'Not specified',
                        years: parts.find(p => /\d{4}/.test(p))?.trim() || 'Not specified',
                    };
                    candidate.education?.push(eduEntry);
                    console.log('Added education entry (enhanced fallback):', eduEntry);
                }
            }
        }
    }

    private static processLanguageBuffer(buffer: string[], candidate: ParsedCandidate) {
        console.log('Processing language buffer:', buffer);
        const allLanguageText = buffer.join(', ');
        
        if (candidate.languages) {
            candidate.languages = LanguageUtils.parseLanguages(allLanguageText);
            console.log('Final parsed languages:', candidate.languages);
        }
    }
}
