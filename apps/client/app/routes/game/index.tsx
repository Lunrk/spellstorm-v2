export const ssr = false;

import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useRoomStore } from '~/game/.client/store';

export default function Game() {
    const navigate = useNavigate();
    const room = useRoomStore((s) => s.room);

    // Guard — pas de room = retour à /play
    useEffect(() => {
        if (!room) {
            navigate('/play', { replace: true });
        }
    }, [room, navigate]);

    if (!room) return null;

    return (
        <main className="game-debug">
            <p className="game-debug__status game-debug__status--success">
                ✓ Connected to room <code>{room.roomId}</code> — session <code>{room.sessionId}</code>
            </p>
            <pre className="game-debug__state">
                {JSON.stringify(room.state, null, 2)}
            </pre>
        </main>
    );
}