import { createClient } from "@/db/supabase/server"
import { Tutorial } from "@/types/database.types"

export async function getTutorials(category?: string, difficulty?: string): Promise<Tutorial[]> {
  const supabase = createClient()
  
  let query = supabase
    .from('tutorials')
    .select('*')
    .order('created_at', { ascending: false })

  if (category) {
    query = query.eq('category', category)
  }
  
  if (difficulty) {
    query = query.eq('difficulty', difficulty)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching tutorials:', error)
    return []
  }

  return data || []
}

export async function getTutorialBySlug(slug: string): Promise<Tutorial | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('tutorials')
    .select('*')
    .eq('id', slug)
    .single()

  if (error) {
    console.error('Error fetching tutorial:', error)
    return null
  }

  return data
}

export async function getTutorialFilters(): Promise<{ categories: string[], difficulties: string[] }> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('tutorials')
    .select('category, difficulty')

  if (error) {
    console.error('Error fetching tutorial filters:', error)
    return { categories: [], difficulties: [] }
  }

  // Extract unique categories and difficulties
  const categories = [...new Set(data?.map(item => item.category).filter(Boolean))] || []
  const difficulties = [...new Set(data?.map(item => item.difficulty).filter(Boolean))] || []

  return { categories, difficulties }
}

export async function incrementTutorialViews(tutorialId: string): Promise<void> {
  const supabase = createClient()
  
  const { error } = await supabase.rpc('increment_tutorial_view_count', {
    tutorial_id: tutorialId
  })

  if (error) {
    console.error('Error incrementing tutorial views:', error)
  }
}

export async function getFeaturedTutorials(): Promise<Tutorial[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('tutorials')
    .select('*')
    .order('view_count', { ascending: false })
    .limit(3)

  if (error) {
    console.error('Error fetching featured tutorials:', error)
    return []
  }

  return data || []
} 