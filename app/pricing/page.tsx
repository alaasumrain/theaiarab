import { Check, Star, CreditCard, Users, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/cult/page-header"
import { FadeIn } from "@/components/cult/fade-in"

const plans = [
  {
    name: "المستخدم الجديد",
    price: "مجاني",
    description: "للمبتدئين في عالم الذكاء الاصطناعي",
    features: [
      "الوصول لجميع الأدوات المجانية",
      "قراءة جميع الدروس والمقالات",
      "تصفح دليل الأدوات الكامل",
      "النشرة البريدية الأسبوعية",
      "دعم عبر البريد الإلكتروني"
    ],
    buttonText: "ابدأ مجاناً",
    buttonVariant: "outline" as const,
    popular: false,
    icon: Users
  },
  {
    name: "المحترف",
    price: "29 ريال/شهر",
    originalPrice: "49 ريال",
    description: "للمهنيين والشركات الصغيرة",
    features: [
      "جميع مميزات الخطة المجانية",
      "إمكانية حفظ الأدوات المفضلة",
      "تنبيهات عند إضافة أدوات جديدة",
      "وصول مبكر للمحتوى الجديد",
      "ورش عمل شهرية حصرية",
      "مجتمع خاص للمحترفين",
      "دعم فني أولوية"
    ],
    buttonText: "ابدأ النسخة التجريبية",
    buttonVariant: "default" as const,
    popular: true,
    icon: Star
  },
  {
    name: "الشركات",
    price: "199 ريال/شهر",
    description: "للشركات والمؤسسات الكبيرة",
    features: [
      "جميع مميزات الخطة الاحترافية",
      "تدريب مخصص للفرق",
      "استشارات شهرية مع خبراء AI",
      "تقارير تحليلية متقدمة",
      "إدارة متعددة المستخدمين",
      "تكامل مع أنظمة الشركة",
      "دعم فني على مدار الساعة"
    ],
    buttonText: "تواصل معنا",
    buttonVariant: "secondary" as const,
    popular: false,
    icon: Zap
  }
]

const stats = [
  { label: "مستخدم نشط", value: "15,000+" },
  { label: "أداة ذكاء اصطناعي", value: "500+" },
  { label: "درس تعليمي", value: "100+" },
  { label: "مقال وخبر", value: "200+" }
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/10">
      <div className="container mx-auto px-4 py-8">
        <FadeIn>
          <PageHeader
            title="خطط الاشتراك"
            description="اختر الخطة التي تناسب احتياجاتك في رحلتك مع الذكاء الاصطناعي"
            icon={CreditCard}
            stats={stats}
          />

          {/* Pricing Cards */}
          <div className="grid gap-8 lg:grid-cols-3 lg:gap-6 max-w-6xl mx-auto">
            {plans.map((plan, index) => {
              const Icon = plan.icon
              return (
                <Card 
                  key={plan.name}
                  className={`relative transition-all duration-300 hover:shadow-lg ${
                    plan.popular 
                      ? 'border-primary shadow-lg scale-105' 
                      : 'hover:scale-105'
                  }`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 right-4 bg-primary text-primary-foreground">
                      الأكثر شعبية
                    </Badge>
                  )}
                  
                  <CardHeader className="text-center pb-6">
                    <div className="flex items-center justify-center mb-4">
                      <Icon className={`h-12 w-12 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-3xl font-bold text-primary">{plan.price}</span>
                        {plan.originalPrice && (
                          <span className="text-lg text-muted-foreground line-through">
                            {plan.originalPrice}
                          </span>
                        )}
                      </div>
                      {plan.originalPrice && (
                        <Badge variant="secondary" className="text-xs">
                          خصم 40%
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-base">{plan.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      variant={plan.buttonVariant}
                      className="w-full py-6 text-base font-semibold"
                      size="lg"
                    >
                      {plan.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* FAQ Section */}
          <div className="mt-20 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">الأسئلة الشائعة</h2>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">هل يمكنني إلغاء الاشتراك في أي وقت؟</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    نعم، يمكنك إلغاء اشتراكك في أي وقت دون أي رسوم إضافية. ستستمر في الاستفادة من الخدمات حتى نهاية فترة الفوترة الحالية.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">هل تتوفر نسخة تجريبية مجانية؟</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    نعم، نوفر نسخة تجريبية مجانية لمدة 14 يوم للخطة الاحترافية بدون الحاجة لبطاقة ائتمان.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">ما هي وسائل الدفع المتاحة؟</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    نقبل جميع البطاقات الائتمانية الرئيسية (فيزا، ماستركارد، أمريكان إكسبريس) والدفع عبر آبل باي وجوجل باي.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">هل يشمل السعر ضريبة القيمة المضافة؟</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    الأسعار المعروضة شاملة ضريبة القيمة المضافة للعملاء في السعودية ودول الخليج.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 text-center bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">هل تحتاج خطة مخصصة؟</h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              للمؤسسات الكبيرة أو الاحتياجات الخاصة، يمكننا تصميم خطة مخصصة تناسب متطلباتك
            </p>
            <Button size="lg" className="px-8 py-3">
              تواصل مع فريق المبيعات
            </Button>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}