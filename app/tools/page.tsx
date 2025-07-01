import { redirect } from 'next/navigation'

// Redirect /tools to /products since that's where our AI tools are
export default function ToolsPage() {
  redirect('/products')
}