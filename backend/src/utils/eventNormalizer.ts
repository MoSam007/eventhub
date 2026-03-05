export const normalizeExternalEvent = (event: any, source: string) => {

  const startDate = new Date(event.date || new Date())

  // Extract time
  const startTime = startDate.toTimeString().slice(0,5)
  const endTime = startTime

  // Convert location arrays to string
  const location = Array.isArray(event.location)
    ? event.location.join(", ")
    : event.location || "Nairobi"

  const address = Array.isArray(event.address)
    ? event.address.join(", ")
    : event.address || location

  return {

    slug: `external-${source}-${event.title}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g,"-"),

    title: event.title,
    description: event.description || "",
    longDescription: event.description || "",

    location,
    address,

    date: startDate,

    startTime,
    endTime,

    startDatetime: startDate,
    endDatetime: startDate,

    image: event.image || null,
    images: event.image ? [event.image] : [],

    price: 0,
    currency: "KES",

    externalUrl: event.url,
    source,

    status: "PUBLISHED"

  }
}