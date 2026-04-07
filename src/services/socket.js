import { io } from 'socket.io-client';

const SOCKET_URL = (typeof process !== 'undefined' && process.env.REACT_APP_API_URL) 
  ? process.env.REACT_APP_API_URL.replace(/\/api\/?$/, '') 
  : (import.meta.env && import.meta.env.VITE_API_URL 
      ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '') 
      : 'https://weather-back-rpdv.onrender.com');

let socket = null;

export const connectSocket = () => {
  if (socket?.connected) return socket;

  socket = io(SOCKET_URL, {
    transports: ['websocket', 'polling'],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  });

  socket.on('connect', () => {
    console.log('🔌 Socket connected:', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('❌ Socket disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error.message);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const joinZipRoom = (zipCode) => {
  if (socket?.connected && zipCode) {
    socket.emit('join-zip', zipCode);
  }
};

export const leaveZipRoom = (zipCode) => {
  if (socket?.connected && zipCode) {
    socket.emit('leave-zip', zipCode);
  }
};
