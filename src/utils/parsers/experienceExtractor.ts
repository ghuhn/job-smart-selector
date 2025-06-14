
import { findSection } from './common';

export function extractExperience(text: string): { text: string; years: number } {
    const experienceSection = findSection(text, ['experience', 'work history', 'employment', 'work experience']);
    const searchText = experienceSection || text;

    // Look for years of experience mentions
    const yearPatterns = [
      /(\d+)\+?\s*years?\s*(?:of\s*)?experience/i,
      /(\d+)\+?\s*years?\s*in/i,
      /experience\s*:\s*(\d+)\+?\s*years?/i
    ];

    let years = 0;
    for (const pattern of yearPatterns) {
      const match = searchText.match(pattern);
      if (match) {
        years = parseInt(match[1]);
        break;
      }
    }

    // If no explicit years, estimate from job entries
    if (years === 0) {
      const jobEntries = searchText.match(/\d{4}\s*-\s*(?:\d{4}|present|current)/gi) || [];
      years = Math.min(jobEntries.length * 2, 15); // Estimate 2 years per job, cap at 15
    }

    const experienceText = experienceSection 
      ? (experienceSection.length > 200 ? experienceSection.substring(0, 200) + "..." : experienceSection)
      : `${years} years of professional experience`;

    return { text: experienceText, years };
}
