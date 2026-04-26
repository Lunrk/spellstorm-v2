import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useRoomStore } from '~/game/store';
import { PhaserGame } from '~/game/.client/PhaserGame';

export default function Game() {
    const navigate = useNavigate();
    const room = useRoomStore((s) => s.room);

    useEffect(() => {
        if (!room) {
            navigate('/play', { replace: true });
        }
    }, [room, navigate]);

    if (!room) return null;

    return <PhaserGame />;
}