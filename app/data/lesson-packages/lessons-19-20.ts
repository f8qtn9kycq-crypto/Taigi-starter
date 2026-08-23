import {
  makePhrase,
  moeSource,
  requiredTeacherReview,
  stagePlan,
  type RawLessonPackage,
} from "./shared.ts";

export const lessonPackages19To20: readonly RawLessonPackage[] = [
  {
    id: "lesson-19-polite-exchanges-package",
    number: 19,
    title: { zh: "請問、多謝、失禮", en: "Polite everyday exchanges" },
    secondaryTitle: { zh: "Polite everyday exchanges", en: "請問、多謝、失禮" },
    summary: {
      zh: "用請問開始互動，用多謝回應幫忙，用失禮修補小失誤。",
      en: "Start an interaction politely, thank someone for help, and repair a small mistake.",
    },
    objective: {
      zh: "學習者能在問路、接受幫忙和需要道歉時，選用合適的客氣語。",
      en: "Learners can choose an appropriate polite expression when asking, receiving help, or apologizing.",
    },
    mission: {
      zh: "完成三個生活禮貌動作：請問、說多謝、出錯時說失禮。",
      en: "Complete three real-life courtesy moves: ask politely, say thanks, and apologize after a mistake.",
    },
    status: "planned",
    stagePlan,
    phrases: [
      makePhrase({
        id: "lesson-19-polite-ask",
        hanji: "請問",
        tailo: "Tshiánn-mn̄g",
        poj: null,
        meaning: { zh: "請問；客氣地向人詢問", en: "excuse me; a polite way to ask" },
        cultureNote: {
          zh: "教育部將「請問」定義為向人詢問時的客氣語；本課把它放在問路和求助的開頭。",
          en: "The MOE defines tshiánn-mn̄g as a polite expression for asking someone; use it at the start of directions and help requests.",
        },
        source: moeSource("https://sutian.moe.edu.tw/zh-hant/su/11443/"),
      }),
      makePhrase({
        id: "lesson-19-polite-thanks",
        hanji: "多謝",
        tailo: "To-siā",
        poj: null,
        meaning: { zh: "謝謝、感謝", en: "thank you; express thanks" },
        cultureNote: {
          zh: "教育部例句直接用「多謝你！」；完成任務時要把它放在對方幫忙之後，而不是只背意思。",
          en: "The MOE gives To-siā--lí as a direct example; place it after someone helps you rather than memorizing it in isolation.",
        },
        useScenario: {
          prompt: {
            zh: "陌生人剛幫你指出正確的路。你現在最適合說哪一句？",
            en: "A stranger has just shown you the right way. What is the best thing to say now?",
          },
          explanation: {
            zh: "「多謝」用來表達感謝，最符合別人剛幫忙之後的回應。",
            en: "“To-siā” expresses thanks, so it is the best response after someone has helped you.",
          },
          choices: [
            {
              id: "thanks",
              hanji: "多謝",
              tailo: "To-siā",
              meaning: { zh: "謝謝、感謝", en: "thank you; express thanks" },
              feedback: { zh: "這句直接感謝對方剛才的幫忙。", en: "This directly thanks the person for their help." },
              sourceUrl: "https://sutian.moe.edu.tw/zh-hant/su/2415/",
              isCorrect: true,
            },
            {
              id: "ask-politely",
              hanji: "請問",
              tailo: "Tshiánn-mn̄g",
              meaning: { zh: "請問；客氣地向人詢問", en: "excuse me; a polite way to ask" },
              feedback: { zh: "「請問」適合在詢問之前使用；現在對方已經幫完忙。", en: "“Tshiánn-mn̄g” belongs before asking; the person has already helped." },
              sourceUrl: "https://sutian.moe.edu.tw/zh-hant/su/11443/",
              isCorrect: false,
            },
            {
              id: "apologize",
              hanji: "失禮",
              tailo: "Sit-lé",
              meaning: { zh: "對不起；向人賠罪", en: "sorry; apologize to someone" },
              feedback: { zh: "「失禮」用來道歉；這個情境需要的是感謝。", en: "“Sit-lé” is for apologizing; this situation calls for thanks." },
              sourceUrl: "https://sutian.moe.edu.tw/zh-hant/su/1826/",
              isCorrect: false,
            },
          ],
        },
        source: moeSource("https://sutian.moe.edu.tw/zh-hant/su/2415/"),
      }),
      makePhrase({
        id: "lesson-19-polite-apology",
        hanji: "失禮",
        tailo: "Sit-lé",
        poj: null,
        meaning: { zh: "對不起；向人賠罪", en: "sorry; apologize to someone" },
        cultureNote: {
          zh: "教育部用「真失禮」表達賠罪；本課將它限定在修補互動的小失誤，不延伸成正式道歉文書。",
          en: "The MOE uses tsin sit-lé for apologizing; keep this lesson on repairing a small interaction, not formal written apologies.",
        },
        source: moeSource("https://sutian.moe.edu.tw/zh-hant/su/1826/"),
      }),
    ],
    teacherReview: requiredTeacherReview,
  },
  {
    id: "lesson-20-help-and-slow-down-package",
    number: 20,
    title: { zh: "求助佮講較慢", en: "Ask for help and slow down" },
    secondaryTitle: { zh: "Ask for help and slow down", en: "求助佮講較慢" },
    summary: {
      zh: "聽無或跟袂著時，請對方幫助，請對方講慢慢仔。",
      en: "When you cannot follow, ask for help and ask the other person to slow down.",
    },
    objective: {
      zh: "學習者能辨認幫助、慢和慢慢仔，完成一個不懂時的修復策略。",
      en: "Learners can recognize help, slow, and slowly, then use a repair strategy when they do not understand.",
    },
    mission: {
      zh: "完成聽不懂時的三步驟：請問、求助、請對方慢慢仔講。",
      en: "Use a three-step repair when you cannot follow: ask politely, request help, and ask the person to speak slowly.",
    },
    status: "planned",
    stagePlan,
    phrases: [
      makePhrase({
        id: "lesson-20-help-support",
        hanji: "幫助",
        tailo: "Pang-tsōo",
        poj: null,
        meaning: { zh: "幫忙；給予支援", en: "help; give support" },
        cultureNote: {
          zh: "教育部將「幫助」解作替人出力或給予支援；本課用在需要協助的生活情境。",
          en: "The MOE defines pang-tsōo as giving effort or support; use it in everyday requests for assistance.",
        },
        source: moeSource("https://sutian.moe.edu.tw/zh-hant/su/12157/"),
      }),
      makePhrase({
        id: "lesson-20-help-slow",
        hanji: "慢",
        tailo: "Bān",
        poj: null,
        meaning: { zh: "慢；速度較緩", en: "slow; at a slower speed" },
        cultureNote: {
          zh: "教育部用「駛較慢」示範速度；本課把慢放入請對方放慢的修復任務。",
          en: "The MOE demonstrates bān with a request to drive more slowly; use it in a repair task that asks for a slower pace.",
        },
        source: moeSource("https://sutian.moe.edu.tw/zh-hant/su/10498/"),
      }),
      makePhrase({
        id: "lesson-20-help-slowly",
        hanji: "慢慢仔",
        tailo: "Bān-bān-á",
        poj: null,
        meaning: { zh: "慢慢地；放慢速度", en: "slowly; at an unhurried pace" },
        cultureNote: {
          zh: "教育部例句「有話慢慢仔講」直接對應溝通修復；本課讓學習者在聽無時請對方慢慢仔講。",
          en: "The MOE example Ū uē bān-bān-á kóng directly fits communication repair; use it to ask someone to speak slowly.",
        },
        useScenario: {
          prompt: {
            zh: "對方說得太快，你聽不懂。哪一句最能請對方放慢速度？",
            en: "The other person is speaking too quickly and you cannot follow. Which phrase best asks them to slow down?",
          },
          explanation: {
            zh: "「慢慢仔講」直接請對方慢慢說，是聽不懂時的溝通修復。",
            en: "“Bān-bān-á kóng” directly asks the person to speak slowly, repairing the conversation when you cannot follow.",
          },
          choices: [
            {
              id: "speak-slowly",
              hanji: "慢慢仔講",
              tailo: "Bān-bān-á kóng",
              meaning: { zh: "慢慢說、說慢一點", en: "speak slowly; slow down when speaking" },
              feedback: { zh: "這句直接請對方放慢說話速度。", en: "This directly asks the person to slow their speech." },
              sourceUrl: "https://sutian.moe.edu.tw/zh-hant/su/10519/",
              isCorrect: true,
            },
            {
              id: "help",
              hanji: "幫助",
              tailo: "Pang-tsōo",
              meaning: { zh: "幫忙；給予支援", en: "help; give support" },
              feedback: { zh: "「幫助」只表示求助，沒有說明要把話說慢一點。", en: "“Pang-tsōo” asks for help generally but does not specify slower speech." },
              sourceUrl: "https://sutian.moe.edu.tw/zh-hant/su/12157/",
              isCorrect: false,
            },
            {
              id: "slow",
              hanji: "慢",
              tailo: "Bān",
              meaning: { zh: "慢；速度較緩", en: "slow; at a slower speed" },
              feedback: { zh: "「慢」只描述速度；「慢慢仔講」才是完整、清楚的請求。", en: "“Bān” only describes speed; “Bān-bān-á kóng” makes the complete, clear request." },
              sourceUrl: "https://sutian.moe.edu.tw/zh-hant/su/10498/",
              isCorrect: false,
            },
          ],
        },
        source: moeSource("https://sutian.moe.edu.tw/zh-hant/su/10519/"),
      }),
    ],
    teacherReview: requiredTeacherReview,
  },
] as const;
