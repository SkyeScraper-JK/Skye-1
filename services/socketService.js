let io;

export const initializeSocket = (socketIo) => {
  io = socketIo;
  
  io.on('connection', (socket) => {
    console.log('📱 Client connected:', socket.id);
    
    socket.on('authenticate', (data) => {
      if (data.userId) {
        socket.userId = data.userId;
        socket.join(`user_${data.userId}`);
        console.log(`👤 User ${data.userId} authenticated and joined room`);
      }
    });
    
    socket.on('disconnect', () => {
      console.log('📱 Client disconnected:', socket.id);
    });
  });
};

export const getIO = () => io;