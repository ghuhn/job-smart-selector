
import { Candidate } from './multiAgentSystem';
// NOTE: I am assuming 'geminiApi.ts' exports a function 'runGemini' that takes a prompt string
// and returns the LLM's response as a string. If the function has a different name or signature,
// this will need to be adjusted.
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
You are a highly intelligent resume understanding agent. You will be given the raw text extracted from a resume — this text may be unstructured, have inconsistent formatting, or use different section headers.

Your task is to carefully read through the resume and extract key candidate information using semantic understanding, not formatting or layout. You should rely on the meaning and context of the words, not the structure.

🔍 What You Must Extract (in this order):
Candidate Name
Email Address
Phone Number
Location
Education History
Work Experience
Skills
Languages Known

🧠 Parsing Instructions
- Do not rely on strict headings like “Education” or “Experience”.
- Instead, identify each section based on the content, such as:
  - Education: mentions of degrees, universities, and years
  - Experience: mentions of roles, companies, and timelines
  - Skills: comma-separated or bulleted lists of capabilities
- If dates or headers are missing, infer from phrasing and known patterns.
- Never hallucinate information — only include details that can be reasonably inferred from the resume text.
- Use your best judgment to handle typos, unconventional layouts, and missing punctuation.

📝 Output Format (Text-Only, No JSON)
Use this clear format for your response:

**Name**
[Full Name]

**Email**
[email@example.com]

**Phone Number**
[+91-XXXXXX]

**Location**
[City, Country]

**Education**
- [Degree], [Institution] ([Years])
- ...

**Experience**
- [Role] at [Company] ([Years])
  [One-sentence summary if available]
- ...

**Skills**
[List of skills]

**Languages Known**
[List of languages]

--- RESUME TEXT ---
${resumeText}
--- END RESUME TEXT ---
        `;
    }

    private static parseLlmOutput(llmOutput: string): Partial<Candidate> {
        const candidate: Partial<Candidate> = {
            education: [],
            experience: [],
            skills: [],
            languages: []
        };
        const lines = llmOutput.split('\n').filter(line => line.trim() !== '');

        let currentSection = '';
        let sectionKey = '';

        for (const line of lines) {
            if (line.startsWith('**')) {
                currentSection = line.replace(/\*\*/g, '').trim();
                sectionKey = currentSection.toLowerCase().replace(' known', '');
                continue;
            }

            switch (sectionKey) {
                case 'name':
                    candidate.name = line.trim();
                    break;
                case 'email':
                    candidate.email = line.trim();
                    break;
                case 'phone number':
                    candidate.phone = line.trim();
                    break;
                case 'location':
                    candidate.location = line.trim();
                    break;
                case 'education':
                    const eduMatch = line.trim().match(/-\s*(.*),\s*(.*)\s*\((.*)\)/);
                    if (eduMatch) {
                        candidate.education?.push({
                            degree: eduMatch[1].trim(),
                            institution: eduMatch[2].trim(),
                            years: eduMatch[3].trim(),
                        });
                    }
                    break;
                case 'experience':
                    const expMatch = line.trim().match(/-\s*(.*)\s*at\s*(.*)\s*\((.*)\)/);
                    if (expMatch) {
                        candidate.experience?.push({
                            role: expMatch[1].trim(),
                            company: expMatch[2].trim(),
                            duration: expMatch[3].trim(),
                            description: '',
                        });
                    } else if (candidate.experience && candidate.experience.length > 0 && !line.startsWith('-')) {
                        const lastExperience = candidate.experience[candidate.experience.length - 1];
                        lastExperience.description = (lastExperience.description + ' ' + line.trim()).trim();
                    }
                    break;
                case 'skills':
                    if (candidate.skills) {
                        candidate.skills = line.split(',').map(s => s.trim()).filter(Boolean);
                    }
                    break;
                case 'languages':
                     if (candidate.languages) {
                        candidate.languages = line.split(',').map(s => s.trim()).filter(Boolean);
                    }
                    break;
            }
        }

        return candidate;
    }
}
