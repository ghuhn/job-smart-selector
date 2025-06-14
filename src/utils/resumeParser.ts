
import type { Candidate } from '@/types/candidates';
import { geminiAPI } from './geminiApi';

export class ResumeParser {
    static async parse(resumeContent: string): Promise<Partial<Candidate>> {
        const prompt = this.buildPrompt(resumeContent);
        
        console.log("--- Sending prompt to LLM for resume parsing ---");
        const llmOutput = await geminiAPI.generateContent(prompt);
        console.log("--- Received LLM response ---", llmOutput);
        
        return this.parseLlmOutput(llmOutput);
    }

    private static buildPrompt(resumeText: string): string {
        return `
You are an expert resume parsing agent that understands all major resume formats used by professionals worldwide. You must extract information from resumes regardless of their format, layout, or structure.

🎯 CRITICAL PARSING RULES:
1. NEVER use document filenames, headers, or footers as candidate names
2. Look for actual human names in the content - typically at the top in larger font or bold
3. Names should be 2-4 words maximum and contain only letters, spaces, apostrophes, or hyphens
4. If you see patterns like "John_Doe_Resume.pdf", "Resume_2024_Final", "resume.pdf" - these are NOT names
5. Extract information semantically, not based on section headers
6. Email addresses MUST follow xxx@xxx.xxx format - be very strict about this
7. If no clear human name is found, use "Candidate" as the name

🔍 RESUME FORMATS TO RECOGNIZE:
- Chronological (most recent experience first)
- Functional (skills-based with minimal work history)
- Combination/Hybrid (skills + chronological)
- Academic CV format
- Creative/Portfolio style
- ATS-optimized format
- International formats (European CV, etc.)

📧 EMAIL EXTRACTION RULES:
- Must contain @ symbol
- Must have valid domain with at least one dot
- Must be a complete email address (no partial matches)
- Examples of VALID emails: john.doe@gmail.com, candidate@company.co.uk
- Examples of INVALID: @gmail.com, john.doe@, email

🗣️ LANGUAGE DETECTION:
Use this comprehensive list to detect languages mentioned in resumes:
English, Spanish, French, German, Italian, Portuguese, Russian, Chinese, Mandarin, Cantonese, Japanese, Korean, Arabic, Hindi, Bengali, Urdu, Telugu, Tamil, Marathi, Gujarati, Punjabi, Thai, Vietnamese, Indonesian, Malay, Tagalog, Dutch, Swedish, Norwegian, Danish, Finnish, Polish, Czech, Hungarian, Romanian, Bulgarian, Croatian, Serbian, Greek, Turkish, Hebrew, Persian, Farsi, Swahili, Amharic, Yoruba, Igbo, Hausa, Zulu, Afrikaans, Sinhala, Nepali, Burmese, Khmer, Lao, Mongolian, Kazakh, Uzbek, Kyrgyz, Tajik, Georgian, Armenian, Azerbaijani, Estonian, Latvian, Lithuanian, Slovenian, Slovak, Maltese, Irish, Welsh, Scottish Gaelic, Basque, Catalan, Galician, Albanian, Macedonian, Bosnian, Montenegrin, Icelandic, Luxembourgish, Romansh

For each detected language, look for proficiency indicators like:
- Native, Fluent, Advanced, Intermediate, Basic, Beginner
- A1, A2, B1, B2, C1, C2 (CEFR levels)
- Conversational, Professional, Business level

📋 INFORMATION TO EXTRACT:

**Personal Information:**
- Full Name (actual person's name, NOT filename)
- Email address (strict xxx@xxx.xxx validation)
- Phone number (including international formats)
- Location (city, state/country)
- LinkedIn profile URL
- GitHub/Portfolio URLs

**Professional Experience:**
- Job titles/roles
- Company names
- Employment dates (handle various date formats)
- Job descriptions and achievements
- Calculate total years of experience

**Education:**
- Degrees and certifications
- Institutions/Universities
- Graduation dates
- GPA (if mentioned)

**Skills:**
- Technical skills (programming languages, tools, frameworks)
- Soft skills (leadership, communication, etc.)
- Industry-specific skills
- Categorize into technical vs soft skills

**Additional Sections:**
- Projects (personal/professional)
- Certifications and licenses
- Awards and achievements
- Publications
- Volunteer work
- Languages with proficiency levels

🧠 PARSING INTELLIGENCE:
- Handle typos and formatting inconsistencies
- Recognize abbreviated company names (e.g., "MSFT" = Microsoft)
- Parse various date formats (MM/YYYY, Month Year, etc.)
- Extract skills from job descriptions even if no dedicated skills section
- Identify technical skills vs soft skills automatically
- Handle international phone number formats
- Recognize common section synonyms (Experience/Work History, Skills/Competencies)
- Use semantic understanding to avoid filename artifacts

📝 OUTPUT FORMAT:
Provide ONLY the extracted information in this exact format:

**Name**
[Actual person's full name - NOT filename, NOT document title]

**Email**
[email@domain.com - must be valid format or "Not provided"]

**Phone**
[phone number or "Not provided"]

**Location**
[City, State/Country or "Not provided"]

**LinkedIn**
[LinkedIn URL or "Not provided"]

**GitHub**
[GitHub URL or "Not provided"]

**Experience Years**
[Total years of professional experience as a number]

**Education**
- [Degree], [Institution] ([Year or Year Range])
- [Additional degrees if any]

**Experience**
- [Job Title] at [Company] ([Date Range])
  [Brief description of role and key achievements]
- [Additional positions]

**Technical Skills**
[Comma-separated list of technical skills, tools, programming languages]

**Soft Skills**
[Comma-separated list of soft skills and competencies]

**Certifications**
[Comma-separated list of certifications and licenses]

**Languages**
[Language with proficiency level, Language with proficiency level]

**Projects**
- [Project Name]: [Brief description] ([Technologies used])
- [Additional projects]

**Achievements**
[Notable accomplishments, awards, or recognitions]

--- RESUME TEXT ---
${resumeText}
--- END RESUME TEXT ---
        `;
    }

    private static cleanName(rawName: string): string {
        if (!rawName) return "Not provided";
        
        // Remove common resume filename patterns more aggressively
        let cleanedName = rawName
            .replace(/\.pdf$/i, '')
            .replace(/\.docx?$/i, '')
            .replace(/\.txt$/i, '')
            .replace(/resume/gi, '')
            .replace(/cv/gi, '')
            .replace(/_/g, ' ')
            .replace(/-/g, ' ')
            .replace(/\d+/g, '') // Remove all numbers
            .replace(/[^\w\s'-]/g, '') // Remove special characters except apostrophes and hyphens
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .trim();
        
        // Additional cleaning for common filename patterns
        cleanedName = cleanedName
            .replace(/\b(final|updated|new|latest|version|v\d+)\b/gi, '')
            .replace(/\b(doc|document)\b/gi, '')
            .replace(/\b\d{4}\b/g, '') // Remove years
            .replace(/\s+/g, ' ')
            .trim();
        
        // Capitalize each word properly
        cleanedName = cleanedName
            .split(' ')
            .filter(word => word.length > 0)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
        
        // Validate it looks like a real name (2-4 words, reasonable length)
        const words = cleanedName.split(' ');
        if (words.length < 1 || words.length > 4 || cleanedName.length < 2 || cleanedName.length > 50) {
            return "Candidate";
        }
        
        // Check if it still contains common filename indicators
        if (/\b(resume|cv|document|file)\b/i.test(cleanedName)) {
            return "Candidate";
        }
        
        return cleanedName;
    }

    private static validateEmail(email: string): string {
        if (!email || email === "Not provided") return "Not provided";
        
        // Strict email validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        
        if (emailRegex.test(email.trim())) {
            return email.trim();
        }
        
        return "Not provided";
    }

    private static parseLanguages(languageText: string): string[] {
        if (!languageText || languageText === "Not provided") return [];
        
        const commonLanguages = [
            'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Chinese', 
            'Mandarin', 'Cantonese', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Bengali', 'Urdu', 
            'Telugu', 'Tamil', 'Marathi', 'Gujarati', 'Punjabi', 'Thai', 'Vietnamese', 'Indonesian', 
            'Malay', 'Tagalog', 'Dutch', 'Swedish', 'Norwegian', 'Danish', 'Finnish', 'Polish', 
            'Czech', 'Hungarian', 'Romanian', 'Bulgarian', 'Croatian', 'Serbian', 'Greek', 'Turkish', 
            'Hebrew', 'Persian', 'Farsi', 'Swahili', 'Amharic', 'Yoruba', 'Igbo', 'Hausa', 'Zulu', 
            'Afrikaans', 'Sinhala', 'Nepali', 'Burmese', 'Khmer', 'Lao', 'Mongolian', 'Kazakh', 
            'Uzbek', 'Kyrgyz', 'Tajik', 'Georgian', 'Armenian', 'Azerbaijani', 'Estonian', 'Latvian', 
            'Lithuanian', 'Slovenian', 'Slovak', 'Maltese', 'Irish', 'Welsh', 'Scottish Gaelic', 
            'Basque', 'Catalan', 'Galician', 'Albanian', 'Macedonian', 'Bosnian', 'Montenegrin', 
            'Icelandic', 'Luxembourgish', 'Romansh'
        ];
        
        const proficiencyLevels = [
            'Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic', 'Beginner', 'Conversational', 
            'Professional', 'Business', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'
        ];
        
        const languages: string[] = [];
        const parts = languageText.split(',');
        
        for (const part of parts) {
            const trimmedPart = part.trim();
            
            // Check if this part contains a language
            for (const language of commonLanguages) {
                if (new RegExp(`\\b${language}\\b`, 'i').test(trimmedPart)) {
                    // Extract proficiency if present
                    let proficiency = '';
                    for (const level of proficiencyLevels) {
                        if (new RegExp(`\\b${level}\\b`, 'i').test(trimmedPart)) {
                            proficiency = ` (${level})`;
                            break;
                        }
                    }
                    
                    const languageEntry = `${language}${proficiency}`;
                    if (!languages.includes(languageEntry)) {
                        languages.push(languageEntry);
                    }
                    break;
                }
            }
        }
        
        return languages;
    }

    private static parseLlmOutput(llmOutput: string): Partial<Candidate> {
        const candidate: Partial<Candidate> = {
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
                    candidate.name = this.cleanName(content);
                    break;
                case 'email':
                    candidate.email = this.validateEmail(content);
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
                        candidate.languages = this.parseLanguages(content);
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
