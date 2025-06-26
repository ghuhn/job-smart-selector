
import { BaseMessage, HumanMessage } from "@langchain/core/messages";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import type { Candidate, AgentFeedback } from "@/types/candidates";

export class FinalReviewerAgent {
  private llm: ChatGoogleGenerativeAI;

  constructor(apiKey: string) {
    this.llm = new ChatGoogleGenerativeAI({
      model: "gemini-pro",
      apiKey: apiKey,
      temperature: 0.2,
    });
  }

  async analyze(
    candidate: Candidate, 
    jobDescription: any, 
    agentFeedbacks: AgentFeedback[]
  ): Promise<{
    analysis: string;
    recommendations: string[];
    concerns: string[];
    strengths: string[];
    score: number;
    confidence: number;
    finalRecommendation: string;
  }> {
    const feedbackSummary = agentFeedbacks.map(f => 
      `${f.agent}: Score ${f.confidence}% - ${f.analysis.substring(0, 200)}...`
    ).join('\n');

    const prompt = `
You are the Final Reviewer Agent responsible for making the ultimate hiring decision. Synthesize all agent feedback and provide a comprehensive final assessment.

CANDIDATE: ${candidate.name}
JOB: ${jobDescription.jobTitle}

AGENT FEEDBACK SUMMARY:
${feedbackSummary}

OVERALL SCORES:
HR: ${agentFeedbacks.find(f => f.agent === 'HR Agent')?.confidence || 75}%
Technical: ${agentFeedbacks.find(f => f.agent === 'Technical Evaluator')?.confidence || 75}%
Experience: ${agentFeedbacks.find(f => f.agent === 'Experience Analyzer')?.confidence || 75}%
Cultural Fit: ${agentFeedbacks.find(f => f.agent === 'Cultural Fit Assessor')?.confidence || 75}%

Provide your final comprehensive review focusing on:
1. Overall candidate suitability
2. Risk assessment
3. Growth potential
4. Final hiring recommendation

Return your analysis in this exact format:
ANALYSIS: [Your comprehensive final analysis]
SCORE: [Number 0-100 - overall weighted score]
CONFIDENCE: [Number 0-100 - your confidence in this assessment]
FINAL_RECOMMENDATION: [HIRE/CONDITIONAL_HIRE/REJECT with reasoning]
RECOMMENDATIONS: [Bullet point list]
CONCERNS: [Bullet point list]
STRENGTHS: [Bullet point list]
`;

    const messages = [new HumanMessage(prompt)];
    const response = await this.llm.invoke(messages);
    
    return this.parseResponse(response.content as string);
  }

  private parseResponse(response: string): {
    analysis: string;
    recommendations: string[];
    concerns: string[];
    strengths: string[];
    score: number;
    confidence: number;
    finalRecommendation: string;
  } {
    const analysis = this.extractSection(response, 'ANALYSIS:') || 'Final comprehensive review completed';
    const score = parseInt(this.extractSection(response, 'SCORE:') || '75');
    const confidence = parseInt(this.extractSection(response, 'CONFIDENCE:') || '85');
    const finalRecommendation = this.extractSection(response, 'FINAL_RECOMMENDATION:') || 'Further evaluation required';
    const recommendations = this.extractList(response, 'RECOMMENDATIONS:');
    const concerns = this.extractList(response, 'CONCERNS:');
    const strengths = this.extractList(response, 'STRENGTHS:');

    return {
      analysis,
      score: Math.min(Math.max(score, 0), 100),
      confidence: Math.min(Math.max(confidence, 0), 100),
      finalRecommendation,
      recommendations,
      concerns,
      strengths
    };
  }

  private extractSection(text: string, marker: string): string {
    const lines = text.split('\n');
    const startIndex = lines.findIndex(line => line.includes(marker));
    if (startIndex === -1) return '';
    
    return lines[startIndex].replace(marker, '').trim();
  }

  private extractList(text: string, marker: string): string[] {
    const lines = text.split('\n');
    const startIndex = lines.findIndex(line => line.includes(marker));
    if (startIndex === -1) return [];
    
    const items: string[] = [];
    for (let i = startIndex + 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('-') || line.startsWith('•')) {
        items.push(line.replace(/^[-•]\s*/, ''));
      } else if (line.includes(':') && !line.startsWith(' ') && line !== lines[startIndex]) {
        break;
      }
    }
    
    return items;
  }
}
