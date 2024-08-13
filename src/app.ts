import express, { Express, Request, Response } from 'express';
import routes from './routes';
import { BASE_PATH } from './utils/constants';
import config from './config/config';
import mongoose from 'mongoose';
import path from 'path';
import cors from 'cors';
import io from './socket';
import http from 'http';
import { initializeSocketEvents } from './socket/socketEvents';
export class App {

    private app: Express;
    private port: number;
    private server: http.Server;
    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.port = this.getPort();
        this.setupMiddleware();
        this.setupDatabase();
        this.setupRoutes();
        this.setupSocket();
    }

    private getPort(): number {
        const port = parseInt(config.port.toString(), 10);
        if (isNaN(port)) {
            throw new Error(`Invalid PORT value: ${port}`)
        }
        return port;
    }

    private setupMiddleware(): void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cors())
    }

    private setupDatabase(): void {
        mongoose.connect(config.db, {
            maxPoolSize: 10
        }).then(() => {
            console.log("Database connected successfully...")
        }).catch(err => console.error('Error connecting to MongoDB', err));
    }
    private setupRoutes(): void {
        this.app.use(BASE_PATH, routes);
        this.app.use('/assets', express.static(path.join(__dirname, 'assets')));
    }
    private setupSocket():void{
        io.attach(this.server);
        initializeSocketEvents(io);
    }
    
    public start(): void {
        this.server.listen(this.port, () => {
            console.log(`Server is running at http://localhost:${this.port}`);
        })
    }
}