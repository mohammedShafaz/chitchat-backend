import { Router } from "express";
import userRoutes from "./user.router";
import postRoutes from "./post.router";
import commentRoutes from "./comment.route";
import friendRequestRoute from "./friendRequest.route";
class Routes {

    public router: Router;
    constructor() {
        this.router = Router();
        this.initializeRouter();
    }
    private initializeRouter(): void {
        this.router.get('/', (req, res) => { res.send("Welcome to chit-chat") })
        this.router.use('/user', userRoutes);
        this.router.use('/posts', postRoutes);
        this.router.use('/post/comment', commentRoutes);
        this.router.use('/user/friend', friendRequestRoute);
    }
}
export default new Routes().router;