
import { BaseMessage, HumanMessage } from "@langchain/core/messages";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import type { Candidate } from "@/types/candidates";

export class ExperienceAgent {
  private llm: ChatGoogleGenerativeAI;

  constructor(apiKey: string) {
    this.llm = new ChatGoogleGenerativeAI({
      model: "gemini-pro",
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
You are an Experience Analyzer Agent specializing in evaluating career progression and experience relevance. Analyze this candidate's professional journey.

CANDIDATE EXPERIENCE:
Total Years: ${candidate.experienceYears}
Work History: ${candidate.experience.map(e => `${e.role} at ${e.company} (${e.duration}): ${e.description}`).join('; ')}
Achievements: ${candidate.achievements.join('; ')}

JOB REQUIREMENTS:
Position: ${jobDescription.jobTitle}
Required Experience: ${jobDescription.experienceLevel}
Industry: ${jobDescription.industry || 'Not specified'}

Provide a comprehensive experience assessment focusing on:
1. Years of experience alignment
2. Role progression and career growth
3. Industry relevance
4. Leadership and impact demonstration

Return your analysis in this exact format:
ANALYSIS: [Your detailed experience analysis]
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
    const analysis = this.extractSection(response, 'ANALYSIS:') || 'Experience analysis completed';
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
      } else if (line.includes(':') && !line.startsWith(' ') && line !== lines[startIndex]) {
        break;
      }
    }
    
    return items;
  }
}
