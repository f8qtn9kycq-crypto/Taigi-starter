import type { LessonPackage } from "../types/lesson-package.ts";
import { createLessonPackageAudio } from "../utils/lesson-audio.ts";
import { buildFallbackUseScenario } from "../utils/lesson-use-scenario.ts";
import { lessonPackages2To6 } from "./lesson-packages/lessons-2-6.ts";
import { lessonPackages7To12 } from "./lesson-packages/lessons-7-12.ts";
import { lessonPackages13To18 } from "./lesson-packages/lessons-13-18.ts";
import { lessonPackages19To20 } from "./lesson-packages/lessons-19-20.ts";
import type { RawLessonPackage } from "./lesson-packages/shared.ts";

const rawLessonPackages: readonly RawLessonPackage[] = [
  ...lessonPackages2To6,
  ...lessonPackages7To12,
  ...lessonPackages13To18,
  ...lessonPackages19To20,
];

const pojByTailo: Readonly<Record<string, string>> = {
  "Tau": "Tau",
  "A-bú": "A-bú",
  "A-pah": "A-pah",
  "Tsi̍t": "Chi̍t",
  "Jī / lī": "Jī / lī",
  "Sann": "Saⁿ",
  "Pn̄g": "Pn̄g",
  "Lim tsuí": "Lim chúi",
  "Tsia̍h-tê": "Chia̍h-tê",
  "Kin-á-ji̍t / kin-á-li̍t": "Kin-á-ji̍t / kin-á-li̍t",
  "Tsá-khí": "Chá-khí",
  "Tāi-tsì": "Tāi-chì",
  "Thinn-khì": "Thiⁿ-khì",
  "Jua̍h / lua̍h": "Joa̍h / loa̍h",
  "Líng": "Léng",
  "Toh": "Toh",
  "Lâi-khì": "Lâi-khì",
  "Lōo": "Lō͘",
  "Bé / bué": "Bé / bóe",
  "Mi̍h-kiānn / mn̍gh-kiānn": "Mi̍h-kiāⁿ / mn̍gh-kiāⁿ",
  "Tsînn": "Chîⁿ",
  "Tshù-pinn": "Chhù-piⁿ",
  "Keh-piah": "Keh-piah",
  "Pîng-iú": "Pêng-iú",
  "Sio-tsio": "Sio-chio",
  "Tsò-hué / tsuè-hé": "Chò-hóe / chòe-hé",
  "Tsa-hng": "Cha-hng",
  "Bîn-á-tsài": "Bîn-á-chài",
  "Lí tsia̍h-pá--buē?": "Lí chia̍h-pá--bōe?",
  "Guá": "Goá",
  "Kiò": "Kiò",
  "Sī": "Sī",
  "Ha̍k-hāu": "Ha̍k-hāu",
  "Tha̍k-tsheh": "Tha̍k-chheh",
  "Thâu-lōo": "Thâu-lō͘",
  "Sin-thé": "Sin-thé",
  "Bē-sóng / buē-sóng": "Bē-sóng / bōe-sóng",
  "Io̍h-á": "Io̍h-á",
  "Tshut-mn̂g": "Chhut-mn̂g",
  "Tsē": "Chē",
  "Tshia-tsām": "Chhia-chām",
  "Tsia̍h-tshan-thiann": "Chia̍h-chhan-thiaⁿ",
  "Beh / bueh": "Beh / bōeh",
  "Tshài": "Chhài",
  "Guā-tsē / guā-tsuē": "Goā-chē / goā-choē",
  "Kè-tsînn": "Kè-chîⁿ",
  "Tshiánn-mn̄g": "Chhiáⁿ-mn̄g",
  "To-siā": "To-siā",
  "Sit-lé": "Sit-lé",
  "Pang-tsōo": "Pang-chō͘",
  "Bān": "Bān",
  "Bān-bān-á": "Bān-bān-á",
};

const sharedAudioUrlByPhraseId: Readonly<Record<string, string>> = {
  "lesson-12-conversation-meal": "/audio/lesson-2-15/lesson-4-food-and-drink-meal.mp3",
};

const recommendedPathOrderByPackageNumber: Readonly<Record<number, number>> = {
  2: 15,
  3: 5,
  4: 6,
  5: 18,
  6: 14,
  7: 10,
  8: 8,
  9: 16,
  10: 17,
  11: 12,
  12: 20,
  13: 4,
  14: 19,
  15: 13,
  16: 11,
  17: 7,
  18: 9,
  19: 2,
  20: 3,
};

const completeLessonPackage = (lessonPackage: RawLessonPackage): LessonPackage => ({
  ...lessonPackage,
  pathOrder: recommendedPathOrderByPackageNumber[lessonPackage.number] ?? 0,
  phrases: lessonPackage.phrases.map((phrase) => {
    const poj = phrase.poj ?? pojByTailo[phrase.tailo];
    if (!poj) throw new Error(`Missing POJ mapping for ${phrase.id}: ${phrase.tailo}`);

    return {
      ...phrase,
      poj,
      useScenario: phrase.useScenario ?? buildFallbackUseScenario(phrase, lessonPackage.phrases),
      audio: createLessonPackageAudio(
        lessonPackage.number,
        phrase.id,
        phrase.hanji,
        phrase.source.canonicalUrl,
        sharedAudioUrlByPhraseId[phrase.id],
      ),
    };
  }),
});

export const lessonPackages: readonly LessonPackage[] = rawLessonPackages.map(completeLessonPackage);
