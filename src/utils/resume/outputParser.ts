
import type { ParsedCandidate, EducationEntry, ExperienceEntry, ProjectEntry } from './types';
import { NameUtils } from './nameUtils';
import { EmailUtils } from './emailUtils';
import { LanguageUtils } from './languageUtils';

export class OutputParser {
    static parseLlmOutput(llmOutput: string): ParsedCandidate {
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

        for (const line of lines) {
            if (line.startsWith('**')) {
                currentSection = line.replace(/\*\*/g, '').trim();
                sectionKey = currentSection.toLowerCase().replace(' ', '_');
                continue;
            }

            const content = line.trim();
            if (!content) continue;

            switch (sectionKey) {
                case 'name':
                    candidate.name = NameUtils.cleanName(content);
                    break;
                case 'email':
                    candidate.email = EmailUtils.validateEmail(content);
                    break;
                case 'phone':
                    candidate.phone = content !== "Not provided" ? content : "Not provided";
                    break;
                case 'location':
                    candidate.location = content !== "Not provided" ? content : "Not provided";
                    break;
                case 'linkedin':
                    candidate.linkedIn = content !== "Not provided" ? content : "Not provided";
                    break;
                case 'github':
                    candidate.github = content !== "Not provided" ? content : "Not provided";
                    break;
                case 'experience_years':
                    candidate.experienceYears = parseInt(content) || 0;
                    break;
                case 'education':
                    const eduMatch = content.match(/-\s*(.*),\s*(.*)\s*\((.*)\)/);
                    if (eduMatch) {
                        candidate.education?.push({
                            degree: eduMatch[1].trim(),
                            institution: eduMatch[2].trim(),
                            years: eduMatch[3].trim(),
                        });
                    }
                    break;
                case 'experience':
                    const expMatch = content.match(/-\s*(.*)\s*at\s*(.*)\s*\((.*)\)/);
                    if (expMatch) {
                        candidate.experience?.push({
                            role: expMatch[1].trim(),
                            company: expMatch[2].trim(),
                            duration: expMatch[3].trim(),
                            description: '',
                        });
                    } else if (candidate.experience && candidate.experience.length > 0 && !content.startsWith('-')) {
                        const lastExperience = candidate.experience[candidate.experience.length - 1];
                        lastExperience.description = (lastExperience.description + ' ' + content).trim();
                    }
                    break;
                case 'technical_skills':
                    if (candidate.technicalSkills) {
                        candidate.technicalSkills = content.split(',').map(s => s.trim()).filter(Boolean);
                        // Also add to general skills array
                        candidate.skills = [...(candidate.skills || []), ...candidate.technicalSkills];
                    }
                    break;
                case 'soft_skills':
                    if (candidate.softSkills) {
                        candidate.softSkills = content.split(',').map(s => s.trim()).filter(Boolean);
                    }
                    break;
                case 'certifications':
                    if (candidate.certifications) {
                        candidate.certifications = content.split(',').map(s => s.trim()).filter(Boolean);
                    }
                    break;
                case 'languages':
                    if (candidate.languages) {
                        candidate.languages = LanguageUtils.parseLanguages(content);
                    }
                    break;
                case 'projects':
                    const projectMatch = content.match(/-\s*(.*?):\s*(.*?)\s*\((.*?)\)/);
                    if (projectMatch) {
                        candidate.projects?.push({
                            name: projectMatch[1].trim(),
                            description: projectMatch[2].trim(),
                            technologies: projectMatch[3].split(',').map(t => t.trim())
                        });
                    }
                    break;
                case 'achievements':
                    if (content.startsWith('-') || content.startsWith('•')) {
                        candidate.achievements?.push(content.replace(/^[-•]\s*/, '').trim());
                    } else {
                        candidate.achievements?.push(content);
                    }
                    break;
            }
        }

        return candidate;
    }
}
