import { io } from "socket.io-client";

// Se estiver em produção, usa a URL do ambiente, senão usa localhost
//const URL = process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000";

export const socket = io();
