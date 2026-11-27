// Hand-written app copy. English in Cici's voice; Arabic in casual Lebanese,
// with Human Design terms kept in English (written in Arabic letters).
import type { TypeId, AuthorityId, CentreId, ConnectionKind } from '../engine/hd';

type Lang = 'en' | 'ar';

export const TYPE_LABELS: Record<Lang, Record<TypeId, { name: string; strategy: string; signature: string; notSelf: string; gift: string }>> = {
  en: {
    Generator: { name: 'Generator', strategy: 'Wait to respond', signature: 'Satisfaction', notSelf: 'Frustration', gift: 'Steady, renewable life force' },
    'Manifesting Generator': { name: 'Manifesting Generator', strategy: 'Respond, then inform', signature: 'Satisfaction', notSelf: 'Frustration and anger', gift: 'Energy with speed' },
    Projector: { name: 'Projector', strategy: 'Wait for the invitation', signature: 'Success', notSelf: 'Bitterness', gift: 'Seeing people clearly' },
    Manifestor: { name: 'Manifestor', strategy: 'Inform before you act', signature: 'Peace', notSelf: 'Anger', gift: 'Starting things' },
    Reflector: { name: 'Reflector', strategy: 'Wait a lunar cycle', signature: 'Surprise', notSelf: 'Disappointment', gift: 'Mirroring what is true' },
  },
  ar: {
    Generator: { name: 'جنريتر', strategy: 'استنّى لتستجيب', signature: 'الرضا', notSelf: 'الإحباط', gift: 'طاقة حياة ثابتة بتتجدّد' },
    'Manifesting Generator': { name: 'مانفستنج جنريتر', strategy: 'استجيب، وبعدين خبّر', signature: 'الرضا', notSelf: 'الإحباط والعصبية', gift: 'طاقة ومعها سرعة' },
    Projector: { name: 'بروجكتور', strategy: 'استنّى الدعوة', signature: 'النجاح', notSelf: 'المرارة', gift: 'بيشوف الناس عحقيقتهن' },
    Manifestor: { name: 'مانفستر', strategy: 'خبّر قبل ما تتحرّك', signature: 'السلام', notSelf: 'العصبية', gift: 'بيبلّش الأشيا' },
    Reflector: { name: 'رفلكتور', strategy: 'استنّى دورة قمر', signature: 'المفاجأة', notSelf: 'خيبة الأمل', gift: 'مراية لكل شي صحيح' },
  },
};

export const AUTH_LABELS: Record<Lang, Record<AuthorityId, string>> = {
  en: {
    Emotional: 'Emotional', Sacral: 'Sacral', Splenic: 'Splenic', 'Ego Manifested': 'Ego Manifested',
    'Ego Projected': 'Ego Projected', 'Self-Projected': 'Self-Projected', Mental: 'Mental (environmental)', Lunar: 'Lunar',
  },
  ar: {
    Emotional: 'إيموشنال', Sacral: 'سكرال', Splenic: 'سبلينيك', 'Ego Manifested': 'إيغو مانفستد',
    'Ego Projected': 'إيغو بروجكتد', 'Self-Projected': 'سلف بروجكتد', Mental: 'منتل (من المحيط)', Lunar: 'لونار',
  },
};

export const CENTRE_LABELS: Record<Lang, Record<CentreId, string>> = {
  en: { Head: 'Head', Ajna: 'Ajna', Throat: 'Throat', G: 'G Centre', Heart: 'Heart', Spleen: 'Spleen', SolarPlexus: 'Solar Plexus', Sacral: 'Sacral', Root: 'Root' },
  ar: { Head: 'الهيد', Ajna: 'الأجنا', Throat: 'الثروت', G: 'الـG', Heart: 'الهارت', Spleen: 'السبلين', SolarPlexus: 'السولار بلكسس', Sacral: 'السكرال', Root: 'الروت' },
};

export const DEF_LABELS: Record<Lang, Record<string, string>> = {
  en: { 'No Definition': 'No Definition', 'Single Definition': 'Single Definition', 'Split Definition': 'Split Definition', 'Triple Split Definition': 'Triple Split', 'Quadruple Split Definition': 'Quadruple Split' },
  ar: { 'No Definition': 'No Definition', 'Single Definition': 'Single Definition', 'Split Definition': 'Split Definition', 'Triple Split Definition': 'Triple Split', 'Quadruple Split Definition': 'Quadruple Split' },
};

// Arabic channel meanings (English comes from the website's guide).
export const CHANNEL_AR: Record<string, string> = {
  '1-8': 'قدوة مبدعة. لما تعمل الشي عطريقتك، بتلهم غيرك يلاقي طريقتو.',
  '2-14': 'إنت حامل المفتاح: بتعرف لوين لازم تروح الطاقة والمصاري، ولما تمشي عاتجاهك الصح بتفتح بواب.',
  '3-60': 'طاقة التغيير. الجديد بيطلع منك عدفعات، مش بخط مستقيم. الصبر عالفترات الهادية جزء من الهدية.',
  '4-63': 'عقل منطقي بيشكّ وبيلاقي أجوبة. عظيم لتفهم الأنماط، بس الأجوبة إلها تتجرّب قبل ما تصير قوانين.',
  '5-15': 'إيقاع طبيعي متل الطبيعة. لما تحترم روتينك وتوقيتك، كل شي حواليك بيلاقي مجراه.',
  '6-59': 'قرب وحميمية. بتعرف تفتح قلوب الناس وتعمل علاقات حقيقية، بس اختار مين بتقرّب منّو.',
  '7-31': 'قيادة طبيعية. الناس بيسمعولك لما ينطلب رأيك، وهيك تأثيرك بيكون أقوى.',
  '9-52': 'تركيز عميق. فيك تقعد عشي واحد لوقت طويل، طالما هالشي فعلًا بيعنيلك.',
  '10-20': 'إنك تكون إنت، هلّق. بتعيش وبتحكي من مكان حقيقي، وهيدا بيصحّي غيرك.',
  '10-34': 'قوة بتمشي ورا قناعاتك. بتكون بأحلى حالاتك لما تعمل الشي يلي مقتنع فيه، عطريقتك.',
  '10-57': 'حدس بيحميك. جسمك بيعرف شو صح إلك بالزبط، حتى قبل ما تفهم ليش.',
  '11-56': 'حكواتي. عندك أفكار وقصص بتحرّك الناس، وفيك تعطي معنى لتجاربهن.',
  '12-22': 'تعبير بيطلع من القلب. بتكون مؤثّر كتير لما تكون بمزاج منيح، فاحكي بالوقت الصح.',
  '13-33': 'الشاهد. بتسمع قصص الناس وبتحفظ الذكريات، ولما تاخد وقت تراجعها بتطلع بحكمة.',
  '16-48': 'موهبة بتعمق مع التمرين. كل ما تكرّر وتتقن، بتصير خبرتك عميقة وما بتنتسى.',
  '17-62': 'بتشوف الأنماط وبتعرف تشرحها بالتفاصيل. رأيك قيّم لما حدا يطلبو.',
  '18-58': 'عين بتشوف شو بدّو تصليح. فرحتك إنك تحسّن الأشيا، بس خلّي انتقادك بمحلّو.',
  '19-49': 'حساسية للحاجات الحقيقية. بتعرف شو الناس محتاجين، وبتحب تحافظ عالمبادئ يلي بتجمعهن.',
  '20-34': 'مشغول ومنتج طول الوقت. بتعمل كتير بسرعة، والسرّ إنك تختار الأشيا يلي جسمك قال إلها إيه.',
  '20-57': 'حدس بيحكي باللحظة. بتلقط الأشيا قبل الكل، فثق بأول إحساس.',
  '21-45': 'إدارة وموارد. بتعرف تمسك المصاري والقرارات وتدبّر الكل، بس خلّي حدا يطلب منك تمسك.',
  '23-43': 'عبقري بيشوف شي جديد. أفكارك سابقة وقتها، فاشرحها بس لما الناس يكونوا جاهزين يسمعوا.',
  '24-61': 'عقل بيفكّر بالأسئلة الكبيرة. الإلهام بيجي فجأة، ما تضغط عحالك لتلاقي الجواب.',
  '25-51': 'شجاعة لتنط عالمجهول. الصدمات بتصقلك، وبتعلّم غيرك كيف يكون شجاع.',
  '26-44': 'بتعرف تقنع وتبيع، وبتتذكّر شو صار من قبل. استعمل هالموهبة بصدق وبتربح ثقة الكل.',
  '27-50': 'بتهتم بالناس وبتحميهن. قيمك قوية، بس انتبه ما تعطي كل شي وتنسى حالك.',
  '28-38': 'بتحارب لشي إلو معنى. الصعوبات بتصير حكمة لما تكون عم تحارب للشي الصح.',
  '29-46': 'لما تقول إيه لشي، بتعطيه كلّك، وبتلاقي حالك بالمكان الصح بالوقت الصح.',
  '30-41': 'أحلام وتجارب جديدة. بتحس بالأشيا بعمق، وكل تجربة إلها طعمها.',
  '32-54': 'طموح وتحوّل. بتعرف شو بيستاهل وقتك وتعبك، وبتطلع لفوق خطوة خطوة.',
  '34-57': 'قوة بتستجيب للخطر وللفرصة باللحظة. جسمك بيعرف يتصرّف قبل راسك.',
  '35-36': 'جوعان لتجارب جديدة. كل تجربة بتعلّمك شي، حتى يلي ما زبطت.',
  '37-40': 'إنت عمود العيلة والمجتمع. بتعطي وبتتعب، بس لازم يكون في توازن بين يلي بتعطيه ويلي بتاخدو.',
  '39-55': 'مزاج وروح. بتحرّك مشاعر الناس، ومزاجك عندو إيقاع، فما تحاسب حالك عليه.',
  '42-53': 'بتبلّش وبتكمّل للآخر. كل دورة بحياتك بتنضّجك، فما تقطع النص.',
  '47-64': 'عقل بيرتّب الصور والذكريات لحتى تطلع منها معنى. الوضوح بيجي مع الوقت.',
};

// One short practice a day, rotated, by type.
export const DAILY: Record<Lang, Record<TypeId, string[]>> = {
  en: {
    Generator: [
      'Before you say yes today, check your gut. Did it make a sound before your head made a plan?',
      'Notice one thing that lights you up today and give it a little more of your energy.',
      'Frustration is information, not failure. If it shows up today, ask what you never really said yes to.',
      'Let something come to you today instead of chasing it. A message, an idea, an ask.',
      'Spend your steady energy today on one thing you actually enjoy, and notice how long it lasts.',
      'Try answering one question today with only "uh-huh" or "uh-uh". Your body knows first.',
      'You are allowed to quit what drains you. Satisfaction is the compass, not obligation.',
    ],
    'Manifesting Generator': [
      'Respond first, then tell the people it affects. One sentence is enough.',
      'Skipping steps is your gift. Just go back for the one that matters.',
      'You are allowed to have many passions. Follow the one your gut answers today.',
      'If you feel frustrated or angry today, check: did I respond, and did I inform?',
      'Move your body today. Your energy needs somewhere to go.',
      'Notice when you jump in before anything asked for you. Pause for one breath.',
      'Changing your mind is not failure. It is how you find the fastest path.',
    ],
    Projector: [
      'Rest before you are tired today, not after. Your energy is borrowed, so treat it gently.',
      'Hold your advice until someone asks. Notice how differently it lands.',
      'Recognition matters for you. Spend time today with people who actually see you.',
      'Bitterness is a signal, not a flaw. If it shows up, ask where you were not invited.',
      'Study what fascinates you. Your mastery is what gets you invited.',
      'You do not have to keep up with Generators. Do less, see more.',
      'Lie down before you sleep tonight and let the day leave your body.',
    ],
    Manifestor: [
      'Before your next move, tell the people it affects. Not for permission. Just to inform.',
      'Follow the urge to start something today. You are built to initiate.',
      'Anger is a signal. If it shows up, ask where you felt controlled.',
      'Rest when the urge goes quiet. Your energy comes in bursts.',
      'You do not need anyone to approve your idea. You do need to tell them it is coming.',
      'Give yourself space today. Your aura needs room to breathe.',
      'Peace is the goal. Notice what gives you peace and protect it.',
    ],
    Reflector: [
      'Notice how today feels different from yesterday. That is the moon moving through you.',
      'Where you are matters more than anything. Choose your rooms well today.',
      'Big decision? Give it a full lunar cycle. Talk it out with people you trust.',
      'Disappointment is a signal. If it shows up, ask whose energy you are carrying.',
      'Spend time alone today to feel which feelings are yours.',
      'You are rare. You do not have to be consistent like everyone else.',
      'Surprise is your signature. Look for one small surprise today.',
    ],
  },
  ar: {
    Generator: [
      'قبل ما تقول إيه اليوم، شيّك عبطنك. طلع منّو صوت قبل ما راسك يعمل خطة؟',
      'لاحظ شي واحد بيشعلك اليوم، وعطيه شوي زيادة من طاقتك.',
      'الإحباط معلومة، مش فشل. إذا طلع اليوم، اسأل حالك شو الشي يلي ما قلتلو إيه من قلبك.',
      'خلّي شي يجيك اليوم بدل ما تركض وراه. رسالة، فكرة، طلب.',
      'اصرف طاقتك اليوم عشي واحد بتحبّو فعلًا، ولاحظ قديش بتضلّ معك.',
      'جرّب اليوم تجاوب عسؤال بـ"إمم إيه" أو "إمم لأ" بس. جسمك بيعرف قبلك.',
      'مسموحلك تترك يلي عم يستنزفك. الرضا هوي البوصلة، مش الواجب.',
    ],
    'Manifesting Generator': [
      'استجيب أول شي، وبعدين خبّر الناس يلي بيتأثّروا. جملة وحدة بتكفّي.',
      'إنك تنط عالخطوات هيدي هديتك. بس ارجع عالخطوة يلي فعلًا مهمّة.',
      'مسموحلك يكون عندك كذا شغف. لحاق الشي يلي بطنك بيجاوبلو اليوم.',
      'إذا حسّيت بإحباط أو عصبية اليوم، شيّك: استجبت؟ وخبّرت؟',
      'حرّك جسمك اليوم. طاقتك بدها محل تروح عليه.',
      'لاحظ لما تفوت بشي قبل ما حدا يطلبك. وقّف نَفَس واحد.',
      'إنك تغيّر رأيك مش فشل. هيك بتلاقي أسرع طريق.',
    ],
    Projector: [
      'ارتاح قبل ما تتعب اليوم، مش بعدين. طاقتك مستعارة، فدلّعها.',
      'خلّي نصيحتك معك لحد ما حدا يسألك. لاحظ قديش بتوقع غير.',
      'إنو حدا يشوفك مهم إلك. اقضي وقت اليوم مع ناس فعلًا بيشوفوك.',
      'المرارة إشارة، مش عيب فيك. إذا طلعت، اسأل حالك وين ما كنت معزوم.',
      'ادرس الشي يلي بيسحرك. خبرتك هيي يلي بتجيبلك الدعوات.',
      'مش مضطر تلحق الجنريتر. اعمل أقل، وشوف أكتر.',
      'تمدّد شوي قبل النوم الليلة، وخلّي النهار يطلع من جسمك.',
    ],
    Manifestor: [
      'قبل حركتك الجاية، خبّر الناس يلي بتأثّر عليهن. مش لتاخد إذن، بس لتخبّر.',
      'لحاق الرغبة إنك تبلّش شي اليوم. إنت مخلوق لتبادر.',
      'العصبية إشارة. إذا طلعت، اسأل حالك وين حسّيت إنو حدا عم يتحكّم فيك.',
      'ارتاح لما الرغبة تهدا. طاقتك بتجي دفعات.',
      'ما بدك حدا يوافق عفكرتك. بس بدك تخبّرهن إنها جايي.',
      'عطي حالك مساحة اليوم. الهالة تبعك بدها محل تتنفّس.',
      'السلام هوي الهدف. لاحظ شو بيعطيك سلام واحميه.',
    ],
    Reflector: [
      'لاحظ قديش اليوم غير عن مبارح. هيدا القمر عم يمرق فيك.',
      'المكان يلي إنت فيه أهم من كل شي. اختار مطارحك منيح اليوم.',
      'في قرار كبير؟ عطيه دورة قمر كاملة. احكي فيه مع ناس بتثق فيهن.',
      'خيبة الأمل إشارة. إذا طلعت، اسأل حالك طاقة مين عم تحمل.',
      'اقضي وقت لحالك اليوم لتحسّ أيّا مشاعر إلك.',
      'إنت نادر. مش مضطر تكون ثابت متل الكل.',
      'المفاجأة هيي إشارتك. فتّش عمفاجأة صغيرة اليوم.',
    ],
  },
};

// How to be with someone of each type (shown on a person's page).
export const WITH_TYPE: Record<Lang, Record<TypeId, string>> = {
  en: {
    Generator: 'Ask them yes-or-no questions and trust the gut answer. Do not ask them to start things from scratch. Bring them something to respond to.',
    'Manifesting Generator': 'Let them move fast and change direction. Ask them to tell you before they leap, and do not take the speed personally.',
    Projector: 'Invite them in and ask what they see. Their insight is a gift when it is asked for. Let them rest without guilt.',
    Manifestor: 'Give them space and do not try to control them. Ask them to keep you informed, and you will both have peace.',
    Reflector: 'Give them time on big decisions, about a month. The places and people you bring them into matter enormously.',
  },
  ar: {
    Generator: 'اسألهن أسئلة جوابها إيه أو لأ، وثق بجواب البطن. ما تطلب منهن يبلّشوا شي من الصفر. جبلهن شي يستجيبولو.',
    'Manifesting Generator': 'خلّيهن يتحرّكوا بسرعة ويغيّروا اتجاههن. اطلب منهن يخبّروك قبل ما ينطّوا، وما تاخد السرعة عالشخصي.',
    Projector: 'اعزمهن واسألهن شو شايفين. نظرتهن هدية لما تنطلب. خلّيهن يرتاحوا بلا ذنب.',
    Manifestor: 'عطيهن مساحة وما تحاول تتحكّم فيهن. اطلب منهن يخبّروك، وبيكون في سلام بينكن.',
    Reflector: 'عطيهن وقت بالقرارات الكبيرة، شي شهر. المطارح والناس يلي بتاخدهن لعندهن مهمّين كتير.',
  },
};

export const CONNECTION_TEXT: Record<Lang, Record<ConnectionKind, { title: string; text: string }>> = {
  en: {
    spark: { title: 'Spark', text: 'Each of you brings one half of this channel. Together it switches on. This is attraction and chemistry, and sometimes friction.' },
    shared: { title: 'Common ground', text: 'You both have this whole channel. It feels easy and familiar, like friendship.' },
    teach: { title: 'One leads', text: 'One of you has this whole channel and the other has none of it. One brings the energy, the other learns to follow it.' },
    bend: { title: 'One bends', text: 'One has the whole channel, the other has only half. The half can feel overruled here, so go gently.' },
  },
  ar: {
    spark: { title: 'شرارة', text: 'كل واحد منكن معو نص هالقناة. سوا بتضوي. هيدا انجذاب وكيمياء، وأوقات شوية احتكاك.' },
    shared: { title: 'أرض مشتركة', text: 'الاتنين معكن القناة كاملة. بتحسّوها سهلة ومألوفة، متل الصحبة.' },
    teach: { title: 'واحد بيقود', text: 'واحد منكن معو القناة كاملة، والتاني ما معو شي منها. واحد بيجيب الطاقة، والتاني بيتعلّم يمشي معها.' },
    bend: { title: 'واحد بيتنازل', text: 'واحد معو القناة كاملة، والتاني معو نصها بس. صاحب النص ممكن يحس إنو مش مسموع هون، فبالراحة.' },
  },
};
