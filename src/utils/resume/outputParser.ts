
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
                    const expMatch = content.match(/-?\s*(.*?)\s*at\s*(.*?)\s*\(([^)]+)\)/);
                    if (expMatch) {
                        const expEntry = {
                            role: expMatch[1].trim(),
                            company: expMatch[2].trim(),
                            duration: expMatch[3].trim(),
                            description: '',
                        };
                        candidate.experience?.push(expEntry);
                        console.log('Added experience entry:', expEntry);
                    } else if (candidate.experience && candidate.experience.length > 0 && !content.startsWith('-')) {
                        const lastExperience = candidate.experience[candidate.experience.length - 1];
                        lastExperience.description = (lastExperience.description + ' ' + content).trim();
                        console.log('Updated last experience description');
                    }
                    break;
                case 'technical_skills':
                    if (candidate.technicalSkills) {
                        candidate.technicalSkills = content.split(',').map(s => s.trim()).filter(Boolean);
                        // Also add to general skills array
                        candidate.skills = [...(candidate.skills || []), ...candidate.technicalSkills];
                        console.log('Parsed technical skills:', candidate.technicalSkills);
                    }
                    break;
                case 'soft_skills':
                    if (candidate.softSkills) {
                        candidate.softSkills = content.split(',').map(s => s.trim()).filter(Boolean);
                        console.log('Parsed soft skills:', candidate.softSkills);
                    }
                    break;
                case 'certifications':
                    if (candidate.certifications) {
                        candidate.certifications = content.split(',').map(s => s.trim()).filter(Boolean);
                        console.log('Parsed certifications:', candidate.certifications);
                    }
                    break;
                case 'languages':
                    console.log('Adding to language buffer:', content);
                    languageBuffer.push(content);
                    break;
                case 'projects':
                    const projectMatch = content.match(/-?\s*(.*?):\s*(.*?)\s*\(([^)]+)\)/);
                    if (projectMatch) {
                        const projectEntry = {
                            name: projectMatch[1].trim(),
                            description: projectMatch[2].trim(),
                            technologies: projectMatch[3].split(',').map(t => t.trim())
                        };
                        candidate.projects?.push(projectEntry);
                        console.log('Added project entry:', projectEntry);
                    }
                    break;
                case 'achievements':
                    if (content.startsWith('-') || content.startsWith('•')) {
                        candidate.achievements?.push(content.replace(/^[-•]\s*/, '').trim());
                    } else {
                        candidate.achievements?.push(content);
                    }
                    console.log('Added achievement:', content);
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

    private static processEducationBuffer(buffer: string[], candidate: ParsedCandidate) {
        console.log('Processing education buffer:', buffer);
        const allEducationText = buffer.join(' ');
        
        for (const line of buffer) {
            if (line.trim() === '' || line.toLowerCase().includes('not provided')) continue;
            
            // Try multiple education parsing patterns
            const patterns = [
                // Pattern: Degree, Institution (Year)
                /^-?\s*([^,]+),\s*([^(]+)\s*\(([^)]+)\)/,
                // Pattern: Degree from Institution (Year)
                /^-?\s*(.+?)\s+from\s+(.+?)\s*\(([^)]+)\)/i,
                // Pattern: Institution: Degree (Year)
                /^-?\s*([^:]+):\s*([^(]+)\s*\(([^)]+)\)/,
                // Pattern: Degree - Institution - Year
                /^-?\s*([^-]+)\s*-\s*([^-]+)\s*-\s*(.+)/,
                // Pattern: Just degree and institution without parentheses
                /^-?\s*([^,]+),\s*(.+)/
            ];
            
            let matched = false;
            for (const pattern of patterns) {
                const match = line.match(pattern);
                if (match) {
                    const eduEntry = {
                        degree: match[1].trim(),
                        institution: match[2].trim(),
                        years: match[3] ? match[3].trim() : 'Not specified',
                    };
                    candidate.education?.push(eduEntry);
                    console.log('Added education entry:', eduEntry);
                    matched = true;
                    break;
                }
            }
            
            // If no pattern matched, try to extract what we can
            if (!matched && line.length > 10) {
                const parts = line.replace(/^-\s*/, '').split(/[,\(\)]/);
                if (parts.length >= 2) {
                    const eduEntry = {
                        degree: parts[0].trim(),
                        institution: parts[1].trim(),
                        years: parts[2] ? parts[2].trim() : 'Not specified',
                    };
                    candidate.education?.push(eduEntry);
                    console.log('Added education entry (fallback):', eduEntry);
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
