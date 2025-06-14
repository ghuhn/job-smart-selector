
import type { Candidate } from '@/types/candidates';
import { geminiAPI } from '../geminiApi';
import { PromptBuilder } from './promptBuilder';
import { OutputParser } from './outputParser';

export class ResumeParser {
    static async parse(resumeContent: string): Promise<Partial<Candidate>> {
        const prompt = PromptBuilder.buildPrompt(resumeContent);
        
        console.log("--- Sending prompt to LLM for resume parsing ---");
        const llmOutput = await geminiAPI.generateContent(prompt);
        console.log("--- Received LLM response ---", llmOutput);
        
        return OutputParser.parseLlmOutput(llmOutput);
    }
}
