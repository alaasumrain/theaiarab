"use server"

import { createClient } from "@/db/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export interface NewsArticle {
  id: string
  title_ar: string
  title_en?: string
  content_ar: string
  content?: string
  summary_ar?: string
  summary?: string
  category: string
  author?: string
  image_url?: string
  is_featured: boolean
  published_at: string
  view_count: number
  created_at: string
  updated_at: string
}

export interface CreateNewsData {
  title_ar: string
  title_en?: string
  content_ar: string
  content?: string
  summary_ar?: string
  summary?: string
  category: string
  author?: string
  image_url?: string
  is_featured?: boolean
  published_at?: string
}

export interface UpdateNewsData extends CreateNewsData {
  id: string
}

// Create a new news article
export async function createNews(data: CreateNewsData): Promise<{ success: boolean; id?: string; error?: string }> {
  const supabase = createClient()
  
  try {
    const newsData = {
      ...data,
      published_at: data.published_at || new Date().toISOString(),
      is_featured: data.is_featured || false,
      view_count: 0
    }

    const { data: result, error } = await supabase
      .from('ai_news')
      .insert(newsData)
      .select('id')
      .single()

    if (error) {
      console.error('Error creating news:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/news')
    revalidatePath('/news')
    
    return { success: true, id: result.id }
  } catch (error) {
    console.error('Error creating news:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

// Update an existing news article
export async function updateNews(data: UpdateNewsData): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()
  
  try {
    const { id, ...updateData } = data
    
    const dataToUpdate = {
      ...updateData,
      updated_at: new Date().toISOString()
    }

    const { error } = await supabase
      .from('ai_news')
      .update(dataToUpdate)
      .eq('id', id)

    if (error) {
      console.error('Error updating news:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/news')
    revalidatePath('/news')
    revalidatePath(`/news/${id}`)
    
    return { success: true }
  } catch (error) {
    console.error('Error updating news:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

// Delete a news article
export async function deleteNews(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()
  
  try {
    const { error } = await supabase
      .from('ai_news')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting news:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/news')
    revalidatePath('/news')
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting news:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

// Get all news for admin management
export async function getAllNewsForAdmin(): Promise<NewsArticle[]> {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase
      .from('ai_news')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching news for admin:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching news for admin:', error)
    return []
  }
}

// Get a single news article for editing
export async function getNewsForEdit(id: string): Promise<NewsArticle | null> {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase
      .from('ai_news')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching news for edit:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error fetching news for edit:', error)
    return null
  }
}

// Toggle featured status
export async function toggleNewsFeatured(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()
  
  try {
    // First get current status
    const { data: current, error: fetchError } = await supabase
      .from('ai_news')
      .select('is_featured')
      .eq('id', id)
      .single()

    if (fetchError) {
      return { success: false, error: fetchError.message }
    }

    // Toggle the status
    const { error } = await supabase
      .from('ai_news')
      .update({ 
        is_featured: !current.is_featured,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) {
      console.error('Error toggling featured status:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/news')
    revalidatePath('/news')
    
    return { success: true }
  } catch (error) {
    console.error('Error toggling featured status:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

// Get news categories for dropdown
export async function getNewsCategories(): Promise<string[]> {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase
      .from('ai_news')
      .select('category')
      .not('category', 'is', null)

    if (error) {
      console.error('Error fetching news categories:', error)
      return ['تحديثات', 'تعليم', 'أدوات', 'أبحاث', 'تحليل']
    }

    const categories = [...new Set(data.map(item => item.category))]
    return categories.length > 0 ? categories : ['تحديثات', 'تعليم', 'أدوات', 'أبحاث', 'تحليل']
  } catch (error) {
    console.error('Error fetching news categories:', error)
    return ['تحديثات', 'تعليم', 'أدوات', 'أبحاث', 'تحليل']
  }
}

// Publish/unpublish news (by updating published_at)
export async function toggleNewsPublish(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()
  
  try {
    // Get current article
    const { data: article, error: fetchError } = await supabase
      .from('ai_news')
      .select('published_at')
      .eq('id', id)
      .single()

    if (fetchError) {
      return { success: false, error: fetchError.message }
    }

    // If published_at is in the future or null, publish now. Otherwise, set to future date
    const now = new Date()
    const publishedAt = new Date(article.published_at)
    const isPublished = publishedAt <= now

    const newPublishedAt = isPublished 
      ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year in future (unpublish)
      : new Date().toISOString() // publish now

    const { error } = await supabase
      .from('ai_news')
      .update({ 
        published_at: newPublishedAt,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) {
      console.error('Error toggling publish status:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/news')
    revalidatePath('/news')
    
    return { success: true }
  } catch (error) {
    console.error('Error toggling publish status:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
} 