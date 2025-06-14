
export function cleanText(text: string): string {
  return text
    .replace(/^%PDF-[\d.]+\s*/, '') // Remove PDF headers
    .replace(/[^\w\s@.-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function extractLines(text: string): string[] {
  return text
    .split(/[\n\r]+/)
    .map(line => line.trim())
    .filter(line => line.length > 0);
}

export function extractValueForKey(lines: string[], keys: string[]): string | null {
  const keyPattern = new RegExp(`^\\s*(?:${keys.join('|')})\\s*[:\\-]?\\s*(.+)`, 'i');
  for (const line of lines) {
    const match = line.match(keyPattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return null;
}

export function findSection(text: string, sectionNames: string[]): string | null {
  const lines = extractLines(text);
  let sectionStart = -1;
  let sectionEnd = lines.length;

  // Find section start
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    if (sectionNames.some(name => line.includes(name.toLowerCase()) && line.length < 50)) {
      sectionStart = i + 1;
      break;
    }
  }

  if (sectionStart === -1) return null;

  // Find section end (next section header)
  const sectionHeaders = ['experience', 'education', 'skills', 'projects', 'certifications', 'languages', 'summary'];
  for (let i = sectionStart; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    if (line.length < 50 && sectionHeaders.some(header => line.includes(header) && !sectionNames.includes(header))) {
      sectionEnd = i;
      break;
    }
  }

  return lines.slice(sectionStart, sectionEnd).join('\n');
}
