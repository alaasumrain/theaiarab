"use client"

import { useState } from "react"
import { Upload, X } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { FileUploader } from "@/components/cult/file-drop"
import { useMediaUpload } from "@/hooks/use-media-upload"
import { toast } from "sonner"

interface MediaUploadDialogProps {
  bucket: 'news-images' | 'tutorial-images' | 'site-assets' | 'product-logos'
  folder?: string
  children: React.ReactNode
  onUploadComplete?: () => void
}

export function MediaUploadDialog({ 
  bucket, 
  folder, 
  children,
  onUploadComplete 
}: MediaUploadDialogProps) {
  const [open, setOpen] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [altText, setAltText] = useState("")
  const [caption, setCaption] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")

  const { uploadFiles, isUploading } = useMediaUpload({
    bucket,
    folder,
    onUploadComplete: (uploadedFiles) => {
      toast.success(`تم رفع ${uploadedFiles.length} ملف بنجاح`)
      setOpen(false)
      resetForm()
      onUploadComplete?.()
    }
  })

  const resetForm = () => {
    setFiles([])
    setAltText("")
    setCaption("")
    setTags([])
    setTagInput("")
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("يرجى اختيار ملف واحد على الأقل")
      return
    }

    try {
      // For now, we'll upload files and handle metadata separately
      // In a full implementation, you'd pass the metadata to the upload function
      await uploadFiles(files)
    } catch (error) {
      toast.error("فشل في رفع الملفات")
    }
  }

  const bucketLabels = {
    'product-logos': 'شعارات الأدوات',
    'news-images': 'صور الأخبار', 
    'tutorial-images': 'صور الدروس',
    'site-assets': 'أصول الموقع'
  }

  const acceptedTypes = {
    'product-logos': { "image/png": [], "image/jpeg": [], "image/webp": [], "image/svg+xml": [] },
    'news-images': { "image/png": [], "image/jpeg": [], "image/webp": [], "image/gif": [] },
    'tutorial-images': { "image/png": [], "image/jpeg": [], "image/webp": [], "image/gif": [] },
    'site-assets': { "image/png": [], "image/jpeg": [], "image/webp": [], "image/gif": [], "image/svg+xml": [] }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            رفع ملفات جديدة
          </DialogTitle>
          <DialogDescription>
            رفع ملفات إلى {bucketLabels[bucket]}
            {folder && ` في مجلد "${folder}"`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Upload Area */}
          <div>
            <Label>اختيار الملفات</Label>
            <FileUploader
              value={files}
              onValueChange={setFiles}
              accept={acceptedTypes[bucket]}
              maxFiles={10}
              maxSize={5 * 1024 * 1024} // 5MB
              multiple
              className="mt-2"
            />
          </div>

          {/* Metadata Fields */}
          {files.length > 0 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="alt-text">النص البديل</Label>
                <Input
                  id="alt-text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="وصف الصورة للقراء الآليين..."
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="caption">التسمية التوضيحية</Label>
                <Textarea
                  id="caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="وصف أو شرح للصورة..."
                  className="mt-1"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="tags">العلامات</Label>
                <div className="mt-1 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      id="tags"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="أضف علامة..."
                      className="flex-1"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleAddTag}
                      disabled={!tagInput.trim()}
                    >
                      إضافة
                    </Button>
                  </div>
                  
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 hover:bg-transparent"
                            onClick={() => handleRemoveTag(tag)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Upload Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isUploading}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleUpload}
              disabled={files.length === 0 || isUploading}
            >
              {isUploading ? "جاري الرفع..." : `رفع ${files.length} ملف`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}