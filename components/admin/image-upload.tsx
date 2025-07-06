"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Upload, X, Image, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { uploadImages } from "@/app/actions/client-image-management"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface ImageUploadProps {
  bucketId?: string
  onUploadComplete?: (urls: string[]) => void
  onUploadError?: (errors: string[]) => void
  maxFiles?: number
  acceptedTypes?: string[]
  className?: string
  autoUpload?: boolean
}

interface UploadFile {
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
  url?: string
}

const BUCKET_OPTIONS = [
  { id: 'product-logos', label: 'شعارات الأدوات', description: 'صور شعارات أدوات الذكاء الاصطناعي' },
  { id: 'news-images', label: 'صور الأخبار', description: 'صور المقالات والأخبار' },
  { id: 'tutorial-images', label: 'صور الدروس', description: 'صور وأمثلة الدروس التعليمية' },
  { id: 'site-assets', label: 'ملفات الموقع', description: 'الصور العامة وملفات الموقع' }
]

export function ImageUpload({
  bucketId,
  onUploadComplete,
  onUploadError,
  maxFiles = 10,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  className,
  autoUpload = false
}: ImageUploadProps) {
  const [selectedBucket, setSelectedBucket] = useState(bucketId || 'site-assets')
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `نوع الملف غير مدعوم: ${file.type}. استخدم: ${acceptedTypes.map(type => type.split('/')[1]).join(', ')}`
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      return `حجم الملف كبير جداً (${(file.size / 1024 / 1024).toFixed(1)} ميجابايت). الحد الأقصى 10 ميجابايت`
    }
    return null
  }

  const addFiles = useCallback((files: File[]) => {
    const validFiles: UploadFile[] = []
    
    for (const file of files) {
      if (uploadFiles.length + validFiles.length >= maxFiles) {
        toast.warning(`تم الوصول للحد الأقصى من الملفات (${maxFiles})`)
        break
      }
      
      const error = validateFile(file)
      
      validFiles.push({
        file,
        progress: 0,
        status: error ? 'error' : 'pending',
        error: error || undefined
      })
    }
    
    setUploadFiles(prev => [...prev, ...validFiles])
    
    // Show success message for valid files
    const validCount = validFiles.filter(f => !f.error).length
    if (validCount > 0) {
      toast.success(`تم إضافة ${validCount} ملف${validCount > 1 ? 'ات' : ''} للرفع`)
    }
  }, [uploadFiles.length, maxFiles])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    addFiles(files)
  }, [addFiles])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      addFiles(files)
    }
  }, [addFiles])

  const removeFile = (index: number) => {
    setUploadFiles(prev => prev.filter((_, i) => i !== index))
  }

  const clearAll = () => {
    setUploadFiles([])
  }

  const uploadAllFiles = async () => {
    if (isUploading || uploadFiles.length === 0) return
    
    setIsUploading(true)
    
    const filesToUpload = uploadFiles
      .filter(f => f.status === 'pending')
      .map(f => f.file)
    
    if (filesToUpload.length === 0) {
      setIsUploading(false)
      return
    }

    try {
      // Update status to uploading
      setUploadFiles(prev => prev.map(f => 
        f.status === 'pending' ? { ...f, status: 'uploading' as const, progress: 0 } : f
      ))

      // Simulate progress for each file
      const progressInterval = setInterval(() => {
        setUploadFiles(prev => prev.map(f => 
          f.status === 'uploading' && f.progress < 90 
            ? { ...f, progress: f.progress + Math.random() * 20 }
            : f
        ))
      }, 500)

      const result = await uploadImages(selectedBucket, filesToUpload)
      
      clearInterval(progressInterval)

      // Update final status
      setUploadFiles(prev => {
        const updatedFiles = [...prev]
        let successIndex = 0
        let errorIndex = 0
        
        for (let i = 0; i < updatedFiles.length; i++) {
          if (updatedFiles[i].status === 'uploading') {
            if (successIndex < result.urls.length) {
              updatedFiles[i] = {
                ...updatedFiles[i],
                status: 'success',
                progress: 100,
                url: result.urls[successIndex]
              }
              successIndex++
            } else if (errorIndex < result.errors.length) {
              updatedFiles[i] = {
                ...updatedFiles[i],
                status: 'error',
                progress: 0,
                error: result.errors[errorIndex]
              }
              errorIndex++
            }
          }
        }
        
        return updatedFiles
      })

      if (result.success && onUploadComplete) {
        onUploadComplete(result.urls)
      }
      
      if (result.errors.length > 0 && onUploadError) {
        onUploadError(result.errors)
      }

    } catch (error) {
      console.error('Upload error:', error)
      setUploadFiles(prev => prev.map(f => 
        f.status === 'uploading' 
          ? { ...f, status: 'error' as const, progress: 0, error: 'فشل في الرفع' }
          : f
      ))
    } finally {
      setIsUploading(false)
    }
  }

  // Auto-upload effect
  useEffect(() => {
    if (autoUpload && !isUploading) {
      const pendingFiles = uploadFiles.filter(f => f.status === 'pending')
      if (pendingFiles.length > 0) {
        // Small delay to ensure state is updated
        const timer = setTimeout(() => {
          uploadAllFiles()
        }, 100)
        return () => clearTimeout(timer)
      }
    }
  }, [uploadFiles, autoUpload, isUploading])

  const getStatusIcon = (status: UploadFile['status']) => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="h-4 w-4 animate-spin" />
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Image className="h-4 w-4" />
    }
  }

  const pendingCount = uploadFiles.filter(f => f.status === 'pending').length
  const successCount = uploadFiles.filter(f => f.status === 'success').length
  const errorCount = uploadFiles.filter(f => f.status === 'error').length

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          رفع الصور
        </CardTitle>
        <CardDescription>
          {autoUpload 
            ? `اسحب الصور هنا أو انقر لاختيارها - سيتم الرفع تلقائياً (الحد الأقصى ${maxFiles} صور)`
            : `اسحب الصور هنا أو انقر لاختيارها (الحد الأقصى ${maxFiles} صور)`
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Bucket Selection */}
        {!bucketId && (
          <div>
            <label className="text-sm font-medium mb-2 block">اختر المجلد:</label>
            <Select value={selectedBucket} onValueChange={setSelectedBucket}>
              <SelectTrigger>
                <SelectValue placeholder="اختر مجلد التخزين" />
              </SelectTrigger>
              <SelectContent>
                {BUCKET_OPTIONS.map(bucket => (
                  <SelectItem key={bucket.id} value={bucket.id}>
                    <div>
                      <div className="font-medium">{bucket.label}</div>
                      <div className="text-sm text-muted-foreground">{bucket.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Drop Zone */}
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
            isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25",
            isUploading && "pointer-events-none opacity-50"
          )}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragOver(true)
          }}
          onDragLeave={() => setIsDragOver(false)}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-medium mb-2">اسحب الصور هنا</p>
          <p className="text-sm text-muted-foreground mb-4">
            أو انقر لاختيار الملفات من جهازك
          </p>
          <Badge variant="outline">
            {acceptedTypes.map(type => type.split('/')[1]).join(', ')} - حتى 10 ميجابايت
          </Badge>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* File List */}
        {uploadFiles.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">الملفات المحددة ({uploadFiles.length})</h4>
              <div className="flex gap-2">
                {pendingCount > 0 && !autoUpload && (
                  <Button 
                    onClick={uploadAllFiles} 
                    disabled={isUploading}
                    size="sm"
                  >
                    {isUploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    رفع {pendingCount} ملف
                  </Button>
                )}
                {autoUpload && isUploading && (
                  <Badge variant="default" className="bg-blue-100 text-blue-800">
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                    جاري الرفع التلقائي...
                  </Badge>
                )}
                <Button variant="outline" size="sm" onClick={clearAll}>
                  مسح الكل
                </Button>
              </div>
            </div>

            {/* Upload Summary */}
            {(successCount > 0 || errorCount > 0) && (
              <div className="flex gap-4 text-sm">
                {successCount > 0 && (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    ✓ {successCount} نجح
                  </Badge>
                )}
                {errorCount > 0 && (
                  <Badge variant="destructive">
                    ✗ {errorCount} فشل
                  </Badge>
                )}
              </div>
            )}

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {uploadFiles.map((uploadFile, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
                >
                  {getStatusIcon(uploadFile.status)}
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {uploadFile.file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    {uploadFile.error && (
                      <p className="text-xs text-red-600 mt-1">{uploadFile.error}</p>
                    )}
                  </div>

                  {uploadFile.status === 'uploading' && (
                    <div className="w-24">
                      <Progress value={uploadFile.progress} className="h-2" />
                    </div>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    disabled={uploadFile.status === 'uploading'}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 