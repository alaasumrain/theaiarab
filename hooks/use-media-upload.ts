import * as React from "react"
import { createClient } from "@/db/supabase/client"
import { toast } from "sonner"

interface UseMediaUploadProps {
  bucket: 'news-images' | 'tutorial-images' | 'site-assets' | 'product-logos'
  folder?: string
  onUploadComplete?: (files: UploadedFile[]) => void
}

interface UploadedFile {
  id?: string
  filename: string
  original_filename: string
  file_path: string
  public_url: string
  bucket_name: string
  file_size: number
  mime_type: string
  width?: number
  height?: number
}

export function useMediaUpload({ 
  bucket, 
  folder,
  onUploadComplete 
}: UseMediaUploadProps) {
  const supabase = createClient()
  const [uploadedFiles, setUploadedFiles] = React.useState<UploadedFile[]>([])
  const [progresses, setProgresses] = React.useState<Record<string, number>>({})
  const [isUploading, setIsUploading] = React.useState(false)

  // Generate unique filename
  const generateFilename = (originalFile: File): string => {
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 15)
    const extension = originalFile.name.split('.').pop()
    const baseName = originalFile.name.split('.').slice(0, -1).join('.')
    const safeName = baseName.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '-')
    
    return `${folder ? folder + '/' : ''}${timestamp}-${randomId}-${safeName}.${extension}`
  }

  // Get image dimensions
  const getImageDimensions = (file: File): Promise<{width: number, height: number} | null> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) {
        resolve(null)
        return
      }

      const img = new Image()
      const url = URL.createObjectURL(file)
      
      img.onload = () => {
        URL.revokeObjectURL(url)
        resolve({ width: img.width, height: img.height })
      }
      
      img.onerror = () => {
        URL.revokeObjectURL(url)
        resolve(null)
      }
      
      img.src = url
    })
  }

  // Upload files to storage and save metadata to media_library
  const uploadFiles = async (files: File[]): Promise<UploadedFile[]> => {
    setIsUploading(true)
    const results: UploadedFile[] = []

    try {
      for (const file of files) {
        const filename = generateFilename(file)
        
        // Update progress
        setProgresses(prev => ({ ...prev, [file.name]: 0 }))

        // Get image dimensions if it's an image
        const dimensions = await getImageDimensions(file)

        // Upload to storage
        const { data: storageData, error: storageError } = await supabase.storage
          .from(bucket)
          .upload(filename, file, {
            cacheControl: '3600',
            upsert: false,
          })

        if (storageError) throw storageError

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(filename)

        // Save metadata to media_library table
        const mediaData = {
          filename,
          original_filename: file.name,
          file_path: storageData.path,
          bucket_name: bucket,
          file_size: file.size,
          mime_type: file.type,
          width: dimensions?.width,
          height: dimensions?.height,
        }

        const { data: dbData, error: dbError } = await supabase
          .from('media_library')
          .insert(mediaData)
          .select()
          .single()

        if (dbError) {
          console.warn('Failed to save to media_library:', dbError)
          // Continue even if DB save fails, storage upload succeeded
        }

        const uploadedFile: UploadedFile = {
          id: dbData?.id,
          filename,
          original_filename: file.name,
          file_path: storageData.path,
          public_url: publicUrl,
          bucket_name: bucket,
          file_size: file.size,
          mime_type: file.type,
          width: dimensions?.width,
          height: dimensions?.height,
        }

        results.push(uploadedFile)

        // Update progress to 100%
        setProgresses(prev => ({ ...prev, [file.name]: 100 }))
      }

      setUploadedFiles(prev => [...prev, ...results])
      onUploadComplete?.(results)
      
      toast.success(`تم رفع ${results.length} ${results.length === 1 ? 'ملف' : 'ملفات'} بنجاح`)
      
      return results

    } catch (error) {
      console.error('Upload error:', error)
      toast.error('فشل في رفع الملفات')
      throw error
    } finally {
      setProgresses({})
      setIsUploading(false)
    }
  }

  // Delete file from storage and media_library
  const deleteFile = async (filename: string, mediaId?: string) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from(bucket)
        .remove([filename])

      if (storageError) throw storageError

      // Delete from media_library if we have the ID
      if (mediaId) {
        const { error: dbError } = await supabase
          .from('media_library')
          .delete()
          .eq('id', mediaId)

        if (dbError) {
          console.warn('Failed to delete from media_library:', dbError)
        }
      }

      // Update local state
      setUploadedFiles(prev => 
        prev.filter(file => file.filename !== filename)
      )

      toast.success('تم حذف الملف بنجاح')

    } catch (error) {
      console.error('Delete error:', error)
      toast.error('فشل في حذف الملف')
      throw error
    }
  }

  // Get files from media_library
  const getMediaFiles = async (options?: {
    tags?: string[]
    mimeType?: string
    limit?: number
  }) => {
    try {
      let query = supabase
        .from('media_library')
        .select('*')
        .eq('bucket_name', bucket)
        .order('created_at', { ascending: false })

      if (options?.tags) {
        query = query.overlaps('tags', options.tags)
      }

      if (options?.mimeType) {
        query = query.like('mime_type', `${options.mimeType}%`)
      }

      if (options?.limit) {
        query = query.limit(options.limit)
      }

      const { data, error } = await query

      if (error) throw error

      return data?.map(item => ({
        ...item,
        public_url: supabase.storage.from(bucket).getPublicUrl(item.filename).data.publicUrl
      })) || []

    } catch (error) {
      console.error('Error fetching media files:', error)
      return []
    }
  }

  return {
    uploadedFiles,
    progresses,
    uploadFiles,
    deleteFile,
    getMediaFiles,
    isUploading,
  }
}