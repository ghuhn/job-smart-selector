
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

        for (const line of lines) {
            if (line.startsWith('**') && line.endsWith('**')) {
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
                    console.log('Processing education line:', content);
                    // Handle various education formats
                    const eduMatch = content.match(/-?\s*(.*?),\s*(.*?)\s*\(([^)]+)\)/);
                    if (eduMatch) {
                        const eduEntry = {
                            degree: eduMatch[1].trim(),
                            institution: eduMatch[2].trim(),
                            years: eduMatch[3].trim(),
                        };
                        candidate.education?.push(eduEntry);
                        console.log('Added education entry:', eduEntry);
                    } else {
                        // Try alternative format: Degree from Institution (Year)
                        const altMatch = content.match(/-?\s*(.*?)\s+from\s+(.*?)\s*\(([^)]+)\)/i);
                        if (altMatch) {
                            const eduEntry = {
                                degree: altMatch[1].trim(),
                                institution: altMatch[2].trim(),
                                years: altMatch[3].trim(),
                            };
                            candidate.education?.push(eduEntry);
                            console.log('Added education entry (alt format):', eduEntry);
                        } else {
                            // Try simple format: just extract what we can
                            if (content.includes('-') || content.length > 10) {
                                const parts = content.replace(/^-\s*/, '').split(/[,()]/);
                                if (parts.length >= 2) {
                                    const eduEntry = {
                                        degree: parts[0].trim(),
                                        institution: parts[1].trim(),
                                        years: parts[2] ? parts[2].trim() : 'Not specified',
                                    };
                                    candidate.education?.push(eduEntry);
                                    console.log('Added education entry (simple format):', eduEntry);
                                }
                            }
                        }
                    }
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
                    console.log('Processing languages section with content:', content);
                    if (candidate.languages) {
                        candidate.languages = LanguageUtils.parseLanguages(content);
                        console.log('Parsed languages result:', candidate.languages);
                    }
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

        console.log('=== FINAL PARSED CANDIDATE ===');
        console.log(candidate);
        return candidate;
    }
}
