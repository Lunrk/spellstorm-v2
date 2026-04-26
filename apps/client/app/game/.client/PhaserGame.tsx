import { useLayoutEffect, useRef } from 'react';
import { GameManager } from './GameManager';

export function PhaserGame() {
    const containerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!containerRef.current) return;

        GameManager.start(containerRef.current);

        return () => {
            if (GameManager.isActive) {
                GameManager.destroy();
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{ width: '100vw', height: '100dvh', overflow: 'hidden' }}
        />
    );
}