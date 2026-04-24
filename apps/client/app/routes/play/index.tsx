export const ssr = false;

import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import type { Difficulty } from '@spellstorm/types/difficulty';
import type { Mode } from '@spellstorm/types/mode';
import { colyseus } from '~/game/.client/client';
import { useRoomStore } from '~/game/.client/store';

const APP_VERSION = '0.1.0';

const DIFF_COLORS: Record<Difficulty, string> = {
    easy: 'oklch(0.72 0.18 150)',
    normal: 'oklch(0.72 0.18 210)',
    hard: 'oklch(0.72 0.20 55)',
    extreme: 'oklch(0.68 0.22 30)',
    demon: 'oklch(0.62 0.26 10)',
};

const DIFFICULTIES: Difficulty[] = ['easy', 'normal', 'hard', 'extreme', 'demon'];
const MODES: Mode[] = ['arcade'];

export default function Play() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const setRoom = useRoomStore((s) => s.setRoom);

    const [selectedMode, setSelectedMode] = useState<Mode>('arcade');
    const [selectedDiff, setSelectedDiff] = useState<Difficulty>('normal');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePlay = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const room = await colyseus.joinOrCreate('game_room', {
                mode: selectedMode,
                difficulty: selectedDiff,
            });

            setRoom(room);
            navigate('/game');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create room');
            setIsLoading(false);
        }
    };

    return (
        <main className="play">

            <div className="play__orbs" aria-hidden="true" />

            <header className="play__header">
                <Link to="/menu" className="play__back" prefetch="intent">
                    <span className="play__back-arrow">←</span>
                    <span>{t('game.actions.back')}</span>
                </Link>
            </header>

            <div className="play__body">

                {/* Colonne gauche — Mode */}
                <div className="play__col-mode">
                    <h2 className="play__section-label">
                        {t('game.actions.select_mode')}
                    </h2>
                    <div className="play__modes">
                        {MODES.map((mode) => (
                            <button
                                key={mode}
                                type="button"
                                className={`play__mode ${selectedMode === mode ? 'play__mode--selected' : ''}`}
                                onClick={() => setSelectedMode(mode)}
                            >
                                <span className="play__mode-dot" />
                                <span className="play__mode-content">
                                    <span className="play__mode-name">
                                        {t(`game.modes.${mode}.name`)}
                                    </span>
                                    <span className="play__mode-desc">
                                        {t(`game.modes.${mode}.description`)}
                                    </span>
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Colonne droite — Difficulté */}
                <div className="play__col-diff">
                    <h2 className="play__section-label">
                        {t('game.actions.select_difficulty')}
                    </h2>
                    <div className="play__difficulties">
                        {DIFFICULTIES.map((diff) => (
                            <button
                                key={diff}
                                type="button"
                                className={`play__diff ${selectedDiff === diff ? 'play__diff--selected' : ''}`}
                                style={{ '--diff-color': DIFF_COLORS[diff] } as React.CSSProperties}
                                onClick={() => setSelectedDiff(diff)}
                            >
                                <span className="play__diff-pip" />
                                <span className="play__diff-content">
                                    <span className="play__diff-name">
                                        {t(`game.difficulties.${diff}.name`)}
                                    </span>
                                    <span className="play__diff-desc">
                                        {t(`game.difficulties.${diff}.desc`)}
                                    </span>
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

            </div>

            <footer className="play__footer">
                <span className="play__version">
                    {error
                        ? <span style={{ color: 'var(--destructive)' }}>{error}</span>
                        : `v${APP_VERSION}`
                    }
                </span>
                <button
                    type="button"
                    className="play__cta"
                    onClick={handlePlay}
                    disabled={isLoading}
                >
                    <span>{isLoading ? t('game.actions.connecting') : t('game.actions.play_now')}</span>
                    {!isLoading && <span className="play__cta-arrow" aria-hidden="true">→</span>}
                </button>
            </footer>

        </main>
    );
}