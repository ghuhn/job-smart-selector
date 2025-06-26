
import { BaseMessage, HumanMessage } from "@langchain/core/messages";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import type { Candidate } from "@/types/candidates";

export class CulturalFitAgent {
  private llm: ChatGoogleGenerativeAI;

  constructor(apiKey: string) {
    this.llm = new ChatGoogleGenerativeAI({
      modelName: "gemini-pro",
      apiKey: apiKey,
      temperature: 0.4,
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
You are a Cultural Fit Assessor Agent specializing in evaluating soft skills and team compatibility. Analyze this candidate's cultural alignment.

CANDIDATE PROFILE:
Soft Skills: ${candidate.softSkills.join(', ')}
Languages: ${candidate.languages.join(', ')}
Summary: ${candidate.summary}
Achievements: ${candidate.achievements.join('; ')}

COMPANY CULTURE & JOB:
Position: ${jobDescription.jobTitle}
Company Culture: ${jobDescription.companyculture || 'Collaborative, innovative, results-driven'}
Team Environment: ${jobDescription.teamEnvironment || 'Cross-functional teams'}
Communication Style: ${jobDescription.communicationStyle || 'Open and direct'}

Provide a comprehensive cultural fit assessment focusing on:
1. Soft skills alignment with company values
2. Communication compatibility
3. Team collaboration potential
4. Cultural adaptability

Return your analysis in this exact format:
ANALYSIS: [Your detailed cultural fit analysis]
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
    const analysis = this.extractSection(response, 'ANALYSIS:') || 'Cultural fit assessment completed';
    const score = parseInt(this.extractSection(response, 'SCORE:') || '78');
    const confidence = parseInt(this.extractSection(response, 'CONFIDENCE:') || '75');
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
      } else if (line.includes(':') && !line.startsWith(' ') && line !== lines[startIndex]) {
        break;
      }
    }
    
    return items;
  }
}
