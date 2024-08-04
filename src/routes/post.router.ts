import { Router } from "express";
import postController from "../controllers/post.controller";
import authMiddleware from "../middlewares/authMiddleware";
import upload from "../utils/fileUpload";
import { validateParamsId } from "../middlewares/validatorMiddleware";


class PostRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes()
    }
    private routes(): void {
        this.router.post('/',authMiddleware,upload.array('media',10),postController.createPost);
        this.router.get('/:id',validateParamsId,postController.getPost);
    }

}

export default new PostRouter().router
