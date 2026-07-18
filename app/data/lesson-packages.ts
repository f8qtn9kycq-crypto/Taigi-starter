import type { LessonPackage, LessonPackagePhrase } from "../types/lesson-package";
import type { LessonSource, LocalizedText } from "../types/lesson";

const moeSource = (canonicalUrl: string): LessonSource => ({
  title: {
    zh: "教育部《臺灣台語常用詞辭典》",
    en: "MOE Dictionary of Frequently-Used Taiwan Taigi",
  },
  canonicalUrl,
  license: "CC BY-ND 3.0 TW",
  licenseUrl: "https://creativecommons.org/licenses/by-nd/3.0/tw/",
  speaker: null,
});

const audioPending: LessonPackagePhrase["audio"] = {
  status: "not-yet-added",
  note: {
    zh: "尚未加入產品音檔；完成教師確認、來源核對與原檔授權檢查後才可串接。",
    en: "No product audio yet; add it only after teacher review, source verification, and an original-file licence check.",
  },
};

const makePhrase = (
  phrase: Omit<LessonPackagePhrase, "audio">,
): LessonPackagePhrase => ({ ...phrase, audio: audioPending });

const stagePlan: readonly LocalizedText[] = [
  { zh: "聽：先辨認關鍵詞的聲音", en: "Hear: recognize the key words by sound" },
  { zh: "看：連結漢字與台羅", en: "See: connect Han characters and Tâi-lô" },
  { zh: "講：用短詞組跟讀", en: "Say: repeat a short phrase" },
  { zh: "記：不看答案回想意思", en: "Recall: remember the meaning before checking" },
  { zh: "用：放進自己的生活情境", en: "Use: place it in an everyday context" },
];

const teacherChecks: readonly LocalizedText[] = [
  { zh: "確認漢字、台羅與可接受讀音變體", en: "Confirm Han characters, Tâi-lô, and acceptable pronunciation variants" },
  { zh: "確認初學者語境自然，避免只背孤立字詞", en: "Confirm the beginner context is natural rather than isolated memorization" },
  { zh: "確認音檔為未修改原檔，並保留完整 attribution", en: "Confirm audio remains an unmodified original with complete attribution" },
];

export const lessonPackages: readonly LessonPackage[] = [
  {
    id: "lesson-2-family-package",
    number: 2,
    title: { zh: "阮兜的人", en: "My family" },
    secondaryTitle: { zh: "My family", en: "阮兜的人" },
    summary: {
      zh: "從自己的家開始，認識三個日常家庭詞。",
      en: "Start with home and learn three everyday family words.",
    },
    objective: {
      zh: "學習者能聽懂並說出「阮兜、阿母、阿爸」，知道稱謂和描述用法的差別。",
      en: "Learners can hear and say guán tau, a-bú, and a-pah, and distinguish address terms from descriptions.",
    },
    status: "planned",
    stagePlan,
    phrases: [
      {
        id: "lesson-2-family-home",
        hanji: "阮兜",
        tailo: "Guán tau",
        poj: null,
        meaning: { zh: "我家／我們家", en: "my home / our home" },
        cultureNote: {
          zh: "教育部詞條「兜」的用例是「阮兜」；這裡先保留完整詞組，避免只教孤立的「兜」。",
          en: "The MOE entry for tau uses guán tau as its example; keep the full phrase instead of teaching tau in isolation.",
        },
        source: moeSource("https://sutian.moe.edu.tw/zh-hant/su/6917/"),
        audio: audioPending,
      },
      {
        id: "lesson-2-family-mother",
        hanji: "阿母",
        tailo: "A-bú",
        poj: null,
        meaning: { zh: "媽媽；常用作面稱", en: "mother; commonly used when addressing her" },
        cultureNote: {
          zh: "教育部列「a-bú」為主音讀，也列出「a-bó」的又唸；上線前需由教師決定呈現方式。",
          en: "The MOE lists a-bú as the main reading and a-bó as another reading; a teacher should decide how to present the variant.",
        },
        source: moeSource("https://sutian.moe.edu.tw/zh-hant/su/4524/"),
        audio: audioPending,
      },
      {
        id: "lesson-2-family-father",
        hanji: "阿爸",
        tailo: "A-pah",
        poj: null,
        meaning: { zh: "爸爸；子女對父親的稱呼", en: "father; a child’s term of address for their father" },
        cultureNote: {
          zh: "教育部列「a-pah」為主音讀，並記錄 a-pa、a-pâ 等變體；不先把變體當成錯誤。",
          en: "The MOE lists a-pah as the main reading and records a-pa and a-pâ as variants; do not treat the variants as errors.",
        },
        source: moeSource("https://sutian.moe.edu.tw/und-hani/su/4558/"),
        audio: audioPending,
      },
    ],
    teacherReview: { status: "required", checks: teacherChecks },
  },
  {
    id: "lesson-3-numbers-package",
    number: 3,
    title: { zh: "一二三", en: "One, two, three" },
    secondaryTitle: { zh: "One, two, three", en: "一二三" },
    summary: {
      zh: "用最小的一組數字練習節奏、辨音和簡單數數。",
      en: "Use the smallest set of numbers to practice rhythm, listening, and simple counting.",
    },
    objective: {
      zh: "學習者能辨認並說出一、二、三，並知道「二」在不同腔口可能有不同讀音。",
      en: "Learners can recognize and say one, two, and three, and know that two has regional readings.",
    },
    status: "planned",
    stagePlan,
    phrases: [
      {
        id: "lesson-3-numbers-one",
        hanji: "一",
        tailo: "Tsi̍t",
        poj: null,
        meaning: { zh: "一；數字", en: "one; the number" },
        cultureNote: {
          zh: "教育部詞條把「tsi̍t」列為主音讀，並另列「it」；此 package 先以白讀主音讀為主。",
          en: "The MOE lists tsi̍t as the main reading and also records it; this package starts with the colloquial main reading.",
        },
        source: moeSource("https://sutian.moe.edu.tw/zh-hant/su/1/"),
        audio: audioPending,
      },
      {
        id: "lesson-3-numbers-two",
        hanji: "二",
        tailo: "Jī / lī",
        poj: null,
        meaning: { zh: "二；數字", en: "two; the number" },
        cultureNote: {
          zh: "教育部記錄「jī、lī」及不同地區的讀音；正式課程需要教師決定主要示範音與變體呈現順序。",
          en: "The MOE records jī, lī, and regional readings; the final lesson needs a teacher-approved primary model and variant order.",
        },
        source: moeSource("https://sutian.moe.edu.tw/und-hani/su/44/"),
        audio: audioPending,
      },
      {
        id: "lesson-3-numbers-three",
        hanji: "三",
        tailo: "Sann",
        poj: null,
        meaning: { zh: "三；數字", en: "three; the number" },
        cultureNote: {
          zh: "教育部詞條列「sann」為白讀主音讀，另有文讀 sam、sàm；初學課先聚焦白讀。",
          en: "The MOE lists sann as the colloquial main reading and also records literary readings sam and sàm; the beginner lesson focuses on sann first.",
        },
        source: moeSource("https://sutian.moe.edu.tw/zh-hant/su/163/"),
        audio: audioPending,
      },
    ],
    teacherReview: { status: "required", checks: teacherChecks },
  },
  {
    id: "lesson-4-food-and-drink-package",
    number: 4,
    title: { zh: "食飯佮飲水", en: "Food and drink" },
    secondaryTitle: { zh: "Food and drink", en: "食飯佮飲水" },
    summary: {
      zh: "從吃飯和喝水開始，辨認台語裡不同的飲食說法。",
      en: "Start with eating and drinking, and notice how Taigi expresses both.",
    },
    objective: {
      zh: "學習者能聽懂並說出「食飯、啉水、食茶」，知道「食」和「啉」在飲食語境中的差異。",
      en: "Learners can hear and say tsia̍h-pn̄g, lim tsuí, and tsia̍h-tê, and notice the contextual difference between tsia̍h and lim.",
    },
    status: "planned",
    stagePlan,
    phrases: [
      {
        id: "lesson-4-food-and-drink-meal",
        hanji: "食飯",
        tailo: "Tsia̍h-pn̄g",
        poj: null,
        meaning: { zh: "吃飯；用餐", en: "eat rice; have a meal" },
        cultureNote: {
          zh: "教育部「飯」詞條以「食飯」作為吃飯的用例，適合延續第 1 課從日常關心進入生活語境。",
          en: "The MOE entry for pn̄g uses tsia̍h-pn̄g as its example for eating a meal, connecting naturally to everyday life after Lesson 1.",
        },
        source: moeSource("https://sutian.moe.edu.tw/zh-hant/su/9222/"),
        audio: audioPending,
      },
      {
        id: "lesson-4-food-and-drink-water",
        hanji: "啉水",
        tailo: "Lim tsuí",
        poj: null,
        meaning: { zh: "喝水", en: "drink water" },
        cultureNote: {
          zh: "教育部「啉」詞條直接以「啉水」作為喝水的用例，也註明「啉」有喝、飲的意思。",
          en: "The MOE entry for lim directly uses lim tsuí as its example and defines lim as to drink.",
        },
        source: moeSource("https://sutian.moe.edu.tw/zh-hant/su/7018/"),
        audio: audioPending,
      },
      {
        id: "lesson-4-food-and-drink-tea",
        hanji: "食茶",
        tailo: "Tsia̍h-tê",
        poj: null,
        meaning: { zh: "喝茶", en: "drink tea" },
        cultureNote: {
          zh: "教育部「食」詞條列出「食茶」作為喝茶的用例；這是很適合在課堂中比較「食」和「啉」的真實語料。",
          en: "The MOE entry for tsia̍h lists tsia̍h-tê as an example for drinking tea, making it useful for comparing tsia̍h and lim in context.",
        },
        source: moeSource("https://sutian.moe.edu.tw/zh-hant/su/5570/"),
        audio: audioPending,
      },
    ],
    teacherReview: { status: "required", checks: teacherChecks },
  },
  {
    id: "lesson-5-daily-routine-package",
    number: 5,
    title: { zh: "今仔日的日常", en: "Today’s routine" },
    secondaryTitle: { zh: "Today’s routine", en: "今仔日的日常" },
    summary: {
      zh: "用今天、早上和做事三個詞，說出一點自己的日常。",
      en: "Use today, morning, and doing things to describe a little of daily life.",
    },
    objective: {
      zh: "學習者能理解「今仔日、早起、做代誌」，並用短句說出今天早上的一件事。",
      en: "Learners can understand kin-á-ji̍t, tsá-khí, and tsò tāi-tsì, then say one thing they did this morning.",
    },
    status: "planned",
    stagePlan,
    phrases: [
      {
        id: "lesson-5-daily-today",
        hanji: "今仔日",
        tailo: "Kin-á-ji̍t / kin-á-li̍t",
        poj: null,
        meaning: { zh: "今天、今日", en: "today" },
        cultureNote: {
          zh: "教育部詞條列「kin-á-ji̍t、kin-á-li̍t」兩種讀音；課程需要教師決定主要示範音，再保留另一種作為可接受變體。",
          en: "The MOE entry lists kin-á-ji̍t and kin-á-li̍t; a teacher should choose the primary model while keeping the other as an acceptable variant.",
        },
        source: moeSource("https://sutian.moe.edu.tw/zh-hant/su/629/"),
        audio: audioPending,
      },
      {
        id: "lesson-5-daily-morning",
        hanji: "早起",
        tailo: "Tsá-khí",
        poj: null,
        meaning: { zh: "早上、早晨；早餐", en: "morning; breakfast" },
        cultureNote: {
          zh: "教育部詞條同時收錄「早起」作為早上和早餐，提醒課程要用情境幫助初學者分辨意思。",
          en: "The MOE entry uses tsá-khí for both morning and breakfast, so the lesson should use context to make the meaning clear.",
        },
        source: moeSource("https://sutian.moe.edu.tw/zh-hant/su/2517/"),
        audio: audioPending,
      },
      {
        id: "lesson-5-daily-work",
        hanji: "做代誌",
        tailo: "Tsò tāi-tsì",
        poj: null,
        meaning: { zh: "做事情；做事", en: "do things; carry out a task" },
        cultureNote: {
          zh: "教育部詞典收錄「代誌 tāi-tsì」並提供例句；這裡先把「做代誌」當成可放入短句的生活詞組，不延伸成職業或工作專門術語。",
          en: "The MOE dictionary lists tāi-tsì and provides an example; keep tsò tāi-tsì as an everyday phrase for short sentences rather than turning it into a job-specific term.",
        },
        source: moeSource("https://sutian.moe.edu.tw/zh-hant/su/1370/"),
        audio: audioPending,
      },
    ],
    teacherReview: { status: "required", checks: teacherChecks },
  },
  {
    id: "lesson-6-weather-and-feelings-package",
    number: 6,
    title: { zh: "天氣佮感受", en: "Weather and feelings" },
    secondaryTitle: { zh: "Weather and feelings", en: "天氣佮感受" },
    summary: {
      zh: "從天氣開始，練習用簡單形容詞表達感受。",
      en: "Start with the weather and practice simple words for how it feels.",
    },
    objective: {
      zh: "學習者能說出天氣、熱和冷，並用短句描述今天的感受。",
      en: "Learners can say weather, hot, and cold, then describe how today feels in a short phrase.",
    },
    status: "planned",
    stagePlan,
    phrases: [
      makePhrase({
        id: "lesson-6-weather-weather",
        hanji: "天氣",
        tailo: "Thinn-khì",
        poj: null,
        meaning: { zh: "天候、天氣", en: "weather" },
        cultureNote: {
          zh: "教育部例句把「今仔日天氣無好」和出門帶雨衣放在一起，適合教成生活中的提醒，而不是抽象名詞。",
          en: "An MOE example connects bad weather today with taking a raincoat, so teach this as a practical everyday reminder rather than an abstract noun.",
        },
        source: moeSource("https://sutian.moe.edu.tw/zh-hant/su/1028/"),
      }),
      makePhrase({
        id: "lesson-6-weather-hot",
        hanji: "熱",
        tailo: "Jua̍h / lua̍h",
        poj: null,
        meaning: { zh: "熱；溫度高的感覺", en: "hot; the feeling of high temperature" },
        cultureNote: {
          zh: "教育部列「jua̍h、lua̍h」兩種白讀，並以「今仔日真熱」示範；上線前需決定主要示範音。",
          en: "The MOE lists jua̍h and lua̍h as colloquial readings and demonstrates kin-á-ji̍t tsin jua̍h; the primary model still needs teacher approval.",
        },
        source: moeSource("https://sutian.moe.edu.tw/zh-hant/su/11204/"),
      }),
      makePhrase({
        id: "lesson-6-weather-cold",
        hanji: "冷",
        tailo: "Líng",
        poj: null,
        meaning: { zh: "冷；溫度低", en: "cold; low in temperature" },
        cultureNote: {
          zh: "教育部把「冷」的氣候意思和冷水、冷飯用例放在一起，課程要先固定在溫度語境。",
          en: "The MOE includes climate, cold water, and cold rice examples; keep this beginner package focused on the temperature meaning first.",
        },
        source: moeSource("https://sutian.moe.edu.tw/zh-hant/su/2874/"),
      }),
    ],
    teacherReview: { status: "required", checks: teacherChecks },
  },
  {
    id: "lesson-7-directions-package",
    number: 7,
    title: { zh: "去佗位", en: "Where are you going?" },
    secondaryTitle: { zh: "Where are you going?", en: "去佗位" },
    summary: {
      zh: "用哪裡、去、路，練習最基本的方向對話。",
      en: "Use where, go, and road to practice a first directions exchange.",
    },
    objective: {
      zh: "學習者能聽懂「你欲去佗？」並用來去或路的詞組回應方向。",
      en: "Learners can understand lí beh khì toh? and respond with a simple destination or route phrase.",
    },
    status: "planned",
    stagePlan,
    phrases: [
      makePhrase({
        id: "lesson-7-directions-where",
        hanji: "去佗",
        tailo: "Khì toh",
        poj: null,
        meaning: { zh: "去哪裡", en: "go where" },
        cultureNote: {
          zh: "教育部「佗」詞條直接以「你欲去佗？」示範；這裡保留問句語境，避免只背「佗」的字義。",
          en: "The MOE entry for toh directly demonstrates lí beh khì toh?; keep the question context instead of teaching toh as an isolated translation.",
        },
        source: moeSource("https://sutian.moe.edu.tw/zh-hant/su/2863/"),
      }),
      makePhrase({
        id: "lesson-7-directions-go-together",
        hanji: "來去",
        tailo: "Lâi-khì",
        poj: null,
        meaning: { zh: "去、前往；也可表示告辭", en: "go; head somewhere; also used when saying goodbye" },
        cultureNote: {
          zh: "教育部說明「來去」可表示前往，也可表示離開此處；教材要以第一人稱意願句示範，避免混淆。",
          en: "The MOE explains that lâi-khì can mean going somewhere or leaving; demonstrate it with a first-person intention sentence to reduce confusion.",
        },
        source: moeSource("https://sutian.moe.edu.tw/zh-hant/su/3538/"),
      }),
      makePhrase({
        id: "lesson-7-directions-road",
        hanji: "路",
        tailo: "Lōo",
        poj: null,
        meaning: { zh: "道路；路程", en: "road; route or distance" },
        cultureNote: {
          zh: "教育部詞條同時收錄道路、路程和方法等意思；初學 package 先限制在道路與路線。",
          en: "The MOE entry covers road, distance, and method; this beginner package limits it to roads and routes first.",
        },
        source: moeSource("https://sutian.moe.edu.tw/zh-hant/su/10136/"),
      }),
    ],
    teacherReview: { status: "required", checks: teacherChecks },
  },
  {
    id: "lesson-8-shopping-package",
    number: 8,
    title: { zh: "買物件", en: "Buying things" },
    secondaryTitle: { zh: "Buying things", en: "買物件" },
    summary: {
      zh: "把買、物件和錢放進簡單的購物情境。",
      en: "Place buy, things, and money into a simple shopping situation.",
    },
    objective: {
      zh: "學習者能說出要買的物件，並辨認錢和購物動作的基本詞。",
      en: "Learners can name something they want to buy and recognize the basic words for money and shopping.",
    },
    status: "planned",
    stagePlan,
    phrases: [
      makePhrase({
        id: "lesson-8-shopping-buy",
        hanji: "買",
        tailo: "Bé / bué",
        poj: null,
        meaning: { zh: "買；使用金錢購物", en: "buy; shop using money" },
        cultureNote: {
          zh: "教育部列「bé、bué」兩種白讀，並用「我欲買衫」示範； package 先保留變體。",
          en: "The MOE lists bé and bué as colloquial readings and uses guá beh bé sann as its example; keep the variant visible in the package.",
        },
        source: moeSource("https://sutian.moe.edu.tw/zh-hant/su/9037/"),
      }),
      makePhrase({
        id: "lesson-8-shopping-thing",
        hanji: "物件",
        tailo: "Mi̍h-kiānn / mn̍gh-kiānn",
        poj: null,
        meaning: { zh: "東西、物件", en: "thing; item" },
        cultureNote: {
          zh: "教育部記錄 mi̍h-kiānn、mn̍gh-kiānn 及不同地區讀音；購物課先用它指一般物品，不延伸到抽象事情。",
          en: "The MOE records mi̍h-kiānn, mn̍gh-kiānn, and regional readings; this shopping lesson uses it for a physical item first.",
        },
        source: moeSource("https://sutian.moe.edu.tw/zh-hant/su/4343/"),
      }),
      makePhrase({
        id: "lesson-8-shopping-money",
        hanji: "錢",
        tailo: "Tsînn",
        poj: null,
        meaning: { zh: "錢；貨幣", en: "money; currency" },
        cultureNote: {
          zh: "教育部把「錢」列為貨幣，也收錄重量單位讀法；本課只使用購物的金錢意思。",
          en: "The MOE includes both currency and a weight-unit sense; this lesson uses only the money meaning for shopping.",
        },
        source: moeSource("https://sutian.moe.edu.tw/zh-hant/su/11988/"),
      }),
    ],
    teacherReview: { status: "required", checks: teacherChecks },
  },
  {
    id: "lesson-9-community-package",
    number: 9,
    title: { zh: "厝邊佮社區", en: "Neighbors and community" },
    secondaryTitle: { zh: "Neighbors and community", en: "厝邊佮社區" },
    summary: {
      zh: "從厝邊、隔壁和朋友開始，說出生活周邊的人。",
      en: "Start with neighbors, next door, and friends to talk about people nearby.",
    },
    objective: {
      zh: "學習者能辨認厝邊、隔壁和朋友，並用簡短句子介紹身邊的人。",
      en: "Learners can recognize neighbors, next door, and friends, then introduce people around them in short sentences.",
    },
    status: "planned",
    stagePlan,
    phrases: [
      makePhrase({
        id: "lesson-9-community-neighbor",
        hanji: "厝邊",
        tailo: "Tshù-pinn",
        poj: null,
        meaning: { zh: "鄰居；房子旁邊", en: "neighbor; beside the house" },
        cultureNote: {
          zh: "教育部用「阮的厝邊攏誠好鬥陣」示範鄰居，保留了台灣生活中熟人社區的語感。",
          en: "The MOE example describes neighbors as people who are good to be around, preserving a familiar community feeling.",
        },
        source: moeSource("https://sutian.moe.edu.tw/zh-hant/su/5850/"),
      }),
      makePhrase({
        id: "lesson-9-community-next-door",
        hanji: "隔壁",
        tailo: "Keh-piah",
        poj: null,
        meaning: { zh: "隔壁；鄰家、鄰居", en: "next door; neighboring home or neighbor" },
        cultureNote: {
          zh: "教育部同時收錄空間位置和鄰居兩種意思；教材要用房間與鄰家兩個例子分開呈現。",
          en: "The MOE covers both physical location and neighbor; use one room example and one neighbor example to separate the meanings.",
        },
        source: moeSource("https://sutian.moe.edu.tw/zh-hant/su/10339/"),
      }),
      makePhrase({
        id: "lesson-9-community-friend",
        hanji: "朋友",
        tailo: "Pîng-iú",
        poj: null,
        meaning: { zh: "朋友；友人的通稱", en: "friend; a general term for a friend" },
        cultureNote: {
          zh: "教育部詞條把「朋友」定義為友人的通稱；本課先用熟悉關係，不加入社交媒體或抽象人際分類。",
          en: "The MOE defines pîng-iú as a general term for a friend; keep the lesson about familiar relationships rather than abstract social categories.",
        },
        source: moeSource("https://sutian.moe.edu.tw/zh-hant/su/4199/"),
      }),
    ],
    teacherReview: { status: "required", checks: teacherChecks },
  },
  {
    id: "lesson-10-invitations-package",
    number: 10,
    title: { zh: "相招來", en: "Making an invitation" },
    secondaryTitle: { zh: "Making an invitation", en: "相招來" },
    summary: {
      zh: "練習邀請別人一起去、一起做一件事。",
      en: "Practice inviting someone to go somewhere or do something together.",
    },
    objective: {
      zh: "學習者能聽懂相招、做伙和來去，並說出一個簡單邀請。",
      en: "Learners can understand sio-tsio, tsò-hué, and lâi-khì, then make a simple invitation.",
    },
    status: "planned",
    stagePlan,
    phrases: [
      makePhrase({
        id: "lesson-10-invitations-invite",
        hanji: "相招",
        tailo: "Sio-tsio",
        poj: null,
        meaning: { zh: "彼此邀約", en: "invite one another" },
        cultureNote: {
          zh: "教育部用「逐家相招來去遊覽」示範彼此邀約；課程保留「一起」的社交情境。",
          en: "The MOE example uses sio-tsio for inviting one another to go sightseeing, keeping the social context of doing something together.",
        },
        source: moeSource("https://sutian.moe.edu.tw/zh-hant/su/5249/"),
      }),
      makePhrase({
        id: "lesson-10-invitations-together",
        hanji: "做伙",
        tailo: "Tsò-hué / tsuè-hé",
        poj: null,
        meaning: { zh: "一起、一塊兒", en: "together" },
        cultureNote: {
          zh: "教育部記錄 tsò-hué、tsuè-hé 以及多個近義詞；package 先以「一起」的核心意思為主。",
          en: "The MOE records tsò-hué, tsuè-hé, and several related terms; this package starts with the core meaning of together.",
        },
        source: moeSource("https://sutian.moe.edu.tw/zh-hant/su/6947/"),
      }),
      makePhrase({
        id: "lesson-10-invitations-go",
        hanji: "來去",
        tailo: "Lâi-khì",
        poj: null,
        meaning: { zh: "去、前往；表示一起行動的意願", en: "go; express an intention to go together" },
        cultureNote: {
          zh: "教育部說明「來去」用在第一人稱或包含第一人稱的動作意願，很適合放進邀請句。",
          en: "The MOE explains that lâi-khì marks an intention involving the first person, which makes it useful in invitations.",
        },
        source: moeSource("https://sutian.moe.edu.tw/zh-hant/su/3538/"),
      }),
    ],
    teacherReview: { status: "required", checks: teacherChecks },
  },
  {
    id: "lesson-11-time-and-plans-package",
    number: 11,
    title: { zh: "昨昏佮明仔載", en: "Yesterday and tomorrow" },
    secondaryTitle: { zh: "Yesterday and tomorrow", en: "昨昏佮明仔載" },
    summary: {
      zh: "用昨天、今天和明天，說出簡單的時間順序。",
      en: "Use yesterday, today, and tomorrow to express a simple sequence of time.",
    },
    objective: {
      zh: "學習者能分辨昨昏、今仔日和明仔載，並說出一件已經做過或準備要做的事。",
      en: "Learners can distinguish yesterday, today, and tomorrow, then say one past or upcoming action.",
    },
    status: "planned",
    stagePlan,
    phrases: [
      makePhrase({
        id: "lesson-11-time-yesterday",
        hanji: "昨昏",
        tailo: "Tsa-hng",
        poj: null,
        meaning: { zh: "昨天", en: "yesterday" },
        cultureNote: {
          zh: "教育部列 tsa-hng 為主音讀，也收錄 tsa̋ng 等合音；課程先維持完整讀法。",
          en: "The MOE lists tsa-hng and also records a contracted reading tsa̋ng; keep the full reading in the beginner package first.",
        },
        source: moeSource("https://sutian.moe.edu.tw/zh-hant/su/5016/"),
      }),
      makePhrase({
        id: "lesson-11-time-today",
        hanji: "今仔日",
        tailo: "Kin-á-ji̍t / kin-á-li̍t",
        poj: null,
        meaning: { zh: "今天、今日", en: "today" },
        cultureNote: {
          zh: "這是第 5 課的核心詞，這裡作為時間軸的中間點重現，幫助學習者把舊詞帶進新對話。",
          en: "This is a core word from Lesson 5; here it returns as the middle point of a time line so learners reuse an earlier word in a new dialogue.",
        },
        source: moeSource("https://sutian.moe.edu.tw/zh-hant/su/629/"),
      }),
      makePhrase({
        id: "lesson-11-time-tomorrow",
        hanji: "明仔載",
        tailo: "Bîn-á-tsài",
        poj: null,
        meaning: { zh: "明天、明日", en: "tomorrow" },
        cultureNote: {
          zh: "教育部以「明仔載的代誌明仔載才閣講」示範未來安排；課程可用來練習不把今天和明天混在一起。",
          en: "The MOE uses bîn-á-tsài in an example about tomorrow’s matters, making it useful for simple future planning.",
        },
        source: moeSource("https://sutian.moe.edu.tw/zh-hant/su/4208/"),
      }),
    ],
    teacherReview: { status: "required", checks: teacherChecks },
  },
  {
    id: "lesson-12-life-conversation-package",
    number: 12,
    title: { zh: "我的生活對話", en: "My everyday conversation" },
    secondaryTitle: { zh: "My everyday conversation", en: "我的生活對話" },
    summary: {
      zh: "把前面學過的問候、家庭和時間詞串成一段短對話。",
      en: "Bring greetings, family, and time words together in one short conversation.",
    },
    objective: {
      zh: "學習者能在不追求長句的情況下，完成一輪聽、回應、追問和生活連結。",
      en: "Learners can complete a short hear, respond, follow-up, and real-life connection loop without needing long sentences.",
    },
    status: "planned",
    stagePlan,
    phrases: [
      makePhrase({
        id: "lesson-12-conversation-greeting",
        hanji: "你食飽未？",
        tailo: "Lí tsia̍h-pá--buē?",
        poj: "Lí chia̍h-pá--bōe?",
        meaning: { zh: "你吃飽了嗎？；日常關心的問候", en: "Have you eaten?; a caring everyday greeting" },
        cultureNote: {
          zh: "第 1 課的核心問候在總複習中重新出現，重點是自然回應，不是重新背誦。",
          en: "The Lesson 1 greeting returns as a capstone so learners practice a natural response rather than merely reciting it again.",
        },
        source: moeSource("https://sutian.moe.edu.tw/und-hani/su/1653/"),
      }),
      makePhrase({
        id: "lesson-12-conversation-home",
        hanji: "阮兜",
        tailo: "Guán tau",
        poj: null,
        meaning: { zh: "我家／我們家", en: "my home / our home" },
        cultureNote: {
          zh: "第 2 課的家庭詞在總複習中用來回答生活地點或家庭話題，保留原本的完整詞組。",
          en: "The Lesson 2 family phrase returns for a home or family response while keeping the original full phrase.",
        },
        source: moeSource("https://sutian.moe.edu.tw/zh-hant/su/6917/"),
      }),
      makePhrase({
        id: "lesson-12-conversation-today",
        hanji: "今仔日",
        tailo: "Kin-á-ji̍t / kin-á-li̍t",
        poj: null,
        meaning: { zh: "今天、今日", en: "today" },
        cultureNote: {
          zh: "第 5 課和第 11 課的時間詞在最後一課重現，讓學習者可以完成「今天如何」的簡短生活對話。",
          en: "The time word from Lessons 5 and 11 returns so learners can complete a short conversation about today.",
        },
        source: moeSource("https://sutian.moe.edu.tw/zh-hant/su/629/"),
      }),
    ],
    teacherReview: { status: "required", checks: teacherChecks },
  },
] as const;
