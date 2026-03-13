const CATEGORY_IMAGES: Record<string, string> = {
  music:      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=900&h=500&fit=crop&q=85',
  tech:       'https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&h=500&fit=crop&q=85',
  technology: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&h=500&fit=crop&q=85',
  food:       'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&h=500&fit=crop&q=85',
  sports:     'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=900&h=500&fit=crop&q=85',
  art:        'https://images.unsplash.com/photo-1541367777708-7905fe3296c0?w=900&h=500&fit=crop&q=85',
  education:  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=900&h=500&fit=crop&q=85',
  nightlife:  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=900&h=500&fit=crop&q=85',
  clubbing:   'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=900&h=500&fit=crop&q=85',
  business:   'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&h=500&fit=crop&q=85',
  networking: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=900&h=500&fit=crop&q=85',
  hiking:     'https://images.unsplash.com/photo-1551632811-561732d1e306?w=900&h=500&fit=crop&q=85',
  biking:     'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=900&h=500&fit=crop&q=85',
  social:     'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&h=500&fit=crop&q=85',
  cultural:   'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=900&h=500&fit=crop&q=85',
  festival:   'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=900&h=500&fit=crop&q=85',
  comedy:     'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?w=900&h=500&fit=crop&q=85',
  health:     'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&h=500&fit=crop&q=85',
  wellness:   'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&h=500&fit=crop&q=85',
  default:    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&h=500&fit=crop&q=85',
}

const BAD_IMAGE_DOMAINS = ['tbn0.gstatic.com', 'gstatic.com/tbn']

export function isBlurryImage(url?: string | null): boolean {
  if (!url) return true
  return BAD_IMAGE_DOMAINS.some(domain => url.includes(domain))
}

export function getCategoryImage(categorySlug?: string): string {
  if (!categorySlug) return CATEGORY_IMAGES.default
  const slug = categorySlug.toLowerCase()
  return CATEGORY_IMAGES[slug] ?? CATEGORY_IMAGES.default
}
