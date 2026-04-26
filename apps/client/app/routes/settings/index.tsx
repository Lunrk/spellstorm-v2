import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
    useSettingsStore,
    type Keybinds,
    type InputMode,
} from '~/game/settings.store';

const APP_VERSION = '0.1.0';

// Sections de la page settings — extensible
const SECTIONS = ['controls'] as const;
type Section = typeof SECTIONS[number];


// Actions keybind dans l'ordre d'affichage
const KEYBIND_ACTIONS: { action: keyof Keybinds }[] = [
    { action: 'move_up' },
    { action: 'move_down' },
    { action: 'move_left' },
    { action: 'move_right' },
];

const INPUT_MODES: { mode: InputMode; icon: string }[] = [
    { mode: 'keyboard', icon: '⌨' },
    { mode: 'mouse', icon: '⊕' },
];

export default function Settings() {
    const { t } = useTranslation();
    const { inputMode, keybinds, setInputMode, setKeybind, resetKeybinds } = useSettingsStore();

    const [activeSection, setActiveSection] = useState<Section>('controls');
    const [listening, setListening] = useState<keyof Keybinds | null>(null);

    // Écoute la touche pressée quand on est en mode "listening"
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (!listening) return;
            e.preventDefault();

            // Escape annule
            if (e.key === 'Escape') {
                setListening(null);
                return;
            }

            const key = e.key.toUpperCase();
            setKeybind(listening, key);
            setListening(null);
        },
        [listening, setKeybind],
    );

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    return (
        <main className="settings">

            <div className="settings__orbs" aria-hidden="true" />

            {/* Header */}
            <header className="settings__header">
                <Link to="/menu" className="settings__back" prefetch="intent">
                    <span className="settings__back-arrow">←</span>
                    <span>{t('game.actions.back')}</span>
                </Link>
            </header>

            {/* Body */}
            <div className="settings__body">

                {/* Nav sections */}
                <nav className="settings__nav" aria-label="Settings sections">
                    {SECTIONS.map((section) => (
                        <button
                            key={section}
                            type="button"
                            className={`settings__nav-item ${activeSection === section ? 'settings__nav-item--active' : ''}`}
                            onClick={() => setActiveSection(section)}
                        >
                            {t(`settings.sections.${section}`)}
                        </button>
                    ))}
                </nav>

                {/* Contenu */}
                <div className="settings__content">

                    {activeSection === 'controls' && (
                        <>
                            {/* Input mode */}
                            <div>
                                <h2 className="settings__section-title">
                                    {t('settings.input_mode.title')}
                                </h2>
                                <div className="settings__input-modes">
                                    {INPUT_MODES.map(({ mode, icon }) => (
                                        <button
                                            key={mode}
                                            type="button"
                                            className={`settings__input-mode ${inputMode === mode ? 'settings__input-mode--selected' : ''}`}
                                            onClick={() => setInputMode(mode)}
                                        >
                                            <span className="settings__input-mode-icon" aria-hidden="true">
                                                {icon}
                                            </span>
                                            <span className="settings__input-mode-label">
                                                {t(`settings.input_mode.${mode}`)}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Keybinds — affiché uniquement en mode clavier */}
                            {inputMode === 'keyboard' && (
                                <div>
                                    <h2 className="settings__section-title">
                                        {t('settings.keybinds.title')}
                                    </h2>
                                    <div className="settings__keybinds">
                                        {KEYBIND_ACTIONS.map(({ action }) => (
                                            <div key={action} className="settings__keybind">
                                                <span className="settings__keybind-label">
                                                    {t(`settings.keybinds.${action}`)}
                                                </span>
                                                <button
                                                    type="button"
                                                    className={`settings__keybind-key ${listening === action ? 'settings__keybind-key--listening' : ''}`}
                                                    onClick={() => setListening(listening === action ? null : action)}
                                                >
                                                    {listening === action ? '...' : keybinds[action]}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        className="settings__reset"
                                        onClick={resetKeybinds}
                                    >
                                        {t('settings.keybinds.reset')}
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                </div>
            </div>

            {/* Footer */}
            <footer className="settings__footer">
                <span className="settings__version">v{APP_VERSION}</span>
            </footer>

        </main>
    );
}