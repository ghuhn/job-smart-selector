
export class NameUtils {
    static cleanName(rawName: string): string {
        if (!rawName) return "Candidate";
        
        // Remove common resume filename patterns more aggressively
        let cleanedName = rawName
            .replace(/\.pdf$/i, '')
            .replace(/\.docx?$/i, '')
            .replace(/\.txt$/i, '')
            .replace(/resume/gi, '')
            .replace(/cv/gi, '')
            .replace(/_/g, ' ')
            .replace(/-/g, ' ')
            .replace(/\d+/g, '') // Remove all numbers
            .replace(/[^\w\s'-]/g, '') // Remove special characters except apostrophes and hyphens
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .trim();
        
        // Additional cleaning for common filename patterns
        cleanedName = cleanedName
            .replace(/\b(final|updated|new|latest|version|v\d+)\b/gi, '')
            .replace(/\b(doc|document)\b/gi, '')
            .replace(/\b\d{4}\b/g, '') // Remove years
            .replace(/\s+/g, ' ')
            .trim();
        
        // Capitalize each word properly
        cleanedName = cleanedName
            .split(' ')
            .filter(word => word.length > 0)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
        
        // Validate it looks like a real name (2-4 words, reasonable length)
        const words = cleanedName.split(' ');
        if (words.length < 1 || words.length > 4 || cleanedName.length < 2 || cleanedName.length > 50) {
            return "Candidate";
        }
        
        // Check if it still contains common filename indicators
        if (/\b(resume|cv|document|file)\b/i.test(cleanedName)) {
            return "Candidate";
        }
        
        return cleanedName;
    }
}
