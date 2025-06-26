
import { SmartCandidateExtractor } from '@/utils/candidateExtractor';
import { LangGraphOrchestrator } from '@/agents/langGraphOrchestrator';
import type { 
  Candidate, 
  CandidateAnalysis
} from '@/types/candidates';

class LangGraphMultiAgentSystem {
  private orchestrator: LangGraphOrchestrator | null = null;

  constructor() {
    // Initialize with Gemini API key
    const apiKey = "AIzaSyDc7w6fSuEeFiEOKV_1mCxhxZXV5ZKZZfs"; // Your API key
    this.orchestrator = new LangGraphOrchestrator(apiKey);
  }

  async processMultipleResumes(uploadedResumes: any[], jobDescription: any): Promise<CandidateAnalysis[]> {
    console.log('=== LANGGRAPH MULTI-AGENT PROCESSING INITIATED ===');
    console.log('Processing resumes with real LangGraph agents...');
    console.log('Uploaded resumes:', uploadedResumes.length);
    console.log('Job description:', jobDescription);
    
    if (!this.orchestrator) {
      throw new Error("LangGraph orchestrator not initialized");
    }
    
    try {
      const analyses: CandidateAnalysis[] = [];
      
      for (let i = 0; i < uploadedResumes.length; i++) {
        const resume = uploadedResumes[i];
        console.log(`=== Processing candidate ${i + 1}: ${resume.name} ===`);
        
        try {
          // Extract candidate data using resume parser
          const candidate = await SmartCandidateExtractor.extractCandidate(resume);
          console.log('Extracted candidate data:', candidate);
          
          // Process through LangGraph multi-agent workflow
          const analysis = await this.orchestrator.processCandidateWithLangGraph(candidate, jobDescription);
          analysis.rank = i + 1; // Temporary rank, will be re-ranked later
          
          analyses.push(analysis);
          console.log(`Completed analysis for ${candidate.name}`);
          
        } catch (candidateError) {
          console.error(`Error processing candidate ${i + 1}:`, candidateError);
          
          // Create fallback candidate
          const fallbackCandidate: Candidate = {
            name: resume.name || `Candidate ${i + 1}`,
            email: "Error parsing resume",
            phone: "Not provided",
            location: "Not provided",
            skills: [],
            technicalSkills: [],
            softSkills: [],
            experience: [],
            education: [],
            educationLevel: "Not provided",
            certifications: [],
            languages: [],
            projects: [],
            achievements: [],
            summary: "Resume parsing failed - please review manually",
            keywords: [],
            linkedIn: "Not provided",
            github: "Not provided",
            experienceYears: 0,
          };
          
          // Still process through LangGraph but with limited data
          const fallbackAnalysis = await this.orchestrator.processCandidateWithLangGraph(fallbackCandidate, jobDescription);
          fallbackAnalysis.rank = i + 1;
          analyses.push(fallbackAnalysis);
        }
      }
      
      // Rank candidates by overall score
      const sortedAnalyses = analyses.sort((a, b) => b.scores.overall - a.scores.overall);
      
      sortedAnalyses.forEach((analysis, index) => {
        analysis.rank = index + 1;
      });
      
      // Return top N candidates as specified
      const topN = parseInt(jobDescription.topNCandidates) || 3;
      const topCandidates = sortedAnalyses.slice(0, topN);
      
      console.log('=== LANGGRAPH PROCESSING COMPLETE ===');
      console.log(`Final results: ${topCandidates.length} top candidates selected`);
      return topCandidates;
      
    } catch (error) {
      console.error('Error in LangGraph multi-agent processing:', error);
      throw error;
    }
  }
}

export const langGraphMultiAgentSystem = new LangGraphMultiAgentSystem();
