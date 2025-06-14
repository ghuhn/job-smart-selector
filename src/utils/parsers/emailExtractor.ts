
import { extractLines, extractValueForKey } from './common';

export function extractEmail(text: string): string {
    const lines = extractLines(text);
    
    // 1. Try key-value extraction
    const emailFromKey = extractValueForKey(lines, ['email', 'e-mail']);
    if (emailFromKey) {
        const emailMatch = emailFromKey.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
        if(emailMatch) return emailMatch[0];
    }
    
    // 2. Fallback to regex search on the whole text
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const matches = text.match(emailPattern);
    return matches ? matches[0] : "Email not provided";
}
