import { db } from "../db/drizzle";
import { category } from "../db/schema";

async function checkCategories() {
  try {
    console.log("Checking categories in the database...");
    
    const categories = await db.select().from(category);
    
    console.log(`Found ${categories.length} categories:`);
    
    if (categories.length > 0) {
      categories.forEach((cat, index) => {
        console.log(`${index + 1}. ${cat.name} (ID: ${cat.id}, Slug: ${cat.slug})`);
      });
    } else {
      console.log("No categories found. You should run the seed script.");
    }
  } catch (error) {
    console.error("Error checking categories:", error);
  } finally {
    await db.end();
  }
}

// Run the check function
checkCategories();
