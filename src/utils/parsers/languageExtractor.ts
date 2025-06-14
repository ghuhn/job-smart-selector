
import { findSection } from './common';

export function extractLanguages(text: string): string[] {
    const languagesSection = findSection(text, ['languages', 'language skills']);
    const searchText = languagesSection || text;

    const commonLanguages = [
      'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian',
      'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Dutch', 'Swedish'
    ];

    const foundLanguages = new Set<string>();
    
    for (const lang of commonLanguages) {
      if (searchText.toLowerCase().includes(lang.toLowerCase())) {
        foundLanguages.add(lang);
      }
    }

    return Array.from(foundLanguages).slice(0, 5);
}
