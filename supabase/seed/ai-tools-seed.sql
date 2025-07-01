-- Insert AI tool categories in Arabic
INSERT INTO public.products (
  full_name, email, twitter_handle, product_website, codename, 
  punchline, description, user_id, categories, tags, labels, 
  approved, featured, tool_type, difficulty_level, language_support, 
  is_free, arabic_name, arabic_description
) VALUES 
-- ChatGPT
(
  'OpenAI Team', 'support@openai.com', '@OpenAI', 'https://chat.openai.com',
  'ChatGPT', 'أقوى نموذج محادثة بالذكاء الاصطناعي',
  'ChatGPT is an AI chatbot that can help with writing, analysis, coding, and creative tasks',
  (SELECT id FROM auth.users LIMIT 1),
  'أدوات الكتابة',
  ARRAY['ai-chat', 'writing', 'coding', 'analysis'],
  ARRAY['productivity', 'ai-assistant'],
  true, true, 'text-generation', 'مبتدئ',
  ARRAY['English', 'Arabic', 'Spanish', 'French'],
  true, 'شات جي بي تي',
  'نموذج ذكاء اصطناعي متقدم للمحادثة والكتابة وحل المشكلات. يساعد في الكتابة والبرمجة والتحليل والمهام الإبداعية بلغات متعددة.'
),
-- Claude
(
  'Anthropic Team', 'support@anthropic.com', '@AnthropicAI', 'https://claude.ai',
  'Claude', 'مساعد ذكي بقدرات تحليلية متقدمة',
  'Claude is an AI assistant focused on being helpful, harmless, and honest with advanced reasoning',
  (SELECT id FROM auth.users LIMIT 1),
  'أدوات الكتابة',
  ARRAY['ai-chat', 'writing', 'analysis', 'coding'],
  ARRAY['productivity', 'ai-assistant'],
  true, true, 'text-generation', 'مبتدئ',
  ARRAY['English', 'Arabic', 'Multiple'],
  true, 'كلود',
  'مساعد ذكاء اصطناعي من Anthropic متخصص في التحليل المتقدم والمحادثات الطويلة. ممتاز للبحث والكتابة الأكاديمية.'
),
-- Midjourney
(
  'Midjourney Team', 'support@midjourney.com', '@midjourney', 'https://midjourney.com',
  'Midjourney', 'إنشاء صور فنية مذهلة بالذكاء الاصطناعي',
  'AI art generator that creates stunning images from text descriptions',
  (SELECT id FROM auth.users LIMIT 1),
  'إنشاء الصور',
  ARRAY['image-generation', 'ai-art', 'design'],
  ARRAY['creative', 'visual-content'],
  true, true, 'image-generation', 'متوسط',
  ARRAY['English'],
  false, 'ميدجورني',
  'أداة متقدمة لإنشاء الصور الفنية باستخدام الذكاء الاصطناعي. تنتج صورًا عالية الجودة من الوصف النصي.'
),
-- DALL-E 3
(
  'OpenAI Team', 'support@openai.com', '@OpenAI', 'https://openai.com/dall-e-3',
  'DALL-E 3', 'إنشاء صور واقعية ودقيقة',
  'Advanced AI image generator with high accuracy and text rendering capabilities',
  (SELECT id FROM auth.users LIMIT 1),
  'إنشاء الصور',
  ARRAY['image-generation', 'ai-art', 'design'],
  ARRAY['creative', 'visual-content'],
  true, false, 'image-generation', 'مبتدئ',
  ARRAY['English', 'Arabic'],
  false, 'دال إي 3',
  'نموذج متطور من OpenAI لإنشاء الصور بدقة عالية وقدرة على كتابة النصوص داخل الصور.'
),
-- GitHub Copilot
(
  'GitHub Team', 'support@github.com', '@github', 'https://github.com/features/copilot',
  'GitHub Copilot', 'مساعد البرمجة بالذكاء الاصطناعي',
  'AI pair programmer that helps you write code faster with suggestions',
  (SELECT id FROM auth.users LIMIT 1),
  'أدوات البرمجة',
  ARRAY['coding', 'development', 'ai-assistant'],
  ARRAY['developer-tools', 'productivity'],
  true, false, 'code-assistant', 'متوسط',
  ARRAY['All Programming Languages'],
  false, 'جيت هاب كوبايلوت',
  'مساعد برمجة يعمل بالذكاء الاصطناعي يقترح أكواد برمجية أثناء الكتابة. يدعم جميع لغات البرمجة الشائعة.'
),
-- Perplexity AI
(
  'Perplexity Team', 'support@perplexity.ai', '@perplexity_ai', 'https://perplexity.ai',
  'Perplexity AI', 'محرك بحث بالذكاء الاصطناعي',
  'AI-powered search engine that provides accurate answers with sources',
  (SELECT id FROM auth.users LIMIT 1),
  'أدوات البحث',
  ARRAY['search', 'research', 'ai-assistant'],
  ARRAY['productivity', 'research-tools'],
  true, false, 'search-engine', 'مبتدئ',
  ARRAY['English', 'Arabic'],
  true, 'بيربليكسيتي',
  'محرك بحث متقدم يستخدم الذكاء الاصطناعي لتوفير إجابات دقيقة مع المصادر. ممتاز للبحث الأكاديمي.'
),
-- Runway ML
(
  'Runway Team', 'support@runwayml.com', '@runwayml', 'https://runwayml.com',
  'Runway ML', 'إنشاء وتحرير الفيديو بالذكاء الاصطناعي',
  'AI-powered video generation and editing platform for creators',
  (SELECT id FROM auth.users LIMIT 1),
  'إنشاء الفيديو',
  ARRAY['video-generation', 'video-editing', 'ai-creative'],
  ARRAY['creative', 'video-tools'],
  true, false, 'video-generation', 'متقدم',
  ARRAY['English'],
  false, 'رانواي إم إل',
  'منصة متقدمة لإنشاء وتحرير الفيديو باستخدام الذكاء الاصطناعي. تتضمن أدوات لإزالة الخلفية وتوليد الفيديو.'
),
-- Notion AI
(
  'Notion Team', 'support@notion.so', '@NotionHQ', 'https://notion.so/product/ai',
  'Notion AI', 'مساعد الكتابة والتنظيم الذكي',
  'AI writing assistant integrated into Notion workspace for better productivity',
  (SELECT id FROM auth.users LIMIT 1),
  'أدوات الإنتاجية',
  ARRAY['writing', 'productivity', 'organization'],
  ARRAY['productivity', 'workspace-tools'],
  true, false, 'productivity', 'مبتدئ',
  ARRAY['English', 'Arabic'],
  false, 'نوشن إيه آي',
  'مساعد ذكاء اصطناعي مدمج في منصة Notion للمساعدة في الكتابة والتلخيص وتنظيم المعلومات.'
),
-- Gemini
(
  'Google Team', 'support@google.com', '@Google', 'https://gemini.google.com',
  'Google Gemini', 'نموذج جوجل للذكاء الاصطناعي',
  'Google''s most capable AI model for text, code, and multimodal tasks',
  (SELECT id FROM auth.users LIMIT 1),
  'أدوات الكتابة',
  ARRAY['ai-chat', 'writing', 'analysis', 'multimodal'],
  ARRAY['productivity', 'ai-assistant'],
  true, false, 'text-generation', 'مبتدئ',
  ARRAY['English', 'Arabic', 'Multiple'],
  true, 'جوجل جيميني',
  'نموذج الذكاء الاصطناعي الأحدث من جوجل. يدعم النصوص والصور والأكواد البرمجية بقدرات متقدمة.'
),
-- Canva AI
(
  'Canva Team', 'support@canva.com', '@canva', 'https://canva.com',
  'Canva AI', 'تصميم جرافيك بمساعدة الذكاء الاصطناعي',
  'Design platform with AI-powered features for creating graphics and presentations',
  (SELECT id FROM auth.users LIMIT 1),
  'أدوات التصميم',
  ARRAY['design', 'graphics', 'ai-creative'],
  ARRAY['creative', 'design-tools'],
  true, false, 'design', 'مبتدئ',
  ARRAY['English', 'Arabic'],
  true, 'كانفا إيه آي',
  'منصة تصميم مع ميزات ذكاء اصطناعي لإنشاء التصاميم والعروض التقديمية. تتضمن أدوات لإزالة الخلفية وتوليد الصور.'
);