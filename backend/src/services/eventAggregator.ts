import prisma from "../config/database"

import { fetchGoogleEvents } from "./googleEventsFetcher"
import { fetchEventbriteEvents } from "./eventbriteFetcher"
import { fetchKenyaBuzzEvents } from "./kenyaBuzzFetcher"

import { normalizeExternalEvent } from "../utils/eventNormalizer"

import { enrichEventImage } from "./imageEnrichmet.service"
import { classifyEventCategory } from "./eventClassifier"

import { loadCategoryCache, resolveCategoryId } from "./categoryResolver.service"

export const syncExternalEvents = async () => {

  console.log("Starting Nairobi event ingestion...")

  // --------------------------------
  // Load category cache
  // --------------------------------

  await loadCategoryCache()

  // --------------------------------
  // Fetch sources in parallel
  // --------------------------------

  const [
    googleEvents,
    eventbriteEvents,
    kenyaBuzzEvents
  ] = await Promise.all([

    fetchGoogleEvents(),
    fetchEventbriteEvents(),
    fetchKenyaBuzzEvents()

  ])

  console.log(`Google events: ${googleEvents.length}`)
  console.log(`Eventbrite events: ${eventbriteEvents.length}`)
  console.log(`KenyaBuzz events: ${kenyaBuzzEvents.length}`)

  // --------------------------------
  // Normalize events
  // --------------------------------

  const normalized = [

    ...googleEvents.map((e:any)=>
      normalizeExternalEvent(e,"google")
    ),

    ...eventbriteEvents.map((e:any)=>
      normalizeExternalEvent(e,"eventbrite")
    ),

    ...kenyaBuzzEvents.map((e:any)=>
      normalizeExternalEvent(e,"kenyabuzz")
    )

  ]

  console.log(`Normalized events: ${normalized.length}`)

  // --------------------------------
  // AI categorization + image enrichment
  // --------------------------------

  const enrichedEvents = await Promise.all(

    normalized.map(async(event)=>{

      try {

        const image = await enrichEventImage(
          event.title,
          event.image
        )

        const categorySlug = await classifyEventCategory(event)

        const categoryId = categorySlug ? resolveCategoryId(categorySlug) : undefined

        return {

          ...event,

          image,

          images: image ? [image] : [],

          startTime: event.startTime || "00:00",

          endTime: event.endTime || "23:59",

          price: event.price ?? 0,

          currency: event.currency || "KES",

          tags: (event as any).tags || [],

          status: "UPCOMING",

          categoryId

        }

      } catch (err) {

        console.error("Event enrichment failed:", err)

        return null

      }

    })
  )

  // Remove failed enrichments
  const cleaned = enrichedEvents.filter(Boolean)

  // --------------------------------
  // Remove duplicates in memory
  // --------------------------------

  const map = new Map()

  for (const event of cleaned) {

    if (!event || !event.externalUrl) continue

    map.set(event.externalUrl,event)

  }

  const uniqueEvents = Array.from(map.values())

  console.log(`Unique events: ${uniqueEvents.length}`)

  if (uniqueEvents.length === 0) {

    console.log("No events to insert")

    return 0

  }

  // --------------------------------
  // Batch insert
  // --------------------------------

  const BATCH_SIZE = 100

  let inserted = 0

  for (let i = 0; i < uniqueEvents.length; i += BATCH_SIZE) {

    const batch = uniqueEvents.slice(i, i + BATCH_SIZE)

    const result = await prisma.event.createMany({

      data: batch as any,

      skipDuplicates: true

    })

    inserted += result.count

  }

  console.log(`Inserted ${inserted} new events`)

  return inserted

}