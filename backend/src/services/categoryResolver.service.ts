import prisma from "../config/database"

let categoryCache: Record<string,string> = {}

export const loadCategoryCache = async () => {

  const categories = await prisma.category.findMany()

  categoryCache = {}

  for (const cat of categories) {

    categoryCache[cat.slug] = cat.id

  }

}

export const resolveCategoryId = (slug:string) => {

  return categoryCache[slug] || null

}