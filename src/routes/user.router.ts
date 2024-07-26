import { Router } from "express";
import UserController from "../controllers/user.controller";
import { validateUserRegistration } from "../middlewares/validatorMiddleware";
class UserRoutes {
    public router: Router;
    constructor() {
        this.router = Router();
        this.routes();
    }
    private routes(): void {
        this.router.get("/", UserController.getUser);
        this.router.post("/register",validateUserRegistration, UserController.createUser);


    }
}

export default new UserRoutes().router;