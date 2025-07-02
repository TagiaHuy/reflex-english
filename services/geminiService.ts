import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import type { HelpContent } from '../types';

class GeminiService {
  private ai: GoogleGenAI;
  private chat: Chat | null = null;
  private model: string = 'gemini-1.5-flash';

  constructor() {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY is not configured in environment variables.");
    }
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  public setModel(model: 'gemini-1.5-flash' | 'gemini-2.5-flash-preview-04-17') {
    this.model = model;
  }

  public getModel(): string {
    return this.model;
  }

  public startChat(systemPrompt: string): void {
    this.chat = this.ai.chats.create({
      model: this.model,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.5,
        topP: 0.8,
      },
    });
  }

  public async sendMessage(message: string, scenarioTitle?: string, chatHistory?: string): Promise<{ reply: string, suggestions: string[] }> {
    if (!this.chat) {
      throw new Error("Chat not initialized. Call startChat first.");
    }
    try {
      const prompt = `
Reply as a natural English conversation partner in the scenario: "${scenarioTitle || ''}".
Recent chat:
${chatHistory || ''}

Reply concisely. Also suggest 3 short, natural English sentences the user could say next. Respond in JSON:
{"reply": "<your reply>", "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]}
`;
      const response: GenerateContentResponse = await this.chat.sendMessage({ message: prompt });
      let jsonStr = response.text.trim();
      const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
      const match = jsonStr.match(fenceRegex);
      if (match && match[2]) {
        jsonStr = match[2].trim();
      }
      let parsed;
      try {
        parsed = JSON.parse(jsonStr);
      } catch (e) {
        return { reply: response.text, suggestions: [] };
      }
      return {
        reply: parsed.reply || response.text,
        suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
      };
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      return { reply: "I'm sorry, I'm having a little trouble responding right now. Could you please try again?", suggestions: [] };
    }
  }

  private parseJsonFromResponse(text: string): any {
    let jsonStr = text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    try {
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error("Failed to parse JSON response:", e);
      console.error("Original string:", text);
      return null;
    }
  }

  public async getHelpContent(chatHistory: string, scenarioTitle: string): Promise<HelpContent | null> {
    const prompt = `
      The user is practicing an English conversation for the scenario: "${scenarioTitle}".
      Here is the recent chat history:
      ${chatHistory}

      The user is stuck and needs help. Provide helpful content in a JSON object format. The JSON object should have three keys:
      1. "sampleSentences": An array of 3 distinct, natural-sounding sentences the user could say next.
      2. "grammarTip": A short, simple grammar tip related to the conversation.
      3. "pronunciationFocus": An object with two keys: "sentence" (one of the sample sentences) and "explanation" (a brief tip on its pronunciation, like linking sounds or stress).

      Example Response:
      {
        "sampleSentences": [
          "That's a good point, I hadn't thought of it that way.",
          "Could you tell me a little more about that?",
          "I'm not sure, what do you think?"
        ],
        "grammarTip": "Remember to use 'a' before a consonant sound and 'an' before a vowel sound, like 'a good point' or 'an interesting idea'.",
        "pronunciationFocus": {
          "sentence": "I hadn't thought of it that way.",
          "explanation": "Try linking the words 'thought' and 'of', and 'of' and 'it'. It sounds like 'thought-of-it'."
        }
      }
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.5,
        },
      });
      const parsedJson = this.parseJsonFromResponse(response.text);
      return parsedJson as HelpContent;
    } catch (error) {
      console.error("Error getting help content:", error);
      return null;
    }
  }

  public async getPronunciationFeedback(userText: string): Promise<string | null> {
    const prompt = `
      As an encouraging English pronunciation coach, analyze the following sentence spoken by a language learner: "${userText}".
      Provide one short, simple, and encouraging piece of feedback focusing on a potential pronunciation challenge (e.g., a specific sound, word stress, or rhythm). Frame it constructively.
      Respond with a JSON object containing a single key "feedback".

      Example for "I want to order one latte.":
      {
        "feedback": "Great start! For 'latte', try putting the stress on the first part: 'LAH-tay'. You're doing great!"
      }
       Example for "Tell me about yourself.":
      {
        "feedback": "Excellent question! Remember to make the 'our' in 'yourself' sound like 'er' for a more natural flow: 'yer-SELF'."
      }
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.3,
        },
      });
      const parsedJson = this.parseJsonFromResponse(response.text);
      return parsedJson?.feedback || null;
    } catch (error) {
      console.error("Error getting pronunciation feedback:", error);
      return null;
    }
  }

  public async *sendMessageStream(message: string, scenarioTitle?: string, chatHistory?: string): AsyncGenerator<{ partial: string, done: boolean, reply?: string, suggestions?: string[] }, void, unknown> {
    if (!this.chat) {
      throw new Error("Chat not initialized. Call startChat first.");
    }
    // Short, efficient prompt for fast, concise replies
    const prompt = `
Reply as a natural English conversation partner in the scenario: "${scenarioTitle || ''}".
Recent chat:
${chatHistory || ''}

Reply concisely. Also suggest 3 short, natural English sentences the user could say next. Respond in JSON:
{"reply": "<your reply>", "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]}
`;
    let fullText = '';
    const stream = await this.chat.sendMessageStream({ message: prompt });
    for await (const chunk of stream) {
      fullText += chunk.text;
      yield { partial: fullText, done: false };
    }
    // Try to parse the JSON from the full text
    let jsonStr = fullText.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    let parsed;
    try {
      parsed = JSON.parse(jsonStr);
    } catch (e) {
      yield { partial: fullText, done: true, reply: fullText, suggestions: [] };
      return;
    }
    yield {
      partial: fullText,
      done: true,
      reply: parsed.reply || fullText,
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
    };
  }

  public async translateToVietnamese(text: string): Promise<string> {
    try {
      const prompt = `Dịch đoạn văn sau sang tiếng Việt, giữ văn phong tự nhiên, không giải thích gì thêm:\n${text}`;
      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: prompt,
        config: {
          responseMimeType: 'text/plain',
          temperature: 0.3,
        },
      });
      return response.text.trim();
    } catch (error) {
      console.error('Error translating to Vietnamese:', error);
      return '';
    }
  }
}

export const geminiService = new GeminiService();
export const setGeminiModel = (model: 'gemini-1.5-flash' | 'gemini-2.5-flash-preview-04-17') => geminiService.setModel(model);
export const getGeminiModel = () => geminiService.getModel();