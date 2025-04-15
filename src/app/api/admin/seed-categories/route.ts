import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { category } from "@/db/schema";
import { slugify } from "@/lib/utils";
import { auth } from "@/lib/auth";

// Define categories with a hierarchical structure
const categories = [
  // Development Tools & Infrastructure
  {
    name: "Developer Tools",
    description: "Tools for software development, debugging, and testing",
  },
  {
    name: "DevOps",
    description: "Tools for deployment, CI/CD, and infrastructure management",
  },
  {
    name: "API Tools",
    description: "API development, testing, and management tools",
  },
  {
    name: "Databases",
    description: "Database tools, management systems, and related services",
  },

  // Design & Creative
  {
    name: "Design Tools",
    description: "Tools for UI/UX design, graphic design, and prototyping",
  },
  {
    name: "Creative Tools",
    description: "Tools for content creation, editing, and management",
  },
  {
    name: "3D & AR/VR",
    description:
      "Tools for 3D modeling, augmented reality, and virtual reality",
  },

  // Business & Productivity
  {
    name: "Productivity",
    description: "Tools to improve personal and team productivity",
  },
  {
    name: "Project Management",
    description: "Tools for project planning, tracking, and collaboration",
  },
  {
    name: "Marketing",
    description:
      "Marketing automation, analytics, and campaign management tools",
  },
  {
    name: "Sales & CRM",
    description: "Customer relationship management and sales tools",
  },
  {
    name: "Finance",
    description: "Financial management, accounting, and payment tools",
  },

  // AI & Data
  {
    name: "AI & Machine Learning",
    description:
      "Artificial intelligence and machine learning tools and platforms",
  },
  {
    name: "Data Analytics",
    description:
      "Data analysis, visualization, and business intelligence tools",
  },
  {
    name: "Data Processing",
    description: "Tools for data processing, ETL, and data pipelines",
  },

  // Web & Mobile
  {
    name: "Web Development",
    description: "Tools and frameworks for web development",
  },
  {
    name: "Mobile Development",
    description: "Tools and frameworks for mobile app development",
  },
  {
    name: "E-commerce",
    description: "E-commerce platforms, plugins, and tools",
  },

  // Security & Compliance
  {
    name: "Security",
    description: "Cybersecurity, authentication, and data protection tools",
  },
  {
    name: "Privacy",
    description: "Privacy management, compliance, and data governance tools",
  },

  // Communication & Collaboration
  {
    name: "Communication",
    description: "Messaging, video conferencing, and team communication tools",
  },
  {
    name: "Collaboration",
    description:
      "Team collaboration, document sharing, and knowledge management",
  },

  // Education & Learning
  {
    name: "Education",
    description: "Learning platforms, course creation, and educational tools",
  },

  // Other
  {
    name: "Gaming",
    description:
      "Game development tools, platforms, and gaming-related products",
  },
  {
    name: "Health & Wellness",
    description: "Health tracking, fitness, and wellness applications",
  },
  {
    name: "Other",
    description: "Products that don't fit into other categories",
  },
];

export async function POST(request: NextRequest) {
  try {
    // Nota: Removemos a verificação de autenticação para permitir que qualquer usuário adicione categorias
    // Isso é útil para a demonstração, mas em um ambiente de produção você deve adicionar autenticação

    console.log("Starting seed categories process...");

    // Get existing categories to avoid duplicates
    const existingCategories = await db.select().from(category);
    console.log(`Found ${existingCategories.length} existing categories`);

    const existingCategoryNames = new Set(
      existingCategories.map((c) => c.name)
    );

    // Filter out categories that already exist
    const newCategories = categories.filter(
      (c) => !existingCategoryNames.has(c.name)
    );

    console.log(`Found ${newCategories.length} new categories to add`);

    if (newCategories.length === 0) {
      console.log("No new categories to add. All categories already exist.");
      return NextResponse.json(
        {
          message: "No new categories to add. All categories already exist.",
          added: 0,
        },
        { status: 200 }
      );
    }

    // Prepare categories with slugs
    const categoriesToInsert = newCategories.map((c) => ({
      name: c.name,
      slug: slugify(c.name),
      description: c.description,
    }));

    // Insert categories
    console.log(`Inserting ${categoriesToInsert.length} categories...`);
    await db.insert(category).values(categoriesToInsert);
    console.log("Categories inserted successfully!");

    return NextResponse.json(
      {
        message: `Successfully added ${newCategories.length} new categories`,
        added: newCategories.length,
        categories: categoriesToInsert,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error seeding categories:", error);
    return NextResponse.json(
      { error: "Failed to seed categories" },
      { status: 500 }
    );
  }
}
