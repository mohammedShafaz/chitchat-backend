import { Router } from "express";
import UserController from "../controllers/user.controller";
import { validateUserRegistration, validateEmailVerification, validateParamsId } from "../middlewares/validatorMiddleware";
import userController from "../controllers/user.controller";
import authMiddleware from "../middlewares/authMiddleware";
class UserRoutes {
    public router: Router;
    constructor() {
        this.router = Router();
        this.routes();
    }
    private routes(): void {
        this.router.get("/login", UserController.userLogin);
        this.router.post("/register", validateUserRegistration, UserController.createUser);
        this.router.get("/", authMiddleware, UserController.getCurrentUser);
        this.router.get("/:id", validateParamsId, UserController.getUserById);
        this.router.post('/follow/:id',authMiddleware,validateParamsId,userController.followUser);
        this .router.post('/unfollow/:id',authMiddleware,validateParamsId,userController.unFollowUser);
        this.router.post("/verify-otp", validateEmailVerification, userController.userVerification);
    }
}

export default new UserRoutes().router;