
import { extractLines, extractValueForKey } from './common';

export function extractName(text: string, fileName?: string): string {
    const lines = extractLines(text);
    
    // 1. Try key-value extraction
    const nameFromKey = extractValueForKey(lines, ['name', 'candidate name']);
    if (nameFromKey) return nameFromKey;

    // 2. Try filename
    if (fileName) {
      const cleanFileName = fileName.replace(/\.(pdf|doc|docx)$/i, '').replace(/[_-]/g, ' ');
      if (cleanFileName.length > 2 && cleanFileName.length < 50 && /^[A-Za-z\s.'-]+$/.test(cleanFileName) && !/(resume|cv)/i.test(cleanFileName)) {
        return cleanFileName.trim().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      }
    }

    // 3. Look for name patterns in first few lines
    for (const line of lines.slice(0, 5)) {
        const nameMatch = line.match(/^\s*([A-Z][a-z]+(?:\s[A-Z][a-z]+){1,2})\s*$/);
        if (nameMatch && nameMatch[1].length < 50) {
            return nameMatch[1];
        }
    }
    
    // Fallback to the first line if it looks like a name
    const firstLine = lines[0] || '';
    if (firstLine.length > 2 && firstLine.length < 50 && /^[A-Za-z\s.'-]+$/.test(firstLine)) {
        return firstLine;
    }

    return "Name not found";
}
