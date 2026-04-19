import { socket } from "../socket";

export default function PlayerZone({ player, isMe }) {

  function playCard(cardId) {
    socket.emit("playCard", {
      roomId: "test",
      userId: player.userId,
      cardId
    });
  }

  return (
    <div style={{ border: "1px solid white", margin: 10, padding: 10 }}>

      <div>{player.name} ❤️ {player.life}</div>

      {isMe && (
        <div>
          {player.hand.map(card => (
            <button key={card.id} onClick={() => playCard(card.id)}>
              {card.name}
            </button>
          ))}
        </div>
      )}

    </div>
  );
}
