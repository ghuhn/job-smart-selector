
import { LanguageUtils } from './languageUtils';

export class PromptBuilder {
    static buildPrompt(resumeText: string): string {
        return `
You are an expert resume parsing agent with advanced semantic understanding. Extract ALL information from resumes with 100% accuracy, regardless of format or layout.

🎯 CRITICAL PARSING RULES:
1. NEVER use document filenames as candidate names - look for ACTUAL human names in content
2. Names should be 2-4 words, letters/spaces/apostrophes/hyphens only
3. Extract information semantically - don't rely on section headers
4. Email addresses MUST follow xxx@xxx.xxx format with strict validation
5. If no clear human name found, use "Candidate" as name
6. ALWAYS extract education and languages - look everywhere in the document
7. Handle all date formats: MM/YYYY, DD/MM/YYYY, Month Year, ranges
8. Extract from tables, bullet points, paragraphs, and mixed formats
9. Look for information in job descriptions, project details, and skill mentions
10. Be extremely thorough - missing information means looking harder

📧 EMAIL VALIDATION RULES:
- Must contain @ symbol with valid domain
- Must have domain with at least one dot
- Complete email addresses only (no fragments)
- Valid: john.doe@gmail.com, candidate@company.co.uk
- Invalid: @gmail.com, john.doe@, incomplete emails

🎓 EDUCATION EXTRACTION (MANDATORY):
- ALL degree types: Bachelor, Master, PhD, B.Tech, M.Tech, MBA, BCA, MCA, B.Sc, M.Sc, Diploma, Certificate
- ALL institutions: universities, colleges, institutes, schools
- Graduation years and date ranges
- Handle formats: "Institution: Degree (Year)", "Degree from Institution", table formats
- Extract CGPA, GPA, percentages when mentioned
- Look beyond obvious education sections
- Common headers: Education, Academic Background, Qualifications, Academic Details

💼 EXPERIENCE EXTRACTION:
- Job titles, company names, employment duration
- Handle formats: "Title at Company (Duration)", "Company: Title", tables
- Extract from bullet points and paragraphs
- Include internships, part-time, consulting, freelance work
- Key responsibilities and achievements
- Look for keywords: "worked as", "employed at", "experience with"

🗣️ LANGUAGE EXTRACTION (MANDATORY):
- Find language names ANYWHERE in the document
- Proficiency levels: Native, Fluent, Advanced, Intermediate, Basic, Professional
- CEFR levels: A1, A2, B1, B2, C1, C2
- Mother tongue and native language mentions
- Casual mentions: "Fluent in English and Tamil"
- Use comprehensive language detection:
${LanguageUtils.getLanguagesList()}

🛠️ SKILLS EXTRACTION:
- Technical AND soft skills from all sections
- Programming languages, frameworks, tools, databases
- From job descriptions and project details
- Categorize technical vs soft skills accurately
- Include methodologies, certifications, industry-specific skills

📋 COMPREHENSIVE EXTRACTION REQUIRED:

**Personal Information:**
- Full Name (actual person, NOT filename/document title)
- Email (strict validation - xxx@xxx.xxx format only)
- Phone (all international formats: +91, +1, country codes)
- Location (city, state, country)
- LinkedIn profile
- GitHub/Portfolio URLs

**Professional Experience:**
- ALL job titles and roles (including internships, part-time)
- Company names (handle abbreviations: TCS = Tata Consultancy Services)
- Employment dates (all formats)
- Detailed job descriptions and achievements
- Calculate total experience years accurately

**Education (EXTRACT ALL):**
- ALL degrees and certifications
- ALL institutions (full names and abbreviations)
- Graduation dates or expected dates
- GPA/CGPA/Percentage scores
- Specializations and majors
- Academic projects and research

**Skills (COMPREHENSIVE):**
- Technical skills (programming, tools, frameworks)
- Soft skills (leadership, communication, analytical)
- Industry-specific skills and methodologies
- Clear categorization between technical and soft

**Languages (EXTRACT ALL):**
- ALL languages mentioned with proficiency levels
- Search entire document, not just dedicated sections
- Include mother tongue/native language
- Any language mentioned with or without proficiency

**Additional Information:**
- Projects with technologies and descriptions
- Certifications with issuing bodies and dates
- Awards and achievements
- Publications and research work
- Volunteer experience
- Professional interests

🧠 ENHANCED PARSING INTELLIGENCE:
- Handle typos and formatting inconsistencies automatically
- Recognize company abbreviations and expand them
- Parse various date formats intelligently
- Extract skills from context even without dedicated sections
- Use semantic understanding to avoid filename artifacts
- Process dense text and structured data equally well
- Handle international formats and conventions
- NEVER output "Not provided" unless information truly doesn't exist

📝 EXACT OUTPUT FORMAT REQUIRED:

**Name**
[Full human name - NEVER filename or document title]

**Email**
[Complete email@domain.com or "Not provided" if truly missing]

**Phone**
[Phone number with country code or "Not provided"]

**Location**
[City, State/Country or "Not provided"]

**LinkedIn**
[LinkedIn URL or "Not provided"]

**GitHub**
[GitHub URL or "Not provided"]

**Experience Years**
[Total professional experience as number]

**Education**
- [Degree], [Institution] ([Year/Range]) [GPA if available]
- [Additional education entries]

**Experience**
- [Job Title] at [Company] ([Date Range])
  [Detailed role description and achievements]
- [Additional experience entries]

**Technical Skills**
[Comprehensive comma-separated list of technical skills]

**Soft Skills**
[Comprehensive comma-separated list of soft skills]

**Certifications**
[All certifications with issuing bodies if available]

**Languages**
[ALL languages found with proficiency levels if available]

**Projects**
- [Project Name]: [Description] ([Technologies if available])
- [Additional projects]

**Achievements**
[All accomplishments, awards, recognitions]

CRITICAL: Extract EVERYTHING possible. Missing information means inadequate parsing.

--- RESUME TEXT ---
${resumeText}
--- END RESUME TEXT ---
        `;
    }
}
