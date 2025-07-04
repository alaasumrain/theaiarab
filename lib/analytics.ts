import { event } from '@/components/analytics'

// Track tool clicks
export const trackToolClick = (toolName: string, category: string = 'Tools') => {
  event({
    action: 'tool_click',
    category,
    label: toolName
  })
}

// Track tool page views
export const trackToolView = (toolName: string, toolId: string) => {
  event({
    action: 'tool_view',
    category: 'Tools',
    label: `${toolName} (${toolId})`
  })
}

// Track search queries
export const trackSearch = (query: string, resultsCount: number) => {
  event({
    action: 'search',
    category: 'Search',
    label: query,
    value: resultsCount
  })
}

// Track news article views
export const trackNewsView = (articleTitle: string, articleId: string) => {
  event({
    action: 'news_view',
    category: 'News',
    label: `${articleTitle} (${articleId})`
  })
}

// Track tutorial views
export const trackTutorialView = (tutorialTitle: string, tutorialId: string) => {
  event({
    action: 'tutorial_view',
    category: 'Tutorials',
    label: `${tutorialTitle} (${tutorialId})`
  })
}

// Track favorites
export const trackFavoriteAction = (action: 'add' | 'remove', toolName: string) => {
  event({
    action: `favorite_${action}`,
    category: 'Favorites',
    label: toolName
  })
}

// Track external links
export const trackExternalLink = (url: string, source: string) => {
  event({
    action: 'external_link',
    category: 'External Links',
    label: `${source} -> ${url}`
  })
}

// Track form submissions
export const trackFormSubmission = (formName: string, success: boolean = true) => {
  event({
    action: 'form_submission',
    category: 'Forms',
    label: formName,
    value: success ? 1 : 0
  })
}

// Track admin actions
export const trackAdminAction = (action: string, entity: string, entityId?: string) => {
  event({
    action: `admin_${action}`,
    category: 'Admin',
    label: entityId ? `${entity} (${entityId})` : entity
  })
} 