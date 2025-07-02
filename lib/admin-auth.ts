import { createClient } from '@/db/supabase/server'
import { redirect } from 'next/navigation'

// Check if user is admin
export async function isAdmin() {
  const supabase = createClient()
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false
    
    const { data, error } = await supabase
      .rpc('is_admin', { user_id: user.id })
    
    if (error) return false
    return data === true
  } catch {
    return false
  }
}

// Protect admin routes - redirect if not admin
export async function requireAdmin() {
  const adminUser = await isAdmin()
  if (!adminUser) {
    redirect('/')
  }
}

// Get admin stats
export async function getAdminStats() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .rpc('get_admin_stats')
  
  if (error) {
    console.error('Error fetching admin stats:', error)
    return null
  }
  
  return data
}

// Get current admin user
export async function getAdminUser() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null
  
  const adminCheck = await isAdmin()
  if (!adminCheck) return null
  
  return user
} 