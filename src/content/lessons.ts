// "Start here": the basics, in the order of content/curriculum.md (Stage 1).
// For dummies but deep: plain words, then something real, then one thing to try.
// English in Cici's voice; Arabic in casual Lebanese with HD terms in English.

type Lang = 'en' | 'ar';
export interface Lesson { id: string; title: string; minutes: number; body: string[]; tryThis: string; note: string }

export const LESSONS: Record<Lang, Lesson[]> = {
  en: [
    {
      id: 'what', title: 'What Human Design is', minutes: 2, note: 'start here :)',
      body: [
        'Human Design is a map of how you’re built to use your energy, make decisions and connect with people. It’s calculated from your birth date, time and place.',
        'It doesn’t tell you who to be. It shows you where you’ve been trying to be someone else, so you can stop.',
        'Most of us were raised to work the same way, decide the same way and rest the same way. Human Design says there are five very different ways to be a human, and yours might not be the one you were taught.',
      ],
      tryThis: 'Read your type on My chart, then notice one moment today where it feels true.',
    },
    {
      id: 'two', title: 'Your chart holds two moments', minutes: 2, note: '(this is the good part)',
      body: [
        'Your chart is two calculations laid on top of each other. One is the moment you were born. The other is about three months before, when the Sun was 88 degrees earlier.',
        'The birth moment is your Personality, drawn in black: the part of you that you know and recognise. The earlier moment is your Design, drawn in red: your body’s side, which works on its own and is often clearer to other people than to you.',
        'That’s why your birth time matters. A few minutes can change a line, and sometimes more.',
      ],
      tryThis: 'Look at the Design and Personality columns beside your chart. Red is what others may see in you first.',
    },
    {
      id: 'centres', title: 'The nine shapes', minutes: 3, note: '(coloured or white?)',
      body: [
        'The shapes on your chart are the nine centres. Each one is a kind of energy: thinking, speaking, identity, willpower, emotions, life force, instinct, pressure.',
        'Coloured centres are defined. They work the same way every day: that energy is reliably yours.',
        'White centres are open. They take in the energy of the people around you and amplify it. Open isn’t empty: it’s where you learn the most about other people, and where you grow wise over time.',
      ],
      tryThis: 'Find one white centre on your chart. Next time you feel that energy strongly, ask: is this mine, or am I feeling someone else’s?',
    },
    {
      id: 'types', title: 'The five types', minutes: 3, note: '(5 types. that’s it.)',
      body: [
        'Generators (about 37%) have steady, renewable energy for what lights them up. Manifesting Generators (about 33%) have the same energy, with speed and many passions.',
        'Projectors (about 20%) are here to see people and systems clearly and guide them. Manifestors (about 9%) are here to start things. Reflectors (about 1%) mirror the health of the people and places around them.',
        'Your type comes from two simple questions: is your Sacral (the square low in the middle) coloured, and is a motor connected to your Throat?',
      ],
      tryThis: 'Think of three people you love. Which type do you guess they are? Add one in My people and check.',
    },
    {
      id: 'strategy', title: 'Strategy: how life comes to you', minutes: 2, note: '(it’s about your aura)',
      body: [
        'Each type has a strategy: the way that creates the least resistance for you. Generators wait to respond. Manifesting Generators respond, then inform. Projectors wait for the invitation. Manifestors inform before they act. Reflectors wait a lunar cycle for big decisions.',
        'Waiting doesn’t mean sitting still. It means letting life bring you something to answer, instead of pushing from your head.',
        'Your strategy works through your aura, the energy field people feel before you say a word.',
      ],
      tryThis: 'For one day, notice what comes to you without you chasing it.',
    },
    {
      id: 'authority', title: 'Authority: your inner yes', minutes: 3, note: '(not your head)',
      body: [
        'Your authority is where your reliable decisions come from. It’s never your mind. Your mind is brilliant for thinking, sharing and understanding, but it can argue both sides forever.',
        'There’s an order: if your Solar Plexus is coloured, your authority is Emotional and clarity comes in waves over time. If not, the Sacral, then the Spleen, then the Heart, then the G centre. Projectors with none of these talk it out, and Reflectors wait a lunar cycle.',
        'Strategy tells you when something is right to consider. Authority tells you whether it’s a yes.',
      ],
      tryThis: 'Take one small decision today and make it with your authority instead of a pros and cons list.',
    },
    {
      id: 'signature', title: 'The signals that guide you', minutes: 2, note: '(your inner compass)',
      body: [
        'Each type has a signature, the feeling that tells you you’re on track: satisfaction for Generators and Manifesting Generators, success for Projectors, peace for Manifestors, surprise for Reflectors.',
        'And each has a not-self signal, the feeling that tells you something’s off: frustration, bitterness, anger or disappointment.',
        'The not-self feeling isn’t a failure. It’s information, a gentle alarm that you’ve drifted from your design.',
      ],
      tryThis: 'Tonight, ask yourself: when did I feel my signature today, and when did I feel my not-self?',
    },
    {
      id: 'profile', title: 'Your profile: your costume', minutes: 2, note: '(two numbers)',
      body: [
        'Your profile is the two numbers on your chart, like 2/4 or 5/1. The first comes from your Personality Sun, the second from your Design Sun.',
        'Together they describe the role you play in life: the Investigator who needs foundations, the Hermit with natural gifts, the Martyr who learns by trying, the Opportunist who lives through their network, the Heretic people project onto, the Role Model who lives in three phases.',
        'It’s less what you do and more how you naturally go about it.',
      ],
      tryThis: 'Read your profile on My chart. Which line feels most like you, and which one surprises you?',
    },
    {
      id: 'conditioning', title: 'Conditioning: becoming yourself again', minutes: 3, note: '(it takes time, be gentle)',
      body: [
        'From childhood we take in the energy and expectations of the people around us, especially through our open centres. That’s conditioning, and it’s completely normal.',
        'The not-self mind uses those open centres to make decisions: trying to prove itself, avoid conflict, keep up, hold on. Over time that can lead us far from who we are.',
        'Deconditioning is the slow, kind process of coming home. People often talk about a seven-year cycle, because that’s how long it takes the body’s cells to renew.',
      ],
      tryThis: 'Read the question for one of your white centres in My chart, and carry it with you this week.',
    },
    {
      id: 'experiment', title: 'Living it: an experiment, not a rule', minutes: 2, note: '(try it, don’t believe it)',
      body: [
        'Human Design isn’t something to believe. It’s something to try.',
        'Start with your strategy and authority, nothing else, for a few weeks. Notice what changes in your energy, your relationships and your decisions.',
        'Keep what feels true and leave what doesn’t. Your body is the one that knows.',
      ],
      tryThis: 'Pick your experiment from the Try this card on My chart and give it two weeks.',
    },
  ],
  ar: [
    {
      id: 'what', title: 'شو هوي الهيومان ديزاين', minutes: 2, note: 'بلّش من هون :)',
      body: [
        'الهيومان ديزاين خريطة بتوريك كيف إنت مخلوق تستعمل طاقتك، تاخد قراراتك، وتتواصل مع الناس. بتنحسب من تاريخ ووقت ومكان ولادتك.',
        'ما بتقلّك مين لازم تكون. بتوريك وين عم تحاول تكون حدا غيرك، لتوقف.',
        'أغلبنا تربّى ليشتغل بنفس الطريقة، ياخد قرارات بنفس الطريقة، ويرتاح بنفس الطريقة. الهيومان ديزاين بتقول في خمس طرق مختلفة كتير لتكون إنسان، ويمكن طريقتك مش يلي تعلّمتها.',
      ],
      tryThis: 'إقرا نوعك بـ«خريطتي»، وبعدين لاحظ لحظة وحدة اليوم بتحسّ فيها إنو صح.',
    },
    {
      id: 'two', title: 'خريطتك فيها لحظتين', minutes: 2, note: '(هون الحلو)',
      body: [
        'خريطتك حسابين فوق بعض. الأول لحظة ولادتك. والتاني قبلها بشي تلات شهور، لما كانت الشمس قبل بـ88 درجة.',
        'لحظة الولادة هيي الـPersonality، بالأسود: الجزء منّك يلي بتعرفو وبتشوفو. اللحظة الأولانية هيي الـDesign، بالأحمر: جهة جسمك، بتشتغل لحالها وكتير مرات الناس بيشوفوها أوضح منك.',
        'لهيك ساعة الولادة مهمّة. كم دقيقة فيهن يغيّروا خط، وأوقات أكتر.',
      ],
      tryThis: 'اتطلّع عالعمودين حدّ خريطتك. الأحمر هوي يلي ممكن الناس يشوفوه فيك أول شي.',
    },
    {
      id: 'centres', title: 'الأشكال التسعة', minutes: 3, note: '(ملوّن ولا أبيض؟)',
      body: [
        'الأشكال بخريطتك هيي المراكز التسعة. كل واحد نوع طاقة: التفكير، الحكي، الهوية، الإرادة، المشاعر، طاقة الحياة، الغريزة، والضغط.',
        'المراكز الملوّنة معرّفة. بتشتغل بنفس الطريقة كل يوم: هالطاقة إلك وبتعتمد عليها.',
        'المراكز البيضا مفتوحة. بتاخد طاقة الناس حواليك وبتكبّرها. المفتوح مش فاضي: هونيك بتتعلّم أكتر شي عن الناس، وهونيك بتصير حكيم مع الوقت.',
      ],
      tryThis: 'لاقي مركز أبيض بخريطتك. المرة الجاية لما تحسّ بهالطاقة بقوة، اسأل حالك: هيدي إلي، ولا عم حسّ بطاقة حدا تاني؟',
    },
    {
      id: 'types', title: 'الأنواع الخمسة', minutes: 3, note: '(٥ أنواع. وبس.)',
      body: [
        'الجنريتر (شي ٣٧٪) عندو طاقة ثابتة بتتجدّد للأشيا يلي بتشعلو. المانفستنج جنريتر (شي ٣٣٪) عندو نفس الطاقة، ومعها سرعة وكذا شغف.',
        'البروجكتور (شي ٢٠٪) هون ليشوف الناس والأنظمة بوضوح ويرشدهن. المانفستر (شي ٩٪) هون ليبلّش الأشيا. والرفلكتور (شي ١٪) بيعكس صحة الناس والمطارح يلي حواليه.',
        'نوعك جاي من سؤالين بسيطين: السكرال (المربّع تحت بالنص) ملوّن؟ وفي موتور موصول بالثروت؟',
      ],
      tryThis: 'فكّر بتلات أشخاص بتحبّهن. شو بتخمّن نوعهن؟ زيد واحد بـ«ناسي» وشيّك.',
    },
    {
      id: 'strategy', title: 'الاستراتيجية: كيف الحياة بتجيك', minutes: 2, note: '(كلّو عن الهالة)',
      body: [
        'كل نوع إلو استراتيجية: الطريقة يلي فيها أقل مقاومة إلك. الجنريتر بيستنّى ليستجيب. المانفستنج جنريتر بيستجيب، وبعدين بيخبّر. البروجكتور بيستنّى الدعوة. المانفستر بيخبّر قبل ما يتحرّك. والرفلكتور بيستنّى دورة قمر للقرارات الكبيرة.',
        'الاستنّاية مش يعني تقعد ساكت. يعني تخلّي الحياة تجيبلك شي تجاوب عليه، بدل ما تدفش من راسك.',
        'استراتيجيتك بتشتغل من خلال الهالة تبعك، الطاقة يلي الناس بيحسّوها قبل ما تحكي ولا كلمة.',
      ],
      tryThis: 'ليوم واحد، لاحظ شو بيجيك بلا ما تركض وراه.',
    },
    {
      id: 'authority', title: 'السلطة الداخلية: الـ«إيه» تبعك', minutes: 3, note: '(مش راسك)',
      body: [
        'سلطتك هيي من وين بتجي قراراتك يلي فيك تعتمد عليها. أبدًا مش عقلك. عقلك عظيم للتفكير والمشاركة والفهم، بس فيه يدافع عن الجهتين للأبد.',
        'في ترتيب: إذا السولار بلكسس ملوّن، سلطتك إيموشنال والوضوح بيجي على موجات مع الوقت. إذا لأ، السكرال، بعدين السبلين، بعدين الهارت، بعدين الـG. البروجكتور يلي ما عندو ولا واحد منهن بيحكي القرار بصوت عالي، والرفلكتور بيستنّى دورة قمر.',
        'الاستراتيجية بتقلّك إيمتى الشي صح تفكّر فيه. السلطة بتقلّك إذا هوي «إيه».',
      ],
      tryThis: 'خود قرار صغير اليوم بسلطتك، بدل ليستة إيجابيات وسلبيات.',
    },
    {
      id: 'signature', title: 'الإشارات يلي بتدلّك', minutes: 2, note: '(بوصلتك الداخلية)',
      body: [
        'كل نوع إلو إشارة بتقلّك إنك ماشي صح: الرضا للجنريتر والمانفستنج جنريتر، النجاح للبروجكتور، السلام للمانفستر، والمفاجأة للرفلكتور.',
        'وكل نوع إلو إشارة بتقلّك إنو في شي مش زابط: الإحباط، المرارة، العصبية، أو خيبة الأمل.',
        'هالإحساس مش فشل. هوي معلومة، جرس ناعم إنك بعدت عن تصميمك.',
      ],
      tryThis: 'الليلة اسأل حالك: إيمتى حسّيت بإشارتي الحلوة اليوم، وإيمتى حسّيت بالتانية؟',
    },
    {
      id: 'profile', title: 'البروفايل: الدور يلي بتلعبو', minutes: 2, note: '(رقمين)',
      body: [
        'البروفايل هوي الرقمين بخريطتك، متل 2/4 أو 5/1. الأول من شمس الـPersonality، والتاني من شمس الـDesign.',
        'سوا بيوصفوا الدور يلي بتلعبو بالحياة: الباحث يلي بدو أساس، الناسك يلي عندو هدايا طبيعية، يلي بيتعلّم بالتجربة، يلي بيعيش من خلال شبكتو، يلي الناس بيعلّقوا عليه آمالهن، والقدوة يلي بيعيش حياتو على تلات مراحل.',
        'مش شو بتعمل، بقدّ ما هوي كيف بتعمل الأشيا بشكل طبيعي.',
      ],
      tryThis: 'إقرا البروفايل تبعك بـ«خريطتي». أي خط بيشبهك أكتر، وأي واحد بيفاجئك؟',
    },
    {
      id: 'conditioning', title: 'التأثيرات: ترجع لحالك', minutes: 3, note: '(بدها وقت، طوّل بالك)',
      body: [
        'من صغرنا منلقط طاقة وتوقّعات الناس حوالينا، خصوصًا من خلال مراكزنا المفتوحة. هيدا اسمو conditioning، وطبيعي كتير.',
        'العقل يلي مش إنت بيستعمل هالمراكز المفتوحة ليقرّر: ليثبت حالو، ليتجنّب المشاكل، ليلحق، ليتمسّك. ومع الوقت هالشي فيه يبعّدنا كتير عن حالنا.',
        'الرجعة لحالك عملية بطيئة وحنونة. الناس كتير بيحكوا عن دورة سبع سنين، لأنو هيدا الوقت يلي بتاخدو خلايا الجسم لتتجدّد.',
      ],
      tryThis: 'إقرا السؤال لواحد من مراكزك البيضا بـ«خريطتي»، وحملو معك هالجمعة.',
    },
    {
      id: 'experiment', title: 'تعيشها: تجربة، مش قانون', minutes: 2, note: '(جرّبها، ما تصدّقها)',
      body: [
        'الهيومان ديزاين مش شي لازم تصدّقو. هوي شي لازم تجرّبو.',
        'بلّش باستراتيجيتك وسلطتك، وبس، لكم جمعة. لاحظ شو بيتغيّر بطاقتك، بعلاقاتك، وبقراراتك.',
        'خلّي يلي بتحسّو صح، واترك يلي لأ. جسمك هوي يلي بيعرف.',
      ],
      tryThis: 'اختار تجربتك من كارت «جرّب هيدا» بـ«خريطتي» وعطيها جمعتين.',
    },
  ],
};
