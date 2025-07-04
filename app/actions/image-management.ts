import { createClient } from "@/db/supabase/server"
import { revalidatePath } from "next/cache"

export interface ImageFile {
  id: string
  name: string
  bucket_id: string
  public_url: string
  created_at: string
  updated_at: string
  last_accessed_at: string | null
  metadata: Record<string, any> | null
}

export interface BucketInfo {
  id: string
  name: string
  public: boolean
  file_size_limit?: number
  allowed_mime_types?: string[]
}

// Get all available buckets
export async function getBuckets(): Promise<BucketInfo[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('storage.buckets')
    .select('*')
    .order('created_at')
  
  if (error) {
    console.error('Error fetching buckets:', error)
    return []
  }
  
  return data || []
}

// Get images from a specific bucket
export async function getImagesFromBucket(bucketId: string, limit = 50): Promise<ImageFile[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .storage
    .from(bucketId)
    .list('', {
      limit,
      sortBy: { column: 'created_at', order: 'desc' }
    })
  
  if (error) {
    console.error(`Error fetching images from bucket ${bucketId}:`, error)
    return []
  }
  
  return data?.map(file => ({
    id: file.id || file.name,
    name: file.name,
    bucket_id: bucketId,
    public_url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucketId}/${file.name}`,
    created_at: file.created_at || new Date().toISOString(),
    updated_at: file.updated_at || new Date().toISOString(),
    last_accessed_at: file.last_accessed_at || null,
    metadata: file.metadata || null
  })) || []
}

// Get all images from all buckets
export async function getAllImages(): Promise<ImageFile[]> {
  const buckets = await getBuckets()
  const allImages: ImageFile[] = []
  
  for (const bucket of buckets) {
    const images = await getImagesFromBucket(bucket.id)
    allImages.push(...images)
  }
  
  // Sort by created_at descending
  return allImages.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

// Upload multiple files to a bucket
export async function uploadImages(
  bucketId: string, 
  files: File[]
): Promise<{ success: boolean; urls: string[]; errors: string[] }> {
  const supabase = createClient()
  const urls: string[] = []
  const errors: string[] = []
  
  for (const file of files) {
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      
      const { data, error } = await supabase.storage
        .from(bucketId)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })
      
      if (error) {
        errors.push(`Failed to upload ${file.name}: ${error.message}`)
      } else {
        const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucketId}/${data.path}`
        urls.push(publicUrl)
      }
    } catch (err) {
      errors.push(`Failed to upload ${file.name}: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }
  
  if (urls.length > 0) {
    revalidatePath('/admin/images')
  }
  
  return {
    success: urls.length > 0,
    urls,
    errors
  }
}

// Delete an image
export async function deleteImage(bucketId: string, imageName: string): Promise<boolean> {
  const supabase = createClient()
  
  const { error } = await supabase.storage
    .from(bucketId)
    .remove([imageName])
  
  if (!error) {
    revalidatePath('/admin/images')
  }
  
  return !error
}

// Search images across all buckets
export async function searchImages(query: string): Promise<ImageFile[]> {
  const allImages = await getAllImages()
  
  if (!query.trim()) {
    return allImages
  }
  
  const searchTerm = query.toLowerCase()
  return allImages.filter(image => 
    image.name.toLowerCase().includes(searchTerm) ||
    image.bucket_id.toLowerCase().includes(searchTerm)
  )
}

// Get images by bucket and category
export async function getImagesByCategory(bucketId?: string): Promise<Record<string, ImageFile[]>> {
  const images = bucketId ? await getImagesFromBucket(bucketId) : await getAllImages()
  
  return images.reduce((acc, image) => {
    const bucket = image.bucket_id
    if (!acc[bucket]) {
      acc[bucket] = []
    }
    acc[bucket].push(image)
    return acc
  }, {} as Record<string, ImageFile[]>)
}

// Copy image from one bucket to another
export async function copyImage(
  sourceBucket: string, 
  targetBucket: string, 
  imageName: string,
  newName?: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  const supabase = createClient()
  
  try {
    // Download from source
    const { data: fileData, error: downloadError } = await supabase.storage
      .from(sourceBucket)
      .download(imageName)
    
    if (downloadError) {
      return { success: false, error: downloadError.message }
    }
    
    // Upload to target
    const fileName = newName || imageName
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(targetBucket)
      .upload(fileName, fileData, {
        cacheControl: '3600',
        upsert: false
      })
    
    if (uploadError) {
      return { success: false, error: uploadError.message }
    }
    
    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${targetBucket}/${uploadData.path}`
    
    revalidatePath('/admin/images')
    return { success: true, url: publicUrl }
  } catch (err) {
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Unknown error' 
    }
  }
} 