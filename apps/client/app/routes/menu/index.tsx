import { Form, Link } from 'react-router';
import { useTranslation } from 'react-i18next';

const APP_VERSION = '0.1.0';

const NAV_ITEMS = [
    { key: 'play', to: '/play', locked: false },
    { key: 'leaderboard', to: '/leaderboard', locked: true },
    { key: 'settings', to: '/settings', locked: false },
] as const;

export default function Menu() {
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language;

    return (
        <main className="menu">

            <div className="menu__orbs" aria-hidden="true" />

            {/* Header */}
            <header className="menu__header">
                <Link to="/" className="menu__back" prefetch="intent">
                    <span className="menu__back-arrow">←</span>
                    <span>{t('game.actions.quit')}</span>
                </Link>

                <Form className="menu__lang">
                    <button
                        type="submit"
                        name="lng"
                        value="en"
                        className={`menu__lang-btn ${currentLang === 'en' ? 'menu__lang-btn--active' : ''}`}
                    >
                        EN
                    </button>
                    <span className="menu__lang-sep" aria-hidden="true" />
                    <button
                        type="submit"
                        name="lng"
                        value="fr"
                        className={`menu__lang-btn ${currentLang === 'fr' ? 'menu__lang-btn--active' : ''}`}
                    >
                        FR
                    </button>
                </Form>
            </header>

            {/* Nav */}
            <nav className="menu__body" aria-label="Main menu">
                {NAV_ITEMS.map((item, i) => {
                    if (item.locked) {
                        return (
                            <div
                                key={item.key}
                                className="menu__item menu__item--locked"
                                aria-disabled="true"
                            >
                                <div className="menu__item-left">
                                    <span className="menu__item-number">{String(i + 1).padStart(2, '0')}</span>
                                    <span className="menu__item-label">
                                        {t(`game.actions.${item.key}`)}
                                    </span>
                                </div>
                                <span className="menu__item-badge">
                                    {t('game.actions.coming_soon')}
                                </span>
                            </div>
                        );
                    }

                    return (
                        <Link
                            key={item.key}
                            to={item.to}
                            className="menu__item group"
                            prefetch="intent"
                        >
                            <div className="menu__item-left">
                                <span className="menu__item-number">0{i + 1}</span>
                                <span className="menu__item-label">
                                    {t(`game.actions.${item.key}`)}
                                </span>
                            </div>
                            <span className="menu__item-arrow" aria-hidden="true">→</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <footer className="menu__footer">
                <span className="menu__version">v{APP_VERSION}</span>
            </footer>

        </main>
    );
}