"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface SidebarContextType {
  isOpen: boolean
  toggle: () => void
  setOpen: (open: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

interface SidebarProviderProps {
  children: ReactNode
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [isOpen, setIsOpen] = useState(true)

  // Load saved state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("sidebar-open")
      if (saved !== null) {
        setIsOpen(JSON.parse(saved))
      }
    } catch (error) {
      console.warn("Could not load sidebar state from localStorage:", error)
    }
  }, [])

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("sidebar-open", JSON.stringify(isOpen))
    } catch (error) {
      console.warn("Could not save sidebar state to localStorage:", error)
    }
  }, [isOpen])

  const toggle = () => setIsOpen(!isOpen)
  const setOpen = (open: boolean) => setIsOpen(open)

  return (
    <SidebarContext.Provider value={{ isOpen, toggle, setOpen }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    // Return default values instead of throwing error
    return {
      isOpen: true,
      toggle: () => {},
      setOpen: () => {}
    }
  }
  return context
}