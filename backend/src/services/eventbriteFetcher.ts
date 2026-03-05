import axios from "axios"

const API = "https://www.eventbriteapi.com/v3"

export const fetchEventbriteEvents = async () => {

  try {

    // Step 1 — Get user organizations
    const orgsRes = await axios.get(
      `${API}/users/me/organizations/`,
      {
        headers: {
          Authorization: `Bearer ${process.env.EVENTBRITE_API_TOKEN}`,
        }
      }
    )

    const organizations = orgsRes.data.organizations || []

    if (!organizations.length) {
      console.log("No Eventbrite organizations found")
      return []
    }

    let events:any[] = []

    for (const org of organizations) {

      const res = await axios.get(
        `${API}/organizations/${org.id}/events/`,
        {
          params: {
            status: "live",
            expand: "venue,logo",
            page_size: 50
          },
          headers: {
            Authorization: `Bearer ${process.env.EVENTBRITE_API_TOKEN}`,
          }
        }
      )

      const mapped = res.data.events.map((e:any) => ({
        id: e.id,
        title: e.name.text,
        description: e.description?.text,
        date: e.start.local,
        endDate: e.end.local,
        image: e.logo?.url,
        location: e.venue?.name,
        address: e.venue?.address?.address_1,
        url: e.url
      }))

      events.push(...mapped)

    }

    console.log(`Fetched ${events.length} events from Eventbrite`)

    return events

  } catch (error:any) {

    console.error("Eventbrite API error:", error.response?.data || error.message)

    return []

  }
}