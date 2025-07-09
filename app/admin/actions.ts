"use server"

import { createClient } from "@/db/supabase/server"
import { revalidatePath } from "next/cache"

export async function toggleUserRole(userId: string, newRole: 'user' | 'admin') {
  const supabase = createClient()
  
  // Check if current user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'غير مصرح' }
  }

  const { data: currentUser } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!currentUser || currentUser.role !== 'admin') {
    return { error: 'يجب أن تكون مديراً لتنفيذ هذا الإجراء' }
  }

  // Prevent admin from removing their own admin role
  if (userId === user.id && newRole === 'user') {
    return { error: 'لا يمكنك إلغاء صلاحيات المدير لنفسك' }
  }

  // Update user role
  const { error } = await supabase
    .from('users')
    .update({ role: newRole })
    .eq('id', userId)

  if (error) {
    console.error('Error updating user role:', error)
    return { error: 'حدث خطأ أثناء تحديث الصلاحيات' }
  }

  // Log the action
  await supabase
    .from('admin_activity_logs')
    .insert({
      admin_id: user.id,
      action: 'update_user_role',
      resource_type: 'user',
      resource_id: userId,
      details: { new_role: newRole }
    })

  revalidatePath('/admin/users')
  
  return { success: true }
}

export async function deleteProduct(productId: string) {
  const supabase = createClient()
  
  // Check if current user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'غير مصرح' }
  }

  const { data: currentUser } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!currentUser || currentUser.role !== 'admin') {
    return { error: 'يجب أن تكون مديراً لتنفيذ هذا الإجراء' }
  }

  // Delete product
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId)

  if (error) {
    console.error('Error deleting product:', error)
    return { error: 'حدث خطأ أثناء حذف المنتج' }
  }

  // Log the action
  await supabase
    .from('admin_activity_logs')
    .insert({
      admin_id: user.id,
      action: 'delete_product',
      resource_type: 'product',
      resource_id: productId,
      details: {}
    })

  revalidatePath('/admin/products')
  
  return { success: true }
}

export async function toggleProductApproval(productId: string, approved: boolean) {
  const supabase = createClient()
  
  // Check if current user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'غير مصرح' }
  }

  const { data: currentUser } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!currentUser || currentUser.role !== 'admin') {
    return { error: 'يجب أن تكون مديراً لتنفيذ هذا الإجراء' }
  }

  // Update product approval status
  const { error } = await supabase
    .from('products')
    .update({ approved })
    .eq('id', productId)

  if (error) {
    console.error('Error updating product approval:', error)
    return { error: 'حدث خطأ أثناء تحديث حالة المنتج' }
  }

  // Log the action
  await supabase
    .from('admin_activity_logs')
    .insert({
      admin_id: user.id,
      action: approved ? 'approve_product' : 'reject_product',
      resource_type: 'product',
      resource_id: productId,
      details: { approved }
    })

  revalidatePath('/admin/products')
  
  return { success: true }
}

export async function updateSettings(settings: Record<string, any>, category: string) {
  const supabase = createClient()
  
  // Check if current user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'غير مصرح' }
  }

  const { data: currentUser } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!currentUser || currentUser.role !== 'admin') {
    return { error: 'يجب أن تكون مديراً لتنفيذ هذا الإجراء' }
  }

  // Update each setting
  for (const [key, value] of Object.entries(settings)) {
    const { error } = await supabase
      .from('site_settings')
      .update({ 
        value: JSON.stringify(value),
        updated_by: user.id 
      })
      .eq('key', key)

    if (error) {
      console.error(`Error updating setting ${key}:`, error)
      return { error: `حدث خطأ أثناء تحديث إعداد ${key}` }
    }
  }

  // Log the action
  await supabase
    .from('admin_activity_logs')
    .insert({
      admin_id: user.id,
      action: 'update_settings',
      resource_type: 'settings',
      resource_id: category,
      details: { updated_keys: Object.keys(settings) }
    })

  revalidatePath('/admin/settings')
  
  return { success: true }
}

export async function toggleSubscriberStatus(subscriberId: string, isActive: boolean) {
  const supabase = createClient()
  
  // Check if current user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'غير مصرح' }
  }

  const { data: currentUser } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!currentUser || currentUser.role !== 'admin') {
    return { error: 'يجب أن تكون مديراً لتنفيذ هذا الإجراء' }
  }

  // Update subscriber status
  const { error } = await supabase
    .from('newsletter_subscribers')
    .update({ is_active: isActive })
    .eq('id', subscriberId)

  if (error) {
    console.error('Error updating subscriber status:', error)
    return { error: 'حدث خطأ أثناء تحديث حالة المشترك' }
  }

  // Log the action
  await supabase
    .from('admin_activity_logs')
    .insert({
      admin_id: user.id,
      action: 'update_subscriber_status',
      resource_type: 'newsletter_subscriber',
      resource_id: subscriberId,
      details: { is_active: isActive }
    })

  revalidatePath('/admin/newsletter')
  
  return { success: true }
}

export async function deleteSubscriber(subscriberId: string) {
  const supabase = createClient()
  
  // Check if current user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'غير مصرح' }
  }

  const { data: currentUser } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!currentUser || currentUser.role !== 'admin') {
    return { error: 'يجب أن تكون مديراً لتنفيذ هذا الإجراء' }
  }

  // Delete subscriber
  const { error } = await supabase
    .from('newsletter_subscribers')
    .delete()
    .eq('id', subscriberId)

  if (error) {
    console.error('Error deleting subscriber:', error)
    return { error: 'حدث خطأ أثناء حذف المشترك' }
  }

  // Log the action
  await supabase
    .from('admin_activity_logs')
    .insert({
      admin_id: user.id,
      action: 'delete_subscriber',
      resource_type: 'newsletter_subscriber',
      resource_id: subscriberId,
      details: {}
    })

  revalidatePath('/admin/newsletter')
  
  return { success: true }
}

export async function sendCampaign(campaignId: string) {
  const supabase = createClient()
  
  // Check if current user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'غير مصرح' }
  }

  const { data: currentUser } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!currentUser || currentUser.role !== 'admin') {
    return { error: 'يجب أن تكون مديراً لتنفيذ هذا الإجراء' }
  }

  // Get campaign details
  const { data: campaign } = await supabase
    .from('email_campaigns')
    .select('*')
    .eq('id', campaignId)
    .single()

  if (!campaign) {
    return { error: 'الحملة غير موجودة' }
  }

  if (campaign.status !== 'draft') {
    return { error: 'يمكن إرسال الحملات في وضع المسودة فقط' }
  }

  // Get active subscribers count
  const { count: subscriberCount } = await supabase
    .from('newsletter_subscribers')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  // Update campaign status to sending
  const { error: updateError } = await supabase
    .from('email_campaigns')
    .update({ 
      status: 'sending',
      recipient_count: subscriberCount || 0
    })
    .eq('id', campaignId)

  if (updateError) {
    console.error('Error updating campaign status:', updateError)
    return { error: 'حدث خطأ أثناء تحديث حالة الحملة' }
  }

  // Here you would integrate with your email service (e.g., SendGrid, AWS SES, etc.)
  // For now, we'll just simulate the sending process
  
  // After successful sending, update status to sent
  await supabase
    .from('email_campaigns')
    .update({ 
      status: 'sent',
      sent_at: new Date().toISOString()
    })
    .eq('id', campaignId)

  // Log the action
  await supabase
    .from('admin_activity_logs')
    .insert({
      admin_id: user.id,
      action: 'send_campaign',
      resource_type: 'email_campaign',
      resource_id: campaignId,
      details: { recipient_count: subscriberCount || 0 }
    })

  revalidatePath('/admin/newsletter')
  
  return { success: true }
}

export async function deleteCampaign(campaignId: string) {
  const supabase = createClient()
  
  // Check if current user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'غير مصرح' }
  }

  const { data: currentUser } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!currentUser || currentUser.role !== 'admin') {
    return { error: 'يجب أن تكون مديراً لتنفيذ هذا الإجراء' }
  }

  // Delete campaign
  const { error } = await supabase
    .from('email_campaigns')
    .delete()
    .eq('id', campaignId)

  if (error) {
    console.error('Error deleting campaign:', error)
    return { error: 'حدث خطأ أثناء حذف الحملة' }
  }

  // Log the action
  await supabase
    .from('admin_activity_logs')
    .insert({
      admin_id: user.id,
      action: 'delete_campaign',
      resource_type: 'email_campaign',
      resource_id: campaignId,
      details: {}
    })

  revalidatePath('/admin/newsletter')
  
  return { success: true }
}

export async function toggleReviewFeatured(reviewId: string, reviewType: 'user' | 'product', isFeatured: boolean) {
  const supabase = createClient()
  
  // Check if current user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'غير مصرح' }
  }

  const { data: currentUser } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!currentUser || currentUser.role !== 'admin') {
    return { error: 'يجب أن تكون مديراً لتنفيذ هذا الإجراء' }
  }

  const tableName = reviewType === 'user' ? 'user_reviews' : 'product_reviews'

  // Update review featured status
  const { error } = await supabase
    .from(tableName)
    .update({ is_featured: isFeatured })
    .eq('id', reviewId)

  if (error) {
    console.error('Error updating review featured status:', error)
    return { error: 'حدث خطأ أثناء تحديث التقييم' }
  }

  // Log the action
  await supabase
    .from('admin_activity_logs')
    .insert({
      admin_id: user.id,
      action: isFeatured ? 'feature_review' : 'unfeature_review',
      resource_type: `${reviewType}_review`,
      resource_id: reviewId,
      details: { is_featured: isFeatured }
    })

  revalidatePath('/admin/reviews')
  
  return { success: true }
}

export async function deleteReview(reviewId: string, reviewType: 'user' | 'product') {
  const supabase = createClient()
  
  // Check if current user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'غير مصرح' }
  }

  const { data: currentUser } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!currentUser || currentUser.role !== 'admin') {
    return { error: 'يجب أن تكون مديراً لتنفيذ هذا الإجراء' }
  }

  const tableName = reviewType === 'user' ? 'user_reviews' : 'product_reviews'

  // Delete review
  const { error } = await supabase
    .from(tableName)
    .delete()
    .eq('id', reviewId)

  if (error) {
    console.error('Error deleting review:', error)
    return { error: 'حدث خطأ أثناء حذف التقييم' }
  }

  // Log the action
  await supabase
    .from('admin_activity_logs')
    .insert({
      admin_id: user.id,
      action: 'delete_review',
      resource_type: `${reviewType}_review`,
      resource_id: reviewId,
      details: {}
    })

  revalidatePath('/admin/reviews')
  
  return { success: true }
}