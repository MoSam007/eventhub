import axios from "axios"

export const fetchGoogleEvents = async () => {

  const pages = [0, 10, 20, 30, 40, 50] // each = next page
  let allEvents: any[] = []

  for (const start of pages) {

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

    const events = res.data.events_results || []
    allEvents.push(...events)
  }

  console.log(`Fetched ${allEvents.length} Google events`)

  return allEvents.map((e:any)=>({
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