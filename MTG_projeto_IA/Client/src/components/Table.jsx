import { socket } from "../socket";
import PlayerZone from "./PlayerZone";

export default function Table({ room }) {
  const playerId = localStorage.getItem("userId");

  const me = room.players.find(p => p.userId === playerId);
  const opponents = room.players.filter(p => p.userId !== playerId);

  return (
    <div>

      <h2>Turno: {room.turn.current}</h2>

      <div>
        {opponents.map(p => (
          <PlayerZone key={p.userId} player={p} />
        ))}
      </div>

      <PlayerZone player={me} isMe />

    </div>
  );
}