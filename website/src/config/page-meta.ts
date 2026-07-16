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
  | "latest-news"
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
      title: "أمان | منصة تدريب إسعافات أولية تفاعلية معتمدة KSA",
      description:
        "تعلّم الإسعافات الأولية بسيناريوهات فيديو تفاعلية، واحصل على شهادة معتمدة تؤهّلك لإنقاذ الأرواح بثقة وأمان. ابدأ أول برنامج في منصة أمان مجانًا اليوم.",
    },
    en: {
      title: "Aman | Accredited Interactive First Aid Training Platform – KSA",
      description:
        "Learn first aid through interactive video scenarios and earn an accredited certificate that empowers you to save lives with confidence. Start your first Aman program free today.",
    },
    fr: {
      title: "Aman | Plateforme accréditée de formation interactive aux premiers secours – KSA",
      description:
        "Apprenez les premiers secours à travers des scénarios vidéo interactifs et obtenez un certificat accrédité pour sauver des vies en toute confiance. Commencez votre premier programme Aman gratuitement dès aujourd'hui.",
    },
    fil: {
      title: "Aman | Accredited Interactive First Aid Training Platform sa KSA",
      description:
        "Mag-aral ng first aid sa pamamagitan ng interactive video scenarios at makakuha ng accredited certificate na magbibigay-kakayahan sa iyo na iligtas ang buhay nang may kumpiyansa. Simulan ang iyong unang Aman program nang libre ngayon.",
    },
    id: {
      title: "Aman | Platform Pelatihan Pertolongan Pertama Interaktif Terakreditasi – KSA",
      description:
        "Pelajari pertolongan pertama melalui skenario video interaktif dan dapatkan sertifikat terakreditasi yang membekali Anda menyelamatkan nyawa dengan percaya diri. Mulai program Aman pertama Anda gratis hari ini.",
    },
    ur: {
      title: "امان | سعودی عرب کا معتمد انٹرایکٹو فرسٹ ایڈ تربیتی پلیٹ فارم",
      description:
        "انٹرایکٹو ویڈیو سیناریوز کے ذریعے فرسٹ ایڈ سیکھیں اور معتمد سرٹیفکیٹ حاصل کریں جو آپ کو اعتماد کے ساتھ جانیں بچانے کے قابل بناتا ہے۔ آج ہی امان کا پہلا پروگرام مفت شروع کریں۔",
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
    fil: {
      title: "Aman Platform | Mga Interactive na First Aid Program na may Accredited Certificate",
      description:
        "Tuklasin ang apat na interactive na programa upang makabisado ang CPR at health & sports first aid sa pamamagitan ng real-world scenarios. Kunin ang iyong accredited certificate at maging isang mapagkakatiwalaang rescuer ngayon.",
    },
    id: {
      title: "Platform Aman | Program Pertolongan Pertama Interaktif dengan Sertifikat Terakreditasi",
      description:
        "Jelajahi empat program interaktif untuk menguasai CPR dan pertolongan pertama kesehatan & olahraga melalui skenario nyata. Dapatkan sertifikat terakreditasi dan jadilah penyelamat yang terpercaya hari ini.",
    },
    ur: {
      title: "امان پلیٹ فارم | معتمد سرٹیفکیٹ کے ساتھ انٹرایکٹو فرسٹ ایڈ پروگرامز",
      description:
        "CPR اور صحت و کھیلوں کی فرسٹ ایڈ میں مہارت حاصل کرنے کے لیے حقیقی منظرناموں پر مبنی چار انٹرایکٹو پروگرامز دریافت کریں۔ اپنا معتمد سرٹیفکیٹ حاصل کریں اور آج ہی ایک قابل اعتماد نجات دہندہ بنیں۔",
    },
  },
  "about-us": {
    ar: {
      title: "عن أمان | رؤيتنا لتدريب جيل من المُنقذين في المملكة",
      description:
        "منصة أمان تبني جيلًا سعوديًا قادرًا على إنقاذ الأرواح عبر تدريب تفاعلي ذكي يدمج الخبرة الطبية مع أحدث التقنيات التعليمية. اكتشف رؤيتنا ورسالتنا اليوم.",
    },
    en: {
      title: "About Aman | Our Vision to Train a Generation of Rescuers in KSA",
      description:
        "Aman is building a Saudi generation capable of saving lives through smart interactive training that blends medical expertise with the latest educational technology. Discover our vision and mission today.",
    },
    fr: {
      title: "À propos d'Aman | Notre vision pour former une génération de sauveteurs en Arabie Saoudite",
      description:
        "Aman forme une génération saoudienne capable de sauver des vies grâce à une formation interactive intelligente qui allie expertise médicale et dernières technologies pédagogiques. Découvrez notre vision et notre mission dès aujourd'hui.",
    },
    fil: {
      title: "Tungkol sa Aman | Aming Bisyon na Magsanay ng Henerasyon ng Rescuers sa KSA",
      description:
        "Ang Aman ay bumubuo ng isang henerasyon ng mga Saudi na may kakayahang magligtas ng buhay sa pamamagitan ng matalinong interactive na pagsasanay na pinagsasama ang medical expertise at pinakabagong teknolohiya sa edukasyon. Tuklasin ang aming bisyon at misyon ngayon.",
    },
    id: {
      title: "Tentang Aman | Visi Kami Melatih Generasi Penyelamat di KSA",
      description:
        "Aman membangun generasi Saudi yang mampu menyelamatkan nyawa melalui pelatihan interaktif cerdas yang memadukan keahlian medis dengan teknologi pendidikan terkini. Temukan visi dan misi kami hari ini.",
    },
    ur: {
      title: "امان کے بارے میں | سعودی عرب میں نجات دہندوں کی نسل تیار کرنے کا وژن",
      description:
        "امان سعودی نسل کو تیار کر رہا ہے جو طبی مہارت اور جدید ترین تعلیمی ٹیکنالوجی کے امتزاج پر مبنی ذہین انٹرایکٹو تربیت کے ذریعے جانیں بچانے کے قابل ہو۔ آج ہی ہمارا وژن اور مشن دریافت کریں۔",
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
    fil: {
      title: "Kamalayan sa Kalusugan | Gabay sa mga Emergency Mula sa Aman",
      description:
        "Ang iyong komprehensibong reference para maunawaan ang health at sports emergencies, ang mga sintomas nito, at kung paano tumugon nang may kumpiyansa. Mapagkakatiwalaang nilalaman na naghahanda sa iyo sa emergency bago pa mahuli ang lahat.",
    },
    id: {
      title: "Kesadaran Kesehatan | Panduan Situasi Darurat dari Aman",
      description:
        "Referensi lengkap Anda untuk memahami keadaan darurat kesehatan dan olahraga, gejalanya, serta cara merespons dengan percaya diri. Konten tepercaya yang mempersiapkan Anda menghadapi keadaan darurat sebelum terlambat.",
    },
    ur: {
      title: "صحت کی آگاہی | امان کی جانب سے ہنگامی حالات کی گائیڈ",
      description:
        "صحت اور کھیلوں کی ہنگامی صورتحال، ان کی علامات اور ان سے اعتماد کے ساتھ نمٹنے کے طریقوں کو سمجھنے کا آپ کا جامع حوالہ۔ قابل اعتماد مواد جو دیر ہونے سے پہلے ہنگامی صورتحال کا سامنا کرنے کے لیے آپ کو تیار کرتا ہے۔",
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
    fil: {
      title: "Aman Blog | Mga Artikulo at Tips sa First Aid",
      description:
        "Basahin ang pinakabagong mga artikulo at tips tungkol sa first aid at emergency response mula sa Aman team.",
    },
    id: {
      title: "Blog Aman | Artikel & Tips Pertolongan Pertama",
      description:
        "Baca artikel dan tips terbaru tentang pertolongan pertama dan respons darurat dari tim Aman.",
    },
    ur: {
      title: "امان بلاگ | فرسٹ ایڈ مضامین اور تجاویز",
      description:
        "امان ٹیم کی جانب سے فرسٹ ایڈ اور ہنگامی رسپانس سے متعلق تازہ ترین مضامین اور تجاویز پڑھیں۔",
    },
  },
  "contact-us": {
    ar: {
      title: "تواصل معنا | دعم فني وشراكات مؤسسية لمنصة أمان KSA",
      description:
        "نحن هنا للإجابة على استفساراتك، ودعم طلبات الشراكة للشركات والجهات الحكومية والمدارس في المملكة. تواصل مع فريق أمان عبر القنوات التي تناسبك وابدأ الآن.",
    },
    en: {
      title: "Contact Us | Technical Support & Institutional Partnerships for Aman – KSA",
      description:
        "We're here to answer your inquiries and support partnership requests from companies, government entities, and schools across the Kingdom. Reach the Aman team through the channel that suits you and start now.",
    },
    fr: {
      title: "Contactez-nous | Support technique et partenariats institutionnels pour Aman – KSA",
      description:
        "Nous sommes là pour répondre à vos questions et accompagner les demandes de partenariat des entreprises, institutions publiques et écoles du Royaume. Contactez l'équipe Aman via le canal qui vous convient et démarrez dès maintenant.",
    },
    fil: {
      title: "Makipag-ugnayan sa Amin | Technical Support at Institutional Partnerships para sa Aman – KSA",
      description:
        "Narito kami upang sagutin ang iyong mga katanungan at suportahan ang mga kahilingan para sa partnership mula sa mga kumpanya, ahensya ng gobyerno, at paaralan sa buong Kaharian. Makipag-ugnayan sa Aman team sa pamamagitan ng channel na nababagay sa iyo at magsimula na ngayon.",
    },
    id: {
      title: "Hubungi Kami | Dukungan Teknis & Kemitraan Institusional untuk Aman – KSA",
      description:
        "Kami siap menjawab pertanyaan Anda dan mendukung permintaan kemitraan dari perusahaan, instansi pemerintah, dan sekolah di seluruh Kerajaan. Hubungi tim Aman melalui saluran yang sesuai dan mulai sekarang.",
    },
    ur: {
      title: "ہم سے رابطہ کریں | امان کے لیے تکنیکی معاونت اور ادارہ جاتی شراکت داری – KSA",
      description:
        "ہم آپ کے سوالات کے جواب دینے اور مملکت بھر میں کمپنیوں، سرکاری اداروں اور اسکولوں کی شراکت داری کی درخواستوں کی حمایت کے لیے حاضر ہیں۔ اپنے لیے موزوں چینل کے ذریعے امان ٹیم سے رابطہ کریں اور ابھی شروع کریں۔",
    },
  },
  faqs: {
    ar: {
      title: "الأسئلة الشائعة | دليلك الكامل حول خدمات منصة أمان KSA",
      description:
        "إجابات مباشرة ودقيقة عن البرامج التدريبية والشهادات المعتمدة وآلية التعلّم التفاعلي في منصة أمان. اعثر على ما تبحث عنه في ثوانٍ، وابدأ رحلتك كمُنقذ معتمد.",
    },
    en: {
      title: "FAQs | Your Complete Guide to Aman Platform Services – KSA",
      description:
        "Direct, accurate answers about training programs, accredited certificates, and the interactive learning mechanism at Aman. Find what you need in seconds and start your journey as an accredited rescuer.",
    },
    fr: {
      title: "FAQ | Votre guide complet des services de la plateforme Aman – KSA",
      description:
        "Des réponses directes et précises sur les programmes de formation, les certificats accrédités et le mécanisme d'apprentissage interactif d'Aman. Trouvez ce que vous cherchez en quelques secondes et commencez votre parcours de sauveteur certifié.",
    },
    fil: {
      title: "Mga FAQ | Ang Iyong Kumpletong Gabay sa mga Serbisyo ng Aman Platform – KSA",
      description:
        "Mga direkta at tumpak na sagot tungkol sa mga training program, accredited certificates, at ang interactive learning mechanism sa Aman. Hanapin ang kailangan mo sa ilang segundo at simulan ang iyong paglalakbay bilang isang accredited rescuer.",
    },
    id: {
      title: "FAQ | Panduan Lengkap Anda tentang Layanan Platform Aman – KSA",
      description:
        "Jawaban langsung dan akurat tentang program pelatihan, sertifikat terakreditasi, dan mekanisme pembelajaran interaktif di Aman. Temukan yang Anda cari dalam hitungan detik dan mulai perjalanan Anda sebagai penyelamat bersertifikat.",
    },
    ur: {
      title: "عام سوالات | امان پلیٹ فارم کی خدمات کا مکمل گائیڈ – KSA",
      description:
        "امان میں تربیتی پروگرامز، معتمد سرٹیفکیٹس اور انٹرایکٹو لرننگ میکانزم کے بارے میں براہِ راست اور درست جوابات۔ سیکنڈز میں اپنا مطلوبہ جواب تلاش کریں اور بطور معتمد نجات دہندہ اپنا سفر شروع کریں۔",
    },
  },
  "information-center": {
    ar: {
      title: "التحقق من الشهادة | مركز المعلومات في منصة أمان KSA",
      description:
        "تحقّق من شهادات الإسعافات الأولية الصادرة عن منصة أمان بخطوة واحدة سريعة وآمنة. خدمة رسمية موثوقة تضمن أصالة شهادتك أمام الجهات الحكومية والخاصة معًا.",
    },
    en: {
      title: "Certificate Verification | Information Center at Aman Platform – KSA",
      description:
        "Verify first aid certificates issued by the Aman platform in one quick and secure step. An official, trusted service that ensures your certificate's authenticity before government and private bodies alike.",
    },
    fr: {
      title: "Vérification du certificat | Centre d'information de la plateforme Aman – KSA",
      description:
        "Vérifiez les certificats de premiers secours délivrés par la plateforme Aman en une seule étape rapide et sécurisée. Un service officiel de confiance qui garantit l'authenticité de votre certificat auprès des organismes publics et privés.",
    },
    fil: {
      title: "Beripikasyon ng Certificate | Information Center sa Aman Platform – KSA",
      description:
        "Beripikahin ang mga first aid certificate na ibinigay ng Aman platform sa isang mabilis at secure na hakbang. Isang opisyal at mapagkakatiwalaang serbisyo na tinitiyak ang pagiging orihinal ng iyong sertipiko sa harap ng mga gobyerno at pribadong institusyon.",
    },
    id: {
      title: "Verifikasi Sertifikat | Pusat Informasi di Platform Aman – KSA",
      description:
        "Verifikasi sertifikat pertolongan pertama yang diterbitkan oleh platform Aman dalam satu langkah cepat dan aman. Layanan resmi terpercaya yang menjamin keaslian sertifikat Anda di hadapan lembaga pemerintah maupun swasta.",
    },
    ur: {
      title: "سرٹیفکیٹ کی تصدیق | امان پلیٹ فارم کا معلوماتی مرکز – KSA",
      description:
        "امان پلیٹ فارم کی جانب سے جاری کردہ فرسٹ ایڈ سرٹیفکیٹس کی ایک تیز اور محفوظ قدم میں تصدیق کریں۔ ایک سرکاری اور قابل اعتماد خدمت جو سرکاری اور نجی اداروں کے سامنے آپ کے سرٹیفکیٹ کی اصلیت کی ضمانت دیتی ہے۔",
    },
  },
  "latest-news": {
    ar: {
      title: "آخر الأخبار | منصة أمان",
      description: "اطلع على آخر أخبار منصة أمان وفعالياتها ومستجداتها في مجال الإسعافات الأولية.",
    },
    en: {
      title: "Latest News | Aman Platform",
      description: "Stay up to date with the latest news, events, and updates from the Aman platform.",
    },
    fr: {
      title: "Dernières actualités | Plateforme Aman",
      description:
        "Restez informé des dernières actualités, événements et mises à jour de la plateforme Aman.",
    },
    fil: {
      title: "Pinakabagong Balita | Aman Platform",
      description:
        "Manatiling updated sa pinakabagong balita, mga kaganapan, at mga update mula sa Aman platform.",
    },
    id: {
      title: "Berita Terbaru | Platform Aman",
      description: "Ikuti berita terbaru, acara, dan pembaruan dari platform Aman.",
    },
    ur: {
      title: "تازہ ترین خبریں | امان پلیٹ فارم",
      description: "امان پلیٹ فارم کی تازہ ترین خبروں، تقریبات، اور تازہ کاریوں سے باخبر رہیں۔",
    },
  },
  "privacy-policy": {
    ar: {
      title: "سياسة الخصوصية | حماية بياناتك في منصة أمان التعليمية",
      description:
        "نلتزم بحماية بياناتك الشخصية وفق أعلى معايير الأمان السيبراني المعتمدة في المملكة العربية السعودية. اطّلع على سياسة الخصوصية الشاملة لفهم آلية الحماية.",
    },
    en: {
      title: "Privacy Policy | Protecting Your Data on the Aman Educational Platform",
      description:
        "We're committed to protecting your personal data to the highest cybersecurity standards accredited in the Kingdom of Saudi Arabia. Read the comprehensive privacy policy to understand how your information is safeguarded.",
    },
    fr: {
      title: "Politique de confidentialité | Protection de vos données sur la plateforme éducative Aman",
      description:
        "Nous nous engageons à protéger vos données personnelles selon les normes de cybersécurité les plus élevées reconnues en Arabie Saoudite. Consultez la politique de confidentialité complète pour comprendre nos mécanismes de protection.",
    },
    fil: {
      title: "Patakaran sa Privacy | Pagprotekta sa Iyong Data sa Aman Educational Platform",
      description:
        "Nakatuon kami sa pagprotekta ng iyong personal na data sa pinakamataas na pamantayan ng cybersecurity na akreditado sa Kaharian ng Saudi Arabia. Basahin ang komprehensibong privacy policy upang maunawaan kung paano pinoprotektahan ang iyong impormasyon.",
    },
    id: {
      title: "Kebijakan Privasi | Melindungi Data Anda di Platform Edukasi Aman",
      description:
        "Kami berkomitmen melindungi data pribadi Anda sesuai standar keamanan siber tertinggi yang diakreditasi di Kerajaan Arab Saudi. Baca kebijakan privasi lengkap untuk memahami bagaimana informasi Anda dilindungi.",
    },
    ur: {
      title: "رازداری کی پالیسی | امان تعلیمی پلیٹ فارم پر آپ کے ڈیٹا کی حفاظت",
      description:
        "ہم سعودی عرب میں معتمد اعلیٰ ترین سائبر سکیورٹی معیارات کے مطابق آپ کے ذاتی ڈیٹا کی حفاظت کے پابند ہیں۔ حفاظتی طریقہ کار کو سمجھنے کے لیے مکمل رازداری پالیسی پڑھیں۔",
    },
  },
  stories: {
    ar: {
      title: "كُن مُنقِذًا | قصص بطولة حقيقية لإنقاذ الأرواح بالسعودية",
      description:
        "قصص ملهمة من مُنقذين عاديين صنعوا فارقًا حقيقيًا في لحظات حاسمة داخل المملكة العربية. اقرأ تجاربهم المؤثرة وشاركنا قصتك، لتُلهم غيرك وتنضم لمجتمع أمان.",
    },
    en: {
      title: "Be a Rescuer | Real Heroism Stories of Saving Lives in Saudi Arabia",
      description:
        "Inspiring stories from ordinary rescuers who made a real difference in critical moments across the Kingdom. Read their moving experiences and share your own story to inspire others and join the Aman community.",
    },
    fr: {
      title: "Devenez sauveteur | Histoires réelles de bravoure pour sauver des vies en Arabie Saoudite",
      description:
        "Des histoires inspirantes de sauveteurs ordinaires qui ont fait une vraie différence dans des moments critiques à travers le Royaume. Lisez leurs témoignages émouvants et partagez le vôtre pour inspirer les autres et rejoindre la communauté Aman.",
    },
    fil: {
      title: "Maging Rescuer | Totoong Kuwento ng Kabayanihan sa Pagligtas ng Buhay sa Saudi Arabia",
      description:
        "Nakapagpapasigla na mga kuwento mula sa mga karaniwang rescuers na gumawa ng tunay na pagbabago sa mga kritikal na sandali sa buong Kaharian. Basahin ang kanilang mga nakakaantig na karanasan at ibahagi ang iyong sariling kuwento upang mag-inspire ng iba at sumali sa komunidad ng Aman.",
    },
    id: {
      title: "Jadilah Penyelamat | Kisah Kepahlawanan Nyata Menyelamatkan Nyawa di Arab Saudi",
      description:
        "Kisah inspiratif dari penyelamat biasa yang membuat perbedaan nyata di saat-saat kritis di seluruh Kerajaan. Baca pengalaman mereka yang mengharukan dan bagikan kisah Anda untuk menginspirasi orang lain dan bergabung dengan komunitas Aman.",
    },
    ur: {
      title: "نجات دہندہ بنیں | سعودی عرب میں جانیں بچانے کی حقیقی بہادری کی کہانیاں",
      description:
        "عام نجات دہندوں کی متاثر کن کہانیاں جنہوں نے مملکت بھر میں اہم لمحات میں حقیقی فرق ڈالا۔ ان کے اثرانگیز تجربات پڑھیں اور اپنی کہانی ہمارے ساتھ شیئر کریں تاکہ دوسروں کو متاثر کریں اور امان کمیونٹی میں شامل ہوں۔",
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
    fil: {
      title: "Mga Tuntunin at Kundisyon | Kasunduan sa Paggamit ng Aman Educational Platform",
      description:
        "Alamin ang mga tuntunin at kundisyon na namamahala sa paggamit ng Aman platform, sa mga serbisyong pang-training nito, at sa pag-issue ng accredited certificates. Ganap na transparency na pinoprotektahan ang iyong mga karapatan at nililinaw ang aming mga pananagutan sa iyo.",
    },
    id: {
      title: "Syarat & Ketentuan | Perjanjian Penggunaan Platform Edukasi Aman",
      description:
        "Pelajari syarat dan ketentuan yang mengatur penggunaan platform Aman, layanan pelatihannya, dan penerbitan sertifikat terakreditasi. Transparansi penuh yang melindungi hak Anda dan menjelaskan komitmen kami kepada Anda.",
    },
    ur: {
      title: "شرائط و ضوابط | امان تعلیمی پلیٹ فارم کے استعمال کا معاہدہ",
      description:
        "امان پلیٹ فارم، اس کی تربیتی خدمات اور معتمد سرٹیفکیٹس کے اجراء کو ضابطہ دینے والی شرائط و ضوابط سے آگاہ ہوں۔ مکمل شفافیت جو آپ کے حقوق کی حفاظت کرتی ہے اور آپ سے ہماری ذمہ داریاں واضح کرتی ہے۔",
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
    fil: {
      title: "Mag-log in | Aman Platform",
      description:
        "Mag-log in sa Aman platform upang i-access ang mga first aid training program at mga sertipiko.",
    },
    id: {
      title: "Masuk | Platform Aman",
      description:
        "Masuk ke platform Aman untuk mengakses program pelatihan pertolongan pertama dan sertifikat.",
    },
    ur: {
      title: "لاگ ان کریں | امان پلیٹ فارم",
      description: "فرسٹ ایڈ تربیتی پروگراموں اور سرٹیفکیٹس تک رسائی کے لیے امان پلیٹ فارم میں لاگ ان کریں۔",
    },
  },
}

export function getPageMeta(key: PageMetaKey, locale: string): PageMetaEntry {
  const entry = PAGE_META[key]
  return entry[locale as Locale] ?? entry.en
}
