const locks = {};

export async function withLock(roomId, fn) {
  if (locks[roomId]) return;

  locks[roomId] = true;

  try {
    await fn();
  } finally {
    locks[roomId] = false;
  }
}