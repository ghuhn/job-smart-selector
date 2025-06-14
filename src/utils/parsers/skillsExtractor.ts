
import { findSection } from './common';

export function extractSkills(text: string): string[] {
    const skillsSection = findSection(text, ['skills', 'technical skills', 'technologies', 'proficiencies']);
    const searchText = skillsSection || text;

    const commonSkills = [
      'JavaScript', 'Python', 'Java', 'React', 'Angular', 'Vue', 'Node.js', 'Express',
      'HTML', 'CSS', 'TypeScript', 'SQL', 'MongoDB', 'PostgreSQL', 'MySQL',
      'AWS', 'Azure', 'Docker', 'Kubernetes', 'Git', 'REST', 'GraphQL',
      'Machine Learning', 'Data Science', 'AI', 'TensorFlow', 'PyTorch',
      'Leadership', 'Communication', 'Project Management', 'Agile', 'Scrum'
    ];

    const foundSkills = new Set<string>();
    
    for (const skill of commonSkills) {
      if (searchText.toLowerCase().includes(skill.toLowerCase())) {
        foundSkills.add(skill);
      }
    }

    // Look for skill-like patterns (capitalized words in skills section)
    if (skillsSection) {
      const skillWords = skillsSection.match(/\b[A-Z][a-z]+(?:\.[a-z]+)*\b/g) || [];
      for (const word of skillWords) {
        if (word.length > 2 && word.length < 20) {
          foundSkills.add(word);
        }
      }
    }

    return Array.from(foundSkills).slice(0, 15);
}
