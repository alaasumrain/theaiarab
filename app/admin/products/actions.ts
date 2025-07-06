"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/db/supabase/server"

export async function approveProduct(productId: string) {
  const supabase = createClient()
  
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

  // Update product status
  const { error } = await supabase
    .from('products')
    .update({ approved: true })
    .eq('id', productId)

  if (error) throw error

  // Log admin activity
  await supabase.rpc('log_admin_activity', {
    action: 'approve_product',
    entity_type: 'product',
    entity_id: productId
  })

  revalidatePath('/admin/products')
  revalidatePath('/products')
  revalidatePath('/')
}

export async function rejectProduct(productId: string) {
  const supabase = createClient()
  
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

  // Update product status
  const { error } = await supabase
    .from('products')
    .update({ approved: false })
    .eq('id', productId)

  if (error) throw error

  // Log admin activity
  await supabase.rpc('log_admin_activity', {
    action: 'reject_product',
    entity_type: 'product',
    entity_id: productId
  })

  revalidatePath('/admin/products')
  revalidatePath('/products')
  revalidatePath('/')
}

export async function toggleFeatured(productId: string, featured: boolean) {
  const supabase = createClient()
  
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

  // Check if featured column exists, if not add it
  const { error: updateError } = await supabase
    .from('products')
    .update({ featured })
    .eq('id', productId)

  if (updateError) {
    // If featured column doesn't exist, we'll add it in a migration
    console.error('Featured column may not exist:', updateError)
    throw updateError
  }

  // Log admin activity
  await supabase.rpc('log_admin_activity', {
    action: featured ? 'feature_product' : 'unfeature_product',
    entity_type: 'product',
    entity_id: productId
  })

  revalidatePath('/admin/products')
  revalidatePath('/products')
  revalidatePath('/')
}

export async function deleteProduct(productId: string) {
  const supabase = createClient()
  
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

  // Get product details for logging
  const { data: product } = await supabase
    .from('products')
    .select('codename, arabic_name')
    .eq('id', productId)
    .single()

  // Delete product
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId)

  if (error) throw error

  // Log admin activity
  await supabase.rpc('log_admin_activity', {
    action: 'delete_product',
    entity_type: 'product',
    entity_id: productId,
    details: { 
      product_name: product?.arabic_name || product?.codename 
    }
  })

  revalidatePath('/admin/products')
  revalidatePath('/products')
  revalidatePath('/')
}

export async function bulkApproveProducts(productIds: string[]) {
  const supabase = createClient()
  
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

  // Bulk update products
  const { error } = await supabase
    .from('products')
    .update({ approved: true })
    .in('id', productIds)

  if (error) throw error

  // Log admin activity
  await supabase.rpc('log_admin_activity', {
    action: 'bulk_approve_products',
    entity_type: 'product',
    details: { 
      count: productIds.length,
      product_ids: productIds 
    }
  })

  revalidatePath('/admin/products')
  revalidatePath('/products')
  revalidatePath('/')
}

export async function bulkDeleteProducts(productIds: string[]) {
  const supabase = createClient()
  
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

  // Delete products
  const { error } = await supabase
    .from('products')
    .delete()
    .in('id', productIds)

  if (error) throw error

  // Log admin activity
  await supabase.rpc('log_admin_activity', {
    action: 'bulk_delete_products',
    entity_type: 'product',
    details: { 
      count: productIds.length,
      product_ids: productIds 
    }
  })

  revalidatePath('/admin/products')
  revalidatePath('/products')
  revalidatePath('/')
}

export async function updateProductLogo(productId: string, logoSrc: string): Promise<{ success: boolean; error?: string }> {
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

    // Update product logo
    const { error } = await supabase
      .from('products')
      .update({ logo_src: logoSrc })
      .eq('id', productId)

    if (error) throw error

    // Log admin activity
    await supabase.rpc('log_admin_activity', {
      action: 'update_product_logo',
      entity_type: 'product',
      entity_id: productId
    })

    // Revalidate pages
    revalidatePath('/admin/products')
    revalidatePath('/products')
    revalidatePath(`/products/${productId}`)
    revalidatePath('/')

    return { success: true }

  } catch (error) {
    console.error('Error updating product logo:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'حدث خطأ غير متوقع'
    }
  }
}