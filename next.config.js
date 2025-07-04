/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Supabase storage (our primary image source)
      {
        protocol: "https",
        hostname: "**.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**/**",
      },
      // GitHub avatars and user content
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "github.com",
        port: "",
        pathname: "/**",
      },
      // OpenAI CDN
      {
        protocol: "https",
        hostname: "cdn.openai.com",
        port: "",
        pathname: "/**",
      },
      // Common external image domains for AI tools
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media.discordapp.net",
        port: "",
        pathname: "/**",
      },
      // AI tool logos and assets
      {
        protocol: "https",
        hostname: "logo.clearbit.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ph-files.imgix.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
        port: "",
        pathname: "/**",
      },
      // Google services
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      // AWS/CloudFront
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.cloudfront.net",
        port: "",
        pathname: "/**",
      },
      // Character.AI
      {
        protocol: "https",
        hostname: "characterai.io",
        port: "",
        pathname: "/**",
      },
      // Grammarly
      {
        protocol: "https",
        hostname: "static.grammarly.com",
        port: "",
        pathname: "/**",
      },
      // Looka/Logojoy
      {
        protocol: "https",
        hostname: "cdn.logojoy.com",
        port: "",
        pathname: "/**",
      },
      // More AI tool domains
      {
        protocol: "https",
        hostname: "app-logos.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.ai",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.io",
        port: "",
        pathname: "/**",
      },
      // Logo and branding CDNs
      {
        protocol: "https",
        hostname: "cdn.logojoy.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.jsdelivr.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.unpkg.com",
        port: "",
        pathname: "/**",
      },
      // Company websites and favicons
      {
        protocol: "https",
        hostname: "*.com",
        port: "",
        pathname: "/favicon.ico",
      },
      {
        protocol: "https",
        hostname: "*.app",
        port: "",
        pathname: "/**",
      },
      // Additional domains
      {
        protocol: "https",
        hostname: "gamma.app",
        port: "",
        pathname: "/**",
      },
      // Other common CDNs
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.vercel.app",
        port: "",
        pathname: "/**",
      },
      // For development and fallbacks
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        port: "",
        pathname: "/**",
      }
    ],
  },
}

module.exports = nextConfig
