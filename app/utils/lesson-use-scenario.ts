import type { LessonUseScenario, LocalizedText } from "../types/lesson-domain.ts";
import type { LessonPackagePhrase } from "../types/lesson-package.ts";

type ScenarioPhrase = Omit<LessonPackagePhrase, "audio">;

const fallbackPromptByPhraseId: Readonly<Record<string, LocalizedText>> = {
  "lesson-2-family-mother": { zh: "你要向朋友介紹站在旁邊的媽媽。哪一個詞最適合稱呼她？", en: "You are introducing your mother, who is standing beside you. Which phrase best names her?" },
  "lesson-2-family-father": { zh: "你要告訴同學照片裡的人是爸爸。哪一個詞最適合？", en: "You want to tell a classmate that the person in the photo is your father. Which phrase fits?" },
  "lesson-3-numbers-one": { zh: "桌上只有一粒柑仔。你要說出數量，應該選哪一個數字？", en: "There is only one orange on the table. Which number states the amount?" },
  "lesson-3-numbers-two": { zh: "你拿著兩張車票。你要說出數量，應該選哪一個數字？", en: "You are holding two tickets. Which number states the amount?" },
  "lesson-4-food-and-drink-meal": { zh: "家人問你晚餐想吃什麼主食。你想回答「飯」，應該選哪一個詞？", en: "Your family asks what staple food you want for dinner. Which phrase answers ‘rice or a meal’?" },
  "lesson-4-food-and-drink-tea": { zh: "朋友邀你坐下來喝茶。哪一個詞最符合這個動作？", en: "A friend invites you to sit down and drink tea. Which phrase matches that action?" },
  "lesson-5-daily-today": { zh: "別人問活動是哪一天，你要回答就是今天。哪一個詞最適合？", en: "Someone asks which day the event is, and you want to answer ‘today.’ Which phrase fits?" },
  "lesson-5-daily-morning": { zh: "你要約朋友在一天剛開始的時候見面。哪一個詞表示早上？", en: "You want to meet a friend at the start of the day. Which phrase means morning?" },
  "lesson-6-weather-weather": { zh: "出門前，你想問外面的天候如何。哪一個詞指的是天氣？", en: "Before going out, you want to ask about the conditions outside. Which phrase means weather?" },
  "lesson-6-weather-cold": { zh: "寒流來了，你走出門覺得溫度很低。哪一個詞最能描述感受？", en: "A cold front arrives and the temperature feels low outside. Which phrase best describes it?" },
  "lesson-7-directions-go-together": { zh: "朋友在門口等你，你想說「走吧，我們去」。哪一個詞最適合？", en: "A friend is waiting at the door and you want to say, ‘Let’s go.’ Which phrase fits?" },
  "lesson-7-directions-road": { zh: "你正在看地圖，想確認要走哪一條道路。哪一個詞指道路？", en: "You are looking at a map and checking which road to take. Which phrase means road?" },
  "lesson-8-shopping-thing": { zh: "店員問你在找什麼東西。哪一個詞可以泛指物品？", en: "A shopkeeper asks what thing you are looking for. Which phrase can refer to an item?" },
  "lesson-8-shopping-money": { zh: "結帳時，你要拿出用來付款的貨幣。哪一個詞最適合？", en: "At checkout, you take out currency to pay. Which phrase names it?" },
  "lesson-9-community-neighbor": { zh: "你要介紹住在你家附近的人。哪一個詞表示鄰居？", en: "You want to introduce someone who lives near your home. Which phrase means neighbor?" },
  "lesson-9-community-next-door": { zh: "朋友問那間緊鄰你家的房子在哪裡。哪一個詞表示隔壁？", en: "A friend asks about the home directly beside yours. Which phrase means next door?" },
  "lesson-10-invitations-invite": { zh: "你和朋友互相邀約週末見面。哪一個詞最符合這個動作？", en: "You and a friend invite one another to meet this weekend. Which phrase matches that action?" },
  "lesson-10-invitations-go": { zh: "大家已經約好，你想提議現在一起出發。哪一個詞最適合？", en: "Everyone has agreed, and you suggest leaving together now. Which phrase fits?" },
  "lesson-11-time-yesterday": { zh: "你在說前一天發生的事情。哪一個詞表示昨天？", en: "You are talking about something that happened the previous day. Which phrase means yesterday?" },
  "lesson-11-time-today": { zh: "你在說此刻這一天的安排。哪一個詞表示今天？", en: "You are talking about plans for the current day. Which phrase means today?" },
  "lesson-12-conversation-meal": { zh: "家人問你桌上準備的是什麼餐食。哪一個詞可以回答「飯」？", en: "Your family asks what meal is ready on the table. Which phrase answers ‘rice or a meal’?" },
  "lesson-12-conversation-today": { zh: "你要說這段生活對話發生在今天。哪一個詞最適合？", en: "You want to say this everyday conversation happens today. Which phrase fits?" },
  "lesson-13-self-introduction-i": { zh: "第一次見面時，你要開始介紹自己。哪一個詞表示「我」？", en: "When meeting someone for the first time, you begin introducing yourself. Which phrase means ‘I’?" },
  "lesson-13-self-introduction-be": { zh: "你要把自己的名字和身分連起來。哪一個詞相當於「是」？", en: "You want to connect your name with your identity. Which phrase works like ‘be’?" },
  "lesson-14-school-and-work-school": { zh: "早上你要去上課的地方。哪一個詞表示學校？", en: "You are going to the place where you study in the morning. Which phrase means school?" },
  "lesson-14-school-and-work-job": { zh: "朋友問你的工作或職業。哪一個詞表示工作？", en: "A friend asks about your work or occupation. Which phrase means job?" },
  "lesson-15-body-and-health-body": { zh: "你要說明不舒服的是自己的身體。哪一個詞表示身體？", en: "You want to say that your body feels unwell. Which phrase means body?" },
  "lesson-15-body-and-health-medicine": { zh: "藥師把醫師開的藥交給你。哪一個詞表示藥品？", en: "A pharmacist gives you medicine prescribed by a doctor. Which phrase means medicine?" },
  "lesson-16-travel-leave-home": { zh: "你穿好鞋，準備離開家到外面去。哪一個詞表示出門？", en: "You put on your shoes and prepare to leave home. Which phrase means go out?" },
  "lesson-16-travel-station": { zh: "你要搭火車，正在找旅客上下車的地方。哪一個詞表示車站？", en: "You are taking a train and looking for the place where passengers board. Which phrase means station?" },
  "lesson-17-restaurant-eat-out": { zh: "今晚不在家煮飯，你和家人要去餐廳吃。哪一個詞最符合？", en: "Your family will not cook at home tonight and plans to eat at a restaurant. Which phrase fits?" },
  "lesson-17-restaurant-dish": { zh: "服務生把一道料理端上桌。哪一個詞可以指這道菜？", en: "A server brings a prepared dish to the table. Which phrase can name the dish?" },
  "lesson-18-shopping-buy": { zh: "你決定付錢把喜歡的物品帶回家。哪一個詞表示購買？", en: "You decide to pay and take an item home. Which phrase means buy?" },
  "lesson-18-shopping-item": { zh: "你指著架上的東西，想問能不能購買。哪一個詞泛指這件物品？", en: "You point to something on a shelf and ask whether you can buy it. Which phrase means item?" },
  "lesson-18-shopping-price": { zh: "你看著標價，想談這件商品的價格。哪一個詞表示價錢？", en: "You look at the price tag and want to discuss the item’s price. Which phrase means price?" },
  "lesson-19-polite-ask": { zh: "你要向陌生人問路，開口前先用哪一個客氣語？", en: "You need to ask a stranger for directions. Which polite phrase should begin the question?" },
  "lesson-19-polite-apology": { zh: "你不小心碰到別人，需要馬上道歉。哪一個詞最適合？", en: "You accidentally bump into someone and need to apologize. Which phrase fits?" },
  "lesson-20-help-support": { zh: "你搬不動重物，想請旁邊的人協助。哪一個詞表示幫助？", en: "You cannot lift a heavy item and want assistance. Which phrase means help?" },
  "lesson-20-help-slow": { zh: "車子在窄路上速度太快，你要描述應該放慢。哪一個詞表示慢？", en: "A vehicle is moving too quickly on a narrow road. Which phrase means slow?" },
};

const makeChoice = (phrase: ScenarioPhrase, correctPhrase: ScenarioPhrase) => ({
  id: phrase.id,
  hanji: phrase.hanji,
  tailo: phrase.tailo,
  meaning: phrase.meaning,
  feedback: phrase.id === correctPhrase.id
    ? {
        zh: `「${phrase.hanji}」正好表達這個生活情境需要的意思。`,
        en: `“${phrase.tailo}” expresses the meaning needed in this everyday situation.`,
      }
    : {
        zh: `「${phrase.hanji}」表示「${phrase.meaning.zh}」，不是這個情境要表達的意思。`,
        en: `“${phrase.tailo}” means “${phrase.meaning.en},” not the meaning needed here.`,
      },
  sourceUrl: phrase.source.canonicalUrl,
  isCorrect: phrase.id === correctPhrase.id,
});

export function buildFallbackUseScenario(
  phrase: ScenarioPhrase,
  lessonPhrases: readonly ScenarioPhrase[],
): LessonUseScenario {
  const prompt = fallbackPromptByPhraseId[phrase.id];
  if (!prompt) throw new Error(`Missing real-life Use prompt for ${phrase.id}`);
  const distractors = lessonPhrases.filter((candidate) => candidate.id !== phrase.id).slice(0, 2);
  if (distractors.length !== 2) {
    throw new Error(`Use scenarios require two same-lesson distractors for ${phrase.id}`);
  }
  const choices = [phrase, ...distractors];
  const correctPosition = lessonPhrases.findIndex((candidate) => candidate.id === phrase.id) % choices.length;
  const orderedChoices = [
    ...choices.slice(choices.length - correctPosition),
    ...choices.slice(0, choices.length - correctPosition),
  ];

  return {
    prompt,
    explanation: {
      zh: `「${phrase.hanji}」的意思是「${phrase.meaning.zh}」，最符合這個情境。`,
      en: `“${phrase.tailo}” means “${phrase.meaning.en},” so it best fits this situation.`,
    },
    choices: orderedChoices.map((choice) => makeChoice(choice, phrase)),
  };
}
