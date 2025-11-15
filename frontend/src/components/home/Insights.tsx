export default function Insights() {
  const cards = [
    {
      quote: '“A terrific piece of praise”',
      name: 'Name',
      desc: 'Description',
      avatar: 'https://images.unsplash.com/photo-1545996124-1b05d4d1f6d6?w=64&h=64&fit=crop',
    },
    {
      quote: '“A fantastic bit of feedback”',
      name: 'Name',
      desc: 'Description',
      avatar: 'https://images.unsplash.com/photo-1545996124-1b05d4d1f6d6?w=64&h=64&fit=crop',
    },
    {
      quote: '“A genuinely glowing review”',
      name: 'Name',
      desc: 'Description',
      avatar: 'https://images.unsplash.com/photo-1545996124-1b05d4d1f6d6?w=64&h=64&fit=crop',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((c, i) => (
        <div key={i} className="border border-gray-100 rounded-lg p-6">
          <p className="text-sm text-gray-700 mb-4">{c.quote}</p>
          <div className="flex items-center space-x-3">
            <img src={c.avatar} className="w-10 h-10 rounded-full object-cover" />
            <div>
              <div className="text-sm font-semibold text-gray-900">{c.name}</div>
              <div className="text-xs text-gray-500">{c.desc}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
