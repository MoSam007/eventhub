import axios from "axios"

export const fetchGoogleEvents = async () => {

  const pages = [0, 10, 20, 30, 40, 50]

  let events: any[] = []

  for (const start of pages) {

    try {

      const res = await axios.get(
        "https://serpapi.com/search.json",
        {
          params: {
            engine: "google_events",
            q: "events in Nairobi",
            location: "Nairobi, Kenya",
            start,
            api_key: process.env.SERP_API_KEY
          }
        }
      )

      const pageEvents = res.data.events_results || []
      events.push(...pageEvents)

    } catch (err) {
      console.error("Google events page failed:", err)

    }

  }

  console.log(`Fetched ${events.length} Google events`)

  return events.map((e:any)=>({
    id: e.title,
    title: e.title,
    description: e.description || "",
    date: e.date?.start_date || new Date(),
    endDate: e.date?.end_date || null,
    image: e.thumbnail,
    location: e.address,
    address: e.address,
    url: e.link
  }))

}