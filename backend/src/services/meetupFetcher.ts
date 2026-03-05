import axios from "axios"

export const fetchMeetupEvents = async () => {

  const res = await axios.get(
    "https://api.meetup.com/find/upcoming_events",
    {
      params: {
        lat: -1.286389,
        lon: 36.817223,
        radius: 50,
      },
    }
  )

  return res.data.events.map((e: any) => ({
    id: e.id,
    title: e.name,
    description: e.description,
    date: e.time,
    image: e.featured_photo?.photo_link,
    location: e.venue?.name,
    address: e.venue?.address_1,
    url: e.link,
  }))
}