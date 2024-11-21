import { Server, Socket } from "socket.io";
import { IMessageData, IMediaData } from "../utils/types";


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
            console.log("User disconnected: ", socket.id);

        });

    });
}