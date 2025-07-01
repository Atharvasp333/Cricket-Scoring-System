import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

// Create the context
const SocketContext = createContext();

// Custom hook to use the socket context
export const useSocket = () => {
  return useContext(SocketContext);
};

// Provider component
export const SocketProvider = ({ children }) => {
  const SOCKET_URL = 'http://localhost:5000'; // Change port if needed
  
  // Initialize socket connection
  const [socket, setSocket] = useState(null);
  
  useEffect(() => {
    // Create socket connection
    const socketConnection = io(SOCKET_URL, { autoConnect: true });
    
    // Set socket in state
    setSocket(socketConnection);
    
    // Clean up on unmount
    return () => {
      if (socketConnection) {
        socketConnection.disconnect();
      }
    };
  }, []);
  
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};