
import { StateGraph } from "@langchain/langgraph";
import { HRAgent } from './hrAgent';
import { TechnicalAgent } from './technicalAgent';
import { ExperienceAgent } from './experienceAgent';
import { CulturalFitAgent } from './culturalFitAgent';
import { FinalReviewerAgent } from './finalReviewerAgent';
import { WorkflowBuilder } from './workflow/workflowBuilder';
import { AgentNodes } from './nodes/agentNodes';
import type { AgentState } from './types/agentState';
import type { Candidate, CandidateAnalysis } from '@/types/candidates';

export class LangGraphOrchestrator {
  private hrAgent: HRAgent;
  private technicalAgent: TechnicalAgent;
  private experienceAgent: ExperienceAgent;
  private culturalFitAgent: CulturalFitAgent;
  private finalReviewerAgent: FinalReviewerAgent;
  private workflow: StateGraph<AgentState>;
  private agentNodes: AgentNodes;

  constructor(apiKey: string) {
    // Initialize all agents
    this.hrAgent = new HRAgent(apiKey);
    this.technicalAgent = new TechnicalAgent(apiKey);
    this.experienceAgent = new ExperienceAgent(apiKey);
    this.culturalFitAgent = new CulturalFitAgent(apiKey);
    this.finalReviewerAgent = new FinalReviewerAgent(apiKey);

    // Initialize agent nodes
    this.agentNodes = new AgentNodes(
      this.hrAgent,
      this.technicalAgent,
      this.experienceAgent,
      this.culturalFitAgent,
      this.finalReviewerAgent
    );

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
    WorkflowBuilder.buildWorkflow(
      this.workflow,
      this.agentNodes.hrAgentNode.bind(this.agentNodes),
      this.agentNodes.technicalAgentNode.bind(this.agentNodes),
      this.agentNodes.experienceAgentNode.bind(this.agentNodes),
      this.agentNodes.culturalAgentNode.bind(this.agentNodes),
      this.agentNodes.finalReviewerNode.bind(this.agentNodes)
    );
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
