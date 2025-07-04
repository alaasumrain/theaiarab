"use client"

import Script from "next/script"
import { useEffect } from "react"

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID || 'G-R473YK9PVY'

declare global {
  interface Window {
    gtag: (command: string, ...args: any[]) => void
    dataLayer: any[]
  }
}

// Log page views to Google Analytics
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    })
  }
}

// Log events to Google Analytics
export const event = ({ action, category, label, value }: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

export function GoogleAnalytics() {
  // Only load in production or when GA_TRACKING_ID is set
  if (!GA_TRACKING_ID || process.env.NODE_ENV !== 'production') {
    return null
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_TRACKING_ID}', {
            page_path: window.location.pathname,
            // Privacy settings for GDPR compliance
            anonymize_ip: true,
            cookie_flags: 'max-age=7200;secure;samesite=none',
            // Additional privacy settings
            allow_google_signals: false,
            allow_ad_personalization_signals: false
          });
        `}
      </Script>
    </>
  )
}

// Hook to track page views
export function useAnalytics() {
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      pageview(url)
    }

    // Track initial page load
    if (typeof window !== 'undefined') {
      pageview(window.location.pathname)
    }

    return () => {
      // Cleanup if needed
    }
  }, [])
} 