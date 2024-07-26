import { Router } from "express";
import userRoutes from "./user.router";

class Routes {

    public router: Router;
    constructor() {
        this.router = Router();
        this.initializeRouter();
    }
    private initializeRouter(): void {
        this.router.use('/user', userRoutes)
    }
}
export default new Routes().router;