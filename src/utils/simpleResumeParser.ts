export interface SimpleParsedCandidate {
  name: string;
  email: string;
  phone: string;
  skills: string[];
  education: string;
  experience: string;
  languages: string[];
}

export class SimpleResumeParser {
  static parse(text: string): SimpleParsedCandidate {
    // Basic pattern-based extraction
    const name = this.extractName(text);
    const email = this.extractEmail(text);
    const phone = this.extractPhone(text);
    const skills = this.extractSkills(text);
    const education = this.extractEducation(text);
    const experience = this.extractExperience(text);
    const languages = this.extractLanguages(text);

    return { name, email, phone, skills, education, experience, languages };
  }

  static extractName(text: string): string {
    // Find name at top of resume or after "Name:" etc.
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    for (let line of lines.slice(0, 5)) {
      if (/^[A-Z][a-z]+ [A-Z][a-z]+( [A-Z][a-z]+)?$/.test(line)) {
        return line;
      }
      if (/^name[:\-]\s?([A-Za-z ]+)$/.test(line.toLowerCase())) {
        return line.replace(/^name[:\-]\s?/i, '').trim();
      }
    }
    // Fallback to first non-empty line
    return lines.length > 0 ? lines[0] : '';
  }

  static extractEmail(text: string): string {
    const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}/);
    return match ? match[0] : '';
  }

  static extractPhone(text: string): string {
    const match = text.match(/(\+?\d{1,2}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    return match ? match[0] : '';
  }

  static extractSkills(text: string): string[] {
    // Look for lines starting with "Skills" or containing "Skills:"
    const skillLine = text.split('\n').find(l => l.toLowerCase().includes('skills'));
    if (skillLine) {
      // Try to extract comma or semicolon separated skills
      const skills = skillLine.replace(/skills[:\-]?\s*/i, '').split(/,|;/).map(s => s.trim()).filter(Boolean);
      if (skills.length > 0) return skills;
    }
    // Otherwise, return likely keywords from text
    const techRegex = /(python|java(script)?|c\+\+|c#|react|angular|node|sql|aws|html|css|docker|git|typescript|php|ruby|swift|go)\b/gi;
    const words = Array.from(new Set((text.match(techRegex) || []))).map(w => w.trim());
    return words;
  }

  static extractEducation(text: string): string {
    // Look for degree lines
    const degreeRegex = /(Ph\.?D\.?|Master[’']?s?|Bachelor[’']?s?|B\.?Sc\.?|M\.?Sc\.?|MBA|Associate)/i;
    const universityRegex = /(University|College|Institute)/i;
    let education = '';
    text.split('\n').forEach(line => {
      if (degreeRegex.test(line) && universityRegex.test(line)) {
        education = line.trim();
      }
    });
    return education;
  }

  static extractExperience(text: string): string {
    // Look for "X years experience"
    const match = text.match(/(\d{1,2})\s*(\+)?\s*(years?|yrs?)\s+of?\s*experience/i);
    return match ? `${match[1]} years experience` : '';
  }

  static extractLanguages(text: string): string[] {
    // List of common languages to check against
    const langs = [
      'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Chinese',
      'Mandarin', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Dutch', 'Swedish', 'Norwegian', 
      'Danish', 'Polish', 'Turkish', 'Hebrew', 'Greek', 'Vietnamese', 'Thai', 'Indonesian'
    ];
    const found: string[] = [];
    langs.forEach(lang => {
      if (new RegExp(`\\b${lang}\\b`, 'i').test(text)) found.push(lang);
    });
    return found;
  }
}
