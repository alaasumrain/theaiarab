import { createClient } from "@/db/supabase/server"

export async function addToFavorites(productId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()
  
  const { data: user, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user.user) {
    return { success: false, error: 'User not authenticated' }
  }

  const { error } = await supabase
    .from('user_favorites')
    .insert({
      user_id: user.user.id,
      product_id: productId
    })

  if (error) {
    console.error('Error adding to favorites:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function removeFromFavorites(productId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()
  
  const { data: user, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user.user) {
    return { success: false, error: 'User not authenticated' }
  }

  const { error } = await supabase
    .from('user_favorites')
    .delete()
    .eq('user_id', user.user.id)
    .eq('product_id', productId)

  if (error) {
    console.error('Error removing from favorites:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function isProductFavorited(productId: string): Promise<boolean> {
  const supabase = createClient()
  
  const { data: user, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user.user) {
    return false
  }

  const { data, error } = await supabase
    .from('user_favorites')
    .select('id')
    .eq('user_id', user.user.id)
    .eq('product_id', productId)
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
    console.error('Error checking favorite status:', error)
    return false
  }

  return !!data
}

export async function getUserFavorites(): Promise<any[]> {
  const supabase = createClient()
  
  const { data: user, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user.user) {
    return []
  }

  const { data, error } = await supabase
    .from('user_favorites')
    .select(`
      id,
      created_at,
      product:products(*)
    `)
    .eq('user_id', user.user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user favorites:', error)
    return []
  }

  return data?.map(item => item.product).filter(Boolean) || []
}

export async function getFavoriteIds(): Promise<string[]> {
  const supabase = createClient()
  
  const { data: user, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user.user) {
    return []
  }

  const { data, error } = await supabase
    .from('user_favorites')
    .select('product_id')
    .eq('user_id', user.user.id)

  if (error) {
    console.error('Error fetching favorite IDs:', error)
    return []
  }

  return data?.map(item => item.product_id) || []
} 