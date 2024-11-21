import { Router } from "express";
import postController from "../controllers/post.controller";
import authMiddleware from "../middlewares/authMiddleware";
import upload from "../utils/fileUpload";
import { validateParamsId } from "../middlewares/validatorMiddleware";


class PostRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes()
    }
    private routes(): void {
        this.router.post('/',authMiddleware,upload.array('media',10),postController.createPost);
        this.router.get('/:id',validateParamsId,postController.getPost);
        this.router.delete('/:id',authMiddleware,validateParamsId,postController.removePost);
        this.router.post('/:id/like',authMiddleware,validateParamsId,postController.likePost);
        this.router.post('/:id/unlike',authMiddleware,validateParamsId,postController.unlikePost);
    }

}

export default new PostRoutes().router;
