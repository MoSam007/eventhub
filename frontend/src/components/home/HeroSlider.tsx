import { useState, useEffect } from 'react'

const HERO_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80',
    alt: 'People at an event'
  },
  {
    url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920&q=80',
    alt: 'Concert crowd'
  },
  {
    url: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1920&q=80',
    alt: 'Music festival'
  },
  {
    url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1920&q=80',
    alt: 'Social gathering'
  },
]

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([])

  useEffect(() => {
    // Preload all images
    const loadImages = async () => {
      const loadPromises = HERO_IMAGES.map((image, index) => {
        return new Promise((resolve) => {
          const img = new Image()
          img.onload = () => {
            setImagesLoaded(prev => {
              const newLoaded = [...prev]
              newLoaded[index] = true
              return newLoaded
            })
            resolve(true)
          }
          img.onerror = () => {
            console.error(`Failed to load image: ${image.url}`)
            resolve(false)
          }
          img.src = image.url
        })
      })
      await Promise.all(loadPromises)
    }

    loadImages()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative h-[500px] overflow-hidden bg-gray-200">
      {/* Images */}
      {HERO_IMAGES.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {imagesLoaded[index] ? (
            <>
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-300">
              <div className="animate-pulse text-gray-500">Loading...</div>
            </div>
          )}
        </div>
      ))}

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Discover Amazing Events
          </h1>
          <p className="text-lg md:text-xl mb-8 drop-shadow-md">
            Find and attend local events near you
          </p>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
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
