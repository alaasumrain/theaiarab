-- Seed data for AI tools directory
-- Insert popular AI tools with Arabic descriptions

INSERT INTO products (
  id, full_name, email, twitter_handle, product_website, codename, punchline, description, 
  logo_src, tags, labels, categories, approved, view_count, created_at,
  tool_type, difficulty_level, language_support, is_free, arabic_name, arabic_description, pricing_model
) VALUES

-- Text Generation Tools
('550e8400-e29b-41d4-a716-446655440001', 'OpenAI', 'support@openai.com', '@openai', 'https://chat.openai.com', 'ChatGPT', 'أقوى نموذج ذكاء اصطناعي للمحادثة والكتابة', 'نموذج ذكاء اصطناعي متقدم من OpenAI يمكنه الكتابة والترجمة والبرمجة والإجابة على الأسئلة بذكاء عالي. يدعم العربية بشكل ممتاز ويمكن استخدامه في التعليم والعمل والإبداع.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/120px-ChatGPT_logo.svg.png', ARRAY['نص', 'محادثة', 'كتابة'], ARRAY['مجاني', 'مدفوع'], 'أدوات الكتابة', true, 1250, NOW(), 'text-generation', 'مبتدئ', ARRAY['Arabic', 'English'], false, 'شات جي بي تي', 'نموذج ذكاء اصطناعي متقدم للمحادثة والكتابة يدعم العربية بشكل ممتاز', 'freemium'),

('550e8400-e29b-41d4-a716-446655440002', 'Anthropic', 'support@anthropic.com', '@anthropicai', 'https://claude.ai', 'Claude', 'مساعد ذكي متقدم للكتابة والتحليل', 'مساعد ذكاء اصطناعي من Anthropic متخصص في الكتابة الطويلة والتحليل العميق. يتميز بقدرته على فهم السياق والحفاظ على الأمان في المحادثات.', 'https://pbs.twimg.com/profile_images/1692930008629100544/9JfUyYSi_400x400.jpg', ARRAY['نص', 'تحليل', 'كتابة'], ARRAY['مجاني', 'مدفوع'], 'أدوات الكتابة', true, 890, NOW(), 'text-generation', 'متوسط', ARRAY['Arabic', 'English'], false, 'كلود', 'مساعد ذكاء اصطناعي متقدم للكتابة والتحليل العميق', 'freemium'),

('550e8400-e29b-41d4-a716-446655440003', 'Google', 'support@google.com', '@google', 'https://gemini.google.com', 'Gemini', 'ذكاء اصطناعي متقدم من جوجل', 'نموذج ذكاء اصطناعي حديث من جوجل يجمع بين قوة البحث والذكاء التوليدي. يمكنه تحليل الصور والنصوص والبيانات بدقة عالية.', 'https://yt3.googleusercontent.com/VhojmOLKuZOJTQgB_LqWm3WhkOQCgVUDShPk-6mE5rGOSEqtWFXGEgk3Qjgg7uRl4BgP7rOm=s900-c-k-c0x00ffffff-no-rj', ARRAY['نص', 'بحث', 'تحليل'], ARRAY['مجاني'], 'أدوات الكتابة', true, 745, NOW(), 'text-generation', 'مبتدئ', ARRAY['Arabic', 'English'], true, 'جيميني', 'ذكاء اصطناعي متقدم من جوجل للنص والبحث', 'free'),

-- Image Generation Tools  
('550e8400-e29b-41d4-a716-446655440004', 'Midjourney Inc', 'support@midjourney.com', '@midjourney', 'https://midjourney.com', 'Midjourney', 'أفضل أداة لإنتاج الصور الفنية بالذكاء الاصطناعي', 'منصة رائدة في توليد الصور بالذكاء الاصطناعي تتميز بجودة فنية عالية ونتائج إبداعية مذهلة. تعمل من خلال Discord وتدعم الأوامر العربية.', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/midjourney/midjourney-original.svg', ARRAY['صور', 'فن', 'إبداع'], ARRAY['مدفوع'], 'إنشاء الصور', true, 2100, NOW(), 'image-generation', 'متوسط', ARRAY['Arabic', 'English'], false, 'ميدجورني', 'أفضل أداة لإنتاج الصور الفنية بالذكاء الاصطناعي', 'paid'),

('550e8400-e29b-41d4-a716-446655440005', 'OpenAI', 'support@openai.com', '@openai', 'https://openai.com/dall-e-3', 'DALL-E 3', 'مولد صور ذكي من OpenAI', 'أحدث إصدار من مولد الصور الذكي من OpenAI مع تحسينات كبيرة في فهم النصوص وجودة الصور المنتجة. متكامل مع ChatGPT.', 'https://cdn.openai.com/dall-e-3/landing/hero.jpg', ARRAY['صور', 'إبداع'], ARRAY['مدفوع'], 'إنشاء الصور', true, 1650, NOW(), 'image-generation', 'مبتدئ', ARRAY['Arabic', 'English'], false, 'دال إي 3', 'مولد صور ذكي متقدم من OpenAI', 'paid'),

('550e8400-e29b-41d4-a716-446655440006', 'Stability AI', 'hello@stability.ai', '@stabilityai', 'https://stability.ai', 'Stable Diffusion', 'مولد صور مفتوح المصدر قوي ومرن', 'نموذج ذكاء اصطناعي مفتوح المصدر لتوليد الصور عالية الجودة. يمكن تشغيله محلياً ويدعم التخصيص والتعديل المتقدم.', 'https://avatars.githubusercontent.com/u/99952836?s=280&v=4', ARRAY['صور', 'مفتوح المصدر'], ARRAY['مجاني'], 'إنشاء الصور', true, 1890, NOW(), 'image-generation', 'متقدم', ARRAY['English'], true, 'ستابل ديفيوجن', 'مولد صور مفتوح المصدر قوي ومرن', 'free'),

-- Code Assistant Tools
('550e8400-e29b-41d4-a716-446655440007', 'GitHub', 'support@github.com', '@github', 'https://github.com/features/copilot', 'GitHub Copilot', 'مساعد البرمجة الذكي من GitHub', 'مساعد ذكاء اصطناعي للمطورين يساعد في كتابة الكود وإكمال الدوال واقتراح الحلول البرمجية. يدعم أكثر من 30 لغة برمجة.', 'https://github.githubassets.com/images/modules/site/copilot/copilot.png', ARRAY['برمجة', 'كود', 'مطورين'], ARRAY['مدفوع'], 'أدوات البرمجة', true, 1420, NOW(), 'code-assistant', 'متوسط', ARRAY['English'], false, 'جيت هب كوبايلوت', 'مساعد البرمجة الذكي من GitHub', 'paid'),

('550e8400-e29b-41d4-a716-446655440008', 'Cursor', 'hello@cursor.sh', '@cursor_ai', 'https://cursor.sh', 'Cursor', 'محرر كود ذكي مدعوم بالذكاء الاصطناعي', 'محرر كود حديث مبني على VS Code مع ذكاء اصطناعي متكامل للمساعدة في الكتابة والتصحيح والمراجعة. يوفر تجربة برمجة سلسة ومتقدمة.', 'https://cursor.sh/brand/icon.svg', ARRAY['برمجة', 'محرر', 'ذكي'], ARRAY['مجاني', 'مدفوع'], 'أدوات البرمجة', true, 980, NOW(), 'code-assistant', 'متوسط', ARRAY['English'], false, 'كيرسر', 'محرر كود ذكي مدعوم بالذكاء الاصطناعي', 'freemium'),

-- Video Generation Tools
('550e8400-e29b-41d4-a716-446655440009', 'OpenAI', 'support@openai.com', '@openai', 'https://openai.com/sora', 'Sora', 'مولد فيديو ثوري من OpenAI', 'نموذج ذكاء اصطناعي متقدم لتوليد مقاطع فيديو عالية الجودة من النصوص. يمكنه إنشاء مشاهد معقدة بجودة سينمائية ومدة تصل إلى دقيقة.', 'https://cdn.openai.com/sora/april-2024/hero-mobile.mp4', ARRAY['فيديو', 'إبداع'], ARRAY['قريباً'], 'إنشاء الفيديو', true, 2500, NOW(), 'video-generation', 'متقدم', ARRAY['English'], false, 'سورا', 'مولد فيديو ثوري من OpenAI', 'coming-soon'),

('550e8400-e29b-41d4-a716-446655440010', 'RunwayML', 'hello@runwayml.com', '@runwayml', 'https://runwayml.com', 'RunwayML', 'منصة شاملة لإنتاج المحتوى الرقمي', 'منصة إبداعية تجمع أدوات الذكاء الاصطناعي المختلفة لإنتاج الفيديو والصور والصوت. مناسبة للمبدعين والشركات الإعلامية.', 'https://app.runwayml.com/favicon.ico', ARRAY['فيديو', 'إبداع', 'منصة'], ARRAY['مجاني', 'مدفوع'], 'إنشاء الفيديو', true, 1320, NOW(), 'video-generation', 'متوسط', ARRAY['English'], false, 'رانواي', 'منصة شاملة لإنتاج المحتوى الرقمي', 'freemium'),

-- Audio/Voice Tools
('550e8400-e29b-41d4-a716-446655440011', 'ElevenLabs', 'hello@elevenlabs.io', '@elevenlabsio', 'https://elevenlabs.io', 'ElevenLabs', 'تقنية متقدمة لتوليد الأصوات', 'منصة رائدة في تقنية تحويل النص إلى كلام بأصوات طبيعية ومعبرة. تدعم نسخ الأصوات وإنشاء أصوات مخصصة بجودة عالية.', 'https://elevenlabs.io/images/logo-dark.svg', ARRAY['صوت', 'نطق', 'تقليد'], ARRAY['مجاني', 'مدفوع'], 'أدوات الصوت', true, 1150, NOW(), 'audio-generation', 'متوسط', ARRAY['Arabic', 'English'], false, 'إليفن لابز', 'تقنية متقدمة لتوليد الأصوات الطبيعية', 'freemium'),

-- Productivity Tools
('550e8400-e29b-41d4-a716-446655440012', 'Notion', 'team@makenotion.com', '@notionhq', 'https://notion.so', 'Notion AI', 'مساعد ذكي لإدارة المعرفة والإنتاجية', 'ذكاء اصطناعي متكامل مع منصة Notion لمساعدة في الكتابة والتنظيم والتلخيص. يحول العمل التقليدي إلى تجربة ذكية ومنظمة.', 'https://www.notion.so/images/logo-ios.png', ARRAY['إنتاجية', 'تنظيم', 'كتابة'], ARRAY['مجاني', 'مدفوع'], 'أدوات الإنتاجية', true, 890, NOW(), 'productivity', 'مبتدئ', ARRAY['Arabic', 'English'], false, 'نوشن الذكي', 'مساعد ذكي لإدارة المعرفة والإنتاجية', 'freemium'),

('550e8400-e29b-41d4-a716-446655440013', 'Jasper', 'support@jasper.ai', '@jasper_ai', 'https://jasper.ai', 'Jasper', 'مساعد الكتابة التسويقية الذكي', 'منصة ذكاء اصطناعي متخصصة في كتابة المحتوى التسويقي والإعلاني. تساعد في إنشاء المقالات والإعلانات ومحتوى وسائل التواصل الاجتماعي.', 'https://assets.jasper.ai/chrome-extension/jasper-avatar.svg', ARRAY['تسويق', 'كتابة', 'محتوى'], ARRAY['مدفوع'], 'أدوات الإنتاجية', true, 720, NOW(), 'productivity', 'متوسط', ARRAY['English'], false, 'جاسبر', 'مساعد الكتابة التسويقية الذكي', 'paid'),

-- Search & Research Tools
('550e8400-e29b-41d4-a716-446655440014', 'Perplexity', 'hi@perplexity.ai', '@perplexity_ai', 'https://perplexity.ai', 'Perplexity', 'محرك بحث ذكي مدعوم بالذكاء الاصطناعي', 'محرك بحث متقدم يجمع بين قوة البحث التقليدي والذكاء الاصطناعي لتقديم إجابات دقيقة ومراجع موثوقة للأسئلة المعقدة.', 'https://yt3.ggpht.com/dMyTGsGVbww_sp-6R-0hGCsLgDCzLvs6qVnSW1b4t_p9dkMZnK1rJVi8pXJUXRRv8nZP4rN0=s900-c-k-c0x00ffffff-no-rj', ARRAY['بحث', 'إجابات', 'مراجع'], ARRAY['مجاني', 'مدفوع'], 'أدوات البحث', true, 1680, NOW(), 'search-engine', 'مبتدئ', ARRAY['Arabic', 'English'], true, 'بربلكسيتي', 'محرك بحث ذكي مدعوم بالذكاء الاصطناعي', 'freemium'),

-- Design Tools
('550e8400-e29b-41d4-a716-446655440015', 'Canva', 'support@canva.com', '@canva', 'https://canva.com', 'Canva AI', 'أدوات تصميم ذكية للجميع', 'منصة تصميم شعبية مع أدوات ذكاء اصطناعي لإنشاء التصاميم والعروض التقديمية والمحتوى البصري بسهولة ومهنية.', 'https://static.canva.com/web/images/12487a1e645d04c16956.png', ARRAY['تصميم', 'جرافيك', 'قوالب'], ARRAY['مجاني', 'مدفوع'], 'أدوات التصميم', true, 1450, NOW(), 'design', 'مبتدئ', ARRAY['Arabic', 'English'], true, 'كانفا الذكي', 'أدوات تصميم ذكية للجميع', 'freemium'),

-- Translation Tools
('550e8400-e29b-41d4-a716-446655440016', 'DeepL', 'support@deepl.com', '@deepl', 'https://deepl.com', 'DeepL', 'مترجم ذكي بجودة احترافية', 'خدمة ترجمة متقدمة تستخدم الذكاء الاصطناعي لتقديم ترجمات دقيقة وطبيعية. تتفوق على المترجمات التقليدية في فهم السياق والمعنى.', 'https://static.deepl.com/img/logo/deepl-logo-blue.svg', ARRAY['ترجمة', 'لغات', 'دقة'], ARRAY['مجاني', 'مدفوع'], 'أدوات الترجمة', true, 980, NOW(), 'translation', 'مبتدئ', ARRAY['Arabic', 'English'], true, 'ديب إل', 'مترجم ذكي بجودة احترافية', 'freemium'),

-- Music Generation
('550e8400-e29b-41d4-a716-446655440017', 'Suno', 'hello@suno.ai', '@suno_ai', 'https://suno.ai', 'Suno', 'مولد موسيقى بالذكاء الاصطناعي', 'منصة إبداعية لتوليد الموسيقى والأغاني من النصوص. يمكنها إنشاء ألحان كاملة مع كلمات وأصوات بأنماط موسيقية متنوعة.', 'https://www.suno.ai/logo.png', ARRAY['موسيقى', 'إبداع', 'ألحان'], ARRAY['مجاني', 'مدفوع'], 'أدوات الموسيقى', true, 750, NOW(), 'music-generation', 'متوسط', ARRAY['English'], false, 'سونو', 'مولد موسيقى بالذكاء الاصطناعي', 'freemium'),

-- Video Editing
('550e8400-e29b-41d4-a716-446655440018', 'Descript', 'support@descript.com', '@descript', 'https://descript.com', 'Descript', 'محرر فيديو وصوت ذكي', 'أداة تحرير متقدمة تسمح بتحرير الفيديو والصوت من خلال تحرير النص. تتضمن ميزات ذكية مثل إزالة كلمات التردد وتحسين الصوت.', 'https://www.descript.com/favicon.ico', ARRAY['تحرير', 'فيديو', 'صوت'], ARRAY['مجاني', 'مدفوع'], 'أدوات التحرير', true, 580, NOW(), 'video-editing', 'متوسط', ARRAY['English'], false, 'ديسكريبت', 'محرر فيديو وصوت ذكي', 'freemium'),

-- AI Image Enhancement
('550e8400-e29b-41d4-a716-446655440019', 'Upscayl', 'hello@upscayl.org', '@upscayl', 'https://upscayl.github.io', 'Upscayl', 'تحسين جودة الصور بالذكاء الاصطناعي', 'أداة مجانية ومفتوحة المصدر لتحسين جودة الصور وزيادة دقتها باستخدام الذكاء الاصطناعي. مثالية لترقية الصور القديمة أو منخفضة الجودة.', 'https://github.com/upscayl/upscayl/raw/main/assets/upscayl.png', ARRAY['صور', 'تحسين', 'جودة'], ARRAY['مجاني'], 'تحسين الصور', true, 920, NOW(), 'image-enhancement', 'مبتدئ', ARRAY['English'], true, 'أبسكايل', 'تحسين جودة الصور بالذكاء الاصطناعي', 'free'),

-- AI Writing Assistant
('550e8400-e29b-41d4-a716-446655440020', 'Grammarly', 'support@grammarly.com', '@grammarly', 'https://grammarly.com', 'Grammarly', 'مساعد الكتابة الذكي', 'أداة ذكية لتصحيح القواعد النحوية وتحسين الكتابة باللغة الإنجليزية. تساعد في كتابة نصوص أكثر وضوحاً واحترافية.', 'https://static.grammarly.com/assets/files/efe57d016d9efff36da7884c193b646b/grammarly_logo_color.png', ARRAY['كتابة', 'قواعد', 'تصحيح'], ARRAY['مجاني', 'مدفوع'], 'أدوات الكتابة', true, 1280, NOW(), 'writing-assistant', 'مبتدئ', ARRAY['English'], true, 'جراماتلي', 'مساعد الكتابة الذكي لتصحيح القواعد', 'freemium'),

-- Presentation AI
('550e8400-e29b-41d4-a716-446655440021', 'Gamma', 'hello@gamma.app', '@gamma', 'https://gamma.app', 'Gamma', 'إنشاء عروض تقديمية ذكية', 'منصة لإنشاء العروض التقديمية والمواقع والمستندات بالذكاء الاصطناعي. تحول الأفكار إلى محتوى بصري جذاب بسرعة وسهولة.', 'https://gamma.app/favicon.ico', ARRAY['عروض', 'تقديم', 'تصميم'], ARRAY['مجاني', 'مدفوع'], 'أدوات العروض', true, 640, NOW(), 'presentation', 'مبتدئ', ARRAY['English'], true, 'جاما', 'إنشاء عروض تقديمية ذكية', 'freemium'),

-- AI Chatbot Platform
('550e8400-e29b-41d4-a716-446655440022', 'Character.AI', 'support@character.ai', '@character_ai', 'https://character.ai', 'Character.AI', 'محادثة مع شخصيات ذكية', 'منصة للمحادثة مع شخصيات ذكاء اصطناعي متنوعة. يمكن إنشاء شخصيات مخصصة أو التحدث مع شخصيات تاريخية وخيالية.', 'https://characterai.io/favicon.ico', ARRAY['محادثة', 'شخصيات', 'تفاعل'], ARRAY['مجاني', 'مدفوع'], 'أدوات المحادثة', true, 1890, NOW(), 'chatbot', 'مبتدئ', ARRAY['Arabic', 'English'], true, 'كاراكتر إيه آي', 'محادثة مع شخصيات ذكية متنوعة', 'freemium'),

-- AI Research Assistant
('550e8400-e29b-41d4-a716-446655440023', 'Elicit', 'hello@elicit.org', '@elicitorg', 'https://elicit.org', 'Elicit', 'مساعد البحث العلمي الذكي', 'أداة ذكاء اصطناعي للباحثين تساعد في العثور على الأوراق العلمية وتلخيصها وتحليل البيانات البحثية بكفاءة عالية.', 'https://elicit.org/favicon.ico', ARRAY['بحث', 'علمي', 'أوراق'], ARRAY['مجاني', 'مدفوع'], 'أدوات البحث', true, 420, NOW(), 'research', 'متقدم', ARRAY['English'], true, 'إليسيت', 'مساعد البحث العلمي الذكي', 'freemium'),

-- AI Logo Generator
('550e8400-e29b-41d4-a716-446655440024', 'Looka', 'support@looka.com', '@looka', 'https://looka.com', 'Looka', 'مصمم شعارات ذكي', 'منصة ذكاء اصطناعي لتصميم الشعارات والهويات البصرية. تنشئ تصاميم احترافية خلال دقائق مع إمكانيات تخصيص واسعة.', 'https://cdn.logojoy.com/wp-content/uploads/20230629100801/Looka_Symbol_Full_Color_RGB-1.png', ARRAY['شعارات', 'تصميم', 'هوية'], ARRAY['مدفوع'], 'أدوات التصميم', true, 680, NOW(), 'logo-design', 'مبتدئ', ARRAY['English'], false, 'لوكا', 'مصمم شعارات ذكي', 'paid'),

-- AI Meeting Assistant
('550e8400-e29b-41d4-a716-446655440025', 'Otter.ai', 'support@otter.ai', '@otterai', 'https://otter.ai', 'Otter.ai', 'مساعد الاجتماعات الذكي', 'أداة ذكية لتسجيل وتفريغ الاجتماعات تلقائياً مع إنشاء ملخصات ونقاط عمل. تتكامل مع منصات الاجتماعات الشائعة.', 'https://otter.ai/static/images/logos/otter-logo.png', ARRAY['اجتماعات', 'تفريغ', 'ملخصات'], ARRAY['مجاني', 'مدفوع'], 'أدوات الإنتاجية', true, 560, NOW(), 'meeting-assistant', 'متوسط', ARRAY['English'], true, 'أوتر', 'مساعد الاجتماعات الذكي', 'freemium');