import { Request, Response } from "express";

 class UserController {

    public getUser(req: Request, res: Response): void {
        res.send("User fetched");
    }
    public createUser(req: Request, res: Response): void {
        res.send("User created")
    }
}
export default new UserController();