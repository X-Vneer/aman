<?php

return [
    // Videos::Start =======================================
    'videos' => [
        //Video 1
        [
            "video_url" => [
                "ar" => "https://vz-3d93d703-c07.b-cdn.net/f67c1d5a-8898-4e03-9c97-306322c6bcb8/playlist.m3u8",
                "en" => "https://vz-3d93d703-c07.b-cdn.net/cb6f82cf-8f98-4ce5-970a-6636cf2fe96e/playlist.m3u8",
            ],
            "logo" => env("AMAN_API") . "img/videos/01.jpg",
            "certificate_url" => env("AMAN_API") . "storage/certificate/1/6ed879be539bab894d7ac2219477c11fb9dcf3aa.png",
            "price" => "20",
            "title" => [
                "ar" => "الحالات الصحية الطارئة",
                "en" => "Emergency Health Cases",
            ],

            "description" => [
                "ar" => "يوفر التدريب الأساسي على الاستجابة للحالات الصحية الطارئة في الحياة اليومية بما في ذلك اصابات النزيف، الاجهاد الحراري، انسداد مجرى التنفس، غيبوبة السكر وحالات ضغط الدم",
                "en" => "Provides basic training in responding to health emergency situations in everyday life, including bleeding injuries, heat stress, airway obstruction, diabetic coma, and blood pressure conditions.",
            ],

            "length" => "00:04:14"
        ],
        // Video2
        [
            "video_url" => [
                "ar" => "https://vz-46046c44-973.b-cdn.net/f0445983-3fee-4e04-81ca-b7133f78d839/playlist.m3u8",
                "en" => "https://vz-c23c20ef-869.b-cdn.net/41fa0cd3-81c8-4e7d-be82-98a82c026730/playlist.m3u8",
            ],
            "logo" => env("AMAN_API") . "img/videos/02.jpeg",
            "certificate_url" => env("AMAN_API") . "storage/certificate/2/9d79afeca165070486953dcc1c3074377d91bc28.png",
            "price" => "20",
            "title" => [
                "ar" => "الحالات الرياضية الطارئة",
                "en" => "Emergency Sports Cases",
            ],
            "description" => [
                "ar" => "يوفر التدريب الأساسي على الاستجابة للحالات الرياضية الطارئة في الحياة اليومية بما في ذلك الاصابات المؤدية الى ارتجاج الدماغ، بلع اللسان - ارتخاء عضلة اللسان ، توقف عضلة القلب والكسور",
                "en" => "Provides basic training on responding to sports emergency situations in everyday life, including injuries leading to brain concussion, tongue swallowing - tongue muscle relaxation, cardiac arrest, and fractures.",
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
            ],
            "description" => [
                "ar" => "هو برنامج توعوي تدريبي تفاعلي للتثقيف والتوعية حول الإصابات الصحية والرياضية الطارئة والطرق السليمة للتعامل معها.",
                "en" => "It is an interactive awareness training program to educate and raise awareness about emergency health and sports injuries and the proper ways to deal with them.",
            ]
        ],
        [
            "title" => [
                "ar" => "من هم الفئات المستهدفة",
                "en" => "Who are the target categories?",
            ],
            "description" => [
                "ar" => "البرنامج موجه لجميع أفراد المجتمع بدءا من العمر 8 سنوات.",
                "en" => "The program is directed to all members of society starting from the age of 8 years.",
            ]
        ],
        [
            "title" => [
                "ar" => "هل هناك أي متطلبات للتسجيل ؟",
                "en" => "Are there any registration requirements?",
            ],
            "description" => [
                "ar" => "لا ، ليس هناك أي متطلبات.",
                "en" => "No, there are no requirements.",
            ]
        ],
        [
            "title" => [
                "ar" => "كيف يمكنني التسجيل ؟",
                "en" => "How can I register?",
            ],
            "description" => [
                "ar" => "في البداية القيام بأنشاء حساب في البوابة (التسجيل) ومن ثم اكمال التقدم و إختيار المسار ( الصحي / الرياضي ) واكمال عملية الدفع الالكتروني أو إستخدام كود الخصم.",
                "en" => "Firstly, create an account in the portal (registration), then complete the application, choose the path (health/sports), and complete the electronic payment process or use a discount code.",
            ]
        ],
        [
            "title" => [
                "ar" => "كيف يمكنني الحصول على شهادة الحضور؟",
                "en" => "How can I get a certificate of attendance?",
            ],
            "description" => [
                "ar" => "عن طريق الدخول الى أيقونة الملف الشخصي ثم الانتقال الى قائمة الشهادات.",
                "en" => "By accessing the My Profile icon and then navigating to the Certificates menu.",
            ]
        ],
        [
            "title" => [
                "ar" => "ماهي طريقة حضور البرنامج؟",
                "en" => "How can I attend the program?",
            ],
            "description" => [
                "ar" => "عن بعد و تفاعلي عبر الأجهزة الذكية والحاسب.",
                "en" => "Remote and interactive via smart devices and computers.",
            ]
        ],
        [
            "title" => [
                "ar" => "هل بإمكان الجهات والمنشأت العامة والخاصة طلب البرنامج لمنسوبيها ؟",
                "en" => "Can public and private entities request the program for their employees?",
            ],
            "description" => [
                "ar" => "نعم ، وذلك عبر تقديم طلب عبر البريد الالكتروني : info@inaash.edu.sa",
                "en" => "Yes, by submitting a request via email: info@inaash.edu.sa",
            ]
        ],
        [
            "title" => [
                "ar" => "في حالة حاجتي للمساعدة كيف يمكنني التواصل؟",
                "en" => "If I need help, how can I get in touch?",
            ],
            "description" => [
                "ar" => "بإمكانك التواصل مباشرة معنا عن طريق اتصل بنا من الموقع أو عبر البريد الالكتروني ",
                "en" => "You can contact us directly through the contact us link on the website or via email: info@inaash.edu.sa",
            ]
        ],
        [
            "title" => [
                "ar" => "ماهي طريقة الرسوم ؟",
                "en" => "What is the method of payment?",
            ],
            "description" => [
                "ar" => "طريقة دفع تكاليف المشاركة تتم عبر الدفع الإلكتروني أو استخدام أكواد الخصم.",
                "en" => "Payment of fees can be made via online payment or by using a discount code.",
            ]
        ],
        [
            "title" => [
                "ar" => "هل يمكنني إكمال البرنامج إذا انقطع في أي وقت بسبب مشاكل تقنية أو انقطاع الإنترنت؟",
                "en" => "Can I complete the program if interrupted due to technical issues?",
            ],
            "description" => [
                "ar" => "نعم يمكنك إكمال البرنامج من أخر مرحلة تم الوصول إليها مع ملاحظة: إنه في حال تغيير مسار البرنامج  يستوجب دفع الرسوم مرة اخرى.",
                "en" => "Yes, you can complete the program at the last stage reached. Note: If you change the course of the program, you will have to pay the fee again.",
            ]
        ],
        [
            "title" => [
                "ar" => "ماهي الشهادة المقدمة؟",
                "en" => "What is the certificate provided?",
            ],
            "description" => [
                "ar" => "1- برنامج التوعية التفاعلي للحالات الصحية الطارئة الرياضية\n2- برنامج التوعية التفاعلي للحالات الصحية الطارئة",
                "en" => "1- Sports Emergencies Interactive Awareness Program\n2- Health Emergencies Interactive Awareness Program",
            ]
        ],
        [
            "title" => [
                "ar" => "متى يمكنني الحصول على الشهادة؟",
                "en" => "When can I get the certificate?",
            ],
            "description" => [
                "ar" => "تظهر الشهادة تلقائياً بعد إكمال مسار البرنامج واستكمال نموذج التقييم وسيتم إرسال نسخة إلكترونية عبر البريد الإلكتروني.",
                "en" => "The certificate appears automatically after completing the program track, completing the evaluation form, and an electronic copy will be sent via email.",
            ]
        ],
        [
            "title" => [
                "ar" => "هل يمكنني التحقق من الشهادة؟",
                "en" => "How can I check the certificate verification?",
            ],
            "description" => [
                "ar" => "نعم ، من خلال رابط التحقق من الشهادة على الموقع أو من خلال الباركود الموجود على الشهادة.",
                "en" => "Yes, through the certificate verification link on the website or through the barcode on the certificate.",
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
            ],
            "answers_a" => [
                "ar" => "نقل المعتمر إلى مكان مظلل وترطيب الجلد بماء بارد",
                "en" => "Move the pilgrim to a shaded area and cool his skin with cold water.",
            ],
            "wrong_a" => [
                "ar" => "",
                "en" => "",
            ],
            "answers_b" => [
                "ar" => "رش ماء بارد جدًا أو ثلج مباشرة على جسد المعتمر لتبريده بسرعة",
                "en" => "Spray very cold water or ice directly on the pilgrim’s body to cool him quickly.",
            ],
            "wrong_b" => [
                "ar" => "تقليل كفاءة الجسم في التخلص من الحرارة يؤدي الى ارتفاع خطر الإصابة بصدمة حرارية أو تقلص العضلات الخيار الصحيح هو نقل المعتمر الى مكان مظلل وترطيب الجلد بماء بارد",
                "en" => "Reduced efficiency of the body in dissipating heat increases the risk of heat shock or muscle cramps. The correct option is to move the pilgrim to a shaded area and cool his skin with cold water.",
            ],
            "answers_c" => [
                "ar" => "ترك المعتمر في الشمس ومحاولة تقديم مشروب دافئ لتحفيز تعرقه",
                "en" => "Leave the pilgrim in the sun and try to give him a warm drink to induce sweating.",
            ],
            "wrong_c" => [
                "ar" => "زيادة ارتفاع درجة حرارة الجسم قد تسبب الدخول في مرحلة خطيرة من ضربة الشمس قد تؤدي إلى فقدان الوعي أو الوفاة الخيار الصحيح هو نقل المعتمر الى مكان مظلل وترطيب الجلد بماء بارد",
                "en" => "Increased body temperature can lead to a critical stage of sunstroke that may result in loss of consciousness or death. The correct option is to move the pilgrim to a shaded area and cool his skin with cold water.",
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
            ],
        ],
        [
            "video_id" => 1,
            "question" => [
                "ar" => "الطفل ينزف من الرأس. ماذا ستفعل؟",
                "en" => "The child is bleeding from the head. What would you do?",
            ],
            "answers_a" => [
                "ar" => "الضغط المباشر على الجرح بإستخدام قطعة قماش نظيفة.",
                "en" => "Apply direct pressure to the wound using a clean cloth.",
            ],
            "wrong_a" => [
                "ar" => "",
                "en" => "",
            ],
            "answers_b" => [
                "ar" => "غسل الجرح بقوة مع محاولة إزالة الأوساخ باستخدام الأصابع",
                "en" => "Wash the wound vigorously, trying to remove dirt with fingers.",
            ],
            "wrong_b" => [
                "ar" => "سيتسبب ذلك بزيادة خطر العدوى والالتهابات العميقة، مما قد يتطلب تدخلًا طبيًا أكبر لاحقًا؛ الخيار الصحيح هو الضغط المباشر على الجرح بإستخدام قطعة قماش نظيفة",
                "en" => "This will increase the risk of infection and deep tissue damage, which may require more extensive medical intervention later. The correct option is to apply direct pressure to the wound using a clean cloth.",
            ],
            "answers_c" => [
                "ar" => "ترك الجرح مكشوفًا حتى يتوقف النزيف من تلقاء نفسه",
                "en" => "Leave the wound exposed to let the bleeding stop on its own.",
            ],
            "wrong_c" => [
                "ar" => "خيار خاطئ سيتسبب بفقدان كمية كبيرة من الدم، مما قد يؤدي إلى الصدمة أو حتى فقدان الوعي الخيار الصحيح هو الضغط المباشر على الجرح بإستخدام قطعة قماش نظيفة",
                "en" => "Wrong choice. This could lead to significant blood loss, potentially causing shock or even loss of consciousness. The correct option is to apply direct pressure to the wound using a clean cloth.",
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
            ],
        ],
        [
            "video_id" => 1,
            "question" => [
                "ar" => "الطفل يختنق. ماذا ستفعل؟",
                "en" => "The child is choking. What will you do?",
            ],
            "answers_a" => [
                "ar" => "مراقبة تنفس الطفل و تشجيعه على السعال",
                "en" => "Monitor the child's breathing and encourage him to cough.",
            ],
            "wrong_a" => [
                "ar" => "",
                "en" => "",
            ],
            "answers_b" => [
                "ar" => "ضرب ظهر الطفل بقوة أثناء وقوفه لإخراج العملة",
                "en" => "Hit the child's back forcefully while he is standing to dislodge the coin.",
            ],
            "wrong_b" => [
                "ar" => "زيادة احتمالية بقاء العملة في المجرى الهوائي، مما يتطلب تدخلاً طبيًا طارئًا، الخيار الصحيح هو مراقبة الطفل وتشجيعه على السعال",
                "en" => "Increases the likelihood of the coin becoming lodged in the airway, requiring emergency medical intervention. The correct option is to monitor the child and encourage him to cough.",
            ],
            "answers_c" => [
                "ar" => "محاولة إدخال الأصابع في فم الطفل لإزالة العملة",
                "en" => "Try to put your fingers in the child's mouth to remove the coin.",
            ],
            "wrong_c" => [
                "ar" => "دفع العملة المعدنية إلى مجرى الهواء بشكل أعمق، مما يؤدي إلى انسداد كامل وخطر الاختناق، الخيار الصحيح هو مراقبة الطفل وتشجيعه على السعال",
                "en" => "Pushing the coin deeper into the airway leads to complete blockage and choking risk. The correct option is to monitor the child and encourage him to cough.",
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
            ],
        ],
        [
            "video_id" => 1,
            "question" => [
                "ar" => "زميل العمل يعاني من علامات الدوخة والارتباك وفقدان الوعي ويبدو انه يعاني من غيبوبة السكر نتيجة انخفاض السكر ماذا ستفعل؟",
                "en" => "A coworker is experiencing signs of dizziness, confusion, and loss of consciousness. He appears to be in a diabetic coma due to low blood sugar What would you do?",
            ],
            "answers_a" => [
                "ar" => "تأكد من التنفس ونبضات القلب المنتظمة الى جانب اعطاء الشخص المصاب محلولا سكريا",
                "en" => "Make sure the breathing and heartbeat are regular and give the injured person a sugar solution",
            ],
            "wrong_a" => [
                "ar" => "",
                "en" => "",
            ],
            "answers_b" => [
                "ar" => "تركه دون مراقبة والانتظار حتى يستعيد وعيه بمفرده",
                "en" => "Leave him unattended and wait for him to regain consciousness on his own",
            ],
            "wrong_b" => [
                "ar" => "قد يفقد الشخص المصاب فرصة تلقي الاسعافات الاولية بالوقت المناسب مما يؤدي الى تفاقم الحالة او الوفاة، الاجراء الصحيح نتيجة انخفاض السكر هو التأكد من انتظام التنفس ونبض القلب الى جانب اعطاء الشخص المصاب محلولا سكريا",
                "en" => "The affected person may lose the opportunity to receive first aid in a timely manner, which could lead to worsening of the condition or even death. The correct procedure in case of low blood sugar is to ensure regular breathing and heartbeat, along with administering a sugar solution to the affected person",
            ],
            "answers_c" => [
                "ar" => "محاولة إجباره على الجلوس أو الوقوف فورًا لمساعدته على استعادة وعيه",
                "en" => "Attempt to force him to sit or stand immediately to help him regain consciousness.",
            ],
            "wrong_c" => [
                "ar" => "قد يتسبب ذلك في انخفاض تدفق الدم الى الدماغ مما يزيد من خطر السقوط والتعرض لمزيد من الاصابات، الاجراء الصحيح نتيجة انخفاض السكر هو التأكد من انتظام التنفس ونبض القلب الى جانب اعطاء الشخص المصاب محلولا سكريا",
                "en" => "This may lead to reduced blood flow to the brain, increasing the risk of falls and further injuries. The correct procedure in case of low blood sugar is to ensure regular breathing and heartbeat, along with administering a sugar solution to the affected person",
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
            ],
        ],
        [
            "video_id" => 1,
            "question" => [
                "ar" => "يبدو انه يعاني من صداع شديد وزيادة في ضربات القلب، ماذا ستفعل؟",
                "en" => "He seems to be suffering from a severe headache and increased heart rate. What will you do?",
            ],
            "answers_a" => [
                "ar" => "مساعدته للانتقال الى مكان هادئ وقياس ضغط الدم",
                "en" => "Help him move to a quiet place and measure his blood pressure.",
            ],
            "wrong_a" => [
                "ar" => "",
                "en" => "",
            ],
            "answers_b" => [
                "ar" => "تشجيعه على تناول مشروبات تحتوي على الكافيين لتخفيف الصداع",
                "en" => "Encourage him to drink caffeinated beverages to relieve his headache.",
            ],
            "wrong_b" => [
                "ar" => "سيسبب تفاقم تسارع ضربات القلب مما يؤدي الى زيادة خطر حدوث مضاعفات خطيرة مثل السكتة الدماغية أو النوبة القلبية التصرف الصحيح هو نقله الى مكان هادئ وقياس ضغط الدم",
                "en" => "This will worsen the rapid heart rate, increasing the risk of serious complications such as a stroke or heart attack. The correct action is to move him to a quiet place and measure his blood pressure.",
            ],
            "answers_c" => [
                "ar" => "إجباره على الاستلقاء بشكل مسطح على ظهره",
                "en" => "Force him to lie flat on his back.",
            ],
            "wrong_c" => [
                "ar" => "ذلك قد يسبب زيادة ضغط الدم في الرأس، مما يزيد من حدة الأعراض مثل الصداع وعدم الراحة الخيار والتصرف الصحيح هو مساعدته للانتقال الى مكان هادئ وقياس ضغط الدم",
                "en" => "This could increase blood pressure in the head, worsening symptoms like headache and discomfort. The correct action is to help him move to a quiet place and measure his blood pressure.",
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
            ],
        ],


        // Second Video
        [
            "video_id" => 2,
            "question" => [
                "ar" => "قد يكون اللاعب مصابًا بارتجاج في المخ. ماذا ستفعل؟",
                "en" => "The player may have a concussion. What will you do?",
            ],
            "answers_a" => [
                "ar" => "التحقق من استجابة وتنفس اللاعب دون تحريكه والاتصال بالخدمات الطبية الطارئة",
                "en" => "Check the player's responsiveness and breathing without moving him and call emergency medical services",
            ],
            "wrong_a" => [
                "ar" => "",
                "en" => "",
            ],
            "answers_b" => [
                "ar" => "رش الماء على وجه اللاعب لمحاولة إيقاظه بسرعة",
                "en" => "Splash water on the player's face to try to wake him quickly.",
            ],
            "wrong_b" => [
                "ar" => "رش الماء على وجه المصاب لا يعالج السبب الأساسي للإصابة، ويمكن ان يسبب تأخير الحصول على المساعدة الطبية اللازمه وتفاقم الأعراض أو حدوث تلف، التصرف الصحيح هو التحقق من استجابة وتنفس اللاعب دون تحريكه والاتصال بالخدمات الطبية الطارئة",
                "en" => "Spraying water on the injured person’s face does not treat the underlying cause of the injury, and may cause delay in obtaining the necessary medical assistance, worsen symptoms, or cause damage. The correct action is to check the player’s response and breathing without moving him and call emergency medical services",
            ],
            "answers_c" => [
                "ar" => "تحريك اللاعب ووضعه في وضعية الجلوس لإيقاظه",
                "en" => "Move the player and sit him up to wake him.",
            ],
            "wrong_c" => [
                "ar" => "تحريك الشخص المصاب باصابة في الرأس قد يؤدي الى تفاقم اي اصابة في العمود الفقري او الدماغ او حدوث تلف دائم بالاعصاب مما يزيد من خطورة الحالة، التصرف الصحيح هو التحقق من استجابة وتنفس اللاعب دون تحريكه والاتصال بالخدمات الطبية الطارئة",
                "en" => "Moving a person with a head injury may aggravate any injury to the spine or brain, or cause permanent nerve damage, which increases the seriousness of the condition. The correct action is to check the player’s response and breathing without moving him and call emergency medical services",
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
            ],
        ],
        [
            "video_id" => 2,
            "question" => [
                "ar" => "قد يكون لدى العداء ركبة مكسورة. ماذا ستفعل؟",
                "en" => "The runner may have a broken knee. What will you do?",
            ],
            "answers_a" => [
                "ar" => "تثبيت الركبة وطلب المساعدة من الخدمات الطبية الطارئة",
                "en" => "Stabilize the knee and call for service medical emergency",
            ],
            "wrong_a" => [
                "ar" => "",
                "en" => "",
            ],

            "answers_b" => [
                "ar" => "تشجيع العداء على الوقوف ومحاولة المشي لتحريك الركبة وتخفيف الألم",
                "en" => "Encourage the runner to stand and try to walk to move the knee and alleviate the pain.",
            ],
            "wrong_b" => [
                "ar" => "سيسبب ذلك تفاقم الإصابة وتطور الكسر ليصبح غير مستقر، مما قد يتطلب تدخلًا جراحيًا أكثر تعقيدًا التصرف الصحيح هو تثبيت الركبة وطلب المساعدة من الخدمات الطبية الطارئة",
                "en" => "This will exacerbate the injury and cause the fracture to become unstable, potentially requiring more complex surgical intervention. The correct course of action is to stabilize the knee and seek assistance from emergency medical services",
            ],
            "answers_c" => [
                "ar" => "محاولة تحريك الركبة بلطف لمعرفة مدى شدة الإصابة",
                "en" => "Try to move the knee gently to see how severe the injury is",
            ],
            "wrong_c" => [
                "ar" => "سيتسبب في زيادة حدة الكسر وتمزق الأنسجة أو الأربطة المحيطة بالركبة مما يؤدي إلى مضاعفات خطيرة التصرف الصحيح هو تثبيت الركبة وطلب المساعدة من الخدمات الطبية الطارئة",
                "en" => "It will increase the severity of the fracture and cause tearing of the tissues or ligaments surrounding the knee, leading to serious complications. The correct course of action is to stabilize the knee and seek assistance from emergency medical services",
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
            ],
        ],
        [
            "video_id" => 2,
            "question" => [
                "ar" => "يبدو ان اللاعب تعرض لاصابة بلع اللسان (ارتخاء عضلة اللسان) ماذا ستفعل؟",
                "en" => "It seems the player is experiencing a tongue swallowing (tongue muscle relaxation) injury. What will you do?",
            ],
            "answers_a" => [
                "ar" => "تثبيت رأس المصاب جيدا ورفع الفك",
                "en" => "Stabilize the injured person’s head and lift the jaw.",
            ],
            "wrong_a" => [
                "ar" => "",
                "en" => "",
            ],
            "answers_b" => [
                "ar" => "محاولة إجبار اللاعب على الجلوس أو الوقوف لاستعادة التنفس",
                "en" => "Try to force the player to sit or stand to regain breathing.",
            ],
            "wrong_b" => [
                "ar" => "تحريك الشخص المصاب دون معالجة انسداد مجرى الهواء قد يؤدي إلى تفاقم الحالة، خاصة إذا كان فاقدًا للوعي مما قد يسبب فقدان كامل للتنفس و توقف القلب التصرف الصحيح هو تثبيت رأس المصاب جيدا ورفع الفك",
                "en" => "Moving the injured person without addressing the airway obstruction may worsen the condition, especially if he is unconscious, leading to complete loss of breathing and cardiac arrest. The correct action is to stabilize the injured person's head and lift the jaw",
            ],
            "answers_c" => [
                "ar" => "محاولة سحب اللسان بقوة باستخدام أي أداة قريبة مثل ملعقة أو قلم",
                "en" => "Try to pull the tongue forcefully using any nearby tool, such as a spoon or pen.",
            ],
            "wrong_c" => [
                "ar" => "قد يسبب إحداث إصابة في الفم أو الحلق بسبب استخدام الأدوات الغير مخصصة او يسبب زيادة خطر انسداد مجرى الهواء بشكل كامل بسبب دفع اللسان أو الأداة بشكل غير مقصود ، التصرف الصحيح هو تثبيت رأس المصاب جيدا ورفع الفك",
                "en" => "This may cause injury to the mouth or throat due to the use of inappropriate tools, or increase the risk of completely obstructing the airway by inadvertently pushing the tongue or tool. The correct action is to stabilize the injured person’s head and lift the jaw",
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
            ],
        ],
        [
            "video_id" => 2,
            "question" => [
                "ar" => "العداء يشعر بألم في الصدر وسيفقد الوعي. ماذا ستفعل؟",
                "en" => "The runner is experiencing chest pain and will lose consciousness. What will you do?",
            ],
            "answers_a" => [
                "ar" => "التحقق من تنفس واستجابة اللاعب وطلب المساعدة من الخدمات الطبية الطارئة",
                "en" => "Check the player's breathing and responsiveness and seek help from emergency medical services",
            ],
            "wrong_a" => [
                "ar" => "",
                "en" => "",
            ],
            "answers_b" => [
                "ar" => "إعطاؤه الماء أو مشروب رياضي لمساعدته على الشعور بالتحسن",
                "en" => "Give him water or a sports drink to help him feel better.",
            ],
            "wrong_b" => [
                "ar" => "يسبب انسداد مجرى الهواء مما يؤدي إلى زيادة خطر الوفاة إذا لم يتم التدخل بشكل صحيح ، التصرف الصحيح هو التحقق من التنفس والاستجابة والاتصال بالخدمات الطبية الطارئة على الفور",
                "en" => "It causes airway obstruction which increases the risk of death if not properly intervened, the correct action is to check breathing and response and call emergency medical services immediately",
            ],
            "answers_c" => [
                "ar" => "محاولة إيقاظ اللاعب عن طريق رش الماء على وجهه أو هزه بقوة",
                "en" => "Try to wake the runner by splashing water on his face or shaking him vigorously.",
            ],
            "wrong_c" => [
                "ar" => "يؤدي ذلك الى تضييع الوقت الذي يمكن أن ينقذ حياته مما قد يسبب تفاقم الحالة إذا كان القلب متوقفًا أو التنفس غير فعال ، التصرف الصحيح هو التحقق من التنفس والاستجابة والاتصال بالخدمات الطبية الطارئة على الفور",
                "en" => "This wastes time that could save his life and may cause the condition to worsen if the heart stops or breathing is ineffective. The correct action is to check breathing and response and call emergency medical services immediately",
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
            ],
        ],

    ],
    // Question::End =======================================
];
