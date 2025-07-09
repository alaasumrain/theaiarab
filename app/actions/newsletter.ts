"use server"

import { createClient } from "@/db/supabase/server"
import { revalidatePath } from "next/cache"

export interface NewsletterSignupResult {
  success: boolean
  error?: string
  message?: string
}

export async function subscribeToNewsletter(email: string): Promise<NewsletterSignupResult> {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: "البريد الإلكتروني غير صالح"
      }
    }

    const supabase = createClient()

    // Check if email already exists
    const { data: existingSubscriber, error: checkError } = await supabase
      .from('newsletter_subscribers')
      .select('email, unsubscribed_at')
      .eq('email', email.toLowerCase())
      .single()

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking existing subscriber:', checkError)
      return {
        success: false,
        error: "حدث خطأ في التحقق من البريد الإلكتروني"
      }
    }

    if (existingSubscriber) {
      if (!existingSubscriber.unsubscribed_at) {
        return {
          success: false,
          error: "هذا البريد الإلكتروني مسجل مسبقاً"
        }
      } else {
        // Re-subscribe previously unsubscribed user
        const { error: updateError } = await supabase
          .from('newsletter_subscribers')
          .update({
            unsubscribed_at: null,
            subscribed_at: new Date().toISOString(),
            confirmed: false
          })
          .eq('email', email.toLowerCase())

        if (updateError) {
          console.error('Error re-subscribing user:', updateError)
          return {
            success: false,
            error: "حدث خطأ في إعادة التسجيل"
          }
        }

        return {
          success: true,
          message: "تم تجديد اشتراكك بنجاح!"
        }
      }
    }

    // Add new subscriber
    const { error: insertError } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email: email.toLowerCase(),
        confirmed: false,
        subscribed_at: new Date().toISOString()
      })

    if (insertError) {
      console.error('Error inserting subscriber:', insertError)
      return {
        success: false,
        error: "حدث خطأ في التسجيل. يرجى المحاولة مرة أخرى."
      }
    }

    // Revalidate any pages that might show subscriber count
    revalidatePath('/')

    return {
      success: true,
      message: "تم تسجيلك بنجاح! ترقب رسائلنا قريباً."
    }

  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return {
      success: false,
      error: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى."
    }
  }
}

export async function getNewsletterSubscriberCount(): Promise<number> {
  try {
    const supabase = createClient()
    
    const { count, error } = await supabase
      .from('newsletter_subscribers')
      .select('*', { count: 'exact', head: true })
      .is('unsubscribed_at', null)

    if (error) {
      console.error('Error getting subscriber count:', error)
      return 0
    }

    return count || 0
  } catch (error) {
    console.error('Newsletter subscriber count error:', error)
    return 0
  }
}