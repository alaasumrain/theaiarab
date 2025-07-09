"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { toast } from "sonner"
import { updateSettings } from "../actions"

interface SiteSetting {
  id: number
  key: string
  value: any
  description: string
  category: string
  is_sensitive: boolean
}

interface SettingsFormProps {
  settings: Record<string, SiteSetting>
  category: string
  sensitive?: boolean
}

export function SettingsForm({ settings, category, sensitive = false }: SettingsFormProps) {
  const [formData, setFormData] = useState(() => {
    const data: Record<string, any> = {}
    Object.entries(settings).forEach(([key, setting]) => {
      if (typeof setting.value === 'string') {
        data[key] = setting.value.replace(/"/g, '')
      } else {
        data[key] = setting.value
      }
    })
    return data
  })
  
  const [showSensitive, setShowSensitive] = useState<Record<string, boolean>>({})
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    startTransition(async () => {
      try {
        const result = await updateSettings(formData, category)
        
        if (result.error) {
          toast.error(result.error)
        } else {
          toast.success('تم حفظ الإعدادات بنجاح')
          router.refresh()
        }
      } catch (error) {
        toast.error('حدث خطأ أثناء حفظ الإعدادات')
      }
    })
  }

  const handleInputChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const toggleSensitiveVisibility = (key: string) => {
    setShowSensitive(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const renderInput = (key: string, setting: SiteSetting) => {
    const value = formData[key]
    const isBoolean = typeof value === 'boolean'
    const isNumber = typeof value === 'number'
    const isSensitive = setting.is_sensitive || key.includes('smtp')

    if (isBoolean) {
      return (
        <div className="flex items-center space-x-2">
          <Switch
            checked={value}
            onCheckedChange={(checked) => handleInputChange(key, checked)}
          />
          <Label htmlFor={key} className="text-sm">
            {value ? 'مفعل' : 'معطل'}
          </Label>
        </div>
      )
    }

    if (key === 'default_language') {
      return (
        <Select value={value} onValueChange={(val) => handleInputChange(key, val)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ar">العربية</SelectItem>
            <SelectItem value="en">English</SelectItem>
          </SelectContent>
        </Select>
      )
    }

    if (key.includes('description') || key === 'punchline') {
      return (
        <Textarea
          value={value || ''}
          onChange={(e) => handleInputChange(key, e.target.value)}
          className="min-h-[80px]"
          placeholder={setting.description}
        />
      )
    }

    if (isSensitive) {
      return (
        <div className="relative">
          <Input
            type={showSensitive[key] ? 'text' : 'password'}
            value={value || ''}
            onChange={(e) => handleInputChange(key, e.target.value)}
            placeholder={setting.description}
            className="pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => toggleSensitiveVisibility(key)}
          >
            {showSensitive[key] ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      )
    }

    return (
      <Input
        type={isNumber ? 'number' : 'text'}
        value={value || ''}
        onChange={(e) => handleInputChange(key, isNumber ? parseInt(e.target.value) : e.target.value)}
        placeholder={setting.description}
      />
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4">
        {Object.entries(settings).map(([key, setting]) => (
          <div key={key} className="space-y-2">
            <Label htmlFor={key} className="text-sm font-medium">
              {setting.description}
            </Label>
            {renderInput(key, setting)}
          </div>
        ))}
      </div>
      
      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isPending} size="sm">
          <Save className="h-4 w-4 ml-2" />
          {isPending ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
        </Button>
      </div>
    </form>
  )
}