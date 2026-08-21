import type { LessonCopy, Locale } from "../taigi-content";

type SiteHeaderProps = {
  text: LessonCopy;
  locale: Locale;
  hasStarted: boolean;
  dueCount: number;
  stage: number;
  totalStages: number;
  onLocaleChange: () => void;
  onHome?: () => void;
};

export default function SiteHeader({
  text,
  locale,
  hasStarted,
  dueCount,
  stage,
  totalStages,
  onLocaleChange,
  onHome,
}: SiteHeaderProps) {
  return (
    <header className="site-header">
      <a className="brand" href="#learn" aria-label={text.homeLabel} onClick={onHome}>
        <span className="brand-mark">台</span>
        <span className="brand-name">{text.brandRomanized}</span>
      </a>
      <div className="header-actions">
        {hasStarted && (
          <span className="status-chip">
            {dueCount > 0 ? text.reviewStatus(dueCount) : text.progressStatus(text.stageCount(stage, totalStages))}
          </span>
        )}
        <button type="button" className="locale" onClick={onLocaleChange} aria-label={text.switchLanguage}>
          {locale === "zh" ? "EN" : "繁"}
        </button>
      </div>
    </header>
  );
}
