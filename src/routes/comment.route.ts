import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import commentController from "../controllers/comment.controller";
import { validateComment, validateRemoveComment } from "../middlewares/validatorMiddleware";
class CommentRoutes{
    public router:Router
    constructor(){
        this.router=Router();
        this.routes()
    }
    private routes():void{
        this.router.post('/:id/create',authMiddleware,validateComment,commentController.createComment);
        this.router.delete('/:id',authMiddleware,validateRemoveComment,commentController.removeComment);
    }
}

export default new CommentRoutes().router;