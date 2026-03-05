import prisma from "./config/database"

async function main() {
  try {
    const category = await prisma.category.upsert({
      where: { slug: "external-events" },
      update: {},
      create: {
        name: "External Events",
        slug: "external-events",
        icon: "globe"
      }
    })

    console.log("✅ Category created or already exists:", category.id)
  } catch (error) {
    console.error("❌ Error creating category:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((err) => {
  console.error("Fatal error:", err)
  process.exit(1)
})