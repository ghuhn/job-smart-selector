
import { findSection } from './common';

export function extractEducation(text: string): { text: string; level: string } {
    const educationSection = findSection(text, ['education', 'academic background', 'qualifications']);
    const searchText = educationSection || text;

    const degreePatterns = [
      { pattern: /\b(?:PhD|Ph\.D|Doctorate)/i, level: 'Doctorate' },
      { pattern: /\b(?:Master|M\.S|M\.A|MBA|MS|MA)\b/i, level: 'Masters' },
      { pattern: /\b(?:Bachelor|B\.S|B\.A|BS|BA)\b/i, level: 'Bachelors' },
      { pattern: /\b(?:Associate|A\.S|A\.A|AS|AA)\b/i, level: 'Associates' },
      { pattern: /\b(?:High School|Diploma|GED)\b/i, level: 'High School' }
    ];

    let level = "Not specified";
    let educationText = "Education details not found";

    for (const { pattern, level: degreeLevel } of degreePatterns) {
      if (pattern.test(searchText)) {
        level = degreeLevel;
        break;
      }
    }

    if (educationSection) {
      educationText = educationSection.length > 150 
        ? educationSection.substring(0, 150) + "..." 
        : educationSection;
    }

    return { text: educationText, level };
}
