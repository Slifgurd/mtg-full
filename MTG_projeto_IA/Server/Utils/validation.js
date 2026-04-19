export function validatePlayCard(room, player, cardId) {
  if (!player) throw new Error("Jogador inválido");

  if (room.turn.current !== player.userId) {
    throw new Error("Não é seu turno");
  }

  if (room.priority.current !== player.userId) {
    throw new Error("Sem prioridade");
  }

  const card = player.hand.find(c => c.id === cardId);

  if (!card) throw new Error("Carta não está na mão");

  if (player.mana < (card.cost || 0)) {
    throw new Error("Mana insuficiente");
  }
}