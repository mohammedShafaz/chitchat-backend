import { Router } from "express";
import UserController from "../controllers/user.controller";
import { validateUserRegistration, validateEmailVerification } from "../middlewares/validatorMiddleware";
import userController from "../controllers/user.controller";
class UserRoutes {
    public router: Router;
    constructor() {
        this.router = Router();
        this.routes();
    }
    private routes(): void {
        this.router.get("/login", UserController.userLogin);
        this.router.post("/register",validateUserRegistration, UserController.createUser);
        this.router.post("/verify-otp",validateEmailVerification,userController.userVerification)

    }
}

export default new UserRoutes().router;