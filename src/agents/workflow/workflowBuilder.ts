
import { StateGraph, END, START } from "@langchain/langgraph";
import type { AgentState } from '../types/agentState';

export class WorkflowBuilder {
  static buildWorkflow(
    workflow: StateGraph<AgentState>,
    hrAgentNode: (state: AgentState) => Promise<Partial<AgentState>>,
    technicalAgentNode: (state: AgentState) => Promise<Partial<AgentState>>,
    experienceAgentNode: (state: AgentState) => Promise<Partial<AgentState>>,
    culturalAgentNode: (state: AgentState) => Promise<Partial<AgentState>>,
    finalReviewerNode: (state: AgentState) => Promise<Partial<AgentState>>
  ) {
    // Add nodes for each agent
    workflow.addNode("hr_agent", hrAgentNode);
    workflow.addNode("technical_agent", technicalAgentNode);
    workflow.addNode("experience_agent", experienceAgentNode);
    workflow.addNode("cultural_agent", culturalAgentNode);
    workflow.addNode("final_reviewer", finalReviewerNode);

    // Set entry point
    workflow.setEntryPoint("hr_agent");
    
    // Define sequential workflow using conditional edges with proper typing
    workflow.addConditionalEdges(
      "hr_agent",
      () => "technical_agent"
    );
    
    workflow.addConditionalEdges(
      "technical_agent",
      () => "experience_agent"
    );
    
    workflow.addConditionalEdges(
      "experience_agent",
      () => "cultural_agent"
    );
    
    workflow.addConditionalEdges(
      "cultural_agent",
      () => "final_reviewer"
    );
    
    workflow.addConditionalEdges(
      "final_reviewer",
      () => END
    );
  }
}
