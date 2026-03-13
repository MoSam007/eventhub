import OpenAI from "openai"
import slugify from "slugify"

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
})

// ------------------------------------
// Keyword based classifier (PRIMARY)
// ------------------------------------

const CATEGORY_KEYWORDS: Record<string, string[]> = {

  music: [
    "concert","dj","festival","live music","afrobeats","hip hop","karaoke","band"
  ],

  nightlife: [
    "party","club","after party","nightlife","rave"
  ],

  tech: [
    "tech","developer","ai","blockchain","startup","hackathon","software"
  ],

  business: [
    "conference","summit","networking","expo","entrepreneur","business"
  ],

  sports: [
    "marathon","race","football","fitness","cycling","run","tournament"
  ],

  food: [
    "brunch","wine","tasting","food festival","chef","dinner"
  ],

  art: [
    "gallery","art","exhibition","painting","design","museum"
  ],

  education: [
    "workshop","training","bootcamp","class","seminar","course"
  ]
}

// ------------------------------------
// Memory cache to prevent re-classifying
// ------------------------------------

const classificationCache = new Map<string,string>()

// ------------------------------------
// Keyword classifier
// ------------------------------------

function keywordClassifier(event:any) {

  const text = `${event.title} ${event.description}`.toLowerCase()

  for (const [category,keywords] of Object.entries(CATEGORY_KEYWORDS)) {

    for (const keyword of keywords) {

      if (text.includes(keyword)) {

        return category

      }

    }

  }

  return null

}

// ------------------------------------
// AI fallback classifier
// ------------------------------------

async function aiClassifier(event:any) {

  try {

    const prompt = `
Classify this event into ONE category from this list:

music
nightlife
tech
business
sports
food
art
education
general

Event title:
${event.title}

Description:
${event.description}

Respond ONLY with the category name.
`

    const res = await client.chat.completions.create({

      model: "llama-3.1-8b-instant", // cheaper + faster

      messages: [
        { role: "user", content: prompt }
      ],

      temperature: 0

    })

    const category = res.choices[0].message.content?.trim().toLowerCase()

    return category || "general"

  } catch (error:any) {

    console.warn("AI categorization failed:", error.message)

    return "general"

  }

}

// ------------------------------------
// Hybrid classifier
// ------------------------------------

export const classifyEventCategory = async (event:any) => {

  const cacheKey = slugify(event.title)

  // 1️⃣ Check cache
  if (classificationCache.has(cacheKey)) {

    return classificationCache.get(cacheKey)!

  }

  // 2️⃣ Keyword classifier
  const keywordCategory = keywordClassifier(event)

  if (keywordCategory) {

    classificationCache.set(cacheKey, keywordCategory)

    return keywordCategory

  }

  // 3️⃣ AI fallback
  const aiCategory = await aiClassifier(event)

  classificationCache.set(cacheKey, aiCategory)

  return aiCategory

}