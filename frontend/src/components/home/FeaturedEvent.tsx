interface FeaturedEventProps {
  title: string
  description: string
  datetime: string
  address: string
  ctaLabel?: string
  imageUrl: string
}

export default function FeaturedEvent({
  title,
  description,
  datetime,
  address,
  ctaLabel = 'Reserve a spot',
  imageUrl,
}: FeaturedEventProps) {
  const date = new Date(datetime)
  const pretty = date.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div className="bg-white border border-gray-100 rounded-lg overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        {/* Left content */}
        <div className="p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
          <p className="text-sm text-gray-500 mb-4 max-w-xl">{description}</p>

          <div className="text-sm text-gray-600 mb-6">
            <div className="mb-1">{pretty}</div>
            <div>{address}</div>
          </div>

          <button className="inline-block bg-white border border-gray-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition">
            {ctaLabel}
          </button>
        </div>

        {/* Right image */}
        <div className="w-full h-80 md:h-96 relative">
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  )
}
