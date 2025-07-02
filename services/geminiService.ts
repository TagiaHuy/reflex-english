import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import type { HelpContent } from '../types';

class GeminiService {
  private ai: GoogleGenAI;
  private chat: Chat | null = null;

  constructor() {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY is not configured in environment variables.");
    }
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  public startChat(systemPrompt: string): void {
    const enhancedPrompt = `${systemPrompt}\n\n**Important Rule:** Fully embody your character. If details like your name, age, or specific opinions are not in your description, you MUST invent them to make your character feel real. Do not be generic or use placeholders.`;

    this.chat = this.ai.chats.create({
      model: 'gemini-2.5-flash-preview-04-17',
      config: {
        systemInstruction: enhancedPrompt,
        temperature: 0.8,
        topP: 0.9,
      },
    });
  }

  public async sendMessage(message: string): Promise<string> {
    if (!this.chat) {
      throw new Error("Chat not initialized. Call startChat first.");
    }
    try {
      const response: GenerateContentResponse = await this.chat.sendMessage({ message });
      return response.text;
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      return "I'm sorry, I'm having a little trouble responding right now. Could you please try again?";
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
      \`\`\`json
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
      \`\`\`
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
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
      \`\`\`json
      {
        "feedback": "Great start! For 'latte', try putting the stress on the first part: 'LAH-tay'. You're doing great!"
      }
      \`\`\`
       Example for "Tell me about yourself.":
      \`\`\`json
      {
        "feedback": "Excellent question! Remember to make the 'our' in 'yourself' sound like 'er' for a more natural flow: 'yer-SELF'."
      }
      \`\`\`
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
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
}

export const geminiService = new GeminiService();