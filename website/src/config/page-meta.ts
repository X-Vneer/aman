import type { LOCALES } from "@/config"

export type Locale = (typeof LOCALES)[number]

export type PageMetaKey =
  | "home"
  | "start"
  | "about-us"
  | "awareness"
  | "blog"
  | "contact-us"
  | "faqs"
  | "information-center"
  | "privacy-policy"
  | "stories"
  | "terms"
  | "login"

export interface PageMetaEntry {
  title: string
  description: string
}

type PageMetaMap = Record<PageMetaKey, Record<Locale, PageMetaEntry>>

export const PAGE_META: PageMetaMap = {
  home: {
    ar: {
      title: "أمان | منصة تدريب إسعافات أولية تفاعلية معتمدة فلسطين",
      description:
        "تعلّم الإسعافات الأولية بسيناريوهات فيديو تفاعلية، واحصل على شهادة معتمدة تؤهّلك لإنقاذ الأرواح بثقة وأمان. ابدأ أول برنامج في منصة أمان مجانًا اليوم.",
    },
    en: {
      title: "Aman | Accredited Interactive First Aid Training Platform – Palestine",
      description:
        "Learn first aid through interactive video scenarios and earn an accredited certificate that empowers you to save lives with confidence. Start your first Aman program free today.",
    },
  },
  start: {
    ar: {
      title: "منصة أمان | برامج إسعافات أولية تفاعلية بشهادة معتمدة",
      description:
        "استكشف أربعة برامج تفاعلية لإتقان الإنعاش القلبي والإسعافات الصحية والرياضية بسيناريوهات واقعية. احصل على شهادتك المعتمدة، وكُن مُنقِذًا موثوقًا اليوم.",
    },
    en: {
      title: "Aman Platform | Interactive First Aid Programs with Accredited Certificate",
      description:
        "Explore four interactive programs to master CPR and health & sports first aid through real-world scenarios. Earn your accredited certificate and become a trusted rescuer today.",
    },
  },
  "about-us": {
    ar: {
      title: "عن أمان | رؤيتنا لتدريب جيل من المُنقذين في فلسطين",
      description:
        "منصة أمان تبني جيلًا فلسطينيًا قادرًا على إنقاذ الأرواح عبر تدريب تفاعلي ذكي يدمج الخبرة الطبية مع أحدث التقنيات التعليمية. اكتشف رؤيتنا ورسالتنا اليوم.",
    },
    en: {
      title: "About Aman | Our Vision to Train a Generation of Rescuers in Palestine",
      description:
        "Aman is building a Palestinian generation capable of saving lives through smart interactive training that blends medical expertise with the latest educational technology. Discover our vision and mission today.",
    },
  },
  awareness: {
    ar: {
      title: "التوعية الصحية | دليل الحالات الطارئة من منصة أمان",
      description:
        "مرجعك الشامل لفهم الحالات الصحية والرياضية الطارئة وأعراضها المختلفة، وطرق التعامل الصحيح معها بثقة. محتوى موثوق يُعدّك لمواجهة الطوارئ قبل فوات الأوان.",
    },
    en: {
      title: "Health Awareness | Emergency Situations Guide from Aman",
      description:
        "Your comprehensive reference for understanding health and sports emergencies, their symptoms, and how to respond with confidence. Trusted content that prepares you to face emergencies before it's too late.",
    },
  },
  blog: {
    ar: {
      title: "مدونة أمان | مقالات ونصائح الإسعافات الأولية",
      description: "اقرأ أحدث المقالات والنصائح حول الإسعافات الأولية والحالات الطارئة من فريق منصة أمان.",
    },
    en: {
      title: "Aman Blog | First Aid Articles & Tips",
      description:
        "Read the latest articles and tips on first aid and emergency response from the Aman team.",
    },
  },
  "contact-us": {
    ar: {
      title: "تواصل معنا | دعم فني وشراكات مؤسسية لمنصة أمان فلسطين",
      description:
        "نحن هنا للإجابة على استفساراتك، ودعم طلبات الشراكة للشركات والجهات الحكومية والمدارس في فلسطين. تواصل مع فريق أمان عبر القنوات التي تناسبك وابدأ الآن.",
    },
    en: {
      title: "Contact Us | Technical Support & Institutional Partnerships for Aman – Palestine",
      description:
        "We're here to answer your inquiries and support partnership requests from companies, government entities, and schools across Palestine. Reach the Aman team through the channel that suits you and start now.",
    },
  },
  faqs: {
    ar: {
      title: "الأسئلة الشائعة | دليلك الكامل حول خدمات منصة أمان فلسطين",
      description:
        "إجابات مباشرة ودقيقة عن البرامج التدريبية والشهادات المعتمدة وآلية التعلّم التفاعلي في منصة أمان. اعثر على ما تبحث عنه في ثوانٍ، وابدأ رحلتك كمُنقذ معتمد.",
    },
    en: {
      title: "FAQs | Your Complete Guide to Aman Platform Services – Palestine",
      description:
        "Direct, accurate answers about training programs, accredited certificates, and the interactive learning mechanism at Aman. Find what you need in seconds and start your journey as an accredited rescuer.",
    },
  },
  "information-center": {
    ar: {
      title: "التحقق من الشهادة | مركز المعلومات في منصة أمان فلسطين",
      description:
        "تحقّق من شهادات الإسعافات الأولية الصادرة عن منصة أمان بخطوة واحدة سريعة وآمنة. خدمة رسمية موثوقة تضمن أصالة شهادتك أمام الجهات الحكومية والخاصة معًا.",
    },
    en: {
      title: "Certificate Verification | Information Center at Aman Platform – Palestine",
      description:
        "Verify first aid certificates issued by the Aman platform in one quick and secure step. An official, trusted service that ensures your certificate's authenticity before government and private bodies alike.",
    },
  },
  "privacy-policy": {
    ar: {
      title: "سياسة الخصوصية | حماية بياناتك في منصة أمان التعليمية",
      description:
        "نلتزم بحماية بياناتك الشخصية وفق أعلى معايير الأمان السيبراني المعتمدة في دولة فلسطين. اطّلع على سياسة الخصوصية الشاملة لفهم آلية الحماية.",
    },
    en: {
      title: "Privacy Policy | Protecting Your Data on the Aman Educational Platform",
      description:
        "We're committed to protecting your personal data to the highest cybersecurity standards accredited in Palestine. Read the comprehensive privacy policy to understand how your information is safeguarded.",
    },
  },
  stories: {
    ar: {
      title: "كُن مُنقِذًا | قصص بطولة حقيقية لإنقاذ الأرواح في فلسطين",
      description:
        "قصص ملهمة من مُنقذين عاديين صنعوا فارقًا حقيقيًا في لحظات حاسمة داخل فلسطين. اقرأ تجاربهم المؤثرة وشاركنا قصتك، لتُلهم غيرك وتنضم لمجتمع أمان.",
    },
    en: {
      title: "Be a Rescuer | Real Heroism Stories of Saving Lives in Palestine",
      description:
        "Inspiring stories from ordinary rescuers who made a real difference in critical moments across Palestine. Read their moving experiences and share your own story to inspire others and join the Aman community.",
    },
  },
  terms: {
    ar: {
      title: "الشروط والأحكام | اتفاقية استخدام منصة أمان التعليمية",
      description:
        "تعرّف على الشروط والأحكام المنظّمة لاستخدام منصة أمان وخدماتها التدريبية وإصدار الشهادات المعتمدة. شفافية كاملة تحمي حقوقك وتوضح التزاماتنا تجاهك دائمًا.",
    },
    en: {
      title: "Terms & Conditions | Usage Agreement for the Aman Educational Platform",
      description:
        "Learn the terms and conditions governing use of the Aman platform, its training services, and the issuance of accredited certificates. Full transparency that protects your rights and clarifies our commitments to you.",
    },
  },
  login: {
    ar: {
      title: "تسجيل الدخول | منصة أمان",
      description: "سجّل الدخول إلى منصة أمان للوصول إلى برامج الإسعافات الأولية والشهادات.",
    },
    en: {
      title: "Log in | Aman Platform",
      description: "Log in to the Aman platform to access first aid training programs and certificates.",
    },
  },
}

export function getPageMeta(key: PageMetaKey, locale: string): PageMetaEntry {
  const entry = PAGE_META[key]
  return entry[locale as Locale] ?? entry.en
}
