import axios from "axios"
import * as cheerio from "cheerio"

export const fetchKenyaBuzzEvents = async () => {

  try {

    const res = await axios.get(
      "https://kenyabuzz.com/events"
    )

    const $ = cheerio.load(res.data)

    const events:any[] = []

    $(".event-listing").each((_,el)=>{

      const title = $(el).find(".event-title").text().trim()

      const link = $(el).find("a").attr("href")

      const image = $(el).find("img").attr("src")

      const location = $(el).find(".event-location").text().trim()

      const date = $(el).find(".event-date").text().trim()

      if (!title || !link) return

      events.push({

        id: title,

        title,

        description: "",

        date,

        image,

        location,

        address: location,

        url: `https://kenyabuzz.com${link}`

      })

    })

    console.log(`KenyaBuzz events fetched: ${events.length}`)

    return events

  } catch (error) {

    console.error("KenyaBuzz scrape failed:", error)

    return []

  }

}