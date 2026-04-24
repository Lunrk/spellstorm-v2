import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useRoom } from '@colyseus/react';
import { colyseus } from '~/game/.client/cllient';

type LocationState = {
    roomId: string;
    sessionId: string;
} | null;

export default function Game() {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as LocationState;

    // Guard — pas de roomId = retour à /play
    useEffect(() => {
        if (!state?.roomId) {
            navigate('/play', { replace: true });
        }
    }, [state, navigate]);

    const { room, error, isConnecting } = useRoom(
        () => colyseus.joinById(state!.roomId),
        [state?.roomId],
    );

    if (!state?.roomId) return null;

    if (isConnecting) {
        return (
            <main className="game-debug">
                <p className="game-debug__status">Connecting to room <code>{state.roomId}</code>...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="game-debug">
                <p className="game-debug__status game-debug__status--error">
                    Error: {error.message}
                </p>
            </main>
        );
    }

    return (
        <main className="game-debug">
            <p className="game-debug__status game-debug__status--success">
                ✓ Connected to room <code>{room?.roomId}</code> — session <code>{room?.sessionId}</code>
            </p>
            <pre className="game-debug__state">
                {JSON.stringify(room?.state, null, 2)}
            </pre>
        </main>
    );
}