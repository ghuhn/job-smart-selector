import { StateGraph, END, START } from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages";
import { HRAgent } from './hrAgent';
import { TechnicalAgent } from './technicalAgent';
import { ExperienceAgent } from './experienceAgent';
import { CulturalFitAgent } from './culturalFitAgent';
import { FinalReviewerAgent } from './finalReviewerAgent';
import type { Candidate, CandidateAnalysis, AgentFeedback, Scores } from '@/types/candidates';

interface AgentState {
  candidate: Candidate;
  jobDescription: any;
  hrFeedback?: AgentFeedback;
  technicalFeedback?: AgentFeedback;
  experienceFeedback?: AgentFeedback;
  culturalFeedback?: AgentFeedback;
  finalFeedback?: AgentFeedback;
  finalAnalysis?: CandidateAnalysis;
}

export class LangGraphOrchestrator {
  private hrAgent: HRAgent;
  private technicalAgent: TechnicalAgent;
  private experienceAgent: ExperienceAgent;
  private culturalFitAgent: CulturalFitAgent;
  private finalReviewerAgent: FinalReviewerAgent;
  private workflow: StateGraph<AgentState>;

  constructor(apiKey: string) {
    // Initialize all agents
    this.hrAgent = new HRAgent(apiKey);
    this.technicalAgent = new TechnicalAgent(apiKey);
    this.experienceAgent = new ExperienceAgent(apiKey);
    this.culturalFitAgent = new CulturalFitAgent(apiKey);
    this.finalReviewerAgent = new FinalReviewerAgent(apiKey);

    // Build the LangGraph workflow with simpler state definition
    this.workflow = new StateGraph<AgentState>({
      channels: {
        candidate: null,
        jobDescription: null,
        hrFeedback: null,
        technicalFeedback: null,
        experienceFeedback: null,
        culturalFeedback: null,
        finalFeedback: null,
        finalAnalysis: null,
      }
    });

    this.buildWorkflow();
  }

  private buildWorkflow() {
    // Add nodes for each agent
    this.workflow.addNode("hr_agent", this.hrAgentNode.bind(this));
    this.workflow.addNode("technical_agent", this.technicalAgentNode.bind(this));
    this.workflow.addNode("experience_agent", this.experienceAgentNode.bind(this));
    this.workflow.addNode("cultural_agent", this.culturalAgentNode.bind(this));
    this.workflow.addNode("final_reviewer", this.finalReviewerNode.bind(this));

    // Use START and END constants correctly with custom node names
    this.workflow.addEdge(START, "hr_agent");
    this.workflow.addEdge("hr_agent", "technical_agent");
    this.workflow.addEdge("technical_agent", "experience_agent");
    this.workflow.addEdge("experience_agent", "cultural_agent");
    this.workflow.addEdge("cultural_agent", "final_reviewer");
    this.workflow.addEdge("final_reviewer", END);
  }

  private async hrAgentNode(state: AgentState): Promise<Partial<AgentState>> {
    console.log("HR Agent processing candidate:", state.candidate.name);
    
    const result = await this.hrAgent.analyze(state.candidate, state.jobDescription);
    
    const hrFeedback: AgentFeedback = {
      agent: "HR Agent",
      analysis: result.analysis,
      recommendations: result.recommendations,
      concerns: result.concerns,
      strengths: result.strengths,
      confidence: result.confidence
    };

    return { hrFeedback };
  }

  private async technicalAgentNode(state: AgentState): Promise<Partial<AgentState>> {
    console.log("Technical Agent processing candidate:", state.candidate.name);
    
    const result = await this.technicalAgent.analyze(state.candidate, state.jobDescription);
    
    const technicalFeedback: AgentFeedback = {
      agent: "Technical Evaluator",
      analysis: result.analysis,
      recommendations: result.recommendations,
      concerns: result.concerns,
      strengths: result.strengths,
      confidence: result.confidence
    };

    return { technicalFeedback };
  }

  private async experienceAgentNode(state: AgentState): Promise<Partial<AgentState>> {
    console.log("Experience Agent processing candidate:", state.candidate.name);
    
    const result = await this.experienceAgent.analyze(state.candidate, state.jobDescription);
    
    const experienceFeedback: AgentFeedback = {
      agent: "Experience Analyzer",
      analysis: result.analysis,
      recommendations: result.recommendations,
      concerns: result.concerns,
      strengths: result.strengths,
      confidence: result.confidence
    };

    return { experienceFeedback };
  }

  private async culturalAgentNode(state: AgentState): Promise<Partial<AgentState>> {
    console.log("Cultural Fit Agent processing candidate:", state.candidate.name);
    
    const result = await this.culturalFitAgent.analyze(state.candidate, state.jobDescription);
    
    const culturalFeedback: AgentFeedback = {
      agent: "Cultural Fit Assessor",
      analysis: result.analysis,
      recommendations: result.recommendations,
      concerns: result.concerns,
      strengths: result.strengths,
      confidence: result.confidence
    };

    return { culturalFeedback };
  }

  private async finalReviewerNode(state: AgentState): Promise<Partial<AgentState>> {
    console.log("Final Reviewer processing candidate:", state.candidate.name);
    
    // All agent feedbacks should be available at this point
    const agentFeedbacks = [
      state.hrFeedback!,
      state.technicalFeedback!,
      state.experienceFeedback!,
      state.culturalFeedback!
    ];

    const result = await this.finalReviewerAgent.analyze(
      state.candidate, 
      state.jobDescription, 
      agentFeedbacks
    );
    
    const finalFeedback: AgentFeedback = {
      agent: "Final Reviewer",
      analysis: result.analysis,
      recommendations: result.recommendations,
      concerns: result.concerns,
      strengths: result.strengths,
      confidence: result.confidence
    };

    // Calculate comprehensive scores
    const scores: Scores = {
      technical: state.technicalFeedback?.confidence || 75,
      experience: state.experienceFeedback?.confidence || 75,
      education: Math.min(85, 60 + (state.candidate.education.length * 10)),
      communication: state.hrFeedback?.confidence || 75,
      cultural_fit: state.culturalFeedback?.confidence || 75,
      project_relevance: Math.min(90, 65 + (state.candidate.projects.length * 8)),
      skill_match: state.technicalFeedback?.confidence || 75,
      overall: result.score
    };

    // Compile all strengths and concerns
    const allStrengths = [
      ...state.hrFeedback?.strengths || [],
      ...state.technicalFeedback?.strengths || [],
      ...state.experienceFeedback?.strengths || [],
      ...state.culturalFeedback?.strengths || []
    ];

    const allConcerns = [
      ...state.hrFeedback?.concerns || [],
      ...state.technicalFeedback?.concerns || [],
      ...state.experienceFeedback?.concerns || [],
      ...state.culturalFeedback?.concerns || []
    ];

    const finalAnalysis: CandidateAnalysis = {
      rank: 0,
      candidate: state.candidate,
      scores,
      strengths: allStrengths,
      redFlags: allConcerns,
      recommendation: result.finalRecommendation,
      agentFeedbacks: [...agentFeedbacks, finalFeedback],
      detailedAnalysis: {
        skillGaps: state.technicalFeedback?.concerns || [],
        experienceMatch: state.experienceFeedback?.analysis || "Experience evaluated",
        educationFit: state.candidate.education.length > 0 ? "Education requirements satisfied" : "Education background needs clarification",
        projectRelevance: state.candidate.projects.length > 0 ? "Relevant project experience demonstrated" : "Project portfolio needs development",
        growthPotential: result.score >= 80 ? "High growth potential" : result.score >= 70 ? "Good growth potential" : "Moderate growth potential"
      },
      overallFit: result.score >= 90 ? "Excellent" : 
                  result.score >= 80 ? "Good" : 
                  result.score >= 70 ? "Fair" : 
                  result.score >= 60 ? "Below Average" : "Poor"
    };

    return { finalFeedback, finalAnalysis };
  }

  async processCandidateWithLangGraph(candidate: Candidate, jobDescription: any): Promise<CandidateAnalysis> {
    console.log("=== LangGraph Multi-Agent Processing Started ===");
    console.log("Processing candidate:", candidate.name);

    const compiledGraph = this.workflow.compile();
    
    const initialState: AgentState = {
      candidate,
      jobDescription
    };

    const result = await compiledGraph.invoke(initialState);
    
    console.log("=== LangGraph Processing Complete ===");
    
    if (!result.finalAnalysis) {
      throw new Error("LangGraph workflow failed to produce final analysis");
    }

    return result.finalAnalysis;
  }
}
