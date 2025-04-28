import React, { createContext, useEffect, useState } from "react";
import io from "socket.io-client";

export const SocketContext = createContext();

const SOCKET_SERVER_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5001";

export const SocketProvider = ({ token, children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!token) return;

    console.log("Connecting to socket at", SOCKET_SERVER_URL);
    const newSocket = io(SOCKET_SERVER_URL, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      console.log("Connected to socket", newSocket.id);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    setSocket(newSocket);

    return () => {
      console.log("Disconnecting socket");
      newSocket.disconnect();
    };
  }, [token]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};