import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

const APP_VERSION = '0.1.0';

export default function Home() {
  const { t } = useTranslation();

  return (
    <main className="home">

      <div className="home__orbs" aria-hidden="true" />

      <section className="home__hero">

        <h1 className="home__title">
          {t('title')}
        </h1>

        <p className="home__description">
          {t('description')}
        </p>

        <Link to="/menu" className="home__cta" prefetch="intent">
          <span>{t('game.actions.play_now')}</span>
          <span className="home__cta-arrow" aria-hidden="true">→</span>
        </Link>

      </section>

      <footer className="home__footer">
        <span className="home__version">v{APP_VERSION}</span>
      </footer>

    </main>
  );
}