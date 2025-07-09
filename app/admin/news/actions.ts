"use server"

import { createClient } from "@/db/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export interface NewsFormData {
  title_ar: string
  title_en?: string
  content_ar?: string
  content_en?: string
  summary_ar?: string
  summary_en?: string
  author?: string
  category: string
  image_url?: string
  is_published: boolean
  is_featured: boolean
}

export async function createNews(formData: NewsFormData) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('ai_news')
    .insert({
      title_ar: formData.title_ar,
      title_en: formData.title_en || null,
      content_ar: formData.content_ar || null,
      content_en: formData.content_en || null,
      summary_ar: formData.summary_ar || null,
      summary_en: formData.summary_en || null,
      author: formData.author || 'العربي للذكاء الاصطناعي',
      category: formData.category,
      image_url: formData.image_url || null,
      is_published: formData.is_published,
      is_featured: formData.is_featured,
      published_at: formData.is_published ? new Date().toISOString() : null,
      view_count: 0
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating news:', error)
    throw new Error('فشل في إنشاء المقال')
  }

  revalidatePath('/admin/news')
  revalidatePath('/news')
  revalidatePath('/')

  return data
}

export async function updateNews(id: string, formData: NewsFormData) {
  const supabase = createClient()

  // Get current article to check if publication status is changing
  const { data: currentArticle } = await supabase
    .from('ai_news')
    .select('is_published')
    .eq('id', id)
    .single()

  const updateData: any = {
    title_ar: formData.title_ar,
    title_en: formData.title_en || null,
    content_ar: formData.content_ar || null,
    content_en: formData.content_en || null,
    summary_ar: formData.summary_ar || null,
    summary_en: formData.summary_en || null,
    author: formData.author || 'العربي للذكاء الاصطناعي',
    category: formData.category,
    image_url: formData.image_url || null,
    is_published: formData.is_published,
    is_featured: formData.is_featured,
    updated_at: new Date().toISOString()
  }

  // If changing from unpublished to published, set published_at
  if (!currentArticle?.is_published && formData.is_published) {
    updateData.published_at = new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('ai_news')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating news:', error)
    throw new Error('فشل في تحديث المقال')
  }

  revalidatePath('/admin/news')
  revalidatePath('/news')
  revalidatePath('/')
  revalidatePath(`/news/${id}`)

  return data
}

export async function deleteNews(id: string) {
  const supabase = createClient()

  const { error } = await supabase
    .from('ai_news')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting news:', error)
    throw new Error('فشل في حذف المقال')
  }

  revalidatePath('/admin/news')
  revalidatePath('/news')
  revalidatePath('/')
}

export async function toggleNewsPublished(id: string, isPublished: boolean) {
  const supabase = createClient()

  const updateData: any = {
    is_published: isPublished,
    updated_at: new Date().toISOString()
  }

  if (isPublished) {
    updateData.published_at = new Date().toISOString()
  }

  const { error } = await supabase
    .from('ai_news')
    .update(updateData)
    .eq('id', id)

  if (error) {
    console.error('Error toggling news publication:', error)
    throw new Error('فشل في تغيير حالة النشر')
  }

  revalidatePath('/admin/news')
  revalidatePath('/news')
  revalidatePath('/')
}

export async function toggleNewsFeatured(id: string, isFeatured: boolean) {
  const supabase = createClient()

  const { error } = await supabase
    .from('ai_news')
    .update({
      is_featured: isFeatured,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)

  if (error) {
    console.error('Error toggling news featured status:', error)
    throw new Error('فشل في تغيير حالة المميز')
  }

  revalidatePath('/admin/news')
  revalidatePath('/news')
  revalidatePath('/')
}