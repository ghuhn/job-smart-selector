
export class AggressiveTextCleaner {
  static clean(text: string): string {
    if (!text || typeof text !== 'string') return '';
    
    console.log('=== AGGRESSIVE TEXT CLEANING ===');
    console.log('Input length:', text.length);
    console.log('Raw sample:', text.substring(0, 200));
    
    // Step 1: Remove all PDF objects, streams, and references
    let cleaned = text
      // Remove PDF objects and references
      .replace(/\d+\s+\d+\s+obj\s*<</g, ' ')
      .replace(/>>.*?endobj/gs, ' ')
      .replace(/stream.*?endstream/gs, ' ')
      .replace(/xref.*?\d+/gs, ' ')
      .replace(/trailer\s*<</g, ' ')
      .replace(/startxref\s*\d+/g, ' ')
      .replace(/%%EOF/g, ' ')
      
      // Remove node references and PDF structure
      .replace(/\(node\d+\)\s*\d+\s+\d+\s+R/g, ' ')
      .replace(/node\d+/g, ' ')
      .replace(/\d+\s+\d+\s+R/g, ' ')
      .replace(/\/Kids\s*\[[^\]]*\]/g, ' ')
      .replace(/\/Names\s*\[[^\]]*\]/g, ' ')
      .replace(/\/Limits\s*\[[^\]]*\]/g, ' ')
      
      // Remove font and encoding commands
      .replace(/\/Type\s*\/\w+/g, ' ')
      .replace(/\/BaseFont\s*\/[A-Z\+\-\*]+/g, ' ')
      .replace(/\/Encoding\s*\/[\w\-]+/g, ' ')
      .replace(/\/DescendantFonts\s*\[\]/g, ' ')
      .replace(/\/ToUnicode/g, ' ')
      .replace(/\/Subtype\s*\/\w+/g, ' ')
      .replace(/\/Identity-H/g, ' ')
      
      // Remove PDF drawing commands
      .replace(/\/[A-Z]{1,3}\s+[\d\.\-]+/g, ' ')
      .replace(/\/[A-Z]{1,3}\s+(true|false)/g, ' ')
      .replace(/\/Normal/g, ' ')
      .replace(/\/Figure/g, ' ')
      .replace(/\/BM/g, ' ')
      .replace(/\/CA/g, ' ')
      .replace(/\/ca/g, ' ')
      .replace(/\/LC/g, ' ')
      .replace(/\/LJ/g, ' ')
      .replace(/\/LW/g, ' ')
      .replace(/\/ML/g, ' ')
      .replace(/\/SA/g, ' ')
      
      // Remove HTML-like tags
      .replace(/<[^>]*>/g, ' ')
      .replace(/&[a-zA-Z]+;/g, ' ')
      
      // Remove escape sequences
      .replace(/\\[nrtbf\\]/g, ' ')
      .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
      
      // Clean parentheses artifacts
      .replace(/\\\(/g, '(')
      .replace(/\\\)/g, ')')
      .replace(/\\\[/g, '[')
      .replace(/\\\]/g, ']')
      
      // Remove standalone symbols
      .replace(/[\/\\]\s*[A-Z]\s*/g, ' ')
      .replace(/\s+[\/\\]+\s+/g, ' ')
      .replace(/\$[0-9A-Za-z]+/g, ' ')
      .replace(/\^[A-Z\[\]]/g, ' ')
      .replace(/\|+/g, ' ')
      .replace(/>>+/g, ' ')
      .replace(/<<+/g, ' ')
      
      // Remove random artifacts
      .replace(/\s+[\.\-_]+\s+/g, ' ')
      .replace(/\b[A-Z]{1}\s+[a-z]{1}\s+[A-Z]{1}\b/g, ' ')
      .replace(/\b[A-Za-z]\s+[A-Za-z]\s+[A-Za-z]\s+[A-Za-z]\s+[A-Za-z]\b/g, ' ')
      
      // Normalize whitespace
      .replace(/\s+/g, ' ')
      .replace(/\n\s+/g, '\n')
      .replace(/\s+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    
    console.log('Cleaned length:', cleaned.length);
    console.log('Cleaned sample:', cleaned.substring(0, 200));
    
    return cleaned;
  }

  static extractReadableWords(text: string): string[] {
    const cleaned = this.clean(text);
    const words = cleaned.split(/\s+/)
      .filter(word => word.length > 0)
      .filter(word => word.length >= 2 && word.length <= 30)
      .filter(word => /^[a-zA-Z0-9@.\-+()]+$/.test(word))
      .filter(word => !word.includes('/'))
      .filter(word => !word.includes('\\'))
      .filter(word => !/^[0-9]+$/.test(word) || word.length >= 10); // Keep long numbers (phones)
    
    return words;
  }

  static extractSentences(text: string): string[] {
    const cleaned = this.clean(text);
    return cleaned.split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 10 && s.length < 200)
      .filter(s => /^[A-Za-z]/.test(s)); // Must start with letter
  }
}
