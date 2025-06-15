
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
10. Handle various date formats: MM/YYYY, DD/MM/YYYY, Month Year, Year-Year ranges
11. Look for information in tables, bullet points, and continuous text paragraphs

🔍 RESUME FORMATS TO RECOGNIZE:
- Chronological (most recent experience first)
- Functional (skills-based with minimal work history)
- Combination/Hybrid (skills + chronological)
- Academic CV format
- Creative/Portfolio style
- ATS-optimized format
- International formats (European CV, etc.)
- Table-based layouts
- Dense paragraph formats
- Mixed formatting with headers and bullet points

📧 EMAIL EXTRACTION RULES:
- Must contain @ symbol
- Must have valid domain with at least one dot
- Must be a complete email address (no partial matches)
- Examples of VALID emails: john.doe@gmail.com, candidate@company.co.uk
- Examples of INVALID: @gmail.com, john.doe@, email

🎓 EDUCATION EXTRACTION RULES:
- Look for degree names (Bachelor, Master, PhD, B.Tech, M.Sc, M.Tech, MBA, BCA, MCA, etc.)
- Look for institution names (universities, colleges, schools, institutes)
- Look for graduation years or date ranges
- Handle formats like "Institution: Degree (Year)" or "Degree from Institution"
- Common section names: Education, Academic Background, Qualifications, Degrees, Academic Details
- Extract even if formatting is inconsistent or in table format
- Look for CGPA, GPA, percentage scores
- Handle abbreviated institution names

💼 EXPERIENCE EXTRACTION RULES:
- Look for job titles, company names, and duration
- Handle various formats: "Title at Company (Duration)", "Company: Title", "Title | Company"
- Extract from bullet points, paragraphs, or table formats
- Look for keywords like "worked as", "employed at", "position of"
- Handle internships, part-time roles, and consulting work
- Extract key responsibilities and achievements

🗣️ LANGUAGE EXTRACTION RULES:
- Look for language names ANYWHERE in the resume, not just in dedicated sections
- Common section names: Languages, Language Skills, Linguistic Skills, Known Languages
- Look for proficiency levels: Native, Fluent, Advanced, Intermediate, Basic, Beginner, Professional
- Look for CEFR levels: A1, A2, B1, B2, C1, C2
- Extract even if mentioned casually (e.g., "Fluent in English and Tamil")
- Handle mother tongue, native language mentions
- Use this comprehensive list to detect languages:
${LanguageUtils.getLanguagesList()}

🛠️ SKILLS EXTRACTION RULES:
- Look in dedicated skills sections AND within job descriptions
- Categorize into technical (programming languages, tools, frameworks) and soft skills
- Handle comma-separated lists, bullet points, and paragraph mentions
- Look for programming languages, databases, frameworks, tools, methodologies
- Extract industry-specific skills and certifications
- Handle skill proficiency levels if mentioned

📋 INFORMATION TO EXTRACT:

**Personal Information:**
- Full Name (actual person's name, NOT filename)
- Email address (strict xxx@xxx.xxx validation)
- Phone number (including international formats like +91, country codes)
- Location (city, state/country)
- LinkedIn profile URL
- GitHub/Portfolio URLs

**Professional Experience:**
- Job titles/roles (including internships, part-time work)
- Company names (handle abbreviations and full names)
- Employment dates (handle various date formats)
- Job descriptions and achievements
- Calculate total years of experience

**Education (MANDATORY - always extract):**
- Degrees and certifications
- Institutions/Universities (full names and abbreviations)
- Graduation dates or expected graduation
- GPA/CGPA/Percentage (if mentioned)
- Specializations or majors

**Skills:**
- Technical skills (programming languages, tools, frameworks, databases)
- Soft skills (leadership, communication, analytical, etc.)
- Industry-specific skills
- Methodologies and frameworks
- Categorize into technical vs soft skills

**Languages (MANDATORY - always extract):**
- Language names with proficiency levels
- Look everywhere in the resume, not just dedicated sections
- Include any language mentioned with or without proficiency
- Handle mother tongue/native language mentions

**Additional Sections:**
- Projects (personal/professional with technologies used)
- Certifications and licenses (with issuing bodies and dates)
- Awards and achievements
- Publications and research
- Volunteer work and extracurricular activities
- Interests and hobbies (if mentioned)

🧠 PARSING INTELLIGENCE:
- Handle typos and formatting inconsistencies
- Recognize abbreviated company names (e.g., "TCS" = Tata Consultancy Services)
- Parse various date formats (MM/YYYY, Month Year, DD-MM-YYYY, etc.)
- Extract skills from job descriptions even if no dedicated skills section
- Identify technical skills vs soft skills automatically
- Handle international phone number formats (+91, +1, etc.)
- Recognize common section synonyms (Experience/Work History, Skills/Competencies)
- Use semantic understanding to avoid filename artifacts
- ALWAYS look for education and languages, even if not in obvious sections
- Handle table-based layouts and extract data from structured formats
- Process dense paragraph text and extract relevant information
- Handle mixed formatting (headers, bullet points, continuous text)

📝 OUTPUT FORMAT:
Provide ONLY the extracted information in this exact format:

**Name**
[Actual person's full name - NOT filename, NOT document title]

**Email**
[email@domain.com - must be valid format or "Not provided"]

**Phone**
[phone number with country code if available or "Not provided"]

**Location**
[City, State/Country or "Not provided"]

**LinkedIn**
[LinkedIn URL or "Not provided"]

**GitHub**
[GitHub URL or "Not provided"]

**Experience Years**
[Total years of professional experience as a number]

**Education**
- [Degree], [Institution] ([Year or Year Range]) [CGPA/GPA if available]
- [Additional degrees if any]

**Experience**
- [Job Title] at [Company] ([Date Range])
  [Brief description of role and key achievements]
- [Additional positions including internships]

**Technical Skills**
[Comma-separated list of technical skills, tools, programming languages, frameworks]

**Soft Skills**
[Comma-separated list of soft skills and competencies]

**Certifications**
[Comma-separated list of certifications and licenses with issuing bodies if available]

**Languages**
[All languages found in the resume, with proficiency if available]

**Projects**
- [Project Name]: [Brief description] ([Technologies used if available])
- [Additional projects]

**Achievements**
[Notable accomplishments, awards, recognitions, or key achievements]

--- RESUME TEXT ---
${resumeText}
--- END RESUME TEXT ---
        `;
    }
}
