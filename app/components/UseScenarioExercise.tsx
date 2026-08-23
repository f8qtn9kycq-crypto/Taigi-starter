import type { Locale } from "../types/learning";
import type { LessonUseScenario } from "../types/lesson";

type UseScenarioExerciseProps = {
  scenario: LessonUseScenario;
  locale: Locale;
  selectedChoiceId: string | null;
  chooseResponseLabel: string;
  correctLabel: string;
  tryAgainLabel: string;
  sourceLabel: string;
  onSelect: (choiceId: string) => void;
};

export default function UseScenarioExercise({
  scenario,
  locale,
  selectedChoiceId,
  chooseResponseLabel,
  correctLabel,
  tryAgainLabel,
  sourceLabel,
  onSelect,
}: UseScenarioExerciseProps) {
  const selectedChoice = scenario.choices.find((choice) => choice.id === selectedChoiceId) ?? null;

  return (
    <fieldset className="use-scenario">
      <legend><span>{chooseResponseLabel}</span>{scenario.prompt[locale]}</legend>
      <div className="use-scenario-choices">
        {scenario.choices.map((choice) => (
          <button
            key={choice.id}
            type="button"
            className={selectedChoiceId === choice.id ? "selected" : ""}
            aria-pressed={selectedChoiceId === choice.id}
            onClick={() => onSelect(choice.id)}
          >
            <span><b>{choice.hanji}</b><i>{choice.tailo}</i></span>
            <small>{choice.meaning[locale]}</small>
          </button>
        ))}
      </div>
      {selectedChoice && (
        <div className={selectedChoice.isCorrect ? "use-choice-feedback correct" : "use-choice-feedback retry"} role="status">
          <b>{selectedChoice.isCorrect ? correctLabel : tryAgainLabel}</b>
          <p>{selectedChoice.isCorrect ? scenario.explanation[locale] : selectedChoice.feedback[locale]}</p>
          {selectedChoice.isCorrect && <a href={selectedChoice.sourceUrl} target="_blank" rel="noreferrer">{sourceLabel}</a>}
        </div>
      )}
    </fieldset>
  );
}
