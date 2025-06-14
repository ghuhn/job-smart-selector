
import { EnhancedResumeParser } from './enhancedResumeParser';
import { Candidate } from './multiAgentSystem';

export class SmartCandidateExtractor {
  static async extractCandidate(resume: any): Promise<Candidate> {
    console.log('=== SMART CANDIDATE EXTRACTION (Enhanced) ===');
    
    // Use the new enhanced parser
    const extractedData = EnhancedResumeParser.parseResume(resume);
    
    // Convert to the expected Candidate interface
    const candidate: Candidate = {
      ...extractedData
    };

    console.log('=== FINAL ENHANCED CANDIDATE ===');
    console.log(candidate);

    return candidate;
  }
}
