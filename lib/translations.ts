export const translations = {
  ar: {
    // Navigation
    nav: {
      home: "الرئيسية",
      submit: "أضف أداة",
      login: "تسجيل الدخول",
      logout: "تسجيل الخروج", 
      myAccount: "حسابي",
      admin: "لوحة التحكم",
      settings: "الإعدادات",
      support: "الدعم",
      categories: "الفئات",
      tags: "العلامات",
      labels: "التصنيفات"
    },
    
    // Homepage
    home: {
      title: "العربي للذكاء الاصطناعي",
      subtitle: "مركزك الشامل لأدوات الذكاء الاصطناعي",
      description: "اكتشف أفضل أدوات الذكاء الاصطناعي مع شروحات بالعربية",
      fullDescription: "دليلك الشامل لـ ChatGPT، Midjourney، Claude وأكثر من 100 أداة ذكاء اصطناعي",
      addNewTool: "أضف أداة جديدة",
      tutorials: "دروس تعليمية",
      news: "آخر الأخبار",
      popularTools: "الأدوات الأكثر شعبية",
      allTools: "جميع الأدوات",
      viewAll: "عرض الكل",
      toolsCount: "أداة",
      updated: "محدث يومياً"
    },
    
    // Submission Form  
    submit: {
      personalInfo: "لنبدأ بمعلوماتك الشخصية",
      productInfo: "أخبرنا المزيد عن الأداة",
      fullName: "الاسم الكامل",
      email: "البريد الإلكتروني", 
      twitter: "حساب تويتر/X",
      website: "موقع الأداة",
      productName: "اسم الأداة",
      punchline: "وصف مختصر للأداة (أقل من 10 كلمات)",
      description: "وصف تفصيلي (حوالي 70 كلمة)",
      logo: "شعار الأداة (.jpg أو .png، 128x128)",
      category: "فئة الأداة",
      selectCategory: "اختر فئة",
      difficulty: "مستوى الصعوبة",
      supportsArabic: "تدعم اللغة العربية",
      free: "مجانية",
      submitting: "جاري الإرسال..."
    },
    
    // Categories
    categories: {
      "أدوات الكتابة": "أدوات الكتابة",
      "إنشاء الصور": "إنشاء الصور", 
      "إنشاء الفيديو": "إنشاء الفيديو",
      "أدوات البرمجة": "أدوات البرمجة",
      "أدوات الصوت": "أدوات الصوت",
      "أدوات الإنتاجية": "أدوات الإنتاجية",
      "أدوات التصميم": "أدوات التصميم",
      "أدوات البحث": "أدوات البحث",
      "أدوات التعليم": "أدوات التعليم",
      "أدوات الأعمال": "أدوات الأعمال"
    },
    
    // Difficulty levels
    difficulty: {
      "مبتدئ": "مبتدئ",
      "متوسط": "متوسط", 
      "متقدم": "متقدم"
    },
    
    // Common
    common: {
      free: "مجاني",
      paid: "مدفوع",
      explore: "استكشف",
      loading: "جاري التحميل...",
      search: "بحث",
      filter: "تصفية"
    }
  },
  
  en: {
    // Navigation  
    nav: {
      home: "Home",
      submit: "Add Tool", 
      login: "Login",
      logout: "Logout",
      myAccount: "My Account",
      admin: "Admin Dashboard",
      settings: "Settings",
      support: "Support", 
      categories: "Categories",
      tags: "Tags",
      labels: "Labels"
    },
    
    // Homepage
    home: {
      title: "AI Arab",
      subtitle: "Your comprehensive AI tools hub",
      description: "Discover the best AI tools with Arabic explanations",
      fullDescription: "Your complete guide to ChatGPT, Midjourney, Claude and 100+ AI tools",
      addNewTool: "Add New Tool",
      tutorials: "Tutorials",
      news: "Latest News",
      popularTools: "Most Popular Tools", 
      allTools: "All Tools",
      viewAll: "View All",
      toolsCount: "tools",
      updated: "Updated daily"
    },
    
    // Submission Form
    submit: {
      personalInfo: "Let's start with your personal details",
      productInfo: "Tell us more about your product",
      fullName: "Full Name",
      email: "Email Address",
      twitter: "Twitter/X Handle", 
      website: "Product Website",
      productName: "Product Name",
      punchline: "Product tagline (<10 words)",
      description: "Short description (~70 words)",
      logo: "Logo file (.jpg or .png, 128x128)",
      category: "Product Category",
      selectCategory: "Select category",
      difficulty: "Difficulty Level",
      supportsArabic: "Supports Arabic",
      free: "Free to use",
      submitting: "Submitting..."
    },
    
    // Categories (English versions)
    categories: {
      "أدوات الكتابة": "Writing Tools",
      "إنشاء الصور": "Image Generation",
      "إنشاء الفيديو": "Video Generation", 
      "أدوات البرمجة": "Coding Tools",
      "أدوات الصوت": "Audio Tools",
      "أدوات الإنتاجية": "Productivity Tools",
      "أدوات التصميم": "Design Tools",
      "أدوات البحث": "Search Tools",
      "أدوات التعليم": "Education Tools", 
      "أدوات الأعمال": "Business Tools"
    },
    
    // Difficulty levels
    difficulty: {
      "مبتدئ": "Beginner",
      "متوسط": "Intermediate",
      "متقدم": "Advanced"
    },
    
    // Common
    common: {
      free: "Free",
      paid: "Paid", 
      explore: "Explore",
      loading: "Loading...",
      search: "Search",
      filter: "Filter"
    }
  }
}

export type Language = keyof typeof translations
export type TranslationKey = keyof typeof translations.ar

// Helper function to get translation
export const t = (lang: Language, key: string): string => {
  const keys = key.split('.')
  let value: any = translations[lang]
  
  for (const k of keys) {
    value = value?.[k]
  }
  
  return value || key
}

// Hook for using translations
export const useTranslations = (lang: Language = 'ar') => {
  return (key: string) => t(lang, key)
}