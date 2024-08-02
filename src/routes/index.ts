import { Router } from "express";
import userRoutes from "./user.router";
import postRouter from "./post.router";

class Routes {

    public router: Router;
    constructor() {
        this.router = Router();
        this.initializeRouter();
    }
    private initializeRouter(): void {
        this.router.get('/', (req, res) => { res.send("Welcome to chit-chat") })
        this.router.use('/user', userRoutes);
        this.router.use('/posts', postRouter)
    }
}
export default new Routes().router;