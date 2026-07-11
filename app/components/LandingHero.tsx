import type { LessonCopy, Locale } from "../taigi-content";

type LandingHeroProps = {
  text: LessonCopy;
  locale: Locale;
  hasStarted: boolean;
  dueCount: number;
  stage: number;
  isPlaying: boolean;
  audioError: boolean;
  startPending: boolean;
  onLocaleChange: () => void;
  onAudioToggle: () => void;
  onStart: () => void;
  onPeek: () => void;
};

export default function LandingHero({
  text,
  locale,
  hasStarted,
  dueCount,
  stage,
  isPlaying,
  audioError,
  startPending,
  onLocaleChange,
  onAudioToggle,
  onStart,
  onPeek,
}: LandingHeroProps) {
  return (
    <div className="landing-viewport">
      <header className="site-header">
        <a className="brand" href="#learn" aria-label={text.homeLabel}>
          <span className="brand-mark">台</span>
          <span className="brand-name">{text.brandRomanized}</span>
        </a>
        <div className="header-actions">
          {hasStarted && (
            <span className="status-chip">
              {dueCount > 0 ? text.reviewStatus(dueCount) : text.progressStatus(text.stageCount(stage))}
            </span>
          )}
          <button type="button" className="locale" onClick={onLocaleChange} aria-label={text.switchLanguage}>
            {locale === "zh" ? "EN" : "中"}
          </button>
        </div>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-brush" aria-hidden="true" />
        <div className="hero-brand-lockup">
          <span className="eyebrow">{text.eyebrow}</span>
          <h1 id="hero-title"><span>{text.brandTitle}</span><small>{text.brandRomanized}</small></h1>
          <p className="hero-slogan">{text.heroSlogan}</p>
          <p className="hero-support">{text.heroSupport}</p>

          <div className="hero-actions">
            <button type="button" className="hero-primary-action" onClick={onStart} disabled={startPending} aria-busy={startPending}>
              <span>{startPending ? text.startingPhrase : text.startPhrase}</span><b aria-hidden="true">→</b>
            </button>
            <button
              type="button"
              className={`hero-audio${isPlaying ? " playing" : ""}`}
              onClick={onAudioToggle}
              aria-label={isPlaying ? text.pausePreview : text.listenFirst}
              aria-pressed={isPlaying}
            >
              <span className="audio-play" aria-hidden="true">{isPlaying ? "Ⅱ" : "▶"}</span>
              <span className="audio-label">{isPlaying ? text.pausePreview : text.listenFirst}</span>
              <span className="mini-waveform" aria-hidden="true"><i /><i /><i /><i /><i /></span>
              <span className="sr-only" aria-live="polite">{isPlaying ? text.previewPlaying : text.previewPaused}</span>
            </button>
            {audioError && <p className="media-error" role="alert">{text.audioUnavailable}</p>}
          </div>
        </div>
      </section>

      <button type="button" className="next-page-peek" onClick={onPeek}>
        <span><small>{text.previewLabel}</small><b>{text.previewTitle}</b></span>
        <em>{text.previewDuration}</em>
      </button>
    </div>
  );
}
