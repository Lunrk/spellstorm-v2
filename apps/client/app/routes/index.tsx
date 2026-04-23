import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

const APP_VERSION = '0.1.0';

export default function Home() {
  const { t } = useTranslation();

  return (
    <main className="home-root">
      {/* Ambient background layers */}
      <div className="home-bg" aria-hidden="true">
        <div className="home-bg__orb home-bg__orb--1" />
        <div className="home-bg__orb home-bg__orb--2" />
        <div className="home-bg__orb home-bg__orb--3" />
        <div className="home-bg__grid" />
      </div>

      {/* Center content */}
      <section className="home-hero">
        <div className="home-hero__eyebrow">
          <span className="home-hero__rune">✦</span>
          <span className="home-hero__tag">{t('game.actions.play_now')}</span>
          <span className="home-hero__rune">✦</span>
        </div>

        <h1 className="home-hero__title">
          {t('title')}
        </h1>

        <p className="home-hero__desc">
          {t('description')}
        </p>

        <Link to="/menu" className="home-hero__cta" prefetch="intent">
          <span className="home-hero__cta-text">{t('game.actions.play_now')}</span>
          <span className="home-hero__cta-arrow" aria-hidden="true">→</span>
        </Link>
      </section>

      {/* Version badge */}
      <footer className="home-footer">
        <span className="home-footer__version">v{APP_VERSION}</span>
      </footer>
    </main>
  );
}