import { useState, useEffect } from 'react'

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1600&h=600&fit=crop',
]

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative h-[500px] overflow-hidden bg-gray-100">
      {/* Images */}
      {HERO_IMAGES.map((imageUrl, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={imageUrl}
            alt={`Hero ${index + 1}`}
            className="w-full h-full object-cover"
            loading={index === 0 ? 'eager' : 'lazy'}
          />
          <div className="absolute inset-0 bg-black bg-opacity-20" />
        </div>
      ))}

      {/* Progress Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {HERO_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/75 w-2'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}