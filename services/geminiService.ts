import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import type { HelpContent } from '../types';

// Danh sách các model hỗ trợ
export const GEMINI_MODELS = [
  { value: 'gemini-2.5-flash-lite-preview-06-17', label: 'Gemini 2.5 Flash-Lite Preview 06-17 (Miễn phí, tiết kiệm)' },
  { value: 'gemini-2.5-flash-preview-04-17', label: 'Gemini 2.5 Flash (Miễn phí, nhanh)' },
  { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro (Miễn phí, thông minh nhất)' },
  { value: 'gemini-2.0-flash-lite', label: 'Gemini 2.0 Flash-Lite (Miễn phí)' },
  { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash (Miễn phí)' },
  { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash (Cũ)' },
  // Thêm model mới tại đây nếu muốn
];

// Danh sách các API key mặc định
export const GEMINI_API_KEYS = [
  'AIzaSyBk3rP0TW0qzcw0ntK5dLoS0XKrtxEoMZk',
  'AIzaSyDwiMaECbXn9hBW2CXsUgn8MQzgVZgSvOM',
  'AIzaSyAfHv6EakHjE4bLkdSYD2GtyWR4rR3FtPo',
];
const API_KEY_STORAGE = 'reflex-english-gemini-api-key';

function getInitialApiKey() {
  return localStorage.getItem(API_KEY_STORAGE) || GEMINI_API_KEYS[0];
}

class GeminiService {
  private ai: GoogleGenAI;
  private chat: Chat | null = null; 
  private model: string = GEMINI_MODELS[0].value; 
  private apiKey: string;

  constructor() {
    this.apiKey = getInitialApiKey();
    this.ai = new GoogleGenAI({ apiKey: this.apiKey });
  }

  public setApiKey(newKey: string) {
    this.apiKey = newKey;
    localStorage.setItem(API_KEY_STORAGE, newKey);
    this.ai = new GoogleGenAI({ apiKey: newKey });
  }

  public getApiKey(): string {
    return this.apiKey;
  }

  public setModel(model: string) {
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
      let jsonStr = (response.text ?? '').trim();
      const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
      const match = jsonStr.match(fenceRegex);
      if (match && match[2]) {
        jsonStr = match[2].trim();
      }
      let parsed;
      try {
        parsed = JSON.parse(jsonStr);
      } catch (e) {
        return { reply: response.text ?? '', suggestions: [] };
      }
      return {
        reply: parsed.reply || (response.text ?? ''),
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
Bạn là trợ lý luyện nói tiếng Anh. Dựa trên hội thoại sau về chủ đề "${scenarioTitle}":
${chatHistory}

Trả về JSON với 3 trường:
- "sampleSentences": 3 câu tiếng Anh tự nhiên mà người học có thể nói tiếp.
- "grammarTip": 1 mẹo ngữ pháp ngắn gọn liên quan hội thoại.
- "pronunciationFocus": object gồm "sentence" (1 câu trong sampleSentences) và "explanation" (mẹo phát âm ngắn).

Chỉ trả về JSON, không giải thích thêm.
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
      const parsedJson = this.parseJsonFromResponse(response.text ?? '');
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
      const parsedJson = this.parseJsonFromResponse(response.text ?? '');
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
      return (response.text ?? '').trim();
    } catch (error) {
      console.error('Error translating to Vietnamese:', error);
      return '';
    }
  }

  public async generateRandomScenarioAI(): Promise<{ title: string, emoji: string, description: string, systemPrompt: string } | null> {
    const prompt = `
Hãy tạo ngẫu nhiên một ngữ cảnh hội thoại thực tế để luyện nói tiếng Anh. Trả về JSON với 4 trường:
- "title": tiêu đề ngắn gọn cho ngữ cảnh (tiếng Anh)
- "emoji": 1 emoji phù hợp
- "description": mô tả ngắn về ngữ cảnh (tiếng Anh)
- "systemPrompt": hướng dẫn AI đóng vai phù hợp (tiếng Anh, cụ thể, tự nhiên)
Chỉ trả về JSON, không giải thích thêm.
`;
    try {
      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.9,
        },
      });
      const parsedJson = this.parseJsonFromResponse(response.text ?? '');
      if (
        parsedJson &&
        typeof parsedJson.title === 'string' &&
        typeof parsedJson.emoji === 'string' &&
        typeof parsedJson.description === 'string' &&
        typeof parsedJson.systemPrompt === 'string'
      ) {
        return parsedJson;
      }
      return null;
    } catch (error) {
      console.error("Error generating random scenario:", error);
      return null;
    }
  }
}

export const geminiService = new GeminiService();
export const setGeminiModel = (model: string) => geminiService.setModel(model);
export const getGeminiModel = () => geminiService.getModel();