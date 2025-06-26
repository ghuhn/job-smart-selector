
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

    // Define sequential workflow
    workflow.addEdge(START, "hr_agent");
    workflow.addEdge("hr_agent", "technical_agent");
    workflow.addEdge("technical_agent", "experience_agent");
    workflow.addEdge("experience_agent", "cultural_agent");
    workflow.addEdge("cultural_agent", "final_reviewer");
    workflow.addEdge("final_reviewer", END);
  }
}
