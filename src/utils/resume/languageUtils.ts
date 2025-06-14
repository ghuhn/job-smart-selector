
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
        if (!languageText || languageText === "Not provided") return [];
        
        const languages: string[] = [];
        const parts = languageText.split(',');
        
        for (const part of parts) {
            const trimmedPart = part.trim();
            
            // Check if this part contains a language
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
                    }
                    break;
                }
            }
        }
        
        return languages;
    }

    static getLanguagesList(): string {
        return this.COMMON_LANGUAGES.join(', ');
    }
}
