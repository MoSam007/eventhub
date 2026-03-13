import axios from "axios"

const BAD_IMAGE_DOMAINS = ["tbn0.gstatic.com", "gstatic.com/tbn"]

function isBlurryImage(url?: string): boolean {
  if (!url) return true
  return BAD_IMAGE_DOMAINS.some(domain => url.includes(domain))
}

export const enrichEventImage = async (
  title: string,
  originalImage?: string
): Promise<string | null> => {

  // Keep the original if it's a good-quality image
  if (originalImage && !isBlurryImage(originalImage)) {
    return originalImage
  }

  // No Bing key configured — skip enrichment, return null so frontend
  // falls back to a category-based placeholder
  if (!process.env.BING_IMAGE_API_KEY) {
    return null
  }

  try {
    const res = await axios.get(
      "https://api.bing.microsoft.com/v7.0/images/search",
      {
        headers: {
          "Ocp-Apim-Subscription-Key": process.env.BING_IMAGE_API_KEY
        },
        params: {
          q: `${title} event Nairobi`,
          count: 5,
          imageType: "Photo",
          size: "Large"
        }
      }
    )

    const images = res.data.value || []

    const best = images.find(
      (img: any) => img.width >= 800 && img.height >= 500
    )

    // Return null (not the blurry original) when Bing finds nothing good
    return best?.contentUrl || null

  } catch (error) {
    console.error("Image enrichment failed:", error)
    return null
  }

}