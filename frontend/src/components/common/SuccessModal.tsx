import { CheckCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventSlug: string;
  eventTitle: string;
}

export function SuccessModal({ isOpen, onClose, eventSlug, eventTitle }: SuccessModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-bounce-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Created Successfully!</h2>
          <p className="text-gray-600 mb-6">
            <strong>{eventTitle}</strong> has been created and is now live.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => navigate(`/events/${eventSlug}`)}
              className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium transition-colors"
            >
              View Event
            </button>
            <button
              onClick={() => navigate('/host/events')}
              className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors"
            >
              Manage Events
            </button>
            <button
              onClick={onClose}
              className="w-full px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Create Another Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}