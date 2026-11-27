// "Life theme" (incarnation cross) and "How you work best" (the four variables + sense).
// Standard Human Design terms; every explanation is written for Human by Design.
// English in Cici's voice; Arabic in casual Lebanese.

type Lang = 'en' | 'ar';
type Side = 'left' | 'right';

export const PURPOSE_UI: Record<Lang, {
  tabDesign: string; tabTheme: string; tabWork: string;
  crossLabel: string; crossIntro: string;
  angle: Record<'right' | 'left' | 'jux', { name: (x: string) => string; tag: string; text: string }>;
  fourGates: string; roles: [string, string][];
  workIntro: string; workNote: string;
  digestion: string; digestionSub: string; sense: string; senseSub: string;
  environment: string; environmentSub: string; perspective: string; perspectiveSub: string;
  motivation: string; motivationSub: string;
}> = {
  en: {
    tabDesign: 'Your design', tabTheme: 'Life theme', tabWork: 'How you work best',
    crossLabel: 'Your incarnation cross',
    crossIntro: 'Your life theme comes from four gates: where the Sun and Earth were when you were born, and about three months before. It isn’t a job to finish. It’s what unfolds on its own when you live by your strategy and authority, and it often comes into focus later in life.',
    angle: {
      right: { name: (x) => `Right Angle Cross of ${x}`, tag: '', text: 'A personal path. Your purpose unfolds through your own life and experiences. You don’t have to save anyone: living your design is the contribution.' },
      left: { name: (x) => `Left Angle Cross of ${x}`, tag: '', text: 'A path woven with other people. Your purpose unfolds through relationships and encounters. The people who cross your path are part of the path.' },
      jux: { name: (x) => `Juxtaposition Cross of ${x}`, tag: '', text: 'A fixed, steady path. One clear theme, lived fully and consistently, rather than many directions.' },
    },
    fourGates: 'The four gates of your cross',
    roles: [
      ['Conscious Sun', 'The light you put out. The part of you people feel most.'],
      ['Conscious Earth', 'What grounds you and brings you back to yourself.'],
      ['Unconscious Sun', 'Your body’s purpose, often clearer to others than to you.'],
      ['Unconscious Earth', 'The quiet foundation you stand on.'],
    ],
    workIntro: 'These are the finer details of your chart: how your body likes to eat, where you feel at home, how your mind takes things in and what really drives you.',
    workNote: 'They’re subtle and advanced. Try them gently, one at a time, once your strategy and authority feel natural.',
    digestion: 'Digestion', digestionSub: 'How your body likes to take things in',
    sense: 'Your strongest sense', senseSub: 'How you naturally pick up what’s true',
    environment: 'Environment', environmentSub: 'The kind of place where you feel most yourself',
    perspective: 'Perspective', perspectiveSub: 'What your mind naturally pays attention to',
    motivation: 'Motivation', motivationSub: 'What really moves you, underneath the reasons',
  },
  ar: {
    tabDesign: 'تصميمك', tabTheme: 'موضوع حياتك', tabWork: 'كيف بترتاح',
    crossLabel: 'موضوع حياتك',
    crossIntro: 'موضوع حياتك جاي من أربع بوابات: وين كانت الشمس والأرض وقت خلقت، وقبلها بشي تلات شهور. مش مهمّة لازم تخلّصها. هيدا يلي بيصير لحالو لما تعيش حسب استراتيجيتك وسلطتك، وكتير مرات بيوضح أكتر مع العمر.',
    angle: {
      right: { name: (x) => x, tag: 'Incarnation Cross · Right Angle', text: 'طريق شخصي. هدفك بيبيّن من خلال حياتك وتجاربك إنت. مش مطلوب منك تخلّص حدا: إنك تعيش تصميمك هوي المساهمة.' },
      left: { name: (x) => x, tag: 'Incarnation Cross · Left Angle', text: 'طريق محبوك مع الناس. هدفك بيبيّن من خلال العلاقات واللقاءات. الناس يلي بيمرقوا بحياتك هنّي جزء من الطريق.' },
      jux: { name: (x) => x, tag: 'Incarnation Cross · Juxtaposition', text: 'طريق ثابت. موضوع واحد واضح، بتعيشو كامل وبثبات، بدل كذا اتجاه.' },
    },
    fourGates: 'البوابات الأربعة',
    roles: [
      ['شمس الـPersonality', 'النور يلي بتطلّعو. الجزء منّك يلي الناس بيحسّوه أكتر شي.'],
      ['أرض الـPersonality', 'يلي بيثبّتك وبيرجّعك لحالك.'],
      ['شمس الـDesign', 'هدف جسمك، وكتير مرات الناس بيشوفوه قبلك.'],
      ['أرض الـDesign', 'الأساس الهادي يلي واقف عليه.'],
    ],
    workIntro: 'هيدي التفاصيل الأدقّ بخريطتك: كيف جسمك بيحب ياكل، وين بتحسّ حالك ببيتك، كيف عقلك بيلقط الأشيا، وشو يلي فعلًا بيحرّكك.',
    workNote: 'هيدي أشيا ناعمة ومتقدّمة. جرّبها بالراحة، وحدة وحدة، بعد ما تصير استراتيجيتك وسلطتك طبيعية عندك.',
    digestion: 'الهضم', digestionSub: 'كيف جسمك بيحب ياخد الأكل والأشيا',
    sense: 'أقوى حاسة عندك', senseSub: 'كيف بتلقط الحقيقة بشكل طبيعي',
    environment: 'المحيط', environmentSub: 'نوع المطرح يلي بتحسّ فيه حالك أكتر',
    perspective: 'النظرة', perspectiveSub: 'شو عقلك بينتبه عليه بشكل طبيعي',
    motivation: 'الدافع', motivationSub: 'شو فعلًا بيحرّكك، تحت كل الأسباب',
  },
};

type Item = { name: string; text: string; sides?: Record<Side, { name: string; text: string }> };

export const DIGESTION: Record<Lang, Record<number, Item>> = {
  en: {
    1: { name: 'Appetite', text: 'Your body does best when eating follows its own rhythm rather than the clock.', sides: { left: { name: 'Consecutive', text: 'One thing at a time: a single type of food per meal, eaten in sequence.' }, right: { name: 'Alternating', text: 'Swing between eating more and eating less, depending on the day.' } } },
    2: { name: 'Taste', text: 'Your body reads food through taste and knows what suits it.', sides: { left: { name: 'Open', text: 'Variety and curiosity: let your taste explore.' }, right: { name: 'Closed', text: 'A small set of foods you trust, repeated.' } } },
    3: { name: 'Thirst', text: 'Temperature matters to how you digest.', sides: { left: { name: 'Hot', text: 'Warm foods and drinks settle you best.' }, right: { name: 'Cold', text: 'Cool or room-temperature foods and drinks suit you best.' } } },
    4: { name: 'Touch', text: 'How calm or alert you are while eating changes how well you digest.', sides: { left: { name: 'Calm', text: 'Eat somewhere quiet and settled, without rushing.' }, right: { name: 'Nervous', text: 'You can digest well on the move or with some activity around you.' } } },
    5: { name: 'Sound', text: 'The sound around you affects your digestion.', sides: { left: { name: 'High sound', text: 'Lively, noisy places can actually help you eat well.' }, right: { name: 'Low sound', text: 'Quiet surroundings help your body take things in.' } } },
    6: { name: 'Light', text: 'Light affects how you digest.', sides: { left: { name: 'Direct', text: 'Daylight and eating during the day suit you.' }, right: { name: 'Indirect', text: 'Soft light and evening meals suit you.' } } },
  },
  ar: {
    1: { name: 'الشهية', text: 'جسمك بيرتاح لما الأكل يمشي على إيقاعو هوي، مش على الساعة.', sides: { left: { name: 'متتالي', text: 'شي واحد بالمرة: نوع أكل واحد بكل وجبة، ورا بعض.' }, right: { name: 'متناوب', text: 'بين إنك تاكل كتير وتاكل شوي، حسب النهار.' } } },
    2: { name: 'الذوق', text: 'جسمك بيقرا الأكل من طعمتو، وبيعرف شو بيناسبو.', sides: { left: { name: 'مفتوح', text: 'تنويع وفضول: خلّي ذوقك يكتشف.' }, right: { name: 'مسكّر', text: 'كم أكلة بتثق فيهن، وبتكرّرهن.' } } },
    3: { name: 'العطش', text: 'الحرارة بتفرق بكيف بتهضم.', sides: { left: { name: 'سخن', text: 'الأكل والشرب السخن بيريّحوك أكتر.' }, right: { name: 'بارد', text: 'الأكل والشرب البارد أو عحرارة الغرفة بيناسبوك أكتر.' } } },
    4: { name: 'اللمس', text: 'قديش إنت هادي أو متيقّظ وإنت عم تاكل بيغيّر كيف بتهضم.', sides: { left: { name: 'هادي', text: 'كول بمطرح هادي ومرتاح، بلا عجقة.' }, right: { name: 'متوتّر', text: 'فيك تهضم منيح وإنت عم تتحرّك أو حواليك حركة.' } } },
    5: { name: 'الصوت', text: 'الصوت حواليك بيأثّر عهضمك.', sides: { left: { name: 'صوت عالي', text: 'المطارح العجقة والحيّة ممكن تساعدك تاكل منيح.' }, right: { name: 'صوت واطي', text: 'الهدوء بيساعد جسمك ياخد الأشيا.' } } },
    6: { name: 'الضو', text: 'الضو بيأثّر عكيف بتهضم.', sides: { left: { name: 'مباشر', text: 'ضو النهار والأكل بالنهار بيناسبوك.' }, right: { name: 'غير مباشر', text: 'الضو الخفيف وأكل المسا بيناسبوك.' } } },
  },
};

export const SENSE: Record<Lang, Record<number, Item>> = {
  en: {
    1: { name: 'Smell', text: 'You “sniff out” what’s right. A first impression, almost physical, tells you a lot.' },
    2: { name: 'Taste', text: 'You know things by tasting them: trying a little, then knowing.' },
    3: { name: 'Outer vision', text: 'You take in truth by watching. What you see around you speaks to you.' },
    4: { name: 'Inner vision', text: 'You see things in your mind’s eye. Images and pictures come before words.' },
    5: { name: 'Feeling', text: 'You pick up the atmosphere of a room or a person, and it’s usually right.' },
    6: { name: 'Touch', text: 'You understand through contact: being physically close, holding, doing.' },
  },
  ar: {
    1: { name: 'الشمّ', text: 'إنت "بتشمّ" الشي الصح. أول انطباع، تقريبًا جسدي، بيخبّرك كتير.' },
    2: { name: 'الذوق', text: 'بتعرف الأشيا لما تدوقها: بتجرّب شوي، وبعدين بتعرف.' },
    3: { name: 'النظر لبرّا', text: 'بتلقط الحقيقة بالمراقبة. يلي بتشوفو حواليك بيحكيك.' },
    4: { name: 'النظر لجوّا', text: 'بتشوف الأشيا بعين عقلك. الصور بتجي قبل الكلام.' },
    5: { name: 'الإحساس', text: 'بتلقط جوّ الغرفة أو الشخص، وغالبًا بتكون عحق.' },
    6: { name: 'اللمس', text: 'بتفهم بالقرب: إنك تكون قريب جسديًا، تمسك، تعمل.' },
  },
};

export const ENVIRONMENT: Record<Lang, Record<number, Item>> = {
  en: {
    1: { name: 'Caves', text: 'You feel safest with something solid at your back and a clear view of who comes in.', sides: { left: { name: 'Selective', text: 'Choose a few trusted people and spaces.' }, right: { name: 'Blending', text: 'You can settle into many spaces, as long as you feel protected.' } } },
    2: { name: 'Markets', text: 'You come alive where there’s exchange: people, trade, buzz.', sides: { left: { name: 'Internal', text: 'A market of your own: your shop, your studio, your people coming to you.' }, right: { name: 'External', text: 'Out in the world, moving between markets.' } } },
    3: { name: 'Kitchens', text: 'You thrive where things are made, mixed and transformed.', sides: { left: { name: 'Wet', text: 'Moist, warm, close places feel right.' }, right: { name: 'Dry', text: 'Clean, dry, airy places feel right.' } } },
    4: { name: 'Mountains', text: 'You do best with height and perspective: places where you can see far.', sides: { left: { name: 'Active', text: 'Lively heights: busy rooftops, energetic high places.' }, right: { name: 'Passive', text: 'Quiet heights where you can rest and observe.' } } },
    5: { name: 'Valleys', text: 'You feel at home in sheltered places between things, where you can see both sides.', sides: { left: { name: 'Narrow', text: 'Small, focused, intimate spaces.' }, right: { name: 'Wide', text: 'Open, spacious places with room to roam.' } } },
    6: { name: 'Shores', text: 'You belong at the edges: where two worlds meet, like land and water.', sides: { left: { name: 'Natural', text: 'Real nature: the sea, a lake, a riverbank.' }, right: { name: 'Artificial', text: 'Made edges: a terrace, a pool, a window on the city.' } } },
  },
  ar: {
    1: { name: 'المغاور', text: 'بتحسّ حالك بأمان لما يكون في شي صلب ورا ضهرك، وبتشوف مين داخل.', sides: { left: { name: 'انتقائي', text: 'اختار كم شخص ومطرح بتثق فيهن.' }, right: { name: 'مندمج', text: 'فيك ترتاح بمطارح كتير، طالما حاسس حالك محمي.' } } },
    2: { name: 'الأسواق', text: 'بتضوي بالمطارح يلي فيها أخد وعطا: ناس، بيع وشرا، حركة.', sides: { left: { name: 'داخلي', text: 'سوق إلك: محلّك، الستوديو تبعك، والناس بيجوا لعندك.' }, right: { name: 'خارجي', text: 'برّا بالعالم، بتتنقّل بين الأسواق.' } } },
    3: { name: 'المطابخ', text: 'بتزهر بالمطارح يلي فيها الأشيا عم تنعمل وتنخلط وتتحوّل.', sides: { left: { name: 'رطب', text: 'المطارح الدافية والقريبة بتريّحك.' }, right: { name: 'ناشف', text: 'المطارح النضيفة والناشفة والمهوّاية بتريّحك.' } } },
    4: { name: 'الجبال', text: 'بتكون بأحسن حالاتك بالعلو: مطارح بتشوف منها لبعيد.', sides: { left: { name: 'ناشط', text: 'علو فيه حياة: روف عجقة، مطارح عالية فيها طاقة.' }, right: { name: 'هادي', text: 'علو هادي بترتاح فيه وبتراقب.' } } },
    5: { name: 'الوديان', text: 'بتحسّ حالك ببيتك بالمطارح المحمية، بين شي وشي، وبتشوف الجهتين.', sides: { left: { name: 'ضيّق', text: 'مطارح صغيرة، مركّزة وحميمة.' }, right: { name: 'واسع', text: 'مطارح مفتوحة وواسعة فيك تتمشّى فيها.' } } },
    6: { name: 'الشطوط', text: 'مطرحك عالحفافي: وين بيلتقوا عالمين، متل الأرض والمي.', sides: { left: { name: 'طبيعي', text: 'طبيعة حقيقية: البحر، البحيرة، حفّة النهر.' }, right: { name: 'اصطناعي', text: 'حفافي معمولة: تراس، مسبح، شبّاك عالمدينة.' } } },
  },
};

export const PERSPECTIVE: Record<Lang, Record<number, Item>> = {
  en: {
    1: { name: 'Survival', text: 'You notice what keeps people safe and what could go wrong.' },
    2: { name: 'Possibility', text: 'You see what could be: openings, options, other ways.' },
    3: { name: 'Power', text: 'You notice where the energy and influence really sit.' },
    4: { name: 'Wanting', text: 'You notice what people long for, and what’s missing.' },
    5: { name: 'Probability', text: 'You weigh what’s likely: patterns, odds, what tends to happen.' },
    6: { name: 'Personal', text: 'You see through your own experience: what’s true for you, and for this person.' },
  },
  ar: {
    1: { name: 'البقاء', text: 'بتنتبه عشو بيحمي الناس وعشو ممكن يغلط.' },
    2: { name: 'الإمكانية', text: 'بتشوف شو ممكن يكون: فرص، خيارات، طرق تانية.' },
    3: { name: 'القوة', text: 'بتنتبه وين فعلًا موجودة الطاقة والتأثير.' },
    4: { name: 'الشوق', text: 'بتنتبه عشو الناس مشتاقين إلو، وشو ناقص.' },
    5: { name: 'الاحتمال', text: 'بتوزن شو الأرجح: أنماط، نسب، شو عادةً بيصير.' },
    6: { name: 'شخصي', text: 'بتشوف من خلال تجربتك: شو صحيح إلك، ولهالشخص بالذات.' },
  },
};

export const MOTIVATION: Record<Lang, Record<number, Item>> = {
  en: {
    1: { name: 'Fear', text: 'Underneath it all you’re driven to make things safe. Let that be care, not anxiety.' },
    2: { name: 'Hope', text: 'You’re moved by what could be better. Hope is your fuel.' },
    3: { name: 'Desire', text: 'You’re moved by wanting to lead, to go first, to make your mark.' },
    4: { name: 'Need', text: 'You’re moved by what’s genuinely needed: by you, or by the people around you.' },
    5: { name: 'Guilt', text: 'You’re moved by wanting to make things right. Let it be a compass, not a weight.' },
    6: { name: 'Innocence', text: 'You’re moved by curiosity and simplicity: doing things for their own sake.' },
  },
  ar: {
    1: { name: 'الخوف', text: 'بالعمق، بيحرّكك إنك تخلّي الأشيا آمنة. خلّيه اهتمام، مش قلق.' },
    2: { name: 'الأمل', text: 'بيحرّكك شو ممكن يصير أحسن. الأمل هوي وقودك.' },
    3: { name: 'الرغبة', text: 'بيحرّكك إنك تقود، تكون الأول، وتترك أثر.' },
    4: { name: 'الحاجة', text: 'بيحرّكك شو فعلًا مطلوب: إلك، أو للناس حواليك.' },
    5: { name: 'الذنب', text: 'بيحرّكك إنك تصلّح الأشيا. خلّيه بوصلة، مش حمل.' },
    6: { name: 'البراءة', text: 'بيحرّكك الفضول والبساطة: إنك تعمل الشي كرمال الشي نفسو.' },
  },
};

// Right Angle cross themes in Lebanese (the website's Arabic is formal).
export const RAX_THEME_AR: Record<string, string> = {
  'The Sphinx': 'الاتجاه. حياتك عن إنك تلاقي الطريق، تمسكو، وتدلّ عليه، إلك ولغيرك.',
  'Explanation': 'إنك تفهم الأشيا. إنت هون لتاخد يلي بتعرفو وتشرحو بطريقة بتغيّر كيف الناس بيشوفوا.',
  'Contagion': 'حماس بيعدي. تجاربك ويلي بتقدّمو بينتقلوا لكل يلي حواليك.',
  'The Sleeping Phoenix': 'الصحوة. حياتك رحلة من طريقة عيش لطريقة أحيا وأوعى.',
  'Planning': 'البنا للمستقبل. إنت هون لتخطّط وترتّب وتعمل أساسات بتسند الناس.',
  'Consciousness': 'الأنماط والفهم. إنت هون لتكتشف شو ثابت وشو لأ، وتجيب وضوح.',
  'Rulership': 'القيادة بالموارد وبالنعومة. حياتك عن الرعاية وكيف الناس بينقادوا.',
  'Eden': 'التعلّم بالتجربة. بتترك البراءة وراك لتجمع حكمة حقيقية، كتير مرات من عمق المشاعر.',
  'The Vessel of Love': 'الحب بكل أشكالو: حب الذات، حب الجسم، حب الإنسانية وحب الحياة.',
  'Service': 'إنك تحسّن العالم. إنت هون لتصلّح وتنقّي وتخدم الأنماط يلي بتخلّي الحياة أحسن.',
  'Tension': 'الصراع والعمق. حياتك عن الشد بين السيطرة والهدف، وشو بيكشف.',
  'Penetration': 'الاختراق. حياتك عن إنك توصل للجوهر، تصحّي حالك وغيرك بصدمة، وتغذّي الطموح بالحدس.',
  'Maya': 'التفكير والعقل. إنت هون لتكتشف أوهام العقل والحقيقة يلي تحتها.',
  'Laws': 'القيم والنظام. إنت هون لتفهم وتحمي القوانين والقيم يلي بتخلّي الحياة آمنة.',
  'The Unexpected': 'مفاجآت الحياة. طريقك بيتشكّل من يلي ما كنت قادر تخطّطلو، ومن كيف بتلاقيه.',
  'The Four Ways': 'الغريزة والذاكرة. بتتعلّم من الماضي ومن الناس، وبتحوّل هالشي لإرشاد.',
};
