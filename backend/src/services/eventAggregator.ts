import prisma from "../config/database"

import { fetchGoogleEvents } from "./googleEventsFetcher"
import { fetchEventbriteEvents } from "./eventbriteFetcher"
import { normalizeExternalEvent } from "../utils/eventNormalizer"

export const syncExternalEvents = async () => {

  console.log("Syncing external events...")

  // ------------------------------
  // 1️⃣ Fetch all external sources in parallel
  // ------------------------------
  const [googleEvents, eventbriteEvents] = await Promise.all([
    fetchGoogleEvents(),
    fetchEventbriteEvents()
  ])

  console.log(`Fetched ${googleEvents.length} Google events`)
  console.log(`Fetched ${eventbriteEvents.length} Eventbrite events`)

  // ------------------------------
  // 2️⃣ Normalize events
  // ------------------------------
  const normalizedEvents = [
    ...googleEvents.map((e: any) => normalizeExternalEvent(e, "google")),
    ...eventbriteEvents.map((e: any) => normalizeExternalEvent(e, "eventbrite"))
  ]

  // ------------------------------
  // 3️⃣ Remove invalid events
  // ------------------------------
  const cleanedEvents = normalizedEvents
    .filter(e => e.externalUrl) // must have URL
    .map(e => ({
      ...e,

      // Ensure required schema fields
      startTime: e.startTime || "00:00",
      endTime: e.endTime || "23:59",

      images: e.images || [],
      ...(e as any).tags ? { tags: (e as any).tags } : {},

      price: e.price ?? 0,
      currency: e.currency || "KES",

      status: "UPCOMING",

      categoryId: process.env.EXTERNAL_EVENTS_CATEGORY_ID || null
    }))

  // ------------------------------
  // 4️⃣ Remove duplicates in memory
  // ------------------------------
  const uniqueMap = new Map()

  for (const event of cleanedEvents) {
    uniqueMap.set(event.externalUrl, event)
  }

  const uniqueEvents = Array.from(uniqueMap.values())

  console.log(`After deduplication: ${uniqueEvents.length} events`)

  if (uniqueEvents.length === 0) {
    console.log("No new events to insert")
    return 0
  }

  // ------------------------------
  // 5️⃣ Insert events using createMany
  // ------------------------------
  const result = await prisma.event.createMany({
    data: uniqueEvents,
    skipDuplicates: true
  })

  console.log(`Inserted ${result.count} new external events`)

  return result.count
}