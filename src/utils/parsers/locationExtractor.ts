
import { extractLines } from './common';

export function extractLocation(text: string): string {
    const lines = extractLines(text);
    
    // Look for city, state patterns
    const locationPatterns = [
      /([A-Z][a-z]+,\s*[A-Z]{2})/,
      /([A-Z][a-z]+,\s*[A-Z][a-z]+)/,
      /([A-Z][a-z]+\s+[A-Z][a-z]+,\s*[A-Z]{2})/
    ];

    for (const line of lines.slice(0, 10)) {
      for (const pattern of locationPatterns) {
        const match = line.match(pattern);
        if (match) {
          return match[1];
        }
      }
    }

    // Look for address-like patterns
    const addressPattern = /\b\d+\s+[A-Z][a-z]+\s+(St|Ave|Rd|Dr|Blvd|Lane|Way)/i;
    for (const line of lines.slice(0, 15)) {
      if (addressPattern.test(line)) {
        return line.length > 50 ? line.substring(0, 50) + "..." : line;
      }
    }

    return "Location not provided";
}
