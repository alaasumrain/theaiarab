import "./globals.css"
import { ReactNode } from "react"
import localFont from "next/font/local"

import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

import { ThemeProvider } from "./providers"

export const fontSans = localFont({
  src: "../fonts/haskoy.ttf",
  variable: "--font-sans",
})

const defaultUrl = process.env.VERCEL_URL
  ? `https://www.nextjs.design`
  : "http://localhost:3000"

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "العربي للذكاء الاصطناعي - مركزك الشامل لأدوات الذكاء الاصطناعي",
  description:
    "اكتشف أفضل أدوات الذكاء الاصطناعي مع شروحات باللغة العربية. ChatGPT، Midjourney، وأكثر. دروس، أخبار، ومصادر تعليمية للمجتمع العربي.",
  keywords:
    "ذكاء اصطناعي، أدوات AI، ChatGPT عربي، Midjourney، تعلم الذكاء الاصطناعي، دروس عربية، AI tools Arabic",
  structuredData: {
    "@context": "http://schema.org",
    "@type": "WebSite",
    name: "العربي للذكاء الاصطناعي",
    url: "https://www.theaiarab.com/",
    description:
      "المنصة العربية الشاملة لأدوات وموارد الذكاء الاصطناعي للمجتمع العربي.",
  },
  socialMediaTags: {
    "og:title": "العربي للذكاء الاصطناعي - مركزك الشامل لأدوات AI",
    "og:description":
      "اكتشف أفضل أدوات الذكاء الاصطناعي مع شروحات باللغة العربية. دروس، أخبار، ومصادر تعليمية.",
    "twitter:card": "summary_large_image",
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${fontSans.variable} font-sans  `}>
      <body className="arabic-font">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <main className="bg-[#FAFAFA] dark:bg-background  text-foreground flex flex-col justify-center items-center w-full pt-13">
              <div className=" w-full ">{children}</div>
            </main>
          </TooltipProvider>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
