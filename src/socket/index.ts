import { Server } from "socket.io";
import { initializeSocketEvents } from "./socketEvents";


const io = new Server(
    {
        cors: {
            origin: "*",
            methods: ['GET', 'POST']
        }
    }
);


initializeSocketEvents(io);

export default io;