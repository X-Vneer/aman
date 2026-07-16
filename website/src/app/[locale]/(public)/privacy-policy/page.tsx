import Footer from "@/components/common/footer"
import { Card } from "@heroui/react"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { generatePageMetadata } from "@/utils/generate-page-metadata"
import { JsonLd, pageBreadcrumbSchema } from "@/components/common/json-ld"

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await props.params
  return generatePageMetadata("privacy-policy", locale, "/privacy-policy")
}

export default async function Page(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params
  const ar = params.locale === "ar"
  const t = await getTranslations("privacy-policy")
  return (
    <>
      <JsonLd data={pageBreadcrumbSchema("privacy-policy", params.locale, "/privacy-policy")} />
      <main className="container mx-auto max-w-7xl grow px-6 pt-5 md:pt-8 lg:pt-10">
        <section className="flex items-center justify-center gap-4 py-16 md:py-20 lg:py-24">
          <Card className="w-full max-w-5xl shrink-0 rounded-xl bg-[#0A090959] p-1">
            <div className="mb-3 space-y-1 rounded-t-lg bg-[#1D1B1B] px-7 py-5 md:px-9 md:py-7 lg:px-12 lg:py-9">
              <h1 className="text-xl lg:text-2xl">{t("title")}</h1>
              <p className="text-default-500 text-sm">{t("description")}</p>
            </div>
            {ar ? (
              <article className="prose prose-invert lg:prose-lg max-w-[unset] p-4 md:p-6 lg:p-8 [&>ul]:px-12">
                <ol>
                  <li>
                    <strong>جمع المعلومات الشخصية</strong>
                    <strong>:</strong>
                  </li>
                </ol>
                <p>
                  نقوم بجمع المعلومات الشخصية التي يقدمها المستخدم أثناء التسجيل أو استخدام المنصة، وتشمل:
                </p>
                <ul>
                  <li>الاسم الكامل.</li>
                  <li>رقم الهاتف للتحقق عبر (OTP)</li>
                  <li>البريد الإلكتروني.</li>
                  <li>البيانات مثل البرامج المكتملة والتقييمات.</li>
                </ul>
                <p>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; قد يتم جمع معلومات إضافية لتحسين التجربة، مثل اللغة المفضلة
                  وتاريخ النشاط داخل التطبيق.
                </p>
                <br />

                <ol start={2}>
                  <li>
                    <strong>استخدام المعلومات الشخصية</strong>
                    <strong>:</strong>
                  </li>
                </ol>
                <p>تُستخدم البيانات الشخصية للأغراض التالية:</p>
                <ul>
                  <li>التحقق من هوية المستخدم (OTP)</li>
                  <li>تحسين تجربة الاستخدام عبر تخصيص المحتوى.</li>
                  <li>إصدار الشهادات وتوفير ميزة التحقق من صحتها باستخدام رمز QR</li>
                  <li>إرسال إشعارات متعلقة بالبرامج التدريبية أو التحديثات.</li>
                  <li>تحليل أداء المستخدم لتقديم توصيات شخصية.</li>
                </ul>
                <br />
                <ol start={3}>
                  <li>
                    <strong>أمان البيانات</strong>
                    <strong>:</strong>
                  </li>
                </ol>
                <p>يتم اتخاذ تدابير تقنية وتنظيمية لضمان حماية بيانات المستخدم:</p>
                <ul>
                  <li>
                    <strong>التشفير:</strong> يتم تشفير البيانات أثناء النقل والتخزين.
                  </li>
                  <li>
                    <strong>تحديد الوصول:</strong> تقتصر صلاحيات الوصول إلى البيانات على موظفين معتمدين فقط.
                  </li>
                  <li>
                    <strong>مراقبة الأنظمة:</strong> يتم مراقبة الأنظمة بانتظام لتحديد أي اختراقات أو تهديدات
                    أمنية.
                  </li>
                </ul>
                <br />
                <ol start={4}>
                  <li>
                    <strong>مشاركة المعلومات</strong>
                    <strong>:</strong>
                  </li>
                </ol>
                <p>لا يتم مشاركة المعلومات الشخصية مع أطراف ثالثة إلا في الحالات التالية:</p>
                <ul>
                  <li>الامتثال للقوانين المحلية أو الأحكام القضائية.</li>
                  <li>توفير خدمات الدعم الفني أو تحسين العمليات.</li>
                </ul>
                <ol start={5}>
                  <li>
                    <strong>ملفات تعريف الارتباط</strong> <strong>(Cookies)</strong>
                    <strong>:</strong>
                  </li>
                </ol>
                <p>تستخدم المنصة ملفات تعريف الارتباط لتحسين تجربة المستخدم، وتشمل:</p>
                <ul>
                  <li>تتبع تفضيلات المستخدم (مثل اللغة).</li>
                  <li>تحليل حركة المرور داخل التطبيق لتحسين الأداء.</li>
                  <li>تقديم محتوى مخصص بناءً على سلوك المستخدم.</li>
                </ul>
                <br />
                <ol start={6}>
                  <li>
                    <strong>حقوق المستخدم</strong>
                    <strong>:</strong>
                  </li>
                </ol>
                <p>يحق للمستخدم:</p>
                <ul>
                  <li>طلب تعديل بياناته الشخصية.</li>
                  <li>حذف حسابه من التطبيق مع ضمان إزالة جميع بياناته.</li>
                  <li>الاطلاع على البيانات التي تحتفظ بها المنصة.</li>
                </ul>
                <br />
                <ol start={7}>
                  <li>
                    <strong>التعديلات</strong>
                    <strong>:</strong>
                  </li>
                </ol>
                <ul>
                  <li>
                    تحتفظ أمان بالحق في إجراء أي تعديل على إشعار الخصوصية من وقت لآخر دون الحاجة الى تقديم
                    إشعار بذلك ويعد استخدامك للموقع بعد هذه التعديلات قبولا بها، لذا يجب الاطلاع على إشعار
                    الخصوصية بشكل دوري للتأكد من معرفتك بأحدث نسخة منها.
                  </li>
                </ul>
                <br />

                <ol start={8}>
                  <li>
                    <strong>. القبول بالشروط</strong>
                    <strong>:</strong>
                  </li>
                </ol>
                <ul>
                  <li>باستخدام التطبيق، يوافق المستخدم على الشروط والأحكام التالية .</li>
                  <li>يتحمل المستخدم مسؤولية مراجعة الشروط دوريًا لمعرفة التعديلات الجديدة</li>
                </ul>
                <br />
                <ol start={9}>
                  <li>
                    <strong>. التسجيل والاستخدام</strong>
                    <strong>:</strong>
                  </li>
                </ol>
                <ul>
                  <li>يجب على المستخدم تقديم معلومات دقيقة وكاملة أثناء التسجيل .</li>
                  <li>يُمنع استخدام التطبيق لأغراض غير قانونية أو مخالفة للأخلاقيات .</li>
                </ul>
                <br />
                <ol start={10}>
                  <li>
                    <strong>. المحتوى والخدمات المقدمة</strong>
                    <strong>:</strong>
                  </li>
                </ol>
                <ul>
                  <li>يقدم التطبيق محتوى تعليمي عبر فيديوهات تفاعلية مع أسئلة تقييمية .</li>
                  <li>جميع الشهادات الصادرة تحمل رمز QR للتحقق من صحتها .</li>
                  <li>قد يتم تحديث أو تغيير المحتوى وفقًا لتوصيات اللجنة العلمية أو الإدارة .</li>
                </ul>
                <br />
                <ol start={12}>
                  <li>
                    <strong>. المسؤولية</strong>
                    <strong>:</strong>
                  </li>
                </ol>
                <ul>
                  <li>المنصة غير مسؤولة عن :</li>
                  <ul>
                    <li>أي أخطاء ناتجة عن سوء استخدام المستخدم .</li>
                    <li>انقطاع الخدمة بسبب أعطال تقنية خارجة عن السيطرة .</li>
                    <li>أي خسائر ناجمة عن استخدام غير مصرح به للحساب الشخصي للمستخدم .</li>
                  </ul>
                </ul>

                <br />
                <ol start={13}>
                  <li>
                    <strong>. إنهاء الخدمة</strong>
                    <strong>:</strong>
                  </li>
                </ol>
                <ul>
                  <li>تحتفظ الإدارة بحق إنهاء الحساب في حال :</li>
                  <ul>
                    <li>انتهاك الشروط والأحكام .</li>
                    <li>تقديم معلومات خاطئة أثناء التسجيل .</li>
                    <li>استخدام الحساب لأغراض غير قانونية .</li>
                  </ul>
                </ul>
                <br />
                <ol start={14}>
                  <li>
                    <strong> تعديل الشروط</strong>
                    <strong>:</strong>
                  </li>
                </ol>
                <ul>
                  <li>قد يتم تعديل الشروط والأحكام وفقًا لمتطلبات التشغيل أو القوانين .</li>
                  <li>سيتم إخطار المستخدمين بالتعديلات الجديدة قبل سريانها .</li>
                </ul>
                <br />
                <ol start={15}>
                  <li>
                    <strong> التواصل</strong>
                    <strong>:</strong>
                  </li>
                </ol>
                <ul>
                  <li>يمكن للمستخدمين إرسال استفساراتهم أو شكاواهم عبر صفحة "تواصل معنا" داخل المنصة .</li>
                  <li>سيتم الرد على الرسائل في غضون 3-5 أيام عمل .</li>
                </ul>
                <br />
              </article>
            ) : (
              <article
                dir="ltr"
                className="prose prose-invert lg:prose-lg max-w-[unset] p-4 md:p-6 lg:p-8 [&>ul]:px-12">
                <ol>
                  <li>
                    <strong>Collection of personal information:</strong>
                  </li>
                </ol>
                <p>
                  We collect personal information that the user provides during registration or use ofThe
                  platform, and includes:
                </p>
                <ul>
                  <li>full name.</li>
                  <li>phone numberTo verify via (OTP)</li>
                  <li>e-mail.</li>
                  <li>DataSuch as completed programs and evaluations..</li>
                </ul>
                <p>
                  Additional information may be collected to improve the experience, such as preferred
                  language and activity history within the app..
                </p>
                <ol start={2}>
                  <li>
                    <strong>Use of Personal Information:</strong>
                  </li>
                </ol>
                <p>Personal data is used for the following purposes::</p>
                <ul>
                  <li>User identity verification(OTP)</li>
                  <li>Improve user experience by personalizing content.</li>
                  <li>Issue certificates and provide verification using a token.QR</li>
                  <li>Send notifications regarding training programs or updates.</li>
                  <li>Analyze user performance to provide personalized recommendations..</li>
                </ul>
                <p>&nbsp;</p>
                <ol start={3}>
                  <li>
                    <strong>Data Security:</strong>
                  </li>
                </ol>
                <p>Technical and organizational measures are taken to ensure the protection of user data.:</p>
                <ul>
                  <li>
                    <strong>Encryption:</strong>Data is encrypted during transmission and storage.
                  </li>
                  <li>
                    <strong>Access limitation:</strong>Access to data is limited to authorized personnel only.
                  </li>
                  <li>
                    <strong>Systems monitoring:</strong>Systems are monitored regularly to identify any
                    breaches or security threats.
                  </li>
                </ul>
                <p>&nbsp;</p>
                <ol start={4}>
                  <li>
                    <strong>Information sharing:</strong>
                  </li>
                </ol>
                <p>Personal information is not shared with third parties except in the following cases::</p>
                <ul>
                  <li>Compliance with local laws or court orders.</li>
                  <li>Providing technical support services or improving operations.</li>
                </ul>
                <ol start={5}>
                  <li>
                    <strong>Cookies (Cookies):</strong>
                  </li>
                </ol>
                <p>used The platformCookies to improve user experience, including::</p>
                <ul>
                  <li>Track user preferences (such as language).</li>
                  <li>Analyze in-app traffic to improve performance.</li>
                  <li>Deliver personalized content based on user behavior.</li>
                </ul>
                <p>&nbsp;</p>
                <ol start={6}>
                  <li>
                    <strong>User rights:</strong>
                  </li>
                </ol>
                <p>The user has the right to:</p>
                <ul>
                  <li>Request to modify his personal data.</li>
                  <li>Delete his account from the application, ensuring that all his data is removed..</li>
                  <li>View the data thatKeepWith itThe platform.</li>
                </ul>
                <p>&nbsp;</p>
                <ol start={7}>
                  <li>
                    <strong>Modifications:</strong>
                  </li>
                </ol>
                <ul>
                  <li>
                    KeepRefreshWe reserve the right to make any amendments to the Privacy Notice from time to
                    time without the need to provide notice thereof. Your use of the Site after such
                    amendments constitutes acceptance thereof. Therefore, you should review the Privacy Notice
                    periodically to ensure that you are aware of the latest version thereof.
                  </li>
                </ul>

                <br />
                <ol start={8}>
                  <li>
                    <strong>.Acceptance of terms:</strong>
                  </li>
                </ol>
                <ul>
                  <li>By using the application, the user agrees to the following terms and conditions:.</li>
                  <li>
                    It is the user's responsibility to review the terms periodically for new amendments..
                  </li>
                </ul>
                <br />
                <ol start={10}>
                  <li>
                    <strong>.Registration and Use:</strong>
                  </li>
                </ol>
                <ul>
                  <li>The user must provide accurate and complete information during registration..</li>
                  <li>The application may not be used for any illegal or immoral purposes..</li>
                </ul>
                <br />
                <ol start={11}>
                  <li>
                    <strong>.Content and Services Provided:</strong>
                  </li>
                </ol>
                <ul>
                  <li>
                    The application provides educational content through interactive videos with assessment
                    questions..
                  </li>
                  <li>All issued certificates bear the symbolQR to verify its authenticity.</li>
                  <li>
                    Content may be updated or changed according to the recommendations of the Scientific
                    Committee or the Administration..
                  </li>
                </ul>
                <br />
                <ol start={12}>
                  <li>
                    <strong>.Responsibility:</strong>
                  </li>
                </ol>
                <ul>
                  <li>The platformirresponsibleAndon:</li>
                  <ul>
                    <li>Any errors resulting from user misuse.</li>
                    <li>Service interruption due to technical failures beyond our control.</li>
                    <li>Any losses resulting from unauthorized use of the User's personal account.</li>
                  </ul>
                </ul>

                <br />
                <ol start={13}>
                  <li>
                    <strong>.Termination of service:</strong>
                  </li>
                </ol>
                <ul>
                  <li>The administration reserves the right to terminate the account in the event of::</li>
                  <ul>
                    <li>Violation of Terms and Conditions.</li>
                    <li>Providing incorrect information during registration.</li>
                    <li>Using the account for illegal purposes.</li>
                  </ul>
                </ul>
                <br />
                <ol start={14}>
                  <li>
                    <strong>Modify Terms:</strong>
                  </li>
                </ol>
                <ul>
                  <li>Terms and Conditions may be modified according to operating requirements or laws..</li>
                  <li>Users will be notified of new changes before they take effect..</li>
                </ul>
                <br />
                <ol start={15}>
                  <li>
                    <strong>communication:</strong>
                  </li>
                </ol>
                <ul>
                  <li>
                    Users can submit their inquiries or complaints via the &ldquo;Contact Us&rdquo; page
                    withinThe platform.
                  </li>
                  <li>Messages will be replied within 3-5 business days..</li>
                </ul>
                <br />
              </article>
            )}
          </Card>
        </section>
      </main>
      <Footer />
    </>
  )
}
