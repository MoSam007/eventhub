import api from './api';

export interface GenerateEventContentRequest {
  eventDescription: string;
  category?: string;
  location?: string;
  date?: string;
}

export interface GeneratedEventContent {
  title: string;
  description: string;
  longDescription: string;
  tags: string[];
  features: { name: string }[];
  schedule: { time: string; activity: string }[];
  faqs: { question: string; answer: string }[];
  suggestedPrice: string;
  suggestedCapacity: string;
  imagePrompts: string[];
}

export const aiService = {
  async generateEventContent(data: GenerateEventContentRequest): Promise<GeneratedEventContent> {
    const response = await api.post('/ai/generate-event-content', data);
    return response.data.data;
  },

  async generateEventImages(prompts: string[], eventTitle: string): Promise<string[]> {
    const response = await api.post('/ai/generate-event-images', {
      prompts,
      eventTitle,
    });
    return response.data.data.urls;
  },
};