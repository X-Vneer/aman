<?php

namespace Database\Seeders;

use App\Models\Blog;
use App\Models\Faq;
use App\Models\Story;
use App\Models\Tawia;
use App\Models\Video;
use Illuminate\Database\Seeder;

/**
 * Seeds the child-safety content set (FAQs, awareness guide, sample stories, blog posts).
 *
 * Idempotent: rows are matched on their Arabic title and updated in place, so the
 * seeder can be re-run after content tweaks without creating duplicates.
 */
class ChildSafetyContentSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedFaqs();
        $this->seedAwareness();
        $this->seedStories();
        $this->seedBlogs();
    }

    private function seedFaqs(): void
    {
        $faqs = [
            [
                'ar' => ['ما هي منصة أمان؟', 'أمان هي منصة تعليمية تفاعلية تساعد الأطفال على تعلّم مهارات السلامة والتصرّف الصحيح والإسعافات الأولية البسيطة من خلال قصص وفيديوهات وأنشطة تفاعلية.'],
                'en' => ['What is Aman?', 'Aman is an interactive learning platform that helps children learn safety skills, correct behavior, and simple first aid through stories, videos, and interactive activities.'],
            ],
            [
                'ar' => ['من يمكنه استخدام منصة أمان؟', 'تم تصميم المنصة للأطفال من عمر 7 إلى 15 سنة، كما يمكن للمعلمين وأولياء الأمور استخدامها لمساعدة الأطفال على التعلّم بطريقة آمنة ومبسطة.'],
                'en' => ['Who can use Aman?', 'The platform is designed for children aged 7 to 15. Teachers and parents can also use it to help children learn in a safe and simple way.'],
            ],
            [
                'ar' => ['هل استخدام المنصة مجاني؟', 'نعم، يمكن للأطفال الوصول إلى المحتوى التعليمي والاستفادة من البرامج التفاعلية بسهولة.'],
                'en' => ['Is the platform free?', 'Yes. Children can access the educational content and use the interactive programs freely.'],
            ],
            [
                'ar' => ['ماذا سأتعلّم في أمان؟', 'ستتعلّم كيفية التصرّف بأمان في المواقف المختلفة، بالإضافة إلى خطوات بسيطة للإسعافات الأولية وكيفية حماية نفسك ومساعدة الآخرين بطريقة صحيحة.'],
                'en' => ['What will I learn on Aman?', 'You will learn how to act safely in different situations, plus simple first aid steps and how to protect yourself and help others the right way.'],
            ],
            [
                'ar' => ['هل المحتوى مناسب للأطفال؟', 'نعم، تم تصميم جميع الأنشطة والمحتويات بلغة بسيطة وأسلوب مناسب للأطفال مع مراعاة الأمان والوضوح وسهولة الاستخدام.'],
                'en' => ['Is the content suitable for children?', 'Yes. All activities and content use simple language and a child-friendly style, with safety, clarity, and ease of use in mind.'],
            ],
            [
                'ar' => ['هل يمكنني الحصول على شهادة؟', 'نعم، يمكن للأطفال الحصول على شهادة تشجيعية بعد إكمال بعض البرامج التعليمية والأنشطة التفاعلية.'],
                'en' => ['Can I get a certificate?', 'Yes. Children receive an encouragement certificate after completing certain educational programs and interactive activities.'],
            ],
            [
                'ar' => ['كيف تساعدني القصص التفاعلية؟', 'تساعد القصص التفاعلية الأطفال على التعلّم من خلال المواقف والأسئلة المباشرة، مما يجعل الفهم أسهل وأكثر متعة.'],
                'en' => ['How do interactive stories help me?', 'Interactive stories help children learn through real situations and direct questions, which makes understanding easier and more fun.'],
            ],
            [
                'ar' => ['هل يمكنني مشاركة قصتي أو تجربتي؟', 'نعم، يمكن للأطفال مشاركة قصص أو تجارب بسيطة تتعلق بالسلامة والتعلّم، ويتم مراجعة جميع المشاركات للحفاظ على الأمان والخصوصية.'],
                'en' => ['Can I share my story or experience?', 'Yes. Children can share simple stories or experiences about safety and learning. Every submission is reviewed to protect safety and privacy.'],
            ],
            [
                'ar' => ['هل المنصة آمنة للأطفال؟', 'نعم، تم تصميم أمان لتوفير بيئة آمنة للأطفال من خلال حماية الخصوصية ومراجعة المحتوى والمشاركات قبل نشرها.'],
                'en' => ['Is the platform safe for children?', 'Yes. Aman is built to be a safe environment for children by protecting privacy and reviewing all content and submissions before publication.'],
            ],
        ];

        foreach ($faqs as $faq) {
            $existing = Faq::withTrashed()->get()->first(
                fn (Faq $item) => $item->getTranslation('title', 'ar', false) === $faq['ar'][0]
            );

            $payload = [
                'title' => ['ar' => $faq['ar'][0], 'en' => $faq['en'][0]],
                'description' => ['ar' => $faq['ar'][1], 'en' => $faq['en'][1]],
            ];

            if ($existing) {
                $existing->update($payload);
            } else {
                Faq::create($payload);
            }
        }

        $this->command?->info('FAQs seeded: '.count($faqs));
    }

    private function seedAwareness(): void
    {
        $groups = [
            [
                'keywords' => ['مشبوه', 'أجسام', 'suspicious', 'explosive'],
                'fallback_index' => 0,
                'sections' => [
                    [
                        'title' => ['ar' => 'ما هي الأجسام المشبوهة؟', 'en' => 'What are suspicious objects?'],
                        'description' => [
                            'ar' => 'قد تبقى بعض مخلفات الحرب أو الأجسام غير المعروفة في الطرقات أو الحدائق أو المباني بعد انتهاء الأحداث. قد تبدو هذه الأجسام غير خطرة، لكنها قد تسبب إصابات خطيرة إذا تم لمسها أو الاقتراب منها. لذلك، من المهم أن يتعلم الأطفال كيفية التصرف بطريقة آمنة لحماية أنفسهم والآخرين.',
                            'en' => 'Remnants of war or unknown objects can be left behind in streets, parks, or buildings after events end. They may look harmless, but they can cause serious injuries if touched or approached. That is why children need to learn how to act safely to protect themselves and others.',
                        ],
                        'symptoms' => [
                            'ar' => ['صندوق أو حقيبة مجهولة', 'جسم معدني أو أسطوانة', 'علبة أو لعبة غير مألوفة', 'جسم مدفون جزئيًا في الأرض', 'أي جسم متضرر أو متروك في مكان غير معتاد'],
                            'en' => ['An unknown box or bag', 'A metal object or cylinder', 'An unfamiliar can or toy', 'An object partly buried in the ground', 'Any damaged or abandoned object in an unusual place'],
                        ],
                    ],
                    [
                        'title' => ['ar' => 'ماذا أفعل إذا رأيت جسمًا مشبوهًا؟', 'en' => 'What should I do if I see a suspicious object?'],
                        'description' => [
                            'ar' => 'التصرف الصحيح في اللحظات الأولى هو ما يحميك ويحمي من حولك. تذكّر هذه الخطوات جيدًا.',
                            'en' => 'Acting correctly in the first moments is what keeps you and the people around you safe. Remember these steps well.',
                        ],
                        'symptoms' => [
                            'ar' => ['ابتعد عن المكان فورًا', 'لا تلمس الجسم أو تحاول تحريكه', 'لا تقترب لالتقاط صورة أو اللعب بالقرب منه', 'أخبر أحد الوالدين أو شخصًا بالغًا تثق به فورًا', 'إذا كان المكان معروفًا، ابتعد عنه وحذر الآخرين من الاقتراب'],
                            'en' => ['Move away from the area immediately', 'Do not touch the object or try to move it', 'Do not go closer to take a photo or play near it', 'Tell a parent or a trusted adult right away', 'If you know the spot, stay away and warn others not to approach'],
                        ],
                    ],
                    [
                        'title' => ['ar' => 'أماكن يجب الحذر فيها', 'en' => 'Places to be careful in'],
                        'description' => [
                            'ar' => 'بعض الأماكن تحتاج انتباهًا أكبر، خاصة قبل أن تفحصها الجهات المختصة.',
                            'en' => 'Some places need extra caution, especially before the relevant authorities have checked them.',
                        ],
                        'symptoms' => [
                            'ar' => ['المناطق المتضررة من الحرب', 'المباني المهدمة', 'الأراضي الفارغة', 'بين الأنقاض', 'الأماكن التي لم تُفحص بعد من الجهات المختصة'],
                            'en' => ['Areas damaged by war', 'Collapsed buildings', 'Empty land', 'Among rubble', 'Places not yet cleared by the relevant authorities'],
                        ],
                    ],
                    [
                        'title' => ['ar' => 'ماذا يجب أن أتجنب؟', 'en' => 'What should I avoid?'],
                        'description' => [
                            'ar' => 'هذه التصرفات خطيرة جدًا، ولا يجب القيام بها مهما كان الفضول كبيرًا.',
                            'en' => 'These actions are very dangerous and should never be done, no matter how curious you are.',
                        ],
                        'symptoms' => [
                            'ar' => ['لمس الجسم', 'رميه بالحجارة', 'فتحه أو العبث به', 'حمله إلى المنزل', 'الاقتراب منه بدافع الفضول'],
                            'en' => ['Touching the object', 'Throwing stones at it', 'Opening it or tampering with it', 'Carrying it home', 'Going closer out of curiosity'],
                        ],
                    ],
                    [
                        'title' => ['ar' => 'هل تعلم؟ ورسالة أمان', 'en' => 'Did you know? A safety message'],
                        'description' => [
                            'ar' => 'قد تبدو بعض مخلفات الحرب كأنها ألعاب أو علب أو قطع معدنية عادية، لكنها قد تكون خطرة جدًا. لذلك فإن أفضل وسيلة لحماية نفسك هي عدم لمس أي جسم مجهول وإبلاغ شخص بالغ فورًا.',
                            'en' => 'Some remnants of war can look like toys, cans, or ordinary pieces of metal, yet they can be extremely dangerous. The best way to protect yourself is to never touch an unknown object and to tell an adult immediately.',
                        ],
                        'symptoms' => [
                            'ar' => ['سلامتك أهم من فضولك', 'إذا رأيت جسمًا غريبًا، ابتعد', 'لا تلمسه', 'أخبر شخصًا بالغًا'],
                            'en' => ['Your safety matters more than your curiosity', 'If you see a strange object, move away', 'Do not touch it', 'Tell an adult'],
                        ],
                    ],
                ],
            ],
            [
                'keywords' => ['راحة', 'خوف', 'نفسي', 'uncomfortable', 'afraid', 'feel'],
                'fallback_index' => 1,
                'sections' => [
                    [
                        'title' => ['ar' => 'متى أشعر بعدم الراحة؟', 'en' => 'When do I feel uncomfortable?'],
                        'description' => [
                            'ar' => 'قد يمر الأطفال بمواقف تجعلهم يشعرون بالخوف، أو القلق، أو عدم الارتياح، سواء بسبب موقف حدث لهم أو بسبب تصرف شخص ما. من المهم أن يعرف كل طفل أن مشاعره مهمة، وأن طلب المساعدة من شخص بالغ يثق به هو تصرف شجاع وصحيح.',
                            'en' => 'Children may go through situations that make them feel afraid, anxious, or uneasy, whether because of something that happened to them or because of someone\'s behavior. Every child should know that their feelings matter, and that asking a trusted adult for help is a brave and right thing to do.',
                        ],
                        'symptoms' => [
                            'ar' => ['يتحدث معك شخص بطريقة تخيفك', 'يطلب منك أحد القيام بشيء لا تريده', 'يحاول شخص لمس جسدك بطريقة غير مناسبة', 'يجعلك شخص تشعر بالخوف أو الحزن', 'يطلب منك الاحتفاظ بسر يجعلك تشعر بالقلق'],
                            'en' => ['Someone talks to you in a way that frightens you', 'Someone asks you to do something you do not want to do', 'Someone tries to touch your body inappropriately', 'Someone makes you feel scared or sad', 'Someone asks you to keep a secret that worries you'],
                        ],
                    ],
                    [
                        'title' => ['ar' => 'ماذا أفعل إذا شعرت بعدم الراحة؟', 'en' => 'What do I do if I feel uncomfortable?'],
                        'description' => [
                            'ar' => 'مشاعرك إشارة مهمة، وهذه الخطوات تساعدك على البقاء بأمان.',
                            'en' => 'Your feelings are an important signal, and these steps help you stay safe.',
                        ],
                        'symptoms' => [
                            'ar' => ['ابتعد عن المكان إذا استطعت', 'أخبر شخصًا بالغًا تثق به', 'تحدث عن مشاعرك ولا تحتفظ بها لنفسك', 'إذا لم يساعدك الشخص الأول، أخبر شخصًا بالغًا آخر'],
                            'en' => ['Move away from the place if you can', 'Tell a trusted adult', 'Talk about your feelings instead of keeping them inside', 'If the first person does not help, tell another adult'],
                        ],
                    ],
                    [
                        'title' => ['ar' => 'من هو الشخص الموثوق؟', 'en' => 'Who is a trusted person?'],
                        'description' => [
                            'ar' => 'الشخص الموثوق هو من تعرف أنه يهتم بسلامتك ويستمع إليك.',
                            'en' => 'A trusted person is someone you know cares about your safety and listens to you.',
                        ],
                        'symptoms' => [
                            'ar' => ['الأم أو الأب', 'أحد أفراد العائلة', 'المعلم أو المعلمة', 'المرشد التربوي', 'أي شخص بالغ تعرف أنه يهتم بسلامتك'],
                            'en' => ['Your mother or father', 'A family member', 'A teacher', 'A school counselor', 'Any adult you know cares about your safety'],
                        ],
                    ],
                    [
                        'title' => ['ar' => 'تذكر ورسالة أمان', 'en' => 'Remember: a safety message'],
                        'description' => [
                            'ar' => 'مشاعرك مهمة... وإذا شعرت بعدم الارتياح، تحدث مع شخص تثق به.',
                            'en' => 'Your feelings matter. If you feel uneasy, talk to someone you trust.',
                        ],
                        'symptoms' => [
                            'ar' => ['لا تشعر بالخجل من طلب المساعدة', 'ليس عليك مواجهة الموقف وحدك', 'من حقك أن تقول "لا" إذا شعرت بعدم الارتياح', 'لا تحتفظ بالأسرار التي تجعلك تشعر بالخوف'],
                            'en' => ['Never feel shy about asking for help', 'You do not have to face the situation alone', 'You have the right to say "no" if you feel uneasy', 'Do not keep secrets that make you feel afraid'],
                        ],
                    ],
                ],
            ],
        ];

        $videos = Video::withoutGlobalScopes()->orderBy('id')->get();

        if ($videos->isEmpty()) {
            $this->command?->warn('Awareness skipped: no videos exist. Awareness entries require a video_id.');

            return;
        }

        $seeded = 0;

        foreach ($groups as $group) {
            $video = $videos->first(function (Video $item) use ($group) {
                $title = $item->getTranslation('title', 'ar', false).' '.$item->getTranslation('title', 'en', false);

                foreach ($group['keywords'] as $keyword) {
                    if (mb_stripos($title, $keyword) !== false) {
                        return true;
                    }
                }

                return false;
            }) ?? $videos->get($group['fallback_index']);

            if (! $video) {
                $this->command?->warn('Awareness group skipped: no matching video found.');

                continue;
            }

            foreach ($group['sections'] as $section) {
                $existing = Tawia::withTrashed()->where('video_id', $video->id)->get()->first(
                    fn (Tawia $item) => $item->getTranslation('title', 'ar', false) === $section['title']['ar']
                );

                $payload = [
                    'video_id' => $video->id,
                    'title' => $section['title'],
                    'description' => $section['description'],
                    'symptoms' => $section['symptoms'],
                ];

                if ($existing) {
                    $existing->update($payload);
                } else {
                    Tawia::create($payload);
                }

                $seeded++;
            }
        }

        $this->command?->info('Awareness sections seeded: '.$seeded);
    }

    private function seedStories(): void
    {
        $stories = [
            ['أحمد', 10, 'حافظت على هدوئي', 'عندما سمعت صوت الانفجار، تذكرت ما تعلمته في منصة أمان. بقيت مع عائلتي في المكان الآمن ولم أركض إلى الخارج. شعرت بالخوف، لكنني عرفت أن الهدوء يساعدني على التصرف بشكل صحيح.'],
            ['مريم', 12, 'ساعدت أختي الصغيرة', 'تعرضت أختي لخدش بسيط أثناء اللعب، فقمت بتنظيف الجرح ووضع الضماد، ثم أخبرت والدتي بما حدث. تعلمت أن الإسعافات الأولية البسيطة تساعد في حماية المصاب حتى يحصل على المساعدة.'],
            ['يزن', 9, 'تصرفت بأمان في المنزل', 'رأيت سلكًا كهربائيًا مكشوفًا في المنزل، فلم ألمسه، وأخبرت والدي فورًا. أدركت أن الإبلاغ عن المخاطر هو أفضل طريقة لحماية نفسي وعائلتي.'],
            ['لين', 11, 'تجاوزت خوفي', 'بعد انتهاء الأحداث شعرت بالخوف والقلق، فتحدثت مع والدتي ومع معلمتي عن مشاعري. ساعدني ذلك على الشعور بالراحة، وتعلمت أن مشاركة المشاعر أمر مهم.'],
            ['محمد', 13, 'ساعدنا بعضنا', 'بعد انتهاء الخطر، تعاونت مع إخوتي في ترتيب المكان وجمع الأغراض الضرورية. تعلمت أن التعاون يجعلنا أقوى ويمنحنا شعورًا بالأمان.'],
            ['سارة', 8, 'طلبت المساعدة', 'شاهدت شخصًا يحتاج إلى المساعدة، فلم أحاول التصرف وحدي، بل أخبرت أحد البالغين فورًا. تعلمت أن طلب المساعدة في الوقت المناسب هو تصرف صحيح وآمن.'],
        ];

        foreach ($stories as [$firstName, $age, $title, $content]) {
            Story::withTrashed()->updateOrCreate(
                ['first_name' => $firstName, 'title' => $title],
                [
                    'last_name' => '',
                    'mobile' => '',
                    'email' => '',
                    'age' => $age,
                    'locale' => 'ar',
                    'content' => $content,
                    'video_id' => null,
                    'deleted_at' => null,
                ]
            );
        }

        $this->command?->info('Stories seeded: '.count($stories));
    }

    private function seedBlogs(): void
    {
        $blogs = [
            [
                'ar' => [
                    'حماية الأطفال أثناء الحروب والطوارئ',
                    'كيف تحمي الأسر والمجتمعات الأطفال في أوقات النزاع والطوارئ.',
                    'يتعرض الأطفال في أوقات النزاع لمخاطر متعددة تشمل الإصابة والانفصال عن ذويهم والضغط النفسي. يوضح هذا الدليل من اليونيسف أهم إجراءات الحماية التي يمكن للأسر والمجتمعات اتباعها للحفاظ على سلامة الأطفال أثناء الطوارئ.',
                ],
                'en' => [
                    'Protecting children during war and emergencies',
                    'How families and communities keep children safe in times of conflict and emergency.',
                    'In times of conflict, children face many risks including injury, separation from their families, and psychological stress. This UNICEF guide explains the key protection measures families and communities can follow to keep children safe during emergencies.',
                ],
                'url' => 'https://www.unicef.org/protection/protecting-children-in-humanitarian-action',
            ],
            [
                'ar' => [
                    'لماذا يجب عدم لمس الأجسام المشبوهة بعد الحرب؟',
                    'مخلفات الحرب المتفجرة تبدو أحيانًا كألعاب، لكنها خطرة جدًا.',
                    'تبقى بعد انتهاء النزاعات مخلفات متفجرة قد تبدو مألوفة أو شبيهة بالألعاب. يشرح هذا المصدر لماذا يجب على الأطفال عدم لمس أي جسم مجهول، وكيفية الإبلاغ عنه بطريقة آمنة.',
                ],
                'en' => [
                    'Why children must never touch explosive remnants of war',
                    'Explosive remnants of war sometimes look like toys, but they are extremely dangerous.',
                    'After conflicts end, explosive remnants may remain that look familiar or even toy-like. This resource explains why children should never touch an unknown object, and how to report it safely.',
                ],
                'url' => 'https://www.unicef.org/protection/protecting-children-from-explosive-weapons',
            ],
            [
                'ar' => [
                    'الإسعافات الأولية للحروق البسيطة',
                    'خطوات عملية للتعامل مع الحروق البسيطة بطريقة صحيحة.',
                    'يوضح هذا الدليل من الصليب الأحمر الأمريكي خطوات الإسعافات الأولية للحروق البسيطة، ومتى يجب طلب المساعدة الطبية، وما يجب تجنبه أثناء التعامل مع الحرق.',
                ],
                'en' => [
                    'First aid for minor burns',
                    'Practical steps for handling minor burns the right way.',
                    'This American Red Cross guide covers the first aid steps for minor burns, when to seek medical help, and what to avoid while treating a burn.',
                ],
                'url' => 'https://www.redcross.org/take-a-class/resources/learn-first-aid/burns',
            ],
            [
                'ar' => [
                    'الحروق عند الأطفال وكيفية الوقاية منها',
                    'نصائح للأهل لجعل المنزل أكثر أمانًا وتقليل خطر الحروق.',
                    'تُعد الحروق والسمط من أكثر الإصابات المنزلية شيوعًا بين الأطفال. يقدم هذا المقال نصائح عملية للوقاية داخل المنزل، وخطوات الاستجابة الأولى عند حدوث الإصابة.',
                ],
                'en' => [
                    'Burns and scalds: keeping children safe',
                    'Tips for parents on making the home safer and reducing burn risk.',
                    'Burns and scalds are among the most common household injuries for children. This article offers practical prevention tips for the home, plus first response steps when an injury happens.',
                ],
                'url' => 'https://www.unicef.org/parenting/safety/burns-scalds-fire-safety-tips',
            ],
            [
                'ar' => [
                    'كيف ندعم الأطفال نفسيًا بعد الأزمات؟',
                    'إرشادات لمساعدة الأطفال على التعافي النفسي بعد الأحداث الصعبة.',
                    'بعد الأزمات قد يظهر على الأطفال القلق أو الخوف أو تغيّر في السلوك. يوضح هذا المصدر كيف يمكن للأهل والمعلمين تقديم الدعم النفسي المناسب، ومتى يجب طلب مساعدة متخصصة.',
                ],
                'en' => [
                    'Supporting children\'s mental health after a crisis',
                    'Guidance for helping children recover emotionally after difficult events.',
                    'After a crisis, children may show anxiety, fear, or changes in behavior. This resource explains how parents and teachers can offer the right psychological support, and when to seek specialist help.',
                ],
                'url' => 'https://www.unicef.org/protection/protecting-children-in-humanitarian-action',
            ],
            [
                'ar' => [
                    'كيف نخفف الإجهاد النفسي؟',
                    'خطوات بسيطة تساعد الأطفال والأهل على التخفيف من التوتر والضغوط.',
                    'يقدم هذا الدليل خطوات بسيطة يمكن للأسرة تطبيقها يوميًا للتخفيف من التوتر، مثل تنظيم الروتين، والحديث عن المشاعر، وممارسة تمارين التنفس والاسترخاء.',
                ],
                'en' => [
                    'How to ease stress',
                    'Simple steps that help children and parents reduce tension and pressure.',
                    'This guide offers simple steps a family can apply daily to ease stress, such as keeping a routine, talking about feelings, and practicing breathing and relaxation exercises.',
                ],
                'url' => 'https://www.unicef.org/parenting/ar',
            ],
            [
                'ar' => [
                    'أنشطة للأطفال دون استخدام الأجهزة الإلكترونية',
                    'أفكار وأنشطة تساعد الأطفال على قضاء وقت مفيد وتقليل التوتر.',
                    'مجموعة من الأنشطة المنزلية البسيطة التي تشغل وقت الأطفال بطريقة مفيدة وتقلل من التوتر، دون الحاجة إلى الأجهزة الإلكترونية.',
                ],
                'en' => [
                    'Screen-free activities for children',
                    'Ideas and activities that help children spend time well and lower stress.',
                    'A set of simple at-home activities that fill children\'s time in a useful way and reduce stress, with no electronic devices needed.',
                ],
                'url' => 'https://www.unicef.org/parenting/ar',
            ],
            [
                'ar' => [
                    'حماية الطفل ورعايته أثناء الطوارئ',
                    'دليل عربي يوضح أهم إجراءات السلامة والرعاية للأطفال في حالات الطوارئ.',
                    'دليل عربي شامل يوضح إجراءات السلامة والرعاية الواجب اتباعها مع الأطفال أثناء حالات الطوارئ، ويشمل الحماية من المخاطر والدعم الأسري والنفسي.',
                ],
                'en' => [
                    'Child protection and care during emergencies',
                    'An Arabic guide to the key safety and care measures for children in emergencies.',
                    'A comprehensive Arabic guide to the safety and care measures to follow with children during emergencies, covering protection from hazards along with family and psychological support.',
                ],
                'url' => 'https://www.unicef.org/lebanon/ar/%D8%AD%D9%85%D8%A7%D9%8A%D8%A9-%D9%88%D9%88%D9%82%D8%A7%D9%8A%D8%A9-%D8%A7%D9%84%D8%B7%D9%81%D9%84/documents',
            ],
            [
                'ar' => [
                    'رسائل توعوية للأطفال ومقدمي الرعاية أثناء الطوارئ',
                    'مقالات عن الحديث مع الأطفال حول الحرب، وعلامات الكرب، ونوبات الهلع.',
                    'مجموعة مقالات عربية موجهة لمقدمي الرعاية، تشمل: كيف تتحدث مع أطفالك عن النزاعات والحروب، وتنشئة الأطفال في حالات الطوارئ، وكيف تميز علامات الكرب لدى الأطفال، وما هي نوبات الهلع عند الأطفال.',
                ],
                'en' => [
                    'Awareness messages for children and caregivers in emergencies',
                    'Articles on talking to children about war, spotting distress signs, and panic attacks.',
                    'A set of Arabic articles for caregivers covering: how to talk to your children about conflict and war, raising children during emergencies, how to recognize signs of distress in children, and what panic attacks in children look like.',
                ],
                'url' => 'https://www.unicef.org/syria/ar/parenting-hub/%D8%B1%D8%B9%D8%A7%D9%8A%D8%A9-%D8%A7%D9%84%D8%B7%D9%81%D9%84',
            ],
            [
                'ar' => [
                    'أساسيات الإسعافات الأولية',
                    'الجروح والحروق والاختناق والنزيف ولدغات الحشرات والكدمات.',
                    'دليل عربي من الهلال الأحمر يغطي أساسيات الإسعافات الأولية: الجروح، والحروق، والاختناق، والنزيف، ولدغات الحشرات، والكدمات، مع خطوات التعامل الصحيح مع كل حالة.',
                ],
                'en' => [
                    'First aid basics',
                    'Wounds, burns, choking, bleeding, insect bites, and bruises.',
                    'An Arabic Red Crescent guide covering first aid basics: wounds, burns, choking, bleeding, insect bites, and bruises, with the correct steps for handling each case.',
                ],
                'url' => 'https://ircs.org.iq/%D8%A7%D9%84%D8%A7%D8%B3%D8%B9%D8%A7%D9%81%D8%A7%D8%AA-%D8%A7%D9%84%D8%A7%D9%88%D9%84%D9%8A%D8%A9/',
            ],
        ];

        foreach ($blogs as $blog) {
            $existing = Blog::withTrashed()->get()->first(
                fn (Blog $item) => $item->getTranslation('title', 'ar', false) === $blog['ar'][0]
            );

            $sourceLabel = ['ar' => 'المصدر', 'en' => 'Source'];
            $content = [];

            foreach (['ar', 'en'] as $locale) {
                $content[$locale] = '<p>'.e($blog[$locale][2]).'</p>'
                    .'<p><a href="'.e($blog['url']).'" target="_blank" rel="noopener noreferrer">'
                    .$sourceLabel[$locale].'</a></p>';
            }

            $payload = [
                'title' => ['ar' => $blog['ar'][0], 'en' => $blog['en'][0]],
                'short_description' => ['ar' => $blog['ar'][1], 'en' => $blog['en'][1]],
                'content' => $content,
                'publish_date' => now()->toDateString(),
            ];

            if ($existing) {
                $existing->update($payload);
            } else {
                Blog::create($payload);
            }
        }

        $this->command?->info('Blog posts seeded: '.count($blogs));
    }
}
