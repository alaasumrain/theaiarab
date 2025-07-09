import { notFound, redirect } from "next/navigation"
import { Metadata } from "next"

import { FadeIn } from "@/components/cult/fade-in"
import { getProductById } from "@/app/actions/product"

import { ProductDetails } from "./details"

// JSON-LD structured data for better SEO
function generateProductJsonLd(product: any) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.arabic_name || product.codename,
    description: product.arabic_description || product.description,
    image: product.logo_src,
    applicationCategory: product.categories || "AI Tool",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: product.is_free ? "0" : "N/A",
      priceCurrency: product.is_free ? "USD" : undefined,
      availability: "https://schema.org/InStock"
    },
    aggregateRating: product.averageRating ? {
      "@type": "AggregateRating",
      ratingValue: product.averageRating,
      reviewCount: product.reviewCount || 0
    } : undefined,
    author: {
      "@type": "Organization",
      name: "العربي للذكاء الاصطناعي"
    },
    inLanguage: ["ar", "en"],
    keywords: product.tags?.join(", "),
    url: `https://theaiarab.com/products/${product.id}`
  }
}

export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}): Promise<Metadata> {
  const data = await getProductById(params.slug)
  
  if (!data || data.length === 0) {
    return {
      title: "المنتج غير موجود - العربي للذكاء الاصطناعي"
    }
  }

  const product = data[0]
  
  return {
    title: `${product.arabic_name || product.codename} - العربي للذكاء الاصطناعي`,
    description: product.arabic_description || product.description || `اكتشف ${product.arabic_name || product.codename} - أداة ذكاء اصطناعي متقدمة للمستخدمين العرب`,
    openGraph: {
      title: product.arabic_name || product.codename,
      description: product.arabic_description || product.description,
      images: product.logo_src ? [product.logo_src] : undefined,
      type: 'website',
      url: `https://theaiarab.com/products/${product.id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: product.arabic_name || product.codename,
      description: product.arabic_description || product.description,
      images: product.logo_src ? [product.logo_src] : undefined,
    }
  }
}

const ProductIdPage = async ({ 
  params, 
  searchParams 
}: { 
  params: { slug: string }
  searchParams: { from?: string; category?: string; tag?: string; label?: string }
}) => {
  let data = await getProductById(params.slug)

  if (!data) {
    notFound()
    // redirect("/")
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateProductJsonLd(data[0])),
        }}
      />
      <div className="z-10">
        <div className=" py-4 w-full relative  mx-auto max-w-6xl">
          <FadeIn>{data ? <ProductDetails product={data[0]} searchParams={searchParams} /> : null}</FadeIn>
        </div>
      </div>
    </>
  )
}

export default ProductIdPage
