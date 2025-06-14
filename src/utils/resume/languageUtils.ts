
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
        
        // First, try to find languages using exact word matching
        for (const language of this.COMMON_LANGUAGES) {
            const regex = new RegExp(`\\b${language}\\b`, 'gi');
            const matches = languageText.match(regex);
            if (matches) {
                // Look for proficiency level near this language
                let proficiency = '';
                for (const level of this.PROFICIENCY_LEVELS) {
                    const proficiencyRegex = new RegExp(`\\b${level}\\b.*?\\b${language}\\b|\\b${language}\\b.*?\\b${level}\\b`, 'gi');
                    if (proficiencyRegex.test(languageText)) {
                        proficiency = ` (${level})`;
                        break;
                    }
                }
                
                const languageEntry = `${language}${proficiency}`;
                if (!languages.some(lang => lang.toLowerCase().includes(language.toLowerCase()))) {
                    languages.push(languageEntry);
                    console.log('Added language:', languageEntry);
                }
            }
        }
        
        // If no languages found with exact matching, try more flexible approach
        if (languages.length === 0) {
            console.log('No languages found with exact matching, trying flexible approach');
            
            // Split by common separators and analyze each part
            const parts = languageText.split(/[,;|&\n\-•]/);
            
            for (const part of parts) {
                const trimmedPart = part.trim();
                if (!trimmedPart || trimmedPart.length < 3) continue;
                
                // Skip common non-language words
                const skipWords = ['not', 'provided', 'languages', 'language', 'skills', 'known', 'speak', 'spoken'];
                if (skipWords.some(word => trimmedPart.toLowerCase().includes(word))) continue;
                
                // Check if this looks like a language name (starts with capital, reasonable length)
                if (/^[A-Z][a-z]+(\s[A-Z][a-z]+)?$/.test(trimmedPart) && trimmedPart.length <= 20) {
                    languages.push(trimmedPart);
                    console.log('Added language (flexible):', trimmedPart);
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
