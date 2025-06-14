
import { AggressiveTextCleaner } from './textCleaner';

export class SmartExtractor {
  
  static extractName(words: string[], sentences: string[], lines: string[], filename: string): string {
    console.log('=== ENHANCED NAME EXTRACTION ===');
    console.log('Words sample:', words.slice(0, 20));
    console.log('Lines sample:', lines.slice(0, 10));
    
    // Strategy 1: Look for name in the first few lines
    for (const line of lines.slice(0, 5)) {
      const nameMatch = line.match(/^([A-Z][a-z]+ [A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/);
      if (nameMatch && this.isValidName(nameMatch[1])) {
        console.log('Found name in line:', nameMatch[1]);
        return nameMatch[1];
      }
    }
    
    // Strategy 2: Look for consecutive capitalized words in first 20 words
    for (let i = 0; i < Math.min(words.length - 1, 20); i++) {
      const word1 = words[i];
      const word2 = words[i + 1];
      
      if (this.isValidNameWord(word1) && this.isValidNameWord(word2)) {
        const name = `${word1} ${word2}`;
        if (this.isValidName(name)) {
          console.log('Found name pattern:', name);
          return name;
        }
      }
    }
    
    // Strategy 3: Extract from filename
    const fileBasedName = this.extractNameFromFilename(filename);
    if (fileBasedName !== 'Unknown Candidate') {
      console.log('Using filename-based name:', fileBasedName);
      return fileBasedName;
    }
    
    // Strategy 4: Look for name after common headers
    const nameHeaders = ['name:', 'candidate:', 'applicant:', 'resume of', 'cv of'];
    for (const line of lines) {
      for (const header of nameHeaders) {
        if (line.toLowerCase().includes(header)) {
          const afterHeader = line.substring(line.toLowerCase().indexOf(header) + header.length).trim();
          const nameMatch = afterHeader.match(/^([A-Z][a-z]+ [A-Z][a-z]+)/);
          if (nameMatch && this.isValidName(nameMatch[1])) {
            console.log('Found name after header:', nameMatch[1]);
            return nameMatch[1];
          }
        }
      }
    }
    
    return 'Name Not Found';
  }

  static extractEmail(words: string[], sentences: string[], lines: string[]): string {
    console.log('=== ENHANCED EMAIL EXTRACTION ===');
    
    // Strategy 1: Direct email pattern in words
    for (const word of words) {
      if (this.isValidEmail(word)) {
        console.log('Found email in words:', word);
        return word;
      }
    }
    
    // Strategy 2: Email pattern in lines
    for (const line of lines) {
      const emailMatch = line.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
      if (emailMatch && this.isValidEmail(emailMatch[0])) {
        console.log('Found email in line:', emailMatch[0]);
        return emailMatch[0];
      }
    }
    
    // Strategy 3: Look for email after common labels
    const emailLabels = ['email:', 'e-mail:', 'mail:', 'contact:'];
    for (const line of lines) {
      for (const label of emailLabels) {
        if (line.toLowerCase().includes(label)) {
          const afterLabel = line.substring(line.toLowerCase().indexOf(label) + label.length).trim();
          const emailMatch = afterLabel.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
          if (emailMatch && this.isValidEmail(emailMatch[0])) {
            console.log('Found email after label:', emailMatch[0]);
            return emailMatch[0];
          }
        }
      }
    }
    
    return "Not provided";
  }

  static extractPhone(words: string[], sentences: string[], lines: string[]): string {
    console.log('=== ENHANCED PHONE EXTRACTION ===');
    
    // Strategy 1: Look for phone patterns in lines
    const phonePatterns = [
      /(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/,
      /\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/,
      /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/,
      /\(\d{3}\)\s*\d{3}[-.\s]?\d{4}/
    ];
    
    for (const line of lines) {
      for (const pattern of phonePatterns) {
        const match = line.match(pattern);
        if (match) {
          console.log('Found phone in line:', match[0]);
          return match[0];
        }
      }
    }
    
    // Strategy 2: Look for phone after labels
    const phoneLabels = ['phone:', 'tel:', 'mobile:', 'cell:', 'contact:'];
    for (const line of lines) {
      for (const label of phoneLabels) {
        if (line.toLowerCase().includes(label)) {
          const afterLabel = line.substring(line.toLowerCase().indexOf(label) + label.length).trim();
          for (const pattern of phonePatterns) {
            const match = afterLabel.match(pattern);
            if (match) {
              console.log('Found phone after label:', match[0]);
              return match[0];
            }
          }
        }
      }
    }
    
    return "Not provided";
  }

  static extractLocation(words: string[], sentences: string[], lines: string[]): string {
    console.log('=== ENHANCED LOCATION EXTRACTION ===');
    
    const usStates = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
    const stateAbbrevs = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
    const majorCities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'Charlotte', 'San Francisco', 'Indianapolis', 'Seattle', 'Denver', 'Boston', 'Nashville', 'Baltimore', 'Oklahoma City', 'Portland', 'Las Vegas', 'Milwaukee', 'Atlanta', 'Miami', 'Tampa', 'Orlando'];
    
    // Strategy 1: Look in lines for "City, State" pattern
    for (const line of lines) {
      const locationMatch = line.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*([A-Z]{2}|[A-Z][a-z]+)/);
      if (locationMatch) {
        console.log('Found location pattern:', locationMatch[0]);
        return locationMatch[0];
      }
    }
    
    // Strategy 2: Look for states in words
    for (const word of words) {
      const state = usStates.find(s => s.toLowerCase() === word.toLowerCase());
      if (state) {
        console.log('Found state:', state);
        return state;
      }
      
      const abbrev = stateAbbrevs.find(a => a.toLowerCase() === word.toLowerCase());
      if (abbrev) {
        console.log('Found state abbreviation:', abbrev);
        return abbrev;
      }
    }
    
    // Strategy 3: Look for cities
    for (const city of majorCities) {
      const cityWords = city.toLowerCase().split(' ');
      if (cityWords.every(cw => words.some(w => w.toLowerCase() === cw))) {
        console.log('Found city:', city);
        return city;
      }
    }
    
    return "Not provided";
  }

  static extractEducation(words: string[], sentences: string[], lines: string[]): { text: string; level: string } {
    console.log('=== ENHANCED EDUCATION EXTRACTION ===');
    
    const degrees = {
      'PhD': ['PhD', 'Ph.D', 'Doctorate', 'Doctor', 'Doctoral'],
      'Masters': ['Master', 'Masters', 'MBA', 'MS', 'MA', 'M.S', 'M.A', 'MSc', 'MEd'],
      'Bachelor': ['Bachelor', 'Bachelors', 'BS', 'BA', 'B.S', 'B.A', 'BBA', 'BFA', 'BSc'],
      'Associate': ['Associate', 'AA', 'AS', 'A.A', 'A.S']
    };
    
    const fields = ['Engineering', 'Science', 'Computer', 'Business', 'Arts', 'Technology', 'Management', 'Marketing', 'Finance', 'Economics', 'Mathematics', 'Physics', 'Chemistry', 'Biology'];
    
    let foundDegree = '';
    let foundField = '';
    let degreeLevel = '';
    
    // Look in lines for education sections
    for (const line of lines) {
      // Check if line contains education keywords
      if (line.toLowerCase().includes('education') || line.toLowerCase().includes('degree') || line.toLowerCase().includes('university') || line.toLowerCase().includes('college')) {
        // Look for degrees in this line
        for (const [level, degreeVariants] of Object.entries(degrees)) {
          for (const variant of degreeVariants) {
            if (line.toLowerCase().includes(variant.toLowerCase())) {
              foundDegree = variant;
              degreeLevel = level;
              console.log('Found degree in education line:', variant);
              break;
            }
          }
          if (foundDegree) break;
        }
        
        // Look for fields in this line
        for (const field of fields) {
          if (line.toLowerCase().includes(field.toLowerCase())) {
            foundField = field;
            console.log('Found field in education line:', field);
            break;
          }
        }
      }
    }
    
    // If not found in education sections, look in all lines
    if (!foundDegree) {
      for (const [level, degreeVariants] of Object.entries(degrees)) {
        for (const variant of degreeVariants) {
          if (words.some(w => w.toLowerCase() === variant.toLowerCase())) {
            foundDegree = variant;
            degreeLevel = level;
            console.log('Found degree in words:', variant);
            break;
          }
        }
        if (foundDegree) break;
      }
    }
    
    if (!foundField) {
      for (const field of fields) {
        if (words.some(w => w.toLowerCase().includes(field.toLowerCase()))) {
          foundField = field;
          console.log('Found field in words:', field);
          break;
        }
      }
    }
    
    let educationText = '';
    if (foundDegree) {
      educationText = foundDegree;
      if (foundField) {
        educationText += ` in ${foundField}`;
      }
    } else if (foundField) {
      educationText = `Education in ${foundField}`;
      degreeLevel = 'Bachelor'; // Assume bachelor's if field but no degree
    }
    
    console.log('Found education:', educationText, 'Level:', degreeLevel);
    return { 
      text: educationText || "Not provided", 
      level: degreeLevel || "Not provided" 
    };
  }

  static extractExperience(words: string[], sentences: string[], lines: string[]): { text: string; years: number } {
    console.log('=== ENHANCED EXPERIENCE EXTRACTION ===');
    
    // Look for "X years" patterns in lines
    const yearPatterns = [
      /(\d+)\s*(?:\+)?\s*years?\s*(?:of\s*)?(?:experience|exp)/i,
      /(\d+)\s*(?:\+)?\s*yrs?\s*(?:experience|exp)/i,
      /experience.*?(\d+)\s*years?/i,
      /(\d+)\s*years?\s*in/i,
      /(\d+)\s*years?\s*of\s*work/i
    ];
    
    for (const line of lines) {
      for (const pattern of yearPatterns) {
        const match = line.match(pattern);
        if (match) {
          const years = parseInt(match[1]);
          console.log('Found experience in line:', `${years} years`);
          return { text: `${years} years of experience`, years };
        }
      }
    }
    
    // Look in sentences
    for (const sentence of sentences) {
      for (const pattern of yearPatterns) {
        const match = sentence.match(pattern);
        if (match) {
          const years = parseInt(match[1]);
          console.log('Found experience in sentence:', `${years} years`);
          return { text: `${years} years of experience`, years };
        }
      }
    }
    
    return { text: "Not provided", years: 0 };
  }

  static extractLanguages(words: string[], sentences: string[], lines: string[]): string[] {
    console.log('=== ENHANCED LANGUAGES EXTRACTION ===');
    
    const languages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Chinese', 'Mandarin', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Dutch', 'Swedish', 'Norwegian', 'Danish', 'Polish', 'Turkish', 'Hebrew', 'Greek', 'Vietnamese', 'Thai', 'Indonesian'];
    
    const foundLanguages = new Set<string>();
    
    // Look in lines for language sections
    for (const line of lines) {
      if (line.toLowerCase().includes('language') || line.toLowerCase().includes('fluent') || line.toLowerCase().includes('native')) {
        for (const lang of languages) {
          if (line.toLowerCase().includes(lang.toLowerCase())) {
            foundLanguages.add(lang);
            console.log('Found language in language line:', lang);
          }
        }
      }
    }
    
    // Look in all words
    for (const word of words) {
      const matchedLang = languages.find(lang => lang.toLowerCase() === word.toLowerCase());
      if (matchedLang) {
        foundLanguages.add(matchedLang);
        console.log('Found language in words:', matchedLang);
      }
    }
    
    // If no languages found, assume English if content appears to be in English
    if (foundLanguages.size === 0) {
      const englishIndicators = ['experience', 'education', 'skills', 'work', 'university', 'college', 'company', 'resume', 'cv'];
      const hasEnglish = englishIndicators.some(indicator => 
        words.some(w => w.toLowerCase() === indicator)
      );
      if (hasEnglish) {
        foundLanguages.add('English');
        console.log('Assumed English language');
      }
    }
    
    console.log('Found languages:', Array.from(foundLanguages));
    return Array.from(foundLanguages);
  }

  static extractSkills(words: string[], sentences: string[], lines: string[]): string[] {
    console.log('=== ENHANCED SKILLS EXTRACTION ===');
    
    const skillsDatabase = {
      programming: ['JavaScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'PHP', 'Go', 'Rust', 'Swift', 'Kotlin', 'TypeScript', 'Scala', 'R', 'MATLAB', 'C'],
      web: ['React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel', 'HTML', 'CSS', 'Bootstrap', 'Tailwind', 'SASS', 'LESS', 'jQuery'],
      database: ['SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Oracle', 'SQLServer', 'Cassandra', 'DynamoDB', 'Firebase'],
      cloud: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'GitLab', 'CircleCI', 'Terraform', 'Ansible'],
      soft: ['Leadership', 'Communication', 'Management', 'Teamwork', 'Problem-solving', 'Analysis', 'Design', 'Research', 'Planning', 'Organization']
    };
    
    const allSkills = Object.values(skillsDatabase).flat();
    const foundSkills = new Set<string>();
    
    // Look in lines for skills sections
    for (const line of lines) {
      if (line.toLowerCase().includes('skill') || line.toLowerCase().includes('technolog') || line.toLowerCase().includes('proficient')) {
        for (const skill of allSkills) {
          if (line.toLowerCase().includes(skill.toLowerCase())) {
            foundSkills.add(skill);
            console.log('Found skill in skills line:', skill);
          }
        }
      }
    }
    
    // Check words against skills database
    for (const word of words) {
      const matchedSkill = allSkills.find(skill => 
        skill.toLowerCase() === word.toLowerCase() ||
        (skill.length > 4 && word.toLowerCase().includes(skill.toLowerCase())) ||
        (word.length > 4 && skill.toLowerCase().includes(word.toLowerCase()))
      );
      if (matchedSkill) {
        foundSkills.add(matchedSkill);
        console.log('Found skill in words:', matchedSkill);
      }
    }
    
    console.log('Found skills:', Array.from(foundSkills));
    return Array.from(foundSkills);
  }

  private static isValidName(name: string): boolean {
    const parts = name.trim().split(' ');
    return parts.length >= 2 && 
           parts.every(part => part.length >= 2 && part.length <= 20) &&
           !['Resume', 'CV', 'Document', 'Page', 'Profile'].some(word => name.includes(word));
  }

  private static isValidNameWord(word: string): boolean {
    return word.length >= 2 && 
           word.length <= 20 && 
           /^[A-Z][a-z]+$/.test(word) &&
           !['Resume', 'CV', 'Profile', 'Document', 'Page', 'Name', 'Email', 'Phone', 'Address', 'Skills', 'Education', 'Experience', 'Work', 'Employment', 'Date', 'Time', 'Year', 'Month'].includes(word);
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email) && email.length <= 50;
  }

  private static extractNameFromFilename(filename: string): string {
    const cleaned = filename
      .replace(/\.(pdf|doc|docx)$/i, '')
      .replace(/[-_]/g, ' ')
      .replace(/\bresume\b/gi, '')
      .replace(/\bcv\b/gi, '')
      .trim();
    
    const words = cleaned.split(' ')
      .filter(word => word.length > 1)
      .filter(word => /^[A-Za-z]+$/.test(word))
      .slice(0, 3);
    
    return words.length >= 2 ? words.join(' ') : 'Unknown Candidate';
  }
}
