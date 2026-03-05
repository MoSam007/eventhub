import { env } from '../config/env';

export interface EventbriteEvent {
  id: string;
  name: {
    text: string;
    html: string;
  };
  description: {
    text: string;
    html: string;
  };
  url: string;
  start: {
    timezone: string;
    local: string;
    utc: string;
  };
  end: {
    timezone: string;
    local: string;
    utc: string;
  };
  logo: {
    url: string;
  } | null;
  venue?: {
    name: string;
    address: {
      address_1: string;
      city: string;
      region: string;
      postal_code: string;
      country: string;
    };
  };
}

export const fetchNairobiEvents = async (): Promise<EventbriteEvent[]> => {
  try {

    const orgsResponse = await fetch(
      'https://www.eventbriteapi.com/v3/users/me/organizations/',
      {
        headers: {
          Authorization: `Bearer ${env.EVENTBRITE_API_TOKEN}`,
          Accept: 'application/json',
        },
      }
    );

    if (!orgsResponse.ok) {
      throw new Error(`Eventbrite org fetch failed: ${orgsResponse.status}`);
    }

    const orgsData = await orgsResponse.json() as {
      organizations: { id: string }[];
    };

    const organizations = orgsData.organizations || [];

    if (!organizations.length) {
      return [];
    }

    let allEvents: EventbriteEvent[] = [];

    for (const org of organizations) {

      const eventsResponse = await fetch(
        `https://www.eventbriteapi.com/v3/organizations/${org.id}/events/?status=live&expand=venue,logo&page_size=50`,
        {
          headers: {
            Authorization: `Bearer ${env.EVENTBRITE_API_TOKEN}`,
            Accept: 'application/json',
          },
        }
      );

      if (!eventsResponse.ok) continue;

      const data = await eventsResponse.json() as {
        events: EventbriteEvent[];
      };

      allEvents = [...allEvents, ...(data.events || [])];
    }

    console.log(`Fetched ${allEvents.length} events from Eventbrite`);
    return allEvents;

  } catch (error: any) {
    console.error('Eventbrite API Error:', error.message);
    return [];
  }
};