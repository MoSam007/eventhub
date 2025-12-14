import { Request, Response, NextFunction } from 'express';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateEventContent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { eventDescription, category, location, date } = req.body;

    console.log('=== AI EVENT GENERATION REQUEST ===');
    console.log('Description:', eventDescription);

    // Generate event content using OpenAI
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are an expert event planner assistant. Generate comprehensive, engaging event content in JSON format. Be creative, professional, and detailed.`
        },
        {
          role: 'user',
          content: `Create a detailed event based on this description: "${eventDescription}"
          
Category: ${category || 'General'}
Location: ${location || 'TBD'}
Date: ${date || 'TBD'}

Generate a JSON response with:
{
  "title": "Catchy event title (max 100 chars)",
  "description": "Short engaging description (2-3 sentences, max 300 chars)",
  "longDescription": "HTML formatted detailed description with <p>, <h3>, <ul>, <li> tags (500-800 words)",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "features": ["WiFi Available", "Parking", "Food & Drinks", "Networking", "Certificates", "Photography"],
  "schedule": [
    {"time": "09:00", "activity": "Registration & Welcome Coffee"},
    {"time": "09:30", "activity": "Opening Remarks"},
    {"time": "10:00", "activity": "Main Session"},
    {"time": "12:00", "activity": "Lunch Break"},
    {"time": "13:00", "activity": "Workshop Session"},
    {"time": "15:00", "activity": "Closing & Networking"}
  ],
  "faqs": [
    {"question": "What should I bring?", "answer": "Detailed answer..."},
    {"question": "Is parking available?", "answer": "Detailed answer..."},
    {"question": "What's the dress code?", "answer": "Detailed answer..."},
    {"question": "Can I bring a guest?", "answer": "Detailed answer..."},
    {"question": "Are there food options?", "answer": "Detailed answer..."},
    {"question": "How do I get there?", "answer": "Detailed answer..."}
  ],
  "suggestedPrice": "1500",
  "suggestedCapacity": "150",
  "imagePrompts": [
    "Professional event photo prompt 1",
    "Professional event photo prompt 2",
    "Professional event photo prompt 3"
  ]
}

Make it professional, engaging, and specific to the event type.`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const generatedContent = JSON.parse(completion.choices[0].message.content || '{}');

    console.log('✅ AI content generated successfully');

    res.status(200).json({
      status: 'success',
      data: generatedContent,
    });
  } catch (error: any) {
    console.error('❌ AI generation error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to generate event content',
    });
  }
};

export const generateEventImages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { prompts, eventTitle } = req.body;

    console.log('=== AI IMAGE GENERATION REQUEST ===');
    console.log('Prompts:', prompts);

    if (!prompts || prompts.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Image prompts are required',
      });
    }

    // Generate images using DALL-E
    const imagePromises = prompts.slice(0, 3).map(async (prompt: string) => {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: `Professional event photography: ${prompt}. High quality, vibrant, engaging. Event: ${eventTitle}`,
        n: 1,
        size: "1024x1024",
        quality: "standard",
      });

      return response.data?.[0]?.url || '';
    });

    const imageUrls = await Promise.all(imagePromises);

    console.log('✅ Images generated successfully:', imageUrls.length);

    res.status(200).json({
      status: 'success',
      data: {
        urls: imageUrls,
      },
    });
  } catch (error: any) {
    console.error('❌ Image generation error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to generate images',
    });
  }
};