
export class LanguageUtils {
    private static readonly COMMON_LANGUAGES = [
        'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Chinese', 
        'Mandarin', 'Cantonese', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Bengali', 'Urdu', 
        'Telugu', 'Tamil', 'Marathi', 'Gujarati', 'Punjabi', 'Thai', 'Vietnamese', 'Indonesian', 
        'Malay', 'Tagalog', 'Dutch', 'Swedish', 'Norwegian', 'Danish', 'Finnish', 'Polish', 
        'Czech', 'Hungarian', 'Romanian', 'Bulgarian', 'Croatian', 'Serbian', 'Greek', 'Turkish', 
        'Hebrew', 'Persian', 'Farsi', 'Swahili', 'Amharic', 'Yoruba', 'Igbo', 'Hausa', 'Zulu', 
        'Afrikaans', 'Sinhala', 'Nepali', 'Burmese', 'Khmer', 'Lao', 'Mongolian', 'Kazakh', 
        'Uzbek', 'Kyrgyz', 'Tajik', 'Georgian', 'Armenian', 'Azerbaijani', 'Estonian', 'Latvian', 
        'Lithuanian', 'Slovenian', 'Slovak', 'Maltese', 'Irish', 'Welsh', 'Scottish Gaelic', 
        'Basque', 'Catalan', 'Galician', 'Albanian', 'Macedonian', 'Bosnian', 'Montenegrin', 
        'Icelandic', 'Luxembourgish', 'Romansh'
    ];

    private static readonly PROFICIENCY_LEVELS = [
        'Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic', 'Beginner', 'Conversational', 
        'Professional', 'Business', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'
    ];

    static parseLanguages(languageText: string): string[] {
        console.log('Parsing languages from text:', languageText);
        
        if (!languageText || languageText === "Not provided" || languageText.trim() === '') {
            console.log('No language text provided');
            return [];
        }
        
        const languages: string[] = [];
        
        // Split by common separators
        const parts = languageText.split(/[,;|&\n]+/);
        console.log('Split language parts:', parts);
        
        for (const part of parts) {
            const trimmedPart = part.trim();
            if (!trimmedPart) continue;
            
            console.log('Processing language part:', trimmedPart);
            
            // Check if this part contains a language - use case insensitive matching
            for (const language of this.COMMON_LANGUAGES) {
                if (new RegExp(`\\b${language}\\b`, 'i').test(trimmedPart)) {
                    // Extract proficiency if present
                    let proficiency = '';
                    for (const level of this.PROFICIENCY_LEVELS) {
                        if (new RegExp(`\\b${level}\\b`, 'i').test(trimmedPart)) {
                            proficiency = ` (${level})`;
                            break;
                        }
                    }
                    
                    const languageEntry = `${language}${proficiency}`;
                    if (!languages.includes(languageEntry)) {
                        languages.push(languageEntry);
                        console.log('Added language:', languageEntry);
                    }
                    break;
                }
            }
        }
        
        // If no languages found using strict matching, try a more lenient approach
        if (languages.length === 0) {
            console.log('No languages found with strict matching, trying lenient approach');
            // Split and clean each part, then add if it looks like a language
            const cleanedParts = parts.map(p => p.trim()).filter(p => p.length > 0);
            for (const part of cleanedParts) {
                // If it's a single word or two words, likely a language
                if (part.split(' ').length <= 2 && part.length >= 3) {
                    languages.push(part);
                    console.log('Added language (lenient):', part);
                }
            }
        }
        
        console.log('Final parsed languages:', languages);
        return languages;
    }

    static getLanguagesList(): string {
        return this.COMMON_LANGUAGES.join(', ');
    }
}
