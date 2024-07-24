import { Router } from "express";
import UserController from "../controllers/user.controller";

class UserRoutes {
    public router: Router;
    constructor() {
        this.router = Router();
        this.routes();
    }
    private routes(): void {
        this.router.get("/user", UserController.getUser);
        this.router.post("/user", UserController.createUser);


    }
}

export default new UserRoutes().router;