"use client"

import { createContext, useContext, useState, ReactNode } from 'react'
import { Language, translations, t } from '@/lib/translations'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  isRTL: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ar')
  
  const translate = (key: string) => t(language, key)
  const isRTL = language === 'ar'
  
  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t: translate, 
      isRTL 
    }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}