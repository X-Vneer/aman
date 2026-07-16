<?php

return [
    // Videos::Start =======================================
    'videos' => [
        //Video 1
        [
            "video_url" => [
                "ar" => "https://vz-3d93d703-c07.b-cdn.net/f67c1d5a-8898-4e03-9c97-306322c6bcb8/playlist.m3u8",
                "en" => "https://vz-3d93d703-c07.b-cdn.net/cb6f82cf-8f98-4ce5-970a-6636cf2fe96e/playlist.m3u8",
                "fr" => "https://vz-3d93d703-c07.b-cdn.net/d9b4aa4f-aeac-4ce7-975d-2c9d454baf1f/playlist.m3u8",
                "id" => "https://vz-3d93d703-c07.b-cdn.net/7f4e167d-28ef-4bed-889a-52272dc6c260/playlist.m3u8",
            ],
            "logo" => env("AMAN_API") . "img/videos/01.jpg",
            "certificate_url" => env("AMAN_API") . "storage/certificate/1/6ed879be539bab894d7ac2219477c11fb9dcf3aa.png",
            "price" => "20",
            "title" => [
                "ar" => "الحالات الصحية الطارئة",
                "en" => "Emergency Health Cases",
                "fr" => "Cas de santé d'urgence",
                "id" => "Kasus Kesehatan Darurat"
            ],

            "description" => [
                "ar" => "يوفر التدريب الأساسي على الاستجابة للحالات الصحية الطارئة في الحياة اليومية بما في ذلك اصابات النزيف، الاجهاد الحراري، انسداد مجرى التنفس، غيبوبة السكر وحالات ضغط الدم",
                "en" => "Provides basic training in responding to health emergency situations in everyday life, including bleeding injuries, heat stress, airway obstruction, diabetic coma, and blood pressure conditions.",
                "fr" => "Fournit une formation de base sur la réponse aux situations d'urgence médicale dans la vie quotidienne, y compris les blessures hémorragiques, le stress thermique, l'obstruction des voies respiratoires, le coma diabétique et les problèmes de tension artérielle.",
                "id" => "Memberikan pelatihan dasar tentang merespons situasi darurat kesehatan dalam kehidupan sehari-hari, termasuk cedera perdarahan, stres panas, penyumbatan saluran napas, koma diabetes, dan kondisi tekanan darah."
            ],

            "length" => "00:04:14"
        ],
        // Video2
        [
            "video_url" => [
                "ar" => "https://vz-46046c44-973.b-cdn.net/f0445983-3fee-4e04-81ca-b7133f78d839/playlist.m3u8",
                "en" => "https://vz-c23c20ef-869.b-cdn.net/41fa0cd3-81c8-4e7d-be82-98a82c026730/playlist.m3u8",
                "fr" => "https://vz-c23c20ef-869.b-cdn.net/7f818e24-13e9-4d9d-963f-28cd2b1423ac/playlist.m3u8",
                "id" => "https://vz-c23c20ef-869.b-cdn.net/05e477b7-3d3d-467a-af03-2779baf2d96e/playlist.m3u8",
            ],
            "logo" => env("AMAN_API") . "img/videos/02.jpeg",
            "certificate_url" => env("AMAN_API") . "storage/certificate/2/9d79afeca165070486953dcc1c3074377d91bc28.png",
            "price" => "20",
            "title" => [
                "ar" => "الحالات الرياضية الطارئة",
                "en" => "Emergency Sports Cases",
                "fr" => "Cas d'urgence sportive",
                "id" => "Kasus Olahraga Mendesak"
            ],
            "description" => [
                "ar" => "يوفر التدريب الأساسي على الاستجابة للحالات الرياضية الطارئة في الحياة اليومية بما في ذلك الاصابات المؤدية الى ارتجاج الدماغ، بلع اللسان - ارتخاء عضلة اللسان ، توقف عضلة القلب والكسور",
                "en" => "Provides basic training on responding to sports emergency situations in everyday life, including injuries leading to brain concussion, tongue swallowing - tongue muscle relaxation, cardiac arrest, and fractures.",
                "fr" => "Fournit une formation de base sur la réponse aux situations d'urgence sportive dans la vie quotidienne, y compris les blessures entraînant une commotion cérébrale, l'ingestion de la langue - Relaxation du muscle cardiaque, un arrêt cardiaque et des fractures.",
                "id" => "Memberikan pelatihan dasar tentang merespons situasi darurat olahraga dalam kehidupan sehari-hari, termasuk cedera yang menyebabkan gegar otak, menelan lidah - Relaksasi otot lidah, henti jantung, dan patah tulang."
            ],

            "length" => "00:03:52"
        ]
    ],
    // Videos::End =======================================

    // FAQs::Start =====================================
    'FAQs' =>  [
        [
            "title" => [
                "ar" => "ماهو برنامج إنعاش",
                "en" => "What is an Aman program?",
                "fr" => "Qu'est-ce qu'un programme d'Aman ?",
                "id" => "Apa itu program Aman?"
            ],
            "description" => [
                "ar" => "هو برنامج توعوي تدريبي تفاعلي للتثقيف والتوعية حول الإصابات الصحية والرياضية الطارئة والطرق السليمة للتعامل معها.",
                "en" => "It is an interactive awareness training program to educate and raise awareness about emergency health and sports injuries and the proper ways to deal with them.",
                "fr" => "C'est un programme de sensibilisation interactif pour éduquer et sensibiliser aux blessures d'urgence en santé et en sport, ainsi que sur les bonnes pratiques pour y faire face.",
                "id" => "Ito ay isang interactive na programang pangkamalayan upang magturo at magtaas ng kamalayan tungkol sa mga emerhensiyang pangkalusugan at mga pinsala sa sports pati na rin ang wastong mga paraan upang harapin ang mga ito."
            ]
        ],
        [
            "title" => [
                "ar" => "من هم الفئات المستهدفة",
                "en" => "Who are the target categories?",
                "fr" => "Quelles sont les catégories cibles ?",
                "id" => "Sino ang mga kategoriya ng target?"
            ],
            "description" => [
                "ar" => "البرنامج موجه لجميع أفراد المجتمع بدءا من العمر 8 سنوات.",
                "en" => "The program is directed to all members of society starting from the age of 8 years.",
                "fr" => "Le programme s'adresse à tous les membres de la société à partir de 8 ans.",
                "id" => "Ang programa ay nakatuon sa lahat ng kasapi ng lipunan mula sa edad na 8 taon."
            ]
        ],
        [
            "title" => [
                "ar" => "هل هناك أي متطلبات للتسجيل ؟",
                "en" => "Are there any registration requirements?",
                "fr" => "Y a-t-il des exigences pour s'inscrire ?",
                "id" => "Mayroon bang anumang mga kinakailangan para sa pagpaparehistro?"
            ],
            "description" => [
                "ar" => "لا ، ليس هناك أي متطلبات.",
                "en" => "No, there are no requirements.",
                "fr" => "Non, il n'y a aucune exigence.",
                "id" => "Wala, walang mga kinakailangan."
            ]
        ],
        [
            "title" => [
                "ar" => "كيف يمكنني التسجيل ؟",
                "en" => "How can I register?",
                "fr" => "Comment puis-je m'inscrire ?",
                "id" => "Paano ako makakapagparehistro?"
            ],
            "description" => [
                "ar" => "في البداية القيام بأنشاء حساب في البوابة (التسجيل) ومن ثم اكمال التقدم و إختيار المسار ( الصحي / الرياضي ) واكمال عملية الدفع الالكتروني أو إستخدام كود الخصم.",
                "en" => "Firstly, create an account in the portal (registration), then complete the application, choose the path (health/sports), and complete the electronic payment process or use a discount code.",
                "fr" => "Tout d'abord, créez un compte sur le portail (inscription), complétez la demande, choisissez le parcours (santé/sport) et terminez le paiement en ligne ou utilisez un code de réduction.",
                "id" => "Una, lumikha ng account sa portal (pagpaparehistro), pagkatapos ay kumpletuhin ang aplikasyon, pumili ng landas (kalusugan/sports), at tapusin ang proseso ng pagbabayad nang elektronik o gumamit ng discount code."
            ]
        ],
        [
            "title" => [
                "ar" => "كيف يمكنني الحصول على شهادة الحضور؟",
                "en" => "How can I get a certificate of attendance?",
                "fr" => "Comment puis-je obtenir un certificat de présence ?",
                "id" => "Paano ko makukuha ang sertipiko ng pagdalo?"
            ],
            "description" => [
                "ar" => "عن طريق الدخول الى أيقونة الملف الشخصي ثم الانتقال الى قائمة الشهادات.",
                "en" => "By accessing the My Profile icon and then navigating to the Certificates menu.",
                "fr" => "En accédant à l'icône Mon profil, puis en naviguant vers le menu Certificats.",
                "id" => "Sa pamamagitan ng pag-access sa icon ng Aking Profile at pag-navigate sa menu ng Mga Sertipiko."
            ]
        ],
        [
            "title" => [
                "ar" => "ماهي طريقة حضور البرنامج؟",
                "en" => "How can I attend the program?",
                "fr" => "Comment puis-je participer au programme ?",
                "id" => "Paano ako makakadalo sa programa?"
            ],
            "description" => [
                "ar" => "عن بعد و تفاعلي عبر الأجهزة الذكية والحاسب.",
                "en" => "Remote and interactive via smart devices and computers.",
                "fr" => "À distance et interactif via des appareils intelligents et des ordinateurs.",
                "id" => "Malayo at interactive gamit ang mga smart device at computer."
            ]
        ],
        [
            "title" => [
                "ar" => "هل بإمكان الجهات والمنشأت العامة والخاصة طلب البرنامج لمنسوبيها ؟",
                "en" => "Can public and private entities request the program for their employees?",
                "fr" => "Les entités publiques et privées peuvent-elles demander le programme pour leurs employés ?",
                "id" => "Maafkan saya, dapatkah entitas publik dan swasta meminta program untuk karyawannya?"
            ],
            "description" => [
                "ar" => "نعم ، وذلك عبر تقديم طلب عبر البريد الالكتروني : info@inaash.edu.sa",
                "en" => "Yes, by submitting a request via email: info@inaash.edu.sa",
                "fr" => "Oui, en soumettant une demande par e-mail : info@inaash.edu.sa",
                "id" => "Ya, dengan mengajukan permintaan melalui email: info@inaash.edu.sa"
            ]
        ],
        [
            "title" => [
                "ar" => "في حالة حاجتي للمساعدة كيف يمكنني التواصل؟",
                "en" => "If I need help, how can I get in touch?",
                "fr" => "Si j'ai besoin d'aide, comment puis-je contacter quelqu'un ?",
                "id" => "Jika saya membutuhkan bantuan, bagaimana saya bisa menghubungi?"
            ],
            "description" => [
                "ar" => "بإمكانك التواصل مباشرة معنا عن طريق اتصل بنا من الموقع أو عبر البريد الالكتروني ",
                "en" => "You can contact us directly through the contact us link on the website or via email: info@inaash.edu.sa",
                "fr" => "Vous pouvez nous contacter directement via le lien Contactez-nous sur le site ou par e-mail : info@inaash.edu.sa",
                "id" => "Anda dapat menghubungi kami langsung melalui tautan hubungi kami di situs web atau melalui email: info@inaash.edu.sa"
            ]
        ],
        [
            "title" => [
                "ar" => "ماهي طريقة الرسوم ؟",
                "en" => "What is the method of payment?",
                "fr" => "Quelle est la méthode de paiement ?",
                "id" => "Apa metode pembayaran?"
            ],
            "description" => [
                "ar" => "طريقة دفع تكاليف المشاركة تتم عبر الدفع الإلكتروني أو استخدام أكواد الخصم.",
                "en" => "Payment of fees can be made via online payment or by using a discount code.",
                "fr" => "Le paiement des frais peut être effectué en ligne ou en utilisant un code de réduction.",
                "id" => "Pembayaran biaya dapat dilakukan melalui pembayaran online atau dengan menggunakan kode diskon."
            ]
        ],
        [
            "title" => [
                "ar" => "هل يمكنني إكمال البرنامج إذا انقطع في أي وقت بسبب مشاكل تقنية أو انقطاع الإنترنت؟",
                "en" => "Can I complete the program if interrupted due to technical issues?",
                "fr" => "Puis-je terminer le programme s'il est interrompu en raison de problèmes techniques ?",
                "id" => "Bisakah saya menyelesaikan program jika terputus karena masalah teknis?"
            ],
            "description" => [
                "ar" => "نعم يمكنك إكمال البرنامج من أخر مرحلة تم الوصول إليها مع ملاحظة: إنه في حال تغيير مسار البرنامج  يستوجب دفع الرسوم مرة اخرى.",
                "en" => "Yes, you can complete the program at the last stage reached. Note: If you change the course of the program, you will have to pay the fee again.",
                "fr" => "Oui, vous pouvez terminer le programme à la dernière étape atteinte. Remarque : Si vous changez de parcours, vous devrez payer à nouveau les frais.",
                "id" => "Ya, Anda dapat menyelesaikan program di tahap terakhir yang telah dicapai. Catatan: Jika Anda mengubah jalur program, Anda harus membayar biaya lagi."
            ]
        ],
        [
            "title" => [
                "ar" => "ماهي الشهادة المقدمة؟",
                "en" => "What is the certificate provided?",
                "fr" => "Quel est le certificat fourni ?",
                "id" => "Apa sertifikat yang diberikan?"
            ],
            "description" => [
                "ar" => "1- برنامج التوعية التفاعلي للحالات الصحية الطارئة الرياضية\n2- برنامج التوعية التفاعلي للحالات الصحية الطارئة",
                "en" => "1- Sports Emergencies Interactive Awareness Program\n2- Health Emergencies Interactive Awareness Program",
                "fr" => "1- Programme interactif de sensibilisation aux urgences sportives\n2- Programme interactif de sensibilisation aux urgences sanitaires",
                "id" => "1- Program Kesadaran Interaktif untuk Keadaan Darurat Olahraga\n2- Program Kesadaran Interaktif untuk Keadaan Darurat Kesehatan"
            ]
        ],
        [
            "title" => [
                "ar" => "متى يمكنني الحصول على الشهادة؟",
                "en" => "When can I get the certificate?",
                "fr" => "Quand puis-je obtenir le certificat ?",
                "id" => "Kapan saya bisa mendapatkan sertifikat?"
            ],
            "description" => [
                "ar" => "تظهر الشهادة تلقائياً بعد إكمال مسار البرنامج واستكمال نموذج التقييم وسيتم إرسال نسخة إلكترونية عبر البريد الإلكتروني.",
                "en" => "The certificate appears automatically after completing the program track, completing the evaluation form, and an electronic copy will be sent via email.",
                "fr" => "Le certificat apparaît automatiquement après avoir terminé le parcours du programme et rempli le formulaire d'évaluation. Une copie électronique sera envoyée par e-mail.",
                "id" => "Sertifikat muncul secara otomatis setelah menyelesaikan jalur program, menyelesaikan formulir evaluasi, dan salinan elektronik akan dikirim melalui email."
            ]
        ],
        [
            "title" => [
                "ar" => "هل يمكنني التحقق من الشهادة؟",
                "en" => "How can I check the certificate verification?",
                "fr" => "Comment puis-je vérifier l'authenticité du certificat ?",
                "id" => "Bagaimana saya bisa memverifikasi sertifikat?"
            ],
            "description" => [
                "ar" => "نعم ، من خلال رابط التحقق من الشهادة على الموقع أو من خلال الباركود الموجود على الشهادة.",
                "en" => "Yes, through the certificate verification link on the website or through the barcode on the certificate.",
                "fr" => "Oui, via le lien de vérification du certificat sur le site ou via le code-barres sur le certificat.",
                "id" => "Ya, melalui tautan verifikasi sertifikat di situs web atau melalui kode batang di sertifikat."
            ]
        ]

    ],
    // FAQs::End =======================================

    // Scene::Strat =======================================
    'scenes' => [
        // First Video
        [
            "video_id" => "1",
            "logo" => env("AMAN_API") . "img/scenes/1/01.jpeg",
            "title" => [
                "ar" => "الإجهاد الحراري",
                "en" => "Heat exhaustion",
                "fr" => "Épuisement dû à la chaleur",
                "id" => "Pagod sa init",
            ],
            "start_time" => "00:00:00",
            "length" => "00:01:03",
            "end_time" => "00:01:03"
        ],
        [
            "video_id" => "1",
            "logo" => env("AMAN_API") . "img/scenes/1/02.jpeg",
            "title" => [
                "ar" => "النزيف",
                "en" => "Bleeding",
                "fr" => "Saignement",
                "id" => "Pendarahan"
            ],
            "start_time" => "00:01:04",
            "length" => "00:00:35",
            "end_time" => "00:01:39"
        ],
        [
            "video_id" => "1",
            "logo" => env("AMAN_API") . "img/scenes/1/03.jpeg",
            "title" => [
                "ar" => "إنسداد مجرى الهواء",
                "en" => "Airway obstruction",
                "fr" => "Obstruction des voies respiratoires",
                "id" => "Penyumbatan saluran udara"
            ],
            "start_time" => "00:01:40",
            "length" => "00:00:35",
            "end_time" => "00:02:15"
        ],
        [
            "video_id" => "1",
            "logo" => env("AMAN_API") . "img/scenes/1/04.jpeg",
            "title" => [
                "ar" => "غيبوبة السكر ",
                "en" => "Diabetic coma",
                "fr" => "Coma diabétique",
                "id" => "Koma diabetes"
            ],
            "start_time" => "00:02:16",
            "length" => "00:00:55",
            "end_time" => "00:03:21"
        ],
        [
            "video_id" => "1",
            "logo" => env("AMAN_API") . "img/scenes/1/05.jpeg",
            "title" => [
                "ar" => "إرتفاع و إنخفاض ضغط الدم ",
                "en" => "High and low blood pressure",
                "fr" => "Hypertension et hypotension",
                "id" => "Tekanan darah tinggi dan rendah"
            ],
            "start_time" => "00:03:25",
            "length" => "00:00:49",
            "end_time" => "00:04:14"
        ],

        // Second Video
        [
            "video_id" => "2",
            "logo" => env("AMAN_API") . "img/scenes/2/01.jpeg",
            "title" => [
                "ar" => "إرتجاج الدماغ ",
                "en" => "Concussion",
                "fr" => "Commotion cérébrale",
                "id" => "Kuguran otak"
            ],
            "start_time" => "00:00:00",
            "length" => "00:01:03",
            "end_time" => "00:01:03"
        ],
        [
            "video_id" => "2",
            "logo" => env("AMAN_API") . "img/scenes/2/02.jpeg",
            "title" => [
                "ar" => "الكسور ",
                "en" => "Fracture",
                "fr" => "Fracture",
                "id" => "Patah"
            ],
            "start_time" => "00:01:04",
            "length" => "00:00:49",
            "end_time" => "00:01:53"
        ],
        [
            "video_id" => "2",
            "logo" => env("AMAN_API") . "img/scenes/2/03.jpeg",
            "title" => [
                "ar" => "بلع اللسان",
                "en" => "Tongue Swallowing",
                "fr" => "Avaler la langue",
                "id" => "Menelan lidah"
            ],
            "start_time" => "00:01:53",
            "length" => "00:00:52",
            "end_time" => "00:02:50"
        ],
        [
            "video_id" => "2",
            "logo" => env("AMAN_API") . "img/scenes/2/04.jpeg",
            "title" => [
                "ar" => "توقف عضلة القلب",
                "en" => "Cardiac arrest",
                "fr" => "Arrêt cardiaque",
                "id" => "Henti jantung"
            ],
            "start_time" => "00:02:51",
            "length" => "00:00:59",
            "end_time" => "00:03:52"
        ],

    ],

    // Scene::End =======================================

    // Question::Start =====================================
    'questions' => [
        // First Video
        [
            "video_id" => 1,
            "question" => [
                "ar" => "يبدو أن الحاج يعاني من الإجهاد الحراري نتيجة لضربة الشمس. ماذا ستفعل؟",
                "en" => "It seems the pilgrim is suffering from heat exhaustion due to sunstroke. What will you do?",
                "fr" => "Il semble que le pèlerin souffre d'épuisement dû à une insolation. Que ferez-vous?",
                "id" => "Tampaknya peziarah mengalami kelelahan akibat sengatan matahari. Apa yang akan Anda lakukan?",
            ],
            "answers_a" => [
                "ar" => "نقل المعتمر إلى مكان مظلل وترطيب الجلد بماء بارد",
                "en" => "Move the pilgrim to a shaded area and cool his skin with cold water.",
                "fr" => "Déplacez le pèlerin dans un endroit ombragé et refroidissez sa peau avec de l'eau froide.",
                "id" => "Pindahkan peziarah ke tempat teduh dan dinginkan kulitnya dengan air dingin.",
            ],
            "wrong_a" => [
                "ar" => "",
                "en" => "",
                "fr" => "",
                "id" => "",
            ],
            "answers_b" => [
                "ar" => "رش ماء بارد جدًا أو ثلج مباشرة على جسد المعتمر لتبريده بسرعة",
                "en" => "Spray very cold water or ice directly on the pilgrim’s body to cool him quickly.",
                "fr" => "Vaporisez de l'eau très froide ou de la glace directement sur le corps du pèlerin pour le refroidir rapidement.",
                "id" => "Semprotkan air sangat dingin atau es langsung ke tubuh peziarah agar cepat dingin.",
            ],
            "wrong_b" => [
                "ar" => "تقليل كفاءة الجسم في التخلص من الحرارة يؤدي الى ارتفاع خطر الإصابة بصدمة حرارية أو تقلص العضلات الخيار الصحيح هو نقل المعتمر الى مكان مظلل وترطيب الجلد بماء بارد",
                "en" => "Reduced efficiency of the body in dissipating heat increases the risk of heat shock or muscle cramps. The correct option is to move the pilgrim to a shaded area and cool his skin with cold water.",
                "fr" => "La réduction de l'efficacité du corps à dissiper la chaleur augmente le risque de choc thermique ou de crampes musculaires. L'option correcte est de déplacer le pèlerin dans un endroit ombragé et de refroidir sa peau avec de l'eau froide.",
                "id" => "Mengurangi efisiensi tubuh dalam menghilangkan panas meningkatkan risiko syok panas atau kram otot. Pilihan yang benar adalah memindahkan peziarah ke tempat teduh dan mendinginkan kulitnya dengan air dingin.",
            ],
            "answers_c" => [
                "ar" => "ترك المعتمر في الشمس ومحاولة تقديم مشروب دافئ لتحفيز تعرقه",
                "en" => "Leave the pilgrim in the sun and try to give him a warm drink to induce sweating.",
                "fr" => "Laissez le pèlerin au soleil et essayez de lui donner une boisson chaude pour induire la transpiration.",
                "id" => "Biarkan peziarah di bawah sinar matahari dan coba beri dia minuman hangat untuk merangsang berkeringat.",
            ],
            "wrong_c" => [
                "ar" => "زيادة ارتفاع درجة حرارة الجسم قد تسبب الدخول في مرحلة خطيرة من ضربة الشمس قد تؤدي إلى فقدان الوعي أو الوفاة الخيار الصحيح هو نقل المعتمر الى مكان مظلل وترطيب الجلد بماء بارد",
                "en" => "Increased body temperature can lead to a critical stage of sunstroke that may result in loss of consciousness or death. The correct option is to move the pilgrim to a shaded area and cool his skin with cold water.",
                "fr" => "L'augmentation de la température corporelle peut conduire à un stade critique d'insolation pouvant entraîner une perte de conscience ou la mort. L'option correcte est de déplacer le pèlerin dans un endroit ombragé et de refroidir sa peau avec de l'eau froide.",
                "id" => "Peningkatan suhu tubuh dapat menyebabkan tahap kritis sengatan matahari yang berisiko menyebabkan kehilangan kesadaran atau kematian. Pilihan yang benar adalah memindahkan peziarah ke tempat teduh dan mendinginkan kulitnya dengan air dingin.",
            ],
            "correct_answer" => "answer_a",
            "allowed_time" => "00:00:30",
            "appears_at" => "00:00:25",
            "wrong_answer_audio_urls" =>
            [
                "ar" => [
                    'answer_a' => "",
                    'answer_b' => env("AMAN_API") . "vo/1/1/Arabic/b.mp3",
                    'answer_c' => env("AMAN_API") . "vo/1/1/Arabic/c.mp3",
                    'answer_d' => "",
                ],
                "en" => [
                    'answer_a' => "",
                    'answer_b' => env("AMAN_API") . "vo/1/1/English/b.mp3",
                    'answer_c' => env("AMAN_API") . "vo/1/1/English/c.mp3",
                    'answer_d' => "",
                ],
                "fr" => [
                    'answer_a' => "",
                    'answer_b' => env("AMAN_API") . "vo/1/1/French/b.mp3",
                    'answer_c' => env("AMAN_API") . "vo/1/1/French/c.mp3",
                    'answer_d' => "",
                ],
                "id" => [
                    'answer_a' => "",
                    'answer_b' => env("AMAN_API") . "vo/1/1/Indonesian/b.mp3",
                    'answer_c' => env("AMAN_API") . "vo/1/1/Indonesian/c.mp3",
                    'answer_d' => ""
                ],
            ],
        ],
        [
            "video_id" => 1,
            "question" => [
                "ar" => "الطفل ينزف من الرأس. ماذا ستفعل؟",
                "en" => "The child is bleeding from the head. What would you do?",
                "fr" => "Un enfant saigne de la tête. Que feriez-vous?",
                "id" => "Anak sedang berdarah dari kepala. Apa yang akan Anda lakukan?",
            ],
            "answers_a" => [
                "ar" => "الضغط المباشر على الجرح بإستخدام قطعة قماش نظيفة.",
                "en" => "Apply direct pressure to the wound using a clean cloth.",
                "fr" => "Appliquez une pression directe sur la plaie avec un chiffon propre.",
                "id" => "Berikan tekanan langsung pada luka dengan kain bersih.",
            ],
            "wrong_a" => [
                "ar" => "",
                "en" => "",
                "fr" => "",
                "id" => "",
            ],
            "answers_b" => [
                "ar" => "غسل الجرح بقوة مع محاولة إزالة الأوساخ باستخدام الأصابع",
                "en" => "Wash the wound vigorously, trying to remove dirt with fingers.",
                "fr" => "Lavez vigoureusement la plaie en essayant d'enlever la saleté avec les doigts.",
                "id" => "Cuci luka dengan keras, mencoba menghilangkan kotoran dengan jari.",
            ],
            "wrong_b" => [
                "ar" => "سيتسبب ذلك بزيادة خطر العدوى والالتهابات العميقة، مما قد يتطلب تدخلًا طبيًا أكبر لاحقًا؛ الخيار الصحيح هو الضغط المباشر على الجرح بإستخدام قطعة قماش نظيفة",
                "en" => "This will increase the risk of infection and deep tissue damage, which may require more extensive medical intervention later. The correct option is to apply direct pressure to the wound using a clean cloth.",
                "fr" => "Cela augmentera le risque d'infection et de dommages aux tissus. L'option correcte est d'appliquer une pression directe sur la plaie avec un chiffon propre.",
                "id" => "Hal ini dapat meningkatkan risiko infeksi dan kerusakan jaringan yang lebih parah. Pilihan yang benar adalah memberikan tekanan langsung dengan kain bersih.",
            ],
            "answers_c" => [
                "ar" => "ترك الجرح مكشوفًا حتى يتوقف النزيف من تلقاء نفسه",
                "en" => "Leave the wound exposed to let the bleeding stop on its own.",
                "fr" => "Laissez la plaie exposée pour que le saignement s'arrête tout seul.",
                "id" => "Biarkan luka terbuka agar pendarahan berhenti dengan sendirinya.",
            ],
            "wrong_c" => [
                "ar" => "خيار خاطئ سيتسبب بفقدان كمية كبيرة من الدم، مما قد يؤدي إلى الصدمة أو حتى فقدان الوعي الخيار الصحيح هو الضغط المباشر على الجرح بإستخدام قطعة قماش نظيفة",
                "en" => "Wrong choice. This could lead to significant blood loss, potentially causing shock or even loss of consciousness. The correct option is to apply direct pressure to the wound using a clean cloth.",
                "fr" => "Mauvais choix. Cela pourrait entraîner une perte de sang importante, provoquant un choc ou une perte de conscience. L'option correcte est d'appliquer une pression directe sur la plaie avec un chiffon propre.",
                "id" => "Pilihan salah. Ini dapat menyebabkan kehilangan darah yang signifikan, yang berpotensi menyebabkan syok atau kehilangan kesadaran. Pilihan yang benar adalah memberikan tekanan langsung pada luka dengan kain bersih.",
            ],
            "correct_answer" => "answer_a",
            "allowed_time" => "00:00:30",
            "appears_at" => "00:01:19",
            "wrong_answer_audio_urls" => [
                "ar" => [
                    'answer_a' => "",
                    'answer_b' => env("AMAN_API") . "vo/1/2/Arabic/b.mp3",
                    'answer_c' => env("AMAN_API") . "vo/1/2/Arabic/c.mp3",
                    'answer_d' => "",
                ],
                "en" => [
                    'answer_a' => "",
                    'answer_b' => env("AMAN_API") . "vo/1/2/English/b.mp3",
                    'answer_c' => env("AMAN_API") . "vo/1/2/English/c.mp3",
                    'answer_d' => "",
                ],
                "fr" => [
                    'answer_a' => "",
                    'answer_b' => env("AMAN_API") . "vo/1/2/French/b.mp3",
                    'answer_c' => env("AMAN_API") . "vo/1/2/French/c.mp3",
                    'answer_d' => "",
                ],
                "id" => [
                    'answer_a' => "",
                    'answer_b' => env("AMAN_API") . "vo/1/2/Indonesian/b.mp3",
                    'answer_c' => env("AMAN_API") . "vo/1/2/Indonesian/c.mp3",
                    'answer_d' => "",
                ],
            ],
        ],
        [
            "video_id" => 1,
            "question" => [
                "ar" => "الطفل يختنق. ماذا ستفعل؟",
                "en" => "The child is choking. What will you do?",
                "fr" => "L'enfant s'étouffe. Que ferez-vous?",
                "id" => "Anak itu tersedak. Apa yang akan Anda lakukan?",
            ],
            "answers_a" => [
                "ar" => "مراقبة تنفس الطفل و تشجيعه على السعال",
                "en" => "Monitor the child's breathing and encourage him to cough.",
                "fr" => "Surveillez la respiration de l'enfant et encouragez-le à tousser.",
                "id" => "Pantau pernapasan anak dan dorong dia untuk batuk.",
            ],
            "wrong_a" => [
                "ar" => "",
                "en" => "",
                "fr" => "",
                "id" => "",
            ],
            "answers_b" => [
                "ar" => "ضرب ظهر الطفل بقوة أثناء وقوفه لإخراج العملة",
                "en" => "Hit the child's back forcefully while he is standing to dislodge the coin.",
                "fr" => "Donnez des coups au dos de l'enfant alors qu'il est debout pour déloger la pièce.",
                "id" => "Pukul punggung anak dengan keras saat dia berdiri untuk mengeluarkan koin.",
            ],
            "wrong_b" => [
                "ar" => "زيادة احتمالية بقاء العملة في المجرى الهوائي، مما يتطلب تدخلاً طبيًا طارئًا، الخيار الصحيح هو مراقبة الطفل وتشجيعه على السعال",
                "en" => "Increases the likelihood of the coin becoming lodged in the airway, requiring emergency medical intervention. The correct option is to monitor the child and encourage him to cough.",
                "fr" => "Cela augmente le risque que la pièce reste coincée dans les voies respiratoires, nécessitant une intervention médicale d'urgence. La bonne option est de surveiller l'enfant et de l'encourager à tousser.",
                "id" => "Ini meningkatkan kemungkinan koin tersangkut di saluran udara, membutuhkan intervensi medis darurat. Pilihan yang benar adalah memantau anak dan mendorongnya untuk batuk.",
            ],
            "answers_c" => [
                "ar" => "محاولة إدخال الأصابع في فم الطفل لإزالة العملة",
                "en" => "Try to put your fingers in the child's mouth to remove the coin.",
                "fr" => "Essayez de mettre vos doigts dans la bouche de l'enfant pour retirer la pièce.",
                "id" => "Cobalah memasukkan jari Anda ke dalam mulut anak untuk mengeluarkan koin.",
            ],
            "wrong_c" => [
                "ar" => "دفع العملة المعدنية إلى مجرى الهواء بشكل أعمق، مما يؤدي إلى انسداد كامل وخطر الاختناق، الخيار الصحيح هو مراقبة الطفل وتشجيعه على السعال",
                "en" => "Pushing the coin deeper into the airway leads to complete blockage and choking risk. The correct option is to monitor the child and encourage him to cough.",
                "fr" => "Pousser la pièce plus profondément dans les voies respiratoires entraîne un blocage complet et un risque d'étouffement. La bonne option est de surveiller l'enfant et de l'encourager à tousser.",
                "id" => "Mendorong koin lebih dalam ke saluran udara dapat menyebabkan penyumbatan total dan risiko tersedak. Pilihan yang benar adalah memantau anak dan mendorongnya untuk batuk.",
            ],
            "correct_answer" => "answer_a",
            "allowed_time" => "00:00:30",
            "appears_at" => "00:02:01",
            "wrong_answer_audio_urls" => [
                "ar" => [
                    'answer_a' => "",
                    'answer_b' => env("AMAN_API") . "vo/1/3/Arabic/b.mp3",
                    'answer_c' => env("AMAN_API") . "vo/1/3/Arabic/c.mp3",
                    'answer_d' => "",
                ],
                "en" => [
                    'answer_a' => "",
                    'answer_b' => env("AMAN_API") . "vo/1/3/English/b.mp3",
                    'answer_c' => env("AMAN_API") . "vo/1/3/English/c.mp3",
                    'answer_d' => "",
                ],
                "fr" => [
                    'answer_a' => "",
                    'answer_b' => env("AMAN_API") . "vo/1/3/French/b.mp3",
                    'answer_c' => env("AMAN_API") . "vo/1/3/French/c.mp3",
                    'answer_d' => "",
                ],
                "id" => [
                    'answer_a' => "",
                    'answer_b' => env("AMAN_API") . "vo/1/3/Indonesian/b.mp3",
                    'answer_c' => env("AMAN_API") . "vo/1/3/Indonesian/c.mp3",
                    'answer_d' => "",
                ],
            ],
        ],
        [
            "video_id" => 1,
            "question" => [
                "ar" => "زميل العمل يعاني من علامات الدوخة والارتباك وفقدان الوعي ويبدو انه يعاني من غيبوبة السكر نتيجة انخفاض السكر ماذا ستفعل؟",
                "en" => "A coworker is experiencing signs of dizziness, confusion, and loss of consciousness. He appears to be in a diabetic coma due to low blood sugar What would you do?",
                "fr" => "Un collègue présente des signes d'étourdissements, de confusion et de perte de connaissance. Il semble être dans le coma diabétique en raison d'une hypoglycémie. Que feriez-vous ?",
                "id" => "Seorang rekan kerja mengalami tanda-tanda pusing, kebingungan, dan kehilangan kesadaran. Ia tampaknya mengalami koma diabetes karena kadar gula darah rendah. Apa yang akan Anda lakukan?",
            ],
            "answers_a" => [
                "ar" => "تأكد من التنفس ونبضات القلب المنتظمة الى جانب اعطاء الشخص المصاب محلولا سكريا",
                "en" => "Make sure the breathing and heartbeat are regular and give the injured person a sugar solution",
                "fr" => "Assurez-vous que la respiration et le rythme cardiaque sont réguliers et donnez à la personne blessée une solution sucrée",
                "id" => "Pastikan pernafasan dan detak jantung teratur dan berikan orang yang terluka larutan gula",
            ],
            "wrong_a" => [
                "ar" => "",
                "en" => "",
                "fr" => "",
                "id" => "",
            ],
            "answers_b" => [
                "ar" => "تركه دون مراقبة والانتظار حتى يستعيد وعيه بمفرده",
                "en" => "Leave him unattended and wait for him to regain consciousness on his own",
                "fr" => "Laissez-le sans surveillance et attendez qu'il reprenne connaissance tout seul.",
                "id" => "Biarkan dia tanpa pengawasan dan tunggu dia sadar sendiri.",
            ],
            "wrong_b" => [
                "ar" => "قد يفقد الشخص المصاب فرصة تلقي الاسعافات الاولية بالوقت المناسب مما يؤدي الى تفاقم الحالة او الوفاة، الاجراء الصحيح نتيجة انخفاض السكر هو التأكد من انتظام التنفس ونبض القلب الى جانب اعطاء الشخص المصاب محلولا سكريا",
                "en" => "The affected person may lose the opportunity to receive first aid in a timely manner, which could lead to worsening of the condition or even death. The correct procedure in case of low blood sugar is to ensure regular breathing and heartbeat, along with administering a sugar solution to the affected person",
                "fr" => "La personne affectée pourrait perdre la chance de recevoir les premiers soins à temps, ce qui pourrait entraîner une aggravation de son état ou même la mort. La procédure correcte en cas d'hypoglycémie consiste à s'assurer que la respiration et le rythme cardiaque sont réguliers, tout en administrant une solution sucrée à la personne concernée",
                "id" => "Orang yang terkena mungkin kehilangan kesempatan untuk menerima pertolongan pertama tepat waktu, yang dapat menyebabkan memburuknya kondisi atau bahkan kematian. Prosedur yang benar dalam kasus gula darah rendah adalah memastikan pernapasan dan detak jantung teratur, serta memberikan larutan gula kepada orang yang terkena",
            ],
            "answers_c" => [
                "ar" => "محاولة إجباره على الجلوس أو الوقوف فورًا لمساعدته على استعادة وعيه",
                "en" => "Attempt to force him to sit or stand immediately to help him regain consciousness.",
                "fr" => "Essayez de le forcer à s'asseoir ou à se lever immédiatement pour l'aider à retrouver conscience.",
                "id" => "Cobalah memaksanya untuk duduk atau berdiri segera untuk membantunya sadar kembali.",
            ],
            "wrong_c" => [
                "ar" => "قد يتسبب ذلك في انخفاض تدفق الدم الى الدماغ مما يزيد من خطر السقوط والتعرض لمزيد من الاصابات، الاجراء الصحيح نتيجة انخفاض السكر هو التأكد من انتظام التنفس ونبض القلب الى جانب اعطاء الشخص المصاب محلولا سكريا",
                "en" => "This may lead to reduced blood flow to the brain, increasing the risk of falls and further injuries. The correct procedure in case of low blood sugar is to ensure regular breathing and heartbeat, along with administering a sugar solution to the affected person",
                "fr" => "Cela peut entraîner une réduction du flux sanguin vers le cerveau, augmentant ainsi le risque de chutes et de blessures supplémentaires. La procédure correcte en cas d'hypoglycémie consiste à s'assurer que la respiration et le rythme cardiaque sont réguliers, tout en administrant une solution sucrée à la personne concernée",
                "id" => "Hal ini dapat menyebabkan berkurangnya aliran darah ke otak, sehingga meningkatkan risiko jatuh dan cedera lebih lanjut. Prosedur yang benar dalam kasus gula darah rendah adalah memastikan pernapasan dan detak jantung teratur, serta memberikan larutan gula kepada orang yang terkena",
            ],
            "correct_answer" => "answer_a",
            "allowed_time" => "00:00:30",
            "appears_at" => "00:02:51",
            "wrong_answer_audio_urls" => [
                "ar" => [
                    'answer_a' => "",
                    'answer_b' => env("AMAN_API") . "vo/1/4/Arabic/b.mp3",
                    'answer_c' => env("AMAN_API") . "vo/1/4/Arabic/c.mp3",
                    'answer_d' => "",
                ],
                "en" => [
                    'answer_a' => "",
                    'answer_b' => env("AMAN_API") . "vo/1/4/English/b.mp3",
                    'answer_c' => env("AMAN_API") . "vo/1/4/English/c.mp3",
                    'answer_d' => "",
                ],
                "fr" => [
                    'answer_a' => "",
                    'answer_b' => env("AMAN_API") . "vo/1/4/French/b.mp3",
                    'answer_c' => env("AMAN_API") . "vo/1/4/French/c.mp3",
                    'answer_d' => "",
                ],
                "id" => [
                    'answer_a' => "",
                    'answer_b' => env("AMAN_API") . "vo/1/4/Indonesian/b.mp3",
                    'answer_c' => env("AMAN_API") . "vo/1/4/Indonesian/c.mp3",
                    'answer_d' => "",
                ],
            ],
        ],
        [
            "video_id" => 1,
            "question" => [
                "ar" => "يبدو انه يعاني من صداع شديد وزيادة في ضربات القلب، ماذا ستفعل؟",
                "en" => "He seems to be suffering from a severe headache and increased heart rate. What will you do?",
                "fr" => "Il semble souffrir d'un mal de tête sévère et d'un rythme cardiaque accru. Que ferez-vous?",
                "id" => "Sepertinya dia menderita sakit kepala parah dan detak jantung yang meningkat. Apa yang akan Anda lakukan?",
            ],
            "answers_a" => [
                "ar" => "مساعدته للانتقال الى مكان هادئ وقياس ضغط الدم",
                "en" => "Help him move to a quiet place and measure his blood pressure.",
                "fr" => "Aidez-le à se déplacer dans un endroit calme et mesurez sa pression artérielle.",
                "id" => "Bantu dia pindah ke tempat yang tenang dan ukur tekanan darahnya.",
            ],
            "wrong_a" => [
                "ar" => "",
                "en" => "",
                "fr" => "",
                "id" => "",
            ],
            "answers_b" => [
                "ar" => "تشجيعه على تناول مشروبات تحتوي على الكافيين لتخفيف الصداع",
                "en" => "Encourage him to drink caffeinated beverages to relieve his headache.",
                "fr" => "Encouragez-le à boire des boissons contenant de la caféine pour soulager son mal de tête.",
                "id" => "Dorong dia untuk minum minuman berkafein untuk meredakan sakit kepalanya.",
            ],
            "wrong_b" => [
                "ar" => "سيسبب تفاقم تسارع ضربات القلب مما يؤدي الى زيادة خطر حدوث مضاعفات خطيرة مثل السكتة الدماغية أو النوبة القلبية التصرف الصحيح هو نقله الى مكان هادئ وقياس ضغط الدم",
                "en" => "This will worsen the rapid heart rate, increasing the risk of serious complications such as a stroke or heart attack. The correct action is to move him to a quiet place and measure his blood pressure.",
                "fr" => "Cela aggravera l'accélération du rythme cardiaque, augmentant le risque de complications graves telles qu'un AVC ou une crise cardiaque. L'action correcte est de le déplacer dans un endroit calme et de mesurer sa pression artérielle.",
                "id" => "Ini akan memperburuk detak jantung yang cepat, meningkatkan risiko komplikasi serius seperti stroke atau serangan jantung. Tindakan yang benar adalah memindahkannya ke tempat yang tenang dan mengukur tekanannya.",
            ],
            "answers_c" => [
                "ar" => "إجباره على الاستلقاء بشكل مسطح على ظهره",
                "en" => "Force him to lie flat on his back.",
                "fr" => "Forcer à s'allonger à plat sur le dos.",
                "id" => "Paksakan dia untuk berbaring datar di punggungnya.",
            ],
            "wrong_c" => [
                "ar" => "ذلك قد يسبب زيادة ضغط الدم في الرأس، مما يزيد من حدة الأعراض مثل الصداع وعدم الراحة الخيار والتصرف الصحيح هو مساعدته للانتقال الى مكان هادئ وقياس ضغط الدم",
                "en" => "This could increase blood pressure in the head, worsening symptoms like headache and discomfort. The correct action is to help him move to a quiet place and measure his blood pressure.",
                "fr" => "Cela pourrait augmenter la pression artérielle dans la tête, aggravant les symptômes tels que le mal de tête et l'inconfort. L'action correcte est de l'aider à se déplacer dans un endroit calme et de mesurer sa pression artérielle.",
                "id" => "Ini dapat meningkatkan tekanan darah di kepala, memperburuk gejala seperti sakit kepala dan ketidaknyamanan. Tindakan yang benar adalah membantunya pindah ke tempat yang tenang dan mengukur tekanannya.",
            ],
            "correct_answer" => "answer_a",
            "allowed_time" => "00:00:30",
            "appears_at" => "00:03:34",
            "wrong_answer_audio_urls" => [
                "ar" => [
                    'answer_a' => "",
                    'answer_b' => env("AMAN_API") . "vo/1/5/Arabic/b.mp3",
                    'answer_c' => env("AMAN_API") . "vo/1/5/Arabic/c.mp3",
                    'answer_d' => "",
                ],
                "en" => [
                    'answer_a' => "",
                    'answer_b' => env("AMAN_API") . "vo/1/5/English/b.mp3",
                    'answer_c' => env("AMAN_API") . "vo/1/5/English/c.mp3",
                    'answer_d' => "",
                ],
                "fr" => [
                    'answer_a' => "",
                    'answer_b' => env("AMAN_API") . "vo/1/5/French/b.mp3",
                    'answer_c' => env("AMAN_API") . "vo/1/5/French/c.mp3",
                    'answer_d' => "",
                ],
                "id" => [
                    'answer_a' => "",
                    'answer_b' => env("AMAN_API") . "vo/1/5/Indonesian/b.mp3",
                    'answer_c' => env("AMAN_API") . "vo/1/5/Indonesian/c.mp3",
                    'answer_d' => "",
                ],
            ],
        ],


        // Second Video
        [
            "video_id" => 2,
            "question" => [
                "ar" => "قد يكون اللاعب مصابًا بارتجاج في المخ. ماذا ستفعل؟",
                "en" => "The player may have a concussion. What will you do?",
                "fr" => "Le joueur pourrait avoir une commotion cérébrale. Que ferez-vous?",
                "id" => "Pemain mungkin mengalami gegar otak. Apa yang akan Anda lakukan?",
            ],
            "answers_a" => [
                "ar" => "التحقق من استجابة وتنفس اللاعب دون تحريكه والاتصال بالخدمات الطبية الطارئة",
                "en" => "Check the player's responsiveness and breathing without moving him and call emergency medical services",
                "fr" => "Vérifiez la réactivité et la respiration du joueur sans le déplacer et appelez les services médicaux d'urgence",
                "id" => "Periksa respons dan pernapasan pemain tanpa menggerakkannya dan hubungi layanan medis darurat",
            ],
            "wrong_a" => [
                "ar" => "",
                "en" => "",
                "fr" => "",
                "id" => "",
            ],
            "answers_b" => [
                "ar" => "رش الماء على وجه اللاعب لمحاولة إيقاظه بسرعة",
                "en" => "Splash water on the player's face to try to wake him quickly.",
                "fr" => "Éclaboussez le visage du joueur avec de l'eau pour essayer de le réveiller rapidement.",
                "id" => "Percikkan air ke wajah pemain untuk mencoba membangunkannya dengan cepat.",
            ],
            "wrong_b" => [
                "ar" => "رش الماء على وجه المصاب لا يعالج السبب الأساسي للإصابة، ويمكن ان يسبب تأخير الحصول على المساعدة الطبية اللازمه وتفاقم الأعراض أو حدوث تلف، التصرف الصحيح هو التحقق من استجابة وتنفس اللاعب دون تحريكه والاتصال بالخدمات الطبية الطارئة",
                "en" => "Spraying water on the injured person’s face does not treat the underlying cause of the injury, and may cause delay in obtaining the necessary medical assistance, worsen symptoms, or cause damage. The correct action is to check the player’s response and breathing without moving him and call emergency medical services",
                "fr" => "Le fait de vaporiser de l’eau sur le visage de la personne blessée ne traite pas la cause sous-jacente de la blessure et peut retarder l’obtention de l’aide médicale nécessaire, aggraver les symptômes ou causer des dommages. La bonne action consiste à vérifier la réaction et la respiration du joueur sans le déplacer et à appeler les services médicaux d’urgence",
                "id" => "Menyemprotkan air ke wajah korban tidak akan menyembuhkan akar penyebab cedera, dan dapat menyebabkan keterlambatan dalam mendapatkan pertolongan medis yang diperlukan, memperburuk gejala, atau menyebabkan kerusakan. Tindakan yang tepat adalah memeriksa respons dan pernapasan korban tanpa menggerakkannya dan menghubungi layanan medis darurat",
            ],
            "answers_c" => [
                "ar" => "تحريك اللاعب ووضعه في وضعية الجلوس لإيقاظه",
                "en" => "Move the player and sit him up to wake him.",
                "fr" => "Déplacez le joueur et asseyez-le pour le réveiller.",
                "id" => "Pindahkan pemain dan dudukkan dia untuk membangunkannya.",
            ],
            "wrong_c" => [
                "ar" => "تحريك الشخص المصاب باصابة في الرأس قد يؤدي الى تفاقم اي اصابة في العمود الفقري او الدماغ او حدوث تلف دائم بالاعصاب مما يزيد من خطورة الحالة، التصرف الصحيح هو التحقق من استجابة وتنفس اللاعب دون تحريكه والاتصال بالخدمات الطبية الطارئة",
                "en" => "Moving a person with a head injury may aggravate any injury to the spine or brain, or cause permanent nerve damage, which increases the seriousness of the condition. The correct action is to check the player’s response and breathing without moving him and call emergency medical services",
                "fr" => "Déplacer une personne blessée à la tête peut aggraver toute blessure à la colonne vertébrale ou au cerveau, ou causer des lésions nerveuses permanentes, ce qui augmente la gravité de la maladie. La bonne mesure à prendre est de vérifier la réaction et la respiration du joueur sans le déplacer et d'appeler les services médicaux d'urgence",
                "id" => "Memindahkan orang yang mengalami cedera kepala dapat memperparah cedera tulang belakang atau otak, atau menyebabkan kerusakan saraf permanen, yang akan meningkatkan keseriusan kondisi tersebut. Tindakan yang tepat adalah memeriksa respons dan pernapasan pemain tanpa memindahkannya dan menghubungi layanan medis darurat",
            ],
            "correct_answer" => "answer_a",
            "allowed_time" => "00:00:30",
            "appears_at" => "00:00:33",
            "wrong_answer_audio_urls" => [
                "ar" => [
                    'answer_a' => "",
                    'answer_b' => env("AMAN_API") . "vo/2/1/Arabic/b.mp3",
                    'answer_c' => env("AMAN_API") . "vo/2/1/Arabic/c.mp3",
                    'answer_d' => "",
                ],
                "en" => [
                    'answer_a' => "",
                    'answer_b' => env("AMAN_API") . "vo/2/1/English/b.mp3",
                    'answer_c' => env("AMAN_API") . "vo/2/1/English/c.mp3",
                    'answer_d' => "",
                ],
                "fr" => [
                    'answer_a' => "",
                    'answer_b' => env("AMAN_API") . "vo/2/1/French/b.mp3",
                    'answer_c' => env("AMAN_API") . "vo/2/1/French/c.mp3",
                    'answer_d' => "",
                ],
                "id" => [
                    'answer_a' => "",
                    'answer_b' => env("AMAN_API") . "vo/2/1/Indonesian/b.mp3",
                    'answer_c' => env("AMAN_API") . "vo/2/1/Indonesian/c.mp3",
                    'answer_d' => "",
                ],
            ],
        ],
        [
            "video_id" => 2,
            "question" => [
                "ar" => "قد يكون لدى العداء ركبة مكسورة. ماذا ستفعل؟",
                "en" => "The runner may have a broken knee. What will you do?",
                "fr" => "Le coureur peut avoir une genou cassée. Que ferez-vous?",
                "id" => "Pelari mungkin memiliki pergelangan lutut yang patah. Apa yang akan Anda lakukan?",
            ],
            "answers_a" => [
                "ar" => "تثبيت الركبة وطلب المساعدة من الخدمات الطبية الطارئة",
                "en" => "Stabilize the knee and call for service medical emergency",
                "fr" => "Stabilisez le genou et appelez les secours médicaux",
                "id" => "Stabilkan lutut dan hubungi layanan darurat medis",
            ],
            "wrong_a" => [
                "ar" => "",
                "en" => "",
                "fr" => "",
                "id" => "",
            ],

            "answers_b" => [
                "ar" => "تشجيع العداء على الوقوف ومحاولة المشي لتحريك الركبة وتخفيف الألم",
                "en" => "Encourage the runner to stand and try to walk to move the knee and alleviate the pain.",
                "fr" => "Encouragez le coureur à se lever et à essayer de marcher pour bouger la genou et soulager la douleur.",
                "id" => "Dorong pelari untuk berdiri dan mencoba berjalan untuk menggerakkan pergelangan lutut dan mengurangi rasa sakit.",
            ],
            "wrong_b" => [
                "ar" => "سيسبب ذلك تفاقم الإصابة وتطور الكسر ليصبح غير مستقر، مما قد يتطلب تدخلًا جراحيًا أكثر تعقيدًا التصرف الصحيح هو تثبيت الركبة وطلب المساعدة من الخدمات الطبية الطارئة",
                "en" => "This will exacerbate the injury and cause the fracture to become unstable, potentially requiring more complex surgical intervention. The correct course of action is to stabilize the knee and seek assistance from emergency medical services",
                "fr" => "Cela aggravera la blessure et rendra la fracture instable, ce qui pourrait nécessiter une intervention chirurgicale plus complexe. La bonne démarche consiste à stabiliser le genou et à demander l'aide des services médicaux d'urgence",
                "id" => "Hal ini akan memperburuk cedera dan menyebabkan patahan menjadi tidak stabil, yang mungkin memerlukan intervensi bedah yang lebih kompleks. Tindakan yang benar adalah menstabilkan lutut dan meminta bantuan dari layanan medis darurat",
            ],
            "answers_c" => [
                "ar" => "محاولة تحريك الركبة بلطف لمعرفة مدى شدة الإصابة",
                "en" => "Try to move the knee gently to see how severe the injury is",
                "fr" => "Essayez de bouger doucement le genou pour déterminer la gravité de la blessure",
                "id" => "Cobalah gerakkan pergelangan lutut dengan lembut untuk menilai tingkat keparahan cedera.",
            ],
            "wrong_c" => [
                "ar" => "سيتسبب في زيادة حدة الكسر وتمزق الأنسجة أو الأربطة المحيطة بالركبة مما يؤدي إلى مضاعفات خطيرة التصرف الصحيح هو تثبيت الركبة وطلب المساعدة من الخدمات الطبية الطارئة",
                "en" => "It will increase the severity of the fracture and cause tearing of the tissues or ligaments surrounding the knee, leading to serious complications. The correct course of action is to stabilize the knee and seek assistance from emergency medical services",
                "fr" => "Cela augmentera la gravité de la fracture et provoquera une déchirure des tissus ou des ligaments entourant le genou, entraînant des complications graves. La bonne démarche consiste à stabiliser le genou et à demander l'aide des services médicaux d'urgence",
                "id" => "Hal ini akan meningkatkan keparahan patahan dan menyebabkan robeknya jaringan atau ligamen di sekitar lutut, yang mengakibatkan komplikasi serius. Tindakan yang benar adalah menstabilkan lutut dan meminta bantuan dari layanan medis darurat",
            ],
            "correct_answer" => "answer_a",
            "allowed_time" => "00:00:30",
            "appears_at" => "00:01:23",
            "wrong_answer_audio_urls" => [
                "ar" => [
                    'answer_a' => "",
                    'answer_b' => env("AMAN_API") . "vo/2/2/Arabic/b.mp3",
                    'answer_c' => env("AMAN_API") . "vo/2/2/Arabic/c.mp3",
                    'answer_d' => "",
                ],
                "en" => [
                    'answer_a' => "",
                    'answer_b' => env("AMAN_API") . "vo/2/2/English/b.mp3",
                    'answer_c' => env("AMAN_API") . "vo/2/2/English/c.mp3",
                    'answer_d' => "",
                ],
                "fr" => [
                    'answer_a' => "",
                    'answer_b' => env("AMAN_API") . "vo/2/2/French/b.mp3",
                    'answer_c' => env("AMAN_API") . "vo/2/2/French/c.mp3",
                    'answer_d' => "",
                ],
                "id" => [
                    'answer_a' => "",
                    'answer_b' => env("AMAN_API") . "vo/2/2/Indonesian/b.mp3",
                    'answer_c' => env("AMAN_API") . "vo/2/2/Indonesian/c.mp3",
                    'answer_d' => "",
                ],
            ],
        ],
        [
            "video_id" => 2,
            "question" => [
                "ar" => "يبدو ان اللاعب تعرض لاصابة بلع اللسان (ارتخاء عضلة اللسان) ماذا ستفعل؟",
                "en" => "It seems the player is experiencing a tongue swallowing (tongue muscle relaxation) injury. What will you do?",
                "fr" => "Il semble que le joueur ait subi une blessure à la langue qui se tord (détendre les muscles de la langue). Que ferez-vous?",
                "id" => "Sepertinya pemain mengalami cedera menelan lidah (relaksasi otot lidah). Apa yang akan Anda lakukan?",
            ],
            "answers_a" => [
                "ar" => "تثبيت رأس المصاب جيدا ورفع الفك",
                "en" => "Stabilize the injured person’s head and lift the jaw.",
                "fr" => "Stabilisez la tête de la personne blessée et soulevez la mâchoire.",
                "id" => "Stabilkan kepala orang yang terluka dan angkat rahangnya.",
            ],
            "wrong_a" => [
                "ar" => "",
                "en" => "",
                "fr" => "",
                "id" => "",
            ],
            "answers_b" => [
                "ar" => "محاولة إجبار اللاعب على الجلوس أو الوقوف لاستعادة التنفس",
                "en" => "Try to force the player to sit or stand to regain breathing.",
                "fr" => "Essayez de forcer le joueur à s'asseoir ou à se lever pour récupérer son souffle.",
                "id" => "Cobalah memaksa pemain untuk duduk atau berdiri agar bisa bernapas kembali.",
            ],
            "wrong_b" => [
                "ar" => "تحريك الشخص المصاب دون معالجة انسداد مجرى الهواء قد يؤدي إلى تفاقم الحالة، خاصة إذا كان فاقدًا للوعي مما قد يسبب فقدان كامل للتنفس و توقف القلب التصرف الصحيح هو تثبيت رأس المصاب جيدا ورفع الفك",
                "en" => "Moving the injured person without addressing the airway obstruction may worsen the condition, especially if he is unconscious, leading to complete loss of breathing and cardiac arrest. The correct action is to stabilize the injured person's head and lift the jaw",
                "fr" => "Déplacer la personne blessée sans traiter l'obstruction des voies respiratoires peut aggraver l'état, surtout si elle est inconsciente, entraînant une perte complète de la respiration et un arrêt cardiaque. L'action correcte consiste à stabiliser la tête de la personne blessée et à soulever la mâchoire.",
                "id" => "Memindahkan orang yang terluka tanpa mengatasi penyumbatan saluran napas dapat memperburuk kondisi, terutama jika ia tidak sadar, yang dapat menyebabkan hilangnya napas total dan henti jantung. Tindakan yang benar adalah menstabilkan kepala orang yang terluka dan mengangkat rahangnya.",
            ],
            "answers_c" => [
                "ar" => "محاولة سحب اللسان بقوة باستخدام أي أداة قريبة مثل ملعقة أو قلم",
                "en" => "Try to pull the tongue forcefully using any nearby tool, such as a spoon or pen.",
                "fr" => "Essayez de tirer la langue avec force en utilisant tout outil à proximité, comme une cuillère ou un stylo.",
                "id" => "Cobalah menarik lidah dengan kuat menggunakan alat terdekat, seperti sendok atau pena.",
            ],
            "wrong_c" => [
                "ar" => "قد يسبب إحداث إصابة في الفم أو الحلق بسبب استخدام الأدوات الغير مخصصة او يسبب زيادة خطر انسداد مجرى الهواء بشكل كامل بسبب دفع اللسان أو الأداة بشكل غير مقصود ، التصرف الصحيح هو تثبيت رأس المصاب جيدا ورفع الفك",
                "en" => "This may cause injury to the mouth or throat due to the use of inappropriate tools, or increase the risk of completely obstructing the airway by inadvertently pushing the tongue or tool. The correct action is to stabilize the injured person’s head and lift the jaw",
                "fr" => "Cela peut provoquer des blessures à la bouche ou à la gorge en raison de l'utilisation d'outils inappropriés, ou augmenter le risque d'obstruction complète des voies respiratoires en poussant accidentellement la langue ou l'outil. L'action correcte consiste à stabiliser la tête de la personne blessée et à soulever la mâchoire.",
                "id" => "Ini dapat menyebabkan cedera pada mulut atau tenggorokan akibat penggunaan alat yang tidak sesuai, atau meningkatkan risiko penyumbatan saluran napas sepenuhnya dengan tidak sengaja mendorong lidah atau alat tersebut. Tindakan yang benar adalah menstabilkan kepala orang yang terluka dan mengangkat rahangnya.",
            ],
            "correct_answer" => "answer_a",
            "allowed_time" => "00:00:30",
            "appears_at" => "00:02:09",
            "wrong_answer_audio_urls" => [
                "ar" => [
                    'answer_a' => "",
                    'answer_b' => env("AMAN_API") . "vo/2/3/Arabic/b.mp3",
                    'answer_c' => env("AMAN_API") . "vo/2/3/Arabic/c.mp3",
                    'answer_d' => "",
                ],
                "en" => [
                    'answer_a' => "",
                    'answer_b' => env("AMAN_API") . "vo/2/3/English/b.mp3",
                    'answer_c' => env("AMAN_API") . "vo/2/3/English/c.mp3",
                    'answer_d' => "",
                ],
                "fr" => [
                    'answer_a' => "",
                    'answer_b' => env("AMAN_API") . "vo/2/3/French/b.mp3",
                    'answer_c' => env("AMAN_API") . "vo/2/3/French/c.mp3",
                    'answer_d' => "",
                ],
                "id" => [
                    'answer_a' => "",
                    'answer_b' => env("AMAN_API") . "vo/2/3/Indonesian/b.mp3",
                    'answer_c' => env("AMAN_API") . "vo/2/3/Indonesian/c.mp3",
                    'answer_d' => "",
                ],
            ],
        ],
        [
            "video_id" => 2,
            "question" => [
                "ar" => "العداء يشعر بألم في الصدر وسيفقد الوعي. ماذا ستفعل؟",
                "en" => "The runner is experiencing chest pain and will lose consciousness. What will you do?",
                "fr" => "Le coureur ressent une douleur à la poitrine et va perdre connaissance. Que ferez-vous?",
                "id" => "Pelari mengalami nyeri dada dan akan pingsan. Apa yang akan Anda lakukan?",
            ],
            "answers_a" => [
                "ar" => "التحقق من تنفس واستجابة اللاعب وطلب المساعدة من الخدمات الطبية الطارئة",
                "en" => "Check the player's breathing and responsiveness and seek help from emergency medical services",
                "fr" => "Vérifiez la respiration et la réactivité du joueur et demandez l’aide des services médicaux d’urgence",
                "id" => "Periksa pernafasan dan respons pemain dan cari bantuan dari layanan medis darurat",
            ],
            "wrong_a" => [
                "ar" => "",
                "en" => "",
                "fr" => "",
                "id" => "",
            ],
            "answers_b" => [
                "ar" => "إعطاؤه الماء أو مشروب رياضي لمساعدته على الشعور بالتحسن",
                "en" => "Give him water or a sports drink to help him feel better.",
                "fr" => "Donnez-lui de l'eau ou une boisson sportive pour l'aider à se sentir mieux.",
                "id" => "Berikan air atau minuman olahraga untuk membantunya merasa lebih baik.",
            ],
            "wrong_b" => [
                "ar" => "يسبب انسداد مجرى الهواء مما يؤدي إلى زيادة خطر الوفاة إذا لم يتم التدخل بشكل صحيح ، التصرف الصحيح هو التحقق من التنفس والاستجابة والاتصال بالخدمات الطبية الطارئة على الفور",
                "en" => "It causes airway obstruction which increases the risk of death if not properly intervened, the correct action is to check breathing and response and call emergency medical services immediately",
                "fr" => "Cela provoque une obstruction des voies respiratoires qui augmente le risque de décès en l'absence d'intervention appropriée. L'action correcte consiste à vérifier la respiration et la réponse et à appeler immédiatement les services médicaux d'urgence",
                "id" => "Hal ini menyebabkan penyumbatan saluran napas yang meningkatkan risiko kematian jika tidak ditangani dengan tepat, tindakan yang tepat adalah memeriksa pernapasan dan respons serta segera menghubungi layanan medis darurat",
            ],
            "answers_c" => [
                "ar" => "محاولة إيقاظ اللاعب عن طريق رش الماء على وجهه أو هزه بقوة",
                "en" => "Try to wake the runner by splashing water on his face or shaking him vigorously.",
                "fr" => "Essayez de réveiller le coureur en éclaboussant d'eau sur son visage ou en le secouant vigoureusement.",
                "id" => "Cobalah membangunkan pelari dengan menyiramkan air ke wajahnya atau menggoyangnya dengan kuat.",
            ],
            "wrong_c" => [
                "ar" => "يؤدي ذلك الى تضييع الوقت الذي يمكن أن ينقذ حياته مما قد يسبب تفاقم الحالة إذا كان القلب متوقفًا أو التنفس غير فعال ، التصرف الصحيح هو التحقق من التنفس والاستجابة والاتصال بالخدمات الطبية الطارئة على الفور",
                "en" => "This wastes time that could save his life and may cause the condition to worsen if the heart stops or breathing is ineffective. The correct action is to check breathing and response and call emergency medical services immediately",
                "fr" => "Cela représente une perte de temps qui pourrait lui sauver la vie et peut aggraver son état si le cœur s'arrête ou si la respiration est inefficace. La bonne mesure à prendre est de vérifier la respiration et la réaction du patient et d'appeler immédiatement les services médicaux d'urgence",
                "id" => "Hal ini membuang-buang waktu yang dapat menyelamatkan nyawanya dan dapat memperburuk kondisi jika jantung berhenti berdetak atau pernapasan tidak efektif. Tindakan yang tepat adalah memeriksa pernapasan dan respons serta segera menghubungi layanan medis darurat",
            ],
            "correct_answer" => "answer_a",
            "allowed_time" => "00:00:30",
            "appears_at" => "00:03:06",
            "wrong_answer_audio_urls" => [
                "ar" => [
                    'answer_a' => "",
                    'answer_b' => env("AMAN_API") . "vo/2/4/Arabic/b.mp3",
                    'answer_c' => env("AMAN_API") . "vo/2/4/Arabic/c.mp3",
                    'answer_d' => "",
                ],
                "en" => [
                    'answer_a' => "",
                    'answer_b' => env("AMAN_API") . "vo/2/4/English/b.mp3",
                    'answer_c' => env("AMAN_API") . "vo/2/4/English/c.mp3",
                    'answer_d' => "",
                ],
                "fr" => [
                    'answer_a' => "",
                    'answer_b' => env("AMAN_API") . "vo/2/4/French/b.mp3",
                    'answer_c' => env("AMAN_API") . "vo/2/4/French/c.mp3",
                    'answer_d' => "",
                ],
                "id" => [
                    'answer_a' => "",
                    'answer_b' => env("AMAN_API") . "vo/2/4/Indonesian/b.mp3",
                    'answer_c' => env("AMAN_API") . "vo/2/4/Indonesian/c.mp3",
                    'answer_d' => "",
                ],
            ],
        ],

    ],
    // Question::End =======================================
];
