import { useEffect, useState } from "react";
import { socket } from "./socket";
import Table from "./components/Table";

export default function App() {
  const [room, setRoom] = useState(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let userId = localStorage.getItem("userId");

    if (!userId) {
      userId = crypto.randomUUID();
      localStorage.setItem("userId", userId);
    }

    socket.emit("joinRoom", {
      roomId: "test",
      userId,
      name: "Player"
    });

    socket.on("roomState", (data) => {
      if (data.version < version) return;

      setVersion(data.version);
      setRoom(data.state);
    });

  }, []);

  if (!room) return <div>Carregando...</div>;

  return <Table room={room} />;
}
