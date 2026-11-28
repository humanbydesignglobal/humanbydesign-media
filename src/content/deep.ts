// Deeper reading content: the six profile lines in depth (as your conscious first number and your
// unconscious second number), plus short framing lines for the in-depth reading. EN + Lebanese AR.
export type Lang = 'en' | 'ar';
export interface LineDeep { core: string; gift: string; challenge: string; conscious: string; unconscious: string }

export const LINES_DEEP: Record<Lang, Record<string, LineDeep>> = {
  en: {
    '1': {
      core: 'Line 1 is the foundation. It needs to know how things work underneath before it can relax.',
      gift: 'You become an authority on what you study. People trust you because you have done the homework.',
      challenge: 'Insecurity when you feel you do not know enough. Rushing in without your research makes you anxious.',
      conscious: 'As your first number, you know you need depth. You read, ask and dig until you feel solid ground, and that is how you find your confidence.',
      unconscious: 'As your second number, your body quietly gathers information before it moves. Others see you as grounded and knowledgeable, even when you feel you are still learning.',
    },
    '2': {
      core: 'Line 2 is natural talent. It does things well without knowing exactly how, and it needs time alone.',
      gift: 'Natural gifts that others spot before you do. When you are called out to share them, you shine.',
      challenge: 'Being pulled out of your own world too often, or ignoring the calls that are right for you.',
      conscious: 'As your first number, you know you love your own space. You may not see your gifts clearly, and you can be surprised when people call you out for them.',
      unconscious: 'As your second number, others see a talent in you that you take for granted. Life keeps calling you out of your shell; the right calls are worth answering.',
    },
    '3': {
      core: 'Line 3 learns by doing. It tries, bumps into what does not work, and discovers what does.',
      gift: 'Resilience and real-world wisdom. You know what works because you have tested it yourself.',
      challenge: 'Feeling like a failure when things break. For you, mistakes are data, not proof you are wrong.',
      conscious: 'As your first number, you know you learn through trial and error. Changing direction, ending things and starting again are part of your path.',
      unconscious: 'As your second number, your body learns through experience, even when your mind wants a plan. Others may see a life full of twists; you are gathering what actually works.',
    },
    '4': {
      core: 'Line 4 is about people. Opportunities, love and work come through the network of people you already know.',
      gift: 'Warmth, loyalty and influence with the people close to you. Your circle opens doors.',
      challenge: 'Change can feel unsettling. You need a stable base before you let go of the old one.',
      conscious: 'As your first number, you know relationships matter most. You are friendly and loyal, and you prefer people you trust over strangers.',
      unconscious: 'As your second number, your body knows that your network carries you. Others feel your warmth and loyalty; new chances usually come through someone you already know.',
    },
    '5': {
      core: 'Line 5 is the problem solver others project onto. People expect you to save the day.',
      gift: 'Practical solutions that work for many. When your answer is real, your reputation grows.',
      challenge: 'Projections: people see a saviour in you, and when expectations are not met, they can turn.',
      conscious: 'As your first number, you know people look to you for answers. You can feel their projections and learn to choose which ones to carry.',
      unconscious: 'As your second number, others project onto you without you trying. Offer practical solutions, keep your reputation clean, and step back when the job is done.',
    },
    '6': {
      core: 'Line 6 lives in three stages: trial and error until about 30, stepping back to observe until about 50, then living as a role model.',
      gift: 'A wise, objective view of life. In time, people look to you as an example.',
      challenge: 'Feeling detached or out of step in the middle years. Trust that you are learning from a higher view.',
      conscious: 'As your first number, you know you are on a long arc. You are aware of the different chapters of your life and of the role model you are growing into.',
      unconscious: 'As your second number, your body moves through the three stages whether you plan it or not. Others sense a maturity in you, even when you feel you are still finding your way.',
    },
  },
  ar: {
    '1': {
      core: 'الخط 1 هوي الأساس. بدّو يعرف كيف الأشيا بتشتغل من تحت قبل ما يرتاح.',
      gift: 'بتصير مرجع بالشي يلي بتدرسو. الناس بيثقوا فيك لأنك عامل واجباتك.',
      challenge: 'عدم الأمان لما تحسّ إنك ما بتعرف كفاية. إنك تفوت بشي بلا بحث بيخلّيك قلقان.',
      conscious: 'كرقمك الأول، بتعرف إنك بحاجة عمق. بتقرا، بتسأل وبتحفر لحد ما تحسّ بأرض ثابتة، وهيك بتلاقي ثقتك.',
      unconscious: 'كرقمك التاني، جسمك بيجمع معلومات بهدوء قبل ما يتحرّك. الناس بيشوفوك ثابت وبتعرف، حتى لما تحسّ إنك بعدك عم تتعلّم.',
    },
    '2': {
      core: 'الخط 2 هوي الموهبة الطبيعية. بيعمل الأشيا منيح بلا ما يعرف بالزبط كيف، وبحاجة وقت لحالو.',
      gift: 'مواهب طبيعية الناس بيشوفوها قبلك. لما حدا يناديك لتشاركها، بتلمع.',
      challenge: 'إنك تنشدّ من عالمك كتير، أو تتجاهل النداءات يلي هيي فعلًا إلك.',
      conscious: 'كرقمك الأول، بتعرف إنك بتحبّ مساحتك. يمكن ما تشوف مواهبك بوضوح، وبتتفاجأ لما الناس ينادوك عشانها.',
      unconscious: 'كرقمك التاني، الناس بيشوفوا فيك موهبة إنت مش منتبهلها. الحياة بتضلّ تناديك تطلع من قوقعتك؛ النداءات الصح بتستاهل تجاوبها.',
    },
    '3': {
      core: 'الخط 3 بيتعلّم بالتجربة. بيجرّب، بيصطدم بيلي ما بيزبط، وبيكتشف شو بيزبط.',
      gift: 'صلابة وحكمة من الحياة الحقيقية. بتعرف شو بيزبط لأنك جرّبتو بحالك.',
      challenge: 'إنك تحسّ بالفشل لما الأشيا تنكسر. إلك، الغلطات معلومات، مش دليل إنك غلط.',
      conscious: 'كرقمك الأول، بتعرف إنك بتتعلّم بالتجربة والغلط. إنك تغيّر اتجاه، تسكّر أشيا وتبلّش من جديد، جزء من طريقك.',
      unconscious: 'كرقمك التاني، جسمك بيتعلّم بالخبرة، حتى لما عقلك بدّو خطّة. الناس ممكن يشوفوا حياة مليانة لفّات؛ إنت عم تجمع شو بيزبط فعلًا.',
    },
    '4': {
      core: 'الخط 4 كلّو عن الناس. الفرص، الحب والشغل بيجوا من شبكة الناس يلي بتعرفن أصلًا.',
      gift: 'دفا، وفا وتأثير عالناس القريبين منك. دايرتك بتفتح أبواب.',
      challenge: 'التغيير ممكن يخضّك. بحاجة أساس ثابت قبل ما تترك القديم.',
      conscious: 'كرقمك الأول، بتعرف إنو العلاقات أهم شي. إنت ودود ووفي، وبتفضّل ناس بتثق فيهن عالغربا.',
      unconscious: 'كرقمك التاني، جسمك بيعرف إنو شبكتك بتحملك. الناس بيحسّوا بدفاك ووفاك؛ الفرص الجديدة عادةً بتجي من حدا بتعرفو أصلًا.',
    },
    '5': {
      core: 'الخط 5 هوي يلي بيحلّ المشاكل، والناس بيعلّقوا عليه آمالن. بيتوقّعوا منك تنقذ الموقف.',
      gift: 'حلول عملية بتنفع كتير ناس. لما يكون جوابك حقيقي، سمعتك بتكبر.',
      challenge: 'الإسقاطات: الناس بيشوفوا فيك منقذ، ولما التوقّعات ما تتحقّق، ممكن ينقلبوا.',
      conscious: 'كرقمك الأول، بتعرف إنو الناس بيتطلّعوا عليك لأجوبة. بتحسّ بإسقاطاتن وبتتعلّم تختار أي وحدة تحمل.',
      unconscious: 'كرقمك التاني، الناس بيعلّقوا عليك آمال بلا ما تحاول. قدّم حلول عملية، حافظ على سمعتك نضيفة، وارجع لورا لما يخلص الشغل.',
    },
    '6': {
      core: 'الخط 6 بيعيش على تلات مراحل: تجربة وغلط لحد الـ30 تقريبًا، رجعة لورا ليراقب لحد الـ50، وبعدين بيعيش كقدوة.',
      gift: 'نظرة حكيمة وموضوعية عالحياة. مع الوقت، الناس بيشوفوك مثال.',
      challenge: 'إنك تحسّ بعيد أو مش عالإيقاع بالسنين يلي بالنص. إثق إنك عم تتعلّم من محل أعلى.',
      conscious: 'كرقمك الأول، بتعرف إنك على قوس طويل. واعي لفصول حياتك المختلفة وللقدوة يلي عم تكبر لتصيرها.',
      unconscious: 'كرقمك التاني، جسمك بيمرق بالمراحل التلاتة إن خطّطت أو لأ. الناس بيحسّوا فيك نضج، حتى لما تحسّ إنك بعدك عم تلاقي طريقك.',
    },
  },
};

export const DEEP_UI = {
  en: {
    chapterType: 'Your energy', chapterAuth: 'How you decide', chapterProfile: 'Your role in life', chapterDef: 'How your energy connects',
    chapterCentres: 'Your nine centres', chapterChannels: 'Your channels', chapterGates: 'Your gates, one by one',
    channelsLead: 'Channels are your consistent life forces: two gates joined, two centres linked. They work the same way every day.',
    noChannels: 'You have no channels, so all your centres are open. You are a Reflector: you sample everything around you.',
    gatesLead: 'Each gate is a specific gift. The planet tells you where it shows up in your life, the line how you live it.',
    conscious: 'Conscious', unconscious: 'Unconscious', gift: 'Gift', challenge: 'Challenge',
    yourDefined: 'Defined: what you can rely on', yourOpen: 'Open: where you take in and grow wise',
    whatHappens: 'How it works in you', trapL: 'Where it can trip you', wiseL: 'What it can make you wise in', askL: 'Ask yourself',
    circuit: (c: string) => `${c} circuit`,
    personalityL: 'Personality (black): what you know about yourself', designL: 'Design (red): what your body lives',
  },
  ar: {
    chapterType: 'طاقتك', chapterAuth: 'كيف بتاخد قراراتك', chapterProfile: 'دورك بالحياة', chapterDef: 'كيف طاقتك متّصلة',
    chapterCentres: 'مراكزك التسعة', chapterChannels: 'قنواتك', chapterGates: 'بواباتك، وحدة وحدة',
    channelsLead: 'القنوات هيي قوى الحياة الثابتة عندك: بوابتين موصولين، ومركزين مربوطين. بيشتغلوا بنفس الطريقة كل يوم.',
    noChannels: 'ما عندك قنوات، فكل مراكزك مفتوحة. إنت رفلكتور: بتدوق كل شي حواليك.',
    gatesLead: 'كل بوابة هدية محدّدة. الكوكب بيقلّك وين بتبيّن بحياتك، والخط كيف بتعيشها.',
    conscious: 'واعي', unconscious: 'لاواعي', gift: 'الهدية', challenge: 'التحدّي',
    yourDefined: 'معرّف: الشي يلي فيك تعتمد عليه', yourOpen: 'مفتوح: وين بتاخد وبتصير حكيم',
    whatHappens: 'كيف بيشتغل فيك', trapL: 'وين ممكن يوقّعك', wiseL: 'بشو ممكن يخلّيك حكيم', askL: 'اسأل حالك',
    circuit: (c: string) => `دايرة ${c}`,
    personalityL: 'الـPersonality (أسود): يلي بتعرفو عن حالك', designL: 'الـDesign (أحمر): يلي جسمك عم يعيشو',
  },
};
