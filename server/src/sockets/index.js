import { Server } from 'socket.io';

let io;

export const initSocketServer = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    socket.on('join-room', (room) => {
      if (room) {
        socket.join(room);
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  });

  return io;
};

export const emitToUser = (userId, event, payload) => {
  if (io) {
    io.to(`user:${userId}`).emit(event, payload);
  }
};

export const emitToRole = (role, event, payload) => {
  if (io) {
    io.to(role).emit(event, payload);
  }
};

export default { initSocketServer, emitToUser, emitToRole };
