import express, { Express, Request, Response } from 'express';
import routes from './routes';
import { BASE_PATH } from './utils/constants';
import config from './config/config';
import mongoose from 'mongoose';
export class App {

    private app: Express;
    private port: number;

    constructor() {
        this.app = express();
        this.port = this.getPort();
        this.setupMiddleware();
        this.setupDatabase();
        this.setupRoutes();
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
    }

    public start(): void {
        this.app.listen(this.port, () => {
            console.log(`Server is running at http://localhost:${this.port}`);
        })
    }
}