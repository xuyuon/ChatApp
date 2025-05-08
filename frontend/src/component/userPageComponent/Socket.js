/**
 * Socket provider component
 * Establishes and manages a WebSocket connection using Socket.IO, wrapped at App.js
 */

import React, { createContext, useEffect, useState } from "react";
import io from "socket.io-client";

export const SocketContext = createContext();

const SOCKET_SERVER_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5001";

export const Socket = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    console.log("Connecting to socket at", SOCKET_SERVER_URL);
    const newSocket = io(SOCKET_SERVER_URL, {
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
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};