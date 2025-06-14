
interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export class GeminiAPI {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateContent(prompt: string): Promise<string> {
    try {
      console.log('Making request to Gemini API...');
      console.log('API URL:', `${this.baseUrl}?key=${this.apiKey.substring(0, 10)}...`);
      
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Gemini API error (${response.status}): ${errorText}`);
      }

      const data: GeminiResponse = await response.json();
      console.log('Gemini API Response:', data);
      
      return data.candidates[0]?.content?.parts[0]?.text || 'No response generated';
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  }
}

// Updated API key and model endpoint
export const geminiAPI = new GeminiAPI('AIzaSyD992IvUFwDu3tml50Or_uKSokdzmHnHtY');
