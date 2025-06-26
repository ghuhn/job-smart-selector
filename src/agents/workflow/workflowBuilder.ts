
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

    // Define sequential workflow using edges - cast node names to any to bypass strict typing
    workflow.addEdge(START as any, "hr_agent" as any);
    workflow.addEdge("hr_agent" as any, "technical_agent" as any);
    workflow.addEdge("technical_agent" as any, "experience_agent" as any);
    workflow.addEdge("experience_agent" as any, "cultural_agent" as any);
    workflow.addEdge("cultural_agent" as any, "final_reviewer" as any);
    workflow.addEdge("final_reviewer" as any, END as any);
  }
}
