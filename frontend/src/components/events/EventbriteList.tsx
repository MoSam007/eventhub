import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { EventbriteEvent } from '../../types';
import EventbriteCard from './EventbriteCard';

interface EventbriteListProps {
  events: EventbriteEvent[];
  isLoading: boolean;
  error?: any;
}

const EventbriteList: React.FC<EventbriteListProps> = ({ events, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <Loader2 className="animate-spin text-orange-600" size={48} />
        <p className="text-gray-600 font-medium">Fetching events from Eventbrite...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-xl p-8 flex flex-col items-center justify-center text-center">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <h3 className="text-xl font-bold text-red-900 mb-2">Failed to load Eventbrite events</h3>
        <p className="text-red-700 max-w-md">
          {error.message || 'There was an error connecting to the Eventbrite API. Please try again later.'}
        </p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-12 text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Eventbrite events found</h3>
        <p className="text-gray-600">We couldn't find any upcoming events in Nairobi on Eventbrite right now.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {events.map((event) => (
        <EventbriteCard key={event.id} event={event} />
      ))}
    </div>
  );
};

export default EventbriteList;
