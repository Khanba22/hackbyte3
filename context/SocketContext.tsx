"use client";

import { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:3001"; // Ensure this matches your Express server

// Create the context
const SocketContext = createContext<Socket | null>(null);

// Context Provider
export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Initialize Socket.io connection
    const socketInstance = io(SOCKET_SERVER_URL);

    socketInstance.on("connect", () => {
      console.log("✅ Connected to Socket.io Server:", socketInstance.id);
    });

    socketInstance.on("disconnect", () => {
      console.log("❌ Disconnected from Socket.io Server");
    });

    // Set the socket instance in state
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

// Custom hook to use socket anywhere in the app
export const useSocket = () => {
  return useContext(SocketContext);
};
