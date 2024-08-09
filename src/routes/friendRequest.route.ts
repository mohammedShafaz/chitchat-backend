import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import { validateParamsId } from "../middlewares/validatorMiddleware";
import friendsController from "../controllers/friend.controller";

class FriendRequestRoute {

    public router: Router

    constructor() {
        this.router = Router()
        this.routes();
    }
    private routes(): void {
        this.router.post('/send-request/:id', authMiddleware, validateParamsId, friendsController.sendFriendRequest);
        this.router.post('/accept-request/:id', authMiddleware, validateParamsId, friendsController.acceptFriendRequest);
        this.router.post('/decline-request/:id', authMiddleware, validateParamsId, friendsController.declineFriendRequest);
    }
}

export default new FriendRequestRoute().router;