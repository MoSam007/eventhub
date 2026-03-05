import React from 'react';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';
import { EventbriteEvent } from '../../types';

interface EventbriteCardProps {
  event: EventbriteEvent;
}

const EventbriteCard: React.FC<EventbriteCardProps> = ({ event }) => {
  const startDate = new Date(event.start.local);
  const formattedDate = startDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = startDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      {/* Image */}
      <div className="relative h-48 w-full bg-gray-100">
        {event.logo ? (
          <img
            src={event.logo.url}
            alt={event.name.text}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Calendar size={48} />
          </div>
        )}
        <div className="absolute top-3 right-3 bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          Eventbrite
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
          {event.name.text}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600 text-sm">
            <Calendar size={16} className="mr-2 text-orange-600" />
            <span>{formattedDate} • {formattedTime}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin size={16} className="mr-2 text-orange-600" />
            <span className="line-clamp-1">
              {event.venue?.name || 'Nairobi, Kenya'}
            </span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-1">
          {event.description.text || 'No description available for this event.'}
        </p>

        <a
          href={event.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
        >
          View on Eventbrite
          <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );
};

export default EventbriteCard;
