import { Router } from "express";
import postController from "../controllers/post.controller";
import authMiddleware from "../middlewares/authMiddleware";
import upload from "../utils/fileUpload";

class PostRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes()
    }
    private routes(): void {
        this.router.post('/',authMiddleware,upload.array('media',10),postController.createPost);
    }

}

export default new PostRouter().router
