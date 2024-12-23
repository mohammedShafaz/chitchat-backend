import { Server, Socket } from "socket.io";
import { IMessageData, IMediaData } from "../utils/types";
const waitingQueue: Socket[] = [];


export function initializeSocketEvents(io: Server): void {
    io.on('connection', (socket: Socket) => {
        console.log("A user connected: ", socket.id);

        socket.on('send-message', (data: IMessageData) => {
            try {
                const { receiverId, message } = data;
                io.to(receiverId).emit('receive-message', data);
            } catch (error) {
                console.error("Error in send-message event:", error);
                socket.emit('error', { message: 'Failed to send message' });
            }

        });

        socket.on('find-random-chat', () => {
            const peerSocket = waitingQueue.shift();

            if (peerSocket !== undefined) {
                const roomId = `room-${Date.now()}`;
                peerSocket.join(roomId);
                socket.join(roomId);
                peerSocket.emit('random-chat-ready', { roomId });
                socket.emit('random-chat-ready', { roomId });
                console.log(`Random chat room created: ${roomId} with users ${peerSocket.id} and ${socket.id}`);
            } else {
                waitingQueue.push(socket);
                console.log(`${socket.id} is waiting for a match`);
                socket.emit('waiting-for-match');
            }

        });
        socket.on('find-random-video', () => {
            const peerSocket = waitingQueue.shift();
            if (peerSocket !== undefined) {
                const roomId = `video-room-${Date.now()}`;
                peerSocket.join(roomId);
                socket.join(roomId);

                socket.emit('random-video-ready', { roomId });
                peerSocket.emit('random-video-ready', { roomId });
            } else {
                waitingQueue.push(socket);
                socket.emit('waiting-for-match', { message: "Waiting for another user to join..." });
            }

        });


        socket.on('share-media', (data: IMediaData) => {
            try {
                const { receiverId, mediaUrl } = data;
                io.to(receiverId).emit('receive-media', data)
            } catch (error) {
                console.error("Error in share-media event:", error);
                socket.emit('error', { message: 'Failed to share media' });
            }

        });

        socket.on('join-room', (roomId: string) => {
            try {
                socket.join(roomId);
                console.log(`User ${socket.id} joined room ${roomId}`);
            } catch (error) {
                console.error("Error in join-room event:", error);
                socket.emit('error', { message: 'Failed to join room' });
            }

        });

        socket.on('leave-room', (roomId: string) => {
            try {
                socket.leave(roomId);
                console.log(`User ${socket.id} left room ${roomId}`);
            } catch (error) {
                console.error("Error in leave-room event:", error);
                socket.emit('error', { message: 'Failed to leave room' });
            }
        });

        socket.on('send-group-message', (data) => {
            try {
                const { roomId, message } = data;

                io.to(roomId).emit('receive-group-message', data);
            } catch (error) {
                console.error("Error in send-group-message event:", error);
                socket.emit('error', { message: 'Failed to send group message' });
            }
        })

        socket.on('message-delivered', (messageId: string) => {
            try {
                io.emit('message-delivered', { messageId });
            } catch (error) {
                console.error("Error in message-delivered event:", error);
                socket.emit('error', { message: 'Failed to update message delivery status' });
            }
        });

        socket.on('message-seen', (messageId: string) => {
            try {
                io.emit('message-seen', { messageId });
            } catch (error) {
                console.error("Error in message-seen event:", error);
                socket.emit('error', { message: 'Failed to update message seen status' });
            }
        })

        socket.on('disconnect', () => {
            const index = waitingQueue.indexOf(socket);
            if (index !== -1) {
                waitingQueue.splice(index, 1);
            }
            socket.rooms.forEach((roomId) => {
                socket.leave(roomId);
                io.to(roomId).emit('peer-disconnected', { message: "Your peer has disconnected." });
            });
            console.log("User disconnected: ", socket.id);

        });

    });
}