"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/db/supabase/server"

interface UpdateProductData {
  codename: string
  arabic_name: string
  punchline: string
  arabic_description: string
  description: string
  categories: string
  product_website: string
  is_free: boolean
  difficulty_level: string
  approved: boolean
  logo_src: string
}

export async function updateProduct(
  productId: string, 
  data: UpdateProductData
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()
  
  try {
    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("المصادقة مطلوبة")
    
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()
    
    if (userData?.role !== 'admin') {
      throw new Error("ليس لديك صلاحية لهذا الإجراء")
    }

    // Prepare update data
    const updateData = {
      ...data,
      updated_at: new Date().toISOString(),
      // Handle empty strings
      arabic_name: data.arabic_name || null,
      arabic_description: data.arabic_description || null,
      product_website: data.product_website || null,
      difficulty_level: data.difficulty_level || null,
      logo_src: data.logo_src || null
    }

    // Update product
    const { error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', productId)

    if (error) throw error

    // Log admin activity
    await supabase.rpc('log_admin_activity', {
      action: 'update_product',
      entity_type: 'product',
      entity_id: productId,
      details: { 
        product_name: data.arabic_name || data.codename,
        changes: Object.keys(data)
      }
    })

    // Revalidate pages
    revalidatePath('/admin/products')
    revalidatePath('/products')
    revalidatePath(`/products/${productId}`)
    revalidatePath('/')

    return { success: true }

  } catch (error) {
    console.error('Error updating product:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'حدث خطأ غير متوقع'
    }
  }
} 