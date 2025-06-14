
import { Candidate, EducationEntry, ExperienceEntry } from './multiAgentSystem';

function findSection(text: string, keywords: string[], endKeywords: string[]): string {
    const textLower = text.toLowerCase();
    let startIndex = -1;
    let keywordFound = '';

    for (const keyword of keywords) {
        const match = textLower.indexOf(keyword.toLowerCase());
        if (match !== -1) {
            // Check if it's a heading (surrounded by newlines or at the start)
            const pre = text.substring(Math.max(0, match - 2), match);
            const post = text.substring(match + keyword.length, match + keyword.length + 2);
            if ((pre.trim() === '' || pre.endsWith('\n')) && (post.trim() === '' || post.startsWith('\n'))) {
               startIndex = match + keyword.length;
               keywordFound = keyword;
               break;
            }
        }
    }

    if (startIndex === -1) return "";

    let endIndex = text.length;
    let closestEndIndex = text.length;

    for (const endKeyword of endKeywords) {
        if (keywordFound.toLowerCase() === endKeyword.toLowerCase()) continue;
        let searchIndex = startIndex;
        
        while(true){
            const nextMatchIndex = textLower.indexOf(endKeyword.toLowerCase(), searchIndex);
            if(nextMatchIndex === -1) break;

            const pre = text.substring(Math.max(0, nextMatchIndex - 2), nextMatchIndex);
            const post = text.substring(nextMatchIndex + endKeyword.length, nextMatchIndex + endKeyword.length + 2);
            if ((pre.trim() === '' || pre.endsWith('\n')) && (post.trim() === '' || post.startsWith('\n'))) {
                if (nextMatchIndex < closestEndIndex) {
                    closestEndIndex = nextMatchIndex;
                }
                break; 
            }
            searchIndex = nextMatchIndex + 1;
        }
    }

    endIndex = closestEndIndex;
    return text.substring(startIndex, endIndex).trim();
}

function calculateExperienceYears(experience: ExperienceEntry[]): number {
    let totalMonths = 0;
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

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

export class ResumeParser {
    static parse(resumeContent: string, fileName: string): Partial<Candidate> {
        const fullText = resumeContent.replace(/•/g, '\n-'); // Normalize bullets
        const lines = fullText.split(/[\n\r]+/).map(l => l.trim());

        const education = this.extractEducation(fullText);
        const experience = this.extractExperience(fullText);
        
        const candidate: Partial<Candidate> = {
            name: this.extractName(lines, fileName),
            email: this.extractEmail(fullText),
            phone: this.extractPhone(fullText),
            location: this.extractLocation(lines),
            skills: this.extractSkills(fullText),
            languages: this.extractLanguages(fullText),
            education,
            experience,
            experienceYears: calculateExperienceYears(experience),
            summary: findSection(fullText, ['summary', 'objective', 'professional summary'], ['experience', 'education', 'skills']),
        };

        return candidate;
    }

    private static extractName(lines: string[], filename: string): string {
        // Strategy 1: First non-contact line
        for (const line of lines.slice(0, 5)) {
            if (line.length > 5 && line.length < 30 && !line.match(/@|\d{5,}|(resume|cv|vitae)/i) && line.match(/^[A-Z][a-z]+ [A-Z][a-z]+(?: [A-Z][a-z]+)?$/)) {
                return line;
            }
        }
        
        // Strategy 2: From filename
        const fromFile = filename.replace(/\.(pdf|doc|docx)$/i, '').replace(/[-_]/g, ' ').replace(/(resume|cv)/i, '').trim();
        if (fromFile.split(' ').length >= 2) {
             return fromFile.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
        }

        return "Name Not Found";
    }

    private static extractEmail(text: string): string {
        const match = text.match(/[\w\.-]+@[\w\.-]+\.\w+/);
        return match ? match[0] : "Not provided";
    }

    private static extractPhone(text: string): string {
        const match = text.match(/(?:(?:\+91|0)?[ -]?)?\d{10}\b|\+1[ -]?\(?\d{3}\)?[ -]?\d{3}[ -]?\d{4}/);
        return match ? match[0].replace(/[^\d+]/g, '') : "Not provided";
    }

    private static extractLocation(lines: string[]): string {
        for (const line of lines) {
             const match = line.match(/\b([A-Za-z]+,\s*(?:[A-Z]{2}|[A-Za-z]+)(?:,\s*[A-Za-z]+)?)\b/);
             if(match && match[0].length < 40) return match[0];
        }
        return "Not provided";
    }

    private static extractEducation(text: string): EducationEntry[] {
        const sectionKeywords = ['experience', 'skills', 'projects', 'languages', 'work history'];
        const section = findSection(text, ['education', 'academic'], sectionKeywords);
        if (!section) return [];

        const entries: EducationEntry[] = [];
        const blocks = section.split(/\n\s*\n/); // Split by blank lines

        for (const block of blocks) {
            if(block.length < 10) continue;
            
            const lines = block.split('\n');
            const degreeLine = lines[0]; // Assume degree is first line of block
            const institutionLine = lines.length > 1 ? lines[1] : ''; // Assume institution is second
            
            const yearsMatch = block.match(/\b(\d{4})\s*–\s*(\d{4}|Present|Current)\b/i);
            
            entries.push({
                degree: degreeLine.replace(/,$/, '').trim(),
                institution: institutionLine.split(',')[0].trim(),
                years: yearsMatch ? yearsMatch[0] : "Not specified"
            });
        }

        return entries.filter(e => e.degree && e.institution);
    }

    private static extractExperience(text: string): ExperienceEntry[] {
        const sectionKeywords = ['education', 'skills', 'projects', 'languages', 'certifications'];
        const section = findSection(text, ['experience', 'work history', 'professional background'], sectionKeywords);
        if (!section) return [];
        
        const entries: ExperienceEntry[] = [];
        const blocks = section.split(/(?=\b[A-Z][\w\s-]+\b\s*\n[A-Z][\w\s,]+)/); // Split before a likely new Role/Company

        for (const block of blocks) {
            if(block.trim().length < 20) continue;

            const lines = block.trim().split('\n');
            const role = lines[0].trim();
            const company = lines.length > 1 ? lines[1].split('|')[0].trim() : 'N/A';
            const durationMatch = block.match(/\b((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|present|current)[\w\s\d-]+)\b/i);
            const description = lines.slice(2).join('\n').trim();

            entries.push({
                role,
                company,
                duration: durationMatch ? durationMatch[0] : 'N/A',
                description
            });
        }

        return entries.filter(e => e.role && e.company);
    }

    private static extractSkills(text: string): string[] {
        const sectionKeywords = ['experience', 'education', 'projects', 'languages'];
        const section = findSection(text, ['skills', 'technical skills', 'technologies'], sectionKeywords);
        if (!section) return [];
        
        const skills = section.split(/[\n,;•-]/).map(s => s.trim()).filter(s => s.length > 1 && s.length < 25);
        return [...new Set(skills)];
    }

    private static extractLanguages(text: string): string[] {
        const sectionKeywords = ['experience', 'education', 'projects', 'skills'];
        const section = findSection(text, ['languages'], sectionKeywords);
        if (!section) return [];

        const languages = section.split(/[\n,;]/).map(s => s.replace(/\(.*\)/, '').trim()).filter(s => s.length > 2 && s.length < 20);
        return [...new Set(languages)];
    }
}
