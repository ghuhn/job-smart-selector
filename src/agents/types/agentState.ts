
import type { Candidate, CandidateAnalysis, AgentFeedback } from '@/types/candidates';

export interface AgentState {
  candidate: Candidate;
  jobDescription: any;
  hrFeedback?: AgentFeedback;
  technicalFeedback?: AgentFeedback;
  experienceFeedback?: AgentFeedback;
  culturalFeedback?: AgentFeedback;
  finalFeedback?: AgentFeedback;
  finalAnalysis?: CandidateAnalysis;
}
