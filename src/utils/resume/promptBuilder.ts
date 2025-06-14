
import { LanguageUtils } from './languageUtils';

export class PromptBuilder {
    static buildPrompt(resumeText: string): string {
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
8. ALWAYS extract education information - look for degrees, institutions, and years
9. ALWAYS extract languages - look for language names mentioned anywhere in the resume

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

🎓 EDUCATION EXTRACTION RULES:
- Look for degree names (Bachelor, Master, PhD, B.Tech, M.Sc, etc.)
- Look for institution names (universities, colleges, schools)
- Look for graduation years or date ranges
- Common section names: Education, Academic Background, Qualifications, Degrees
- Extract even if formatting is inconsistent

🗣️ LANGUAGE EXTRACTION RULES:
- Look for language names ANYWHERE in the resume, not just in dedicated sections
- Common section names: Languages, Language Skills, Linguistic Skills
- Look for proficiency levels: Native, Fluent, Advanced, Intermediate, Basic, Beginner
- Look for CEFR levels: A1, A2, B1, B2, C1, C2
- Extract even if mentioned casually (e.g., "Fluent in English and Tamil")
- Use this comprehensive list to detect languages:
${LanguageUtils.getLanguagesList()}

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

**Education (MANDATORY - always extract):**
- Degrees and certifications
- Institutions/Universities
- Graduation dates
- GPA (if mentioned)

**Skills:**
- Technical skills (programming languages, tools, frameworks)
- Soft skills (leadership, communication, etc.)
- Industry-specific skills
- Categorize into technical vs soft skills

**Languages (MANDATORY - always extract):**
- Language names with proficiency levels
- Look everywhere in the resume, not just dedicated sections
- Include any language mentioned with or without proficiency

**Additional Sections:**
- Projects (personal/professional)
- Certifications and licenses
- Awards and achievements
- Publications
- Volunteer work

🧠 PARSING INTELLIGENCE:
- Handle typos and formatting inconsistencies
- Recognize abbreviated company names (e.g., "MSFT" = Microsoft)
- Parse various date formats (MM/YYYY, Month Year, etc.)
- Extract skills from job descriptions even if no dedicated skills section
- Identify technical skills vs soft skills automatically
- Handle international phone number formats
- Recognize common section synonyms (Experience/Work History, Skills/Competencies)
- Use semantic understanding to avoid filename artifacts
- ALWAYS look for education and languages, even if not in obvious sections

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
[All languages found in the resume, with proficiency if available]

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
}
