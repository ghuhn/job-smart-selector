
import { AggressiveTextCleaner } from './textCleaner';

export class SmartExtractor {
  
  static extractName(words: string[], sentences: string[], filename: string): string {
    console.log('=== SMART NAME EXTRACTION ===');
    
    // Strategy 1: Look for name patterns in sentences
    for (const sentence of sentences.slice(0, 5)) {
      const nameMatch = sentence.match(/^([A-Z][a-z]+ [A-Z][a-z]+)/);
      if (nameMatch && nameMatch[1].length > 5 && nameMatch[1].length < 40) {
        console.log('Found name in sentence:', nameMatch[1]);
        return nameMatch[1];
      }
    }
    
    // Strategy 2: Look for consecutive capitalized words in first 30 words
    for (let i = 0; i < Math.min(words.length - 1, 30); i++) {
      const word1 = words[i];
      const word2 = words[i + 1];
      
      if (this.isValidNameWord(word1) && this.isValidNameWord(word2)) {
        const name = `${word1} ${word2}`;
        console.log('Found name pattern:', name);
        return name;
      }
    }
    
    // Strategy 3: Extract from filename
    const fileBasedName = this.extractNameFromFilename(filename);
    if (fileBasedName !== 'Unknown Candidate') {
      console.log('Using filename-based name:', fileBasedName);
      return fileBasedName;
    }
    
    // Strategy 4: Look for any valid name pattern anywhere
    for (let i = 0; i < words.length - 1; i++) {
      const word1 = words[i];
      const word2 = words[i + 1];
      
      if (this.isValidNameWord(word1) && this.isValidNameWord(word2)) {
        const name = `${word1} ${word2}`;
        console.log('Found fallback name:', name);
        return name;
      }
    }
    
    return 'Candidate Name Not Found';
  }

  static extractEmail(words: string[], sentences: string[]): string {
    console.log('=== SMART EMAIL EXTRACTION ===');
    
    // Strategy 1: Direct email pattern in words
    for (const word of words) {
      if (this.isValidEmail(word)) {
        console.log('Found email in words:', word);
        return word;
      }
    }
    
    // Strategy 2: Email pattern in sentences
    for (const sentence of sentences) {
      const emailMatch = sentence.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
      if (emailMatch) {
        console.log('Found email in sentence:', emailMatch[0]);
        return emailMatch[0];
      }
    }
    
    // Strategy 3: Reconstruct from parts
    const atIndex = words.findIndex(w => w.includes('@'));
    if (atIndex > 0 && atIndex < words.length - 1) {
      const before = words[atIndex - 1];
      const after = words[atIndex + 1];
      const reconstructed = `${before}@${after}`;
      if (this.isValidEmail(reconstructed)) {
        console.log('Reconstructed email:', reconstructed);
        return reconstructed;
      }
    }
    
    return "Not provided";
  }

  static extractPhone(words: string[], sentences: string[]): string {
    console.log('=== SMART PHONE EXTRACTION ===');
    
    // Strategy 1: Look for phone patterns in words
    for (const word of words) {
      const cleanedWord = word.replace(/[-\s()]/g, '');
      if (/^\+?1?\d{10,11}$/.test(cleanedWord)) {
        console.log('Found phone in words:', word);
        return word;
      }
    }
    
    // Strategy 2: Look for phone patterns in sentences
    const phonePatterns = [
      /(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/,
      /\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/,
      /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/
    ];
    
    for (const sentence of sentences) {
      for (const pattern of phonePatterns) {
        const match = sentence.match(pattern);
        if (match) {
          console.log('Found phone in sentence:', match[0]);
          return match[0];
        }
      }
    }
    
    return "Not provided";
  }

  static extractLocation(words: string[], sentences: string[]): string {
    console.log('=== SMART LOCATION EXTRACTION ===');
    
    const usStates = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
    const stateAbbrevs = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
    const majorCities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'Charlotte', 'San Francisco', 'Indianapolis', 'Seattle', 'Denver', 'Boston', 'Nashville', 'Baltimore', 'Oklahoma City', 'Portland', 'Las Vegas', 'Milwaukee', 'Atlanta', 'Miami', 'Tampa', 'Orlando'];
    
    // Strategy 1: Look for states in words
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
    
    // Strategy 2: Look for cities
    for (const city of majorCities) {
      const cityWords = city.toLowerCase().split(' ');
      if (cityWords.every(cw => words.some(w => w.toLowerCase() === cw))) {
        console.log('Found city:', city);
        return city;
      }
    }
    
    // Strategy 3: Look in sentences for "City, State" pattern
    for (const sentence of sentences) {
      const locationMatch = sentence.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),\s*([A-Z]{2}|[A-Z][a-z]+)/);
      if (locationMatch) {
        console.log('Found location pattern:', locationMatch[0]);
        return locationMatch[0];
      }
    }
    
    return "Not provided";
  }

  static extractSkills(words: string[], sentences: string[]): string[] {
    console.log('=== SMART SKILLS EXTRACTION ===');
    
    const skillsDatabase = {
      programming: ['JavaScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'PHP', 'Go', 'Rust', 'Swift', 'Kotlin', 'TypeScript', 'Scala', 'R', 'MATLAB'],
      web: ['React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel', 'HTML', 'CSS', 'Bootstrap', 'Tailwind', 'SASS', 'LESS'],
      database: ['SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Oracle', 'SQLServer', 'Cassandra', 'DynamoDB'],
      cloud: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'GitLab', 'CircleCI', 'Terraform'],
      soft: ['Leadership', 'Communication', 'Management', 'Teamwork', 'Problem-solving', 'Analysis', 'Design', 'Research', 'Planning', 'Organization']
    };
    
    const allSkills = Object.values(skillsDatabase).flat();
    const foundSkills = new Set<string>();
    
    // Check words against skills database
    for (const word of words) {
      const matchedSkill = allSkills.find(skill => 
        skill.toLowerCase() === word.toLowerCase() ||
        skill.toLowerCase().includes(word.toLowerCase()) ||
        word.toLowerCase().includes(skill.toLowerCase())
      );
      if (matchedSkill) {
        foundSkills.add(matchedSkill);
      }
    }
    
    console.log('Found skills:', Array.from(foundSkills));
    return Array.from(foundSkills);
  }

  static extractExperience(words: string[], sentences: string[]): { text: string; years: number } {
    console.log('=== SMART EXPERIENCE EXTRACTION ===');
    
    // Look for "X years" patterns
    const yearPatterns = [
      /(\d+)\s*(?:\+)?\s*years?\s*(?:of\s*)?(?:experience|exp)/i,
      /(\d+)\s*(?:\+)?\s*yrs?\s*(?:experience|exp)/i,
      /experience.*?(\d+)\s*years?/i,
      /(\d+)\s*years?\s*in/i
    ];
    
    for (const sentence of sentences) {
      for (const pattern of yearPatterns) {
        const match = sentence.match(pattern);
        if (match) {
          const years = parseInt(match[1]);
          console.log('Found experience:', `${years} years`);
          return { text: `${years} years of experience`, years };
        }
      }
    }
    
    // Look in words for number followed by years
    for (let i = 0; i < words.length - 1; i++) {
      if (/^\d+$/.test(words[i]) && /^years?$/i.test(words[i + 1])) {
        const years = parseInt(words[i]);
        console.log('Found experience in words:', `${years} years`);
        return { text: `${years} years of experience`, years };
      }
    }
    
    return { text: "Not provided", years: 0 };
  }

  static extractEducation(words: string[], sentences: string[]): { text: string; level: string } {
    console.log('=== SMART EDUCATION EXTRACTION ===');
    
    const degrees = {
      'PhD': ['PhD', 'Ph.D', 'Doctorate', 'Doctor'],
      'Masters': ['Master', 'Masters', 'MBA', 'MS', 'MA', 'M.S', 'M.A'],
      'Bachelor': ['Bachelor', 'Bachelors', 'BS', 'BA', 'B.S', 'B.A', 'BBA', 'BFA'],
      'Associate': ['Associate', 'AA', 'AS', 'A.A', 'A.S']
    };
    
    const fields = ['Engineering', 'Science', 'Computer', 'Business', 'Arts', 'Technology', 'Management', 'Marketing', 'Finance', 'Economics'];
    
    let foundDegree = '';
    let foundField = '';
    let degreeLevel = '';
    
    // Look for degrees
    for (const [level, degreeVariants] of Object.entries(degrees)) {
      for (const variant of degreeVariants) {
        if (words.some(w => w.toLowerCase() === variant.toLowerCase())) {
          foundDegree = variant;
          degreeLevel = level;
          break;
        }
      }
      if (foundDegree) break;
    }
    
    // Look for fields
    for (const field of fields) {
      if (words.some(w => w.toLowerCase().includes(field.toLowerCase()))) {
        foundField = field;
        break;
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

  static extractLanguages(words: string[], sentences: string[]): string[] {
    console.log('=== SMART LANGUAGES EXTRACTION ===');
    
    const languages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Chinese', 'Mandarin', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Dutch', 'Swedish', 'Norwegian', 'Danish', 'Polish', 'Turkish', 'Hebrew'];
    
    const foundLanguages = new Set<string>();
    
    for (const word of words) {
      const matchedLang = languages.find(lang => lang.toLowerCase() === word.toLowerCase());
      if (matchedLang) {
        foundLanguages.add(matchedLang);
      }
    }
    
    // If no languages found, assume English if content appears to be in English
    if (foundLanguages.size === 0) {
      const englishIndicators = ['experience', 'education', 'skills', 'work', 'university', 'college', 'company'];
      const hasEnglish = englishIndicators.some(indicator => 
        words.some(w => w.toLowerCase() === indicator)
      );
      if (hasEnglish) {
        foundLanguages.add('English');
      }
    }
    
    console.log('Found languages:', Array.from(foundLanguages));
    return Array.from(foundLanguages);
  }

  private static isValidNameWord(word: string): boolean {
    return word.length >= 2 && 
           word.length <= 20 && 
           /^[A-Z][a-z]+$/.test(word) &&
           !['Resume', 'CV', 'Profile', 'Document', 'Page', 'Name', 'Email', 'Phone', 'Address', 'Skills', 'Education', 'Experience', 'Work', 'Employment'].includes(word);
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
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
