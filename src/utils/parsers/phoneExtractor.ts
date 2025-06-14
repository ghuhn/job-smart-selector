
import { extractLines, extractValueForKey } from './common';

export function extractPhone(text: string): string {
    const lines = extractLines(text);
    
    // 1. Try key-value extraction
    const phoneFromKey = extractValueForKey(lines, ['phone', 'mobile', 'contact', 'contact no', 'contact number']);
    if (phoneFromKey) {
        return phoneFromKey.replace(/[^\d+]/g, '');
    }
    
    // 2. Fallback to regex patterns, prioritizing Indian numbers
    const phonePatterns = [
      /\+91[ -]?\d{10}/,
      /\+91[ -]?\d{5}[ -]?\d{5}/,
      /(?<!\d)\d{10}(?!\d)/,
      /\b(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/,
    ];

    for (const pattern of phonePatterns) {
      const match = text.match(pattern);
      if (match) {
        if (/\d{4}\s*-\s*\d{4}/.test(match[0])) continue;
        return match[0].trim();
      }
    }

    return "Phone not provided";
}
