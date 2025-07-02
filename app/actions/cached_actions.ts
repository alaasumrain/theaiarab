"use server"

import "server-only"
import { unstable_cache } from "next/cache"
import { createClient } from "@supabase/supabase-js"

type FilterData = {
  categories: string[]
  labels: string[]
  tags: string[]
}

type CategoryData = {
  name: string
}

type LabelData = {
  name: string
}

type TagData = {
  name: string
}

const client = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
async function getFilters(): Promise<FilterData> {
  try {
    const { data: productsData, error } = await client
      .from("products")
      .select("categories, labels, tags")

    if (error) {
      console.error("Error fetching filters:", error)
      return { categories: [], labels: [], tags: [] }
    }

    const unique = (array: string[]) => [...new Set(array)]

    // Extract unique categories
    const categories = productsData
      ? unique(
          productsData
            .map((item: any) => item.categories)
            .filter(Boolean)
        )
      : []

    // Extract unique labels (flatten arrays)
    const labels = productsData
      ? unique(
          productsData
            .flatMap((item: any) => item.labels || [])
            .filter(Boolean)
        )
      : []

    // Extract unique tags (flatten arrays)
    const tags = productsData
      ? unique(
          productsData
            .flatMap((item: any) => item.tags || [])
            .filter(Boolean)
        )
      : []

    return { categories, labels, tags }
  } catch (error) {
    console.error("Failed to fetch filters:", error)
    return { categories: [], labels: [], tags: [] }
  }
}

export const getCachedFilters = unstable_cache(
  async (): Promise<FilterData> => {
    const { categories, labels, tags } = await getFilters()
    return { categories, labels, tags }
  },
  ["product-filters"],
  { tags: [`product_filters`], revalidate: 9000 }
)
