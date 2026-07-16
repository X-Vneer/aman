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
    fr: {
      title: "Aman | Plateforme accréditée de formation interactive aux premiers secours – Palestine",
      description:
        "Apprenez les premiers secours à travers des scénarios vidéo interactifs et obtenez un certificat accrédité pour sauver des vies en toute confiance. Commencez votre premier programme Aman gratuitement dès aujourd'hui.",
    },
    id: {
      title: "Aman | Platform Pelatihan Pertolongan Pertama Interaktif Terakreditasi – Palestina",
      description:
        "Pelajari pertolongan pertama melalui skenario video interaktif dan dapatkan sertifikat terakreditasi yang membekali Anda menyelamatkan nyawa dengan percaya diri. Mulai program Aman pertama Anda gratis hari ini.",
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
    fr: {
      title: "Plateforme Aman | Programmes interactifs de premiers secours avec certificat accrédité",
      description:
        "Découvrez quatre programmes interactifs pour maîtriser la RCP et les premiers secours sanitaires et sportifs à travers des scénarios réels. Obtenez votre certificat accrédité et devenez un sauveteur de confiance dès aujourd'hui.",
    },
    id: {
      title: "Platform Aman | Program Pertolongan Pertama Interaktif dengan Sertifikat Terakreditasi",
      description:
        "Jelajahi empat program interaktif untuk menguasai CPR dan pertolongan pertama kesehatan & olahraga melalui skenario nyata. Dapatkan sertifikat terakreditasi dan jadilah penyelamat yang terpercaya hari ini.",
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
    fr: {
      title: "À propos d'Aman | Notre vision pour former une génération de sauveteurs en Palestine",
      description:
        "Aman forme une génération palestinienne capable de sauver des vies grâce à une formation interactive intelligente qui allie expertise médicale et dernières technologies pédagogiques. Découvrez notre vision et notre mission dès aujourd'hui.",
    },
    id: {
      title: "Tentang Aman | Visi Kami Melatih Generasi Penyelamat di Palestina",
      description:
        "Aman membangun generasi Palestina yang mampu menyelamatkan nyawa melalui pelatihan interaktif cerdas yang memadukan keahlian medis dengan teknologi pendidikan terkini. Temukan visi dan misi kami hari ini.",
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
    fr: {
      title: "Sensibilisation santé | Guide des situations d'urgence d'Aman",
      description:
        "Votre référence complète pour comprendre les urgences sanitaires et sportives, leurs symptômes et les bonnes réactions à adopter avec confiance. Un contenu fiable qui vous prépare à faire face aux urgences avant qu'il ne soit trop tard.",
    },
    id: {
      title: "Kesadaran Kesehatan | Panduan Situasi Darurat dari Aman",
      description:
        "Referensi lengkap Anda untuk memahami keadaan darurat kesehatan dan olahraga, gejalanya, serta cara merespons dengan percaya diri. Konten tepercaya yang mempersiapkan Anda menghadapi keadaan darurat sebelum terlambat.",
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
    fr: {
      title: "Blog Aman | Articles et conseils sur les premiers secours",
      description:
        "Lisez les derniers articles et conseils sur les premiers secours et les interventions d'urgence de l'équipe Aman.",
    },
    id: {
      title: "Blog Aman | Artikel & Tips Pertolongan Pertama",
      description:
        "Baca artikel dan tips terbaru tentang pertolongan pertama dan respons darurat dari tim Aman.",
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
    fr: {
      title: "Contactez-nous | Support technique et partenariats institutionnels pour Aman – Palestine",
      description:
        "Nous sommes là pour répondre à vos questions et accompagner les demandes de partenariat des entreprises, institutions publiques et écoles de Palestine. Contactez l'équipe Aman via le canal qui vous convient et démarrez dès maintenant.",
    },
    id: {
      title: "Hubungi Kami | Dukungan Teknis & Kemitraan Institusional untuk Aman – Palestina",
      description:
        "Kami siap menjawab pertanyaan Anda dan mendukung permintaan kemitraan dari perusahaan, instansi pemerintah, dan sekolah di seluruh Palestina. Hubungi tim Aman melalui saluran yang sesuai dan mulai sekarang.",
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
    fr: {
      title: "FAQ | Votre guide complet des services de la plateforme Aman – Palestine",
      description:
        "Des réponses directes et précises sur les programmes de formation, les certificats accrédités et le mécanisme d'apprentissage interactif d'Aman. Trouvez ce que vous cherchez en quelques secondes et commencez votre parcours de sauveteur certifié.",
    },
    id: {
      title: "FAQ | Panduan Lengkap Anda tentang Layanan Platform Aman – Palestina",
      description:
        "Jawaban langsung dan akurat tentang program pelatihan, sertifikat terakreditasi, dan mekanisme pembelajaran interaktif di Aman. Temukan yang Anda cari dalam hitungan detik dan mulai perjalanan Anda sebagai penyelamat bersertifikat.",
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
    fr: {
      title: "Vérification du certificat | Centre d'information de la plateforme Aman – Palestine",
      description:
        "Vérifiez les certificats de premiers secours délivrés par la plateforme Aman en une seule étape rapide et sécurisée. Un service officiel de confiance qui garantit l'authenticité de votre certificat auprès des organismes publics et privés.",
    },
    id: {
      title: "Verifikasi Sertifikat | Pusat Informasi di Platform Aman – Palestina",
      description:
        "Verifikasi sertifikat pertolongan pertama yang diterbitkan oleh platform Aman dalam satu langkah cepat dan aman. Layanan resmi terpercaya yang menjamin keaslian sertifikat Anda di hadapan lembaga pemerintah maupun swasta.",
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
    fr: {
      title: "Politique de confidentialité | Protection de vos données sur la plateforme éducative Aman",
      description:
        "Nous nous engageons à protéger vos données personnelles selon les normes de cybersécurité les plus élevées reconnues en Palestine. Consultez la politique de confidentialité complète pour comprendre nos mécanismes de protection.",
    },
    id: {
      title: "Kebijakan Privasi | Melindungi Data Anda di Platform Edukasi Aman",
      description:
        "Kami berkomitmen melindungi data pribadi Anda sesuai standar keamanan siber tertinggi yang diakreditasi di Palestina. Baca kebijakan privasi lengkap untuk memahami bagaimana informasi Anda dilindungi.",
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
    fr: {
      title: "Devenez sauveteur | Histoires réelles de bravoure pour sauver des vies en Palestine",
      description:
        "Des histoires inspirantes de sauveteurs ordinaires qui ont fait une vraie différence dans des moments critiques à travers la Palestine. Lisez leurs témoignages émouvants et partagez le vôtre pour inspirer les autres et rejoindre la communauté Aman.",
    },
    id: {
      title: "Jadilah Penyelamat | Kisah Kepahlawanan Nyata Menyelamatkan Nyawa di Palestina",
      description:
        "Kisah inspiratif dari penyelamat biasa yang membuat perbedaan nyata di saat-saat kritis di seluruh Palestina. Baca pengalaman mereka yang mengharukan dan bagikan kisah Anda untuk menginspirasi orang lain dan bergabung dengan komunitas Aman.",
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
    fr: {
      title: "Conditions générales | Accord d'utilisation de la plateforme éducative Aman",
      description:
        "Découvrez les conditions générales régissant l'utilisation de la plateforme Aman, de ses services de formation et de la délivrance des certificats accrédités. Une transparence totale qui protège vos droits et clarifie nos engagements envers vous.",
    },
    id: {
      title: "Syarat & Ketentuan | Perjanjian Penggunaan Platform Edukasi Aman",
      description:
        "Pelajari syarat dan ketentuan yang mengatur penggunaan platform Aman, layanan pelatihannya, dan penerbitan sertifikat terakreditasi. Transparansi penuh yang melindungi hak Anda dan menjelaskan komitmen kami kepada Anda.",
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
    fr: {
      title: "Se connecter | Plateforme Aman",
      description:
        "Connectez-vous à la plateforme Aman pour accéder aux programmes de premiers secours et aux certificats.",
    },
    id: {
      title: "Masuk | Platform Aman",
      description:
        "Masuk ke platform Aman untuk mengakses program pelatihan pertolongan pertama dan sertifikat.",
    },
  },
}

export function getPageMeta(key: PageMetaKey, locale: string): PageMetaEntry {
  const entry = PAGE_META[key]
  return entry[locale as Locale] ?? entry.en
}
