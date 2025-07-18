export enum MessageSender {
  User = 'user',
  AI = 'ai',
  System = 'system',
}

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  text: string;
  pronunciationFeedback?: string | null;
  suggestions?: string[];
  translation?: string;
}

export interface Scenario {
  id: string;
  title: string;
  emoji: string;
  description: string;
  systemPrompt: string;
}

export interface HelpContent {
  sampleSentences: string[];
  grammarTip: string;
  pronunciationFocus: {
    sentence: string;
    explanation: string;
  };
}
