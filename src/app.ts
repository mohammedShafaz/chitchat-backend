import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import routes from './routes';

export class App {

    private app: Express;
    private port: number;

    constructor() {
        dotenv.config();
        this.app = express();
        this.port = this.getPort();
        this.setupMiddleware();
        this.setupRoutes();
    }

    private getPort(): number {
        const portValue = process.env.PORT || '5001';
        const port = parseInt(portValue, 10);
        if (isNaN(port)) {
            throw new Error(`Invalid PORT value: ${port}`)
        }
        return port;
    }

    private setupMiddleware(): void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    private setupRoutes(): void {
        this.app.use('/api/v1',routes);
    }

    public start(): void {
        this.app.listen(this.port, () => {
            console.log(`Server is running at http://localhost:${this.port}`);
        })
    }
}