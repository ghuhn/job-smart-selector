
import { BaseMessage, HumanMessage, AIMessage } from "@langchain/core/messages";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import type { Candidate } from "@/types/candidates";

export class HRAgent {
  private llm: ChatGoogleGenerativeAI;

  constructor(apiKey: string) {
    this.llm = new ChatGoogleGenerativeAI({
      modelName: "gemini-pro",
      apiKey: apiKey,
      temperature: 0.3,
    });
  }

  async analyze(candidate: Candidate, jobDescription: any): Promise<{
    analysis: string;
    recommendations: string[];
    concerns: string[];
    strengths: string[];
    score: number;
    confidence: number;
  }> {
    const prompt = `
You are an HR Agent specializing in initial candidate screening. Analyze this candidate for the position.

CANDIDATE:
Name: ${candidate.name}
Email: ${candidate.email}
Phone: ${candidate.phone}
Location: ${candidate.location}
Languages: ${candidate.languages.join(', ')}
Experience Years: ${candidate.experienceYears}

JOB REQUIREMENTS:
Position: ${jobDescription.jobTitle}
Location: ${jobDescription.location}
Experience Required: ${jobDescription.experienceLevel}

Provide a comprehensive HR screening analysis focusing on:
1. Contact information completeness
2. Location compatibility
3. Communication potential based on languages
4. Initial suitability assessment

Return your analysis in this exact format:
ANALYSIS: [Your detailed analysis]
SCORE: [Number 0-100]
CONFIDENCE: [Number 0-100]
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
  } {
    const analysis = this.extractSection(response, 'ANALYSIS:') || 'HR screening completed';
    const score = parseInt(this.extractSection(response, 'SCORE:') || '75');
    const confidence = parseInt(this.extractSection(response, 'CONFIDENCE:') || '80');
    const recommendations = this.extractList(response, 'RECOMMENDATIONS:');
    const concerns = this.extractList(response, 'CONCERNS:');
    const strengths = this.extractList(response, 'STRENGTHS:');

    return {
      analysis,
      score: Math.min(Math.max(score, 0), 100),
      confidence: Math.min(Math.max(confidence, 0), 100),
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
      } else if (line.includes(':') && !line.startsWith(' ')) {
        break; // Next section started
      }
    }
    
    return items;
  }
}
